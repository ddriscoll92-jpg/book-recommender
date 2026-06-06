import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export default function NavBar({ currentPage, onNavigate, userName, userEmail, onOpenProfile, avatarUrl, trialInfo }) {
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = [
    { id: 'search', label: 'Book Recommender', active: true },
    { id: 'plans', label: 'My Plans', active: true },
    { id: 'books', label: 'My Books', active: true },
    { id: 'resources', label: 'My Resources', active: true },
  ]

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: NAVY, borderBottom: `1px solid ${NAVY_LIGHT}`, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, background: GREEN, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📚</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>TeachReads</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => item.active ? onNavigate(item.id) : null}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: 'none',
              background: currentPage === item.id ? NAVY_LIGHT : 'transparent',
              color: item.active ? (currentPage === item.id ? '#FFFFFF' : NAVY_MUTED) : NAVY_LIGHT,
              fontSize: 13,
              fontWeight: 500,
              cursor: item.active ? 'pointer' : 'default',
              fontFamily: "'DM Sans', sans-serif",
              position: 'relative',
            }}
          >
            {item.label}
            {!item.active && (
              <span style={{ marginLeft: 5, fontSize: 9, background: NAVY_LIGHT, color: NAVY_MUTED, padding: '1px 5px', borderRadius: 10, verticalAlign: 'middle', fontWeight: 500 }}>Soon</span>
            )}
          </button>
        ))}
      </div>

      {/* Profile */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          onClick={() => setProfileOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, background: profileOpen ? NAVY_LIGHT : 'transparent' }}
        >
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', flexShrink: 0 }}>
            {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : (userName || 'T')[0].toUpperCase()}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#FFFFFF' }}>{userName || 'Teacher'}</div>
            {trialInfo?.plan === 'trial' && !trialInfo?.expired && (
              <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600 }}>
                {trialInfo.daysLeft === 0 ? 'Trial expires today' : `${trialInfo.daysLeft}d trial left`}
              </div>
            )}
            {trialInfo?.expired && (
              <div style={{ fontSize: 10, color: '#F87171', fontWeight: 600, cursor: 'pointer' }} onClick={() => onNavigate('upgrade')}>Trial expired</div>
            )}
            {trialInfo?.plan === 'basic' && (
              <div style={{ fontSize: 10, color: '#34D399', fontWeight: 500 }}>Basic plan</div>
            )}
            {trialInfo?.plan === 'premium' && (
              <div style={{ fontSize: 10, color: '#34D399', fontWeight: 500 }}>Premium plan</div>
            )}
            {!trialInfo && (
              <div style={{ fontSize: 11, color: NAVY_MUTED }}>{ userEmail?.split('@')[1] || 'Teacher' }</div>
            )}
          </div>
          <span style={{ fontSize: 11, color: NAVY_MUTED, marginLeft: 2 }}>▼</span>
        </div>

        {/* Dropdown */}
        {profileOpen && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 210, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 200 }}>
            <div style={{ padding: '12px 14px', borderBottom: `0.5px solid ${BORDER}`, background: PAGE_BG }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{userName || 'Teacher'}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{userEmail}</div>
            </div>
            {[
              { label: '👤  Profile & settings', note: '', dest: 'profile' },
              { label: '⭐  Plan options', note: '', dest: 'upgrade' },
              ...(userEmail === ADMIN_EMAIL ? [{ label: '📊  Admin dashboard', note: '', dest: 'admin' }] : []),
              { label: '📋  Privacy & Terms', note: '', dest: 'legal' },
              { label: '✉️  Contact us', note: '', dest: 'contact' },
              { label: '🚪  Sign Out', note: '', dest: 'signout' },
            ].map((item, i) => (
              <div key={i}
                onClick={() => { if (item.dest === 'profile') { setProfileOpen(false); onOpenProfile && onOpenProfile() } else if (item.dest === 'legal') { setProfileOpen(false); onNavigate('legal') } else if (item.dest) { setProfileOpen(false); onNavigate(item.dest) } }}
                style={{ padding: '10px 14px', fontSize: 13, color: i === 3 ? '#A32D2D' : TEXT, cursor: item.dest ? 'pointer' : 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: i === 3 ? `0.5px solid ${BORDER}` : 'none' }}
                onMouseEnter={e => { if (item.dest) e.currentTarget.style.background = PAGE_BG }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.label}
                {item.note && <span style={{ fontSize: 10, color: MUTED, background: PAGE_BG, padding: '2px 6px', borderRadius: 10 }}>{item.note}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Book Detail Page ──────────────────────────────────────────────────────────

