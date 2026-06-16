# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication >> sign out returns to auth page
- Location: tests/auth.spec.js:45:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('nav > div > div').last()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: 📚
      - generic [ref=e8]: TeachReads
    - generic [ref=e9]:
      - button "Book Recommender" [ref=e10] [cursor=pointer]
      - button "My Books" [ref=e11] [cursor=pointer]
      - button "My Units" [ref=e12] [cursor=pointer]
      - button "My Resources" [ref=e13] [cursor=pointer]
      - button "My Presentations" [ref=e14] [cursor=pointer]
      - button "AI Assistant" [ref=e15] [cursor=pointer]
    - generic [ref=e17] [cursor=pointer]:
      - generic [ref=e18]: S
      - generic [ref=e19]:
        - generic [ref=e20]: simon
        - generic [ref=e21]: Premium plan
      - generic [ref=e22]: ▼
  - generic [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]: 📚
      - generic [ref=e27]:
        - heading "Book Recommender" [level=1] [ref=e28]
        - paragraph [ref=e29]: Tailored reading suggestions for UK primary school teachers
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Subject
          - combobox [ref=e34] [cursor=pointer]:
            - option "Select subject..."
            - option "Art"
            - option "Computing"
            - option "DT"
            - option "Geography"
            - option "History"
            - option "Literacy"
            - option "Maths" [selected]
            - option "Music"
            - option "PE"
            - option "PSHE"
            - option "RE"
            - option "Science"
        - generic [ref=e35]:
          - generic [ref=e36]: Topic
          - textbox "e.g. Romans" [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]: Year group
          - combobox [ref=e40] [cursor=pointer]:
            - option "Select..." [selected]
            - option "Year 1"
            - option "Year 2"
            - option "Year 3"
            - option "Year 4"
            - option "Year 5"
            - option "Year 6"
      - generic [ref=e41]:
        - generic [ref=e42]: Specific focus — optional
        - textbox "Add any specific aspect of the topic..." [ref=e43]
        - generic [ref=e44]:
          - generic [ref=e45] [cursor=pointer]: ⚡ ⚡ shared reading aloud
          - generic [ref=e46] [cursor=pointer]: ⚡ ⚡ independent reading
          - generic [ref=e47] [cursor=pointer]: ⚡ ⚡ inspires creative writing
          - generic [ref=e48] [cursor=pointer]: ⚡ ⚡ supports SEND learners
          - generic [ref=e49] [cursor=pointer]: ⚡ ⚡ guided reading
          - generic [ref=e50] [cursor=pointer]: ⚡ ⚡ class discussion
          - generic [ref=e51] [cursor=pointer]: ⚡ ⚡ supports EAL learners
      - generic [ref=e53] [cursor=pointer]:
        - generic [ref=e54]:
          - generic [ref=e55]: ⚙️
          - generic [ref=e56]:
            - generic [ref=e57]: Refine results
            - generic [ref=e58]: Filter by type, content and reading level
        - generic [ref=e60]: ▼
    - button "✨ Find books" [ref=e61] [cursor=pointer]
    - generic [ref=e62]: TeachReads · For UK primary school teachers
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
  25  |   // Profile area is a div in the nav (not a button) — target by its position as last child
> 26  |   await page.locator('nav > div > div').last().click()
      |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  79  |   test('session kicks out second device (session enforcement)', async ({ browser }) => {
  80  |     // Sign in on "device 1"
  81  |     const context1 = await browser.newContext()
  82  |     const page1 = await context1.newPage()
  83  |     await page1.goto('/')
  84  |     await page1.waitForSelector('#auth-card', { timeout: 15_000 })
  85  |     await signIn(page1, EMAIL, PASSWORD)
  86  |     await expect(page1.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  87  | 
  88  |     // Sign in on "device 2" (separate browser context = separate localStorage)
  89  |     const context2 = await browser.newContext()
  90  |     const page2 = await context2.newPage()
  91  |     await page2.goto('/')
  92  |     await page2.waitForSelector('#auth-card', { timeout: 15_000 })
  93  |     await signIn(page2, EMAIL, PASSWORD)
  94  |     await expect(page2.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  95  | 
  96  |     // On device 1, trigger a checkTrial action (book search) — should get kicked out
  97  |     await page1.getByRole('button', { name: 'Book Recommender' }).click()
  98  |     await page1.fill('input[placeholder*="book"]', 'Charlotte')
  99  |     await page1.keyboard.press('Enter')
  100 | 
  101 |     // Device 1 should be redirected back to auth with a session message
  102 |     await expect(page1.locator('#auth-card')).toBeVisible({ timeout: 15_000 })
  103 |     await expect(page1.getByText(/signed out.*another device/i)).toBeVisible({ timeout: 5_000 })
  104 | 
  105 |     await context1.close()
  106 |     await context2.close()
  107 |   })
  108 | 
  109 | })
  110 | 
```