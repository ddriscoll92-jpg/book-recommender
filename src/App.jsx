import { useState, useRef, useEffect } from 'react'

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
  { name: 'Literacy', emoji: '✏️' }, { name: 'Art', emoji: '🎨' }, { name: 'Geography', emoji: '🌍' },
  { name: 'History', emoji: '🏛️' }, { name: 'Science', emoji: '🔬' }, { name: 'Maths', emoji: '📐' },
  { name: 'PSHE', emoji: '💛' }, { name: 'RE', emoji: '🕊️' }, { name: 'Music', emoji: '🎵' },
  { name: 'PE', emoji: '⚽' }, { name: 'DT', emoji: '🔧' }, { name: 'Computing', emoji: '💻' },
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

async function callAPI(prompt, raw = false) {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, raw }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return raw ? data.result : data.books
}

// ── Download Utilities ────────────────────────────────────────────────────────
// ── Script loader helper ──────────────────────────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function buildPlanText(book, yearGroup, idea, plan) {
  const lines = []
  lines.push(`LESSON PLAN`)
  lines.push(`${'='.repeat(60)}`)
  lines.push(`Book: ${book.title} by ${book.author}`)
  lines.push(`Year Group: ${yearGroup || 'Primary'}`)
  lines.push(`Subject: ${idea.subject}`)
  lines.push(`Lesson: ${idea.title}`)
  lines.push(``)
  lines.push(`LESSON OVERVIEW`)
  lines.push(`${'-'.repeat(40)}`)
  lines.push(plan.lessonOverview)
  lines.push(``)
  lines.push(`LEARNING INTENTIONS`)
  lines.push(`${'-'.repeat(40)}`)
  plan.learningIntentions?.forEach(li => lines.push(`• ${li}`))
  lines.push(``)
  lines.push(`SUCCESS CRITERIA`)
  lines.push(`${'-'.repeat(40)}`)
  plan.successCriteria?.forEach(sc => lines.push(`✓ ${sc}`))
  lines.push(``)
  lines.push(`KEY SKILLS — NATIONAL CURRICULUM`)
  lines.push(`${'-'.repeat(40)}`)
  plan.keySkills?.forEach(ks => {
    lines.push(`${ks.skill}`)
    lines.push(`  NC Reference: ${ks.curriculumLink}`)
  })
  lines.push(``)
  lines.push(`SEND ADAPTATIONS`)
  lines.push(`${'-'.repeat(40)}`)
  lines.push(`Support / Lower attaining:`)
  plan.sendAdaptations?.lower?.forEach(a => lines.push(`  • ${a}`))
  lines.push(`Extension / Higher attaining:`)
  plan.sendAdaptations?.higher?.forEach(a => lines.push(`  • ${a}`))
  lines.push(`EAL Learners:`)
  plan.sendAdaptations?.eal?.forEach(a => lines.push(`  • ${a}`))
  lines.push(``)
  lines.push(`MODEL EXAMPLE — ${plan.modelExample?.title?.toUpperCase() || ''}`)
  lines.push(`${'-'.repeat(40)}`)
  lines.push(plan.modelExample?.description || '')
  lines.push(``)
  plan.modelExample?.sections?.forEach(section => {
    lines.push(`[${section.label.toUpperCase()}]`)
    lines.push(section.example)
    lines.push(`Guidance: ${section.placeholder}`)
    lines.push(``)
  })
  return lines.join('\n')
}

function downloadTxt(book, yearGroup, idea, plan) {
  const text = buildPlanText(book, yearGroup, idea, plan)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${idea.title.replace(/[^a-z0-9]/gi, '_')}_lesson_plan.txt`
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadPdf(book, yearGroup, idea, plan) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const GREEN_RGB = [29, 158, 117]
  const NAVY_RGB = [30, 36, 51]
  const MUTED_RGB = [95, 94, 90]
  const pageW = 210
  const margin = 18
  const contentW = pageW - margin * 2
  let y = 0

  function addPage() { doc.addPage(); y = 18 }

  function checkY(needed = 10) { if (y + needed > 275) addPage() }

  function heading(text, size = 11, color = NAVY_RGB) {
    checkY(10)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'bold')
    const lines = doc.splitTextToSize(text, contentW)
    doc.text(lines, margin, y)
    y += lines.length * (size * 0.45) + 3
  }

  function body(text, size = 10, color = MUTED_RGB) {
    checkY(8)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(text, contentW)
    doc.text(lines, margin, y)
    y += lines.length * (size * 0.45) + 2
  }

  function bullet(text, indent = 5) {
    checkY(7)
    doc.setFontSize(10)
    doc.setTextColor(...MUTED_RGB)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(text, contentW - indent)
    doc.text('•', margin + indent - 4, y)
    doc.text(lines, margin + indent, y)
    y += lines.length * 4.5 + 1.5
  }

  function divider() {
    checkY(6)
    doc.setDrawColor(211, 209, 199)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y)
    y += 5
  }

  function sectionLabel(text) {
    checkY(10)
    doc.setFillColor(...GREEN_RGB)
    doc.roundedRect(margin, y - 4, contentW, 7, 1.5, 1.5, 'F')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text(text.toUpperCase(), margin + 4, y + 0.5)
    y += 8
  }

  // Header
  doc.setFillColor(...NAVY_RGB)
  doc.rect(0, 0, pageW, 32, 'F')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(idea.title, margin, 13)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(139, 147, 167)
  doc.text(`${idea.subject}  ·  ${book.title} by ${book.author}  ·  ${yearGroup || 'Primary'}`, margin, 21)
  doc.setFontSize(8)
  doc.text(`Generated by TeachReads`, margin, 28)
  y = 40

  // Overview
  sectionLabel('Lesson Overview')
  body(plan.lessonOverview)
  y += 3

  // Learning Intentions
  sectionLabel('Learning Intentions')
  plan.learningIntentions?.forEach(li => bullet(li))
  y += 3

  // Success Criteria
  sectionLabel('Success Criteria')
  plan.successCriteria?.forEach(sc => bullet('✓  ' + sc))
  y += 3

  // Key Skills
  sectionLabel('Key Skills — National Curriculum')
  plan.keySkills?.forEach((ks, i) => {
    checkY(12)
    heading(ks.skill, 10, NAVY_RGB)
    body(ks.curriculumLink)
    if (i < plan.keySkills.length - 1) { y += 1; divider() }
  })
  y += 3

  // SEND
  sectionLabel('SEND Adaptations')
  const groups = [
    { key: 'lower', label: '🤝 Support / Lower attaining' },
    { key: 'higher', label: '🚀 Extension / Higher attaining' },
    { key: 'eal', label: '🌍 EAL Learners' },
  ]
  groups.forEach(g => {
    heading(g.label, 10, NAVY_RGB)
    plan.sendAdaptations?.[g.key]?.forEach(a => bullet(a))
    y += 2
  })

  // Model Example
  sectionLabel('Model Example')
  body(plan.modelExample?.description || '')
  y += 2
  heading(plan.modelExample?.title || '', 11, NAVY_RGB)
  y += 2
  plan.modelExample?.sections?.forEach(section => {
    checkY(20)
    doc.setFontSize(9)
    doc.setTextColor(...GREEN_RGB)
    doc.setFont('helvetica', 'bold')
    doc.text(section.label.toUpperCase(), margin, y)
    y += 5
    doc.setFillColor(240, 250, 246)
    const exLines = doc.splitTextToSize(section.example, contentW - 8)
    const guideLines = doc.splitTextToSize('📌 ' + section.placeholder, contentW - 8)
    const boxH = (exLines.length + guideLines.length) * 4.5 + 14
    checkY(boxH)
    doc.roundedRect(margin, y - 3, contentW, boxH, 2, 2, 'F')
    doc.setDrawColor(...GREEN_RGB)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y - 3, contentW, boxH, 2, 2, 'S')
    doc.setFontSize(10)
    doc.setTextColor(44, 44, 42)
    doc.setFont('helvetica', 'normal')
    doc.text(exLines, margin + 4, y + 2)
    y += exLines.length * 4.5 + 5
    doc.setDrawColor(211, 209, 199)
    doc.line(margin + 4, y - 1, pageW - margin - 4, y - 1)
    doc.setFontSize(9)
    doc.setTextColor(...MUTED_RGB)
    doc.text(guideLines, margin + 4, y + 3)
    y += guideLines.length * 4.5 + 10
  })

  doc.save(`${idea.title.replace(/[^a-z0-9]/gi, '_')}_lesson_plan.pdf`)
}

async function downloadDocx(book, yearGroup, idea, plan) {
  await loadScript('https://unpkg.com/docx@8.5.0/build/index.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType } = window.docx
  const { saveAs } = window

  const greenColor = '1D9E75'
  const navyColor = '1E2433'
  const mutedColor = '5F5E5A'

  function sectionHeading(text) {
    return new Paragraph({
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 22 })],
      shading: { type: ShadingType.SOLID, color: greenColor },
      spacing: { before: 300, after: 150 },
      indent: { left: 100, right: 100 },
    })
  }

  function bodyPara(text, options = {}) {
    return new Paragraph({
      children: [new TextRun({ text, color: mutedColor, size: 20, ...options })],
      spacing: { after: 100 },
      indent: { left: 100 },
    })
  }

  function bulletPara(text) {
    return new Paragraph({
      children: [new TextRun({ text, color: mutedColor, size: 20 })],
      bullet: { level: 0 },
      spacing: { after: 80 },
      indent: { left: 200 },
    })
  }

  const children = [
    // Title block
    new Paragraph({
      children: [new TextRun({ text: idea.title, bold: true, color: navyColor, size: 36 })],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${idea.subject}  ·  `, color: mutedColor, size: 20 }),
        new TextRun({ text: `${book.title}`, italics: true, color: mutedColor, size: 20 }),
        new TextRun({ text: ` by ${book.author}  ·  ${yearGroup || 'Primary'}`, color: mutedColor, size: 20 }),
      ],
      spacing: { after: 400 },
    }),

    // Overview
    sectionHeading('Lesson Overview'),
    bodyPara(plan.lessonOverview),

    // Learning Intentions
    sectionHeading('Learning Intentions'),
    ...(plan.learningIntentions?.map(li => bulletPara(li)) || []),

    // Success Criteria
    sectionHeading('Success Criteria'),
    ...(plan.successCriteria?.map(sc => bulletPara('✓  ' + sc)) || []),

    // Key Skills
    sectionHeading('Key Skills — National Curriculum'),
    ...(plan.keySkills?.flatMap(ks => [
      new Paragraph({ children: [new TextRun({ text: ks.skill, bold: true, color: navyColor, size: 20 })], spacing: { before: 150, after: 60 }, indent: { left: 100 } }),
      bodyPara(ks.curriculumLink),
    ]) || []),

    // SEND
    sectionHeading('SEND Adaptations'),
    new Paragraph({ children: [new TextRun({ text: '🤝 Support / Lower attaining', bold: true, color: navyColor, size: 20 })], spacing: { before: 150, after: 80 }, indent: { left: 100 } }),
    ...(plan.sendAdaptations?.lower?.map(a => bulletPara(a)) || []),
    new Paragraph({ children: [new TextRun({ text: '🚀 Extension / Higher attaining', bold: true, color: navyColor, size: 20 })], spacing: { before: 150, after: 80 }, indent: { left: 100 } }),
    ...(plan.sendAdaptations?.higher?.map(a => bulletPara(a)) || []),
    new Paragraph({ children: [new TextRun({ text: '🌍 EAL Learners', bold: true, color: navyColor, size: 20 })], spacing: { before: 150, after: 80 }, indent: { left: 100 } }),
    ...(plan.sendAdaptations?.eal?.map(a => bulletPara(a)) || []),

    // Model Example
    sectionHeading('Model Example'),
    bodyPara(plan.modelExample?.description || ''),
    new Paragraph({ children: [new TextRun({ text: plan.modelExample?.title || '', bold: true, color: navyColor, size: 24 })], spacing: { before: 200, after: 150 }, indent: { left: 100 } }),
    ...(plan.modelExample?.sections?.flatMap(section => [
      new Paragraph({ children: [new TextRun({ text: section.label.toUpperCase(), bold: true, color: greenColor, size: 18 })], spacing: { before: 200, after: 80 }, indent: { left: 100 } }),
      new Paragraph({
        children: [new TextRun({ text: section.example, color: '2C2C2A', size: 20 })],
        shading: { type: ShadingType.SOLID, color: 'F0FAF6' },
        spacing: { after: 80 },
        indent: { left: 100, right: 100 },
        border: { left: { style: BorderStyle.SINGLE, size: 6, color: greenColor } },
      }),
      new Paragraph({ children: [new TextRun({ text: '📌 ' + section.placeholder, italics: true, color: mutedColor, size: 18 })], spacing: { after: 150 }, indent: { left: 100 } }),
    ]) || []),

    // Footer
    new Paragraph({ children: [new TextRun({ text: 'Generated by TeachReads', color: 'B4B2A9', size: 16, italics: true })], spacing: { before: 600 }, alignment: AlignmentType.CENTER }),
  ]

  const doc = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${idea.title.replace(/[^a-z0-9]/gi, '_')}_lesson_plan.docx`)
}

// Download dropdown component
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
function NavBar({ currentPage, onNavigate }) {
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = [
    { id: 'search', label: 'Book Recommender', active: true },
    { id: 'plans', label: 'My Plans', active: false },
    { id: 'books', label: 'My Books', active: true },
    { id: 'resources', label: 'Resources', active: false },
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
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>T</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#FFFFFF' }}>Teacher</div>
            <div style={{ fontSize: 11, color: NAVY_MUTED }}>Free plan</div>
          </div>
          <span style={{ fontSize: 11, color: NAVY_MUTED, marginLeft: 2 }}>▼</span>
        </div>

        {/* Dropdown */}
        {profileOpen && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 200 }}>
            <div style={{ padding: '12px 14px', borderBottom: `0.5px solid ${BORDER}`, background: PAGE_BG }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>Teacher</div>
              <div style={{ fontSize: 12, color: MUTED }}>teacher@school.co.uk</div>
            </div>
            {[
              { label: '👤  My Profile', note: '' },
              { label: '⚙️  Settings', note: '' },
              { label: '💳  Upgrade Plan', note: 'Coming soon' },
              { label: '🚪  Sign Out', note: '' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '10px 14px', fontSize: 13, color: i === 3 ? '#A32D2D' : TEXT, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: i === 3 ? `0.5px solid ${BORDER}` : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
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
function BookDetailPage({ book, yearGroup, onBack, onCreateResources }) {
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
        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Search Page ───────────────────────────────────────────────────────────────
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

// ── Resource Page ─────────────────────────────────────────────────────────────
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

function ResourcePage({ book, yearGroup, ideas, onBack }) {
  const [plans, setPlans] = useState({})
  const [generating, setGenerating] = useState({})
  const [openAccordions, setOpenAccordions] = useState(() => {
    const init = {}
    ideas.forEach((idea, i) => { init[idea.title] = i === 0 })
    return init
  })
  // active tab per idea: 0..n-1 = lesson index, "model" = model example
  const [activeTabs, setActiveTabs] = useState({})

  function toggleAccordion(key) {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function setTab(ideaTitle, tab) {
    setActiveTabs(prev => ({ ...prev, [ideaTitle]: tab }))
  }

  async function generatePlan(idea) {
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
            <h1 style={s.h1}>Lesson Resources</h1>
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

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── My Books Page ─────────────────────────────────────────────────────────────
const DUMMY_FAVOURITES = [
  {
    title: "Horrible Histories: Ruthless Romans",
    author: "Terry Deary",
    subject: "History",
    yearGroup: "Year 4",
    lastUsed: "28 May 2025",
    lastAccessed: "1 Jun 2025",
    hasPlans: true,
    coverUrl: null,
    emoji: "🏛️",
  },
  {
    title: "The Iron Man",
    author: "Ted Hughes",
    subject: "Literacy",
    yearGroup: "Year 5",
    lastUsed: "12 Apr 2025",
    lastAccessed: "20 May 2025",
    hasPlans: true,
    coverUrl: null,
    emoji: "✏️",
  },
  {
    title: "Fantastic Mr Fox",
    author: "Roald Dahl",
    subject: "Literacy",
    yearGroup: "Year 3",
    lastUsed: "3 Mar 2025",
    lastAccessed: "3 Mar 2025",
    hasPlans: false,
    coverUrl: null,
    emoji: "✏️",
  },
]

const DUMMY_RECENT = [
  {
    title: "DK Eyewitness: Ancient Rome",
    author: "DK",
    subject: "History",
    yearGroup: "Year 4",
    lastUsed: "31 May 2025",
    lastAccessed: "1 Jun 2025",
    hasPlans: true,
    coverUrl: null,
    emoji: "🏛️",
  },
  {
    title: "Escape from Pompeii",
    author: "Christina Balit",
    subject: "History",
    yearGroup: "Year 4",
    lastUsed: "28 May 2025",
    lastAccessed: "29 May 2025",
    hasPlans: false,
    coverUrl: null,
    emoji: "🏛️",
  },
  {
    title: "See Inside the Roman Empire",
    author: "Rob Lloyd Jones",
    subject: "History",
    yearGroup: "Year 4",
    lastUsed: "20 May 2025",
    lastAccessed: "22 May 2025",
    hasPlans: true,
    coverUrl: null,
    emoji: "🏛️",
  },
  {
    title: "The Selfish Giant",
    author: "Oscar Wilde",
    subject: "PSHE",
    yearGroup: "Year 2",
    lastUsed: "4 Apr 2025",
    lastAccessed: "10 Apr 2025",
    hasPlans: false,
    coverUrl: null,
    emoji: "💛",
  },
]

function BookGridCard({ book, isFavourite, onToggleFavourite }) {
  const [hovered, setHovered] = useState(false)
  const subjectMeta = SUBJECTS.find(s => s.name === book.subject)

  return (
    <div
      style={{ background: BG, border: `0.5px solid ${hovered ? GREEN : BORDER}`, borderRadius: 12, overflow: "hidden", transition: "all 0.15s", boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover area */}
      <div style={{ background: LIGHT_GREEN, height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 42 }}>
        {subjectMeta?.emoji || "📚"}
        {/* Favourite star */}
        <button
          onClick={() => onToggleFavourite(book.title)}
          style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? "⭐" : "☆"}
        </button>
        {/* Has plans badge */}
        {book.hasPlans && (
          <div style={{ position: "absolute", bottom: 8, left: 8, background: GREEN, color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20 }}>
            📝 Has plans
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 12px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 500, color: TEXT, lineHeight: 1.4, marginBottom: 3 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: GREEN, fontStyle: "italic", marginBottom: 8 }}>{book.author}</div>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 500, background: LIGHT_GREEN, color: "#085041", padding: "2px 7px", borderRadius: 20 }}>{book.subject}</span>
          <span style={{ fontSize: 10, fontWeight: 500, background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, padding: "2px 7px", borderRadius: 20 }}>{book.yearGroup}</span>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `0.5px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>
            <span style={{ fontWeight: 500, color: TEXT }}>Last used:</span> {book.lastUsed}
          </div>
          <div style={{ fontSize: 11, color: MUTED }}>
            <span style={{ fontWeight: 500, color: TEXT }}>Last accessed:</span> {book.lastAccessed}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "8px 12px 12px", display: "flex", gap: 6 }}>
        <button style={{ flex: 1, height: 30, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          View book
        </button>
        <button style={{ flex: 1, height: 30, background: book.hasPlans ? LIGHT_GREEN : PAGE_BG, border: `0.5px solid ${book.hasPlans ? GREEN : BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: book.hasPlans ? "#085041" : MUTED, cursor: book.hasPlans ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
          {book.hasPlans ? "View plans" : "No plans yet"}
        </button>
      </div>
    </div>
  )
}

// Inline filter bar component used in each section
function SectionFilters({ books, filters, setFilters }) {
  const subjects = ['All', ...Array.from(new Set(books.map(b => b.subject))).sort()]
  const yearGroups = ['All', ...Array.from(new Set(books.map(b => b.yearGroup))).sort()]

  const selectStyle = { height: 30, fontSize: 12, borderRadius: 20, border: `0.5px solid ${BORDER}`, padding: "0 10px", background: BG, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }
  const hasPlansActive = filters.hasPlans

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {/* Subject dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Subject</span>
        <select
          style={{ ...selectStyle, borderColor: filters.subject !== 'All' ? GREEN : BORDER, color: filters.subject !== 'All' ? "#085041" : TEXT, background: filters.subject !== 'All' ? LIGHT_GREEN : BG }}
          value={filters.subject}
          onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}
        >
          {subjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
        </select>
      </div>
      {/* Year group dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Year</span>
        <select
          style={{ ...selectStyle, borderColor: filters.yearGroup !== 'All' ? GREEN : BORDER, color: filters.yearGroup !== 'All' ? "#085041" : TEXT, background: filters.yearGroup !== 'All' ? LIGHT_GREEN : BG }}
          value={filters.yearGroup}
          onChange={e => setFilters(f => ({ ...f, yearGroup: e.target.value }))}
        >
          {yearGroups.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
        </select>
      </div>
      {/* Has plans toggle pill */}
      <span
        onClick={() => setFilters(f => ({ ...f, hasPlans: !f.hasPlans }))}
        style={{ padding: "4px 10px", borderRadius: 20, border: `0.5px solid ${hasPlansActive ? GREEN : BORDER}`, fontSize: 11, fontWeight: hasPlansActive ? 600 : 400, color: hasPlansActive ? "#085041" : MUTED, background: hasPlansActive ? LIGHT_GREEN : BG, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
      >
        📝 Has plans
      </span>
    </div>
  )
}

function applyFilters(books, filters) {
  return books.filter(b => {
    if (filters.subject !== 'All' && b.subject !== filters.subject) return false
    if (filters.yearGroup !== 'All' && b.yearGroup !== filters.yearGroup) return false
    if (filters.hasPlans && !b.hasPlans) return false
    return true
  })
}

const defaultFilters = { subject: 'All', yearGroup: 'All', hasPlans: false }

function MyBooksPage({ onNavigate }) {
  const [favourites, setFavourites] = useState(DUMMY_FAVOURITES.map(b => b.title))
  const [favFilters, setFavFilters] = useState({ ...defaultFilters })
  const [recentFilters, setRecentFilters] = useState({ ...defaultFilters })
  const [favVisible, setFavVisible] = useState(6)
  const [recentVisible, setRecentVisible] = useState(6)

  function toggleFavourite(title) {
    setFavourites(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])
  }

  const allBooks = [...DUMMY_FAVOURITES, ...DUMMY_RECENT.filter(b => !DUMMY_FAVOURITES.find(f => f.title === b.title))]
  const favouriteBooks = allBooks.filter(b => favourites.includes(b.title))
  const recentBooks = allBooks.filter(b => !favourites.includes(b.title))

  const filteredFavourites = applyFilters(favouriteBooks, favFilters)
  const filteredRecent = applyFilters(recentBooks, recentFilters)

  const favFilterActive = favFilters.subject !== 'All' || favFilters.yearGroup !== 'All' || favFilters.hasPlans
  const recentFilterActive = recentFilters.subject !== 'All' || recentFilters.yearGroup !== 'All' || recentFilters.hasPlans

  return (
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>📖</div>
            <div>
              <h1 style={s.h1}>My Books</h1>
              <p style={s.headerSub}>Your favourited and recently used books</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("search")}
            style={{ height: 38, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            + Find more books
          </button>
        </div>

        {/* Favourites section */}
        <div style={{ marginBottom: "2rem" }}>
          {/* Section header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Favourites</span>
              <span style={{ background: LIGHT_GREEN, color: "#085041", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>
                {filteredFavourites.length}{favFilterActive ? ` of ${favouriteBooks.length}` : ''}
              </span>
              {favFilterActive && (
                <span
                  onClick={() => setFavFilters({ ...defaultFilters })}
                  style={{ fontSize: 11, color: MUTED, cursor: "pointer", textDecoration: "underline" }}
                >
                  Clear
                </span>
              )}
            </div>
            {favouriteBooks.length > 0 && (
              <SectionFilters books={favouriteBooks} filters={favFilters} setFilters={setFavFilters} />
            )}
          </div>

          {favouriteBooks.length === 0 ? (
            <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "2rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>☆</div>
              Star a book to add it to your favourites
            </div>
          ) : filteredFavourites.length === 0 ? (
            <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "1.5rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
              No favourites match the selected filters. <span style={{ cursor: "pointer", color: GREEN, textDecoration: "underline" }} onClick={() => setFavFilters({ ...defaultFilters })}>Clear filters</span>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {filteredFavourites.slice(0, favVisible).map(book => (
                  <BookGridCard key={book.title} book={book} isFavourite={true} onToggleFavourite={toggleFavourite} />
                ))}
              </div>
              {filteredFavourites.length > favVisible && (
                <button onClick={() => setFavVisible(v => v + 6)} style={{ width: "100%", height: 38, marginTop: 12, background: "transparent", border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Load more ({filteredFavourites.length - favVisible} remaining)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: `0.5px solid ${BORDER}`, marginBottom: "2rem" }} />

        {/* Recently used section */}
        <div style={{ marginBottom: "2rem" }}>
          {/* Section header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🕐</span>
              <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Recently used</span>
              <span style={{ background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>
                {filteredRecent.length}{recentFilterActive ? ` of ${recentBooks.length}` : ''}
              </span>
              {recentFilterActive && (
                <span
                  onClick={() => setRecentFilters({ ...defaultFilters })}
                  style={{ fontSize: 11, color: MUTED, cursor: "pointer", textDecoration: "underline" }}
                >
                  Clear
                </span>
              )}
            </div>
            {recentBooks.length > 0 && (
              <SectionFilters books={recentBooks} filters={recentFilters} setFilters={setRecentFilters} />
            )}
          </div>

          {recentBooks.length === 0 ? (
            <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "2rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
              Books you search and use will appear here
            </div>
          ) : filteredRecent.length === 0 ? (
            <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "1.5rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
              No books match the selected filters. <span style={{ cursor: "pointer", color: GREEN, textDecoration: "underline" }} onClick={() => setRecentFilters({ ...defaultFilters })}>Clear filters</span>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {filteredRecent.slice(0, recentVisible).map(book => (
                  <BookGridCard key={book.title} book={book} isFavourite={false} onToggleFavourite={toggleFavourite} />
                ))}
              </div>
              {filteredRecent.length > recentVisible && (
                <button onClick={() => setRecentVisible(v => v + 6)} style={{ width: "100%", height: 38, marginTop: 12, background: "transparent", border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Load more ({filteredRecent.length - recentVisible} remaining)
                </button>
              )}
            </div>
          )}
        </div>

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
const initialSearchState = {
  subject: '', topic: '', yearGroup: '', focus: '',
  accordionOpen: false, contentType: 'Any', bookType: 'Any', readingLevel: 'Any', starRating: 0,
  books: [], loading: false, loadingMore: false, error: '', searched: false, searchMeta: {},
}

export default function App() {
  const [page, setPage] = useState('search')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedIdeas, setSelectedIdeas] = useState([])
  const [searchState, setSearchState] = useState(initialSearchState)

  function handleNavigate(dest) {
    if (dest === 'search') { setSelectedBook(null); setPage('search') }
    if (dest === 'books') { setPage('books') }
  }

  // map internal page names to nav highlight
  const navPage = page === 'book' || page === 'resources' ? 'search' : page === 'books' ? 'books' : page

  return (
    <div>
      <NavBar currentPage={navPage} onNavigate={handleNavigate} />
      {page === 'resources' && (
        <ResourcePage
          book={selectedBook}
          yearGroup={searchState.yearGroup}
          ideas={selectedIdeas}
          onBack={() => setPage('book')}
        />
      )}
      {page === 'book' && (
        <BookDetailPage
          book={selectedBook}
          yearGroup={searchState.yearGroup}
          onBack={() => setPage('search')}
          onCreateResources={(ideas) => { setSelectedIdeas(ideas); setPage('resources') }}
        />
      )}
      {page === 'books' && (
        <MyBooksPage onNavigate={handleNavigate} />
      )}
      {page === 'search' && (
        <SearchPage
          onSelectBook={(book) => { setSelectedBook(book); setPage('book') }}
          searchState={searchState}
          setSearchState={setSearchState}
        />
      )}
    </div>
  )
}
