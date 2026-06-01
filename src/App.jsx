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

const s = {
  page: { minHeight: '100vh', background: PAGE_BG, padding: '2rem 1rem' },
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
  ideaCard: { background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0.75rem 1rem', marginBottom: 8 },
  ideaTitle: { fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 4 },
  ideaDesc: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  subjectResultCard: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
  subjectResultHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: `0.5px solid ${BORDER}`, background: PAGE_BG },
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
const STAR_OPTIONS = [{ label: 'Any', val: 0 }, { label: '1+', val: 1 }, { label: '2+', val: 2 }, { label: '3+', val: 3 }, { label: '4+', val: 4 }, { label: '5 only', val: 5 }]

const SUBJECTS = [
  { name: 'Literacy', emoji: '✏️' },
  { name: 'Art', emoji: '🎨' },
  { name: 'Geography', emoji: '🌍' },
  { name: 'History', emoji: '🏛️' },
  { name: 'Science', emoji: '🔬' },
  { name: 'Maths', emoji: '📐' },
  { name: 'PSHE', emoji: '💛' },
  { name: 'RE', emoji: '🕊️' },
  { name: 'Music', emoji: '🎵' },
  { name: 'PE', emoji: '⚽' },
  { name: 'DT', emoji: '🔧' },
  { name: 'Computing', emoji: '💻' },
]

async function fetchBookDetails(title, author) {
  try {
    const query = encodeURIComponent(`${title} ${author}`)
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`)
    const data = await res.json()
    if (!data.docs || data.docs.length === 0) return null
    const book = data.docs[0]
    return {
      title: book.title || title,
      author: book.author_name ? book.author_name.join(', ') : author,
      illustrator: book.contributor ? book.contributor.find(c => c.toLowerCase().includes('illustrat')) || null : null,
      publisher: book.publisher ? book.publisher[0] : null,
      firstPublished: book.first_publish_year || null,
      pages: book.number_of_pages_median || null,
      subjects: book.subject ? book.subject.slice(0, 5) : [],
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
    }
  } catch { return null }
}

// ── Book Detail Page ─────────────────────────────────────────────────────────
function BookDetailPage({ book, yearGroup, onBack }) {
  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [coverError, setCoverError] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [lessonIdeas, setLessonIdeas] = useState({})
  const [generatingIdeas, setGeneratingIdeas] = useState(false)

  useState(() => {
    fetchBookDetails(book.title, book.author)
      .then(d => setDetails(d))
      .finally(() => setLoadingDetails(false))
  }, [])

  function toggleSubject(name) {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  async function generateIdeas() {
    if (selectedSubjects.length === 0) return
    setGeneratingIdeas(true)
    const prompt = `You are a UK primary school teacher assistant. The class is studying the book "${book.title}" by ${book.author}${yearGroup ? ` with ${yearGroup} students` : ''}.

Generate lesson ideas for each of these subjects: ${selectedSubjects.join(', ')}.

For each subject, provide exactly 3 lesson ideas that are directly inspired by or connected to this book.

Return ONLY a valid JSON object with no extra text or markdown fences. The keys are subject names and each value is an array of 3 objects with:
- "title": short lesson title (e.g. "Draw a Viking longship")
- "description": 1-2 sentences describing the activity and how it connects to the book

Example format:
{"Literacy":[{"title":"...","description":"..."}]}`

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const text = data.books ? null : data
      // reuse recommend endpoint — parse raw response
      const raw = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, raw: true }),
      })
      const rawData = await raw.json()
      setLessonIdeas(rawData.result || {})
    } catch {
      setLessonIdeas({ error: true })
    } finally {
      setGeneratingIdeas(false)
    }
  }

  const cover = details?.coverUrl && !coverError ? details.coverUrl : null

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
              <div
                key={sub.name}
                style={s.subjectTile(selectedSubjects.includes(sub.name))}
                onClick={() => toggleSubject(sub.name)}
              >
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

        {/* Lesson ideas results */}
        {Object.keys(lessonIdeas).length > 0 && !lessonIdeas.error && (
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT, marginBottom: 12 }}>Lesson ideas</div>
            {Object.entries(lessonIdeas).map(([subject, ideas]) => {
              const subjectMeta = SUBJECTS.find(sub => sub.name === subject)
              return (
                <div key={subject} style={s.subjectResultCard}>
                  <div style={s.subjectResultHeader}>
                    <span style={{ fontSize: 18 }}>{subjectMeta?.emoji || '📚'}</span>
                    <span style={{ fontWeight: 500, fontSize: 14, color: TEXT }}>{subject}</span>
                  </div>
                  <div style={{ padding: '10px 14px' }}>
                    {Array.isArray(ideas) && ideas.map((idea, i) => (
                      <div key={i} style={{ ...s.ideaCard, marginBottom: i < ideas.length - 1 ? 8 : 0 }}>
                        <div style={s.ideaTitle}>{idea.title}</div>
                        <div style={s.ideaDesc}>{idea.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
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

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Search Page ──────────────────────────────────────────────────────────────
function SearchPage({ onSelectBook, searchState, setSearchState }) {
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

IMPORTANT: Only recommend books you are certain exist. Every title and author must be a real, published book that can be verified and purchased. Do not invent or guess titles.

Return ONLY a valid JSON array with no extra text or markdown fences. Each object must have:
- "title": string
- "author": string
- "reason": string (1-2 sentences)`

    try {
      const res = await fetch('/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setSearchState(prev => ({
        ...prev,
        books: isLoadMore ? [...prev.books, ...data.books] : data.books,
        searchMeta: { subject, topic, yearGroup, focus, contentType, bookType, readingLevel },
        searched: true,
        loading: false,
        loadingMore: false,
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
            <div><label style={s.label}>Subject</label><input style={s.input} placeholder="e.g. History" value={subject} onChange={e => set('subject', e.target.value)} /></div>
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
              {CHIPS.map(chip => (
                <span key={chip.value} style={s.chip} onClick={() => set('focus', chip.value)}>⚡ {chip.label}</span>
              ))}
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
                <div>
                  <div style={s.filterLabel}>Minimum star rating <span style={{ fontSize: 11, color: '#888780', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— coming soon</span></div>
                  <div style={s.pillGroup}>
                    {STAR_OPTIONS.map(opt => (
                      <span key={opt.val} style={s.starPill(starRating === opt.val)} onClick={() => set('starRating', opt.val)}>
                        {opt.val > 0 && '⭐'.repeat(opt.val) + ' '}{opt.label}
                      </span>
                    ))}
                  </div>
                  <div style={s.starNote}>Star ratings will be based on community reviews from teachers. Coming soon.</div>
                </div>
              </div>
            )}
          </div>

          <button style={s.submitBtn(loading)} onClick={() => fetchBooks(false)} disabled={loading}>
            {loading ? '⏳ Finding books...' : '✨ Find books'}
          </button>
          {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, marginTop: 12 }}>{error}</div>}
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
              <div key={i} style={s.bookCard} onClick={() => onSelectBook(book)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={s.bookNum}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.bookTitle}>{book.title}</div>
                  <div style={s.bookAuthor}>{book.author}</div>
                  <div style={s.bookReason}>{book.reason}</div>
                  <div style={s.viewBtn}>View book details →</div>
                </div>
              </div>
            ))}
            <button style={s.loadMoreBtn(loadingMore)} onClick={() => fetchBooks(true)} disabled={loadingMore}>
              {loadingMore ? 'Loading...' : '↻ Load more recommendations'}
            </button>
          </div>
        )}
        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────
const initialSearchState = {
  subject: '', topic: '', yearGroup: '', focus: '',
  accordionOpen: false, contentType: 'Any', bookType: 'Any', readingLevel: 'Any', starRating: 0,
  books: [], loading: false, loadingMore: false, error: '', searched: false, searchMeta: {},
}

export default function App() {
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchState, setSearchState] = useState(initialSearchState)

  if (selectedBook) {
    return (
      <BookDetailPage
        book={selectedBook}
        yearGroup={searchState.yearGroup}
        onBack={() => setSelectedBook(null)}
      />
    )
  }
  return (
    <SearchPage
      onSelectBook={setSelectedBook}
      searchState={searchState}
      setSearchState={setSearchState}
    />
  )
}
