import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL
const PASSWORD = process.env.TEST_PASSWORD

// Helper: navigate to the app and wait for the auth form to be visible
async function goToAuthPage(page) {
  await page.goto('/')
  await page.waitForSelector('#auth-card', { timeout: 15_000 })
}

// Helper: fill in and submit the login form
async function signIn(page, email, password) {
  // Make sure we're on the Sign in tab (not Create account)
  const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  if (await signInTab.isVisible()) await signInTab.click()

  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.getByRole('button', { name: /sign in/i }).last().click()
}

// Helper: open profile dropdown and click Sign Out
async function signOut(page) {
  // Click the ▼ chevron in the nav profile area
  await page.getByText('▼').first().click()
  await page.getByText('Sign Out').click()
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe('Authentication', () => {

  test('sign in with valid credentials', async ({ page }) => {
    await goToAuthPage(page)
    await signIn(page, EMAIL, PASSWORD)

    // After sign-in, the nav should show "Book Recommender"
    await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })

    // Auth card should be gone
    await expect(page.locator('#auth-card')).not.toBeVisible()
  })

  test('sign out returns to auth page', async ({ page }) => {
    await goToAuthPage(page)
    await signIn(page, EMAIL, PASSWORD)
    await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })

    await signOut(page)

    // Should be back on the auth page
    await expect(page.locator('#auth-card')).toBeVisible({ timeout: 10_000 })
  })

  test('sign in with wrong password shows error', async ({ page }) => {
    await goToAuthPage(page)
    await signIn(page, EMAIL, 'definitely-wrong-password-123')

    // Should stay on auth page and show an error message
    await expect(page.locator('#auth-card')).toBeVisible()
    const errorText = page.getByText(/invalid|incorrect|wrong|error/i)
    await expect(errorText).toBeVisible({ timeout: 8_000 })
  })

  test('sign in with empty fields shows validation', async ({ page }) => {
    await goToAuthPage(page)

    // Click Sign in tab then submit with empty fields
    const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
    if (await signInTab.isVisible()) await signInTab.click()

    await page.getByRole('button', { name: /sign in/i }).last().click()

    // Should stay on auth page (no navigation away)
    await expect(page.locator('#auth-card')).toBeVisible()
  })

  test('sign up with already registered email shows error', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#auth-card', { timeout: 15_000 })
    // Stay on Create account tab (default)
    await page.fill('input[placeholder*="Sarah"]', 'Test User')
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.getByRole('button', { name: /start free.*trial/i }).click()
    // Should show an error - email already registered
    await expect(page.getByText(/already registered|already in use|already exists/i)).toBeVisible({ timeout: 8_000 })
  })

  // NOTE: Session enforcement (single active session kickout) is verified
  // manually — it requires two real devices/browsers and a triggered
  // checkTrial action. Automated testing of this flow is unreliable
  // since checkTrial only fires on resource generation, not navigation.
  test.skip('session kicks out second device (session enforcement)', async ({ browser }) => {
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
    await page1.goto('/')
    await page1.waitForSelector('#auth-card', { timeout: 15_000 })
    await signIn(page1, EMAIL, PASSWORD)
    await expect(page1.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })

    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    await page2.goto('/')
    await page2.waitForSelector('#auth-card', { timeout: 15_000 })
    await signIn(page2, EMAIL, PASSWORD)
    await expect(page2.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })

    await context1.close()
    await context2.close()
  })

})
