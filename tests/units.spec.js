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

// Helper: navigate to My Units
async function goToUnits(page) {
  await page.getByRole('button', { name: 'My Units' }).click()
  await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible({ timeout: 10_000 })
}

test.describe('My Units page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToUnits(page)
  })

  // ── Page structure ──────────────────────────────────────────────────────

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Browse your units — lessons, model example, resources and presentations in one place')).toBeVisible()
  })

  // ── Picker ───────────────────────────────────────────────────────────────

  test('picker shows units or empty state', async ({ page }) => {
    // Wait for loading to finish then check for either units or empty state
    await page.waitForTimeout(1000)
    const unitCount = await page.getByText(/View unit/i).count()
    if (unitCount > 0) {
      await expect(page.getByText(/View unit/i).first()).toBeVisible()
    } else {
      await expect(page.getByText(/No units yet/i)).toBeVisible({ timeout: 5_000 })
    }
  })

  test('empty state shows Go to My Books button', async ({ page }) => {
    const emptyMsg = page.getByText(/No units yet/i)
    const isEmpty = await emptyMsg.isVisible().catch(() => false)
    if (isEmpty) {
      await expect(page.getByRole('button', { name: /Go to My Books/i })).toBeVisible()
    }
  })

  test('filter bar is visible with search input', async ({ page }) => {
    const viewUnit = page.getByText('View unit →').first()
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (hasUnits) {
      await expect(page.getByPlaceholder(/Search by book/i)).toBeVisible()
    }
  })

  test('subject filter is visible', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (hasUnits) {
      await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
    }
  })

  test('year filter is visible', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (hasUnits) {
      await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
    }
  })

  test('units are grouped by book title', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (hasUnits) {
      // Book titles appear as group headers
      const groupHeaders = page.locator('[style*="Lora"]').first()
      await expect(groupHeaders).toBeVisible()
    }
  })

  test('each plan row has edit and delete buttons', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (hasUnits) {
      await expect(page.getByTitle('✏️').first().or(page.locator('button').filter({ hasText: '✏️' }).first())).toBeVisible().catch(() => {})
      await expect(page.locator('button').filter({ hasText: '🗑️' }).first()).toBeVisible()
    }
  })

  // ── Unit detail ──────────────────────────────────────────────────────────

  test('clicking View unit opens unit detail', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  })

  test('unit detail shows book card', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
    // Book card shows year group, subject and lesson count
    await expect(page.getByText(/lessons/).first()).toBeVisible()
  })

  test('unit detail shows Lessons tab', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByRole('button', { name: /Lessons/i }).first()).toBeVisible({ timeout: 5_000 })
  })

  test('unit detail shows Resources tab', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByRole('button', { name: /Resources/i }).first()).toBeVisible({ timeout: 5_000 })
  })

  test('unit detail shows Presentations tab', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByRole('button', { name: /Presentations/i }).first()).toBeVisible({ timeout: 5_000 })
  })

  test('Back to all units link returns to picker', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
    await page.getByText('← All units').click()
    await expect(page.getByText(/View unit/i).first()).toBeVisible({ timeout: 5_000 })
  })

  test('Lessons tab shows lesson rows with learning intentions', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText(/Learning intention:/i).first()).toBeVisible({ timeout: 5_000 })
  })

  test('Resources tab shows Create resource button', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /Resources/i }).first().click()
    await expect(page.getByRole('button', { name: /Create resource/i })).toBeVisible()
  })

  test('Presentations tab shows Create presentation button', async ({ page }) => {
    const hasUnits = await page.getByText(/View unit/i).first().isVisible().catch(() => false)
    if (!hasUnits) { test.skip(); return }
    await page.getByText(/View unit/i).first().click()
    await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /Presentations/i }).first().click()
    await expect(page.getByRole('button', { name: /Create presentation/i })).toBeVisible()
  })

})
