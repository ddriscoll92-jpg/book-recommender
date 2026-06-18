# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.js >> Profile & settings >> Personal tab shows avatar upload
- Location: tests/profile.spec.js:65:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Upload photo/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Upload photo/i)

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
- button "AI Assistant"
- text: S simon Premium plan ▼ 📚
- heading "Book Recommender" [level=1]
- paragraph: Tailored reading suggestions for UK primary school teachers
- text: Subject
- combobox:
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
- text: Topic
- textbox "e.g. Romans"
- text: Year group
- combobox:
  - option "Select..." [selected]
  - option "Year 1"
  - option "Year 2"
  - option "Year 3"
  - option "Year 4"
  - option "Year 5"
  - option "Year 6"
- text: Specific focus — optional
- textbox "Add any specific aspect of the topic..."
- text: ⚡ ⚡ shared reading aloud ⚡ ⚡ independent reading ⚡ ⚡ inspires creative writing ⚡ ⚡ supports SEND learners ⚡ ⚡ guided reading ⚡ ⚡ class discussion ⚡ ⚡ supports EAL learners ⚙️ Refine results Filter by type, content and reading level ▼
- button "✨ Find books"
- text: LessonNest · For UK primary school teachers Profile settings
- button "×"
- text: 👤 Personal 🏫 School ⚙️ Preferences 🔑 Password 🗑️ Account S 📷 Change photo JPG or PNG, max 2MB Display name
- textbox "Your name": simon
- text: Email address
- textbox "your@school.co.uk": squidolies@gmail.com
- button "Save changes"
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
  8   |   await page.waitForSelector('#auth-card', { timeout: 30_000 })
  9   |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
  10  |   if (await signInTab.isVisible()) await signInTab.click()
  11  |   await page.fill('input[type="email"]', EMAIL)
  12  |   await page.fill('input[type="password"]', PASSWORD)
  13  |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
  14  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 30_000 })
  15  | }
  16  | 
  17  | async function openProfile(page) {
  18  |   await page.getByText('▼').first().click()
  19  |   await page.getByText('Profile & settings').click()
  20  |   await expect(page.getByText('Profile settings')).toBeVisible({ timeout: 10_000 })
  21  | }
  22  | 
  23  | test.describe('Profile & settings', () => {
  24  | 
  25  |   test.beforeEach(async ({ page }) => {
  26  |     await signIn(page)
  27  |     await openProfile(page)
  28  |   })
  29  | 
  30  |   // ── Modal structure ──────────────────────────────────────────────────────
  31  | 
  32  |   test('profile modal opens with correct title', async ({ page }) => {
  33  |     await expect(page.getByText('Profile settings')).toBeVisible()
  34  |   })
  35  | 
  36  |   test('modal can be closed with × button', async ({ page }) => {
  37  |     await page.locator('button').filter({ hasText: '×' }).click()
  38  |     await expect(page.getByText('Profile settings')).not.toBeVisible({ timeout: 3_000 })
  39  |   })
  40  | 
  41  |   // ── Sidebar tabs ─────────────────────────────────────────────────────────
  42  | 
  43  |   test('all 5 tabs are visible', async ({ page }) => {
  44  |     await expect(page.getByText('👤 Personal')).toBeVisible()
  45  |     await expect(page.getByText('🏫 School')).toBeVisible()
  46  |     await expect(page.getByText('⚙️ Preferences')).toBeVisible()
  47  |     await expect(page.getByText('🔑 Password')).toBeVisible()
  48  |     await expect(page.getByText('🗑️ Account')).toBeVisible()
  49  |   })
  50  | 
  51  |   test('Personal tab is active by default', async ({ page }) => {
  52  |     await expect(page.getByText('Display name')).toBeVisible()
  53  |   })
  54  | 
  55  |   // ── Personal tab ─────────────────────────────────────────────────────────
  56  | 
  57  |   test('Personal tab shows display name field', async ({ page }) => {
  58  |     await expect(page.getByText('Display name')).toBeVisible()
  59  |   })
  60  | 
  61  |   test('Personal tab shows email field', async ({ page }) => {
  62  |     await expect(page.getByText('Email address')).toBeVisible()
  63  |   })
  64  | 
  65  |   test('Personal tab shows avatar upload', async ({ page }) => {
> 66  |     await expect(page.getByText(/Upload photo/i)).toBeVisible()
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  67  |   })
  68  | 
  69  |   // ── School tab ───────────────────────────────────────────────────────────
  70  | 
  71  |   test('School tab switches content', async ({ page }) => {
  72  |     await page.getByText('🏫 School').click()
  73  |     await expect(page.getByText('School name')).toBeVisible()
  74  |   })
  75  | 
  76  |   test('School tab shows region field', async ({ page }) => {
  77  |     await page.getByText('🏫 School').click()
  78  |     await expect(page.getByText('Region')).toBeVisible()
  79  |   })
  80  | 
  81  |   test('School tab shows year groups field', async ({ page }) => {
  82  |     await page.getByText('🏫 School').click()
  83  |     await expect(page.getByText('Year groups you teach')).toBeVisible()
  84  |   })
  85  | 
  86  |   // ── Preferences tab ──────────────────────────────────────────────────────
  87  | 
  88  |   test('Preferences tab switches content', async ({ page }) => {
  89  |     await page.getByText('⚙️ Preferences').click()
  90  |     await expect(page.getByText('Default year group')).toBeVisible()
  91  |   })
  92  | 
  93  |   test('Preferences tab shows default subject', async ({ page }) => {
  94  |     await page.getByText('⚙️ Preferences').click()
  95  |     await expect(page.getByText('Default subject')).toBeVisible()
  96  |   })
  97  | 
  98  |   // ── Password tab ─────────────────────────────────────────────────────────
  99  | 
  100 |   test('Password tab switches content', async ({ page }) => {
  101 |     await page.getByText('🔑 Password').click()
  102 |     await expect(page.getByText('Current password')).toBeVisible()
  103 |   })
  104 | 
  105 |   test('Password tab shows new password field', async ({ page }) => {
  106 |     await page.getByText('🔑 Password').click()
  107 |     await expect(page.getByText('New password')).toBeVisible()
  108 |   })
  109 | 
  110 |   test('Password tab shows confirm password field', async ({ page }) => {
  111 |     await page.getByText('🔑 Password').click()
  112 |     await expect(page.getByText('Confirm new password')).toBeVisible()
  113 |   })
  114 | 
  115 |   test('mismatched passwords shows error', async ({ page }) => {
  116 |     await page.getByText('🔑 Password').click()
  117 |     await page.locator('input[type="password"]').nth(1).fill('newpassword123')
  118 |     await page.locator('input[type="password"]').nth(2).fill('differentpassword')
  119 |     await page.getByRole('button', { name: /Update password/i }).click()
  120 |     await expect(page.getByText(/do not match/i)).toBeVisible({ timeout: 5_000 })
  121 |   })
  122 | 
  123 |   // ── Account tab ──────────────────────────────────────────────────────────
  124 | 
  125 |   test('Account tab switches content', async ({ page }) => {
  126 |     await page.getByText('🗑️ Account').click()
  127 |     await expect(page.getByText(/Delete account/i)).toBeVisible()
  128 |   })
  129 | 
  130 |   test('Account tab shows delete warning', async ({ page }) => {
  131 |     await page.getByText('🗑️ Account').click()
  132 |     await expect(page.getByText(/permanently delete/i)).toBeVisible()
  133 |   })
  134 | 
  135 |   test('delete requires typing DELETE to confirm', async ({ page }) => {
  136 |     await page.getByText('🗑️ Account').click()
  137 |     await page.getByRole('button', { name: /Delete my account/i }).click()
  138 |     await expect(page.getByPlaceholder(/Type DELETE/i)).toBeVisible({ timeout: 5_000 })
  139 |   })
  140 | 
  141 | })
  142 | 
```