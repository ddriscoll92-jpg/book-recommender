import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function DownloadDropdown({ book, yearGroup, idea, plan }) {
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

export function MyPlanDownloadButton({ plan, group, size }) {
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

export function BookInfoModal({ book, onClose }) {
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

export function PlanDetailModal({ plan, group, onClose }) {
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

export function PlansModal({ book, plans, onClose, onAddPlan, onViewPlan, onEditPlan, onDeletePlan }) {
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

export function MyPlansPage({ onNavigate }) {
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

