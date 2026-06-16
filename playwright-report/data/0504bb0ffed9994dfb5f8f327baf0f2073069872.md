# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication >> session kicks out second device (session enforcement)
- Location: tests/auth.spec.js:79:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#auth-card')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('#auth-card')

```

```yaml
- text: 📚 TeachReads
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
- button "AI Assistant"
- text: S simon Premium plan ▼ 📖
- heading "My Books" [level=1]
- paragraph: Your favourites, library and recently used books
- button "+ Find books"
- button "+ Add to library"
- text: 🔍
- textbox "Search by book or author..."
- text: Subject
- combobox:
  - option "All subjects" [selected]
  - option "Art"
  - option "DT"
  - option "Geography"
  - option "History"
  - option "Literacy"
  - option "Maths"
  - option "PSHE"
- text: Year
- combobox:
  - option "All years" [selected]
  - option "Year 1"
  - option "Year 3"
  - option "Year 4"
- text: 📝 Has plans 17 books 🏫 My library 3
- paragraph: Books you own — add, edit and create plans from your physical collection
- text: 📚
- button "☆"
- text: "My library 📝 2 plans The Tiger Who Came to Tea Judith Kerr Literacy Year 1 1 copy Accessed: 12 Jun 2026"
- button "View plans (2)"
- button "View book"
- button "✏️"
- button "🗑️"
- text: 🔧
- button "☆"
- text: "My library There's a monster in your book Tom Fletcher DT Year 1 42 copies Accessed: 8 Jun 2026"
- button "✨ Create plan"
- button "View book"
- button "✏️"
- button "🗑️"
- text: 🎨
- button "⭐"
- text: "My library 📝 2 plans The Creakers Tom Fletcher Art Year 3 14 copies Accessed: 8 Jun 2026"
- button "View plans (2)"
- button "View book"
- button "✏️"
- button "🗑️"
- separator
- text: ⭐ My favourites 5
- paragraph: Your top books — starred for quick access
- text: 🌍
- button "⭐"
- text: "📝 3 plans The Snail and the Whale Julia Donaldson Geography Year 3 ★ ★ ★ ★ ★ Accessed: 15 Jun 2026"
- button "View plans (3)"
- button "View book"
- text: 💚
- button "⭐"
- text: "📝 2 plans How to Train Your Dragon Cressida Cowell PSHE Year 3 ★ ★ ★ ★ ★ ⭐ 4.0 (1) Accessed: 13 Jun 2026"
- button "View plans (2)"
- button "View book"
- text: 🔢
- button "⭐"
- text: "📝 3 plans One Hundred Hungry Ants Elinor J. Pinczes Maths Year 1 ★ ★ ★ ★ ★ ⭐ 5.0 (1) Accessed: 8 Jun 2026"
- button "View plans (3)"
- button "View book"
- text: 🔢
- button "⭐"
- text: "📝 12 plans Volcanoes Seymour Simon Maths Year 4 ★ ★ ★ ★ ★ Accessed: 7 Jun 2026"
- button "View plans (12)"
- button "View book"
- text: 🎨
- button "⭐"
- text: "My library 📝 2 plans The Creakers Tom Fletcher Art Year 3 14 copies Accessed: 8 Jun 2026"
- button "View plans (2)"
- button "View book"
- button "✏️"
- button "🗑️"
- separator
- text: 🕐 Recently used 9
- paragraph: Books you've found and used through the book recommender
- text: 🔢
- button "☆"
- text: "📝 1 plan Vikings DK Eyewitness Maths Year 3 ★ ★ ★ ★ ★ ⭐ 5.0 (1) Accessed: 15 Jun 2026"
- button "View plans (1)"
- button "View book"
- text: 🔢
- button "☆"
- text: "Viking Math Unknown Maths Year 3 ★ ★ ★ ★ ★ Accessed: 13 Jun 2026"
- button "✨ Create plan"
- button "View book"
- text: 📚
- button "☆"
- text: "📝 1 plan Beowulf Michael Morpurgo Literacy Year 1 ★ ★ ★ ★ ★ Accessed: 13 Jun 2026"
- button "View plans (1)"
- button "View book"
- text: 📚
- button "☆"
- text: "📝 7 plans Escape from Pompeii Christina Balit Literacy Year 4 ★ ★ ★ ★ ★ Accessed: 10 Jun 2026"
- button "View plans (7)"
- button "View book"
- text: 🏛️
- button "☆"
- text: "Horrible Histories: Vicious Vikings Terry Deary History Year 3 ★ ★ ★ ★ ★ Accessed: 8 Jun 2026"
- button "✨ Create plan"
- button "View book"
- text: 📚
- button "☆"
- text: "📝 1 plan The BFG Roald Dahl Literacy Year 4 ★ ★ ★ ★ ★ Accessed: 8 Jun 2026"
- button "View plans (1)"
- button "View book"
- button "Load more (3 remaining)"
- text: TeachReads · For UK primary school teachers
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
  96  |     // On device 1, trigger a checkTrial action by navigating to My Books
  97  |     await page1.getByRole('button', { name: 'My Books' }).click()
  98  |     await page1.waitForTimeout(3_000)
  99  | 
  100 |     // Device 1 should be redirected back to auth with a session message
> 101 |     await expect(page1.locator('#auth-card')).toBeVisible({ timeout: 15_000 })
      |                                               ^ Error: expect(locator).toBeVisible() failed
  102 |     await expect(page1.getByText(/signed out.*another device/i)).toBeVisible({ timeout: 5_000 })
  103 | 
  104 |     await context1.close()
  105 |     await context2.close()
  106 |   })
  107 | 
  108 | })
  109 | 
```