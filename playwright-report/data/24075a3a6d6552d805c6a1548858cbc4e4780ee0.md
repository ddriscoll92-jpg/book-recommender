# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recommender.spec.js >> Book Recommender page >> page header is visible
- Location: tests/recommender.spec.js:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Book Recommender' })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
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
- text: Request rate limit reached
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
  8  |   await page.waitForSelector('#auth-card', { timeout: 15000 })
  9  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  10 |   if (await signInTab.isVisible()) await signInTab.click()
  11 |   await page.fill('input[type="email"]', EMAIL)
  12 |   await page.fill('input[type="password"]', PASSWORD)
  13 |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
> 14 |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15000 })
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  15 | }
  16 | 
  17 | test.describe('Book Recommender page', () => {
  18 |   test.beforeEach(async ({ page }) => {
  19 |     await signIn(page)
  20 |     await page.getByRole('button', { name: 'Book Recommender' }).click()
  21 |     await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible({ timeout: 10000 })
  22 |   })
  23 | 
  24 |   test('page header is visible', async ({ page }) => {
  25 |     await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible()
  26 |   })
  27 | 
  28 |   test('page subheading is visible', async ({ page }) => {
  29 |     await expect(page.getByText('Tailored reading suggestions for UK primary school teachers')).toBeVisible()
  30 |   })
  31 | 
  32 |   test('subject dropdown is visible', async ({ page }) => {
  33 |     await expect(page.getByRole('option', { name: 'Select subject...' })).toBeAttached()
  34 |   })
  35 | 
  36 |   test('topic input is visible', async ({ page }) => {
  37 |     await expect(page.getByPlaceholder('e.g. Romans')).toBeVisible()
  38 |   })
  39 | 
  40 |   test('year group dropdown is visible', async ({ page }) => {
  41 |     await expect(page.getByRole('option', { name: 'Select...' })).toBeAttached()
  42 |   })
  43 | 
  44 |   test('specific focus textarea is visible', async ({ page }) => {
  45 |     await expect(page.getByPlaceholder('Add any specific aspect of the topic...')).toBeVisible()
  46 |   })
  47 | 
  48 |   test('Find books button is visible', async ({ page }) => {
  49 |     await expect(page.getByRole('button', { name: /Find books/i })).toBeVisible()
  50 |   })
  51 | 
  52 |   test('focus tag chips are visible', async ({ page }) => {
  53 |     await expect(page.getByText('shared reading aloud')).toBeVisible()
  54 |     await expect(page.getByText('guided reading')).toBeVisible()
  55 |     await expect(page.getByText('class discussion')).toBeVisible()
  56 |   })
  57 | 
  58 |   test('Refine results panel is visible', async ({ page }) => {
  59 |     await expect(page.getByText('Refine results')).toBeVisible()
  60 |   })
  61 | 
  62 |   test('Refine panel expands on click', async ({ page }) => {
  63 |     await page.getByText('Refine results').click()
  64 |     await expect(page.getByText('Fiction', { exact: true })).toBeVisible({ timeout: 3000 })
  65 |   })
  66 | 
  67 |   test('submitting empty form shows validation error', async ({ page }) => {
  68 |     await page.getByRole('button', { name: /Find books/i }).click()
  69 |     await expect(page.getByText(/Please select a/i)).toBeVisible({ timeout: 5000 })
  70 |   })
  71 | 
  72 |   test('year group has all year options', async ({ page }) => {
  73 |     await expect(page.getByRole('option', { name: 'Year 1' })).toBeAttached()
  74 |     await expect(page.getByRole('option', { name: 'Year 6' })).toBeAttached()
  75 |   })
  76 | 
  77 |   test('subject dropdown has key subjects', async ({ page }) => {
  78 |     await expect(page.getByRole('option', { name: 'Literacy' })).toBeAttached()
  79 |     await expect(page.getByRole('option', { name: 'Science' })).toBeAttached()
  80 |     await expect(page.getByRole('option', { name: 'History' })).toBeAttached()
  81 |   })
  82 | 
  83 |   test.skip('Find books button shows loading state when submitted', async ({ page }) => {
  84 |     await page.locator('select').first().selectOption({ index: 1 })
  85 |     await page.getByPlaceholder('e.g. Romans').fill('Romans')
  86 |     await page.locator('select').nth(1).selectOption({ index: 1 })
  87 |     await page.getByRole('button', { name: /Find books/i }).click()
  88 |     await expect(page.getByText(/Finding books/i)).toBeVisible({ timeout: 5000 })
  89 |   })
  90 | })
  91 | 
```