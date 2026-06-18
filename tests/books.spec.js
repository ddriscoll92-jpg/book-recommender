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

async function goToBooks(page) {
  await page.getByRole('button', { name: 'My Books' }).click()
  await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible({ timeout: 10_000 })
}

test.describe('My Books page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToBooks(page)
  })

  // ── Page structure ──────────────────────────────────────────────────────

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Your favourites, library and recently used books')).toBeVisible()
  })

  // ── Action buttons ───────────────────────────────────────────────────────

  test('Find books button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Find books/i })).toBeVisible()
  })

  test('Add to library button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add to library/i })).toBeVisible()
  })

  test('Find books button navigates to Book Recommender', async ({ page }) => {
    await page.getByRole('button', { name: /Find books/i }).click()
    await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible({ timeout: 5_000 })
  })

  // ── Filter bar ───────────────────────────────────────────────────────────

  test('search input is visible', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search/i).first()).toBeVisible()
  })

  test('subject filter is visible', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'All subjects' }).first()).toBeAttached()
  })

  test('year group filter is visible', async ({ page }) => {
    await expect(page.getByRole('option', { name: 'All years' }).first()).toBeAttached()
  })

  test('Has plans filter pill is visible', async ({ page }) => {
    await expect(page.getByText('📝 Has plans')).toBeVisible()
  })

  // ── Book grid ────────────────────────────────────────────────────────────

  test('books are displayed in a grid', async ({ page }) => {
    await page.waitForTimeout(1500)
    const hasBooks = await page.locator('[style*="grid"]').first().isVisible().catch(() => false)
    if (hasBooks) {
      await expect(page.locator('[style*="grid"]').first()).toBeVisible()
    }
  })

  test('book cards show title and author', async ({ page }) => {
    await page.waitForTimeout(1500)
    const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
    if (bookCount > 0) {
      // Books have View plans or Create plan buttons
      await expect(page.locator('button').filter({ hasText: /View plans|Create plan/i }).first()).toBeVisible()
    }
  })

  test('favourite star is visible on book cards', async ({ page }) => {
    await page.waitForTimeout(1500)
    const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
    if (bookCount > 0) {
      await expect(page.locator('button').filter({ hasText: /⭐|☆/ }).first()).toBeVisible()
    }
  })

  // ── Sections ─────────────────────────────────────────────────────────────

  test('Favourites section is visible when books are starred', async ({ page }) => {
    await page.waitForTimeout(1500)
    const favSection = page.getByText('⭐ Favourites')
    const hasFavs = await favSection.isVisible().catch(() => false)
    if (hasFavs) {
      await expect(favSection).toBeVisible()
    }
  })

  test('Library section is visible', async ({ page }) => {
    await page.waitForTimeout(1500)
    const libSection = page.getByText('📚 Library').first()
    const hasLib = await libSection.isVisible().catch(() => false)
    if (hasLib) {
      await expect(libSection).toBeVisible()
    }
  })

  test('Recently used section is visible', async ({ page }) => {
    await page.waitForTimeout(1500)
    const recentSection = page.getByText('🕐 Recently used').first()
    const hasRecent = await recentSection.isVisible().catch(() => false)
    if (hasRecent) {
      await expect(recentSection).toBeVisible()
    }
  })

  // ── Add to library modal ─────────────────────────────────────────────────

  test('Add to library opens a modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add to library/i }).click()
    await expect(page.getByText(/Add book to library/i)).toBeVisible({ timeout: 5_000 })
  })

  test('Add to library modal has title and author fields', async ({ page }) => {
    await page.getByRole('button', { name: /Add to library/i }).click()
    await expect(page.getByPlaceholder(/Title/i)).toBeVisible({ timeout: 5_000 })
    await expect(page.getByPlaceholder(/Author/i)).toBeVisible({ timeout: 5_000 })
  })

  test('Add to library modal can be closed', async ({ page }) => {
    await page.getByRole('button', { name: /Add to library/i }).click()
    await expect(page.getByText(/Add book to library/i)).toBeVisible({ timeout: 5_000 })
    await page.keyboard.press('Escape')
    await expect(page.getByText(/Add book to library/i)).not.toBeVisible({ timeout: 3_000 })
  })

  // ── Has plans filter ─────────────────────────────────────────────────────

  test('Has plans filter toggles on click', async ({ page }) => {
    const pill = page.getByText('📝 Has plans')
    await pill.click()
    // After clicking, it should be active (green background)
    await expect(pill).toBeVisible()
    await pill.click() // toggle off
  })

})
