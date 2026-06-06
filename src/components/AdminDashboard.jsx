import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function AdminDashboard({ onNavigate, userEmail }) {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    const [{ data: profiles }, { data: usageCounts }, { data: plans }, { data: resources }] = await Promise.all([
      supabase.from('profiles').select('id, plan, trial_expires_at, display_name, created_at'),
      supabase.from('usage_counts').select('*'),
      supabase.from('plans').select('id, created_at, subject'),
      supabase.from('resources').select('id, created_at, resource_type'),
    ])
    const now = new Date()
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const planCounts = { trial: 0, basic: 0, premium: 0, expired: 0 }
    ;(profiles || []).forEach(p => {
      if (p.plan === 'premium') planCounts.premium++
      else if (p.plan === 'basic') planCounts.basic++
      else if (p.trial_expires_at && new Date(p.trial_expires_at) < now) planCounts.expired++
      else planCounts.trial++
    })
    const totalUsage = (usageCounts || []).reduce((acc, u) => ({
      book_searches: acc.book_searches + (u.book_searches || 0),
      units_of_work: acc.units_of_work + (u.units_of_work || 0),
      resources: acc.resources + (u.resources || 0),
    }), { book_searches: 0, units_of_work: 0, resources: 0 })
    const apiCost = (totalUsage.book_searches * 0.0044) + (totalUsage.units_of_work * 0.0068) + (totalUsage.resources * 0.0030)
    const revenue = (planCounts.basic * 4.99) + (planCounts.premium * 9.99)
    setStats({
      totalUsers: (profiles || []).length,
      newThisWeek: (profiles || []).filter(p => new Date(p.created_at) > weekAgo).length,
      planCounts, totalPlans: (plans || []).length,
      totalResources: (resources || []).length,
      plansThisWeek: (plans || []).filter(p => new Date(p.created_at) > weekAgo).length,
      resourcesThisWeek: (resources || []).filter(r => new Date(r.created_at) > weekAgo).length,
      apiCost: apiCost.toFixed(2), revenue: revenue.toFixed(2), totalUsage,
    })
    setUsers((profiles || []).map(p => {
      const usage = (usageCounts || []).find(u => u.user_id === p.id) || {}
      const expired = p.plan === 'trial' && p.trial_expires_at && new Date(p.trial_expires_at) < now
      const daysLeft = p.plan === 'trial' ? Math.max(0, Math.ceil((new Date(p.trial_expires_at) - now) / (1000*60*60*24))) : null
      return { ...p, usage, expired, daysLeft }
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    setLoading(false)
  }

  if (userEmail !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PAGE_BG }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 16, color: TEXT }}>Admin access only</div>
          <button onClick={() => onNavigate('search')} style={{ marginTop: 16, height: 36, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
        </div>
      </div>
    )
  }

  const planBadge = (plan, expired) => {
    if (expired) return { bg: '#FCEBEB', color: '#A32D2D', label: 'Expired' }
    if (plan === 'premium') return { bg: '#EEF2FF', color: '#3730A3', label: 'Premium' }
    if (plan === 'basic') return { bg: LIGHT_GREEN, color: '#085041', label: 'Basic' }
    return { bg: '#FEF3C7', color: '#92400E', label: 'Trial' }
  }

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: NAVY, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: GREEN, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📊</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: '#fff' }}>TeachReads Admin</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadStats} style={{ height: 32, padding: '0 14px', background: 'transparent', border: `0.5px solid ${NAVY_LIGHT}`, borderRadius: 7, fontSize: 12, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>↺ Refresh</button>
          <button onClick={() => onNavigate('search')} style={{ height: 32, padding: '0 14px', background: 'transparent', border: `0.5px solid ${NAVY_LIGHT}`, borderRadius: 7, fontSize: 12, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>← App</button>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: MUTED }}>Loading stats...</div> : stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Total users', value: stats.totalUsers, sub: `+${stats.newThisWeek} this week` },
                { label: 'Monthly revenue', value: `£${stats.revenue}`, sub: `${stats.planCounts.basic} Basic · ${stats.planCounts.premium} Premium` },
                { label: 'API costs (all time)', value: `£${stats.apiCost}`, sub: `${stats.totalUsage.book_searches} searches` },
                { label: 'Plans created', value: stats.totalPlans, sub: `+${stats.plansThisWeek} this week` },
              ].map((card, i) => (
                <div key={i} style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: TEXT, marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{card.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: `0.5px solid ${BORDER}` }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>All users ({users.length})</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: PAGE_BG }}>
                      {['Name', 'Plan', 'Trial', 'Searches', 'Units', 'Resources', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 500, color: MUTED, borderBottom: `0.5px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => {
                      const badge = planBadge(user.plan, user.expired)
                      return (
                        <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? `0.5px solid ${BORDER}` : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '10px 14px', color: TEXT, fontWeight: 500 }}>{user.display_name || '—'}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{badge.label}</span></td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{user.plan === 'trial' ? (user.expired ? 'Expired' : `${user.daysLeft}d left`) : '—'}</td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{user.usage.book_searches || 0}</td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{user.usage.units_of_work || 0}</td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{user.usage.resources || 0}</td>
                          <td style={{ padding: '10px 14px', color: MUTED, whiteSpace: 'nowrap' }}>{new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Auth Page ─────────────────────────────────────────────────────────────────

