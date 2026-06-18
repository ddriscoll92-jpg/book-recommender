import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL
const PASSWORD = process.env.TEST_PASSWORD

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

async function goToRecommender(page) {
  await page.getByRole('button', { name: 'Book Recommender' }).click()
  await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible({ timeout: 10_000 })
}

test.describe('Book Recommender page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToRecommender(page)
  })

  // ── Page structure ──────────────────────────────────────────────────────

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Tailored reading suggestions for UK primary school teachers')).toBeVisible()
  })

  // ── Search form ──────────────────────────────────────────────────────────

  test('subject dropdown is visible', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'Select subject...' })).toBeAttached()
  })

  test('topic input is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('e.g. Romans')).toBeVisible()
  })

  test('year group dropdown is visible', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'Select...' })).toBeAttached()
  })

  test('specific focus textarea is visible', async ({ page }) => {
    await expect(page.getByPlaceholder(/Add any specific aspect/i)).toBeVisible()
  })

  test('Find books button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Find books/i })).toBeVisible()
  })

  // ── Focus tag chips ──────────────────────────────────────────────────────

  test('focus tag chips are visible', async ({ page }) => {
    await expect(page.getByText('⚡ shared reading aloud')).toBeVisible()
    await expect(page.getByText('⚡ guided reading')).toBeVisible()
    await expect(page.getByText('⚡ class discussion')).toBeVisible()
  })

  test('clicking a focus chip toggles it', async ({ page }) => {
    const chip = page.getByText('⚡ shared reading aloud')
    await chip.click()
    // After clicking, chip should still be visible (toggled state)
    await expect(chip).toBeVisible()
    await chip.click() // toggle off
  })

  // ── Refine panel ─────────────────────────────────────────────────────────

  test('Refine results panel is visible', async ({ page }) => {
    await expect(page.getByText('Refine results')).toBeVisible()
  })

  test('Refine panel expands on click', async ({ page }) => {
    await page.getByText('Refine results').click()
    await expect(page.getByText('Fiction')).toBeVisible({ timeout: 3_000 })
  })

  // ── Validation ────────────────────────────────────────────────────────────

  test('submitting empty form shows validation error', async ({ page }) => {
    await page.getByRole('button', { name: /Find books/i }).click()
    await expect(page.getByText(/Please select a subject/i)).toBeVisible({ timeout: 5_000 })
  })

  test('submitting without year group shows validation error', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 1 })
    await page.getByPlaceholder('e.g. Romans').fill('Romans')
    await page.getByRole('button', { name: /Find books/i }).click()
    await expect(page.getByText(/Please select a year group/i)).toBeVisible({ timeout: 5_000 })
  })

  test('Find books button shows loading state when submitted correctly', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 1 })
    await page.getByPlaceholder('e.g. Romans').fill('Romans')
    await page.locator('select').nth(1).selectOption({ index: 1 })
    await page.getByRole('button', { name: /Find books/i }).click()
    // Loading state appears immediately
    await expect(page.getByText(/Finding books/i)).toBeVisible({ timeout: 5_000 })
  })

  // ── Year group options ────────────────────────────────────────────────────

  test('year group dropdown has all year options', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'Year 1' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Year 2' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Year 3' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Year 4' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Year 5' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Year 6' })).toBeAttached()
  })

  // ── Subject options ───────────────────────────────────────────────────────

  test('subject dropdown has key subjects', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'Literacy' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Science' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'History' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Geography' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Maths' })).toBeAttached()
  })

})
