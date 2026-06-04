import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

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

function buildUnitText(book, yearGroup, idea, plan) {
  const lines = []
  const eq = '='.repeat(60)
  const dash = '-'.repeat(40)

  lines.push(`UNIT OF WORK`)
  lines.push(eq)
  lines.push(`Book:       ${book.title} by ${book.author}`)
  lines.push(`Year Group: ${yearGroup || 'Primary'}`)
  lines.push(`Subject:    ${idea.subject}`)
  lines.push(`Unit:       ${idea.title}`)
  lines.push(`Lessons:    ${plan.lessons?.length || 0}`)
  lines.push(``)
  lines.push(`UNIT OVERVIEW`)
  lines.push(dash)
  lines.push(plan.unitOverview || '')
  lines.push(``)

  plan.lessons?.forEach(lesson => {
    lines.push(eq)
    lines.push(`LESSON ${lesson.lessonNumber}: ${lesson.title.toUpperCase()}`)
    lines.push(`Type: ${lesson.type?.toUpperCase() || ''}`)
    lines.push(dash)
    lines.push(``)
    lines.push(`Overview`)
    lines.push(lesson.lessonOverview || '')
    lines.push(``)
    lines.push(`Learning Intention`)
    lines.push(`• ${lesson.learningIntention || ''}`)
    lines.push(``)
    lines.push(`Success Criteria`)
    lesson.successCriteria?.forEach(sc => lines.push(`✓ ${sc}`))
    lines.push(``)
    lines.push(`Main Activity`)
    lines.push(lesson.mainActivity || '')
    if (lesson.teacherNotes) {
      lines.push(``)
      lines.push(`Teacher Note: ${lesson.teacherNotes}`)
    }
    lines.push(``)
    lines.push(`National Curriculum Links`)
    lesson.ncLinks?.forEach(nc => {
      lines.push(`  ${nc.skill}`)
      lines.push(`    ${nc.curriculumLink}`)
    })
    lines.push(``)
    lines.push(`SEND Adaptations`)
    lines.push(`  Support / Lower attaining:`)
    lesson.sendAdaptations?.lower?.forEach(a => lines.push(`    • ${a}`))
    lines.push(`  Extension / Higher attaining:`)
    lesson.sendAdaptations?.higher?.forEach(a => lines.push(`    • ${a}`))
    lines.push(`  EAL Learners:`)
    lesson.sendAdaptations?.eal?.forEach(a => lines.push(`    • ${a}`))
    lines.push(``)
  })

  lines.push(eq)
  lines.push(`MODEL EXAMPLE — ${plan.modelExample?.title?.toUpperCase() || ''}`)
  lines.push(dash)
  lines.push(plan.modelExample?.description || '')
  lines.push(``)
  plan.modelExample?.sections?.forEach(section => {
    lines.push(`[${section.label.toUpperCase()}]`)
    lines.push(section.example)
    lines.push(`Guidance: ${section.placeholder}`)
    lines.push(``)
  })
  lines.push(eq)
  lines.push(`Generated by TeachReads`)
  return lines.join('\n')
}

function downloadTxt(book, yearGroup, idea, plan) {
  const text = buildUnitText(book, yearGroup, idea, plan)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${idea.title.replace(/[^a-z0-9]/gi, '_')}_unit.txt`
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
  const AMBER_RGB = [186, 117, 23]
  const pageW = 210
  const margin = 18
  const contentW = pageW - margin * 2
  let y = 0

  function addPage() { doc.addPage(); y = 18 }
  function checkY(needed = 10) { if (y + needed > 275) addPage() }

  function heading(text, size = 11, color = NAVY_RGB) {
    checkY(10)
    doc.setFontSize(size); doc.setTextColor(...color); doc.setFont('helvetica', 'bold')
    const lines = doc.splitTextToSize(text, contentW)
    doc.text(lines, margin, y)
    y += lines.length * (size * 0.45) + 3
  }

  function body(text, size = 10, color = MUTED_RGB) {
    if (!text) return
    checkY(8)
    doc.setFontSize(size); doc.setTextColor(...color); doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(String(text), contentW)
    doc.text(lines, margin, y)
    y += lines.length * (size * 0.45) + 2
  }

  function bullet(text, indent = 5) {
    checkY(7)
    doc.setFontSize(10); doc.setTextColor(...MUTED_RGB); doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(String(text), contentW - indent)
    doc.text('•', margin + indent - 4, y)
    doc.text(lines, margin + indent, y)
    y += lines.length * 4.5 + 1.5
  }

  function divider(color = [211, 209, 199]) {
    checkY(6); doc.setDrawColor(...color); doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y); y += 5
  }

  function greenBanner(text) {
    checkY(10)
    doc.setFillColor(...GREEN_RGB)
    doc.roundedRect(margin, y - 4, contentW, 7, 1.5, 1.5, 'F')
    doc.setFontSize(9); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold')
    doc.text(text.toUpperCase(), margin + 4, y + 0.5); y += 8
  }

  function lessonBanner(num, title, type) {
    checkY(14)
    doc.setFillColor(...NAVY_RGB)
    doc.rect(margin, y - 4, contentW, 12, 'F')
    doc.setFontSize(11); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold')
    doc.text(`Lesson ${num}: ${title}`, margin + 4, y + 3)
    doc.setFontSize(8); doc.setTextColor(139, 147, 167); doc.setFont('helvetica', 'normal')
    doc.text(type?.toUpperCase() || '', pageW - margin - 4, y + 3, { align: 'right' })
    y += 14
  }

  // ── Cover page ──
  doc.setFillColor(...NAVY_RGB)
  doc.rect(0, 0, pageW, 44, 'F')
  doc.setFontSize(18); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold')
  doc.text(idea.title, margin, 16)
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(139, 147, 167)
  doc.text(`${idea.subject}  ·  ${book.title} by ${book.author}  ·  ${yearGroup || 'Primary'}`, margin, 26)
  doc.setFontSize(9)
  doc.text(`${plan.lessons?.length || 0} lessons  ·  Generated by TeachReads`, margin, 36)
  y = 54

  greenBanner('Unit Overview')
  body(plan.unitOverview); y += 4

  // ── Each lesson ──
  plan.lessons?.forEach((lesson, li) => {
    if (li > 0) { y += 6; divider() }
    checkY(20)
    lessonBanner(lesson.lessonNumber, lesson.title, lesson.type)
    y += 2

    greenBanner('Overview & Learning Intention')
    body(lesson.lessonOverview); y += 2
    checkY(10)
    doc.setFillColor(225, 245, 238)
    const liLines = doc.splitTextToSize(lesson.learningIntention || '', contentW - 10)
    doc.roundedRect(margin, y - 3, contentW, liLines.length * 4.8 + 8, 2, 2, 'F')
    doc.setFontSize(10); doc.setTextColor(8, 80, 65); doc.setFont('helvetica', 'bold')
    doc.text(liLines, margin + 5, y + 2)
    y += liLines.length * 4.8 + 10

    greenBanner('Success Criteria')
    lesson.successCriteria?.forEach(sc => bullet('✓  ' + sc)); y += 2

    greenBanner('Main Activity')
    body(lesson.mainActivity)
    if (lesson.teacherNotes) {
      y += 2
      checkY(12)
      doc.setFillColor(250, 238, 218)
      const tnLines = doc.splitTextToSize(`Teacher note: ${lesson.teacherNotes}`, contentW - 10)
      doc.roundedRect(margin, y - 3, contentW, tnLines.length * 4.8 + 8, 2, 2, 'F')
      doc.setFontSize(9); doc.setTextColor(...AMBER_RGB); doc.setFont('helvetica', 'normal')
      doc.text(tnLines, margin + 5, y + 2)
      y += tnLines.length * 4.8 + 10
    }
    y += 2

    greenBanner('National Curriculum Links')
    lesson.ncLinks?.forEach((nc, i) => {
      heading(nc.skill, 10, NAVY_RGB); body(nc.curriculumLink)
      if (i < lesson.ncLinks.length - 1) divider()
    }); y += 2

    greenBanner('SEND Adaptations')
    heading('Support / Lower attaining', 10, NAVY_RGB)
    lesson.sendAdaptations?.lower?.forEach(a => bullet(a)); y += 1
    heading('Extension / Higher attaining', 10, NAVY_RGB)
    lesson.sendAdaptations?.higher?.forEach(a => bullet(a)); y += 1
    heading('EAL Learners', 10, NAVY_RGB)
    lesson.sendAdaptations?.eal?.forEach(a => bullet(a)); y += 4
  })

  // ── Model example ──
  checkY(16); y += 4; divider(GREEN_RGB)
  doc.setFillColor(240, 250, 246)
  doc.rect(0, y - 4, pageW, 14, 'F')
  doc.setFontSize(12); doc.setTextColor(...GREEN_RGB); doc.setFont('helvetica', 'bold')
  doc.text('MODEL EXAMPLE', margin, y + 5)
  doc.setFontSize(9); doc.setTextColor(...MUTED_RGB); doc.setFont('helvetica', 'normal')
  doc.text('End goal — what pupils work towards', pageW - margin, y + 5, { align: 'right' })
  y += 18

  heading(plan.modelExample?.title || '', 12, NAVY_RGB)
  body(plan.modelExample?.description || ''); y += 3

  plan.modelExample?.sections?.forEach(section => {
    checkY(22)
    doc.setFontSize(9); doc.setTextColor(...GREEN_RGB); doc.setFont('helvetica', 'bold')
    doc.text(section.label.toUpperCase(), margin, y); y += 5
    const exLines = doc.splitTextToSize(section.example || '', contentW - 8)
    const guideLines = doc.splitTextToSize('Guidance: ' + (section.placeholder || ''), contentW - 8)
    const boxH = (exLines.length + guideLines.length) * 4.5 + 14
    checkY(boxH)
    doc.setFillColor(240, 250, 246)
    doc.roundedRect(margin, y - 3, contentW, boxH, 2, 2, 'F')
    doc.setDrawColor(...GREEN_RGB); doc.setLineWidth(0.3)
    doc.roundedRect(margin, y - 3, contentW, boxH, 2, 2, 'S')
    doc.setFontSize(10); doc.setTextColor(44, 44, 42); doc.setFont('helvetica', 'normal')
    doc.text(exLines, margin + 4, y + 2)
    y += exLines.length * 4.5 + 5
    doc.setDrawColor(211, 209, 199); doc.line(margin + 4, y - 1, pageW - margin - 4, y - 1)
    doc.setFontSize(9); doc.setTextColor(...MUTED_RGB)
    doc.text(guideLines, margin + 4, y + 3)
    y += guideLines.length * 4.5 + 10
  })

  doc.save(`${idea.title.replace(/[^a-z0-9]/gi, '_')}_unit.pdf`)
}

async function downloadDocx(book, yearGroup, idea, plan) {
  await loadScript('https://unpkg.com/docx@8.5.0/build/index.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak } = window.docx
  const { saveAs } = window

  const greenColor = '1D9E75'
  const navyColor = '1E2433'
  const mutedColor = '5F5E5A'
  const amberColor = 'BA7517'

  const mkPara = (children, opts = {}) => new Paragraph({ children, ...opts })
  const mkRun = (text, opts = {}) => new TextRun({ text: String(text || ''), ...opts })

  function greenBanner(text) {
    return mkPara(
      [mkRun(text, { bold: true, color: 'FFFFFF', size: 22 })],
      { shading: { type: ShadingType.SOLID, color: greenColor }, spacing: { before: 280, after: 140 }, indent: { left: 100, right: 100 } }
    )
  }

  function bodyPara(text, opts = {}) {
    return mkPara([mkRun(text, { color: mutedColor, size: 20, ...opts })], { spacing: { after: 100 }, indent: { left: 100 } })
  }

  function bulletPara(text) {
    return mkPara([mkRun(text, { color: mutedColor, size: 20 })], { bullet: { level: 0 }, spacing: { after: 80 }, indent: { left: 200 } })
  }

  function subHeading(text, color = navyColor) {
    return mkPara([mkRun(text, { bold: true, color, size: 20 })], { spacing: { before: 160, after: 80 }, indent: { left: 100 } })
  }

  const children = [
    // Unit title
    mkPara([mkRun(idea.title, { bold: true, color: navyColor, size: 40 })], { heading: HeadingLevel.HEADING_1, spacing: { after: 80 } }),
    mkPara([
      mkRun(`${idea.subject}  ·  `, { color: mutedColor, size: 20 }),
      mkRun(book.title, { italics: true, color: mutedColor, size: 20 }),
      mkRun(` by ${book.author}  ·  ${yearGroup || 'Primary'}`, { color: mutedColor, size: 20 }),
    ], { spacing: { after: 80 } }),
    mkPara([mkRun(`${plan.lessons?.length || 0} lessons  ·  Generated by TeachReads`, { color: 'B4B2A9', size: 18, italics: true })], { spacing: { after: 400 } }),

    greenBanner('Unit Overview'),
    bodyPara(plan.unitOverview),
  ]

  // Each lesson
  plan.lessons?.forEach((lesson, li) => {
    children.push(mkPara([new PageBreak()]))
    // Lesson header
    children.push(mkPara(
      [mkRun(`Lesson ${lesson.lessonNumber}: ${lesson.title}`, { bold: true, color: 'FFFFFF', size: 28 }),
       mkRun(`   ${lesson.type?.toUpperCase() || ''}`, { color: 'B4B2A9', size: 18 })],
      { shading: { type: ShadingType.SOLID, color: navyColor }, spacing: { before: 0, after: 200 }, indent: { left: 100, right: 100 } }
    ))
    children.push(greenBanner('Overview'))
    children.push(bodyPara(lesson.lessonOverview))
    children.push(greenBanner('Learning Intention'))
    children.push(mkPara(
      [mkRun(lesson.learningIntention || '', { bold: true, color: '085041', size: 22 })],
      { shading: { type: ShadingType.SOLID, color: 'E1F5EE' }, spacing: { before: 100, after: 200 }, indent: { left: 100, right: 100 } }
    ))
    children.push(greenBanner('Success Criteria'))
    lesson.successCriteria?.forEach(sc => children.push(bulletPara('✓  ' + sc)))
    children.push(greenBanner('Main Activity'))
    children.push(bodyPara(lesson.mainActivity))
    if (lesson.teacherNotes) {
      children.push(mkPara(
        [mkRun('Teacher note: ' + lesson.teacherNotes, { color: amberColor, size: 18, italics: true })],
        { shading: { type: ShadingType.SOLID, color: 'FAEEDA' }, spacing: { before: 100, after: 200 }, indent: { left: 100, right: 100 } }
      ))
    }
    children.push(greenBanner('National Curriculum Links'))
    lesson.ncLinks?.forEach(nc => {
      children.push(subHeading(nc.skill))
      children.push(bodyPara(nc.curriculumLink))
    })
    children.push(greenBanner('SEND Adaptations'))
    children.push(subHeading('Support / Lower attaining'))
    lesson.sendAdaptations?.lower?.forEach(a => children.push(bulletPara(a)))
    children.push(subHeading('Extension / Higher attaining'))
    lesson.sendAdaptations?.higher?.forEach(a => children.push(bulletPara(a)))
    children.push(subHeading('EAL Learners'))
    lesson.sendAdaptations?.eal?.forEach(a => children.push(bulletPara(a)))
  })

  // Model example
  children.push(mkPara([new PageBreak()]))
  children.push(mkPara(
    [mkRun('Model Example', { bold: true, color: 'FFFFFF', size: 28 }),
     mkRun('   End goal — what pupils work towards', { color: 'B4B2A9', size: 18 })],
    { shading: { type: ShadingType.SOLID, color: greenColor }, spacing: { before: 0, after: 200 }, indent: { left: 100, right: 100 } }
  ))
  children.push(mkPara([mkRun(plan.modelExample?.title || '', { bold: true, color: navyColor, size: 26 })], { spacing: { before: 100, after: 100 }, indent: { left: 100 } }))
  children.push(bodyPara(plan.modelExample?.description || ''))
  plan.modelExample?.sections?.forEach(section => {
    children.push(mkPara([mkRun(section.label.toUpperCase(), { bold: true, color: greenColor, size: 18 })], { spacing: { before: 200, after: 80 }, indent: { left: 100 } }))
    children.push(mkPara(
      [mkRun(section.example || '', { color: '2C2C2A', size: 20 })],
      { shading: { type: ShadingType.SOLID, color: 'F0FAF6' }, spacing: { after: 80 }, indent: { left: 100, right: 100 }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: greenColor } } }
    ))
    children.push(mkPara([mkRun('Guidance: ' + (section.placeholder || ''), { italics: true, color: mutedColor, size: 18 })], { spacing: { after: 150 }, indent: { left: 100 } }))
  })

  children.push(mkPara([mkRun('Generated by TeachReads', { color: 'B4B2A9', size: 16, italics: true })], { spacing: { before: 600 }, alignment: AlignmentType.CENTER }))

  const docFile = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(docFile)
  saveAs(blob, `${idea.title.replace(/[^a-z0-9]/gi, '_')}_unit.docx`)
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
function NavBar({ currentPage, onNavigate, userName, userEmail }) {
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = [
    { id: 'search', label: 'Book Recommender', active: true },
    { id: 'plans', label: 'My Plans', active: true },
    { id: 'books', label: 'My Books', active: true },
    { id: 'library', label: 'My Library', active: true },
    { id: 'resources', label: 'Resources', active: true },
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
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
            {(userName || 'T')[0].toUpperCase()}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#FFFFFF' }}>{userName || 'Teacher'}</div>
            <div style={{ fontSize: 11, color: NAVY_MUTED }}>Free plan</div>
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
              { label: '👤  My Profile', note: '', dest: null },
              { label: '⚙️  Settings', note: '', dest: null },
              { label: '💳  Upgrade Plan', note: 'Coming soon', dest: null },
              { label: '🚪  Sign Out', note: '', dest: 'signout' },
            ].map((item, i) => (
              <div key={i}
                onClick={() => { if (item.dest) { setProfileOpen(false); onNavigate(item.dest) } }}
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

// ── Favourite Button ─────────────────────────────────────────────────────────
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

    {viewingPlans && (
      <PlansModal
        book={{ title: viewingPlans.title, author: viewingPlans.author, emoji: '📚' }}
        plans={bookPlans[viewingPlans.title] || []}
        onClose={() => setViewingPlans(null)}
        onAddPlan={() => { setViewingPlans(null); onSelectBook && onSelectBook({ title: viewingPlans.title, author: viewingPlans.author, reason: '' }) }}
        onViewPlan={(plan) => setViewingPlans(null)}
        onEditPlan={() => {}}
        onDeletePlan={() => {}}
      />
    )}
    </>
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
function MyPlanDownloadButton({ plan, group }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function loadFullPlan() {
    const { data: lessons } = await supabase.from('lessons').select('*').eq('plan_id', plan.id).order('lesson_number')
    const { data: planData } = await supabase.from('plans').select('*').eq('id', plan.id).single()
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

  const formats = [
    { id: 'pdf', label: '📄 PDF', desc: 'Print-ready' },
    { id: 'docx', label: '📝 Word', desc: 'Editable' },
    { id: 'txt', label: '📃 Text', desc: 'Plain text' },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={!!downloading}
        style={{ height: 28, padding: '0 10px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, color: downloading ? MUTED : TEXT, cursor: downloading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {downloading ? '⏳' : '⬇'} {downloading ? `${downloading.toUpperCase()}...` : 'Download'}
        {!downloading && <span style={{ fontSize: 9 }}>▼</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', right: 0, background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, width: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 300 }}>
          <div style={{ padding: '7px 12px 5px', fontSize: 10, color: MUTED, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `0.5px solid ${BORDER}` }}>Choose format</div>
          {formats.map(f => (
            <div key={f.id} onClick={() => handle(f.id)}
              style={{ padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 500 }}>{f.label}</span>
              <span style={{ fontSize: 10, color: MUTED }}>{f.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: MUTED }}>🔍</span>
            <input
              style={{ ...s.input, paddingLeft: 30, height: 32, fontSize: 13 }}
              placeholder="Search by book, plan or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Subject */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Subject</span>
            <select style={{ ...selectStyle, borderColor: filterSubject !== 'All' ? GREEN : BORDER, background: filterSubject !== 'All' ? LIGHT_GREEN : BG, color: filterSubject !== 'All' ? '#085041' : TEXT }}
              value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              {allSubjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
            </select>
          </div>
          {/* Year group */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Year</span>
            <select style={{ ...selectStyle, borderColor: filterYear !== 'All' ? GREEN : BORDER, background: filterYear !== 'All' ? LIGHT_GREEN : BG, color: filterYear !== 'All' ? '#085041' : TEXT }}
              value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              {allYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
            </select>
          </div>
          {filtersActive && (
            <span onClick={() => { setSearch(''); setFilterSubject('All'); setFilterYear('All') }}
              style={{ fontSize: 12, color: MUTED, cursor: "pointer", textDecoration: "underline", whiteSpace: "nowrap" }}>
              Clear all
            </span>
          )}
          <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto", whiteSpace: "nowrap" }}>
            {totalPlans} plan{totalPlans !== 1 ? 's' : ''}
          </span>
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

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
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
        await loadScript('https://unpkg.com/docx@8.5.0/build/index.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
        const { Document, Packer, Paragraph, TextRun, ShadingType, AlignmentType } = window.docx
        const { saveAs } = window
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
        saveAs(blob, `${resource.title.replace(/[^a-z0-9]/gi, '_')}.docx`)
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

function ResourcesPage({ onNavigate }) {
  const [tab, setTab] = useState('adhoc') // 'plan' | 'adhoc'

  // Plan-based state
  const [selectedPlanGroup, setSelectedPlanGroup] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [selectedResourceType, setSelectedResourceType] = useState(null)
  const [planSearch, setPlanSearch] = useState('')
  const [planFilterSubject, setPlanFilterSubject] = useState('All')
  const [planFilterYear, setPlanFilterYear] = useState('All')
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false)

  // Ad-hoc state
  const [prompt, setPrompt] = useState('')

  // Shared state
  const [generating, setGenerating] = useState(false)
  const [resource, setResource] = useState(null)
  const [error, setError] = useState('')

  async function generateFromPlan() {
    if (!selectedPlan || !selectedLesson || !selectedResourceType) return
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
        }
      } catch (e) { console.warn('Could not save resource:', e) }
    } catch { setError('Something went wrong. Please try again.') }
    setGenerating(false)
  }

  async function generateAdhoc() {
    if (!prompt.trim()) return
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
        }
      } catch (e) { console.warn('Could not save resource:', e) }
    } catch { setError('Something went wrong. Please try again.') }
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

  return (
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.75rem" }}>
          <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>🛠️</div>
          <div>
            <h1 style={s.h1}>Resources</h1>
            <p style={s.headerSub}>Generate classroom-ready resources from your plans or a custom prompt</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ display: "flex", borderBottom: `0.5px solid ${BORDER}` }}>
            {tabBtn('adhoc', 'Quick resource', '⚡')}
            {tabBtn('plan', 'From a plan', '📋')}
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
              // Flatten all plans with their group context
              const allPlans = DUMMY_PLANS.flatMap(group =>
                group.plans.map(plan => ({ ...plan, group }))
              )
              // Derive filter options
              const planSubjects = ['All', ...Array.from(new Set(allPlans.map(p => p.subject))).sort()]
              const planYears = ['All', ...Array.from(new Set(allPlans.map(p => p.group.yearGroup))).sort()]
              // Filter
              const filteredPlans = allPlans.filter(p => {
                if (planFilterSubject !== 'All' && p.subject !== planFilterSubject) return false
                if (planFilterYear !== 'All' && p.group.yearGroup !== planFilterYear) return false
                if (planSearch && !p.title.toLowerCase().includes(planSearch.toLowerCase()) &&
                    !p.group.book.title.toLowerCase().includes(planSearch.toLowerCase())) return false
                return true
              })

              // Dummy lesson context — in real app these come from the saved plan
              const DUMMY_LESSON_CONTEXT = [
                { num: 1, title: 'Introduction & exploration', type: 'Explore', intention: 'Understand the key features and context of the topic' },
                { num: 2, title: 'Analyse key examples', type: 'Analyse', intention: 'Identify and describe specific features from real examples' },
                { num: 3, title: 'Teach the core skill', type: 'Teach', intention: 'Learn and practise the main skill or technique for this unit' },
                { num: 4, title: 'Practise independently', type: 'Practise', intention: 'Apply the skill independently with scaffolded support' },
                { num: 5, title: 'Plan and structure', type: 'Apply', intention: 'Plan the structure of the final piece of work' },
                { num: 6, title: 'Create the final piece', type: 'Create', intention: 'Produce a complete, polished final piece of work' },
              ]
              const lessonContext = DUMMY_LESSON_CONTEXT.slice(0, selectedPlan?.lessons || 0)

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

          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13, marginBottom: 12 }}>{error}</div>
        )}

        {/* Output */}
        {resource && <ResourceOutput resource={resource} />}

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── My Library Page ──────────────────────────────────────────────────────────
const DUMMY_LIBRARY = [
  { id: 1, title: 'Horrible Histories: Ruthless Romans', author: 'Terry Deary', subject: 'History', yearGroup: 'Year 4', copies: 6, notes: 'Class set in Y4 cupboard', coverUrl: null, emoji: '🏛️', addedDate: '10 Jan 2025' },
  { id: 2, title: 'The Iron Man', author: 'Ted Hughes', subject: 'Literacy', yearGroup: 'Year 5', copies: 1, notes: 'Teacher copy only', coverUrl: null, emoji: '✏️', addedDate: '3 Feb 2025' },
  { id: 3, title: 'Fantastic Mr Fox', author: 'Roald Dahl', subject: 'Literacy', yearGroup: 'Year 3', copies: 4, notes: '', coverUrl: null, emoji: '✏️', addedDate: '14 Feb 2025' },
  { id: 4, title: 'DK Eyewitness: Ancient Rome', author: 'DK', subject: 'History', yearGroup: 'Year 4', copies: 2, notes: 'Shared with Y3', coverUrl: null, emoji: '🏛️', addedDate: '20 Mar 2025' },
  { id: 5, title: 'Usborne See Inside: Science', author: 'Rob Lloyd Jones', subject: 'Science', yearGroup: 'Year 5', copies: 3, notes: '', coverUrl: null, emoji: '🔬', addedDate: '5 Apr 2025' },
]

// Plans keyed by library book id
const DUMMY_BOOK_PLANS_INIT = {
  1: [
    { id: 101, title: 'Roman Mosaic Patterns', subject: 'Art', lessons: 5, created: '28 May 2025' },
    { id: 102, title: 'Writing a Roman Diary Entry', subject: 'Literacy', lessons: 6, created: '28 May 2025' },
    { id: 103, title: 'Roman Settlements and Maps', subject: 'Geography', lessons: 4, created: '29 May 2025' },
  ],
  2: [
    { id: 104, title: 'Descriptive Writing — The Iron Man', subject: 'Literacy', lessons: 5, created: '12 Apr 2025' },
    { id: 105, title: 'Forces and Materials', subject: 'Science', lessons: 4, created: '14 Apr 2025' },
  ],
  3: [],
  4: [
    { id: 106, title: 'The Roman Army', subject: 'History', lessons: 6, created: '31 May 2025' },
  ],
  5: [],
}

function PlansModal({ book, plans, onClose, onAddPlan, onViewPlan, onEditPlan, onDeletePlan }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function startEdit(plan) {
    setEditingId(plan.id)
    setEditForm({ title: plan.title, subject: plan.subject })
  }

  function saveEdit(plan) {
    onEditPlan({ ...plan, ...editForm })
    setEditingId(null)
  }

  const inputStyle = { height: 30, fontSize: 12, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: "0 8px", fontFamily: "'DM Sans', sans-serif", color: TEXT, background: BG, outline: "none" }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: BG, borderRadius: 14, width: "100%", maxWidth: 520, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${BORDER}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 500, color: TEXT, marginBottom: 2 }}>{book.title}</div>
            <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>{book.author} · {book.yearGroup}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: MUTED, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>×</button>
        </div>

        {/* Plans list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {plans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: MUTED, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              No plans yet for this book.
            </div>
          ) : (
            plans.map((plan, i) => {
              const sc = SUBJECT_COLOURS[plan.subject] || { bg: PAGE_BG, color: MUTED }
              const isEditing = editingId === plan.id
              const isConfirmingDelete = confirmDeleteId === plan.id
              return (
                <div key={plan.id} style={{ borderBottom: i < plans.length - 1 ? `0.5px solid ${BORDER}` : "none", padding: "10px 0" }}>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        style={{ ...inputStyle, flex: 1, minWidth: 120 }}
                        value={editForm.title}
                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      />
                      <select
                        style={{ ...inputStyle, height: 30, cursor: "pointer" }}
                        value={editForm.subject}
                        onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                      >
                        {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => saveEdit(plan)} style={{ height: 30, padding: "0 12px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ height: 30, padding: "0 10px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 12, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>{plan.subject}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{plan.title}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{plan.lessons} lessons · Created {plan.created}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        <button onClick={() => onViewPlan(plan)} style={{ height: 26, padding: "0 10px", background: LIGHT_GREEN, border: `0.5px solid ${GREEN}`, borderRadius: 6, fontSize: 11, fontWeight: 500, color: "#085041", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View</button>
                        <button onClick={() => startEdit(plan)} style={{ height: 26, padding: "0 8px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✏️</button>
                        {isConfirmingDelete ? (
                          <>
                            <button onClick={() => { onDeletePlan(plan.id); setConfirmDeleteId(null) }} style={{ height: 26, padding: "0 8px", background: "#FCEBEB", border: `0.5px solid #A32D2D`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#A32D2D", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                            <button onClick={() => setConfirmDeleteId(null)} style={{ height: 26, padding: "0 8px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕</button>
                          </>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(plan.id)} style={{ height: 26, padding: "0 8px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, fontSize: 11, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🗑️</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `0.5px solid ${BORDER}`, display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={onAddPlan}
            style={{ flex: 1, height: 38, background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif' " }}
          >
            ✨ Create new plan
          </button>
          <button onClick={onClose} style={{ height: 38, padding: "0 16px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function LibraryBookCard({ book, plans, onCreatePlan, onViewPlans, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div
      style={{ background: BG, border: `0.5px solid ${hovered ? GREEN : BORDER}`, borderRadius: 12, overflow: "hidden", transition: "all 0.15s", boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
    >
      {/* Cover */}
      <div style={{ background: LIGHT_GREEN, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, position: "relative" }}>
        {book.emoji}
        <span style={{ position: "absolute", top: 8, right: 8, background: NAVY, color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20 }}>
          {book.copies} {book.copies === 1 ? 'copy' : 'copies'}
        </span>
      </div>
      {/* Info */}
      <div style={{ padding: "12px 12px 8px", flex: 1 }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 500, color: TEXT, lineHeight: 1.4, marginBottom: 2 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: GREEN, fontStyle: "italic", marginBottom: 8 }}>{book.author}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 500, background: LIGHT_GREEN, color: "#085041", padding: "2px 7px", borderRadius: 20 }}>{book.subject}</span>
          <span style={{ fontSize: 10, fontWeight: 500, background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, padding: "2px 7px", borderRadius: 20 }}>{book.yearGroup}</span>
        </div>
        {book.notes && (
          <div style={{ fontSize: 11, color: MUTED, background: PAGE_BG, borderRadius: 6, padding: "4px 8px", marginBottom: 6, fontStyle: "italic" }}>
            📌 {book.notes}
          </div>
        )}
        <div style={{ fontSize: 10, color: MUTED }}>Added {book.addedDate}</div>
      </div>
      {/* Actions */}
      <div style={{ padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {plans.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => onViewPlans(book)}
              style={{ width: "100%", height: 32, background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              📋 View plans ({plans.length})
            </button>
            <button
              onClick={() => onCreatePlan(book)}
              style={{ width: "100%", height: 28, background: LIGHT_GREEN, border: `0.5px solid ${GREEN}`, borderRadius: 8, fontSize: 11, fontWeight: 500, color: "#085041", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              ✨ Create new plan
            </button>
          </div>
        ) : (
          <button
            onClick={() => onCreatePlan(book)}
            style={{ width: "100%", height: 32, background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            ✨ Create plan
          </button>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(book)}
            style={{ flex: 1, height: 28, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            ✏️ Edit
          </button>
          {confirmDelete ? (
            <div style={{ flex: 1, display: "flex", gap: 4 }}>
              <button
                onClick={() => onDelete(book.id)}
                style={{ flex: 1, height: 28, background: "#FCEBEB", border: `0.5px solid #A32D2D`, borderRadius: 7, fontSize: 11, fontWeight: 600, color: "#A32D2D", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ height: 28, padding: "0 8px", background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ flex: 1, height: 28, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: MUTED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              🗑️ Delete
            </button>
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
      ? { title: book.title, author: book.author, subject: book.subject, yearGroup: book.yearGroup, copies: book.copies, notes: book.notes || '' }
      : { title: '', author: '', subject: '', yearGroup: '', copies: 1, notes: '' }
  )

  async function searchBooks() {
    if (!query.trim()) return
    setSearching(true); setSearched(false)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`)
      const data = await res.json()
      setResults((data.docs || []).map(b => ({
        title: b.title,
        author: b.author_name?.[0] || 'Unknown',
        coverUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : null,
      })))
    } catch { setResults([]) }
    setSearching(false); setSearched(true)
  }

  function selectResult(r) {
    setForm(f => ({ ...f, title: r.title, author: r.author }))
    setMode('manual')
  }

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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: BG, borderRadius: 14, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>
            {isEdit ? 'Edit book' : 'Add book to library'}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: MUTED, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {/* Mode tabs — only show for new books */}
          {!isEdit && (
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: PAGE_BG, borderRadius: 8, padding: 4 }}>
              {[['search', '🔍 Search'], ['manual', '✏️ Add manually']].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)}
                  style={{ flex: 1, height: 32, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: mode === id ? BG : "transparent", color: mode === id ? TEXT : MUTED, boxShadow: mode === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Search mode */}
          {mode === 'search' && !isEdit && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Search by title or author..." value={query}
                  onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchBooks()} />
                <button onClick={searchBooks} disabled={searching}
                  style={{ height: 36, padding: "0 14px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {searching ? '...' : 'Search'}
                </button>
              </div>
              {searched && results.length === 0 && (
                <div style={{ textAlign: "center", padding: "1rem", color: MUTED, fontSize: 13 }}>
                  No results. <span style={{ color: GREEN, cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode('manual')}>Add manually</span>
                </div>
              )}
              {results.map((r, i) => (
                <div key={i} onClick={() => selectResult(r)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `0.5px solid ${BORDER}`, marginBottom: 8, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = PAGE_BG}
                  onMouseLeave={e => e.currentTarget.style.background = BG}>
                  {r.coverUrl
                    ? <img src={r.coverUrl} style={{ width: 36, height: 48, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                    : <div style={{ width: 36, height: 48, background: LIGHT_GREEN, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📚</div>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: MUTED, fontStyle: "italic" }}>{r.author}</div>
                  </div>
                  <span style={{ fontSize: 12, color: GREEN, fontWeight: 500 }}>Select →</span>
                </div>
              ))}
              {searched && results.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: MUTED }}>Can't find it? </span>
                  <span style={{ color: GREEN, cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode('manual')}>Add manually</span>
                </div>
              )}
            </div>
          )}

          {/* Manual / edit form */}
          {(mode === 'manual' || isEdit) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!isEdit && form.title && (
                <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#085041" }}>
                  ✓ Imported: <strong>{form.title}</strong> by {form.author}
                </div>
              )}
              <div>
                <label style={s.label}>Title</label>
                <input style={inputStyle} placeholder="Book title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={s.label}>Author</label>
                <input style={inputStyle} placeholder="Author name" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={s.label}>Subject</label>
                  <select style={selectStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select...</option>
                    <option>Art</option><option>Computing</option><option>DT</option>
                    <option>Geography</option><option>History</option><option>Literacy</option>
                    <option>Maths</option><option>Music</option><option>PE</option>
                    <option>PSHE</option><option>RE</option><option>Science</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Year group</label>
                  <select style={selectStyle} value={form.yearGroup} onChange={e => setForm(f => ({ ...f, yearGroup: e.target.value }))}>
                    <option value="">Select...</option>
                    <option>Year 1</option><option>Year 2</option><option>Year 3</option>
                    <option>Year 4</option><option>Year 5</option><option>Year 6</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={s.label}>Number of copies</label>
                <input style={inputStyle} type="number" min="1" value={form.copies} onChange={e => setForm(f => ({ ...f, copies: e.target.value }))} />
              </div>
              <div>
                <label style={s.label}>Notes <span style={s.labelOpt}>— optional</span></label>
                <input style={inputStyle} placeholder="e.g. 3 copies in Y4 cupboard" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button onClick={handleSave} disabled={!valid}
                style={{ height: 40, background: valid ? GREEN : '#888780', color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: valid ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                {isEdit ? 'Save changes' : 'Add to library'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MyLibraryPage({ onNavigate, onSelectBook }) {
  const [library, setLibrary] = useState([])
  const [bookPlans, setBookPlans] = useState({})
  const [modal, setModal] = useState(null)
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterYear, setFilterYear] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const allSubjects = ['All', ...Array.from(new Set(library.map(b => b.subject))).sort()]
  const allYears = ['All', ...Array.from(new Set(library.map(b => b.year_group))).sort()]

  const loadLibrary = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('library_books')
      .select('*')
      .eq('user_id', user?.id)
      .order('added_at', { ascending: false })
    if (!error) setLibrary(data || [])
    setLoading(false)
  }, [])

  const loadPlansForBooks = useCallback(async (books) => {
    if (!books.length) return
    const { data, error } = await supabase
      .from('plans')
      .select('id, title, subject, year_group, lesson_count, created_at, book_title')
      .order('created_at', { ascending: false })
    if (!error && data) {
      const grouped = {}
      books.forEach(b => {
        grouped[b.id] = data
          .filter(p => p.book_title === b.title)
          .map(p => ({ id: p.id, title: p.title, subject: p.subject, lessons: p.lesson_count, created: new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }))
      })
      setBookPlans(grouped)
    }
  }, [])

  useEffect(() => {
    loadLibrary()
  }, [loadLibrary])

  useEffect(() => {
    if (library.length) loadPlansForBooks(library)
  }, [library, loadPlansForBooks])

  const filtered = library.filter(b => {
    if (filterSubject !== 'All' && b.subject !== filterSubject) return false
    if (filterYear !== 'All' && b.year_group !== filterYear) return false
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.author.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const filtersActive = filterSubject !== 'All' || filterYear !== 'All' || search

  function getPlans(bookId) { return bookPlans[bookId] || [] }

  async function handleSave(book) {
    if (modal?.mode === 'edit') {
      const { error } = await supabase
        .from('library_books')
        .update({ title: book.title, author: book.author, subject: book.subject, year_group: book.yearGroup || book.year_group, copies: book.copies, notes: book.notes })
        .eq('id', book.id)
      if (!error) await loadLibrary()
      else console.error('Update error:', error)
    } else {
      const { error } = await supabase
        .from('library_books')
        .insert({ user_id: (await supabase.auth.getUser()).data.user?.id, title: book.title, author: book.author, subject: book.subject, year_group: book.yearGroup || book.year_group, copies: parseInt(book.copies) || 1, notes: book.notes || '', emoji: '📚' })
      if (!error) await loadLibrary()
      else console.error('Insert error:', error)
    }
    setModal(null)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('library_books').delete().eq('id', id)
    if (!error) setLibrary(prev => prev.filter(b => b.id !== id))
  }

  async function handleEditPlan(bookId, updatedPlan) {
    const { error } = await supabase
      .from('plans')
      .update({ title: updatedPlan.title, subject: updatedPlan.subject })
      .eq('id', updatedPlan.id)
    if (!error) {
      setBookPlans(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || []).map(p => p.id === updatedPlan.id ? updatedPlan : p)
      }))
    }
  }

  async function handleDeletePlan(bookId, planId) {
    const { error } = await supabase.from('plans').delete().eq('id', planId)
    if (!error) {
      setBookPlans(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || []).filter(p => p.id !== planId)
      }))
    }
  }

  // Normalise field names from DB (snake_case) to component expectations
  function normaliseBook(b) {
    return { ...b, yearGroup: b.year_group, addedDate: new Date(b.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
  }

  const selectStyle = { height: 32, fontSize: 12, borderRadius: 20, border: `0.5px solid ${BORDER}`, padding: "0 12px", background: BG, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }

  return (
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>🏫</div>
            <div>
              <h1 style={s.h1}>My Library</h1>
              <p style={s.headerSub}>Books you own — click any book to create a lesson plan</p>
            </div>
          </div>
          <button onClick={() => setModal({ mode: 'add' })}
            style={{ height: 38, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
            + Add book
          </button>
        </div>

        <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: MUTED }}>🔍</span>
            <input style={{ ...s.input, paddingLeft: 30, height: 32, fontSize: 13 }} placeholder="Search your library..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Subject</span>
            <select style={{ ...selectStyle, borderColor: filterSubject !== 'All' ? GREEN : BORDER, background: filterSubject !== 'All' ? LIGHT_GREEN : BG, color: filterSubject !== 'All' ? '#085041' : TEXT }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              {allSubjects.map(subj => <option key={subj} value={subj}>{subj === 'All' ? 'All subjects' : subj}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Year</span>
            <select style={{ ...selectStyle, borderColor: filterYear !== 'All' ? GREEN : BORDER, background: filterYear !== 'All' ? LIGHT_GREEN : BG, color: filterYear !== 'All' ? '#085041' : TEXT }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              {allYears.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
            </select>
          </div>
          {filtersActive && <span onClick={() => { setSearch(''); setFilterSubject('All'); setFilterYear('All') }} style={{ fontSize: 12, color: MUTED, cursor: "pointer", textDecoration: "underline", whiteSpace: "nowrap" }}>Clear</span>}
          <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto", whiteSpace: "nowrap" }}>{filtered.length} book{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontSize: 14 }}>Loading your library...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏫</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 6 }}>
              {filtersActive ? 'No books match your filters' : 'Your library is empty'}
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              {filtersActive ? 'Try adjusting your search or filters.' : 'Add the books you own to quickly create plans from them.'}
            </div>
            {filtersActive
              ? <span onClick={() => { setSearch(''); setFilterSubject('All'); setFilterYear('All') }} style={{ fontSize: 13, color: GREEN, cursor: "pointer", textDecoration: "underline" }}>Clear filters</span>
              : <button onClick={() => setModal({ mode: 'add' })} style={{ height: 36, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Add your first book</button>
            }
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {filtered.map(book => (
              <LibraryBookCard
                key={book.id}
                book={normaliseBook(book)}
                plans={getPlans(book.id)}
                onCreatePlan={onSelectBook}
                onViewPlans={b => setModal({ mode: 'plans', book: b })}
                onEdit={b => setModal({ mode: 'edit', book: b })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>

      {modal && modal.mode !== 'plans' && (
        <BookModal
          book={modal.book}
          isEdit={modal.mode === 'edit'}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal?.mode === 'plans' && (
        <PlansModal
          book={modal.book}
          plans={getPlans(modal.book.id)}
          onClose={() => setModal(null)}
          onAddPlan={() => { setModal(null); onSelectBook(modal.book) }}
          onViewPlan={plan => { setModal(null); onSelectBook(modal.book) }}
          onEditPlan={plan => handleEditPlan(modal.book.id, plan)}
          onDeletePlan={planId => handleDeletePlan(modal.book.id, planId)}
        />
      )}
    </div>
  )
}

// ── My Books Page ─────────────────────────────────────────────────────────────

function BookGridCard({ book, isFavourite, onToggleFavourite, onViewBook, onViewPlans }) {
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
        <button
          onClick={() => onToggleFavourite(book.title)}
          style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? "⭐" : "☆"}
        </button>
        {book.planCount > 0 && (
          <div style={{ position: "absolute", bottom: 8, left: 8, background: GREEN, color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20 }}>
            📝 {book.planCount} plan{book.planCount !== 1 ? 's' : ''}
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
        <button
          onClick={() => onViewBook && onViewBook(book)}
          style={{ flex: 1, height: 30, background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: TEXT, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          View book
        </button>
        <button
          onClick={() => book.planCount > 0 && onViewPlans && onViewPlans(book)}
          style={{ flex: 1, height: 30, background: book.planCount > 0 ? LIGHT_GREEN : PAGE_BG, border: `0.5px solid ${book.planCount > 0 ? GREEN : BORDER}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: book.planCount > 0 ? "#085041" : MUTED, cursor: book.planCount > 0 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
          {book.planCount > 0 ? `View plans (${book.planCount})` : "No plans yet"}
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

function MyBooksPage({ onNavigate, onSelectBook }) {
  const [savedBooks, setSavedBooks] = useState([])
  const [planCounts, setPlanCounts] = useState({})
  const [bookPlans, setBookPlans] = useState({})
  const [loading, setLoading] = useState(true)
  const [favFilters, setFavFilters] = useState({ ...defaultFilters })
  const [recentFilters, setRecentFilters] = useState({ ...defaultFilters })
  const [favVisible, setFavVisible] = useState(6)
  const [recentVisible, setRecentVisible] = useState(6)
  const [viewingPlans, setViewingPlans] = useState(null) // book

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('saved_books')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_accessed', { ascending: false })
      if (!error && data) {
        setSavedBooks(data)
        // Load plan counts for each book
        const { data: plans } = await supabase
          .from('plans')
          .select('id, title, subject, lesson_count, created_at, book_title, year_group')
          .eq('user_id', user?.id)
        if (plans) {
          const counts = {}
          const grouped = {}
          data.forEach(b => {
            const bookPlans = plans.filter(p => p.book_title === b.title)
            counts[b.title] = bookPlans.length
            grouped[b.title] = bookPlans.map(p => ({
              id: p.id,
              title: p.title,
              subject: p.subject,
              lessons: p.lesson_count,
              created: new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            }))
          })
          setPlanCounts(counts)
          setBookPlans(grouped)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  async function toggleFavourite(title) {
    const book = savedBooks.find(b => b.title === title)
    if (!book) return
    const newVal = !book.is_favourite
    const { error } = await supabase.from('saved_books').update({ is_favourite: newVal }).eq('id', book.id)
    if (!error) setSavedBooks(prev => prev.map(b => b.title === title ? { ...b, is_favourite: newVal } : b))
  }

  function normalise(b) {
    return {
      ...b,
      yearGroup: b.year_group,
      lastUsed: b.last_used ? new Date(b.last_used).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      lastAccessed: b.last_accessed ? new Date(b.last_accessed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      planCount: planCounts[b.title] || 0,
      emoji: '📚',
    }
  }

  const favouriteBooks = savedBooks.filter(b => b.is_favourite).map(normalise)
  const recentBooks = savedBooks.filter(b => !b.is_favourite).map(normalise)
  const filteredFavourites = applyFilters(favouriteBooks, favFilters)
  const filteredRecent = applyFilters(recentBooks, recentFilters)
  const favFilterActive = favFilters.subject !== 'All' || favFilters.yearGroup !== 'All' || favFilters.hasPlans
  const recentFilterActive = recentFilters.subject !== 'All' || recentFilters.yearGroup !== 'All' || recentFilters.hasPlans

  return (
    <>
    <div style={{ ...s.page, maxWidth: "100%" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>📖</div>
            <div>
              <h1 style={s.h1}>My Books</h1>
              <p style={s.headerSub}>Your favourited and recently used books</p>
            </div>
          </div>
          <button onClick={() => onNavigate("search")}
            style={{ height: 38, padding: "0 16px", background: GREEN, color: LIGHT_GREEN, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
            + Find more books
          </button>
        </div>

        {loading && <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontSize: 14 }}>Loading your books...</div>}

        {!loading && (
          <>
            {/* Favourites */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>⭐</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Favourites</span>
                  <span style={{ background: LIGHT_GREEN, color: "#085041", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>
                    {filteredFavourites.length}{favFilterActive ? ` of ${favouriteBooks.length}` : ''}
                  </span>
                  {favFilterActive && <span onClick={() => setFavFilters({ ...defaultFilters })} style={{ fontSize: 11, color: MUTED, cursor: "pointer", textDecoration: "underline" }}>Clear</span>}
                </div>
                {favouriteBooks.length > 0 && <SectionFilters books={favouriteBooks} filters={favFilters} setFilters={setFavFilters} />}
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
                      <BookGridCard key={book.id} book={book} isFavourite={true} onToggleFavourite={toggleFavourite}
                        onViewBook={b => onSelectBook && onSelectBook({ title: b.title, author: b.author, reason: b.reason || '' })}
                        onViewPlans={b => setViewingPlans(b)} />
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

            <hr style={{ border: "none", borderTop: `0.5px solid ${BORDER}`, marginBottom: "2rem" }} />

            {/* Recently used */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>🕐</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Recently used</span>
                  <span style={{ background: PAGE_BG, color: MUTED, border: `0.5px solid ${BORDER}`, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>
                    {filteredRecent.length}{recentFilterActive ? ` of ${recentBooks.length}` : ''}
                  </span>
                  {recentFilterActive && <span onClick={() => setRecentFilters({ ...defaultFilters })} style={{ fontSize: 11, color: MUTED, cursor: "pointer", textDecoration: "underline" }}>Clear</span>}
                </div>
                {recentBooks.length > 0 && <SectionFilters books={recentBooks} filters={recentFilters} setFilters={setRecentFilters} />}
              </div>
              {recentBooks.length === 0 ? (
                <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "2rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
                  Books you search and use will appear here automatically
                </div>
              ) : filteredRecent.length === 0 ? (
                <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "1.5rem", textAlign: "center", color: MUTED, fontSize: 14 }}>
                  No books match the selected filters. <span style={{ cursor: "pointer", color: GREEN, textDecoration: "underline" }} onClick={() => setRecentFilters({ ...defaultFilters })}>Clear filters</span>
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {filteredRecent.slice(0, recentVisible).map(book => (
                      <BookGridCard key={book.id} book={book} isFavourite={false} onToggleFavourite={toggleFavourite}
                        onViewBook={b => onSelectBook && onSelectBook({ title: b.title, author: b.author, reason: b.reason || '' })}
                        onViewPlans={b => setViewingPlans(b)} />
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
          </>
        )}
        <div style={s.footer}>Book Recommender · For UK primary school teachers</div>
      </div>
    </div>
  )
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = { width: '100%', height: 44, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 14px', fontSize: 15, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2.5rem' }}>
        <div style={{ width: 52, height: 52, background: GREEN, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📚</div>
        <div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 500, color: TEXT }}>TeachReads</div>
          <div style={{ fontSize: 13, color: MUTED }}>Lesson planning for UK primary teachers</div>
        </div>
      </div>
      <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: PAGE_BG, borderRadius: 8, padding: 4 }}>
          {[['login', 'Sign in'], ['signup', 'Create account']].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setError(''); setSuccess('') }}
              style={{ flex: 1, height: 36, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: mode === id ? BG : 'transparent', color: mode === id ? TEXT : MUTED, boxShadow: mode === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ ...s.label, marginBottom: 6 }}>Your name</label>
              <input style={inputStyle} placeholder="e.g. Sarah Jones" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ ...s.label, marginBottom: 6 }}>Email address</label>
            <input style={inputStyle} type="email" placeholder="your@school.co.uk" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label style={{ ...s.label, marginBottom: 6 }}>Password</label>
            <input style={inputStyle} type="password" placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13 }}>{error}</div>}
          {success && <div style={{ background: LIGHT_GREEN, color: '#085041', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13 }}>{success}</div>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ height: 44, background: loading ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginTop: '1.5rem', textAlign: 'center' }}>TeachReads · For UK primary school teachers</p>
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
  const [session, setSession] = useState(undefined)
  const [page, setPage] = useState('search')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedIdeas, setSelectedIdeas] = useState([])
  const [searchState, setSearchState] = useState(initialSearchState)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setSession(null)
    setPage('search')
  }

  function handleNavigate(dest) {
    if (dest === 'search') { setSelectedBook(null); setPage('search') }
    if (dest === 'books') { setPage('books') }
    if (dest === 'plans') { setPage('plans') }
    if (dest === 'library') { setPage('library') }
    if (dest === 'resources') { setPage('resources') }
    if (dest === 'signout') { handleSignOut() }
  }

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: PAGE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: MUTED }}>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return <AuthPage onAuth={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />
  }

  const navPage = page === 'book' || page === 'lessonresources' ? 'search' : page === 'books' ? 'books' : page === 'plans' ? 'plans' : page === 'library' ? 'library' : page === 'resources' ? 'resources' : page
  const userName = session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || 'Teacher'
  const userEmail = session?.user?.email || ''

  return (
    <div>
      <NavBar currentPage={navPage} onNavigate={handleNavigate} userName={userName} userEmail={userEmail} />
      {page === 'resources' && <ResourcesPage onNavigate={handleNavigate} />}
      {page === 'library' && <MyLibraryPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'books' && <MyBooksPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'plans' && <MyPlansPage onNavigate={handleNavigate} />}
      {page === 'lessonresources' && (
        <ResourcePage book={selectedBook} yearGroup={searchState.yearGroup} ideas={selectedIdeas} onBack={() => setPage('book')} />
      )}
      {page === 'book' && (
        <BookDetailPage book={selectedBook} yearGroup={searchState.yearGroup} onBack={() => setPage('search')}
          onCreateResources={(ideas) => { setSelectedIdeas(ideas); setPage('lessonresources') }} />
      )}
      {page === 'search' && (
        <SearchPage onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} searchState={searchState} setSearchState={setSearchState} />
      )}
    </div>
  )
}