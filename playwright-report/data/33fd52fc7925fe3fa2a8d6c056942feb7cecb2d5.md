# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.js >> Home screen (pre-login) >> nav shows TeachReads brand
- Location: tests/home.spec.js:17:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('TeachReads').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('TeachReads').first()

```

```yaml
- text: 📚 LessonNest How it works
- button "Sign in"
- button "Get started free"
- text: For UK primary school teachers 🎁 5-day free trial — no credit card required
- heading "Lesson planning, powered by AI" [level=1]
- paragraph: Find books, generate full units of work and create classroom resources — all in one place. Save hours of planning every week.
- text: 📚 Smart book recommendations matched to your topic and year group 📋 Full units of work with NC links, SEND adaptations and model examples 🛠️ Classroom resources worksheets, starters, exit tickets and more 🏫 Your school library manage books, track plans and reuse resources S J R M Trusted by UK primary teachers
- heading "Get started free" [level=2]
- paragraph: 5-day free trial · No credit card required
- button "Create account"
- button "Sign in"
- text: Your name
- textbox "e.g. Sarah Jones"
- text: Email address
- textbox "your@school.co.uk"
- text: Password
- textbox "At least 6 characters"
- text: "Your trial includes: ✓ 10 book searches ✓ 10 units of work ✓ 15 resources ✓ 20 load mores"
- button "Start free 5-day trial"
- text: or
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
  3   | // ── Pre-login / home screen tests ─────────────────────────────────────────
  4   | // These tests verify everything visible BEFORE a user logs in.
  5   | // No credentials needed.
  6   | 
  7   | test.describe('Home screen (pre-login)', () => {
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/')
  11  |     // Wait for the page to fully load
  12  |     await page.waitForSelector('#auth-card', { timeout: 15_000 })
  13  |   })
  14  | 
  15  |   // ── Nav ──────────────────────────────────────────────────────────────────
  16  | 
  17  |   test('nav shows TeachReads brand', async ({ page }) => {
> 18  |     await expect(page.getByText('TeachReads').first()).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  19  |   })
  20  | 
  21  |   test('nav has Sign in button', async ({ page }) => {
  22  |     await expect(page.getByRole('button', { name: 'Sign in' }).first()).toBeVisible()
  23  |   })
  24  | 
  25  |   test('nav has Get started free button', async ({ page }) => {
  26  |     await expect(page.getByRole('button', { name: 'Get started free' })).toBeVisible()
  27  |   })
  28  | 
  29  |   test('nav How it works link scrolls to section', async ({ page }) => {
  30  |     await page.locator('span').filter({ hasText: 'How it works' }).click()
  31  |     // After scroll, the how-it-works section should be in view
  32  |     const section = page.locator('#how-it-works')
  33  |     await expect(section).toBeVisible({ timeout: 5_000 })
  34  |   })
  35  | 
  36  |   // ── Auth card ─────────────────────────────────────────────────────────────
  37  | 
  38  |   test('auth card is visible on load', async ({ page }) => {
  39  |     await expect(page.locator('#auth-card')).toBeVisible()
  40  |   })
  41  | 
  42  |   test('auth card defaults to Create account tab', async ({ page }) => {
  43  |     // The name field only shows on signup mode
  44  |     await expect(page.locator('input[placeholder*="Sarah"]')).toBeVisible()
  45  |   })
  46  | 
  47  |   test('Sign in tab switches to login mode', async ({ page }) => {
  48  |     await page.getByRole('button', { name: 'Sign in' }).first().click()
  49  |     // Name field should disappear in login mode
  50  |     await expect(page.locator('input[placeholder*="Sarah"]')).not.toBeVisible()
  51  |     // Email and password should still be visible
  52  |     await expect(page.locator('input[type="email"]')).toBeVisible()
  53  |     await expect(page.locator('input[type="password"]')).toBeVisible()
  54  |   })
  55  | 
  56  |   test('email input is present', async ({ page }) => {
  57  |     await expect(page.locator('input[type="email"]')).toBeVisible()
  58  |   })
  59  | 
  60  |   test('password input is present', async ({ page }) => {
  61  |     await expect(page.locator('input[type="password"]')).toBeVisible()
  62  |   })
  63  | 
  64  |   test('submit button shows correct label for signup', async ({ page }) => {
  65  |     await expect(page.getByRole('button', { name: /start free.*trial/i })).toBeVisible()
  66  |   })
  67  | 
  68  |   test('submit button switches label when on Sign in tab', async ({ page }) => {
  69  |     await page.getByRole('button', { name: 'Sign in' }).first().click()
  70  |     await expect(page.getByRole('button', { name: /^sign in$/i }).last()).toBeVisible()
  71  |   })
  72  | 
  73  |   // ── Validation ────────────────────────────────────────────────────────────
  74  | 
  75  |   test('empty signup shows error', async ({ page }) => {
  76  |     await page.getByRole('button', { name: /start free.*trial/i }).click()
  77  |     await expect(page.getByText(/fill in all fields|enter your name|please fill/i)).toBeVisible({ timeout: 5_000 })
  78  |   })
  79  | 
  80  |   test('short password shows error', async ({ page }) => {
  81  |     await page.fill('input[placeholder*="Sarah"]', 'Test Teacher')
  82  |     await page.fill('input[type="email"]', 'test@example.com')
  83  |     await page.fill('input[type="password"]', '123')
  84  |     await page.getByRole('button', { name: /start free.*trial/i }).click()
  85  |     await expect(page.getByText(/at least 6 characters/i)).toBeVisible({ timeout: 5_000 })
  86  |   })
  87  | 
  88  |   test('forgot password link shows reset mode', async ({ page }) => {
  89  |     await page.getByRole('button', { name: 'Sign in' }).first().click()
  90  |     await page.getByText(/forgot/i).click()
  91  |     // Password field should disappear in reset mode
  92  |     await expect(page.locator('input[type="password"]')).not.toBeVisible()
  93  |     await expect(page.getByRole('button', { name: /send reset/i })).toBeVisible()
  94  |   })
  95  | 
  96  |   // ── Legal links ───────────────────────────────────────────────────────────
  97  | 
  98  |   test('Privacy Policy link is present', async ({ page }) => {
  99  |     await expect(page.getByText(/privacy policy/i).first()).toBeVisible()
  100 |   })
  101 | 
  102 |   test('Terms of Service link is present', async ({ page }) => {
  103 |     await expect(page.getByText(/terms of service/i).first()).toBeVisible()
  104 |   })
  105 | 
  106 |   // ── Marketing content ─────────────────────────────────────────────────────
  107 | 
  108 |   test('hero headline is visible', async ({ page }) => {
  109 |     await expect(page.getByText(/UK primary school teachers/i).first()).toBeVisible()
  110 |   })
  111 | 
  112 |   test('benefits section shows all 4 features', async ({ page }) => {
  113 |     await expect(page.getByText('Smart book recommendations', { exact: true })).toBeVisible()
  114 |     await expect(page.getByText('Full units of work', { exact: true })).toBeVisible()
  115 |     await expect(page.getByText('Classroom resources', { exact: true })).toBeVisible()
  116 |     await expect(page.getByText('Your school library', { exact: true })).toBeVisible()
  117 |   })
  118 | 
```