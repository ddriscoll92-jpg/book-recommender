import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function ModelExampleTab({ modelExample }) {
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

export function LessonTab({ lesson, lessonIdx, total }) {
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

export function ResourceOutput({ resource }) {
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

export function ResourcePage({ book, yearGroup, ideas, onBack }) {
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

