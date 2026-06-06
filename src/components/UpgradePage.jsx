import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function StripeCheckoutButton({ plan, label, style }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Please sign in first.'); setLoading(false); return }
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PRICES[plan],
          userId: user.id,
          userEmail: user.email,
          plan,
        }),
      })
      const data = await res.json()
      console.log('Checkout response:', res.status, data)
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || `Checkout failed (${res.status})`)
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const isOutline = style === 'outline'
  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}
        style={{ width: '100%', height: 46, background: isOutline ? 'transparent' : GREEN, color: isOutline ? GREEN : LIGHT_GREEN, border: isOutline ? `1.5px solid ${GREEN}` : 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: loading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
        {loading ? '⏳ Redirecting to checkout...' : label}
      </button>
      {error && <div style={{ fontSize: 12, color: '#A32D2D', marginTop: 6, textAlign: 'center' }}>{error}</div>}
    </div>
  )
}

// ── Upgrade Page ─────────────────────────────────────────────────────────────

export function UpgradeSuccessPage({ onNavigate }) {
  useEffect(() => {
    // Reload profile to get new plan
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from('profiles').select('plan').eq('id', user.id).single()
        .then(() => {})
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 500, color: TEXT, marginBottom: 12 }}>
          Welcome to TeachReads Pro!
        </h1>
        <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 32 }}>
          Your subscription is now active. You now have full access to all features. Happy planning!
        </p>
        <button onClick={() => onNavigate('search')}
          style={{ height: 48, padding: '0 32px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Start planning →
        </button>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 16 }}>
          A confirmation email has been sent by Stripe. Manage your subscription at any time from Profile & settings.
        </p>
      </div>
    </div>
  )
}

// ── Stripe Checkout Button ────────────────────────────────────────────────────
const STRIPE_PRICES = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1TeyTtLDd6xSXwi01VHyNRy6',
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TeyUKLDd6xSXwi0ImE2F0su',
}

export function UpgradePage({ onNavigate, trialInfo }) {
  const usage = trialInfo?.usage || {}
  const currentPlan = trialInfo?.plan || 'trial'
  const expired = trialInfo?.expired
  const daysLeft = trialInfo?.daysLeft || 0

  const usageRows = [
    { label: 'Book searches', key: 'book_searches', limit: TRIAL_LIMITS.book_searches },
    { label: 'Load more results', key: 'load_mores', limit: TRIAL_LIMITS.load_mores },
    { label: 'Lesson ideas', key: 'lesson_ideas', limit: TRIAL_LIMITS.lesson_ideas },
    { label: 'Units of work', key: 'units_of_work', limit: TRIAL_LIMITS.units_of_work },
    { label: 'Resources generated', key: 'resources', limit: TRIAL_LIMITS.resources },
  ]

  const planOptions = [
    {
      id: 'basic',
      name: 'Basic',
      price: '£4.99',
      period: 'month',
      features: [
        '30 book searches/month',
        '20 units of work/month',
        '40 resources/month',
        'Up to 50 library books',
        'PDF downloads',
        'Community star ratings',
        'Email support',
      ],
      color: GREEN,
      bg: LIGHT_GREEN,
      textColor: '#085041',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '£9.99',
      period: 'month',
      features: [
        'Unlimited book searches',
        'Unlimited units of work',
        'Unlimited resources',
        'Unlimited library books',
        'PDF, Word & Text downloads',
        'Community star ratings',
        'Priority support',
        'Early access to new features',
      ],
      color: '#534AB7',
      bg: '#EEF2FF',
      textColor: '#3730A3',
      popular: true,
    },
  ]

  function getPlanAction(planId) {
    if (currentPlan === planId) return 'current'
    if (currentPlan === 'premium' && planId === 'basic') return 'downgrade'
    if (currentPlan === 'trial' || currentPlan === 'basic') return 'upgrade'
    return 'upgrade'
  }

  return (
    <div style={{ ...s.page, maxWidth: '100%', minHeight: '100vh', background: PAGE_BG }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 500, color: TEXT, marginBottom: 8 }}>Plan options</h1>
          <p style={{ fontSize: 15, color: MUTED }}>
            {currentPlan === 'trial' && !expired && `You have ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left on your free trial`}
            {currentPlan === 'trial' && expired && 'Your free trial has expired'}
            {currentPlan === 'basic' && 'You are currently on the Basic plan'}
            {currentPlan === 'premium' && 'You are currently on the Premium plan'}
          </p>
        </div>

        {/* Trial usage — only show for trial users */}
        {currentPlan === 'trial' && (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Your trial usage</div>
            {usageRows.map(row => {
              const used = usage[row.key] || 0
              const pct = Math.min(100, Math.round((used / row.limit) * 100))
              const full = used >= row.limit
              return (
                <div key={row.key} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: TEXT }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: full ? '#A32D2D' : MUTED, fontWeight: full ? 600 : 400 }}>{used} / {row.limit}</span>
                  </div>
                  <div style={{ height: 5, background: PAGE_BG, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: full ? '#A32D2D' : GREEN, borderRadius: 10 }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '2rem' }}>
          {planOptions.map(plan => {
            const action = getPlanAction(plan.id)
            const isCurrent = action === 'current'
            const isDowngrade = action === 'downgrade'
            return (
              <div key={plan.id} style={{ background: isCurrent ? plan.bg : BG, border: `${isCurrent ? 2 : 0.5}px solid ${isCurrent ? plan.color : BORDER}`, borderRadius: 14, padding: '1.5rem', position: 'relative' }}>
                {plan.popular && !isCurrent && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: plan.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Most popular</div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: plan.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current plan</div>
                )}
                <div style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 500, color: TEXT, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, color: TEXT }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>/ {plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: plan.color, fontSize: 13, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13, color: TEXT }}>{f}</span>
                    </div>
                  ))}
                </div>
                {isCurrent ? (
                  <div style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: plan.bg, border: `1px solid ${plan.color}`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: plan.color }}>
                    ✓ Current plan
                  </div>
                ) : isDowngrade ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>To downgrade, cancel your current subscription in Stripe and subscribe to Basic.</div>
                    <StripeCheckoutButton plan={plan.id} label={`Switch to ${plan.name}`} style="outline" />
                  </div>
                ) : (
                  <StripeCheckoutButton plan={plan.id} label={`Upgrade to ${plan.name} →`} />
                )}
              </div>
            )
          })}
        </div>

        <button onClick={() => onNavigate('search')}
          style={{ width: '100%', height: 40, background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 10, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          ← Back to TeachReads
        </button>

        <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 14 }}>
          Questions? Email us at <span style={{ color: GREEN }}>dd.driscoll92@gmail.com</span>
        </p>
      </div>
    </div>
  )
}

// ── Contact Modal ────────────────────────────────────────────────────────────

