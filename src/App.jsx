// TeachReads App v2
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS } from './constants'
import NavBar from './components/NavBar'
import { AuthPage } from './components/AuthPage'
import { LegalPage } from './components/AuthPage'
import { ContactModal } from './components/AuthPage'
import { SearchPage } from './components/SearchPage'
import { BookDetailPage } from './components/BookDetailPage'
import { ResourcePage } from './components/ResourcePage'
import { MyPlansPage } from './components/MyPlansPage'
import { MyBooksPage } from './components/MyBooksPage'
import { ResourcesPage } from './components/ResourcesPage'
import { UpgradePage, UpgradeSuccessPage } from './components/UpgradePage'
import { ProfileModal } from './components/ProfileModal'
import { AdminDashboard } from './components/AdminDashboard'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [page, setPage] = useState('search')
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [trialInfo, setTrialInfo] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [legalPage, setLegalPage] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedIdeas, setSelectedIdeas] = useState([])
  const [searchState, setSearchState] = useState({
    subject: '', topic: '', yearGroup: '', focus: '',
    accordionOpen: false, contentType: 'Any', bookType: 'Any', readingLevel: 'Any', starRating: 0,
    books: [], loading: false, loadingMore: false, error: '', searched: false, searchMeta: {},
  })

  useEffect(() => {
    // Handle Stripe success redirect
    const params = new URLSearchParams(window.location.search)
    const isSuccess = params.get('session_id')
    if (isSuccess) {
      window.history.replaceState({}, '', '/')
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        loadProfilePreferences(session.user.id)
        if (isSuccess) {
          setPage('upgrade_success')
          // Poll for webhook update — retry a few times
          let attempts = 0
          const poll = setInterval(async () => {
            attempts++
            await loadProfilePreferences(session.user.id)
            if (attempts >= 5) clearInterval(poll)
          }, 2000)
        }
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfilePreferences(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfilePreferences(userId) {
    try {
    const { data } = await supabase.from('profiles').select('default_year, default_subject, display_name, avatar_url, plan, trial_expires_at').eq('id', userId).single()
    if (data) {
      if (data.display_name) setDisplayName(data.display_name)
      if (data.avatar_url) setAvatarUrl(`${data.avatar_url}?t=${Date.now()}`)
      setSearchState(prev => ({
        ...prev,
        yearGroup: data.default_year || prev.yearGroup,
        subject: data.default_subject || prev.subject,
      }))
      const plan = data.plan || 'trial'
      const expiresAt = data.trial_expires_at ? new Date(data.trial_expires_at) : null
      const now = new Date()
      const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))) : 0
      const expired = plan === 'trial' && expiresAt && now > expiresAt
      const { data: usage } = await supabase.from('usage_counts').select('*').eq('user_id', userId).single()
      setTrialInfo({ plan, daysLeft, expired, usage: usage || {} })
    }
    } catch(e) { console.error('loadProfilePreferences error:', e) }
  }

  async function checkTrial(action) {
    if (!trialInfo) return true
    const { plan } = trialInfo
    if (plan === 'premium') return true
    if (plan === 'trial' && trialInfo.expired) { setPage('upgrade'); return false }
    const limits = plan === 'premium' ? PREMIUM_LIMITS : plan === 'basic' ? BASIC_LIMITS : TRIAL_LIMITS
    const limit = limits[action] || 999
    let usage = trialInfo.usage
    if (plan === 'basic') {
      const resetAt = trialInfo.usage.reset_at ? new Date(trialInfo.usage.reset_at) : null
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      if (!resetAt || resetAt < monthStart) {
        const { data: { user } } = await supabase.auth.getUser()
        const freshUsage = { user_id: user.id, book_searches: 0, load_mores: 0, lesson_ideas: 0, units_of_work: 0, resources: 0, reset_at: monthStart.toISOString() }
        await supabase.from('usage_counts').upsert(freshUsage)
        usage = freshUsage
        setTrialInfo(prev => ({ ...prev, usage: freshUsage }))
      }
    }
    const count = usage[action] || 0
    if (count >= limit) { setPage('upgrade'); return false }
    const { data: { user } } = await supabase.auth.getUser()
    const newUsage = { ...usage, [action]: count + 1 }
    await supabase.from('usage_counts').upsert({ user_id: user.id, ...newUsage })
    setTrialInfo(prev => ({ ...prev, usage: newUsage }))
    return true
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setSession(null)
    setPage('search')
    setTrialInfo(null)
    setDisplayName('')
    setAvatarUrl('')
  }

  function handleNavigate(dest) {
    if (dest === 'search') setPage('search')
    if (dest === 'plans') setPage('plans')
    if (dest === 'books') setPage('books')
    if (dest === 'resources') setPage('resources')
    if (dest === 'signout') { handleSignOut() }
    if (dest === 'upgrade') { setPage('upgrade') }
    if (dest === 'admin') { setShowAdmin(true) }
    if (dest === 'legal') { setLegalPage('privacy') }
    if (dest === 'contact') { setLegalPage('contact') }
  }

  if (session === undefined) return null
  // Allow success page to show even if session is briefly null after redirect
  if (!session && page !== 'upgrade_success') return <AuthPage onAuth={async () => {
      const { data: { session: newSession } } = await supabase.auth.getSession()
      setSession(newSession || true)
    }} onLegal={t => setLegalPage(t)} />

  const userName = displayName || session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || 'Teacher'
  const userEmail = session?.user?.email || ''
  const navPage = page === 'search' ? 'search' : page === 'plans' ? 'plans' : page === 'books' ? 'books' : page === 'resources' ? 'resources' : ''

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG }}>
      <NavBar currentPage={navPage} onNavigate={handleNavigate} userName={userName} userEmail={userEmail} onOpenProfile={() => setProfileModalOpen(true)} avatarUrl={avatarUrl} trialInfo={trialInfo} />
      {page === 'search' && (
        <SearchPage onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} searchState={searchState} setSearchState={setSearchState} checkTrial={checkTrial} />
      )}
      {page === 'book' && (
        <BookDetailPage book={selectedBook} yearGroup={searchState.yearGroup} onBack={() => setPage('search')}
          onCreateResources={(ideas) => { setSelectedIdeas(ideas); setPage('lessonresources') }} checkTrial={checkTrial} />
      )}
      {page === 'lessonresources' && <ResourcePage book={selectedBook} yearGroup={searchState.yearGroup} ideas={selectedIdeas} onBack={() => setPage('book')} />}
      {page === 'plans' && <MyPlansPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'books' && <MyBooksPage onNavigate={handleNavigate} onSelectBook={(book) => { setSelectedBook(book); setPage('book') }} />}
      {page === 'upgrade' && <UpgradePage onNavigate={handleNavigate} trialInfo={trialInfo} />}
      {page === 'upgrade_success' && <UpgradeSuccessPage onNavigate={handleNavigate} />}
      {page === 'resources' && <ResourcesPage onNavigate={handleNavigate} checkTrial={checkTrial} />}
      {showAdmin && <div style={{ position: 'fixed', inset: 0, zIndex: 700, overflowY: 'auto' }}><AdminDashboard onNavigate={(d) => { setShowAdmin(false); handleNavigate(d) }} userEmail={userEmail} /></div>}
      {legalPage && legalPage !== 'contact' && <LegalPage type={legalPage} onClose={() => setLegalPage(null)} />}
      {legalPage === 'contact' && <ContactModal onClose={() => setLegalPage(null)} />}
      {profileModalOpen && <ProfileModal session={session} onClose={() => setProfileModalOpen(false)} onUpdated={(name, url) => { if (name) setDisplayName(name); if (url) setAvatarUrl(url); if (session?.user?.id) loadProfilePreferences(session.user.id) }} />}
    </div>
  )
}