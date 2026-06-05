const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key — bypasses RLS
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id || session.metadata?.userId
        const plan = session.metadata?.plan
        if (userId && plan) {
          await supabase.from('profiles').update({
            plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          }).eq('id', userId)
          console.log(`Upgraded user ${userId} to ${plan}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.userId
          const plan = sub.metadata?.plan
          if (userId) {
            await supabase.from('profiles').update({ plan }).eq('id', userId)
            // Reset monthly usage on successful renewal
            await supabase.from('usage_counts').upsert({
              user_id: userId,
              book_searches: 0, load_mores: 0, lesson_ideas: 0,
              units_of_work: 0, resources: 0,
              reset_at: new Date().toISOString(),
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object
        const subId = obj.subscription || obj.id
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.userId
          if (userId) {
            await supabase.from('profiles').update({ plan: 'trial' }).eq('id', userId)
            console.log(`Downgraded user ${userId} to trial (payment failed/cancelled)`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const userId = sub.metadata?.userId
        const plan = sub.metadata?.plan
        if (userId && plan) {
          await supabase.from('profiles').update({ plan }).eq('id', userId)
        }
        break
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    res.status(500).json({ error: err.message })
  }
}
