// TeachReads shared constants and styles
export const GREEN = '#1D9E75'
export const LIGHT_GREEN = '#E1F5EE'
export const TEXT = '#2C2C2A'
export const MUTED = '#5F5E5A'
export const BORDER = '#D3D1C7'
export const BG = '#FFFFFF'
export const PAGE_BG = '#f5f4f0'
export const AMBER = '#EF9F27'
export const AMBER_BG = '#FAEEDA'
export const AMBER_TEXT = '#633806'
export const NAVY = '#1E2433'
export const NAVY_LIGHT = '#2C3547'
export const NAVY_MUTED = '#8B93A7'

export const TRIAL_LIMITS = {
  book_searches: 10,
  load_mores: 20,
  lesson_ideas: 15,
  units_of_work: 10,
  resources: 15,
}

export const BASIC_LIMITS = {
  book_searches: 30,
  load_mores: 999,
  lesson_ideas: 999,
  units_of_work: 20,
  resources: 40,
}

export const PREMIUM_LIMITS = {
  book_searches: 999,
  load_mores: 999,
  lesson_ideas: 999,
  units_of_work: 999,
  resources: 999,
}

export const STRIPE_PRICES = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1TeyTtLDd6xSXwi01VHyNRy6',
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1TeyUKLDd6xSXwi0ImE2F0su',
}

export const s = {
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
