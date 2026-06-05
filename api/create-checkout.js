export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { priceId, userId, userEmail, plan } = req.body

  if (!priceId || !userId || !userEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const appUrl = process.env.VITE_APP_URL || 'https://book-recommender-git-main-danny-driscoll-s-projects.vercel.app'

  try {
    // Use Stripe REST API directly — no package needed
    const params = new URLSearchParams({
      mode: 'subscription',
      'payment_method_types[0]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      customer_email: userEmail,
      client_reference_id: userId,
      'metadata[userId]': userId,
      'metadata[plan]': plan,
      'subscription_data[metadata][userId]': userId,
      'subscription_data[metadata][plan]': plan,
      success_url: `${appUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: appUrl,
    })

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await response.json()

    if (!response.ok) {
      console.error('Stripe error:', session)
      return res.status(400).json({ error: session.error?.message || 'Stripe error' })
    }

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    res.status(500).json({ error: err.message })
  }
}
