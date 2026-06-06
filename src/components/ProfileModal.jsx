import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { GREEN, LIGHT_GREEN, TEXT, MUTED, BORDER, BG, PAGE_BG, NAVY, NAVY_LIGHT, NAVY_MUTED, AMBER, AMBER_BG, AMBER_TEXT, TRIAL_LIMITS, BASIC_LIMITS, PREMIUM_LIMITS, STRIPE_PRICES, s } from '../constants'

export function ProfileModal({ session, onClose, onUpdated }) {
  const [pmUserId, setPmUserId] = useState(session?.user?.id || null)
  const [pmUserEmail, setPmUserEmail] = useState(session?.user?.email || '')
  const [activeTab, setActiveTab] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'success'|'error', text }
  const [pmAvatarUrl, setPmAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Personal
  const [pmDisplayName, setPmDisplayName] = useState(session?.user?.user_metadata?.display_name || '')
  const [newEmail, setNewEmail] = useState(session?.user?.email || '')

  // School
  const [schoolName, setSchoolName] = useState('')
  const [region, setRegion] = useState('')
  const [yearGroups, setYearGroups] = useState([])

  // Preferences
  const [defaultYear, setDefaultYear] = useState('')
  const [defaultSubject, setDefaultSubject] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Delete account
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    const uid = user?.id || pmUserId
    if (!uid) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) {
      setSchoolName(data.school || '')
      setRegion(data.region || '')
      setYearGroups(data.year_groups || [])
      setDefaultYear(data.default_year || '')
      setDefaultSubject(data.default_subject || '')
      setPmAvatarUrl(data.avatar_url || null)
    } else if (error) {
      await supabase.from('profiles').upsert({ id: uid, display_name: user?.user_metadata?.display_name || '' })
    }
  }

  function flash(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  async function savePersonal() {
    setSaving(true)
    try {
      // Update display name
      const { error: authErr } = await supabase.auth.updateUser({ data: { display_name: pmDisplayName } })
      if (authErr) throw authErr
      // Update email if changed
      if (newEmail !== pmUserEmail) {
        const { error: emailErr } = await supabase.auth.updateUser({ email: newEmail })
        if (emailErr) throw emailErr
        flash('success', 'Profile updated. Check your new email to confirm the change.')
      } else {
        flash('success', 'Profile updated successfully.')
      }
      onUpdated && onUpdated(pmDisplayName)
    } catch (e) { flash('error', e.message || 'Could not update profile.') }
    setSaving(false)
  }

  async function saveSchool() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: pmUserId,
        school: schoolName,
        region,
        year_groups: yearGroups,
        default_year: defaultYear,
        default_subject: defaultSubject,
      })
      if (error) throw error
      flash('success', 'School details saved.')
    } catch (e) { flash('error', e.message || 'Could not save school details.') }
    setSaving(false)
  }

  async function savePreferences() {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: pmUserId,
        default_year: defaultYear,
        default_subject: defaultSubject,
      })
      if (error) throw error
      flash('success', 'Preferences saved.')
    } catch (e) { flash('error', e.message || 'Could not save preferences.') }
    setSaving(false)
  }

  async function changePassword() {
    if (newPassword.length < 6) { flash('error', 'Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { flash('error', 'Passwords do not match.'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      flash('success', 'Password updated successfully.')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (e) { flash('error', e.message || 'Could not update password.') }
    setSaving(false)
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { flash('error', 'Image must be under 2MB.'); return }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${pmUserId}/avatar.${ext}`
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      // Store clean URL in DB, add cache-bust only for immediate display
      await supabase.from('profiles').upsert({ id: pmUserId, avatar_url: publicUrl })
      const displayUrl = `${publicUrl}?t=${Date.now()}`
      setPmAvatarUrl(displayUrl)
      onUpdated && onUpdated(pmDisplayName, displayUrl)
      flash('success', 'Profile picture updated.')
    } catch (e) {
      console.error('Avatar upload error:', e)
      flash('error', e.message || 'Could not upload image.')
    }
    setUploading(false)
  }

  async function removeAvatar() {
    setUploading(true)
    try {
      // Remove from storage - try common extensions
      const cleanUrl = pmAvatarUrl?.split('?')[0] || ''
      const ext = cleanUrl.split('.').pop() || 'jpg'
      await supabase.storage.from('avatars').remove([`${pmUserId}/avatar.${ext}`])
      // Clear from profile
      await supabase.from('profiles').upsert({ id: pmUserId, avatar_url: null })
      setPmAvatarUrl(null)
      onUpdated && onUpdated(pmDisplayName, '')
      flash('success', 'Profile picture removed.')
    } catch (e) {
      flash('error', 'Could not remove photo.')
    }
    setUploading(false)
  }

  async function deleteAccount() {
    if (deleteText !== 'DELETE') return
    try {
      await supabase.from('profiles').delete().eq('id', pmUserId)
      await supabase.auth.signOut()
    } catch (e) { flash('error', 'Could not delete account. Please contact support.') }
  }

  function toggleYearGroup(yg) {
    setYearGroups(prev => prev.includes(yg) ? prev.filter(y => y !== yg) : [...prev, yg])
  }

  const inputStyle = { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 12px', fontSize: 13, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  const selectStyle = { width: '100%', height: 38, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '0 12px', fontSize: 13, color: TEXT, background: BG, outline: 'none', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }
  const labelStyle = { fontSize: 12, fontWeight: 500, color: MUTED, display: 'block', marginBottom: 5 }
  const saveBtn = (onClick, label) => (
    <button onClick={onClick} disabled={saving}
      style={{ height: 36, padding: '0 16px', background: saving ? '#888780' : GREEN, color: LIGHT_GREEN, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
      {saving ? 'Saving...' : label}
    </button>
  )

  const tabs = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'school', label: '🏫 School' },
    { id: 'preferences', label: '⚙️ Preferences' },
    { id: 'password', label: '🔑 Password' },
    { id: 'account', label: '🗑️ Account' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: BG, borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: TEXT }}>Profile settings</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar tabs */}
          <div style={{ width: 140, borderRight: `0.5px solid ${BORDER}`, flexShrink: 0, padding: '8px 0' }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => { setActiveTab(t.id); setMsg(null) }}
                style={{ padding: '9px 16px', fontSize: 13, cursor: 'pointer', color: activeTab === t.id ? GREEN : TEXT, fontWeight: activeTab === t.id ? 600 : 400, background: activeTab === t.id ? LIGHT_GREEN : 'transparent', borderLeft: activeTab === t.id ? `2px solid ${GREEN}` : '2px solid transparent' }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {msg && (
              <div style={{ background: msg.type === 'success' ? LIGHT_GREEN : '#FCEBEB', color: msg.type === 'success' ? '#085041' : '#A32D2D', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}>
                {msg.text}
              </div>
            )}

            {/* ── Personal ── */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: LIGHT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: `0.5px solid ${BORDER}` }}>
                    {pmAvatarUrl ? <img src={pmAvatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26, fontWeight: 600, color: GREEN }}>{(pmDisplayName || 'T')[0].toUpperCase()}</span>}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <label style={{ height: 32, padding: '0 12px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontWeight: 500, color: TEXT, cursor: uploading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: uploading ? 0.6 : 1 }}>
                        {uploading ? 'Uploading...' : '📷 Change photo'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadAvatar} disabled={uploading} />
                      </label>
                      {pmAvatarUrl && (
                        <button onClick={removeAvatar} disabled={uploading}
                          style={{ height: 32, padding: '0 12px', background: '#FCEBEB', border: `0.5px solid #A32D2D`, borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>JPG or PNG, max 2MB</div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Display name</label>
                  <input style={inputStyle} value={pmDisplayName} onChange={e => setPmDisplayName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input style={inputStyle} type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="your@school.co.uk" />
                  {newEmail !== pmUserEmail && <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>You'll receive a confirmation email at the new address.</div>}
                </div>
                {saveBtn(savePersonal, 'Save changes')}
              </div>
            )}

            {/* ── School ── */}
            {activeTab === 'school' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>School name</label>
                  <input style={inputStyle} value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. St Mary's Primary School" />
                </div>
                <div>
                  <label style={labelStyle}>Region</label>
                  <select style={selectStyle} value={region} onChange={e => setRegion(e.target.value)}>
                    <option value="">Select region...</option>
                    <option value="england">England</option>
                    <option value="wales">Wales</option>
                    <option value="scotland">Scotland</option>
                    <option value="northern_ireland">Northern Ireland</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year groups I teach</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(yg => (
                      <span key={yg} onClick={() => toggleYearGroup(yg)}
                        style={{ padding: '5px 12px', borderRadius: 20, border: `0.5px solid ${yearGroups.includes(yg) ? GREEN : BORDER}`, fontSize: 12, fontWeight: yearGroups.includes(yg) ? 600 : 400, color: yearGroups.includes(yg) ? '#085041' : MUTED, background: yearGroups.includes(yg) ? LIGHT_GREEN : BG, cursor: 'pointer', userSelect: 'none' }}>
                        {yg}
                      </span>
                    ))}
                  </div>
                </div>
                {saveBtn(saveSchool, 'Save school details')}
              </div>
            )}

            {/* ── Preferences ── */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>These defaults pre-fill the dropdowns across the app to save time.</p>
                <div>
                  <label style={labelStyle}>Default year group</label>
                  <select style={selectStyle} value={defaultYear} onChange={e => setDefaultYear(e.target.value)}>
                    <option value="">No default</option>
                    {['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Default subject</label>
                  <select style={selectStyle} value={defaultSubject} onChange={e => setDefaultSubject(e.target.value)}>
                    <option value="">No default</option>
                    {['Art','Computing','DT','Geography','History','Literacy','Maths','Music','PE','PSHE','RE','Science'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {saveBtn(savePreferences, 'Save preferences')}
              </div>
            )}

            {/* ── Password ── */}
            {activeTab === 'password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Choose a strong password of at least 6 characters.</p>
                <div>
                  <label style={labelStyle}>New password</label>
                  <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
                </div>
                <div>
                  <label style={labelStyle}>Confirm new password</label>
                  <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                  {confirmPassword && newPassword !== confirmPassword && <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4 }}>Passwords do not match</div>}
                </div>
                {saveBtn(changePassword, 'Update password')}
                <div style={{ borderTop: `0.5px solid ${BORDER}`, paddingTop: 14, marginTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 6 }}>Forgotten your password?</div>
                  <button onClick={async () => {
                    const { error } = await supabase.auth.resetPasswordForEmail(pmUserEmail)
                    if (!error) flash('success', `Reset link sent to ${pmUserEmail}`)
                    else flash('error', 'Could not send reset email.')
                  }}
                    style={{ height: 34, padding: '0 14px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Send reset email
                  </button>
                </div>
              </div>
            )}

            {/* ── Account ── */}
            {activeTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#FCEBEB', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#7F1D1D', marginBottom: 6 }}>⚠️ Delete account</div>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6, marginBottom: 12 }}>
                    This will permanently delete your account, all your plans, resources and library books. This cannot be undone.
                  </p>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      style={{ height: 34, padding: '0 14px', background: '#FEE2E2', border: `0.5px solid #A32D2D`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#A32D2D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Delete my account
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: 13, color: '#991B1B' }}>Type <strong>DELETE</strong> to confirm:</div>
                      <input style={{ ...inputStyle, borderColor: '#A32D2D' }} value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="DELETE" />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={deleteAccount} disabled={deleteText !== 'DELETE'}
                          style={{ height: 34, padding: '0 14px', background: deleteText === 'DELETE' ? '#A32D2D' : '#888780', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: deleteText === 'DELETE' ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                          Confirm deletion
                        </button>
                        <button onClick={() => { setConfirmDelete(false); setDeleteText('') }}
                          style={{ height: 34, padding: '0 14px', background: PAGE_BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Upgrade Success Page ─────────────────────────────────────────────────────

