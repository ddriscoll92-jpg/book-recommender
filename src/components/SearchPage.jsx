import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function StarRating({ title, author, subject, yearGroup, reason }) {
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

export function FavouriteButton({ title, author, subject, yearGroup, reason }) {
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

export function SearchPage({ onSelectBook, searchState, setSearchState, checkTrial }) {
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

