# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: books.spec.js >> My Books page >> Add to library opens a modal
- Location: tests/books.spec.js:130:7

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
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const EMAIL = process.env.TEST_EMAIL
  4   | const PASSWORD = process.env.TEST_PASSWORD
  5   | 
  6   | async function signIn(page) {
  7   |   await page.goto('/')
  8   |   await page.waitForSelector('#auth-card', { timeout: 15_000 })
  9   |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  10  |   if (await signInTab.isVisible()) await signInTab.click()
  11  |   await page.fill('input[type="email"]', EMAIL)
  12  |   await page.fill('input[type="password"]', PASSWORD)
  13  |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
> 14  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  15  | }
  16  | 
  17  | async function goToBooks(page) {
  18  |   await page.getByRole('button', { name: 'My Books' }).click()
  19  |   await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible({ timeout: 10_000 })
  20  | }
  21  | 
  22  | test.describe('My Books page', () => {
  23  | 
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await signIn(page)
  26  |     await goToBooks(page)
  27  |   })
  28  | 
  29  |   // ── Page structure ──────────────────────────────────────────────────────
  30  | 
  31  |   test('page header is visible', async ({ page }) => {
  32  |     await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
  33  |   })
  34  | 
  35  |   test('page subheading is visible', async ({ page }) => {
  36  |     await expect(page.getByText('Your favourites, library and recently used books')).toBeVisible()
  37  |   })
  38  | 
  39  |   // ── Action buttons ───────────────────────────────────────────────────────
  40  | 
  41  |   test('Find books button is visible', async ({ page }) => {
  42  |     await expect(page.getByRole('button', { name: /Find books/i })).toBeVisible()
  43  |   })
  44  | 
  45  |   test('Add to library button is visible', async ({ page }) => {
  46  |     await expect(page.getByRole('button', { name: /Add to library/i })).toBeVisible()
  47  |   })
  48  | 
  49  |   test('Find books button navigates to Book Recommender', async ({ page }) => {
  50  |     await page.getByRole('button', { name: /Find books/i }).click()
  51  |     await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible({ timeout: 5_000 })
  52  |   })
  53  | 
  54  |   // ── Filter bar ───────────────────────────────────────────────────────────
  55  | 
  56  |   test('search input is visible', async ({ page }) => {
  57  |     await expect(page.getByPlaceholder(/Search/i).first()).toBeVisible()
  58  |   })
  59  | 
  60  |   test('subject filter is visible', async ({ page }) => {
  61  |     await expect(page.getByRole('option', { name: 'All subjects' }).first()).toBeAttached()
  62  |   })
  63  | 
  64  |   test('year group filter is visible', async ({ page }) => {
  65  |     await expect(page.getByRole('option', { name: 'All years' }).first()).toBeAttached()
  66  |   })
  67  | 
  68  |   test('Has plans filter pill is visible', async ({ page }) => {
  69  |     await expect(page.getByText('📝 Has plans')).toBeVisible()
  70  |   })
  71  | 
  72  |   // ── Book grid ────────────────────────────────────────────────────────────
  73  | 
  74  |   test('books are displayed in a grid', async ({ page }) => {
  75  |     await page.waitForTimeout(1500)
  76  |     const hasBooks = await page.locator('[style*="grid"]').first().isVisible().catch(() => false)
  77  |     if (hasBooks) {
  78  |       await expect(page.locator('[style*="grid"]').first()).toBeVisible()
  79  |     }
  80  |   })
  81  | 
  82  |   test('book cards show title and author', async ({ page }) => {
  83  |     await page.waitForTimeout(1500)
  84  |     const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
  85  |     if (bookCount > 0) {
  86  |       // Books have View plans or Create plan buttons
  87  |       await expect(page.locator('button').filter({ hasText: /View plans|Create plan/i }).first()).toBeVisible()
  88  |     }
  89  |   })
  90  | 
  91  |   test('favourite star is visible on book cards', async ({ page }) => {
  92  |     await page.waitForTimeout(1500)
  93  |     const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
  94  |     if (bookCount > 0) {
  95  |       await expect(page.locator('button').filter({ hasText: /⭐|☆/ }).first()).toBeVisible()
  96  |     }
  97  |   })
  98  | 
  99  |   // ── Sections ─────────────────────────────────────────────────────────────
  100 | 
  101 |   test('Favourites section is visible when books are starred', async ({ page }) => {
  102 |     await page.waitForTimeout(1500)
  103 |     const favSection = page.getByText('⭐ Favourites')
  104 |     const hasFavs = await favSection.isVisible().catch(() => false)
  105 |     if (hasFavs) {
  106 |       await expect(favSection).toBeVisible()
  107 |     }
  108 |   })
  109 | 
  110 |   test('Library section is visible', async ({ page }) => {
  111 |     await page.waitForTimeout(1500)
  112 |     const libSection = page.getByText('📚 Library').first()
  113 |     const hasLib = await libSection.isVisible().catch(() => false)
  114 |     if (hasLib) {
```