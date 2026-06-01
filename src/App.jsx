import { useState } from 'react'

const GREEN = '#1D9E75'
const DARK_GREEN = '#0F6E56'
const LIGHT_GREEN = '#E1F5EE'
const TEXT = '#2C2C2A'
const MUTED = '#5F5E5A'
const BORDER = '#D3D1C7'
const BG = '#FFFFFF'
const PAGE_BG = '#f5f4f0'

const styles = {
  page: {
    minHeight: '100vh',
    background: PAGE_BG,
    padding: '2rem 1rem',
  },
  container: {
    maxWidth: 680,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: '2rem',
  },
  headerIcon: {
    width: 52,
    height: 52,
    background: GREEN,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 26,
  },
  h1: {
    fontFamily: "'Lora', serif",
    fontSize: 24,
    fontWeight: 500,
    color: TEXT,
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: 13,
    color: MUTED,
    marginTop: 3,
  },
  card: {
    background: BG,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 12,
    padding: '1.25rem',
    marginBottom: 12,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: 12,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 500,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 6,
  },
  labelOptional: {
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
    color: '#888780',
  },
  input: {
    width: '100%',
    height: 38,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: '0 10px',
    fontSize: 14,
    color: TEXT,
    background: BG,
    outline: 'none',
  },
  select: {
    width: '100%',
    height: 38,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: '0 10px',
    fontSize: 14,
    color: TEXT,
    background: BG,
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    height: 72,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 14,
    color: TEXT,
    background: BG,
    outline: 'none',
    resize: 'none',
    lineHeight: 1.5,
  },
  submitBtn: {
    width: '100%',
    height: 44,
    background: GREEN,
    color: LIGHT_GREEN,
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background 0.15s',
  },
  errorBox: {
    background: '#FCEBEB',
    color: '#A32D2D',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    fontSize: 13,
    marginTop: 12,
  },
  resultsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: `0.5px solid ${BORDER}`,
  },
  resultsTitle: {
    fontFamily: "'Lora', serif",
    fontSize: 16,
    fontWeight: 500,
    color: MUTED,
  },
  resultsTitleSpan: {
    color: TEXT,
  },
  badge: {
    background: LIGHT_GREEN,
    color: '#085041',
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 20,
  },
  bookCard: {
    background: BG,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 12,
    padding: '1rem 1.25rem',
    marginBottom: 10,
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
  },
  bookNum: {
    width: 26,
    height: 26,
    background: LIGHT_GREEN,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 500,
    color: '#085041',
    flexShrink: 0,
    marginTop: 2,
  },
  bookTitle: {
    fontFamily: "'Lora', serif",
    fontSize: 15,
    fontWeight: 500,
    color: TEXT,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 12,
    color: GREEN,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  bookReason: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 1.5,
  },
  loadMoreBtn: {
    width: '100%',
    height: 42,
    background: 'transparent',
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    fontSize: 14,
    color: TEXT,
    cursor: 'pointer',
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingBox: {
    textAlign: 'center',
    padding: '2.5rem',
    color: MUTED,
    fontSize: 14,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#B4B2A9',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: `0.5px solid ${BORDER}`,
  },
}

export default function App() {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [yearGroup, setYearGroup] = useState('')
  const [focus, setFocus] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [searchMeta, setSearchMeta] = useState({})

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
    const exclusions = excludeList.length > 0
      ? `Do not repeat any of these already recommended books: ${excludeList.join(', ')}.` : ''
    const focusLine = focus.trim()
      ? `The teacher wants to specifically focus on: ${focus.trim()}.` : ''

    const prompt = `You are a UK primary school teacher assistant. Recommend exactly ${count} books for ${yearGroup} students studying ${topic} in ${subject}.
${focusLine}
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
      const newBooks = data.books
      setBooks(prev => isLoadMore ? [...prev, ...newBooks] : newBooks)
      setSearchMeta({ subject, topic, yearGroup, focus })
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
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
                <option>Year 5</option>
                <option>Year 6</option>
              </select>
            </div>
          </div>

          <div>
            <label style={styles.label}>
              Specific focus <span style={styles.labelOptional}>— optional, e.g. "clothing and dress"</span>
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Add any specific aspect of the topic you'd like the books to focus on..."
              value={focus}
              onChange={e => setFocus(e.target.value)}
            />
          </div>

          <button
            style={{ ...styles.submitBtn, background: loading ? '#888780' : GREEN }}
            onClick={() => fetchBooks(false)}
            disabled={loading}
          >
            {loading ? '⏳ Finding books...' : '✨ Find books'}
          </button>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            Finding the best books for {yearGroup} {subject}...
          </div>
        )}

        {searched && books.length > 0 && (
          <div>
            <div style={{
              background: '#FAEEDA',
              border: '0.5px solid #EF9F27',
              borderRadius: 8,
              padding: '0.75rem 1rem',
              marginBottom: 16,
              fontSize: 13,
              color: '#633806',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>AI recommendations can occasionally include inaccurate titles. Please verify each book exists before ordering — we suggest checking Amazon or your school library catalogue.</span>
            </div>
            <div style={styles.resultsHeader}>
              <p style={styles.resultsTitle}>
                Books for <span style={styles.resultsTitleSpan}>
                  {searchMeta.yearGroup} · {searchMeta.subject} · {searchMeta.topic}
                  {searchMeta.focus ? ` · ${searchMeta.focus}` : ''}
                </span>
              </p>
              <span style={styles.badge}>{books.length} results</span>
            </div>

            {books.map((book, i) => (
              <div key={i} style={styles.bookCard}>
                <div style={styles.bookNum}>{i + 1}</div>
                <div>
                  <div style={styles.bookTitle}>{book.title}</div>
                  <div style={styles.bookAuthor}>{book.author}</div>
                  <div style={styles.bookReason}>{book.reason}</div>
                </div>
              </div>
            ))}

            <button
              style={{ ...styles.loadMoreBtn, opacity: loadingMore ? 0.5 : 1 }}
              onClick={() => fetchBooks(true)}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : '↻ Load more recommendations'}
            </button>
          </div>
        )}

        <div style={styles.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}
