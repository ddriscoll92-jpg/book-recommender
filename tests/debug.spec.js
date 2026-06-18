import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_EMAIL
const PASSWORD = process.env.TEST_PASSWORD

test('debug - find clickable row', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('#auth-card', { timeout: 15_000 })
  const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  if (await signInTab.isVisible()) await signInTab.click()
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.getByRole('button', { name: /^sign in$/i }).last().click()
  await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  
  await page.getByRole('button', { name: 'My Units' }).click()
  await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible({ timeout: 10_000 })
  
  await page.waitForTimeout(2000)
  
  // Log counts of various selectors
  const editBtns = await page.locator('button').filter({ hasText: '✏️' }).count()
  const cursorPtrs = await page.locator('[style*="cursor: pointer"]').count()
  const lessonTexts = await page.getByText(/lessons/i).count()
  
  console.log('Edit buttons:', editBtns)
  console.log('Cursor pointer elements:', cursorPtrs)  
  console.log('Lesson texts:', lessonTexts)
  
  // Try clicking first cursor pointer with lessons text
  const rows = page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i })
  const rowCount = await rows.count()
  console.log('Matching rows:', rowCount)
  
  if (rowCount > 0) {
    await rows.first().click()
    await page.waitForTimeout(1000)
    const allUnits = await page.getByText('← All units').isVisible()
    console.log('← All units visible after click:', allUnits)
  }
})
