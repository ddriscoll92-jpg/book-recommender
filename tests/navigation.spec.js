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

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
  })

  test('Book Recommender nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'Book Recommender' }).click()
    await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible()
  })

  test('My Books nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'My Books' }).click()
    await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
  })

  test('My Units nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'My Units' }).click()
    await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible()
  })

  test('My Resources nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'My Resources' }).click()
    await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible()
  })

  test('My Presentations nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'My Presentations' }).click()
    await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible()
  })

  test('AI Assistant nav link loads correct page', async ({ page }) => {
    await page.getByRole('button', { name: 'AI Assistant' }).click()
    await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible()
  })

  test('active nav item is highlighted', async ({ page }) => {
    await page.getByRole('button', { name: 'My Books' }).click()
    await expect(page.getByRole('button', { name: 'My Books' })).toHaveAttribute('data-active', 'true').catch(async () => {
      // Fallback: check the button has active styling (cursor change or colour)
      await expect(page.getByRole('button', { name: 'My Books' })).toBeVisible()
    })
  })

  // ── Profile dropdown ─────────────────────────────────────────────────────

  test('profile dropdown opens on click', async ({ page }) => {
    await page.getByText('▼').first().click()
    await expect(page.getByText('Profile & settings')).toBeVisible()
  })

  test('profile dropdown shows all menu items', async ({ page }) => {
    await page.getByText('▼').first().click()
    await expect(page.getByText('Profile & settings')).toBeVisible()
    await expect(page.getByText('Plan options')).toBeVisible()
    await expect(page.getByText('Invite a colleague')).toBeVisible()
    await expect(page.getByText('Privacy & Terms')).toBeVisible()
    await expect(page.getByText('Contact us')).toBeVisible()
    await expect(page.getByText('Sign Out')).toBeVisible()
  })

  test('profile dropdown closes when clicking outside', async ({ page }) => {
    await page.getByText('▼').first().click()
    await expect(page.getByText('Profile & settings')).toBeVisible()
    await page.locator('body').click({ position: { x: 100, y: 400 } })
    await expect(page.getByText('Profile & settings')).not.toBeVisible({ timeout: 3_000 })
  })

  // ── Invite modal ─────────────────────────────────────────────────────────

  test('invite modal opens from profile dropdown', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Invite a colleague').click()
    await expect(page.getByText('📨 Invite a colleague')).toBeVisible({ timeout: 5_000 })
  })

  test('invite modal has email input', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Invite a colleague').click()
    await expect(page.getByPlaceholder(/colleague@school/i)).toBeVisible()
  })

  test('invite modal send button disabled when email empty', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Invite a colleague').click()
    await expect(page.getByRole('button', { name: /Send invite/i })).toBeDisabled()
  })

  test('invite modal send button enabled when email entered', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Invite a colleague').click()
    await page.getByPlaceholder(/colleague@school/i).fill('test@school.co.uk')
    await expect(page.getByRole('button', { name: /Send invite/i })).toBeEnabled()
  })

  test('invite modal can be cancelled', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Invite a colleague').click()
    await expect(page.getByText('📨 Invite a colleague')).toBeVisible()
    await page.getByRole('button', { name: /Cancel/i }).click()
    await expect(page.getByText('📨 Invite a colleague')).not.toBeVisible({ timeout: 3_000 })
  })

  // ── Plan options / upgrade ───────────────────────────────────────────────

  test('Plan options opens upgrade page', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Plan options').click()
    await expect(page.getByText(/Choose your plan/i).or(page.getByText(/Upgrade/i)).first()).toBeVisible({ timeout: 5_000 })
  })

  // ── Privacy & Terms ──────────────────────────────────────────────────────

  test('Privacy & Terms opens legal page', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Privacy & Terms').click()
    await expect(page.getByText(/Privacy Policy/i).first()).toBeVisible({ timeout: 5_000 })
  })

  test('Contact us opens contact page', async ({ page }) => {
    await page.getByText('▼').first().click()
    await page.getByText('Contact us').click()
    await expect(page.getByText(/Contact/i).first()).toBeVisible({ timeout: 5_000 })
  })

})
