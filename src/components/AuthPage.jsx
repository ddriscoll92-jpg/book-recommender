import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function ContactModal({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!name || !email || !message) { setError('Please fill in all required fields.'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSent(true)
    } catch(e) {
      setError(e.message || 'Something went wrong. Please email us directly.')
    }
    setSending(false)
  }

  const inputStyle = { width: '100%', height: 40, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 12px', fontSize: 13, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  const labelStyle = { fontSize: 12, fontWeight: 500, color: MUTED, display: 'block', marginBottom: 5 }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: TEXT }}>Contact us</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>We typically reply within 2 working days</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 8 }}>Message ready to send</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Your message has been sent. We will get back to you within 2 working days at <span style={{ color: GREEN }}>{email}</span></p>
              <button onClick={onClose} style={{ marginTop: 16, height: 36, padding: '0 16px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Close</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Your name *</label><input style={inputStyle} placeholder="Sarah Jones" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label style={labelStyle}>Email address *</label><input style={inputStyle} type="email" placeholder="sarah@school.co.uk" value={email} onChange={e => setEmail(e.target.value)} /></div>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Select a topic...</option>
                  <option>General enquiry</option>
                  <option>Billing & subscription</option>
                  <option>Technical issue</option>
                  <option>Feature request</option>
                  <option>School / team plan</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea style={{ ...inputStyle, height: 100, padding: '10px 12px', resize: 'vertical' }} placeholder="How can we help?" value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSend} disabled={sending} style={{ flex: 1, height: 40, background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: sending ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: sending ? 0.7 : 1 }}>{sending ? 'Sending...' : 'Send message'}</button>
                <button onClick={onClose} style={{ height: 40, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              </div>
              <p style={{ fontSize: 11, color: MUTED, textAlign: 'center' }}>Or email directly: <span style={{ color: GREEN }}>dd.driscoll92@gmail.com</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Legal Pages ───────────────────────────────────────────────────────────────

export function LegalPage({ type, onClose }) {
  const isPrivacy = type === 'privacy'
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const privacy = {
    title: 'Privacy Policy',
    updated: today,
    sections: [
      { heading: 'Who we are', body: `TeachReads is operated by Daniel Driscoll ("we", "us", "our"). We are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Contact us at dd.driscoll92@gmail.com.` },
      { heading: 'What data we collect', body: `We collect: your name and email address when you create an account; usage data including lesson plans, resources and book searches you generate; profile information you choose to provide (school name, region, year groups); your profile picture if you upload one; subscription and billing information if you upgrade to a paid plan.` },
      { heading: 'How we use your data', body: `We use your data to: provide and improve the TeachReads service; personalise your experience (pre-filling year group and subject preferences); send transactional emails (account confirmation, password reset); communicate about your subscription; analyse usage patterns to improve the product. We do not sell your data to third parties or use it for advertising.` },
      { heading: 'Data storage', body: `Your data is stored securely using Supabase (PostgreSQL database hosted on AWS in the EU). Profile pictures are stored in Supabase Storage. We use Anthropic's Claude API to generate lesson plans and resources — prompts and responses are not stored by Anthropic beyond their standard processing.` },
      { heading: 'Data retention', body: `We retain your data for as long as you have an account. If you delete your account, all your data is permanently deleted within 30 days. You can delete your account at any time from Profile & settings → Account.` },
      { heading: 'Your rights', body: `Under UK GDPR you have the right to: access your personal data; correct inaccurate data; delete your data ("right to be forgotten"); restrict or object to processing; data portability. To exercise any of these rights, contact us at dd.driscoll92@gmail.com.` },
      { heading: 'Cookies', body: `We use only essential cookies required for authentication (session management). We do not use tracking, advertising or analytics cookies.` },
      { heading: 'Changes to this policy', body: `We may update this policy from time to time. We will notify you of significant changes by email or by a notice in the app.` },
    ]
  }

  const terms = {
    title: 'Terms of Service',
    updated: today,
    sections: [
      { heading: '1. Acceptance', body: `By creating a TeachReads account, you agree to these Terms of Service. If you do not agree, please do not use the service. These terms are governed by the laws of England and Wales.` },
      { heading: '2. The service', body: `TeachReads provides AI-powered book recommendations, lesson planning and classroom resource generation for UK primary school teachers. The service is provided "as is". AI-generated content may occasionally contain inaccuracies — always review content before using it in the classroom.` },
      { heading: '3. Accounts', body: `You must provide accurate information when creating your account. You are responsible for maintaining the security of your password. You must be at least 18 years old to create an account. One account per person — do not share your account credentials.` },
      { heading: '4. Free trial', body: `New accounts receive a 5-day free trial with limited usage. Trial limits are enforced per feature. At the end of the trial period you must upgrade to a paid plan to continue using the service.` },
      { heading: '5. Paid plans', body: `Paid plans are billed monthly. You can cancel at any time from your account settings — access continues until the end of the billing period. We reserve the right to change pricing with 30 days notice. No refunds are provided for partial months.` },
      { heading: '6. Your content', body: `You retain ownership of any content you create using TeachReads (lesson plans, resources etc.). You grant us a limited licence to store and display your content to provide the service. You may not use TeachReads to generate content that is unlawful, harmful or infringes third-party rights.` },
      { heading: '7. Intellectual property', body: `TeachReads, its logo and the software are owned by us and protected by intellectual property law. You may not copy, modify or distribute the TeachReads software.` },
      { heading: '8. Limitation of liability', body: `To the maximum extent permitted by law, TeachReads shall not be liable for any indirect, incidental or consequential damages arising from use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.` },
      { heading: '9. Changes to terms', body: `We may update these terms. Continued use of the service after changes constitutes acceptance. We will notify you of material changes by email.` },
      { heading: '10. Contact', body: `For questions about these terms, contact us at dd.driscoll92@gmail.com.` },
    ]
  }

  const page = isPrivacy ? privacy : terms

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 640, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: TEXT }}>{page.title}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Last updated {page.updated}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1, marginLeft: 12 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {page.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 6 }}>{sec.heading}</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{sec.body}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'dd.driscoll92@gmail.com'

export function AuthPage({ onAuth, onLegal }) {
  const [localLegal, setLocalLegal] = useState(null)
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleLegal(type) {
    setLocalLegal(type)
    onLegal && onLegal(type)
  }

  async function handleSubmit() {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } })
        if (error) throw error
        setSuccess('Account created! You can now sign in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuth()
      }
    } catch (err) { setError(err.message || 'Something went wrong.') }
    setLoading(false)
  }

  const inputStyle = { width: '100%', height: 42, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 14px', fontSize: 14, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  const benefits = [
    { icon: '📚', title: 'Smart book recommendations', desc: 'matched to your topic and year group' },
    { icon: '📋', title: 'Full units of work', desc: 'with NC links, SEND adaptations and model examples' },
    { icon: '🛠️', title: 'Classroom resources', desc: 'worksheets, starters, exit tickets and more' },
    { icon: '🏫', title: 'Your school library', desc: 'manage books, track plans and reuse resources' },
  ]
  const steps = [
    { n: '1', title: 'Find the perfect book', desc: 'Search by subject, topic and year group. AI recommends books matched to your curriculum.' },
    { n: '2', title: 'Generate a unit of work', desc: 'One click creates a full lesson sequence with NC links, SEND adaptations and model examples.' },
    { n: '3', title: 'Create resources', desc: 'Generate differentiated worksheets, starters, exit tickets and more. Download as PDF or Word.' },
  ]

  return (
    <>
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: NAVY, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: GREEN, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📚</div>
          <span style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: '#fff' }}>TeachReads</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 13, color: NAVY_MUTED, cursor: 'pointer' }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</span>
          <button onClick={() => { setMode('login'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ height: 32, padding: '0 14px', background: 'transparent', border: `0.5px solid ${NAVY_LIGHT}`, borderRadius: 7, fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign in</button>
          <button onClick={() => { setMode('signup'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ height: 32, padding: '0 14px', background: GREEN, border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, color: LIGHT_GREEN, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get started free</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 56px)', maxWidth: 1200, margin: '0 auto', padding: '0 2rem', gap: '3rem', alignItems: 'center' }}>
        <div style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>For UK primary school teachers</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEF3C7', border: '0.5px solid #F59E0B', borderRadius: 20, padding: '5px 14px', marginBottom: 18, width: 'fit-content' }}>
            <span style={{ fontSize: 14 }}>🎁</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#92400E' }}>5-day free trial — no credit card required</span>
          </div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 38, fontWeight: 500, color: TEXT, lineHeight: 1.25, marginBottom: 18 }}>Lesson planning,<br /><span style={{ color: GREEN }}>powered by AI</span></h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>Find books, generate full units of work and create classroom resources — all in one place. Save hours of planning every week.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: LIGHT_GREEN, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginTop: 1 }}>{b.icon}</div>
                <div><span style={{ fontSize: 14, fontWeight: 500, color: TEXT }}>{b.title} </span><span style={{ fontSize: 14, color: MUTED }}>{b.desc}</span></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['S','J','R','M'].map((l, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: [GREEN, '#534AB7', '#BA7517', '#D85A30'][i], border: `2px solid ${PAGE_BG}`, marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{l}</div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: MUTED }}>Trusted by UK primary teachers</span>
          </div>
        </div>
        <div id="auth-card" style={{ padding: '2rem 0' }}>
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 16, padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: TEXT, marginBottom: 4 }}>{mode === 'signup' ? 'Get started free' : 'Welcome back'}</h2>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>{mode === 'signup' ? '5-day free trial · No credit card required' : 'Sign in to your TeachReads account'}</p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: PAGE_BG, borderRadius: 8, padding: 4 }}>
              {[['signup', 'Create account'], ['login', 'Sign in']].map(([id, label]) => (
                <button key={id} onClick={() => { setMode(id); setError(''); setSuccess('') }}
                  style={{ flex: 1, height: 34, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: mode === id ? 500 : 400, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: mode === id ? BG : 'transparent', color: mode === id ? TEXT : MUTED, boxShadow: mode === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'signup' && <div><label style={{ ...s.label, marginBottom: 5 }}>Your name</label><input style={inputStyle} placeholder="e.g. Sarah Jones" value={name} onChange={e => setName(e.target.value)} /></div>}
              <div><label style={{ ...s.label, marginBottom: 5 }}>Email address</label><input style={inputStyle} type="email" placeholder="your@school.co.uk" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} /></div>
              <div><label style={{ ...s.label, marginBottom: 5 }}>Password</label><input style={inputStyle} type="password" placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} /></div>
              {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
              {success && <div style={{ background: LIGHT_GREEN, color: '#085041', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{success}</div>}
              {mode === 'signup' && (
                <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#085041', width: '100%', marginBottom: 2 }}>Your trial includes:</span>
                  {['10 book searches', '10 units of work', '15 resources', '20 load mores'].map((f, i) => (
                    <span key={i} style={{ fontSize: 11, color: '#085041', background: 'rgba(29,158,117,0.15)', padding: '2px 8px', borderRadius: 20 }}>✓ {f}</span>
                  ))}
                </div>
              )}
              <button onClick={handleSubmit} disabled={loading} style={{ height: 44, background: loading ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                {loading ? '⏳ Please wait...' : mode === 'login' ? 'Sign in' : 'Start free 5-day trial'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: '0.5px', background: BORDER }} />
                <span style={{ fontSize: 11, color: MUTED }}>or</span>
                <div style={{ flex: 1, height: '0.5px', background: BORDER }} />
              </div>
              <button disabled style={{ height: 40, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'not-allowed', opacity: 0.6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span style={{ fontSize: 13, color: MUTED }}>Continue with Google (coming soon)</span>
              </button>
            </div>
            <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              By signing up you agree to our{' '}
              <span style={{ color: GREEN, cursor: 'pointer' }} onClick={() => handleLegal('privacy')}>Terms of Service</span> and{' '}
              <span style={{ color: GREEN, cursor: 'pointer' }} onClick={() => handleLegal('terms')}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
      <div id="how-it-works" style={{ background: BG, borderTop: `0.5px solid ${BORDER}`, padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 500, color: TEXT, textAlign: 'center', marginBottom: 8 }}>How it works</h2>
          <p style={{ fontSize: 15, color: MUTED, textAlign: 'center', marginBottom: 40 }}>Three steps from finding a book to having a full unit of work ready to teach</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: PAGE_BG, borderRadius: 12, padding: '1.5rem', position: 'relative' }}>
                <div style={{ width: 32, height: 32, background: GREEN, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: LIGHT_GREEN, marginBottom: 14 }}>{step.n}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{step.desc}</div>
                {i < steps.length - 1 && <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: BORDER }}>→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => { setMode('signup'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ height: 48, padding: '0 32px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Start your free 5-day trial →</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
              {['5-day free trial', 'No credit card needed', 'Cancel anytime'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: GREEN, fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: NAVY, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, background: GREEN, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📚</div>
          <span style={{ fontFamily: "'Lora', serif", fontSize: 15, color: '#fff' }}>TeachReads</span>
        </div>
        <span style={{ fontSize: 12, color: NAVY_MUTED }}>For UK primary school teachers</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', 'privacy'], ['Terms', 'terms'], ['Contact', 'contact']].map(([l, t]) => (
            <span key={l} onClick={() => handleLegal(t)} style={{ fontSize: 12, color: NAVY_MUTED, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
    {localLegal && localLegal !== 'contact' && <LegalPage type={localLegal} onClose={() => setLocalLegal(null)} />}
    {localLegal === 'contact' && <ContactModal onClose={() => setLocalLegal(null)} />}
    </>
  )
}
// ── Root App ──────────────────────────────────────────────────────────────────

