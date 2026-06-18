# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resources.spec.js >> My Resources page >> page subheading is visible
- Location: tests/resources.spec.js:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Generate and browse classroom resources for your lessons')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Generate and browse classroom resources for your lessons')

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
- button "AI Assistant"
- text: S simon Premium plan ▼ 🛠️
- heading "My Resources" [level=1]
- paragraph: Generate and browse all your classroom resources
- button "⚡ Quick resource"
- button "📋 From a plan"
- button "📂 My catalogue"
- paragraph: Describe the resource you need. Be as specific as you like — include year group, subject, topic, and any differentiation requirements.
- textbox "e.g. \"Create a maths worksheet for Year 4 on multiplication, differentiated for below, at and above expectation\""
- text: EXAMPLE PROMPTS ⚡ Create a maths worksheet for Year 4 on multiplication, differentiated for below, at and above expectation ⚡ Make a Year 2 phonics activity focusing on the 'igh' sound with pictures and tracing ⚡ Create a science knowledge organiser for Year 5 on the water cycle ⚡ Generate a Year 6 reading comprehension passage and questions about the Vikings ⚡ Create a PSHE discussion activity for Year 3 about feelings and emotions
- button "✨ Generate resource" [disabled]
- text: LessonNest · For UK primary school teachers
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const EMAIL = process.env.TEST_EMAIL
  4   | const PASSWORD = process.env.TEST_PASSWORD
  5   | 
  6   | // Helper: sign in
  7   | async function signIn(page) {
  8   |   await page.goto('/')
  9   |   await page.waitForSelector('#auth-card', { timeout: 15_000 })
  10  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  11  |   if (await signInTab.isVisible()) await signInTab.click()
  12  |   await page.fill('input[type="email"]', EMAIL)
  13  |   await page.fill('input[type="password"]', PASSWORD)
  14  |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
  15  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  16  | }
  17  | 
  18  | // Helper: navigate to My Resources
  19  | async function goToResources(page) {
  20  |   await page.getByRole('button', { name: 'My Resources' }).click()
  21  |   await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible({ timeout: 10_000 })
  22  | }
  23  | 
  24  | test.describe('My Resources page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToResources(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
> 38  |     await expect(page.getByText('Generate and browse classroom resources for your lessons')).toBeVisible()
      |                                                                                              ^ Error: expect(locator).toBeVisible() failed
  39  |   })
  40  | 
  41  |   // ── Tabs ────────────────────────────────────────────────────────────────
  42  | 
  43  |   test('all three tabs are visible', async ({ page }) => {
  44  |     await expect(page.getByRole('button', { name: /Quick resource/i })).toBeVisible()
  45  |     await expect(page.getByRole('button', { name: /From a plan/i })).toBeVisible()
  46  |     await expect(page.getByRole('button', { name: /My catalogue/i })).toBeVisible()
  47  |   })
  48  | 
  49  |   test('Quick resource tab is active by default', async ({ page }) => {
  50  |     await expect(page.locator('textarea')).toBeVisible()
  51  |   })
  52  | 
  53  |   test('From a plan tab switches content', async ({ page }) => {
  54  |     await page.getByRole('button', { name: /From a plan/i }).click()
  55  |     await expect(page.getByText('Step 1')).toBeVisible()
  56  |   })
  57  | 
  58  |   test('My catalogue tab switches content', async ({ page }) => {
  59  |     await page.getByRole('button', { name: /My catalogue/i }).click()
  60  |     await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  61  |   })
  62  | 
  63  |   // ── Quick resource tab ───────────────────────────────────────────────────
  64  | 
  65  |   test('textarea is present', async ({ page }) => {
  66  |     await expect(page.locator('textarea')).toBeVisible()
  67  |   })
  68  | 
  69  |   test('all 5 example prompts are visible', async ({ page }) => {
  70  |     await expect(page.getByText(/maths worksheet for Year 4 on multiplication/i)).toBeVisible()
  71  |     await expect(page.getByText(/Year 2 phonics activity/i)).toBeVisible()
  72  |     await expect(page.getByText(/science knowledge organiser for Year 5/i)).toBeVisible()
  73  |     await expect(page.getByText(/Year 6 reading comprehension/i)).toBeVisible()
  74  |     await expect(page.getByText(/PSHE discussion activity for Year 3/i)).toBeVisible()
  75  |   })
  76  | 
  77  |   test('clicking an example prompt fills the textarea', async ({ page }) => {
  78  |     await page.getByText(/maths worksheet for Year 4 on multiplication/i).click()
  79  |     await expect(page.locator('textarea')).not.toBeEmpty()
  80  |   })
  81  | 
  82  |   test('generate button is disabled when textarea is empty', async ({ page }) => {
  83  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  84  |   })
  85  | 
  86  |   test('generate button enables when text is typed', async ({ page }) => {
  87  |     await page.locator('textarea').fill('Create a worksheet about the Romans for Year 4')
  88  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeEnabled()
  89  |   })
  90  | 
  91  |   test('clearing textarea disables generate button again', async ({ page }) => {
  92  |     await page.locator('textarea').fill('Create a worksheet about the Romans')
  93  |     await page.locator('textarea').fill('')
  94  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  95  |   })
  96  | 
  97  |   // ── From a plan tab ──────────────────────────────────────────────────────
  98  | 
  99  |   test('From a plan tab shows plan search', async ({ page }) => {
  100 |     await page.getByRole('button', { name: /From a plan/i }).click()
  101 |     await expect(page.getByPlaceholder(/Search plans/i)).toBeVisible()
  102 |   })
  103 | 
  104 |   test('From a plan tab shows resource type selector', async ({ page }) => {
  105 |     await page.getByRole('button', { name: /From a plan/i }).click()
  106 |     await expect(page.getByText('Worksheet')).toBeVisible()
  107 |     await expect(page.getByText('Exit ticket')).toBeVisible()
  108 |     await expect(page.getByText('Vocabulary cards')).toBeVisible()
  109 |   })
  110 | 
  111 |   // ── My catalogue tab ─────────────────────────────────────────────────────
  112 | 
  113 |   test('My catalogue tab shows search input', async ({ page }) => {
  114 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  115 |     await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  116 |   })
  117 | 
  118 |   test('My catalogue tab shows type filter', async ({ page }) => {
  119 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  120 |     await expect(page.getByRole('option', { name: 'All types' })).toBeAttached()
  121 |   })
  122 | 
  123 |   test('My catalogue tab shows subject filter', async ({ page }) => {
  124 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  125 |     await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  126 |   })
  127 | 
  128 |   test('My catalogue tab shows year filter', async ({ page }) => {
  129 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  130 |     await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  131 |   })
  132 | 
  133 |   test('My catalogue tab shows favourites filter', async ({ page }) => {
  134 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  135 |     await expect(page.getByText('⭐ Favourites')).toBeVisible()
  136 |   })
  137 | 
  138 |   test('My catalogue tab shows refresh button', async ({ page }) => {
```