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

  // Validate JWT and get the user - they can only delete their own account
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${jwt}` },
  })
  if (!userRes.ok) return res.status(401).json({ error: 'Invalid session' })
  const { id: authenticatedUserId } = await userRes.json()

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  // Only allow users to delete their own account
  if (userId !== authenticatedUserId) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(400).json({ error: err.message || 'Could not delete user' })
    }

    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
