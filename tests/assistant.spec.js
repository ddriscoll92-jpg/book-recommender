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

async function goToAssistant(page) {
  await page.getByRole('button', { name: 'AI Assistant' }).click()
  await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible({ timeout: 15_000 })
}

test.describe('AI Assistant page', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await goToAssistant(page)
  })

  test('page header is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible()
  })

  test('page subheading is visible', async ({ page }) => {
    await expect(page.getByText('Ask anything about teaching, planning, differentiation and more')).toBeVisible()
  })

  test('privacy notice is visible', async ({ page }) => {
    await expect(page.getByText(/do not enter pupil names/i)).toBeVisible()
  })

  test('welcome message is shown', async ({ page }) => {
    await expect(page.getByText(/Hello! I'm your AI teaching assistant/i)).toBeVisible()
  })

  test('all 5 suggested prompts are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /differentiate a lesson on fractions/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /strategies for supporting a pupil with dyslexia/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /teach the 5 times table/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /positive report comment/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Ofsted look for/i })).toBeVisible()
  })

  test('clicking a suggested prompt fills the input', async ({ page }) => {
    await page.getByRole('button', { name: /differentiate a lesson on fractions/i }).click()
    const textarea = page.locator('textarea')
    await expect(textarea).not.toBeEmpty()
  })

  test('textarea is present', async ({ page }) => {
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('send button is disabled when input is empty', async ({ page }) => {
    const sendBtn = page.getByRole('button', { name: /send/i })
    await expect(sendBtn).toBeDisabled()
  })

  test('send button enables when text is typed', async ({ page }) => {
    await page.locator('textarea').fill('How do I plan a lesson?')
    const sendBtn = page.getByRole('button', { name: /send/i })
    await expect(sendBtn).toBeEnabled()
  })

  test('typing and clearing input disables send button again', async ({ page }) => {
    await page.locator('textarea').fill('How do I plan a lesson?')
    await page.locator('textarea').fill('')
    const sendBtn = page.getByRole('button', { name: /send/i })
    await expect(sendBtn).toBeDisabled()
  })

  test('user message appears in chat after sending', async ({ page }) => {
    const message = 'What is phonics?'
    await page.locator('textarea').fill(message)
    await page.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText(message)).toBeVisible()
    await expect(page.locator('textarea')).toBeEmpty()
  })

  test('"Thinking..." indicator appears while waiting for response', async ({ page }) => {
    await page.locator('textarea').fill('What is phonics?')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText('Thinking...')).toBeVisible({ timeout: 5_000 })
  })

})
