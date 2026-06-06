import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function BookDetailPage({ book, yearGroup, onBack, onCreateResources, checkTrial }) {
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

