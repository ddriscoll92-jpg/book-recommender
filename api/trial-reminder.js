import { sendTrialEndingEmail } from './email-helpers.js'

// Triggered daily by Vercel Cron (see vercel.json).
// Finds trial users whose trial expires in 2 days, 1 day, or today,
// and sends a reminder email (once per day-bucket, tracked via trial_reminder_sent_for).
export default async function handler(req, res) {
  // Verify this is Vercel Cron (or has the cron secret)
  const authHeader = req.headers['authorization']
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    // Fetch all trial users with a trial_expires_at set
    const profilesRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?plan=eq.trial&trial_expires_at=not.is.null&select=id,display_name,trial_expires_at,trial_reminder_sent_for`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    )
    const profiles = await profilesRes.json()
    if (!Array.isArray(profiles)) {
      console.error('trial-reminder: unexpected profiles response', profiles)
      return res.status(500).json({ error: 'Failed to load profiles' })
    }

    const now = new Date()
    const results = []

    for (const profile of profiles) {
      const expires = new Date(profile.trial_expires_at)
      const msLeft = expires.getTime() - now.getTime()
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))

      // Only send for 2 days left, 1 day left, or 0 days left (expires today)
      if (![0, 1, 2].includes(daysLeft)) continue

      const bucket = `days_${daysLeft}`
      if (profile.trial_reminder_sent_for === bucket) continue // already sent for this bucket

      // Look up email via Supabase Admin API
      const userRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${profile.id}`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
      })
      const userData = await userRes.json()
      const email = userData?.email
      if (!email) continue

      await sendTrialEndingEmail(email, profile.display_name || '', daysLeft)

      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${profile.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ trial_reminder_sent_for: bucket }),
      })

      results.push({ userId: profile.id, daysLeft })
    }

    res.status(200).json({ checked: profiles.length, sent: results.length, results })
  } catch (err) {
    console.error('trial-reminder error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
