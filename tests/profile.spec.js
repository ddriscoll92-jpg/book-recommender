import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL
const PASSWORD = process.env.TEST_PASSWORD

async function signIn(page) {
  await page.goto('/')
  await page.waitForSelector('#auth-card', { timeout: 30_000 })
  const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  if (await signInTab.isVisible()) await signInTab.click()
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.getByRole('button', { name: /^sign in$/i }).last().click()
  await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 30_000 })
}

async function openProfile(page) {
  await page.getByText('▼').first().click()
  await page.getByText('Profile & settings').click()
  await expect(page.getByText('Profile settings')).toBeVisible({ timeout: 10_000 })
}

test.describe('Profile & settings', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await openProfile(page)
  })

  // ── Modal structure ──────────────────────────────────────────────────────

  test('profile modal opens with correct title', async ({ page }) => {
    await expect(page.getByText('Profile settings')).toBeVisible()
  })

  test('modal can be closed with × button', async ({ page }) => {
    await page.locator('button').filter({ hasText: '×' }).click()
    await expect(page.getByText('Profile settings')).not.toBeVisible({ timeout: 3_000 })
  })

  // ── Sidebar tabs ─────────────────────────────────────────────────────────

  test('all 5 tabs are visible', async ({ page }) => {
    await expect(page.getByText('👤 Personal')).toBeVisible()
    await expect(page.getByText('🏫 School')).toBeVisible()
    await expect(page.getByText('⚙️ Preferences')).toBeVisible()
    await expect(page.getByText('🔑 Password')).toBeVisible()
    await expect(page.getByText('🗑️ Account')).toBeVisible()
  })

  test('Personal tab is active by default', async ({ page }) => {
    await expect(page.getByText('Display name')).toBeVisible()
  })

  // ── Personal tab ─────────────────────────────────────────────────────────

  test('Personal tab shows display name field', async ({ page }) => {
    await expect(page.getByText('Display name')).toBeVisible()
  })

  test('Personal tab shows email field', async ({ page }) => {
    await expect(page.getByText('Email address')).toBeVisible()
  })

  test('Personal tab shows avatar upload', async ({ page }) => {
    await expect(page.getByText(/Change photo/i)).toBeVisible()
  })

  // ── School tab ───────────────────────────────────────────────────────────

  test('School tab switches content', async ({ page }) => {
    await page.getByText('🏫 School').click()
    await expect(page.getByText('School name')).toBeVisible()
  })

  test('School tab shows region field', async ({ page }) => {
    await page.getByText('🏫 School').click()
    await expect(page.getByRole('option', { name: 'Select region...' })).toBeAttached()
  })

  test('School tab shows year groups field', async ({ page }) => {
    await page.getByText('🏫 School').click()
    await expect(page.getByText('Year groups I teach')).toBeVisible()
  })

  // ── Preferences tab ──────────────────────────────────────────────────────

  test('Preferences tab switches content', async ({ page }) => {
    await page.getByText('⚙️ Preferences').click()
    await expect(page.getByText('Default year group')).toBeVisible()
  })

  test('Preferences tab shows default subject', async ({ page }) => {
    await page.getByText('⚙️ Preferences').click()
    await expect(page.getByText('Default subject')).toBeVisible()
  })

  // ── Password tab ─────────────────────────────────────────────────────────

  test('Password tab switches content', async ({ page }) => {
    await page.getByText('🔑 Password').click()
    await expect(page.getByText('Choose a strong password of at least 6 characters.')).toBeVisible()
  })

  test('Password tab shows confirm password field label', async ({ page }) => {
    await page.getByText('🔑 Password').click()
    await expect(page.getByText('Confirm new password')).toBeVisible()
  })

  test('Password tab shows confirm password field', async ({ page }) => {
    await page.getByText('🔑 Password').click()
    await expect(page.getByText('Confirm new password')).toBeVisible()
  })

  test('mismatched passwords shows error', async ({ page }) => {
    await page.getByText('🔑 Password').click()
    await page.locator('input[placeholder="New password"]').fill('newpassword123')
    await page.locator('input[placeholder="Confirm password"]').fill('differentpassword')
    await expect(page.getByText(/do not match/i)).toBeVisible({ timeout: 5_000 })
  })

  // ── Account tab ──────────────────────────────────────────────────────────

  test('Account tab switches content', async ({ page }) => {
    await page.getByText('🗑️ Account').click()
    await expect(page.getByText(/Delete account/i)).toBeVisible()
  })

  test('Account tab shows delete warning', async ({ page }) => {
    await page.getByText('🗑️ Account').click()
    await expect(page.getByText(/permanently delete/i)).toBeVisible()
  })

  test('delete requires typing DELETE to confirm', async ({ page }) => {
    await page.getByText('🗑️ Account').click()
    await page.getByRole('button', { name: /Delete my account/i }).click()
    await expect(page.getByPlaceholder('DELETE')).toBeVisible({ timeout: 5_000 })
  })

})
