import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL
const PASSWORD = process.env.TEST_PASSWORD

// Helper: sign in
async function signIn(page) {
  await page.goto('/')
  await page.waitForSelector('#auth-card', { timeout: 15_000 })
  const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  if (await signInTab.isVisible()) await signInTab.click()
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.getByRole('button', { name: /^sign in$/i }).last().click()
  await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
}

// Helper: navigate to My Presentations
async function goToPresentations(page) {
  await page.getByRole('button', { name: 'My Presentations' }).click()
  await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible({ timeout: 10_000 })
}

test.describe('My Presentations page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToPresentations(page)
  })

  // ── Page structure ──────────────────────────────────────────────────────

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Generate and browse teaching slideshows for your lessons')).toBeVisible()
  })

  // ── Tabs ────────────────────────────────────────────────────────────────

  test('all three tabs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Quick presentation/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /From a plan/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /My catalogue/i })).toBeVisible()
  })

  test('Quick presentation tab is active by default', async ({ page }) => {
    await expect(page.getByText('Describe the lesson or topic')).toBeVisible()
  })

  test('From a plan tab switches content', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.getByText('Step 1 — Select a plan')).toBeVisible()
  })

  test('My catalogue tab switches content', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByPlaceholder('Search by title...')).toBeVisible()
  })

  // ── Quick presentation tab ───────────────────────────────────────────────

  test('textarea is present on Quick presentation tab', async ({ page }) => {
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('all 5 example prompts are visible', async ({ page }) => {
    await expect(page.getByText(/introducing fractions for Year 4/i)).toBeVisible()
    await expect(page.getByText(/water cycle for Year 5/i)).toBeVisible()
    await expect(page.getByText(/Great Fire of London/i)).toBeVisible()
    await expect(page.getByText(/persuasive writing techniques/i)).toBeVisible()
    await expect(page.getByText(/healthy eating and food groups/i)).toBeVisible()
  })

  test('clicking an example prompt fills the textarea', async ({ page }) => {
    await page.getByText(/introducing fractions for Year 4/i).click()
    await expect(page.locator('textarea')).not.toBeEmpty()
  })

  test('generate button is disabled when textarea is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeDisabled()
  })

  test('generate button enables when text is typed', async ({ page }) => {
    await page.locator('textarea').fill('Create a slideshow about volcanoes for Year 3')
    await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeEnabled()
  })

  test('clearing textarea disables generate button again', async ({ page }) => {
    await page.locator('textarea').fill('Create a slideshow about volcanoes')
    await page.locator('textarea').fill('')
    await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeDisabled()
  })

  // ── From a plan tab ──────────────────────────────────────────────────────

  test('From a plan tab shows plan search', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.getByPlaceholder('Search plans or books...')).toBeVisible()
  })

  test('From a plan tab shows subject and year filters', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.locator('select').first()).toBeVisible()
    await expect(page.locator('select').nth(1)).toBeVisible()
  })

  // ── My catalogue tab ─────────────────────────────────────────────────────

  test('My catalogue tab shows search input', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByPlaceholder('Search by title...')).toBeVisible()
  })

  test('My catalogue tab shows favourites filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByText('⭐ Favourites')).toBeVisible()
  })

  test('My catalogue tab shows subject filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByText('Subject').first()).toBeVisible()
  })

  test('My catalogue tab shows year filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByText('Year').first()).toBeVisible()
  })

  test('empty catalogue shows correct message', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    // If no presentations yet, shows empty state message
    const emptyMsg = page.getByText(/No presentations yet|No presentations match/i)
    const presItem = page.locator('[style*="border-radius: 10px"]').first()
    const hasContent = await presItem.isVisible().catch(() => false)
    if (!hasContent) {
      await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
    }
  })

})
