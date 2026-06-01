import { useState } from 'react'

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

const styles = {
  page: { minHeight: '100vh', background: PAGE_BG, padding: '2rem 1rem' },
  container: { maxWidth: 680, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' },
  headerIcon: { width: 52, height: 52, background: GREEN, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 },
  h1: { fontFamily: "'Lora', serif", fontSize: 24, fontWeight: 500, color: TEXT, lineHeight: 1.2 },
  headerSub: { fontSize: 13, color: MUTED, marginTop: 3 },
  card: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem', marginBottom: 12 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 },
  label: { display: 'block', fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  labelOptional: { fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: '#888780' },
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
  bookCard: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer', transition: 'box-shadow 0.15s' },
  bookNum: { width: 26, height: 26, background: LIGHT_GREEN, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#085041', flexShrink: 0, marginTop: 2 },
  bookTitle: { fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 2 },
  bookAuthor: { fontSize: 12, color: GREEN, marginBottom: 6, fontStyle: 'italic' },
  bookReason: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  viewBtn: { marginTop: 8, fontSize: 12, color: GREEN, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 },
  loadMoreBtn: (disabled) => ({ width: '100%', height: 42, background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 14, color: TEXT, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif" }),
  loadingBox: { textAlign: 'center', padding: '2.5rem', color: MUTED, fontSize: 14 },
  footer: { textAlign: 'center', fontSize: 12, color: '#B4B2A9', marginTop: '2rem', paddingTop: '1rem', borderTop: `0.5px solid ${BORDER}` },
}

const CHIPS = [
  { label: 'shared reading aloud', value: 'supports shared reading aloud' },
  { label: 'independent reading', value: 'supports independent reading' },
  { label: 'inspires creative writing', value: 'inspires creative writing' },
  { label: 'supports SEND learners', value: 'supports SEND learners' },
  { label: 'guided reading', value: 'suitable for guided reading groups' },
  { label: 'class discussion', value: 'promotes discussion and debate in class' },
  { label: 'supports EAL learners', value: 'supports EAL learners' },
]

const CONTENT_TYPES = ['Any', 'Fiction', 'Non-fiction']
const BOOK_TYPES = ['Any', 'Picture book', 'Chapter book', 'Reference', 'Activity book']
const READING_LEVELS = ['Any', 'Below year group', 'At year group', 'Above year group']
const STAR_OPTIONS = [
  { label: 'Any', val: 0 },
  { label: '1+', val: 1 },
  { label: '2+', val: 2 },
  { label: '3+', val: 3 },
  { label: '4+', val: 4 },
  { label: '5 only', val: 5 },
]

// Fetch book details from Open Library
async function fetchBookDetails(title, author) {
  const query = encodeURIComponent(`${title} ${author}`)
  const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`)
  const data = await res.json()
  if (!data.docs || data.docs.length === 0) return null
  const book = data.docs[0]
  const coverId = book.cover_i
  return {
    title: book.title || title,
    author: book.author_name ? book.author_name.join(', ') : author,
    illustrator: book.contributor ? book.contributor.find(c => c.toLowerCase().includes('illustrat')) || null : null,
    publisher: book.publisher ? book.publisher[0] : null,
    firstPublished: book.first_publish_year || null,
    pages: book.number_of_pages_median || null,
    subjects: book.subject ? book.subject.slice(0, 5) : [],
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
    openLibraryKey: book.key || null,
  }
}

// Book Detail Page
function BookDetailPage({ book, onBack }) {
  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [coverError, setCoverError] = useState(false)

  useState(() => {
    fetchBookDetails(book.title, book.author)
      .then(d => setDetails(d))
      .finally(() => setLoadingDetails(false))
  }, [])

  const cover = details?.coverUrl && !coverError ? details.coverUrl : null

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 13, marginBottom: '1.5rem', padding: 0, fontFamily: "'DM Sans', sans-serif" }}
        >
          ← Back to results
        </button>

        {/* Book hero card */}
        <div style={{ ...styles.card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

            {/* Cover image */}
            <div style={{ flexShrink: 0 }}>
              {loadingDetails ? (
                <div style={{ width: 120, height: 170, background: PAGE_BG, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📚</div>
              ) : cover ? (
                <img
                  src={cover}
                  alt={`Cover of ${book.title}`}
                  onError={() => setCoverError(true)}
                  style={{ width: 120, height: 'auto', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'block' }}
                />
              ) : (
                <div style={{ width: 120, height: 170, background: LIGHT_GREEN, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📖</div>
              )}
            </div>

            {/* Book info */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>{book.title}</h2>
              <p style={{ fontSize: 14, color: GREEN, fontStyle: 'italic', marginBottom: 12 }}>{book.author}</p>

              {loadingDetails ? (
                <p style={{ fontSize: 13, color: MUTED }}>Loading book details...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {details?.illustrator && (
                    <div style={{ fontSize: 13, color: MUTED }}>
                      <span style={{ fontWeight: 500, color: TEXT }}>Illustrator:</span> {details.illustrator}
                    </div>
                  )}
                  {details?.publisher && (
                    <div style={{ fontSize: 13, color: MUTED }}>
                      <span style={{ fontWeight: 500, color: TEXT }}>Publisher:</span> {details.publisher}
                    </div>
                  )}
                  {details?.firstPublished && (
                    <div style={{ fontSize: 13, color: MUTED }}>
                      <span style={{ fontWeight: 500, color: TEXT }}>First published:</span> {details.firstPublished}
                    </div>
                  )}
                  {details?.pages && (
                    <div style={{ fontSize: 13, color: MUTED }}>
                      <span style={{ fontWeight: 500, color: TEXT }}>Pages:</span> {details.pages}
                    </div>
                  )}
                  {!details && (
                    <p style={{ fontSize: 13, color: MUTED }}>No additional details found in Open Library.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subjects / tags */}
          {details?.subjects?.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `0.5px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Subjects</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {details.subjects.map(s => (
                  <span key={s} style={{ padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${BORDER}`, fontSize: 12, color: MUTED, background: PAGE_BG }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Why recommended */}
        <div style={styles.card}>
          <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Why this book was recommended</div>
          <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>{book.reason}</p>
        </div>

        {/* Disclaimer */}
        <div style={styles.disclaimer}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>Book details are sourced from Open Library and may not be complete. Always verify before ordering.</span>
        </div>

        <div style={styles.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// Main Search Page
function SearchPage({ onSelectBook }) {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [yearGroup, setYearGroup] = useState('')
  const [focus, setFocus] = useState('')
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [contentType, setContentType] = useState('Any')
  const [bookType, setBookType] = useState('Any')
  const [readingLevel, setReadingLevel] = useState('Any')
  const [starRating, setStarRating] = useState(0)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [searchMeta, setSearchMeta] = useState({})

  const activeFilterCount = [
    contentType !== 'Any', bookType !== 'Any', readingLevel !== 'Any', starRating > 0,
  ].filter(Boolean).length

  async function fetchBooks(loadMore = false) {
    if (!subject.trim() || !topic.trim() || !yearGroup) {
      setError('Please fill in subject, topic and year group before searching.')
      return
    }
    setError('')
    const isLoadMore = loadMore && books.length > 0
    if (isLoadMore) setLoadingMore(true)
    else { setLoading(true); setBooks([]); setSearched(false) }

    const count = isLoadMore ? 5 : 10
    const excludeList = books.map(b => b.title)
    const exclusions = excludeList.length > 0 ? `Do not repeat any of these already recommended books: ${excludeList.join(', ')}.` : ''
    const focusLine = focus.trim() ? `The teacher wants to specifically focus on: ${focus.trim()}.` : ''
    const contentLine = contentType !== 'Any' ? `Content type: ${contentType} only.` : ''
    const bookTypeLine = bookType !== 'Any' ? `Book type: ${bookType} only.` : ''
    const levelLine = readingLevel !== 'Any' ? `Reading level: ${readingLevel}.` : ''

    const prompt = `You are a UK primary school teacher assistant. Recommend exactly ${count} books for ${yearGroup} students studying ${topic} in ${subject}.
${focusLine}
${contentLine}
${bookTypeLine}
${levelLine}
${exclusions}

IMPORTANT: Only recommend books you are certain exist. Every title and author must be a real, published book that can be verified and purchased. Do not invent or guess titles. If you are not confident a book exists, do not include it.

Return ONLY a valid JSON array with no extra text, preamble or markdown fences. Each object must have these exact keys:
- "title": string
- "author": string
- "reason": string (1-2 sentences explaining why this book suits this topic, focus, and year group)`

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setBooks(prev => isLoadMore ? [...prev, ...data.books] : data.books)
      setSearchMeta({ subject, topic, yearGroup, focus, contentType, bookType, readingLevel })
      setSearched(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>📚</div>
          <div>
            <h1 style={styles.h1}>Book Recommender</h1>
            <p style={styles.headerSub}>Tailored reading suggestions for UK primary school teachers</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Subject</label>
              <input style={styles.input} placeholder="e.g. History" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Topic</label>
              <input style={styles.input} placeholder="e.g. Romans" value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Year group</label>
              <select style={styles.select} value={yearGroup} onChange={e => setYearGroup(e.target.value)}>
                <option value="">Select...</option>
                <option>Year 1</option><option>Year 2</option><option>Year 3</option>
                <option>Year 4</option><option>Year 5</option><option>Year 6</option>
              </select>
            </div>
          </div>

          <div>
            <label style={styles.label}>
              Specific focus <span style={styles.labelOptional}>— optional</span>
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Add any specific aspect of the topic you'd like the books to focus on..."
              value={focus}
              onChange={e => setFocus(e.target.value)}
            />
            <div style={styles.chipsBar}>
              {CHIPS.map(chip => (
                <span key={chip.value} style={styles.chip} onClick={() => setFocus(chip.value)}>
                  ⚡ {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.accordion}>
            <div style={styles.accordionHeader} onClick={() => setAccordionOpen(o => !o)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚙️</span>
                <div>
                  <div style={styles.accordionTitle}>Refine results</div>
                  {activeFilterCount === 0 && <div style={styles.accordionSubtitle}>Filter by type, content and reading level</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeFilterCount > 0 && <span style={styles.accordionBadge}>{activeFilterCount} active</span>}
                <span style={{ fontSize: 14, color: MUTED, display: 'inline-block', transform: accordionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
              </div>
            </div>
            {accordionOpen && (
              <div style={styles.accordionBody}>
                <div style={{ marginBottom: 14 }}>
                  <div style={styles.filterLabel}>Content type</div>
                  <div style={styles.pillGroup}>
                    {CONTENT_TYPES.map(t => <span key={t} style={styles.pill(contentType === t)} onClick={() => setContentType(t)}>{t}</span>)}
                  </div>
                </div>
                <hr style={styles.filterDivider} />
                <div style={{ marginBottom: 14 }}>
                  <div style={styles.filterLabel}>Book type</div>
                  <div style={styles.pillGroup}>
                    {BOOK_TYPES.map(t => <span key={t} style={styles.pill(bookType === t)} onClick={() => setBookType(t)}>{t}</span>)}
                  </div>
                </div>
                <hr style={styles.filterDivider} />
                <div style={{ marginBottom: 14 }}>
                  <div style={styles.filterLabel}>Reading level</div>
                  <div style={styles.pillGroup}>
                    {READING_LEVELS.map(t => <span key={t} style={styles.pill(readingLevel === t)} onClick={() => setReadingLevel(t)}>{t}</span>)}
                  </div>
                </div>
                <hr style={styles.filterDivider} />
                <div>
                  <div style={styles.filterLabel}>
                    Minimum star rating <span style={{ fontSize: 11, color: '#888780', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— coming soon</span>
                  </div>
                  <div style={styles.pillGroup}>
                    {STAR_OPTIONS.map(s => (
                      <span key={s.val} style={styles.starPill(starRating === s.val)} onClick={() => setStarRating(s.val)}>
                        {s.val > 0 && '⭐'.repeat(s.val) + ' '}{s.label}
                      </span>
                    ))}
                  </div>
                  <div style={styles.starNote}>Star ratings will be based on community reviews from teachers. This feature is coming soon.</div>
                </div>
              </div>
            )}
          </div>

          <button style={styles.submitBtn(loading)} onClick={() => fetchBooks(false)} disabled={loading}>
            {loading ? '⏳ Finding books...' : '✨ Find books'}
          </button>

          {error && (
            <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, marginTop: 12 }}>
              {error}
            </div>
          )}
        </div>

        {loading && <div style={styles.loadingBox}>Finding the best books for {yearGroup} {subject}...</div>}

        {searched && books.length > 0 && (
          <div>
            <div style={styles.disclaimer}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>AI recommendations can occasionally include inaccurate titles. Please verify each book exists before ordering — we suggest checking Amazon or your school library catalogue.</span>
            </div>
            <div style={styles.resultsHeader}>
              <p style={styles.resultsTitle}>
                Books for <span style={{ color: TEXT }}>
                  {searchMeta.yearGroup} · {searchMeta.subject} · {searchMeta.topic}
                  {searchMeta.focus ? ` · ${searchMeta.focus}` : ''}
                  {searchMeta.contentType !== 'Any' ? ` · ${searchMeta.contentType}` : ''}
                  {searchMeta.bookType !== 'Any' ? ` · ${searchMeta.bookType}` : ''}
                  {searchMeta.readingLevel !== 'Any' ? ` · ${searchMeta.readingLevel}` : ''}
                </span>
              </p>
              <span style={styles.badge}>{books.length} results</span>
            </div>
            {books.map((book, i) => (
              <div
                key={i}
                style={styles.bookCard}
                onClick={() => onSelectBook(book)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={styles.bookNum}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.bookTitle}>{book.title}</div>
                  <div style={styles.bookAuthor}>{book.author}</div>
                  <div style={styles.bookReason}>{book.reason}</div>
                  <div style={styles.viewBtn}>View book details →</div>
                </div>
              </div>
            ))}
            <button style={styles.loadMoreBtn(loadingMore)} onClick={() => fetchBooks(true)} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : '↻ Load more recommendations'}
            </button>
          </div>
        )}

        <div style={styles.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

export default function App() {
  const [selectedBook, setSelectedBook] = useState(null)

  if (selectedBook) {
    return <BookDetailPage book={selectedBook} onBack={() => setSelectedBook(null)} />
  }
  return <SearchPage onSelectBook={setSelectedBook} />
}
