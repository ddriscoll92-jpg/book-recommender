// TeachReads App v2
import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

// TeachReads shared constants and styles
const GREEN = '#1D9E75'
const LIGHT_GREEN = '#E1F5EE'
const TEXT = '#2C2C2A'
const MUTED = '#5F5E5A'
const BORDER = '#D3D1C7'
const BG = '#FFFFFF'
const PAGE_BG = '#f5f4f0'
const AMBER = '#EF9F27'
const AMBER_BG = '#FAEEDA'
const AMBER_TEXT = '#633806'
const NAVY = '#1E2433'
const NAVY_LIGHT = '#2C3547'
const NAVY_MUTED = '#8B93A7'

const TRIAL_LIMITS = {
  book_searches: 10,
  load_mores: 20,
  lesson_ideas: 15,
  units_of_work: 10,
  resources: 15,
}

const BASIC_LIMITS = {
  book_searches: 30,
  load_mores: 999,
  lesson_ideas: 999,
  units_of_work: 20,
  resources: 40,
}

const PREMIUM_LIMITS = {
  book_searches: 999,
  load_mores: 999,
  lesson_ideas: 999,
  units_of_work: 999,
  resources: 999,
}

const STRIPE_PRICES = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1TeyTtLDd6xSXwi01VHyNRy6',
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TeyUKLDd6xSXwi0ImE2F0su',
}

const s = {
  page: { minHeight: '100vh', background: PAGE_BG, padding: '2rem 1rem', paddingTop: '5rem' },
  container: { maxWidth: 680, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' },
  headerIcon: { width: 52, height: 52, background: GREEN, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 },
  h1: { fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 500, color: TEXT, lineHeight: 1.2 },
  headerSub: { fontSize: 13, color: MUTED, marginTop: 3 },
  card: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem', marginBottom: 12 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 },
  label: { display: 'block', fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  labelOpt: { fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: '#888780' },
  input: { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 10px', fontSize: 14, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" },
  select: { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 10px', fontSize: 14, color: TEXT, background: BG, outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  textarea: { width: '100%', height: 68, border: `0.5px solid ${BORDER}`, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none', padding: '8px 10px', fontSize: 14, color: TEXT, background: BG, outline: 'none', resize: 'none', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" },
  chipsBar: { border: `0.5px solid ${BORDER}`, borderTop: `0.5px solid #ebebeb`, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: '8px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, background: PAGE_BG, marginBottom: 12 },
  chip: { padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${BORDER}`, fontSize: 12, color: MUTED, cursor: 'pointer', background: BG, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4 },
  accordion: { border: `0.5px solid ${BORDER}`, borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  accordionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer', background: PAGE_BG, userSelect: 'none' },
  accordionTitle: { fontSize: 13, fontWeight: 500, color: TEXT },
  accordionSubtitle: { fontSize: 12, color: MUTED },
  accordionBadge: { background: LIGHT_GREEN, color: '#085041', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 },
  accordionBody: { borderTop: `0.5px solid ${BORDER}`, padding: 14 },
  filterLabel: { fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  pillGroup: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  pill: (active) => ({ padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${active ? GREEN : BORDER}`, fontSize: 13, color: active ? '#085041' : MUTED, cursor: 'pointer', background: active ? LIGHT_GREEN : BG, fontWeight: active ? 500 : 400 }),
  starPill: (active) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${active ? AMBER : BORDER}`, fontSize: 13, color: active ? AMBER_TEXT : MUTED, cursor: 'pointer', background: active ? AMBER_BG : BG, fontWeight: active ? 500 : 400 }),
  filterDivider: { border: 'none', borderTop: `0.5px solid ${BORDER}`, margin: '14px 0' },
  starNote: { fontSize: 11, color: '#888780', marginTop: 6 },
  submitBtn: (disabled) => ({ width: '100%', height: 44, background: disabled ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }),
  disclaimer: { background: AMBER_BG, border: `0.5px solid ${AMBER}`, borderRadius: 8, padding: '0.75rem 1rem', marginBottom: 16, fontSize: 13, color: AMBER_TEXT, display: 'flex', gap: 8, alignItems: 'flex-start' },
  resultsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `0.5px solid ${BORDER}` },
  resultsTitle: { fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 500, color: MUTED },
  badge: { background: LIGHT_GREEN, color: '#085041', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 },
  bookCard: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' },
  bookNum: { width: 26, height: 26, background: LIGHT_GREEN, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#085041', flexShrink: 0, marginTop: 2 },
  bookTitle: { fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 2 },
  bookAuthor: { fontSize: 12, color: GREEN, marginBottom: 6, fontStyle: 'italic' },
  bookReason: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  viewBtn: { marginTop: 8, fontSize: 12, color: GREEN, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 },
  loadMoreBtn: (disabled) => ({ width: '100%', height: 42, background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }),
  loadingBox: { textAlign: 'center', padding: '2.5rem', color: MUTED, fontSize: 14 },
  footer: { textAlign: 'center', fontSize: 12, color: '#B4B2A9', marginTop: '2rem', paddingTop: '1rem', borderTop: `0.5px solid ${BORDER}` },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 13, marginBottom: '1.5rem', padding: 0, fontFamily: "'DM Sans', sans-serif" },
  sectionTitle: { fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  subjectGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 },
  subjectTile: (active) => ({ padding: '14px 10px', borderRadius: 10, border: `0.5px solid ${active ? GREEN : BORDER}`, background: active ? LIGHT_GREEN : BG, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }),
  subjectEmoji: { fontSize: 22, display: 'block', marginBottom: 4 },
  subjectName: (active) => ({ fontSize: 13, fontWeight: 500, color: active ? '#085041' : TEXT }),
  generateBtn: (disabled) => ({ height: 42, padding: '0 20px', background: disabled ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }),
  subjectResultCard: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
  subjectResultHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: `0.5px solid ${BORDER}`, background: PAGE_BG },
  ideaRow: (checked) => ({ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.75rem 1rem', borderRadius: 8, background: checked ? '#F0FAF6' : PAGE_BG, border: `0.5px solid ${checked ? GREEN : BORDER}`, marginBottom: 8, cursor: 'pointer', transition: 'all 0.15s' }),
  ideaCheckbox: (checked) => ({ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${checked ? GREEN : BORDER}`, background: checked ? GREEN : BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }),
  ideaTitle: { fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 3 },
  ideaDesc: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 14, padding: '2px 4px', borderRadius: 4, flexShrink: 0, marginTop: 1, lineHeight: 1 },
  proceedBar: { position: 'sticky', bottom: 16, background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: 8 },
  proceedBtn: (disabled) => ({ height: 40, padding: '0 20px', background: disabled ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }),
}


function NavBar({ currentPage, onNavigate, userName, userEmail, onOpenProfile, avatarUrl, trialInfo }) {
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

function StarRating({ title, author, subject, yearGroup, reason }) {
  const [myRating, setMyRating] = useState(0)
  const [avgRating, setAvgRating] = useState(null)
  const [ratingCount, setRatingCount] = useState(0)
  const [hover, setHover] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // Load my rating
      const { data: mine } = await supabase.from('book_ratings').select('rating').eq('user_id', user.id).eq('book_title', title).single()
      if (mine) setMyRating(mine.rating)
      // Load community average
      const { data: avg } = await supabase.from('book_rating_averages').select('average_rating, rating_count').eq('book_title', title).single()
      if (avg) { setAvgRating(parseFloat(avg.average_rating)); setRatingCount(parseInt(avg.rating_count)) }
    }
    load()
  }, [title])

  async function handleRate(stars) {
    if (saving) return
    const newRating = stars === myRating ? 0 : stars
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      if (newRating === 0) {
        await supabase.from('book_ratings').delete().eq('user_id', user.id).eq('book_title', title)
      } else {
        await supabase.from('book_ratings').upsert({ user_id: user.id, book_title: title, book_author: author, rating: newRating }, { onConflict: 'user_id,book_title' })
      }
      setMyRating(newRating)
      // Refresh community average
      const { data: avg } = await supabase.from('book_rating_averages').select('average_rating, rating_count').eq('book_title', title).single()
      if (avg) { setAvgRating(parseFloat(avg.average_rating)); setRatingCount(parseInt(avg.rating_count)) }
      else { setAvgRating(null); setRatingCount(0) }
    } catch(e) { console.warn('Star rating error:', e) }
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', gap: 2 }} onMouseLeave={() => setHover(0)}>
        {[1,2,3,4,5].map(star => (
          <span key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            style={{ fontSize: 14, cursor: 'pointer', color: star <= (hover || myRating) ? '#F59E0B' : '#D1D0C9', lineHeight: 1, userSelect: 'none' }}>
            ★
          </span>
        ))}
      </div>
      {avgRating && (
        <div style={{ fontSize: 10, color: MUTED, whiteSpace: 'nowrap' }}>
          ⭐ {avgRating.toFixed(1)} <span style={{ color: MUTED }}>({ratingCount})</span>
        </div>
      )}
    </div>
  )
}

function FavouriteButton({ title, author, subject, yearGroup, reason }) {
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('saved_books').select('is_favourite').eq('user_id', user.id).eq('title', title).single()
      if (data) setIsFav(data.is_favourite)
    }
    check()
  }, [title])

  async function toggle(e) {
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: existing } = await supabase.from('saved_books').select('id, is_favourite').eq('user_id', user.id).eq('title', title).single()
      if (existing) {
        await supabase.from('saved_books').update({ is_favourite: !existing.is_favourite }).eq('id', existing.id)
        setIsFav(!existing.is_favourite)
      } else {
        await supabase.from('saved_books').insert({ user_id: user.id, title, author, subject, year_group: yearGroup, reason, is_favourite: true, last_accessed: new Date().toISOString() })
        setIsFav(true)
      }
    } catch(e) { console.warn('Favourite error:', e) }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4, zIndex: 1 }}
    >
      {isFav ? '⭐' : '☆'}
    </button>
  )
}

// ── Plan Detail Modal ─────────────────────────────────────────────────────────

function SearchPage({ onSelectBook, searchState, setSearchState, checkTrial }) {
  const { subject, topic, yearGroup, focus, accordionOpen, contentType, bookType, readingLevel, starRating, books, loading, loadingMore, error, searched, searchMeta } = searchState
  const set = (key, val) => setSearchState(prev => ({ ...prev, [key]: val }))
  const activeFilterCount = [contentType !== 'Any', bookType !== 'Any', readingLevel !== 'Any', starRating > 0].filter(Boolean).length

  async function fetchBooks(loadMore = false) {
    if (!subject.trim() || !topic.trim() || !yearGroup) { set('error', 'Please fill in subject, topic and year group before searching.'); return }
    set('error', '')
    const isLoadMore = loadMore && books.length > 0
    if (isLoadMore) set('loadingMore', true)
    else { set('loading', true); set('books', []); set('searched', false) }

    const count = isLoadMore ? 5 : 10
    const excludeList = books.map(b => b.title)
    const exclusions = excludeList.length > 0 ? `Do not repeat any of these already recommended books: ${excludeList.join(', ')}.` : ''
    const focusLine = focus.trim() ? `The teacher wants to specifically focus on: ${focus.trim()}.` : ''
    const contentLine = contentType !== 'Any' ? `Content type: ${contentType} only.` : ''
    const bookTypeLine = bookType !== 'Any' ? `Book type: ${bookType} only.` : ''
    const levelLine = readingLevel !== 'Any' ? `Reading level: ${readingLevel}.` : ''

    const prompt = `You are a UK primary school teacher assistant. Recommend exactly ${count} books for ${yearGroup} students studying ${topic} in ${subject}.
${focusLine}${contentLine}${bookTypeLine}${levelLine}${exclusions}
IMPORTANT: Only recommend books you are certain exist. Every title and author must be a real, published book. Do not invent or guess titles.
Return ONLY a valid JSON array with no extra text or markdown fences. Each object must have:
- "title": string
- "author": string
- "reason": string (1-2 sentences)`

    try {
      const newBooks = await callAPI(prompt)
      setSearchState(prev => ({
        ...prev,
        books: isLoadMore ? [...prev.books, ...newBooks] : newBooks,
        searchMeta: { subject, topic, yearGroup, focus, contentType, bookType, readingLevel },
        searched: true, loading: false, loadingMore: false,
      }))
    } catch {
      setSearchState(prev => ({ ...prev, error: 'Something went wrong. Please try again.', loading: false, loadingMore: false }))
    }
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.headerIcon}>📚</div>
          <div>
            <h1 style={s.h1}>Book Recommender</h1>
            <p style={s.headerSub}>Tailored reading suggestions for UK primary school teachers</p>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.formGrid}>
            <div>
              <label style={s.label}>Subject</label>
              <select style={s.select} value={subject} onChange={e => set('subject', e.target.value)}>
                <option value="">Select subject...</option>
                <option>Art</option>
                <option>Computing</option>
                <option>DT</option>
                <option>Geography</option>
                <option>History</option>
                <option>Literacy</option>
                <option>Maths</option>
                <option>Music</option>
                <option>PE</option>
                <option>PSHE</option>
                <option>RE</option>
                <option>Science</option>
              </select>
            </div>
            <div><label style={s.label}>Topic</label><input style={s.input} placeholder="e.g. Romans" value={topic} onChange={e => set('topic', e.target.value)} /></div>
            <div>
              <label style={s.label}>Year group</label>
              <select style={s.select} value={yearGroup} onChange={e => set('yearGroup', e.target.value)}>
                <option value="">Select...</option>
                <option>Year 1</option><option>Year 2</option><option>Year 3</option>
                <option>Year 4</option><option>Year 5</option><option>Year 6</option>
              </select>
            </div>
          </div>
          <div>
            <label style={s.label}>Specific focus <span style={s.labelOpt}>— optional</span></label>
            <textarea style={s.textarea} placeholder="Add any specific aspect of the topic..." value={focus} onChange={e => set('focus', e.target.value)} />
            <div style={s.chipsBar}>
              {CHIPS.map(chip => {
                const active = focus.split(',').map(f => f.trim()).includes(chip.value)
                return (
                  <span
                    key={chip.value}
                    style={{ ...s.chip, background: active ? LIGHT_GREEN : BG, borderColor: active ? GREEN : BORDER, color: active ? "#085041" : MUTED, fontWeight: active ? 600 : 400 }}
                    onClick={() => {
                      const current = focus.split(',').map(f => f.trim()).filter(Boolean)
                      const next = current.includes(chip.value)
                        ? current.filter(f => f !== chip.value)
                        : [...current, chip.value]
                      set('focus', next.join(', '))
                    }}
                  >
                    ⚡ {chip.label}
                  </span>
                )
              })}
            </div>
          </div>
          <div style={s.accordion}>
            <div style={s.accordionHeader} onClick={() => set('accordionOpen', !accordionOpen)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚙️</span>
                <div>
                  <div style={s.accordionTitle}>Refine results</div>
                  {activeFilterCount === 0 && <div style={s.accordionSubtitle}>Filter by type, content and reading level</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeFilterCount > 0 && <span style={s.accordionBadge}>{activeFilterCount} active</span>}
                <span style={{ fontSize: 14, color: MUTED, display: 'inline-block', transform: accordionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
              </div>
            </div>
            {accordionOpen && (
              <div style={s.accordionBody}>
                <div style={{ marginBottom: 14 }}>
                  <div style={s.filterLabel}>Content type</div>
                  <div style={s.pillGroup}>{CONTENT_TYPES.map(t => <span key={t} style={s.pill(contentType === t)} onClick={() => set('contentType', t)}>{t}</span>)}</div>
                </div>
                <hr style={s.filterDivider} />
                <div style={{ marginBottom: 14 }}>
                  <div style={s.filterLabel}>Book type</div>
                  <div style={s.pillGroup}>{BOOK_TYPES.map(t => <span key={t} style={s.pill(bookType === t)} onClick={() => set('bookType', t)}>{t}</span>)}</div>
                </div>
                <hr style={s.filterDivider} />
                <div style={{ marginBottom: 14 }}>
                  <div style={s.filterLabel}>Reading level</div>
                  <div style={s.pillGroup}>{READING_LEVELS.map(t => <span key={t} style={s.pill(readingLevel === t)} onClick={() => set('readingLevel', t)}>{t}</span>)}</div>
                </div>
                <hr style={s.filterDivider} />
              </div>
            )}
          </div>
        </div>
        {loading && <div style={s.loadingBox}>Finding the best books for {yearGroup} {subject}...</div>}
        {searched && books.length > 0 && (
          <div>
            <div style={s.disclaimer}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>AI recommendations can occasionally include inaccurate titles. Please verify each book exists before ordering.</span>
            </div>
            <div style={s.resultsHeader}>
              <p style={s.resultsTitle}>
                Books for <span style={{ color: TEXT }}>
                  {searchMeta.yearGroup} · {searchMeta.subject} · {searchMeta.topic}
                  {searchMeta.focus ? ` · ${searchMeta.focus}` : ''}
                  {searchMeta.contentType !== 'Any' ? ` · ${searchMeta.contentType}` : ''}
                  {searchMeta.bookType !== 'Any' ? ` · ${searchMeta.bookType}` : ''}
                  {searchMeta.readingLevel !== 'Any' ? ` · ${searchMeta.readingLevel}` : ''}
                </span>
              </p>
              <span style={s.badge}>{books.length} results</span>
            </div>
            {books.map((book, i) => (
              <div key={i} style={{ ...s.bookCard, position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <FavouriteButton
                  title={book.title}
                  author={book.author}
                  subject={searchMeta.subject}
                  yearGroup={searchMeta.yearGroup}
                  reason={book.reason}
                />
                <div style={s.bookNum}>{i + 1}</div>
                <div style={{ flex: 1 }} onClick={async () => {
                  try {
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                      const { data: existing } = await supabase.from('saved_books').select('id').eq('user_id', user.id).eq('title', book.title).single()
                      if (existing) {
                        await supabase.from('saved_books').update({ last_accessed: new Date().toISOString(), last_used: new Date().toISOString() }).eq('id', existing.id)
                      } else {
                        await supabase.from('saved_books').insert({ user_id: user.id, title: book.title, author: book.author, subject: searchMeta.subject, year_group: searchMeta.yearGroup, reason: book.reason, is_favourite: false, last_accessed: new Date().toISOString(), last_used: new Date().toISOString() })
                      }
                    }
                  } catch(e) { console.warn('Could not save book:', e) }
                  onSelectBook(book)
                }}>
                  <div style={s.bookTitle}>{book.title}</div>
                  <div style={s.bookAuthor}>{book.author}</div>
                  <div style={s.bookReason}>{book.reason}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <div style={s.viewBtn}>View book details →</div>
                    <StarRating title={book.title} author={book.author} subject={searchMeta.subject} yearGroup={searchMeta.yearGroup} reason={book.reason} />
                  </div>
                </div>
              </div>
            ))}
            <button style={s.loadMoreBtn(loadingMore)} onClick={() => fetchBooks(true)} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : '↻ Load more recommendations'}
            </button>
          </div>
        )}
        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Resource Page ─────────────────────────────────────────────────────────────

function BookDetailPage({ book, yearGroup, onBack, onCreateResources, checkTrial }) {
  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [coverError, setCoverError] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState([])
  // lessonIdeas: { Subject: [{ title, description }, ...] }
  const [lessonIdeas, setLessonIdeas] = useState({})
  const [generatingIdeas, setGeneratingIdeas] = useState(false)
  // checkedIdeas: Set of "Subject::index" strings
  const [checkedIdeas, setCheckedIdeas] = useState(new Set())
  // refreshing: Set of "Subject::index" strings currently refreshing
  const [refreshing, setRefreshing] = useState(new Set())

  useState(() => {
    fetchBookDetails(book.title, book.author)
      .then(d => setDetails(d))
      .finally(() => setLoadingDetails(false))
  }, [])

  function toggleSubject(name) {
    setSelectedSubjects(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name])
  }

  function toggleCheck(key) {
    setCheckedIdeas(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function generateIdeas() {
    if (selectedSubjects.length === 0) return
    setGeneratingIdeas(true)
    setCheckedIdeas(new Set())
    const prompt = `You are a UK primary school teacher assistant. The class is studying the book "${book.title}" by ${book.author}${yearGroup ? ` with ${yearGroup} students` : ''}.

Generate lesson ideas for each of these subjects: ${selectedSubjects.join(', ')}.

For each subject, provide exactly 3 lesson ideas directly inspired by or connected to this book.

Return ONLY a valid JSON object with no extra text or markdown fences. Keys are subject names, values are arrays of 3 objects with:
- "title": short lesson title
- "description": 1-2 sentences describing the activity and how it connects to the book

Example: {"Literacy":[{"title":"...","description":"..."}]}`

    try {
      const result = await callAPI(prompt, true)
      setLessonIdeas(result || {})
    } catch {
      setLessonIdeas({ error: true })
    } finally {
      setGeneratingIdeas(false)
    }
  }

  async function refreshIdea(subject, index) {
    const key = `${subject}::${index}`
    setRefreshing(prev => new Set(prev).add(key))
    const existingTitles = (lessonIdeas[subject] || []).map(i => i.title).join(', ')
    const prompt = `You are a UK primary school teacher assistant. The class is studying "${book.title}" by ${book.author}${yearGroup ? ` with ${yearGroup} students` : ''}.

Give me 1 new ${subject} lesson idea inspired by this book. Do not repeat any of these existing ideas: ${existingTitles}.

Return ONLY a valid JSON object with no extra text or markdown fences:
{"title":"...","description":"..."}`

    try {
      const result = await callAPI(prompt, true)
      setLessonIdeas(prev => {
        const updated = [...(prev[subject] || [])]
        updated[index] = result
        return { ...prev, [subject]: updated }
      })
      // uncheck refreshed idea since it's new
      setCheckedIdeas(prev => { const next = new Set(prev); next.delete(key); return next })
    } catch {
      // silently fail on refresh
    } finally {
      setRefreshing(prev => { const next = new Set(prev); next.delete(key); return next })
    }
  }

  const selectedIdeas = Array.from(checkedIdeas).map(key => {
    const [subject, idx] = key.split('::')
    const idea = lessonIdeas[subject]?.[parseInt(idx)]
    return idea ? { subject, ...idea } : null
  }).filter(Boolean)

  const cover = details?.coverUrl && !coverError ? details.coverUrl : null
  const hasIdeas = Object.keys(lessonIdeas).length > 0 && !lessonIdeas.error

  return (
    <div style={s.page}>
      <div style={s.container}>
        <button style={s.backBtn} onClick={onBack}>← Back to results</button>

        {/* Hero card */}
        <div style={{ ...s.card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              {loadingDetails ? (
                <div style={{ width: 120, height: 170, background: PAGE_BG, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📚</div>
              ) : cover ? (
                <img src={cover} alt={`Cover of ${book.title}`} onError={() => setCoverError(true)} style={{ width: 120, borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'block' }} />
              ) : (
                <div style={{ width: 120, height: 170, background: LIGHT_GREEN, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📖</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>{book.title}</h2>
              <p style={{ fontSize: 14, color: GREEN, fontStyle: 'italic', marginBottom: 12 }}>{book.author}</p>
              {loadingDetails ? (
                <p style={{ fontSize: 13, color: MUTED }}>Loading book details...</p>
              ) : details ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {details.illustrator && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Illustrator: </span>{details.illustrator}</div>}
                  {details.publisher && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Publisher: </span>{details.publisher}</div>}
                  {details.firstPublished && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>First published: </span>{details.firstPublished}</div>}
                  {details.pages && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Pages: </span>{details.pages}</div>}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: MUTED }}>No additional details found.</p>
              )}
            </div>
          </div>
          {details?.subjects?.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `0.5px solid ${BORDER}` }}>
              <div style={s.sectionTitle}>Subjects</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {details.subjects.map(sub => (
                  <span key={sub} style={{ padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${BORDER}`, fontSize: 12, color: MUTED, background: PAGE_BG }}>{sub}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Why recommended */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Why this book was recommended</div>
          <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>{book.reason}</p>
        </div>

        {/* Resource generator */}
        <div style={s.card}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT, marginBottom: 4 }}>Generate lesson ideas</div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>Select the subjects you'd like lesson ideas for, based on <em>{book.title}</em>.</p>
          </div>
          <div style={s.subjectGrid}>
            {SUBJECTS.map(sub => (
              <div key={sub.name} style={s.subjectTile(selectedSubjects.includes(sub.name))} onClick={() => toggleSubject(sub.name)}>
                <span style={s.subjectEmoji}>{sub.emoji}</span>
                <span style={s.subjectName(selectedSubjects.includes(sub.name))}>{sub.name}</span>
              </div>
            ))}
          </div>
          <button
            style={s.generateBtn(generatingIdeas || selectedSubjects.length === 0)}
            onClick={generateIdeas}
            disabled={generatingIdeas || selectedSubjects.length === 0}
          >
            {generatingIdeas ? '⏳ Generating...' : `✨ Generate ideas${selectedSubjects.length > 0 ? ` for ${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''}` : ''}`}
          </button>
        </div>

        {/* Lesson ideas with checkboxes + refresh */}
        {hasIdeas && (
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT, marginBottom: 4 }}>Lesson ideas</div>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>Select the ideas you'd like to create resources for, or refresh any idea to get a new one.</p>

            {Object.entries(lessonIdeas).map(([subject, ideas]) => {
              const subjectMeta = SUBJECTS.find(sub => sub.name === subject)
              return (
                <div key={subject} style={s.subjectResultCard}>
                  <div style={s.subjectResultHeader}>
                    <span style={{ fontSize: 18 }}>{subjectMeta?.emoji || '📚'}</span>
                    <span style={{ fontWeight: 500, fontSize: 14, color: TEXT }}>{subject}</span>
                  </div>
                  <div style={{ padding: '10px 14px' }}>
                    {Array.isArray(ideas) && ideas.map((idea, i) => {
                      const key = `${subject}::${i}`
                      const checked = checkedIdeas.has(key)
                      const isRefreshing = refreshing.has(key)
                      return (
                        <div key={i} style={s.ideaRow(checked)} onClick={() => !isRefreshing && toggleCheck(key)}>
                          {/* Checkbox */}
                          <div style={s.ideaCheckbox(checked)}>
                            {checked && <span style={{ color: BG, fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            {isRefreshing ? (
                              <p style={{ fontSize: 13, color: MUTED }}>Getting a new idea...</p>
                            ) : (
                              <>
                                <div style={s.ideaTitle}>{idea.title}</div>
                                <div style={s.ideaDesc}>{idea.description}</div>
                              </>
                            )}
                          </div>
                          {/* Refresh button */}
                          <button
                            style={s.refreshBtn}
                            title="Get a new idea"
                            onClick={e => { e.stopPropagation(); refreshIdea(subject, i) }}
                            disabled={isRefreshing}
                          >
                            {isRefreshing ? '⏳' : '↻'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Sticky proceed bar */}
            <div style={s.proceedBar}>
              <span style={{ fontSize: 13, color: MUTED }}>
                {checkedIdeas.size === 0
                  ? 'Select ideas above to create resources'
                  : `${checkedIdeas.size} idea${checkedIdeas.size > 1 ? 's' : ''} selected`}
              </span>
              <button
                style={s.proceedBtn(checkedIdeas.size === 0)}
                disabled={checkedIdeas.size === 0}
                onClick={() => onCreateResources && onCreateResources(selectedIdeas)}
              >
                Create resources →
              </button>
            </div>
          </div>
        )}

        {lessonIdeas.error && (
          <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, marginBottom: 12 }}>
            Something went wrong generating ideas. Please try again.
          </div>
        )}

        <div style={s.disclaimer}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>Book details are sourced from Open Library and may not be complete. Always verify before ordering.</span>
        </div>
        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Favourite Button ─────────────────────────────────────────────────────────
// ── Star Rating ──────────────────────────────────────────────────────────────

function ModelExampleTab({ modelExample }) {
  return (
    <div>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={s.sectionTitle}>Model example</div>
          <span style={{ background: AMBER_BG, color: AMBER_TEXT, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, marginBottom: 8 }}>End goal — what pupils work towards</span>
        </div>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>{modelExample?.description}</p>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 12 }}>{modelExample?.title}</div>
        {modelExample?.sections?.map((section, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{section.label}</div>
            <div style={{ background: "#F0FAF6", border: `0.5px solid ${GREEN}`, borderRadius: 8, padding: "0.75rem 1rem" }}>
              <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, marginBottom: 8 }}>{section.example}</p>
              <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic", borderTop: `0.5px solid ${BORDER}`, paddingTop: 8 }}>📌 {section.placeholder}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LessonTab({ lesson, lessonIdx, total }) {
  const lessonTypes = {
    explore: { label: 'Explore', color: '#7C5CBF', bg: '#F3EEFF' },
    analyse: { label: 'Analyse', color: '#1D6FA8', bg: '#E8F4FF' },
    teach: { label: 'Teach', color: '#1D9E75', bg: '#E1F5EE' },
    practise: { label: 'Practise', color: '#D97706', bg: '#FEF3C7' },
    apply: { label: 'Apply', color: '#DC6B3A', bg: '#FEF0E8' },
    create: { label: 'Create', color: '#B91C78', bg: '#FCE7F3' },
  }
  const lt = lessonTypes[lesson.type?.toLowerCase()] || lessonTypes.teach

  return (
    <div>
      {/* Lesson type badge + nav indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: lt.color, background: lt.bg, padding: "3px 10px", borderRadius: 20 }}>{lt.label}</span>
        <span style={{ fontSize: 12, color: MUTED }}>Lesson {lessonIdx + 1} of {total}</span>
      </div>

      {/* Overview + learning intentions */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Lesson overview</div>
        <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, marginBottom: 16 }}>{lesson.lessonOverview}</p>

        <div style={s.sectionTitle}>Learning intention</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16, padding: "10px 12px", background: LIGHT_GREEN, borderRadius: 8 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>✦</span>
          <span style={{ fontSize: 14, color: "#085041", lineHeight: 1.5, fontWeight: 500 }}>{lesson.learningIntention}</span>
        </div>

        <div style={s.sectionTitle}>Success criteria</div>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {lesson.successCriteria?.map((sc, i) => (
            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: GREEN, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{sc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main activity */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Main activity</div>
        <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, marginBottom: 12 }}>{lesson.mainActivity}</p>
        {lesson.teacherNotes && (
          <div style={{ background: AMBER_BG, border: `0.5px solid ${AMBER}`, borderRadius: 8, padding: "10px 12px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: AMBER_TEXT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Teacher note  </span>
            <span style={{ fontSize: 13, color: AMBER_TEXT, lineHeight: 1.5 }}>{lesson.teacherNotes}</span>
          </div>
        )}
      </div>

      {/* NC links */}
      <div style={s.card}>
        <div style={s.sectionTitle}>National Curriculum links</div>
        {lesson.ncLinks?.map((nc, i) => (
          <div key={i} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < lesson.ncLinks.length - 1 ? `0.5px solid ${BORDER}` : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{nc.skill}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{nc.curriculumLink}</div>
          </div>
        ))}
      </div>

      {/* SEND */}
      <div style={s.card}>
        <div style={s.sectionTitle}>SEND adaptations</div>
        {[
          { key: "lower", label: "Support / lower attaining", emoji: "🤝" },
          { key: "higher", label: "Extension / higher attaining", emoji: "🚀" },
          { key: "eal", label: "EAL learners", emoji: "🌍" },
        ].map(group => (
          <div key={group.key} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span>{group.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{group.label}</span>
            </div>
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {lesson.sendAdaptations?.[group.key]?.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                  <span style={{ color: MUTED, fontSize: 14, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourceOutput({ resource }) {
  const [downloading, setDownloading] = useState(null)

  async function handleDownload(format) {
    setDownloading(format)
    try {
      if (format === 'txt') {
        const lines = []
        lines.push(resource.title)
        lines.push('='.repeat(60))
        lines.push(resource.meta || '')
        lines.push('')
        resource.sections?.forEach(sec => {
          lines.push(sec.heading.toUpperCase())
          lines.push('-'.repeat(40))
          lines.push(sec.content)
          lines.push('')
        })
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.txt`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        const { jsPDF } = window.jspdf
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const GREEN_RGB = [29, 158, 117]; const NAVY_RGB = [30, 36, 51]; const MUTED_RGB = [95, 94, 90]
        const margin = 18; const pageW = 210; const contentW = pageW - margin * 2
        let y = 0
        function addPage() { doc.addPage(); y = 18 }
        function checkY(n = 10) { if (y + n > 275) addPage() }
        function body(text, size = 10, color = MUTED_RGB) {
          if (!text) return
          checkY(8); doc.setFontSize(size); doc.setTextColor(...color); doc.setFont('helvetica', 'normal')
          const lines = doc.splitTextToSize(String(text), contentW)
          doc.text(lines, margin, y); y += lines.length * (size * 0.45) + 2
        }
        // Header
        doc.setFillColor(...NAVY_RGB); doc.rect(0, 0, pageW, 32, 'F')
        doc.setFontSize(15); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
        doc.text(resource.title, margin, 13)
        doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(139,147,167)
        doc.text(resource.meta || '', margin, 22)
        doc.setFontSize(8); doc.text('Generated by TeachReads', margin, 29)
        y = 42
        resource.sections?.forEach(sec => {
          checkY(14)
          doc.setFillColor(...GREEN_RGB); doc.roundedRect(margin, y - 4, contentW, 7, 1.5, 1.5, 'F')
          doc.setFontSize(9); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
          doc.text(sec.heading.toUpperCase(), margin + 4, y + 0.5); y += 9
          body(sec.content); y += 4
        })
        doc.save(`${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`)
      } else if (format === 'docx') {
        await loadScript('https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
        const { Document, Packer, Paragraph, TextRun, ShadingType, AlignmentType } = window.docx
        const saveAsRes = window.saveAs || (window.FileSaver && window.FileSaver.saveAs)
        if (!Document || !Packer) throw new Error('docx not loaded')
        const children = [
          new Paragraph({ children: [new TextRun({ text: resource.title, bold: true, color: '1E2433', size: 36 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: resource.meta || '', color: '5F5E5A', size: 18, italics: true })], spacing: { after: 400 } }),
          ...(resource.sections?.flatMap(sec => [
            new Paragraph({ children: [new TextRun({ text: sec.heading, bold: true, color: 'FFFFFF', size: 22 })], shading: { type: ShadingType.SOLID, color: '1D9E75' }, spacing: { before: 300, after: 140 }, indent: { left: 100, right: 100 } }),
            new Paragraph({ children: [new TextRun({ text: sec.content, color: '5F5E5A', size: 20 })], spacing: { after: 200 }, indent: { left: 100 } }),
          ]) || []),
          new Paragraph({ children: [new TextRun({ text: 'Generated by TeachReads', color: 'B4B2A9', size: 16, italics: true })], spacing: { before: 600 }, alignment: AlignmentType.CENTER }),
        ]
        const docFile = new Document({ sections: [{ properties: {}, children }] })
        const blob = await Packer.toBlob(docFile)
        ;(window.saveAs || (window.FileSaver && window.FileSaver.saveAs))(blob, `${resource.title.replace(/[^a-z0-9]/gi, '_')}.docx`)
      }
    } finally { setDownloading(null) }
  }

  const formats = [
    { id: 'pdf', label: '📄 PDF', desc: 'Print-ready' },
    { id: 'docx', label: '📝 Word', desc: 'Editable' },
    { id: 'txt', label: '📃 Text', desc: 'Plain text' },
  ]

  return (
    <div style={{ marginTop: 20 }}>
      {/* Resource header */}
      <div style={{ background: NAVY, borderRadius: "12px 12px 0 0", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: "#FFFFFF", marginBottom: 3 }}>{resource.title}</div>
          <div style={{ fontSize: 12, color: NAVY_MUTED }}>{resource.meta}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {formats.map(f => (
            <button key={f.id} onClick={() => handleDownload(f.id)} disabled={!!downloading}
              style={{ height: 30, padding: "0 10px", background: downloading === f.id ? NAVY_LIGHT : "transparent", border: `0.5px solid ${NAVY_LIGHT}`, borderRadius: 7, fontSize: 11, color: downloading === f.id ? "#fff" : NAVY_MUTED, cursor: downloading ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              {downloading === f.id ? '⏳' : f.label}
            </button>
          ))}
        </div>
      </div>
      {/* Sections */}
      <div style={{ border: `0.5px solid ${BORDER}`, borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {resource.sections?.map((sec, i) => (
          <div key={i} style={{ borderTop: i > 0 ? `0.5px solid ${BORDER}` : "none" }}>
            <div style={{ background: LIGHT_GREEN, padding: "8px 16px", fontSize: 11, fontWeight: 600, color: "#085041", textTransform: "uppercase", letterSpacing: "0.06em" }}>{sec.heading}</div>
            <div style={{ padding: "12px 16px", background: BG, fontSize: 14, color: TEXT, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{sec.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourcePage({ book, yearGroup, ideas, onBack }) {
  const [plans, setPlans] = useState({})
  const [generating, setGenerating] = useState({})
  const [openAccordions, setOpenAccordions] = useState({})
  // active tab per idea: 0..n-1 = lesson index, "model" = model example
  const [activeTabs, setActiveTabs] = useState({})

  function toggleAccordion(key) {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function setTab(ideaTitle, tab) {
    setActiveTabs(prev => ({ ...prev, [ideaTitle]: tab }))
  }

  async function generatePlan(idea) {
    const allowed = await checkTrial?.('units_of_work')
    if (allowed === false) return
    const key = idea.title
    setGenerating(prev => ({ ...prev, [key]: true }))
    const prompt = `You are an expert UK primary school teacher creating a detailed unit of work broken into individual lessons.

Book: "${book.title}" by ${book.author}
Year group: ${yearGroup || 'Primary'}
Subject: ${idea.subject}
Unit title: ${idea.title}
Description: ${idea.description}

Decide how many lessons this unit needs (typically 4-6 depending on complexity). Structure the lessons in a logical teaching sequence, for example:
- Lesson 1: Explore/analyse the topic or text features
- Middle lessons: Teach specific skills, then practise them
- Final lesson: Apply and create (the culminating piece)

Return ONLY a valid JSON object with no extra text or markdown fences:

{
  "unitOverview": "2-3 sentences summarising the whole unit and its purpose",
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "short lesson title e.g. Features of a diary entry",
      "type": "one of: explore, analyse, teach, practise, apply, create",
      "lessonOverview": "1-2 sentences describing what happens in this lesson",
      "learningIntention": "We are learning to... (single, specific intention for this lesson)",
      "successCriteria": ["I can...", "I can...", "I can..."],
      "mainActivity": "2-3 sentences describing the main teaching activity and what pupils do",
      "teacherNotes": "1 sentence of useful classroom tip or resource suggestion (optional)",
      "ncLinks": [
        { "skill": "skill name", "curriculumLink": "exact NC reference" }
      ],
      "sendAdaptations": {
        "lower": ["adaptation 1", "adaptation 2"],
        "higher": ["adaptation 1", "adaptation 2"],
        "eal": ["adaptation 1"]
      }
    }
  ],
  "modelExample": {
    "title": "title of the model example",
    "description": "brief description — this is the end goal pupils work towards across the unit",
    "sections": [
      { "label": "section label e.g. Opening", "placeholder": "guidance on what pupils should include here", "example": "a strong example of what this section should contain" }
    ]
  }
}`

    try {
      const result = await callAPI(prompt, true)
      setPlans(prev => ({ ...prev, [key]: result }))
      setActiveTabs(prev => ({ ...prev, [key]: 0 }))

      // Save to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: planData } = await supabase
            .from('plans')
            .insert({
              user_id: user.id,
              book_title: book.title,
              book_author: book.author,
              book_emoji: '📚',
              subject: idea.subject,
              year_group: yearGroup || 'Primary',
              title: idea.title,
              unit_overview: result.unitOverview || '',
              model_example: result.modelExample || {},
              lesson_count: result.lessons?.length || 0,
            })
            .select()
            .single()

          // Save individual lessons
          if (planData && result.lessons?.length) {
            await supabase.from('lessons').insert(
              result.lessons.map(lesson => ({
                plan_id: planData.id,
                lesson_number: lesson.lessonNumber,
                title: lesson.title,
                type: lesson.type,
                lesson_overview: lesson.lessonOverview,
                learning_intention: lesson.learningIntention,
                success_criteria: lesson.successCriteria,
                main_activity: lesson.mainActivity,
                teacher_notes: lesson.teacherNotes,
                nc_links: lesson.ncLinks,
                send_adaptations: lesson.sendAdaptations,
              }))
            )
          }
        }
      } catch (saveErr) {
        console.warn('Could not save plan to database:', saveErr)
      }
    } catch {
      setPlans(prev => ({ ...prev, [key]: { error: true } }))
    } finally {
      setGenerating(prev => ({ ...prev, [key]: false }))
    }
  }

  useState(() => { ideas.forEach(idea => generatePlan(idea)) }, [])

  return (
    <div style={s.page}>
      <div style={s.container}>
        <button style={s.backBtn} onClick={onBack}>← Back to book</button>

        <div style={s.header}>
          <div style={s.headerIcon}>📝</div>
          <div>
            <h1 style={s.h1}>Create Resources</h1>
            <p style={s.headerSub}>{book.title} · {yearGroup}</p>
          </div>
        </div>

        {ideas.map((idea, ideaIdx) => {
          const plan = plans[idea.title]
          const isGenerating = generating[idea.title]
          const isOpen = openAccordions[idea.title]
          const sm = SUBJECTS.find(sub => sub.name === idea.subject)
          const activeTab = activeTabs[idea.title] ?? 0
          const lessons = plan?.lessons || []

          return (
            <div key={ideaIdx} style={{ marginBottom: 12 }}>

              {/* Accordion header */}
              <div
                onClick={() => toggleAccordion(idea.title)}
                style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: isOpen ? "12px 12px 0 0" : 12, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, background: LIGHT_GREEN, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{sm?.emoji || "📚"}</div>
                  <div>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 500, color: TEXT }}>{idea.title}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>
                      {idea.subject}
                      {isGenerating && <span style={{ marginLeft: 8, color: AMBER }}>⏳ Generating...</span>}
                      {plan && !plan.error && !isGenerating && <span style={{ marginLeft: 8, color: GREEN }}>✓ {lessons.length} lessons ready</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DownloadDropdown book={book} yearGroup={yearGroup} idea={idea} plan={plan} />
                  <span style={{ fontSize: 13, color: MUTED, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                </div>
              </div>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ border: `0.5px solid ${BORDER}`, borderTop: "none", borderRadius: "0 0 12px 12px", background: PAGE_BG }}>

                  {isGenerating && (
                    <div style={{ padding: "2rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
                      ⏳ Building lesson sequence for <em>{idea.title}</em>...
                    </div>
                  )}

                  {plan?.error && (
                    <div style={{ margin: 16, background: "#FCEBEB", color: "#A32D2D", borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13 }}>
                      Something went wrong. <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => generatePlan(idea)}>Try again</span>
                    </div>
                  )}

                  {plan && !plan.error && (
                    <div>
                      {/* Unit overview banner */}
                      <div style={{ padding: "14px 16px", borderBottom: `0.5px solid ${BORDER}`, background: BG }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Unit overview</div>
                        <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>{plan.unitOverview}</p>
                      </div>

                      {/* Tab bar */}
                      <div style={{ display: "flex", overflowX: "auto", borderBottom: `0.5px solid ${BORDER}`, background: BG, padding: "0 16px", gap: 2 }}>
                        {lessons.map((lesson, li) => (
                          <button
                            key={li}
                            onClick={() => setTab(idea.title, li)}
                            style={{ padding: "10px 14px", border: "none", borderBottom: activeTab === li ? `2px solid ${GREEN}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: activeTab === li ? 600 : 400, color: activeTab === li ? GREEN : MUTED, whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}
                          >
                            L{li + 1} · {lesson.title}
                          </button>
                        ))}
                        <button
                          onClick={() => setTab(idea.title, "model")}
                          style={{ padding: "10px 14px", border: "none", borderBottom: activeTab === "model" ? `2px solid ${AMBER}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: activeTab === "model" ? 600 : 400, color: activeTab === "model" ? AMBER_TEXT : MUTED, whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}
                        >
                          ⭐ Model example
                        </button>
                      </div>

                      {/* Tab content */}
                      <div style={{ padding: 16 }}>
                        {activeTab === "model" ? (
                          <ModelExampleTab modelExample={plan.modelExample} />
                        ) : (
                          lessons[activeTab] && (
                            <LessonTab lesson={lessons[activeTab]} lessonIdx={activeTab} total={lessons.length} />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── My Plans Page ─────────────────────────────────────────────────────────────
const DUMMY_PLANS = [
  {
    book: { title: 'Horrible Histories: Ruthless Romans', author: 'Terry Deary', emoji: '🏛️' },
    subject: 'History',
    yearGroup: 'Year 4',
    plans: [
      { id: 1, title: 'Roman Mosaic Patterns', subject: 'Art', lessons: 5, created: '28 May 2025', topic: 'Romans' },
      { id: 2, title: 'Writing a Roman Diary Entry', subject: 'Literacy', lessons: 6, created: '28 May 2025', topic: 'Romans' },
      { id: 3, title: 'Roman Settlements and Maps', subject: 'Geography', lessons: 4, created: '29 May 2025', topic: 'Romans' },
    ],
  },
  {
    book: { title: 'The Iron Man', author: 'Ted Hughes', emoji: '✏️' },
    subject: 'Literacy',
    yearGroup: 'Year 5',
    plans: [
      { id: 4, title: 'Descriptive Writing — The Iron Man', subject: 'Literacy', lessons: 5, created: '12 Apr 2025', topic: 'The Iron Man' },
      { id: 5, title: 'Forces and Materials', subject: 'Science', lessons: 4, created: '14 Apr 2025', topic: 'The Iron Man' },
    ],
  },
  {
    book: { title: 'Fantastic Mr Fox', author: 'Roald Dahl', emoji: '✏️' },
    subject: 'Literacy',
    yearGroup: 'Year 3',
    plans: [
      { id: 6, title: 'Character Description', subject: 'Literacy', lessons: 5, created: '3 Mar 2025', topic: 'Fantastic Mr Fox' },
    ],
  },
  {
    book: { title: 'DK Eyewitness: Ancient Rome', author: 'DK', emoji: '🏛️' },
    subject: 'History',
    yearGroup: 'Year 4',
    plans: [
      { id: 7, title: 'The Roman Army', subject: 'History', lessons: 6, created: '31 May 2025', topic: 'Romans' },
    ],
  },
]

const SUBJECT_COLOURS = {
  Literacy: { bg: '#EEF2FF', color: '#3730A3' },
  History: { bg: '#FEF3C7', color: '#92400E' },
  Art: { bg: '#FCE7F3', color: '#9D174D' },
  Geography: { bg: '#ECFDF5', color: '#065F46' },
  Science: { bg: '#EFF6FF', color: '#1E40AF' },
  Maths: { bg: '#FFF7ED', color: '#9A3412' },
  PSHE: { bg: '#FDF4FF', color: '#7E22CE' },
  Music: { bg: '#F0FDF4', color: '#166534' },
  PE: { bg: '#FFF1F2', color: '#9F1239' },
  RE: { bg: '#F0F9FF', color: '#075985' },
  DT: { bg: '#FAFAF9', color: '#44403C' },
  Computing: { bg: '#F8FAFC', color: '#0F172A' },
}

// ── My Plan Download Button ───────────────────────────────────────────────────

function DownloadDropdown({ book, yearGroup, idea, plan }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handle(format) {
    if (!plan || plan.error) return
    setOpen(false)
    setDownloading(format)
    try {
      if (format === 'pdf') await downloadPdf(book, yearGroup, idea, plan)
      if (format === 'docx') await downloadDocx(book, yearGroup, idea, plan)
      if (format === 'txt') downloadTxt(book, yearGroup, idea, plan)
    } finally {
      setDownloading(null)
    }
  }

  const ready = plan && !plan.error
  const formats = [
    { id: 'pdf', label: '📄 PDF', desc: 'Best for printing' },
    { id: 'docx', label: '📝 Word (.docx)', desc: 'Editable document' },
    { id: 'txt', label: '📃 Plain text', desc: 'Works anywhere' },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => ready && setOpen(o => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${ready ? BORDER : '#E0DED8'}`, background: ready ? PAGE_BG : '#F2F1ED', fontSize: 12, color: ready ? MUTED : '#B4B2A9', cursor: ready ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        title={ready ? 'Download lesson plan' : 'Plan still generating...'}
      >
        {downloading ? '⏳' : '⬇'} {downloading ? `Generating ${downloading.toUpperCase()}...` : 'Download plan'}
        {ready && !downloading && <span style={{ fontSize: 10 }}>▼</span>}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 190, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 300 }}>
          <div style={{ padding: '8px 12px 6px', fontSize: 11, color: MUTED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `0.5px solid ${BORDER}` }}>Choose format</div>
          {formats.map(f => (
            <div
              key={f.id}
              onClick={() => handle(f.id)}
              style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 11, color: MUTED }}>{f.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Nav Bar ───────────────────────────────────────────────────────────────────

function MyPlanDownloadButton({ plan, group, size }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openDropdown() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.top - 4, left: rect.right })
    }
    setOpen(o => !o)
  }

  async function loadFullPlan() {
    const { data: lessons } = await supabase.from('lessons').select('*').eq('plan_id', plan.id).order('lesson_number')
    const { data: { user: planUser } } = await supabase.auth.getUser()
      const { data: planData } = await supabase.from('plans').select('*').eq('id', plan.id).eq('user_id', planUser?.id).single()
    return { ...planData, lessons: lessons || [] }
  }

  async function handle(format) {
    setOpen(false)
    setDownloading(format)
    try {
      const fullPlan = await loadFullPlan()
      const bookObj = { title: group.book.title, author: group.book.author || '' }
      const ideaObj = { title: fullPlan.title, subject: fullPlan.subject, description: fullPlan.unit_overview || '' }
      const planObj = {
        unitOverview: fullPlan.unit_overview,
        lessons: (fullPlan.lessons || []).map(l => ({
          lessonNumber: l.lesson_number, title: l.title, type: l.type,
          lessonOverview: l.lesson_overview, learningIntention: l.learning_intention,
          successCriteria: l.success_criteria, mainActivity: l.main_activity,
          teacherNotes: l.teacher_notes, ncLinks: l.nc_links, sendAdaptations: l.send_adaptations,
        })),
        modelExample: fullPlan.model_example,
      }
      if (format === 'txt') downloadTxt(bookObj, fullPlan.year_group, ideaObj, planObj)
      if (format === 'pdf') await downloadPdf(bookObj, fullPlan.year_group, ideaObj, planObj)
      if (format === 'docx') await downloadDocx(bookObj, fullPlan.year_group, ideaObj, planObj)
    } catch(e) { console.error('Download error:', e) }
    setDownloading(null)
  }

  const [planType, setPlanType] = useState('trial')
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from('profiles').select('plan').eq('id', user.id).single()
        .then(({ data }) => { if (data?.plan) setPlanType(data.plan) })
    })
  }, [])

  const allFormats = [
    { id: 'pdf', label: '📄 PDF', desc: 'Print-ready' },
    { id: 'docx', label: '📝 Word', desc: 'Editable', premiumOnly: true },
    { id: 'txt', label: '📃 Text', desc: 'Plain text', premiumOnly: true },
  ]
  const formats = allFormats.filter(f => !f.premiumOnly || planType === 'premium')

  const isSmall = size === 'sm'
  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        onClick={openDropdown}
        disabled={!!downloading}
        style={{ height: isSmall ? 26 : 28, padding: isSmall ? '0 8px' : '0 10px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: isSmall ? 6 : 7, fontSize: 11, color: MUTED, cursor: downloading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {downloading ? '⏳' : '⬇'}
        {!isSmall && <span style={{ marginLeft: 2 }}>{downloading ? `${downloading.toUpperCase()}...` : 'Download'}</span>}
        {!downloading && !isSmall && <span style={{ fontSize: 9 }}>▼</span>}
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, transform: 'translate(-100%, -100%)', background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 9999 }}>
          <div style={{ padding: '7px 12px 5px', fontSize: 10, color: MUTED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `0.5px solid ${BORDER}` }}>Choose format</div>
          {allFormats.map(f => {
            const locked = f.premiumOnly && planType !== 'premium'
            return (
              <div key={f.id} onClick={() => !locked && handle(f.id)}
                style={{ padding: '9px 12px', cursor: locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: locked ? 0.5 : 1 }}
                onMouseEnter={e => { if (!locked) e.currentTarget.style.background = PAGE_BG }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ fontSize: 12, color: TEXT, fontWeight: 500 }}>{f.label}</span>
                <span style={{ fontSize: 10, color: MUTED }}>{locked ? '🔒 Premium' : f.desc}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BookInfoModal({ book, onClose }) {
  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [coverError, setCoverError] = useState(false)

  useEffect(() => {
    async function load() {
      setLoadingDetails(true)
      try {
        const query = encodeURIComponent(`${book.title} ${book.author}`)
        const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`)
        const data = await res.json()
        if (data.docs?.length > 0) {
          const b = data.docs[0]
          setDetails({
            publisher: b.publisher?.[0] || null,
            firstPublished: b.first_publish_year || null,
            pages: b.number_of_pages_median || null,
            subjects: b.subject?.slice(0, 5) || [],
            coverUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg` : null,
            illustrator: b.contributor?.find(c => c.toLowerCase().includes('illustrat')) || null,
          })
        }
      } catch(e) {}
      setLoadingDetails(false)
    }
    load()
  }, [book.title])

  const cover = details?.coverUrl && !coverError ? details.coverUrl : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 480, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 500, color: TEXT }}>Book details</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1, marginLeft: 12 }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ flexShrink: 0 }}>
              {loadingDetails ? (
                <div style={{ width: 90, height: 130, background: PAGE_BG, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📚</div>
              ) : cover ? (
                <img src={cover} alt={book.title} onError={() => setCoverError(true)} style={{ width: 90, borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', display: 'block' }} />
              ) : (
                <div style={{ width: 90, height: 130, background: LIGHT_GREEN, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📖</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: TEXT, marginBottom: 4, lineHeight: 1.3 }}>{book.title}</div>
              <div style={{ fontSize: 13, color: GREEN, fontStyle: 'italic', marginBottom: 12 }}>{book.author}</div>
              {loadingDetails ? <p style={{ fontSize: 13, color: MUTED }}>Loading details...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {details?.illustrator && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Illustrator: </span>{details.illustrator}</div>}
                  {details?.publisher && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Publisher: </span>{details.publisher}</div>}
                  {details?.firstPublished && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>First published: </span>{details.firstPublished}</div>}
                  {details?.pages && <div style={{ fontSize: 13, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Pages: </span>{details.pages}</div>}
                  {!details && <p style={{ fontSize: 13, color: MUTED }}>No additional details found.</p>}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: book.reason || details?.subjects?.length ? 16 : 0 }}>
            {book.subject && <span style={{ fontSize: 11, fontWeight: 500, background: LIGHT_GREEN, color: '#085041', padding: '2px 8px', borderRadius: 20 }}>{book.subject}</span>}
            {book.yearGroup && <span style={{ fontSize: 11, fontWeight: 500, background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, padding: '2px 8px', borderRadius: 20 }}>{book.yearGroup}</span>}
            {book.copies > 0 && <span style={{ fontSize: 11, fontWeight: 500, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 20 }}>{book.copies} {book.copies === 1 ? 'copy' : 'copies'}</span>}
          </div>
          {details?.subjects?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Subjects</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {details.subjects.map(sub => <span key={sub} style={{ padding: '2px 8px', borderRadius: 20, border: `0.5px solid ${BORDER}`, fontSize: 11, color: MUTED, background: PAGE_BG }}>{sub}</span>)}
              </div>
            </div>
          )}
          {book.notes && <div style={{ background: PAGE_BG, borderRadius: 8, padding: '10px 14px', marginBottom: 12, marginTop: 8, fontSize: 13, color: MUTED, fontStyle: 'italic' }}>📌 {book.notes}</div>}
          {book.reason && (
            <div style={{ background: PAGE_BG, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Why it was recommended</div>
              <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>{book.reason}</p>
            </div>
          )}
        </div>
        <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${BORDER}` }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  )
}

function PlanDetailModal({ plan, group, onClose }) {
  const [fullPlan, setFullPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('plan_id', plan.id)
        .order('lesson_number')
      const { data: planData } = await supabase
        .from('plans')
        .select('*')
        .eq('id', plan.id)
        .single()
      if (planData) setFullPlan({ ...planData, lessons: lessons || [] })
      setLoading(false)
    }
    load()
  }, [plan.id])

  const typeColors = { explore: '#7C5CBF', analyse: '#1D6FA8', teach: '#1D9E75', practise: '#D97706', apply: '#DC6B3A', create: '#B91C78' }
  const typeBgs = { explore: '#F3EEFF', analyse: '#E8F4FF', teach: '#E1F5EE', practise: '#FEF3C7', apply: '#FEF0E8', create: '#FCE7F3' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{plan.title}</div>
            <div style={{ fontSize: 12, color: MUTED }}>
              {group.book.title} · {plan.subject} · {group.yearGroup}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED, fontSize: 14 }}>Loading plan...</div>
        ) : fullPlan ? (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Unit overview */}
            {fullPlan.unit_overview && (
              <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${BORDER}`, background: PAGE_BG, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Unit overview</div>
                <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>{fullPlan.unit_overview}</p>
              </div>
            )}

            {/* Tab bar */}
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `0.5px solid ${BORDER}`, background: BG, padding: '0 20px', gap: 2, flexShrink: 0 }}>
              {(fullPlan.lessons || []).map((lesson, li) => (
                <button key={li} onClick={() => setActiveTab(li)}
                  style={{ padding: '10px 14px', border: 'none', borderBottom: activeTab === li ? `2px solid ${GREEN}` : '2px solid transparent', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: activeTab === li ? 600 : 400, color: activeTab === li ? GREEN : MUTED, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>
                  L{lesson.lesson_number} · {lesson.title}
                </button>
              ))}
              {fullPlan.model_example?.title && (
                <button onClick={() => setActiveTab('model')}
                  style={{ padding: '10px 14px', border: 'none', borderBottom: activeTab === 'model' ? `2px solid ${AMBER}` : '2px solid transparent', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: activeTab === 'model' ? 600 : 400, color: activeTab === 'model' ? AMBER_TEXT : MUTED, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>
                  ⭐ Model example
                </button>
              )}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {activeTab === 'model' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Model example</div>
                    <span style={{ background: AMBER_BG, color: AMBER_TEXT, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>End goal</span>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>{fullPlan.model_example?.description}</p>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 12 }}>{fullPlan.model_example?.title}</div>
                  {fullPlan.model_example?.sections?.map((section, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{section.label}</div>
                      <div style={{ background: '#F0FAF6', border: `0.5px solid ${GREEN}`, borderRadius: 8, padding: '0.75rem 1rem' }}>
                        <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, marginBottom: 6 }}>{section.example}</p>
                        <p style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', borderTop: `0.5px solid ${BORDER}`, paddingTop: 6 }}>📌 {section.placeholder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : fullPlan.lessons[activeTab] ? (() => {
                const lesson = fullPlan.lessons[activeTab]
                const tc = typeColors[lesson.type?.toLowerCase()] || GREEN
                const tb = typeBgs[lesson.type?.toLowerCase()] || LIGHT_GREEN
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: tc, background: tb, padding: '3px 10px', borderRadius: 20 }}>{lesson.type}</span>
                      <span style={{ fontSize: 12, color: MUTED }}>Lesson {lesson.lesson_number} of {fullPlan.lessons.length}</span>
                    </div>

                    <div style={{ ...s.card, marginBottom: 10 }}>
                      <div style={s.sectionTitle}>Overview</div>
                      <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7, marginBottom: 12 }}>{lesson.lesson_overview}</p>
                      <div style={s.sectionTitle}>Learning intention</div>
                      <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                        <span style={{ fontSize: 14, color: '#085041', fontWeight: 500 }}>{lesson.learning_intention}</span>
                      </div>
                      <div style={s.sectionTitle}>Success criteria</div>
                      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                        {lesson.success_criteria?.map((sc, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                            <span style={{ color: GREEN }}>✓</span>
                            <span style={{ fontSize: 13, color: TEXT }}>{sc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ ...s.card, marginBottom: 10 }}>
                      <div style={s.sectionTitle}>Main activity</div>
                      <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.7 }}>{lesson.main_activity}</p>
                      {lesson.teacher_notes && (
                        <div style={{ background: AMBER_BG, border: `0.5px solid ${AMBER}`, borderRadius: 8, padding: '10px 12px', marginTop: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: AMBER_TEXT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Teacher note  </span>
                          <span style={{ fontSize: 13, color: AMBER_TEXT }}>{lesson.teacher_notes}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ ...s.card, marginBottom: 10 }}>
                      <div style={s.sectionTitle}>National Curriculum links</div>
                      {lesson.nc_links?.map((nc, i) => (
                        <div key={i} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: i < lesson.nc_links.length - 1 ? `0.5px solid ${BORDER}` : 'none' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{nc.skill}</div>
                          <div style={{ fontSize: 12, color: MUTED }}>{nc.curriculumLink}</div>
                        </div>
                      ))}
                    </div>

                    <div style={s.card}>
                      <div style={s.sectionTitle}>SEND adaptations</div>
                      {[{ key: 'lower', label: 'Support / lower attaining', emoji: '🤝' }, { key: 'higher', label: 'Extension / higher attaining', emoji: '🚀' }, { key: 'eal', label: 'EAL learners', emoji: '🌍' }].map(group => (
                        <div key={group.key} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span>{group.emoji}</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{group.label}</span>
                          </div>
                          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                            {lesson.send_adaptations?.[group.key]?.map((item, i) => (
                              <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                <span style={{ color: MUTED }}>•</span>
                                <span style={{ fontSize: 13, color: MUTED }}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })() : null}
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED, fontSize: 13 }}>Plan details not found.</div>
        )}

        <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{ height: 36, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Search Page ───────────────────────────────────────────────────────────────

function PlansModal({ book, plans, onClose, onAddPlan, onViewPlan, onEditPlan, onDeletePlan }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [viewingPlan, setViewingPlan] = useState(null)

  function startEdit(plan) { setEditingId(plan.id); setEditForm({ title: plan.title, subject: plan.subject }) }
  function saveEdit(plan) { onEditPlan({ ...plan, ...editForm }); setEditingId(null) }

  const inputStyle = { height: 30, fontSize: 12, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '0 8px', fontFamily: "'DM Sans', sans-serif", color: TEXT, background: BG, outline: 'none' }

  if (viewingPlan) {
    return (
      <PlanDetailModal
        plan={viewingPlan}
        group={{ book, yearGroup: book.yearGroup || '' }}
        onClose={() => setViewingPlan(null)}
      />
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{book.title}</div>
            <div style={{ fontSize: 12, color: MUTED, fontStyle: 'italic' }}>{book.author}{book.yearGroup ? ` · ${book.yearGroup}` : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          {plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: MUTED, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>No plans yet for this book.
            </div>
          ) : plans.map((plan, i) => {
            const sc = SUBJECT_COLOURS[plan.subject] || { bg: PAGE_BG, color: MUTED }
            const isEditing = editingId === plan.id
            const isConfirming = confirmDeleteId === plan.id
            return (
              <div key={plan.id} style={{ borderBottom: i < plans.length - 1 ? `0.5px solid ${BORDER}` : 'none', padding: '10px 0' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input style={{ ...inputStyle, flex: 1, minWidth: 120 }} value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}>
                      {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => saveEdit(plan)} style={{ height: 30, padding: '0 12px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ height: 30, padding: '0 10px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 12, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>{plan.subject}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.title}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{plan.lessons} lessons · Created {plan.created}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                      <button onClick={() => setViewingPlan(plan)} style={{ height: 26, padding: '0 10px', background: LIGHT_GREEN, border: `0.5px solid ${GREEN}`, borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#085041', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>View</button>
                      <MyPlanDownloadButton plan={plan} group={{ book, yearGroup: book.yearGroup || '' }} size="sm" />
                      <button onClick={() => startEdit(plan)} style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✏️</button>
                      {isConfirming ? (
                        <>
                          <button onClick={() => { onDeletePlan(plan.id); setConfirmDeleteId(null) }} style={{ height: 26, padding: '0 8px', background: '#FCEBEB', border: `0.5px solid #A32D2D`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                          <button onClick={() => setConfirmDeleteId(null)} style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✕</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(plan.id)} style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>🗑️</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div style={{ padding: '12px 20px', borderTop: `0.5px solid ${BORDER}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onAddPlan} style={{ flex: 1, height: 38, background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✨ Create new plan</button>
          <button onClick={onClose} style={{ height: 38, padding: '0 16px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Book Modal (Add/Edit library book) ────────────────────────────────────────

function MyPlansPage({ onNavigate }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterYear, setFilterYear] = useState('All')
  const [openBooks, setOpenBooks] = useState({})
  const [viewingPlan, setViewingPlan] = useState(null) // { plan, group }

  useEffect(() => {
    async function loadPlans() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      if (!error && data) {
        // Group by book
        const groups = []
        data.forEach(plan => {
          const existing = groups.find(g => g.book.title === plan.book_title)
          const planEntry = {
            id: plan.id,
            title: plan.title,
            subject: plan.subject,
            lessons: plan.lesson_count,
            topic: plan.title,
            created: new Date(plan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          }
          if (existing) {
            existing.plans.push(planEntry)
          } else {
            groups.push({
              book: { title: plan.book_title, author: plan.book_author || '', emoji: plan.book_emoji || '📚' },
              yearGroup: plan.year_group,
              plans: [planEntry]
            })
          }
        })
        setPlans(groups)
      }
      setLoading(false)
    }
    loadPlans()
  }, [])

  const allSubjects = ['All', ...Array.from(new Set(plans.flatMap(g => g.plans.map(p => p.subject)))).sort()]
  const allYears = ['All', ...Array.from(new Set(plans.map(g => g.yearGroup))).sort()]

  const filteredGroups = plans.map(group => {
    const filteredPlans = group.plans.filter(plan => {
      if (filterSubject !== 'All' && plan.subject !== filterSubject) return false
      if (filterYear !== 'All' && group.yearGroup !== filterYear) return false
      if (search && !plan.title.toLowerCase().includes(search.toLowerCase()) &&
          !group.book.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    return { ...group, plans: filteredPlans }
  }).filter(g => g.plans.length > 0)

  const totalPlans = filteredGroups.reduce((acc, g) => acc + g.plans.length, 0)
  const filtersActive = filterSubject !== 'All' || filterYear !== 'All' || search

  function toggleBook(title) {
    setOpenBooks(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const selectStyle = { height: 32, fontSize: 12, borderRadius: 20, border: `0.5px solid ${BORDER}`, padding: "0 12px", background: BG, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }

  return (
    <>
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>📋</div>
            <div>
              <h1 style={s.h1}>My Plans</h1>
              <p style={s.headerSub}>All your generated lesson plans, organised by book</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("search")}
            style={{ height: 38, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            + Create new plan
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "nowrap" }}>
          <span style={{ fontSize: 15, color: MUTED, flexShrink: 0 }}>🔍</span>
          <input
            style={{ flex: 1, minWidth: 0, height: 28, border: 'none', outline: 'none', fontSize: 13, color: TEXT, background: 'transparent', fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Search by book, plan or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <span onClick={() => setSearch('')} style={{ fontSize: 13, color: MUTED, cursor: 'pointer', flexShrink: 0 }}>✕</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Subject</span>
            <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${filterSubject !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: filterSubject !== 'All' ? LIGHT_GREEN : BG, color: filterSubject !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              {allSubjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Year</span>
            <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${filterYear !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: filterYear !== 'All' ? LIGHT_GREEN : BG, color: filterYear !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              {allYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
            </select>
          </div>
          {filtersActive && <span onClick={() => { setSearch(''); setFilterSubject('All'); setFilterYear('All') }} style={{ fontSize: 12, color: MUTED, cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>Clear</span>}
          <span style={{ fontSize: 12, color: MUTED, flexShrink: 0 }}>{totalPlans} plan{totalPlans !== 1 ? 's' : ''}</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontSize: 14 }}>Loading your plans...</div>
        )}

        {/* Empty state */}
        {!loading && filteredGroups.length === 0 && (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 6 }}>
              {filtersActive ? 'No plans match your filters' : 'No plans yet'}
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              {filtersActive ? 'Try adjusting your search or filters.' : 'Find a book and generate your first lesson plan to get started.'}
            </div>
            {filtersActive
              ? <span onClick={() => { setSearch(''); setFilterSubject('All'); setFilterYear('All') }} style={{ fontSize: 13, color: GREEN, cursor: "pointer", textDecoration: "underline" }}>Clear filters</span>
              : <button onClick={() => onNavigate('search')} style={{ height: 36, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Find a book</button>
            }
          </div>
        )}

        {/* Book groups */}
        {!loading && filteredGroups.map(group => {
          const isOpen = openBooks[group.book.title]
          return (
            <div key={group.book.title} style={{ marginBottom: 12 }}>

              {/* Book header */}
              <div
                onClick={() => toggleBook(group.book.title)}
                style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: isOpen ? "12px 12px 0 0" : 12, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: LIGHT_GREEN, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{group.book.emoji}</div>
                  <div>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: TEXT, lineHeight: 1.3 }}>{group.book.title}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                      <span style={{ fontStyle: "italic" }}>{group.book.author}</span>
                      <span style={{ margin: "0 6px" }}>·</span>
                      {group.yearGroup}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: LIGHT_GREEN, color: "#085041", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>
                    {group.plans.length} plan{group.plans.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: 13, color: MUTED, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                </div>
              </div>

              {/* Plans list */}
              {isOpen && (
                <div style={{ border: `0.5px solid ${BORDER}`, borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                  {group.plans.map((plan, pi) => {
                    const sc = SUBJECT_COLOURS[plan.subject] || { bg: PAGE_BG, color: MUTED }
                    return (
                      <div
                        key={plan.id}
                        style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: pi > 0 ? `0.5px solid ${BORDER}` : "none", background: BG }}
                        onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
                        onMouseLeave={e => e.currentTarget.style.background = BG}
                      >
                        {/* Subject badge */}
                        <span style={{ fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
                          {plan.subject}
                        </span>

                        {/* Plan info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{plan.title}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>
                            {plan.lessons} lessons · Created {plan.created}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => setViewingPlan({ plan, group })} style={{ height: 28, padding: "0 12px", background: LIGHT_GREEN, border: `0.5px solid ${GREEN}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: "#085041", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                            View
                          </button>
                          <MyPlanDownloadButton plan={plan} group={group} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>
    {viewingPlan && (
      <PlanDetailModal
        plan={viewingPlan.plan}
        group={viewingPlan.group}
        onClose={() => setViewingPlan(null)}
      />
    )}
    </>
  )
}

// ── Resources Page ───────────────────────────────────────────────────────────
const RESOURCE_TYPES = [
  { id: 'worksheet',      label: 'Worksheet',               emoji: '📄', desc: 'Differentiated — below, at and above expectation' },
  { id: 'starter',        label: 'Lesson starter',          emoji: '🎯', desc: 'Warm-up activity to begin the lesson' },
  { id: 'exit_ticket',    label: 'Exit ticket',             emoji: '✅', desc: 'Quick end-of-lesson assessment' },
  { id: 'writing_frame',  label: 'Writing frame',           emoji: '🖊️', desc: 'Scaffold to support extended writing' },
  { id: 'knowledge_org',  label: 'Knowledge organiser',     emoji: '📊', desc: 'Visual summary of key facts and vocabulary' },
  { id: 'vocab_cards',    label: 'Vocabulary cards',        emoji: '🃏', desc: 'Key terms with definitions' },
  { id: 'comprehension',  label: 'Reading comprehension',   emoji: '🔍', desc: 'Questions to check understanding of a text' },
]

function BookGridStarRating({ title, author }) {
  const [myRating, setMyRating] = useState(0)
  const [avgRating, setAvgRating] = useState(null)
  const [ratingCount, setRatingCount] = useState(0)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: mine } = await supabase.from('book_ratings').select('rating').eq('user_id', user.id).eq('book_title', title).single()
      if (mine) setMyRating(mine.rating)
      const { data: avg } = await supabase.from('book_rating_averages').select('average_rating, rating_count').eq('book_title', title).single()
      if (avg) { setAvgRating(parseFloat(avg.average_rating)); setRatingCount(parseInt(avg.rating_count)) }
    }
    load()
  }, [title])

  async function handleRate(star) {
    const newRating = star === myRating ? 0 : star
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      if (newRating === 0) {
        await supabase.from('book_ratings').delete().eq('user_id', user.id).eq('book_title', title)
      } else {
        await supabase.from('book_ratings').upsert({ user_id: user.id, book_title: title, book_author: author, rating: newRating }, { onConflict: 'user_id,book_title' })
      }
      setMyRating(newRating)
      const { data: avg } = await supabase.from('book_rating_averages').select('average_rating, rating_count').eq('book_title', title).single()
      if (avg) { setAvgRating(parseFloat(avg.average_rating)); setRatingCount(parseInt(avg.rating_count)) }
      else { setAvgRating(null); setRatingCount(0) }
    } catch(e) { console.warn('Star rating error:', e) }
  }

  return (
    <div style={{ marginBottom: 4 }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', gap: 1 }} onMouseLeave={() => setHover(0)}>
        {[1,2,3,4,5].map(star => (
          <span key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            style={{ fontSize: 12, cursor: 'pointer', color: star <= (hover || myRating) ? '#F59E0B' : '#D1D0C9', lineHeight: 1, userSelect: 'none' }}>
            ★
          </span>
        ))}
      </div>
      {avgRating && (
        <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>⭐ {avgRating.toFixed(1)} ({ratingCount})</div>
      )}
    </div>
  )
}

function SectionFilters({ books, filters, setFilters }) {
  const subjects = ['All', ...Array.from(new Set(books.map(b => b.subject).filter(Boolean))).sort()]
  const yearGroups = ['All', ...Array.from(new Set(books.map(b => b.yearGroup).filter(Boolean))).sort()]
  const sel = (active) => ({ height: 28, fontSize: 11, borderRadius: 20, border: `0.5px solid ${active ? GREEN : BORDER}`, padding: '0 10px', background: active ? LIGHT_GREEN : BG, color: active ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Subject</span>
        <select style={sel(filters.subject !== 'All')} value={filters.subject} onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}>
          {subjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Year</span>
        <select style={sel(filters.yearGroup !== 'All')} value={filters.yearGroup} onChange={e => setFilters(f => ({ ...f, yearGroup: e.target.value }))}>
          {yearGroups.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
        </select>
      </div>
      <span onClick={() => setFilters(f => ({ ...f, hasPlans: !f.hasPlans }))}
        style={{ padding: '4px 10px', borderRadius: 20, border: `0.5px solid ${filters.hasPlans ? GREEN : BORDER}`, fontSize: 11, fontWeight: filters.hasPlans ? 600 : 400, color: filters.hasPlans ? '#085041' : MUTED, background: filters.hasPlans ? LIGHT_GREEN : BG, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
        📝 Has plans
      </span>
    </div>
  )
}

function applyFilters(books, filters) {
  return books.filter(b => {
    if (filters.subject !== 'All' && b.subject !== filters.subject) return false
    if (filters.yearGroup !== 'All' && b.yearGroup !== filters.yearGroup) return false
    if (filters.hasPlans && !b.planCount) return false
    return true
  })
}

const defaultFilters = { subject: 'All', yearGroup: 'All', hasPlans: false }

function BookGridCard({ book, isFavourite, onToggleFavourite, onViewBook, onViewPlans, onCreatePlan, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const subjectMeta = SUBJECTS.find(s => s.name === book.subject)

  return (
    <div style={{ background: BG, border: `0.5px solid ${hovered ? GREEN : BORDER}`, borderRadius: 12, overflow: 'hidden', transition: 'all 0.15s', boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}>
      <div style={{ background: LIGHT_GREEN, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 36 }}>
        {subjectMeta?.emoji || '📚'}
        {/* Star toggle */}
        <button onClick={() => onToggleFavourite && onToggleFavourite(book)}
          style={{ position: 'absolute', top: 7, right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, lineHeight: 1 }}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
          {isFavourite ? '⭐' : '☆'}
        </button>
        {/* Source badge */}
        {book.source === 'library' && (
          <span style={{ position: 'absolute', top: 7, left: 7, fontSize: 9, fontWeight: 600, background: '#FEF3C7', color: '#92400E', padding: '2px 5px', borderRadius: 10 }}>My library</span>
        )}
        {/* Plan count badge */}
        {book.planCount > 0 && (
          <div style={{ position: 'absolute', bottom: 7, left: 7, background: GREEN, color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20 }}>
            📝 {book.planCount} plan{book.planCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div style={{ padding: '10px 10px 8px', flex: 1 }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 12, fontWeight: 500, color: TEXT, lineHeight: 1.4, marginBottom: 2 }}>{book.title}</div>
        <div style={{ fontSize: 10, color: GREEN, fontStyle: 'italic', marginBottom: 6 }}>{book.author}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {book.subject && <span style={{ fontSize: 9, fontWeight: 500, background: LIGHT_GREEN, color: '#085041', padding: '1px 6px', borderRadius: 20 }}>{book.subject}</span>}
          {book.yearGroup && <span style={{ fontSize: 9, fontWeight: 500, background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, padding: '1px 6px', borderRadius: 20 }}>{book.yearGroup}</span>}
          {book.copies > 0 && <span style={{ fontSize: 9, fontWeight: 500, background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: 20 }}>{book.copies} {book.copies === 1 ? 'copy' : 'copies'}</span>}
        </div>
        {book.source === 'saved' && (
          <BookGridStarRating title={book.title} author={book.author} />
        )}
        {book.lastAccessed && (
          <div style={{ fontSize: 10, color: MUTED }}><span style={{ fontWeight: 500, color: TEXT }}>Accessed: </span>{book.lastAccessed}</div>
        )}
      </div>
      <div style={{ padding: '6px 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Primary action */}
        {book.planCount > 0 ? (
          <button onClick={() => onViewPlans && onViewPlans(book)}
            style={{ width: '100%', height: 28, background: LIGHT_GREEN, border: `0.5px solid ${GREEN}`, borderRadius: 7, fontSize: 10, fontWeight: 500, color: '#085041', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            View plans ({book.planCount})
          </button>
        ) : (
          <button onClick={() => onCreatePlan && onCreatePlan(book)}
            style={{ width: '100%', height: 28, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 10, fontWeight: 500, color: GREEN, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            ✨ Create plan
          </button>
        )}
        {/* Secondary row */}
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => onViewBook && onViewBook(book)}
            style={{ flex: 1, height: 26, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 10, fontWeight: 500, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            View book
          </button>
          {/* Edit/delete only for library books */}
          {book.source === 'library' && !confirmDelete && (
            <button onClick={() => onEdit && onEdit(book)}
              style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 10, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✏️</button>
          )}
          {book.source === 'library' && !confirmDelete && (
            <button onClick={() => setConfirmDelete(true)}
              style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 10, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>🗑️</button>
          )}
          {book.source === 'library' && confirmDelete && (
            <>
              <button onClick={() => onDelete && onDelete(book.id)}
                style={{ flex: 1, height: 26, background: '#FCEBEB', border: `0.5px solid #A32D2D`, borderRadius: 7, fontSize: 10, fontWeight: 600, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 10, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>✕</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function BookModal({ book, onClose, onSave, isEdit }) {
  const [mode, setMode] = useState(isEdit ? 'manual' : 'search')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [form, setForm] = useState(
    isEdit
      ? { title: book.title, author: book.author, subject: book.subject, yearGroup: book.yearGroup || book.year_group, copies: book.copies, notes: book.notes || '' }
      : { title: '', author: '', subject: '', yearGroup: '', copies: 1, notes: '' }
  )

  async function searchBooks() {
    if (!query.trim()) return
    setSearching(true); setSearched(false)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`)
      const data = await res.json()
      setResults((data.docs || []).map(b => ({ title: b.title, author: b.author_name?.[0] || 'Unknown', coverUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : null })))
    } catch { setResults([]) }
    setSearching(false); setSearched(true)
  }

  function selectResult(r) { setForm(f => ({ ...f, title: r.title, author: r.author })); setMode('manual') }

  function handleSave() {
    if (!form.title || !form.author || !form.subject || !form.yearGroup) return
    const saved = isEdit
      ? { ...book, ...form, copies: parseInt(form.copies) || 1 }
      : { ...form, id: Date.now(), emoji: '📚', copies: parseInt(form.copies) || 1, addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
    onSave(saved)
  }

  const inputStyle = { ...s.input, height: 36, fontSize: 13 }
  const selectStyle = { ...s.select, height: 36, fontSize: 13 }
  const valid = form.title && form.author && form.subject && form.yearGroup

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>{isEdit ? 'Edit book' : 'Add book to library'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '16px 20px' }}>
          {!isEdit && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: PAGE_BG, borderRadius: 8, padding: 4 }}>
              {[['search', '🔍 Search'], ['manual', '✏️ Add manually']].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)}
                  style={{ flex: 1, height: 32, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: mode === id ? BG : 'transparent', color: mode === id ? TEXT : MUTED, boxShadow: mode === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {label}
                </button>
              ))}
            </div>
          )}
          {mode === 'search' && !isEdit && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Search by title or author..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchBooks()} />
                <button onClick={searchBooks} disabled={searching} style={{ height: 36, padding: '0 14px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{searching ? '...' : 'Search'}</button>
              </div>
              {searched && results.length === 0 && <div style={{ textAlign: 'center', padding: '1rem', color: MUTED, fontSize: 13 }}>No results. <span style={{ color: GREEN, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setMode('manual')}>Add manually</span></div>}
              {results.map((r, i) => (
                <div key={i} onClick={() => selectResult(r)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `0.5px solid ${BORDER}`, marginBottom: 8, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = PAGE_BG} onMouseLeave={e => e.currentTarget.style.background = BG}>
                  {r.coverUrl ? <img src={r.coverUrl} style={{ width: 36, height: 48, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 36, height: 48, background: LIGHT_GREEN, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📚</div>}
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{r.title}</div><div style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>{r.author}</div></div>
                  <span style={{ fontSize: 12, color: GREEN, fontWeight: 500 }}>Select →</span>
                </div>
              ))}
              {searched && results.length > 0 && <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12 }}><span style={{ color: MUTED }}>Can't find it? </span><span style={{ color: GREEN, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setMode('manual')}>Add manually</span></div>}
            </div>
          )}
          {(mode === 'manual' || isEdit) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!isEdit && form.title && <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#085041' }}>✓ Imported: <strong>{form.title}</strong> by {form.author}</div>}
              <div><label style={s.label}>Title</label><input style={inputStyle} placeholder="Book title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label style={s.label}>Author</label><input style={inputStyle} placeholder="Author name" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={s.label}>Subject</label>
                  <select style={selectStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select...</option>
                    {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label style={s.label}>Year group</label>
                  <select style={selectStyle} value={form.yearGroup} onChange={e => setForm(f => ({ ...f, yearGroup: e.target.value }))}>
                    <option value="">Select...</option>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={s.label}>Number of copies</label><input style={inputStyle} type="number" min="1" max="999" value={form.copies} onChange={e => setForm(f => ({ ...f, copies: Math.min(999, Math.max(1, parseInt(e.target.value) || 1)) }))} /></div>
              <div><label style={s.label}>Notes <span style={s.labelOpt}>— optional</span></label><input style={inputStyle} placeholder="e.g. 3 copies in Y4 cupboard" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <button onClick={handleSave} disabled={!valid}
                style={{ height: 40, background: valid ? GREEN : '#888780', color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: valid ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                {isEdit ? 'Save changes' : 'Add to library'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MyBooksPage({ onNavigate, onSelectBook }) {
  // Library books (manually added)
  const [libraryBooks, setLibraryBooks] = useState([])
  // Saved books from recommender
  const [savedBooks, setSavedBooks] = useState([])
  const [planCounts, setPlanCounts] = useState({})
  const [bookPlans, setBookPlans] = useState({})
  const [loading, setLoading] = useState(true)
  // Modal state
  const [modal, setModal] = useState(null) // null | { mode: 'add'|'edit', book } | { mode: 'plans', book } | { mode: 'info', book }
  const [viewingPlanDetail, setViewingPlanDetail] = useState(null)
  // Global search/filter bar
  const [globalSearch, setGlobalSearch] = useState('')
  const [globalSubject, setGlobalSubject] = useState('All')
  const [globalYear, setGlobalYear] = useState('All')
  const [globalHasPlans, setGlobalHasPlans] = useState(false)
  // Filters per section
  const [favFilters, setFavFilters] = useState({ ...defaultFilters })
  const [libFilters, setLibFilters] = useState({ ...defaultFilters })
  const [recentFilters, setRecentFilters] = useState({ ...defaultFilters })
  // Visible counts
  const [favVisible, setFavVisible] = useState(6)
  const [libVisible, setLibVisible] = useState(6)
  const [recentVisible, setRecentVisible] = useState(6)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const [{ data: lib }, { data: saved }, { data: plans }] = await Promise.all([
      supabase.from('library_books').select('*').eq('user_id', user?.id).order('added_at', { ascending: false }),
      supabase.from('saved_books').select('*').eq('user_id', user?.id).order('last_accessed', { ascending: false }),
      supabase.from('plans').select('id, title, subject, lesson_count, created_at, book_title, year_group').eq('user_id', user?.id),
    ])
    setLibraryBooks(lib || [])
    setSavedBooks(saved || [])
    if (plans) {
      const counts = {}
      const grouped = {}
      ;[...(lib || []), ...(saved || [])].forEach(b => {
        const key = b.title
        const bp = plans.filter(p => p.book_title === key)
        counts[key] = (counts[key] || 0) + bp.length
        if (!grouped[key]) grouped[key] = bp.map(p => ({ id: p.id, title: p.title, subject: p.subject, lessons: p.lesson_count, created: new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }))
      })
      setPlanCounts(counts)
      setBookPlans(grouped)
    }
    setLoading(false)
  }

  function normaliseSaved(b) {
    return { ...b, yearGroup: b.year_group, source: 'saved',
      lastAccessed: b.last_accessed ? new Date(b.last_accessed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      planCount: planCounts[b.title] || 0, copies: 0, starRating: b.star_rating || 0 }
  }

  function normaliseLib(b) {
    return { ...b, yearGroup: b.year_group, source: 'library',
      lastAccessed: b.added_at ? new Date(b.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      planCount: planCounts[b.title] || 0 }
  }

  const allSaved = savedBooks.map(normaliseSaved)
  const allLib = libraryBooks.map(normaliseLib)

  function applyGlobal(books) {
    return books.filter(b => {
      if (globalSubject !== 'All' && b.subject !== globalSubject) return false
      if (globalYear !== 'All' && b.yearGroup !== globalYear) return false
      if (globalSearch && !b.title.toLowerCase().includes(globalSearch.toLowerCase()) &&
          !b.author.toLowerCase().includes(globalSearch.toLowerCase())) return false
      if (globalHasPlans && !b.planCount) return false
      return true
    })
  }

  // Favourites = starred saved books + starred library books
  const favouriteBooks = applyGlobal([
    ...allSaved.filter(b => b.is_favourite),
    ...allLib.filter(b => b.is_favourite),
  ])
  // Recently used = non-starred saved books
  const recentBooks = applyGlobal(allSaved.filter(b => !b.is_favourite))
  // Library = all library books (favourited ones still show here too)
  const filteredLib = applyGlobal(allLib)

  const allSubjects = ['All', ...Array.from(new Set([...allSaved, ...allLib].map(b => b.subject).filter(Boolean))).sort()]
  const allYears = ['All', ...Array.from(new Set([...allSaved, ...allLib].map(b => b.yearGroup).filter(Boolean))).sort()]
  const totalBooks = favouriteBooks.length + filteredLib.length + recentBooks.length

  async function toggleFavourite(book) {
    const newVal = !book.is_favourite
    if (book.source === 'saved') {
      await supabase.from('saved_books').update({ is_favourite: newVal }).eq('id', book.id).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      setSavedBooks(prev => prev.map(b => b.id === book.id ? { ...b, is_favourite: newVal } : b))
    } else if (book.source === 'library') {
      await supabase.from('library_books').update({ is_favourite: newVal }).eq('id', book.id).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      setLibraryBooks(prev => prev.map(b => b.id === book.id ? { ...b, is_favourite: newVal } : b))
    }
  }

  async function handleLibrarySave(book) {
    const { data: { user } } = await supabase.auth.getUser()
    // Check library limit for basic plan
    if (modal?.mode !== 'edit') {
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user?.id).single()
      if (profile?.plan === 'basic') {
        const { count } = await supabase.from('library_books').select('id', { count: 'exact', head: true }).eq('user_id', user?.id)
        if (count >= 50) {
          alert('Basic plan allows up to 50 library books. Upgrade to Premium for unlimited.')
          return
        }
      }
    }
    if (modal?.mode === 'edit') {
      await supabase.from('library_books').update({ title: book.title, author: book.author, subject: book.subject, year_group: book.yearGroup || book.year_group, copies: parseInt(book.copies) || 1, notes: book.notes || '' }).eq('id', book.id).eq('user_id', user?.id)
    } else {
      await supabase.from('library_books').insert({ user_id: user?.id, title: book.title, author: book.author, subject: book.subject, year_group: book.yearGroup || book.year_group, copies: parseInt(book.copies) || 1, notes: book.notes || '', emoji: '📚' })
    }
    setModal(null)
    loadAll()
  }

  async function handleLibraryDelete(id) {
    await supabase.from('library_books').delete().eq('id', id).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    setLibraryBooks(prev => prev.filter(b => b.id !== id))
  }

  function renderSection(books, visible, setVisible, filters, setFilters, emptyMsg, emptyIcon) {
    const filtered = applyFilters(books, filters)
    return (
      <div>
        {books.length === 0 ? (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '2rem', textAlign: 'center', color: MUTED, fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{emptyIcon}</div>{emptyMsg}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            No books match. <span style={{ color: GREEN, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setFilters({ ...defaultFilters })}>Clear filters</span>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {filtered.slice(0, visible).map(book => (
                <BookGridCard key={book.id} book={book}
                  isFavourite={book.is_favourite || false}
                  onToggleFavourite={toggleFavourite}
                  onViewBook={b => setModal({ mode: 'info', book: b })}
                  onViewPlans={b => setModal({ mode: 'plans', book: b })}
                  onCreatePlan={b => onSelectBook && onSelectBook({ title: b.title, author: b.author, reason: b.reason || '' })}
                  onEdit={b => setModal({ mode: 'edit', book: b })}
                  onDelete={handleLibraryDelete}
                />
              ))}
            </div>
            {filtered.length > visible && (
              <button onClick={() => setVisible(v => v + 6)} style={{ width: '100%', height: 36, marginTop: 10, background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 12, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Load more ({filtered.length - visible} remaining)
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const selectStyle = { height: 32, fontSize: 12, borderRadius: 20, border: `0.5px solid ${BORDER}`, padding: '0 12px', background: BG, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' }

  return (
    <>
    <div style={{ ...s.page, maxWidth: '100%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>📖</div>
            <div>
              <h1 style={s.h1}>My Books</h1>
              <p style={s.headerSub}>Your favourites, library and recently used books</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onNavigate('search')} style={{ height: 38, padding: '0 14px', background: GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, color: LIGHT_GREEN, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Find books</button>
            <button onClick={() => setModal({ mode: 'add' })} style={{ height: 38, padding: '0 14px', background: GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Add to library</button>
          </div>
        </div>

        {/* Global search + filter bar */}
        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap' }}>
          <span style={{ fontSize: 15, color: MUTED, flexShrink: 0 }}>🔍</span>
          <input
            style={{ flex: 1, minWidth: 0, height: 28, border: 'none', outline: 'none', fontSize: 13, color: TEXT, background: 'transparent', fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Search by book or author..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
          />
          {globalSearch && <span onClick={() => setGlobalSearch('')} style={{ fontSize: 13, color: MUTED, cursor: 'pointer', flexShrink: 0 }}>✕</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Subject</span>
            <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${globalSubject !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: globalSubject !== 'All' ? LIGHT_GREEN : BG, color: globalSubject !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              value={globalSubject} onChange={e => setGlobalSubject(e.target.value)}>
              {allSubjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Year</span>
            <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${globalYear !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: globalYear !== 'All' ? LIGHT_GREEN : BG, color: globalYear !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              value={globalYear} onChange={e => setGlobalYear(e.target.value)}>
              {allYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
            </select>
          </div>
          <span onClick={() => setGlobalHasPlans(h => !h)}
            style={{ height: 28, padding: '0 10px', borderRadius: 20, border: `0.5px solid ${globalHasPlans ? GREEN : BORDER}`, fontSize: 12, fontWeight: globalHasPlans ? 600 : 400, color: globalHasPlans ? '#085041' : MUTED, background: globalHasPlans ? LIGHT_GREEN : BG, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            📝 Has plans
          </span>
          <span style={{ fontSize: 12, color: MUTED, flexShrink: 0 }}>{totalBooks} book{totalBooks !== 1 ? 's' : ''}</span>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: MUTED, fontSize: 14 }}>Loading your books...</div>}

        {!loading && (
          <>
            {/* ── My Library ── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>🏫</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>My library</span>
                  <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>{allLib.length}</span>
                </div>
                <p style={{ fontSize: 13, color: MUTED, marginLeft: 26 }}>Books you own — add, edit and create plans from your physical collection</p>
              </div>
              {renderSection(filteredLib, libVisible, setLibVisible, libFilters, setLibFilters, "Add the books you own to quickly create plans from them", "🏫")}
            </div>

            <hr style={{ border: 'none', borderTop: `0.5px solid ${BORDER}`, marginBottom: '2rem' }} />

            {/* ── Favourites ── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>⭐</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>My favourites</span>
                  <span style={{ background: LIGHT_GREEN, color: '#085041', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>{favouriteBooks.length}</span>
                </div>
                <p style={{ fontSize: 13, color: MUTED, marginLeft: 26 }}>Your top books — starred for quick access</p>
              </div>
              {renderSection(favouriteBooks, favVisible, setFavVisible, favFilters, setFavFilters, "Star a book from your recommendations to add it here", "☆")}
            </div>

            <hr style={{ border: 'none', borderTop: `0.5px solid ${BORDER}`, marginBottom: '2rem' }} />

            {/* ── Recently used ── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>🕐</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Recently used</span>
                  <span style={{ background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>{recentBooks.length}</span>
                </div>
                <p style={{ fontSize: 13, color: MUTED, marginLeft: 26 }}>Books you've found and used through the book recommender</p>
              </div>
              {renderSection(recentBooks, recentVisible, setRecentVisible, recentFilters, setRecentFilters, "Books you find through the recommender will appear here", "📚")}
            </div>
          </>
        )}

        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>

    {/* Modals */}
    {modal?.mode === 'info' && <BookInfoModal book={modal.book} onClose={() => setModal(null)} />}
    {modal?.mode === 'plans' && (
      <PlansModal
        book={{ title: modal.book.title, author: modal.book.author, yearGroup: modal.book.yearGroup || '', emoji: '📚' }}
        plans={bookPlans[modal.book.title] || []}
        onClose={() => setModal(null)}
        onAddPlan={() => { setModal(null); onSelectBook && onSelectBook({ title: modal.book.title, author: modal.book.author, reason: '' }) }}
        onViewPlan={() => {}}
        onEditPlan={async (plan) => {
          await supabase.from('plans').update({ title: plan.title, subject: plan.subject }).eq('id', plan.id).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          loadAll()
        }}
        onDeletePlan={async (planId) => {
          await supabase.from('plans').delete().eq('id', planId).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          loadAll()
        }}
      />
    )}
    {(modal?.mode === 'add' || modal?.mode === 'edit') && (
      <BookModal book={modal.book} isEdit={modal.mode === 'edit'} onClose={() => setModal(null)} onSave={handleLibrarySave} />
    )}
    </>
  )
}

// ── Profile Modal ────────────────────────────────────────────────────────────

function ResourceDownloadButton({ resource }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openDropdown() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.top - 4, left: rect.right })
    }
    setOpen(o => !o)
  }

  async function handle(format) {
    setOpen(false); setDownloading(format)
    const res = { title: resource.title, meta: resource.meta, sections: resource.sections }
    try {
      if (format === 'txt') {
        const lines = [res.title, '='.repeat(60), res.meta || '', '']
        res.sections?.forEach(sec => { lines.push(sec.heading.toUpperCase()); lines.push('-'.repeat(40)); lines.push(sec.content); lines.push('') })
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = `${res.title.replace(/[^a-z0-9]/gi, '_')}.txt`; a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        const { jsPDF } = window.jspdf
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const GREEN_RGB = [29,158,117], NAVY_RGB = [30,36,51], MUTED_RGB = [95,94,90]
        const margin = 18, pageW = 210, contentW = pageW - margin * 2
        let y = 0
        function addPage() { doc.addPage(); y = 18 }
        function checkY(n=10) { if (y+n>275) addPage() }
        function body(text, size=10) {
          if (!text) return; checkY(8)
          doc.setFontSize(size); doc.setTextColor(...MUTED_RGB); doc.setFont('helvetica','normal')
          const lines = doc.splitTextToSize(String(text), contentW)
          doc.text(lines, margin, y); y += lines.length*(size*0.45)+2
        }
        doc.setFillColor(...NAVY_RGB); doc.rect(0,0,pageW,32,'F')
        doc.setFontSize(14); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
        doc.text(res.title, margin, 13)
        doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(139,147,167)
        doc.text(res.meta||'', margin, 22)
        y = 40
        res.sections?.forEach(sec => {
          checkY(14); doc.setFillColor(...GREEN_RGB); doc.roundedRect(margin, y-4, contentW, 7, 1.5, 1.5, 'F')
          doc.setFontSize(9); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
          doc.text(sec.heading.toUpperCase(), margin+4, y+0.5); y += 9
          body(sec.content); y += 4
        })
        doc.save(`${res.title.replace(/[^a-z0-9]/gi, '_')}.pdf`)
      } else if (format === 'docx') {
        await loadScript('https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
        const { Document, Packer, Paragraph, TextRun, ShadingType, AlignmentType } = window.docx
        const saveAs = window.saveAs || (window.FileSaver && window.FileSaver.saveAs)
        const children = [
          new Paragraph({ children: [new TextRun({ text: res.title, bold: true, color: '1E2433', size: 36 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: res.meta||'', color: '5F5E5A', size: 18, italics: true })], spacing: { after: 400 } }),
          ...(res.sections?.flatMap(sec => [
            new Paragraph({ children: [new TextRun({ text: sec.heading, bold: true, color: 'FFFFFF', size: 22 })], shading: { type: ShadingType.SOLID, color: '1D9E75' }, spacing: { before: 300, after: 140 }, indent: { left: 100, right: 100 } }),
            new Paragraph({ children: [new TextRun({ text: sec.content, color: '5F5E5A', size: 20 })], spacing: { after: 200 }, indent: { left: 100 } }),
          ]) || []),
          new Paragraph({ children: [new TextRun({ text: 'Generated by TeachReads', color: 'B4B2A9', size: 16, italics: true })], spacing: { before: 600 }, alignment: AlignmentType.CENTER }),
        ]
        const docFile = new Document({ sections: [{ properties: {}, children }] })
        const blob = await Packer.toBlob(docFile)
        saveAs(blob, `${res.title.replace(/[^a-z0-9]/gi, '_')}.docx`)
      }
    } catch(e) { console.error('Download error:', e) }
    setDownloading(null)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button ref={btnRef} onClick={openDropdown} disabled={!!downloading}
        style={{ height: 26, padding: '0 8px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: MUTED, cursor: downloading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {downloading ? '⏳' : '⬇'}
      </button>
      {open && (
        <div style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, transform: 'translate(-100%, -100%)', background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 9999 }}>
          <div style={{ padding: '7px 12px 5px', fontSize: 10, color: MUTED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `0.5px solid ${BORDER}` }}>Download as</div>
          {[['pdf','📄 PDF','Print-ready'],['docx','📝 Word','Editable'],['txt','📃 Text','Plain text']].map(([id,label,desc]) => (
            <div key={id} onClick={() => handle(id)}
              style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 10, color: MUTED }}>{desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ResourcesPage({ onNavigate, checkTrial }) {
  const [tab, setTab] = useState('adhoc') // 'adhoc' | 'plan' | 'catalogue'
  const [catalogue, setCatalogue] = useState([])
  const [catalogueLoading, setCatalogueLoading] = useState(false)
  const [catalogueSearch, setCatalogueSearch] = useState('')
  const [catalogueType, setCatalogueType] = useState('All')
  const [catalogueSubject, setCatalogueSubject] = useState('All')
  const [catalogueYear, setCatalogueYear] = useState('All')
  const [viewingResource, setViewingResource] = useState(null)

  async function loadCatalogue() {
    setCatalogueLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (!error) setCatalogue(data || [])
    else console.error('loadCatalogue error:', error)
    setCatalogueLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tab === 'catalogue') loadCatalogue() }, [tab])

  // Plan-based state
  const [realPlans, setRealPlans] = useState([])
  const [selectedPlanGroup, setSelectedPlanGroup] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [selectedResourceType, setSelectedResourceType] = useState(null)
  const [planSearch, setPlanSearch] = useState('')
  const [planFilterSubject, setPlanFilterSubject] = useState('All')
  const [planFilterYear, setPlanFilterYear] = useState('All')
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false)
  const [realLessons, setRealLessons] = useState([])

  useEffect(() => {
    if (!selectedPlan?.id) { setRealLessons([]); return }
    supabase.from('lessons')
      .select('lesson_number, title, type, learning_intention')
      .eq('plan_id', selectedPlan.id)
      .order('lesson_number')
      .then(({ data }) => { if (data) setRealLessons(data) })
  }, [selectedPlan?.id])

  useEffect(() => {
    async function loadRealPlans() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: plans } = await supabase
        .from('plans')
        .select('id, title, subject, year_group, lesson_count, book_title, book_author')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      if (plans) {
        // Group by book into same shape as DUMMY_PLANS
        const groups = []
        plans.forEach(plan => {
          const existing = groups.find(g => g.book.title === plan.book_title)
          const planEntry = { id: plan.id, title: plan.title, subject: plan.subject, lessons: plan.lesson_count, topic: plan.title }
          if (existing) { existing.plans.push(planEntry) }
          else { groups.push({ book: { title: plan.book_title, author: plan.book_author || '', emoji: '📚' }, yearGroup: plan.year_group, plans: [planEntry] }) }
        })
        setRealPlans(groups)
      }
    }
    loadRealPlans()
  }, [])

  // Ad-hoc state
  const [prompt, setPrompt] = useState('')

  // Shared state
  const [generating, setGenerating] = useState(false)
  const [resource, setResource] = useState(null)
  const [error, setError] = useState('')

  async function generateFromPlan() {
    if (!selectedPlan || !selectedLesson || !selectedResourceType) return
    const allowed = await checkTrial?.('resources')
    if (allowed === false) return
    setGenerating(true); setError(''); setResource(null)
    const rt = RESOURCE_TYPES.find(r => r.id === selectedResourceType)
    const apiPrompt = `You are an expert UK primary school teacher creating a classroom resource.

Book: "${selectedPlanGroup.book.title}" by ${selectedPlanGroup.book.author}
Year group: ${selectedPlanGroup.yearGroup}
Subject: ${selectedPlan.subject}
Lesson: ${selectedLesson.title}
Learning intention: ${selectedLesson.learningIntention || ''}
Resource type: ${rt.label} — ${rt.desc}

Generate a complete, classroom-ready ${rt.label} resource directly tied to this lesson. Return ONLY a valid JSON object with no extra text or markdown fences:

{
  "title": "resource title",
  "meta": "brief one-line description e.g. Year 4 · History · Roman Mosaic Patterns",
  "sections": [
    { "heading": "section heading", "content": "full section content — be detailed and classroom-ready" }
  ]
}

For worksheets: include Below Expectation, At Expectation and Above Expectation sections with differentiated tasks.
For vocab cards: list each term as Term: [word] — Definition: [meaning].
For knowledge organisers: include Key Facts, Key People/Vocabulary, and Key Dates/Events sections.
For all other types: use appropriate sections for the resource type.`

    try {
      const result = await callAPI(apiPrompt, true)
      setResource(result)
      // Save resource to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('resources').insert({
            user_id: user.id,
            plan_id: selectedPlan?.id || null,
            title: result.title,
            meta: result.meta,
            resource_type: selectedResourceType,
            sections: result.sections,
            prompt: apiPrompt,
          })
          loadCatalogue()
        }
      } catch (e) { console.error('Plan resource save error:', JSON.stringify(e)); }
    } catch (err) { console.error('generateFromPlan error:', err); setError('Something went wrong. Please try again.') }
    setGenerating(false)
  }

  async function generateAdhoc() {
    if (!prompt.trim()) return
    const allowed = await checkTrial?.('resources')
    if (allowed === false) return
    setGenerating(true); setError(''); setResource(null)
    const apiPrompt = `You are an expert UK primary school teacher creating a classroom resource.

Teacher request: ${prompt}

Generate a complete, classroom-ready resource based on this request. Return ONLY a valid JSON object with no extra text or markdown fences:

{
  "title": "resource title",
  "meta": "brief one-line description",
  "sections": [
    { "heading": "section heading", "content": "full detailed classroom-ready content" }
  ]
}

Be detailed and practical. If a worksheet is requested, differentiate for different abilities. If specific year group or subject is mentioned, align to the UK National Curriculum.`

    try {
      const result = await callAPI(apiPrompt, true)
      setResource(result)
      // Save resource to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('resources').insert({
            user_id: user.id,
            title: result.title,
            meta: result.meta,
            resource_type: 'adhoc',
            sections: result.sections,
            prompt: prompt,
          })
          loadCatalogue()
        }
      } catch (e) { console.error('Adhoc resource save error:', JSON.stringify(e)); }
    } catch (err) { console.error('generateAdhoc error:', err); setError('Something went wrong. Please try again.') }
    setGenerating(false)
  }

  const EXAMPLE_PROMPTS = [
    "Create a maths worksheet for Year 4 on multiplication, differentiated for below, at and above expectation",
    "Make a Year 2 phonics activity focusing on the 'igh' sound with pictures and tracing",
    "Create a science knowledge organiser for Year 5 on the water cycle",
    "Generate a Year 6 reading comprehension passage and questions about the Vikings",
    "Create a PSHE discussion activity for Year 3 about feelings and emotions",
  ]

  const tabBtn = (id, label, emoji) => (
    <button onClick={() => { setTab(id); setResource(null); setError('') }}
      style={{ flex: 1, height: 42, border: "none", borderBottom: tab === id ? `2px solid ${GREEN}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: tab === id ? 600 : 400, color: tab === id ? GREEN : MUTED, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {emoji} {label}
    </button>
  )

  // Plan tab computed values (moved out of IIFE)
  const allPlans = realPlans.flatMap(group => group.plans.map(plan => ({ ...plan, group })))
  const planSubjects = ['All', ...Array.from(new Set(allPlans.map(p => p.subject))).sort()]
  const planYears = ['All', ...Array.from(new Set(allPlans.map(p => p.group.yearGroup))).sort()]
  const filteredPlans = allPlans.filter(p => {
    if (planFilterSubject !== 'All' && p.subject !== planFilterSubject) return false
    if (planFilterYear !== 'All' && p.group.yearGroup !== planFilterYear) return false
    if (planSearch && !p.title.toLowerCase().includes(planSearch.toLowerCase()) &&
        !p.group.book.title.toLowerCase().includes(planSearch.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.75rem" }}>
          <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>🛠️</div>
          <div>
            <h1 style={s.h1}>My Resources</h1>
            <p style={s.headerSub}>Generate and browse all your classroom resources</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ display: "flex", borderBottom: `0.5px solid ${BORDER}` }}>
            {tabBtn('adhoc', 'Quick resource', '⚡')}
            {tabBtn('plan', 'From a plan', '📋')}
            {tabBtn('catalogue', 'My catalogue', '📂')}
          </div>

          <div style={{ padding: "20px" }}>

            {/* ── Ad-hoc tab ── */}
            {tab === 'adhoc' && (
              <div>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.6 }}>
                  Describe the resource you need. Be as specific as you like — include year group, subject, topic, and any differentiation requirements.
                </p>
                <textarea
                  style={{ ...s.textarea, height: 100, borderRadius: 8, borderBottom: `0.5px solid ${BORDER}`, marginBottom: 10, fontSize: 14 }}
                  placeholder='e.g. "Create a maths worksheet for Year 4 on multiplication, differentiated for below, at and above expectation"'
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
                {/* Example prompts */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginBottom: 6 }}>EXAMPLE PROMPTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {EXAMPLE_PROMPTS.map((ex, i) => (
                      <div key={i} onClick={() => setPrompt(ex)}
                        style={{ fontSize: 12, color: GREEN, cursor: "pointer", padding: "6px 10px", background: LIGHT_GREEN, borderRadius: 6, lineHeight: 1.5 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#d1f0e6'}
                        onMouseLeave={e => e.currentTarget.style.background = LIGHT_GREEN}>
                        ⚡ {ex}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={generateAdhoc}
                  disabled={generating || !prompt.trim()}
                  style={s.submitBtn(generating || !prompt.trim())}
                >
                  {generating ? '⏳ Generating resource...' : '✨ Generate resource'}
                </button>
              </div>
            )}

            {/* ── Plan-based tab ── */}
            {tab === 'plan' && (() => {

              // Use realLessons from component state (loaded via useEffect)
              const lessonContext = realLessons.length > 0
                ? realLessons.map(l => ({ num: l.lesson_number, title: l.title, type: l.type, intention: l.learning_intention || '' }))
                : Array.from({ length: selectedPlan?.lessons || 0 }, (_, i) => ({ num: i+1, title: `Lesson ${i+1}`, type: '', intention: '' }))

              const typeColors = { Explore: '#7C5CBF', Analyse: '#1D6FA8', Teach: '#1D9E75', Practise: '#D97706', Apply: '#DC6B3A', Create: '#B91C78' }
              const typeBgs = { Explore: '#F3EEFF', Analyse: '#E8F4FF', Teach: '#E1F5EE', Practise: '#FEF3C7', Apply: '#FEF0E8', Create: '#FCE7F3' }

              return (
                <div>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.6 }}>
                    Select a plan, choose a lesson, then pick what type of resource to generate. The AI will use the full lesson context to create something tailored.
                  </p>

                  {/* Step 1 — Pick a plan with search + filters + dropdown */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Step 1 — Select a plan
                    </div>

                    {/* Filter row */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
                        <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: MUTED }}>🔍</span>
                        <input
                          style={{ ...s.input, height: 32, fontSize: 12, paddingLeft: 28 }}
                          placeholder="Search plans or books..."
                          value={planSearch}
                          onChange={e => { setPlanSearch(e.target.value); setPlanDropdownOpen(true) }}
                          onFocus={() => setPlanDropdownOpen(true)}
                        />
                      </div>
                      <select value={planFilterSubject} onChange={e => { setPlanFilterSubject(e.target.value); setPlanDropdownOpen(true) }}
                        style={{ height: 32, fontSize: 12, borderRadius: 8, border: `0.5px solid ${planFilterSubject !== 'All' ? GREEN : BORDER}`, padding: "0 10px", background: planFilterSubject !== 'All' ? LIGHT_GREEN : BG, color: planFilterSubject !== 'All' ? '#085041' : TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                        {planSubjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
                      </select>
                      <select value={planFilterYear} onChange={e => { setPlanFilterYear(e.target.value); setPlanDropdownOpen(true) }}
                        style={{ height: 32, fontSize: 12, borderRadius: 8, border: `0.5px solid ${planFilterYear !== 'All' ? GREEN : BORDER}`, padding: "0 10px", background: planFilterYear !== 'All' ? LIGHT_GREEN : BG, color: planFilterYear !== 'All' ? '#085041' : TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                        {planYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
                      </select>
                    </div>

                    {/* Selected plan display or dropdown */}
                    {selectedPlan && !planDropdownOpen ? (
                      <div style={{ padding: "10px 14px", borderRadius: 8, border: `0.5px solid ${GREEN}`, background: LIGHT_GREEN, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: GREEN, color: "#fff" }}>{selectedPlan.subject}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#085041" }}>{selectedPlan.title}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{selectedPlanGroup.book.title} · {selectedPlanGroup.yearGroup} · {selectedPlan.lessons} lessons</div>
                        </div>
                        <button onClick={() => { setPlanDropdownOpen(true); setSelectedPlan(null); setSelectedLesson(null) }}
                          style={{ fontSize: 11, color: MUTED, background: "none", border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Change
                        </button>
                      </div>
                    ) : (
                      <div style={{ border: `0.5px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
                        {filteredPlans.length === 0 ? (
                          <div style={{ padding: "1rem", textAlign: "center", color: MUTED, fontSize: 13 }}>No plans match your filters</div>
                        ) : filteredPlans.map(plan => (
                          <div key={plan.id}
                            onClick={() => { setSelectedPlanGroup(plan.group); setSelectedPlan(plan); setSelectedLesson(null); setPlanDropdownOpen(false) }}
                            style={{ padding: "10px 14px", borderBottom: `0.5px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: BG }}
                            onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
                            onMouseLeave={e => e.currentTarget.style.background = BG}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: PAGE_BG, color: MUTED, flexShrink: 0 }}>{plan.subject}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{plan.title}</div>
                              <div style={{ fontSize: 11, color: MUTED }}>{plan.group.book.title} · {plan.group.yearGroup} · {plan.lessons} lessons</div>
                            </div>
                            <span style={{ fontSize: 12, color: GREEN, flexShrink: 0 }}>Select →</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 2 — Pick a lesson with context */}
                  {selectedPlan && !planDropdownOpen && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                        Step 2 — Select a lesson
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {lessonContext.map(lesson => {
                          const isSelected = selectedLesson?.num === lesson.num
                          const tc = typeColors[lesson.type] || GREEN
                          const tb = typeBgs[lesson.type] || LIGHT_GREEN
                          return (
                            <div key={lesson.num}
                              onClick={() => setSelectedLesson(lesson)}
                              style={{ padding: "10px 14px", borderRadius: 8, border: `0.5px solid ${isSelected ? GREEN : BORDER}`, background: isSelected ? LIGHT_GREEN : BG, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}>
                              {/* Lesson number */}
                              <div style={{ width: 28, height: 28, background: isSelected ? GREEN : PAGE_BG, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isSelected ? "#fff" : MUTED, flexShrink: 0, marginTop: 1 }}>
                                {lesson.num}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: isSelected ? "#085041" : TEXT }}>{lesson.title}</span>
                                  <span style={{ fontSize: 10, fontWeight: 600, color: tc, background: tb, padding: "1px 7px", borderRadius: 20 }}>{lesson.type}</span>
                                </div>
                                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>
                                  <span style={{ fontWeight: 500 }}>Learning intention: </span>{lesson.intention}
                                </div>
                              </div>
                              {isSelected && <span style={{ color: GREEN, fontSize: 16, flexShrink: 0, marginTop: 4 }}>✓</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Pick resource type */}
                  {selectedLesson && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                        Step 3 — Choose resource type
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                        {RESOURCE_TYPES.map(rt => {
                          const isSelected = selectedResourceType === rt.id
                          return (
                            <div key={rt.id}
                              onClick={() => setSelectedResourceType(rt.id)}
                              style={{ padding: "10px 12px", borderRadius: 8, border: `0.5px solid ${isSelected ? GREEN : BORDER}`, background: isSelected ? LIGHT_GREEN : BG, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <span style={{ fontSize: 20, flexShrink: 0 }}>{rt.emoji}</span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? "#085041" : TEXT }}>{rt.label}</div>
                                <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{rt.desc}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Generate button */}
                  {selectedResourceType && (
                    <button onClick={generateFromPlan} disabled={generating} style={s.submitBtn(generating)}>
                      {generating ? '⏳ Generating resource...' : '✨ Generate resource'}
                    </button>
                  )}
                </div>
              )
            })()}

          {/* ── Catalogue tab ── */}
            {tab === 'catalogue' && (
              <div>
                {/* Filter bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'nowrap' }}>
                  <span style={{ fontSize: 15, color: MUTED, flexShrink: 0 }}>🔍</span>
                  <input
                    style={{ flex: 1, minWidth: 0, height: 28, border: 'none', outline: 'none', fontSize: 13, color: TEXT, background: 'transparent', fontFamily: "'DM Sans', sans-serif" }}
                    placeholder="Search your resources..."
                    value={catalogueSearch}
                    onChange={e => setCatalogueSearch(e.target.value)}
                  />
                  {catalogueSearch && <span onClick={() => setCatalogueSearch('')} style={{ fontSize: 13, color: MUTED, cursor: 'pointer', flexShrink: 0 }}>✕</span>}
                  <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${catalogueType !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: catalogueType !== 'All' ? LIGHT_GREEN : BG, color: catalogueType !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none', flexShrink: 0 }}
                    value={catalogueType} onChange={e => setCatalogueType(e.target.value)}>
                    <option value="All">All types</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="starter">Lesson starter</option>
                    <option value="exit_ticket">Exit ticket</option>
                    <option value="writing_frame">Writing frame</option>
                    <option value="knowledge_org">Knowledge organiser</option>
                    <option value="vocab_cards">Vocabulary cards</option>
                    <option value="comprehension">Reading comprehension</option>
                    <option value="adhoc">Quick resource</option>
                  </select>
                  <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${catalogueSubject !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: catalogueSubject !== 'All' ? LIGHT_GREEN : BG, color: catalogueSubject !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none', flexShrink: 0 }}
                    value={catalogueSubject} onChange={e => setCatalogueSubject(e.target.value)}>
                    <option value="All">All subjects</option>
                    {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select style={{ height: 28, fontSize: 12, border: `0.5px solid ${catalogueYear !== 'All' ? GREEN : BORDER}`, borderRadius: 20, padding: '0 10px', background: catalogueYear !== 'All' ? LIGHT_GREEN : BG, color: catalogueYear !== 'All' ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", outline: 'none', flexShrink: 0 }}
                    value={catalogueYear} onChange={e => setCatalogueYear(e.target.value)}>
                    <option value="All">All years</option>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <span onClick={loadCatalogue} title="Refresh" style={{ fontSize: 13, color: MUTED, cursor: 'pointer', flexShrink: 0 }}>↺</span>
                </div>

                {catalogueLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: MUTED, fontSize: 13 }}>Loading your resources...</div>
                ) : (() => {
                  const filtered = catalogue.filter(r => {
                    if (catalogueType !== 'All' && r.resource_type !== catalogueType) return false
                    if (catalogueSubject !== 'All' && !(r.meta || '').toLowerCase().includes(catalogueSubject.toLowerCase())) return false
                    if (catalogueYear !== 'All' && !(r.meta || '').toLowerCase().includes(catalogueYear.toLowerCase())) return false
                    if (catalogueSearch && !r.title.toLowerCase().includes(catalogueSearch.toLowerCase()) &&
                        !(r.meta || '').toLowerCase().includes(catalogueSearch.toLowerCase())) return false
                    return true
                  })
                  const typeLabels = { worksheet: 'Worksheet', starter: 'Lesson starter', exit_ticket: 'Exit ticket', writing_frame: 'Writing frame', knowledge_org: 'Knowledge organiser', vocab_cards: 'Vocabulary cards', comprehension: 'Reading comprehension', adhoc: 'Quick resource' }
                  const typeColors = { worksheet: { bg: '#EEF2FF', color: '#3730A3' }, starter: { bg: '#FEF3C7', color: '#92400E' }, exit_ticket: { bg: '#ECFDF5', color: '#065F46' }, writing_frame: { bg: '#FCE7F3', color: '#9D174D' }, knowledge_org: { bg: '#EFF6FF', color: '#1E40AF' }, vocab_cards: { bg: '#FDF4FF', color: '#7E22CE' }, comprehension: { bg: '#FFF7ED', color: '#9A3412' }, adhoc: { bg: PAGE_BG, color: MUTED } }

                  if (filtered.length === 0) return (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: MUTED }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 6 }}>
                        {catalogue.length === 0 ? 'No resources yet' : 'No resources match your filters'}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        {catalogue.length === 0 ? 'Generate a resource using Quick resource or From a plan to see it here.' : 'Try adjusting your search or type filter.'}
                      </div>
                    </div>
                  )

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {filtered.map(res => {
                        const tc = typeColors[res.resource_type] || { bg: PAGE_BG, color: MUTED }
                        const isViewing = viewingResource?.id === res.id
                        return (
                          <div key={res.id} style={{ border: `0.5px solid ${isViewing ? GREEN : BORDER}`, borderRadius: 10, background: BG, overflow: 'hidden' }}>
                            {/* Row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
                              onClick={() => setViewingResource(isViewing ? null : res)}>
                              <span style={{ fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {typeLabels[res.resource_type] || res.resource_type}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
                                <div style={{ fontSize: 11, color: MUTED }}>{res.meta} · {new Date(res.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <button
                                  onClick={e => { e.stopPropagation(); setViewingResource(isViewing ? null : res) }}
                                  style={{ height: 26, padding: '0 10px', background: isViewing ? LIGHT_GREEN : PAGE_BG, border: `0.5px solid ${isViewing ? GREEN : BORDER}`, borderRadius: 6, fontSize: 11, fontWeight: 500, color: isViewing ? '#085041' : TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                                  {isViewing ? 'Hide' : 'View'}
                                </button>
                                <ResourceDownloadButton resource={res} />
                              </div>
                            </div>
                            {/* Expanded view */}
                            {isViewing && (
                              <div style={{ borderTop: `0.5px solid ${BORDER}` }}>
                                {(res.sections || []).map((sec, i) => (
                                  <div key={i} style={{ borderTop: i > 0 ? `0.5px solid ${BORDER}` : 'none' }}>
                                    <div style={{ background: LIGHT_GREEN, padding: '6px 14px', fontSize: 10, fontWeight: 600, color: '#085041', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sec.heading}</div>
                                    <div style={{ padding: '10px 14px', background: BG, fontSize: 13, color: TEXT, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{sec.content}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            )}

          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13, marginBottom: 12 }}>{error}</div>
        )}

        {/* Output */}
        {resource && <ResourceOutput resource={resource} />}

        <div style={s.footer}>TeachReads · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── My Books Page ─────────────────────────────────────────────────────────────
// (merged My Books + My Library into one page with 3 sections)

// ── Plans Modal ───────────────────────────────────────────────────────────────

function StripeCheckoutButton({ plan, label, style }) {
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

function UpgradeSuccessPage({ onNavigate }) {
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
function UpgradePage({ onNavigate, trialInfo }) {
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

function ProfileModal({ session, onClose, onUpdated }) {
  const [pmUserId, setPmUserId] = useState(session?.user?.id || null)
  const [pmUserEmail, setPmUserEmail] = useState(session?.user?.email || '')
  const [activeTab, setActiveTab] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'success'|'error', text }
  const [pmAvatarUrl, setPmAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Personal
  const [pmDisplayName, setPmDisplayName] = useState(session?.user?.user_metadata?.display_name || '')
  const [newEmail, setNewEmail] = useState(session?.user?.email || '')

  // School
  const [schoolName, setSchoolName] = useState('')
  const [region, setRegion] = useState('')
  const [yearGroups, setYearGroups] = useState([])

  // Preferences
  const [defaultYear, setDefaultYear] = useState('')
  const [defaultSubject, setDefaultSubject] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Delete account
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    const uid = user?.id || pmUserId
    if (!uid) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) {
      setSchoolName(data.school || '')
      setRegion(data.region || '')
      setYearGroups(data.year_groups || [])
      setDefaultYear(data.default_year || '')
      setDefaultSubject(data.default_subject || '')
      setPmAvatarUrl(data.avatar_url || null)
    } else if (error) {
      await supabase.from('profiles').upsert({ id: uid, display_name: user?.user_metadata?.display_name || '' })
    }
  }

  function flash(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  async function savePersonal() {
    setSaving(true)
    try {
      // Update display name
      const { error: authErr } = await supabase.auth.updateUser({ data: { display_name: pmDisplayName } })
      if (authErr) throw authErr
      // Update email if changed
      if (newEmail !== pmUserEmail) {
        const { error: emailErr } = await supabase.auth.updateUser({ email: newEmail })
        if (emailErr) throw emailErr
        flash('success', 'Profile updated. Check your new email to confirm the change.')
      } else {
        flash('success', 'Profile updated successfully.')
      }
      onUpdated && onUpdated(pmDisplayName)
    } catch (e) { flash('error', e.message || 'Could not update profile.') }
    setSaving(false)
  }

  async function saveSchool() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: pmUserId,
        school: schoolName,
        region,
        year_groups: yearGroups,
        default_year: defaultYear,
        default_subject: defaultSubject,
      })
      if (error) throw error
      flash('success', 'School details saved.')
    } catch (e) { flash('error', e.message || 'Could not save school details.') }
    setSaving(false)
  }

  async function savePreferences() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: pmUserId,
        default_year: defaultYear,
        default_subject: defaultSubject,
      })
      if (error) throw error
      flash('success', 'Preferences saved.')
    } catch (e) { flash('error', e.message || 'Could not save preferences.') }
    setSaving(false)
  }

  async function changePassword() {
    if (newPassword.length < 6) { flash('error', 'Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { flash('error', 'Passwords do not match.'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      flash('success', 'Password updated successfully.')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (e) { flash('error', e.message || 'Could not update password.') }
    setSaving(false)
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { flash('error', 'Image must be under 2MB.'); return }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${pmUserId}/avatar.${ext}`
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      // Store clean URL in DB, add cache-bust only for immediate display
      await supabase.from('profiles').upsert({ id: pmUserId, avatar_url: publicUrl })
      const displayUrl = `${publicUrl}?t=${Date.now()}`
      setPmAvatarUrl(displayUrl)
      onUpdated && onUpdated(pmDisplayName, displayUrl)
      flash('success', 'Profile picture updated.')
    } catch (e) {
      console.error('Avatar upload error:', e)
      flash('error', e.message || 'Could not upload image.')
    }
    setUploading(false)
  }

  async function removeAvatar() {
    setUploading(true)
    try {
      // Remove from storage - try common extensions
      const cleanUrl = pmAvatarUrl?.split('?')[0] || ''
      const ext = cleanUrl.split('.').pop() || 'jpg'
      await supabase.storage.from('avatars').remove([`${pmUserId}/avatar.${ext}`])
      // Clear from profile
      await supabase.from('profiles').upsert({ id: pmUserId, avatar_url: null })
      setPmAvatarUrl(null)
      onUpdated && onUpdated(pmDisplayName, '')
      flash('success', 'Profile picture removed.')
    } catch (e) {
      flash('error', 'Could not remove photo.')
    }
    setUploading(false)
  }

  async function deleteAccount() {
    if (deleteText !== 'DELETE') return
    try {
      await supabase.from('profiles').delete().eq('id', pmUserId)
      await supabase.auth.signOut()
    } catch (e) { flash('error', 'Could not delete account. Please contact support.') }
  }

  function toggleYearGroup(yg) {
    setYearGroups(prev => prev.includes(yg) ? prev.filter(y => y !== yg) : [...prev, yg])
  }

  const inputStyle = { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 12px', fontSize: 13, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  const selectStyle = { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 12px', fontSize: 13, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }
  const labelStyle = { fontSize: 12, fontWeight: 500, color: MUTED, display: 'block', marginBottom: 5 }
  const saveBtn = (onClick, label) => (
    <button onClick={onClick} disabled={saving}
      style={{ height: 36, padding: '0 16px', background: saving ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
      {saving ? 'Saving...' : label}
    </button>
  )

  const tabs = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'school', label: '🏫 School' },
    { id: 'preferences', label: '⚙️ Preferences' },
    { id: 'password', label: '🔑 Password' },
    { id: 'account', label: '🗑️ Account' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Profile settings</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar tabs */}
          <div style={{ width: 140, borderRight: `0.5px solid ${BORDER}`, flexShrink: 0, padding: '8px 0' }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => { setActiveTab(t.id); setMsg(null) }}
                style={{ padding: '9px 16px', fontSize: 13, cursor: 'pointer', color: activeTab === t.id ? GREEN : TEXT, fontWeight: activeTab === t.id ? 600 : 400, background: activeTab === t.id ? LIGHT_GREEN : 'transparent', borderLeft: activeTab === t.id ? `2px solid ${GREEN}` : '2px solid transparent' }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {msg && (
              <div style={{ background: msg.type === 'success' ? LIGHT_GREEN : '#FCEBEB', color: msg.type === 'success' ? '#085041' : '#A32D2D', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}>
                {msg.text}
              </div>
            )}

            {/* ── Personal ── */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: LIGHT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: `0.5px solid ${BORDER}` }}>
                    {pmAvatarUrl ? <img src={pmAvatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26, fontWeight: 600, color: GREEN }}>{(pmDisplayName || 'T')[0].toUpperCase()}</span>}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <label style={{ height: 32, padding: '0 12px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontWeight: 500, color: TEXT, cursor: uploading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: uploading ? 0.6 : 1 }}>
                        {uploading ? 'Uploading...' : '📷 Change photo'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadAvatar} disabled={uploading} />
                      </label>
                      {pmAvatarUrl && (
                        <button onClick={removeAvatar} disabled={uploading}
                          style={{ height: 32, padding: '0 12px', background: '#FCEBEB', border: `0.5px solid #A32D2D`, borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>JPG or PNG, max 2MB</div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Display name</label>
                  <input style={inputStyle} value={pmDisplayName} onChange={e => setPmDisplayName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input style={inputStyle} type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="your@school.co.uk" />
                  {newEmail !== pmUserEmail && <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>You'll receive a confirmation email at the new address.</div>}
                </div>
                {saveBtn(savePersonal, 'Save changes')}
              </div>
            )}

            {/* ── School ── */}
            {activeTab === 'school' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>School name</label>
                  <input style={inputStyle} value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. St Mary's Primary School" />
                </div>
                <div>
                  <label style={labelStyle}>Region</label>
                  <select style={selectStyle} value={region} onChange={e => setRegion(e.target.value)}>
                    <option value="">Select region...</option>
                    <option value="england">England</option>
                    <option value="wales">Wales</option>
                    <option value="scotland">Scotland</option>
                    <option value="northern_ireland">Northern Ireland</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year groups I teach</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(yg => (
                      <span key={yg} onClick={() => toggleYearGroup(yg)}
                        style={{ padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${yearGroups.includes(yg) ? GREEN : BORDER}`, fontSize: 12, fontWeight: yearGroups.includes(yg) ? 600 : 400, color: yearGroups.includes(yg) ? '#085041' : MUTED, background: yearGroups.includes(yg) ? LIGHT_GREEN : BG, cursor: 'pointer', userSelect: 'none' }}>
                        {yg}
                      </span>
                    ))}
                  </div>
                </div>
                {saveBtn(saveSchool, 'Save school details')}
              </div>
            )}

            {/* ── Preferences ── */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>These defaults pre-fill the dropdowns across the app to save time.</p>
                <div>
                  <label style={labelStyle}>Default year group</label>
                  <select style={selectStyle} value={defaultYear} onChange={e => setDefaultYear(e.target.value)}>
                    <option value="">No default</option>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Default subject</label>
                  <select style={selectStyle} value={defaultSubject} onChange={e => setDefaultSubject(e.target.value)}>
                    <option value="">No default</option>
                    {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {saveBtn(savePreferences, 'Save preferences')}
              </div>
            )}

            {/* ── Password ── */}
            {activeTab === 'password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Choose a strong password of at least 6 characters.</p>
                <div>
                  <label style={labelStyle}>New password</label>
                  <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
                </div>
                <div>
                  <label style={labelStyle}>Confirm new password</label>
                  <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                  {confirmPassword && newPassword !== confirmPassword && <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4 }}>Passwords do not match</div>}
                </div>
                {saveBtn(changePassword, 'Update password')}
                <div style={{ borderTop: `0.5px solid ${BORDER}`, paddingTop: 14, marginTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 6 }}>Forgotten your password?</div>
                  <button onClick={async () => {
                    const { error } = await supabase.auth.resetPasswordForEmail(pmUserEmail)
                    if (!error) flash('success', `Reset link sent to ${pmUserEmail}`)
                    else flash('error', 'Could not send reset email.')
                  }}
                    style={{ height: 34, padding: '0 14px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Send reset email
                  </button>
                </div>
              </div>
            )}

            {/* ── Account ── */}
            {activeTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#FCEBEB', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#7F1D1D', marginBottom: 6 }}>⚠️ Delete account</div>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6, marginBottom: 12 }}>
                    This will permanently delete your account, all your plans, resources and library books. This cannot be undone.
                  </p>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      style={{ height: 34, padding: '0 14px', background: '#FEE2E2', border: `0.5px solid #A32D2D`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Delete my account
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: 13, color: '#991B1B' }}>Type <strong>DELETE</strong> to confirm:</div>
                      <input style={{ ...inputStyle, borderColor: '#A32D2D' }} value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="DELETE" />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={deleteAccount} disabled={deleteText !== 'DELETE'}
                          style={{ height: 34, padding: '0 14px', background: deleteText === 'DELETE' ? '#A32D2D' : '#888780', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: deleteText === 'DELETE' ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                          Confirm deletion
                        </button>
                        <button onClick={() => { setConfirmDelete(false); setDeleteText('') }}
                          style={{ height: 34, padding: '0 14px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Upgrade Success Page ─────────────────────────────────────────────────────

function AdminDashboard({ onNavigate, userEmail }) {
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

function ContactModal({ onClose }) {
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

function LegalPage({ type, onClose }) {
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

function AuthPage({ onAuth, onLegal }) {
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

// TeachReads App v2

export default function App() {
  const [session, setSession] = useState(undefined)
  const [page, setPage] = useState('search')
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [trialInfo, setTrialInfo] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [legalPage, setLegalPage] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedIdeas, setSelectedIdeas] = useState([])
  const [searchState, setSearchState] = useState({
    subject: '', topic: '', yearGroup: '', focus: '',
    accordionOpen: false, contentType: 'Any', bookType: 'Any', readingLevel: 'Any', starRating: 0,
    books: [], loading: false, loadingMore: false, error: '', searched: false, searchMeta: {},
  })

  useEffect(() => {
    // Handle Stripe success redirect
    const params = new URLSearchParams(window.location.search)
    const isSuccess = params.get('session_id')
    if (isSuccess) {
      window.history.replaceState({}, '', '/')
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadProfilePreferences(session.user.id)
        if (isSuccess) {
          setPage('upgrade_success')
          // Poll for webhook update — retry a few times
          let attempts = 0
          const poll = setInterval(async () => {
            attempts++
            await loadProfilePreferences(session.user.id)
            if (attempts >= 5) clearInterval(poll)
          }, 2000)
        }
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfilePreferences(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfilePreferences(userId) {
    try {
    const { data } = await supabase.from('profiles').select('default_year, default_subject, display_name, avatar_url, plan, trial_expires_at').eq('id', userId).single()
    if (data) {
      if (data.display_name) setDisplayName(data.display_name)
      if (data.avatar_url) setAvatarUrl(`${data.avatar_url}?t=${Date.now()}`)
      setSearchState(prev => ({
        ...prev,
        yearGroup: data.default_year || prev.yearGroup,
        subject: data.default_subject || prev.subject,
      }))
      const plan = data.plan || 'trial'
      const expiresAt = data.trial_expires_at ? new Date(data.trial_expires_at) : null
      const now = new Date()
      const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))) : 0
      const expired = plan === 'trial' && expiresAt && now > expiresAt
      const { data: usage } = await supabase.from('usage_counts').select('*').eq('user_id', userId).single()
      setTrialInfo({ plan, daysLeft, expired, usage: usage || {} })
    }
    } catch(e) { console.error('loadProfilePreferences error:', e) }
  }

  async function checkTrial(action) {
    if (!trialInfo) return true
    const { plan } = trialInfo
    if (plan === 'premium') return true
    if (plan === 'trial' && trialInfo.expired) { setPage('upgrade'); return false }
    const limits = plan === 'premium' ? PREMIUM_LIMITS : plan === 'basic' ? BASIC_LIMITS : TRIAL_LIMITS
    const limit = limits[action] || 999
    let usage = trialInfo.usage
    if (plan === 'basic') {
      const resetAt = trialInfo.usage.reset_at ? new Date(trialInfo.usage.reset_at) : null
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      if (!resetAt || resetAt < monthStart) {
        const { data: { user } } = await supabase.auth.getUser()
        const freshUsage = { user_id: user.id, book_searches: 0, load_mores: 0, lesson_ideas: 0, units_of_work: 0, resources: 0, reset_at: monthStart.toISOString() }
        await supabase.from('usage_counts').upsert(freshUsage)
        usage = freshUsage
        setTrialInfo(prev => ({ ...prev, usage: freshUsage }))
      }
    }
    const count = usage[action] || 0
    if (count >= limit) { setPage('upgrade'); return false }
    const { data: { user } } = await supabase.auth.getUser()
    const newUsage = { ...usage, [action]: count + 1 }
    await supabase.from('usage_counts').upsert({ user_id: user.id, ...newUsage })
    setTrialInfo(prev => ({ ...prev, usage: newUsage }))
    return true
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setSession(null)
    setPage('search')
    setTrialInfo(null)
    setDisplayName('')
    setAvatarUrl('')
  }

  function handleNavigate(dest) {
    if (dest === 'search') setPage('search')
    if (dest === 'plans') setPage('plans')
    if (dest === 'books') setPage('books')
    if (dest === 'resources') setPage('resources')
    if (dest === 'signout') { handleSignOut() }
    if (dest === 'upgrade') { setPage('upgrade') }
    if (dest === 'admin') { setShowAdmin(true) }
    if (dest === 'legal') { setLegalPage('privacy') }
    if (dest === 'contact') { setLegalPage('contact') }
  }

  if (session === undefined) return null
  // Allow success page to show even if session is briefly null after redirect
  if (!session && page !== 'upgrade_success') return <AuthPage onAuth={async () => {
      const { data: { session: newSession } } = await supabase.auth.getSession()
      setSession(newSession || true)
    }} onLegal={t => setLegalPage(t)} />

  const userName = displayName || session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || 'Teacher'
  const userEmail = session?.user?.email || ''
  const navPage = page === 'search' ? 'search' : page === 'plans' ? 'plans' : page === 'books' ? 'books' : page === 'resources' ? 'resources' : ''

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG }}>
      <NavBar currentPage={navPage} onNavigate={handleNavigate} userName={userName} userEmail={userEmail} onOpenProfile={() => setProfileModalOpen(true)} avatarUrl={avatarUrl} trialInfo={trialInfo} />
      {page === 'search' && (
        <SearchPage onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} searchState={searchState} setSearchState={setSearchState} checkTrial={checkTrial} />
      )}
      {page === 'book' && (
        <BookDetailPage book={selectedBook} yearGroup={searchState.yearGroup} onBack={() => setPage('search')}
          onCreateResources={(ideas) => { setSelectedIdeas(ideas); setPage('lessonresources') }} checkTrial={checkTrial} />
      )}
      {page === 'lessonresources' && <ResourcePage book={selectedBook} yearGroup={searchState.yearGroup} ideas={selectedIdeas} onBack={() => setPage('book')} />}
      {page === 'plans' && <MyPlansPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'books' && <MyBooksPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'upgrade' && <UpgradePage onNavigate={handleNavigate} trialInfo={trialInfo} />}
      {page === 'upgrade_success' && <UpgradeSuccessPage onNavigate={handleNavigate} />}
      {page === 'resources' && <ResourcesPage onNavigate={handleNavigate} checkTrial={checkTrial} />}
      {showAdmin && <div style={{ position: 'fixed', inset: 0, zIndex: 700, overflowY: 'auto' }}><AdminDashboard onNavigate={(d) => { setShowAdmin(false); handleNavigate(d) }} userEmail={userEmail} /></div>}
      {legalPage && legalPage !== 'contact' && <LegalPage type={legalPage} onClose={() => setLegalPage(null)} />}
      {legalPage === 'contact' && <ContactModal onClose={() => setLegalPage(null)} />}
      {profileModalOpen && <ProfileModal session={session} onClose={() => setProfileModalOpen(false)} onUpdated={(name, url) => { if (name) setDisplayName(name); if (url) setAvatarUrl(url); if (session?.user?.id) loadProfilePreferences(session.user.id) }} />}
    </div>
  )
}
