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

// Helper: navigate to My Resources
async function goToResources(page) {
  await page.getByRole('button', { name: 'My Resources' }).click()
  await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible({ timeout: 10_000 })
}

test.describe('My Resources page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToResources(page)
  })

  // ── Page structure ──────────────────────────────────────────────────────

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Generate and browse all your classroom resources')).toBeVisible()
  })

  // ── Tabs ────────────────────────────────────────────────────────────────

  test('all three tabs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Quick resource/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /From a plan/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /My catalogue/i })).toBeVisible()
  })

  test('Quick resource tab is active by default', async ({ page }) => {
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('From a plan tab switches content', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.getByText('Step 1')).toBeVisible()
  })

  test('My catalogue tab switches content', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  })

  // ── Quick resource tab ───────────────────────────────────────────────────

  test('textarea is present', async ({ page }) => {
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('all 5 example prompts are visible', async ({ page }) => {
    await expect(page.getByText(/maths worksheet for Year 4 on multiplication/i)).toBeVisible()
    await expect(page.getByText(/Year 2 phonics activity/i)).toBeVisible()
    await expect(page.getByText(/science knowledge organiser for Year 5/i)).toBeVisible()
    await expect(page.getByText(/Year 6 reading comprehension/i)).toBeVisible()
    await expect(page.getByText(/PSHE discussion activity for Year 3/i)).toBeVisible()
  })

  test('clicking an example prompt fills the textarea', async ({ page }) => {
    await page.getByText(/maths worksheet for Year 4 on multiplication/i).click()
    await expect(page.locator('textarea')).not.toBeEmpty()
  })

  test('generate button is disabled when textarea is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  })

  test('generate button enables when text is typed', async ({ page }) => {
    await page.locator('textarea').fill('Create a worksheet about the Romans for Year 4')
    await expect(page.getByRole('button', { name: /Generate resource/i })).toBeEnabled()
  })

  test('clearing textarea disables generate button again', async ({ page }) => {
    await page.locator('textarea').fill('Create a worksheet about the Romans')
    await page.locator('textarea').fill('')
    await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  })

  // ── From a plan tab ──────────────────────────────────────────────────────

  test('From a plan tab shows plan search', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.getByPlaceholder(/Search plans/i)).toBeVisible()
  })

  test('From a plan tab shows resource type selector', async ({ page }) => {
    await page.getByRole('button', { name: /From a plan/i }).click()
    await expect(page.getByText(/Step 2 — Select a lesson/i)).toBeVisible()
    await expect(page.getByText(/Step 3 — Choose resource type/i)).toBeVisible()
  })

  // ── My catalogue tab ─────────────────────────────────────────────────────

  test('My catalogue tab shows search input', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  })

  test('My catalogue tab shows type filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByRole('option', { name: 'All types' })).toBeAttached()
  })

  test('My catalogue tab shows subject filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  })

  test('My catalogue tab shows year filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  })

  test('My catalogue tab shows favourites filter', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByText('⭐ Favourites')).toBeVisible()
  })

  test('My catalogue tab shows refresh button', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    await expect(page.getByTitle('Refresh')).toBeVisible()
  })

  test('empty catalogue shows correct message', async ({ page }) => {
    await page.getByRole('button', { name: /My catalogue/i }).click()
    const emptyMsg = page.getByText(/Generate a resource using Quick resource/i)
    const hasItems = await page.locator('[resource_type]').count() > 0
    if (!hasItems) {
      await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
    }
  })

})
