# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assistant.spec.js >> AI Assistant page >> send button enables when text is typed
- Location: tests/assistant.spec.js:68:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Book Recommender' })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByRole('button', { name: 'Book Recommender' })

```

```yaml
- text: 📚 LessonNest How it works
- button "Sign in"
- button "Get started free"
- text: For UK primary school teachers 🎁 5-day free trial — no credit card required
- heading "Lesson planning, powered by AI" [level=1]
- paragraph: Find books, generate full units of work and create classroom resources — all in one place. Save hours of planning every week.
- text: 📚 Smart book recommendations matched to your topic and year group 📋 Full units of work with NC links, SEND adaptations and model examples 🛠️ Classroom resources worksheets, starters, exit tickets and more 🏫 Your school library manage books, track plans and reuse resources S J R M Trusted by UK primary teachers
- heading "Welcome back" [level=2]
- paragraph: Sign in to your LessonNest account
- button "Create account"
- button "Sign in"
- text: Email address
- textbox "your@school.co.uk": squidolies@gmail.com
- text: Password
- textbox "Your password": Hotdog1234!
- text: Invalid login credentials
- button "Sign in"
- text: Forgot your password? or
- button "Continue with Google (coming soon)" [disabled]:
  - img
  - text: Continue with Google (coming soon)
- paragraph: By signing up you agree to our Terms of Service and Privacy Policy
- heading "How it works" [level=2]
- paragraph: Three steps from finding a book to having a full unit of work ready to teach
- text: 1 Find the perfect book Search by subject, topic and year group. AI recommends books matched to your curriculum. → 2 Generate a unit of work One click creates a full lesson sequence with NC links, SEND adaptations and model examples. → 3 Create resources Generate differentiated worksheets, starters, exit tickets and more. Download as PDF or Word.
- button "Start your free 5-day trial →"
- text: ✓ 5-day free trial ✓ No credit card needed ✓ Cancel anytime 📚 LessonNest For UK primary school teachers Privacy Terms Contact
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const EMAIL = process.env.TEST_EMAIL
  4  | const PASSWORD = process.env.TEST_PASSWORD
  5  | 
  6  | async function signIn(page) {
  7  |   await page.goto('/')
  8  |   await page.waitForSelector('#auth-card', { timeout: 30_000 })
  9  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  10 |   if (await signInTab.isVisible()) await signInTab.click()
  11 |   await page.fill('input[type="email"]', EMAIL)
  12 |   await page.fill('input[type="password"]', PASSWORD)
  13 |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
> 14 |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 30_000 })
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  15 | }
  16 | 
  17 | async function goToAssistant(page) {
  18 |   await page.getByRole('button', { name: 'AI Assistant' }).click()
  19 |   await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible({ timeout: 15_000 })
  20 | }
  21 | 
  22 | test.describe('AI Assistant page', () => {
  23 | 
  24 |   test.beforeEach(async ({ page }) => {
  25 |     await signIn(page)
  26 |     await goToAssistant(page)
  27 |   })
  28 | 
  29 |   test('page header is visible', async ({ page }) => {
  30 |     await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible()
  31 |   })
  32 | 
  33 |   test('page subheading is visible', async ({ page }) => {
  34 |     await expect(page.getByText('Ask anything about teaching, planning, differentiation and more')).toBeVisible()
  35 |   })
  36 | 
  37 |   test('privacy notice is visible', async ({ page }) => {
  38 |     await expect(page.getByText(/do not enter pupil names/i)).toBeVisible()
  39 |   })
  40 | 
  41 |   test('welcome message is shown', async ({ page }) => {
  42 |     await expect(page.getByText(/Hello! I'm your AI teaching assistant/i)).toBeVisible()
  43 |   })
  44 | 
  45 |   test('all 5 suggested prompts are visible', async ({ page }) => {
  46 |     await expect(page.getByRole('button', { name: /differentiate a lesson on fractions/i })).toBeVisible()
  47 |     await expect(page.getByRole('button', { name: /strategies for supporting a pupil with dyslexia/i })).toBeVisible()
  48 |     await expect(page.getByRole('button', { name: /teach the 5 times table/i })).toBeVisible()
  49 |     await expect(page.getByRole('button', { name: /positive report comment/i })).toBeVisible()
  50 |     await expect(page.getByRole('button', { name: /Ofsted look for/i })).toBeVisible()
  51 |   })
  52 | 
  53 |   test('clicking a suggested prompt fills the input', async ({ page }) => {
  54 |     await page.getByRole('button', { name: /differentiate a lesson on fractions/i }).click()
  55 |     const textarea = page.locator('textarea')
  56 |     await expect(textarea).not.toBeEmpty()
  57 |   })
  58 | 
  59 |   test('textarea is present', async ({ page }) => {
  60 |     await expect(page.locator('textarea')).toBeVisible()
  61 |   })
  62 | 
  63 |   test('send button is disabled when input is empty', async ({ page }) => {
  64 |     const sendBtn = page.getByRole('button', { name: /send/i })
  65 |     await expect(sendBtn).toBeDisabled()
  66 |   })
  67 | 
  68 |   test('send button enables when text is typed', async ({ page }) => {
  69 |     await page.locator('textarea').fill('How do I plan a lesson?')
  70 |     const sendBtn = page.getByRole('button', { name: /send/i })
  71 |     await expect(sendBtn).toBeEnabled()
  72 |   })
  73 | 
  74 |   test('typing and clearing input disables send button again', async ({ page }) => {
  75 |     await page.locator('textarea').fill('How do I plan a lesson?')
  76 |     await page.locator('textarea').fill('')
  77 |     const sendBtn = page.getByRole('button', { name: /send/i })
  78 |     await expect(sendBtn).toBeDisabled()
  79 |   })
  80 | 
  81 |   test('user message appears in chat after sending', async ({ page }) => {
  82 |     const message = 'What is phonics?'
  83 |     await page.locator('textarea').fill(message)
  84 |     await page.getByRole('button', { name: /send/i }).click()
  85 |     await expect(page.getByText(message)).toBeVisible()
  86 |     await expect(page.locator('textarea')).toBeEmpty()
  87 |   })
  88 | 
  89 |   test('"Thinking..." indicator appears while waiting for response', async ({ page }) => {
  90 |     await page.locator('textarea').fill('What is phonics?')
  91 |     await page.getByRole('button', { name: /send/i }).click()
  92 |     await expect(page.getByText('Thinking...')).toBeVisible({ timeout: 5_000 })
  93 |   })
  94 | 
  95 | })
  96 | 
```