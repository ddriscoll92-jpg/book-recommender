# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication >> sign up with already registered email shows error
- Location: tests/auth.spec.js:79:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/already registered|already in use|already exists/i)
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/already registered|already in use|already exists/i)

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
- text: Account created! Please check your email to confirm your account before signing in.
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
  6   | // Helper: navigate to the app and wait for the auth form to be visible
  7   | async function goToAuthPage(page) {
  8   |   await page.goto('/')
  9   |   await page.waitForSelector('#auth-card', { timeout: 15_000 })
  10  | }
  11  | 
  12  | // Helper: fill in and submit the login form
  13  | async function signIn(page, email, password) {
  14  |   // Make sure we're on the Sign in tab (not Create account)
  15  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  16  |   if (await signInTab.isVisible()) await signInTab.click()
  17  | 
  18  |   await page.fill('input[type="email"]', email)
  19  |   await page.fill('input[type="password"]', password)
  20  |   await page.getByRole('button', { name: /sign in/i }).last().click()
  21  | }
  22  | 
  23  | // Helper: open profile dropdown and click Sign Out
  24  | async function signOut(page) {
  25  |   // Click the ▼ chevron in the nav profile area
  26  |   await page.getByText('▼').first().click()
  27  |   await page.getByText('Sign Out').click()
  28  | }
  29  | 
  30  | // ── Tests ──────────────────────────────────────────────────────────────────
  31  | 
  32  | test.describe('Authentication', () => {
  33  | 
  34  |   test('sign in with valid credentials', async ({ page }) => {
  35  |     await goToAuthPage(page)
  36  |     await signIn(page, EMAIL, PASSWORD)
  37  | 
  38  |     // After sign-in, the nav should show "Book Recommender"
  39  |     await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  40  | 
  41  |     // Auth card should be gone
  42  |     await expect(page.locator('#auth-card')).not.toBeVisible()
  43  |   })
  44  | 
  45  |   test('sign out returns to auth page', async ({ page }) => {
  46  |     await goToAuthPage(page)
  47  |     await signIn(page, EMAIL, PASSWORD)
  48  |     await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  49  | 
  50  |     await signOut(page)
  51  | 
  52  |     // Should be back on the auth page
  53  |     await expect(page.locator('#auth-card')).toBeVisible({ timeout: 10_000 })
  54  |   })
  55  | 
  56  |   test('sign in with wrong password shows error', async ({ page }) => {
  57  |     await goToAuthPage(page)
  58  |     await signIn(page, EMAIL, 'definitely-wrong-password-123')
  59  | 
  60  |     // Should stay on auth page and show an error message
  61  |     await expect(page.locator('#auth-card')).toBeVisible()
  62  |     const errorText = page.getByText(/invalid|incorrect|wrong|error/i)
  63  |     await expect(errorText).toBeVisible({ timeout: 8_000 })
  64  |   })
  65  | 
  66  |   test('sign in with empty fields shows validation', async ({ page }) => {
  67  |     await goToAuthPage(page)
  68  | 
  69  |     // Click Sign in tab then submit with empty fields
  70  |     const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  71  |     if (await signInTab.isVisible()) await signInTab.click()
  72  | 
  73  |     await page.getByRole('button', { name: /sign in/i }).last().click()
  74  | 
  75  |     // Should stay on auth page (no navigation away)
  76  |     await expect(page.locator('#auth-card')).toBeVisible()
  77  |   })
  78  | 
  79  |   test('sign up with already registered email shows error', async ({ page }) => {
  80  |     await page.goto('/')
  81  |     await page.waitForSelector('#auth-card', { timeout: 15_000 })
  82  |     // Stay on Create account tab (default)
  83  |     await page.fill('input[placeholder*="Sarah"]', 'Test User')
  84  |     await page.fill('input[type="email"]', EMAIL)
  85  |     await page.fill('input[type="password"]', PASSWORD)
  86  |     await page.getByRole('button', { name: /start free.*trial/i }).click()
  87  |     // Should show an error - email already registered
> 88  |     await expect(page.getByText(/already registered|already in use|already exists/i)).toBeVisible({ timeout: 8_000 })
      |                                                                                       ^ Error: expect(locator).toBeVisible() failed
  89  |   })
  90  | 
  91  |   // NOTE: Session enforcement (single active session kickout) is verified
  92  |   // manually — it requires two real devices/browsers and a triggered
  93  |   // checkTrial action. Automated testing of this flow is unreliable
  94  |   // since checkTrial only fires on resource generation, not navigation.
  95  |   test.skip('session kicks out second device (session enforcement)', async ({ browser }) => {
  96  |     const context1 = await browser.newContext()
  97  |     const page1 = await context1.newPage()
  98  |     await page1.goto('/')
  99  |     await page1.waitForSelector('#auth-card', { timeout: 15_000 })
  100 |     await signIn(page1, EMAIL, PASSWORD)
  101 |     await expect(page1.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  102 | 
  103 |     const context2 = await browser.newContext()
  104 |     const page2 = await context2.newPage()
  105 |     await page2.goto('/')
  106 |     await page2.waitForSelector('#auth-card', { timeout: 15_000 })
  107 |     await signIn(page2, EMAIL, PASSWORD)
  108 |     await expect(page2.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  109 | 
  110 |     await context1.close()
  111 |     await context2.close()
  112 |   })
  113 | 
  114 | })
  115 | 
```