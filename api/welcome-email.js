import { sendWelcomeEmail } from './email-helpers.js'

// Triggered by a Supabase Database Webhook on auth.users (UPDATE event),
// configured to fire when email_confirmed_at changes from null to a timestamp.
//
// Supabase webhook payload shape: { type, table, record, old_record, schema }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Optional shared-secret check to prevent unauthorised calls
  const secret = process.env.SUPABASE_WEBHOOK_SECRET
  if (secret && req.headers['x-webhook-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { record, old_record } = req.body || {}
  if (!record) return res.status(400).json({ error: 'Missing record' })

  const wasUnconfirmed = !old_record?.email_confirmed_at
  const nowConfirmed = !!record.email_confirmed_at
  if (!(wasUnconfirmed && nowConfirmed)) {
    // Not a fresh verification — ignore (e.g. other profile updates)
    return res.status(200).json({ skipped: true })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    // Guard against duplicate sends using a flag on the profiles table
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${record.id}&select=welcome_email_sent,display_name`, {
      headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    })
    const profiles = await profileRes.json()
    const profile = Array.isArray(profiles) ? profiles[0] : null

    if (profile?.welcome_email_sent) {
      return res.status(200).json({ skipped: true, reason: 'already sent' })
    }

    await sendWelcomeEmail(record.email, profile?.display_name || '')

    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${record.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: record.id, welcome_email_sent: true }),
    })

    res.status(200).json({ sent: true })
  } catch (err) {
    console.error('welcome-email error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
