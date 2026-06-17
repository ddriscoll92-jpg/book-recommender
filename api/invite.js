export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Invite error:', data)
      return res.status(400).json({ error: data.message || data.error || 'Failed to send invite' })
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Invite error:', err)
    res.status(500).json({ error: err.message })
  }
}
