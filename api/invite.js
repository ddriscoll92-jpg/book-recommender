export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Verify the caller is a signed-in user via their JWT
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised' })
  }
  const jwt = authHeader.replace('Bearer ', '')

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Validate the JWT by fetching the user
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${jwt}` },
  })
  if (!userRes.ok) return res.status(401).json({ error: 'Invalid session' })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

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
      return res.status(400).json({ error: data.message || data.error || 'Failed to send invite' })
    }

    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
