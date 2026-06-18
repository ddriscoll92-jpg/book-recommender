# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: units.spec.js >> My Units page >> page header is visible
- Location: tests/units.spec.js:33:7

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
  6   | // Helper: sign in
  7   | async function signIn(page) {
  8   |   await page.goto('/')
  9   |   await page.waitForSelector('#auth-card', { timeout: 15_000 })
  10  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  11  |   if (await signInTab.isVisible()) await signInTab.click()
  12  |   await page.fill('input[type="email"]', EMAIL)
  13  |   await page.fill('input[type="password"]', PASSWORD)
  14  |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
> 15  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  16  | }
  17  | 
  18  | // Helper: navigate to My Units
  19  | async function goToUnits(page) {
  20  |   await page.getByRole('button', { name: 'My Units' }).click()
  21  |   await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible({ timeout: 10_000 })
  22  | }
  23  | 
  24  | test.describe('My Units page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToUnits(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
  38  |     await expect(page.getByText('Browse your units — lessons, model example, resources and presentations in one place')).toBeVisible()
  39  |   })
  40  | 
  41  |   // ── Picker ───────────────────────────────────────────────────────────────
  42  | 
  43  |   test('picker shows units or empty state', async ({ page }) => {
  44  |     // Wait for loading to finish — check for edit buttons (present when units exist) or empty state
  45  |     await page.waitForTimeout(1500)
  46  |     const editBtnCount = await page.locator('button').filter({ hasText: '✏️' }).count()
  47  |     if (editBtnCount > 0) {
  48  |       await expect(page.locator('button').filter({ hasText: '✏️' }).first()).toBeVisible()
  49  |     } else {
  50  |       await expect(page.getByText(/No units yet/i)).toBeVisible({ timeout: 5_000 })
  51  |     }
  52  |   })
  53  | 
  54  |   test('empty state shows Go to My Books button', async ({ page }) => {
  55  |     const emptyMsg = page.getByText(/No units yet/i)
  56  |     const isEmpty = await emptyMsg.isVisible().catch(() => false)
  57  |     if (isEmpty) {
  58  |       await expect(page.getByRole('button', { name: /Go to My Books/i })).toBeVisible()
  59  |     }
  60  |   })
  61  | 
  62  |   test('filter bar is visible with search input', async ({ page }) => {
  63  |     
  64  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  65  |     if (hasUnits) {
  66  |       await expect(page.getByPlaceholder(/Search by book/i)).toBeVisible()
  67  |     }
  68  |   })
  69  | 
  70  |   test('subject filter is visible', async ({ page }) => {
  71  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  72  |     if (hasUnits) {
  73  |       await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  74  |     }
  75  |   })
  76  | 
  77  |   test('year filter is visible', async ({ page }) => {
  78  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  79  |     if (hasUnits) {
  80  |       await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  81  |     }
  82  |   })
  83  | 
  84  |   test('units are grouped by book title', async ({ page }) => {
  85  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  86  |     if (hasUnits) {
  87  |       // Book titles appear as group headers
  88  |       const groupHeaders = page.locator('[style*="Lora"]').first()
  89  |       await expect(groupHeaders).toBeVisible()
  90  |     }
  91  |   })
  92  | 
  93  |   test('each plan row has edit and delete buttons', async ({ page }) => {
  94  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  95  |     if (hasUnits) {
  96  |       await expect(page.getByTitle('✏️').first().or(page.locator('button').filter({ hasText: '✏️' }).first())).toBeVisible().catch(() => {})
  97  |       await expect(page.locator('button').filter({ hasText: '🗑️' }).first()).toBeVisible()
  98  |     }
  99  |   })
  100 | 
  101 |   // ── Unit detail ──────────────────────────────────────────────────────────
  102 | 
  103 |   test('clicking View unit opens unit detail', async ({ page }) => {
  104 |     await page.waitForTimeout(1500)
  105 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  106 |     if (!hasUnits) { test.skip(); return }
  107 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  108 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  109 |   })
  110 | 
  111 |   test('unit detail shows book card', async ({ page }) => {
  112 |     await page.waitForTimeout(1500)
  113 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  114 |     if (!hasUnits) { test.skip(); return }
  115 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
```