export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  try {
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(400).json({ error: err.message || 'Could not delete user' })
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Delete user error:', err)
    res.status(500).json({ error: err.message })
  }
}
