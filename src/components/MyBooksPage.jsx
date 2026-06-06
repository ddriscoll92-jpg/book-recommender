import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function BookGridStarRating({ title, author }) {
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

export function SectionFilters({ books, filters, setFilters }) {
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

export function BookGridCard({ book, isFavourite, onToggleFavourite, onViewBook, onViewPlans, onCreatePlan, onEdit, onDelete }) {
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

export function BookModal({ book, onClose, onSave, isEdit }) {
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

export function MyBooksPage({ onNavigate, onSelectBook }) {
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

