export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { customerId } = req.body
  if (!customerId) return res.status(400).json({ error: 'Missing customerId' })

  const appUrl = process.env.VITE_APP_URL || 'https://book-recommender-git-main-danny-driscoll-s-projects.vercel.app'

  try {
    const params = new URLSearchParams({
      customer: customerId,
      return_url: appUrl,
    })

    const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await response.json()

    if (!response.ok) {
      console.error('Portal error:', session)
      return res.status(400).json({ error: session.error?.message || 'Could not open billing portal' })
    }

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Portal error:', err)
    res.status(500).json({ error: err.message })
  }
}
