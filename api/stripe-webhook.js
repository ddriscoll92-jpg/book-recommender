export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Read raw body
  const body = await new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => data += chunk)
    req.on('end', () => resolve(data))
  })

  // Verify Stripe signature
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (webhookSecret && sig) {
    try {
      const encoder = new TextEncoder()
      const parts = sig.split(',')
      const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1]
      const signatures = parts.filter(p => p.startsWith('v1=')).map(p => p.split('=')[1])

      // Check timestamp is within 5 minutes
      if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) {
        return res.status(400).json({ error: 'Timestamp too old' })
      }

      const signedPayload = `${timestamp}.${body}`
      const key = await crypto.subtle.importKey(
        'raw', encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['sign']
      )
      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
      const expectedSig = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0')).join('')

      if (!signatures.includes(expectedSig)) {
        console.error('Signature mismatch')
        return res.status(400).json({ error: 'Invalid signature' })
      }
    } catch (err) {
      console.error('Signature verification error:', err.message)
      return res.status(400).json({ error: 'Signature verification failed' })
    }
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  if (!event?.type) return res.status(400).json({ error: 'Invalid event' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  async function updateProfile(userId, data) {
    const r = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(data),
    })
    console.log('updateProfile:', userId, data, r.status)
  }

  async function resetUsage(userId) {
    await fetch(`${supabaseUrl}/rest/v1/usage_counts?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        book_searches: 0, load_mores: 0, lesson_ideas: 0,
        units_of_work: 0, resources: 0,
        reset_at: new Date().toISOString(),
      }),
    })
  }

  async function getSubscription(subId) {
    const r = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    })
    return r.json()
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id || session.metadata?.userId
        const plan = session.metadata?.plan
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
        if (invoice.subscription) {
          const sub = await getSubscription(invoice.subscription)
          const userId = sub.metadata?.userId
          const plan = sub.metadata?.plan
          if (userId) { await updateProfile(userId, { plan }); await resetUsage(userId) }
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
        if (sub.metadata?.userId && sub.metadata?.plan) {
          await updateProfile(sub.metadata.userId, { plan: sub.metadata.plan })
        }
        break
      }
    }
    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
