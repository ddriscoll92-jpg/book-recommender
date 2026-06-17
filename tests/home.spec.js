import { test, expect } from '@playwright/test'

// ── Pre-login / home screen tests ─────────────────────────────────────────
// These tests verify everything visible BEFORE a user logs in.
// No credentials needed.

test.describe('Home screen (pre-login)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the page to fully load
    await page.waitForSelector('#auth-card', { timeout: 15_000 })
  })

  // ── Nav ──────────────────────────────────────────────────────────────────

  test('nav shows LessonNest brand', async ({ page }) => {
    await expect(page.getByText('LessonNest').first()).toBeVisible()
  })

  test('nav has Sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign in' }).first()).toBeVisible()
  })

  test('nav has Get started free button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Get started free' })).toBeVisible()
  })

  test('nav How it works link scrolls to section', async ({ page }) => {
    await page.locator('span').filter({ hasText: 'How it works' }).click()
    // After scroll, the how-it-works section should be in view
    const section = page.locator('#how-it-works')
    await expect(section).toBeVisible({ timeout: 5_000 })
  })

  // ── Auth card ─────────────────────────────────────────────────────────────

  test('auth card is visible on load', async ({ page }) => {
    await expect(page.locator('#auth-card')).toBeVisible()
  })

  test('auth card defaults to Create account tab', async ({ page }) => {
    // The name field only shows on signup mode
    await expect(page.locator('input[placeholder*="Sarah"]')).toBeVisible()
  })

  test('Sign in tab switches to login mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    // Name field should disappear in login mode
    await expect(page.locator('input[placeholder*="Sarah"]')).not.toBeVisible()
    // Email and password should still be visible
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('email input is present', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('password input is present', async ({ page }) => {
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('submit button shows correct label for signup', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start free.*trial/i })).toBeVisible()
  })

  test('submit button switches label when on Sign in tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await expect(page.getByRole('button', { name: /^sign in$/i }).last()).toBeVisible()
  })

  // ── Validation ────────────────────────────────────────────────────────────

  test('empty signup shows error', async ({ page }) => {
    await page.getByRole('button', { name: /start free.*trial/i }).click()
    await expect(page.getByText(/fill in all fields|enter your name|please fill/i)).toBeVisible({ timeout: 5_000 })
  })

  test('short password shows error', async ({ page }) => {
    await page.fill('input[placeholder*="Sarah"]', 'Test Teacher')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', '123')
    await page.getByRole('button', { name: /start free.*trial/i }).click()
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible({ timeout: 5_000 })
  })

  test('forgot password link shows reset mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await page.getByText(/forgot/i).click()
    // Password field should disappear in reset mode
    await expect(page.locator('input[type="password"]')).not.toBeVisible()
    await expect(page.getByRole('button', { name: /send reset/i })).toBeVisible()
  })

  // ── Legal links ───────────────────────────────────────────────────────────

  test('Privacy Policy link is present', async ({ page }) => {
    await expect(page.getByText(/privacy policy/i).first()).toBeVisible()
  })

  test('Terms of Service link is present', async ({ page }) => {
    await expect(page.getByText(/terms of service/i).first()).toBeVisible()
  })

  // ── Marketing content ─────────────────────────────────────────────────────

  test('hero headline is visible', async ({ page }) => {
    await expect(page.getByText(/UK primary school teachers/i).first()).toBeVisible()
  })

  test('benefits section shows all 4 features', async ({ page }) => {
    await expect(page.getByText('Smart book recommendations', { exact: true })).toBeVisible()
    await expect(page.getByText('Full units of work', { exact: true })).toBeVisible()
    await expect(page.getByText('Classroom resources', { exact: true })).toBeVisible()
    await expect(page.getByText('Your school library', { exact: true })).toBeVisible()
  })

  test('how it works shows 3 steps', async ({ page }) => {
    await expect(page.getByText('Find the perfect book')).toBeVisible()
    await expect(page.getByText('Generate a unit of work')).toBeVisible()
    await expect(page.getByText('Create resources')).toBeVisible()
  })

  // ── Navigation shortcuts ──────────────────────────────────────────────────

  test('Get started free button scrolls to auth card', async ({ page }) => {
    // Scroll away first
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.getByRole('button', { name: 'Get started free' }).click()
    await expect(page.locator('#auth-card')).toBeInViewport({ timeout: 5_000 })
  })

  test('Sign in nav button scrolls to auth card and switches to login', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await expect(page.locator('#auth-card')).toBeInViewport({ timeout: 5_000 })
    // Should be in login mode — name field not visible
    await expect(page.locator('input[placeholder*="Sarah"]')).not.toBeVisible()
  })

})
