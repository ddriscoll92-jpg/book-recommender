export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let event
  try {
    const body = await new Promise((resolve) => {
      let data = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => resolve(data))
    })
    event = JSON.parse(body)
  } catch (err) {
    // If req.on doesn't work, try reading body directly
    try {
      event = req.body
    } catch(e) {
      return res.status(400).json({ error: 'Could not parse body' })
    }
  }

  if (!event || !event.type) {
    return res.status(400).json({ error: 'Invalid event' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Webhook event:', event.type, 'supabaseUrl:', !!supabaseUrl, 'supabaseKey:', !!supabaseKey)

  async function updateProfile(userId, data) {
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(data),
    })
    console.log('updateProfile response:', response.status)
    return response
  }

  async function getSubscription(subId) {
    const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    })
    return res.json()
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id || session.metadata?.userId
        const plan = session.metadata?.plan
        console.log('checkout.session.completed userId:', userId, 'plan:', plan)
        if (userId && plan) {
          await updateProfile(userId, {
            plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          const sub = await getSubscription(subId)
          const userId = sub.metadata?.userId
          const plan = sub.metadata?.plan
          if (userId) await updateProfile(userId, { plan })
        }
        break
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object
        const subId = obj.subscription || obj.id
        if (subId) {
          const sub = await getSubscription(subId)
          const userId = sub.metadata?.userId
          if (userId) await updateProfile(userId, { plan: 'trial' })
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const userId = sub.metadata?.userId
        const plan = sub.metadata?.plan
        if (userId && plan) await updateProfile(userId, { plan })
        break
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
