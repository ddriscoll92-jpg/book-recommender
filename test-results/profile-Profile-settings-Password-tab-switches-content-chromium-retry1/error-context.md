# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.js >> Profile & settings >> Password tab switches content
- Location: tests/profile.spec.js:100:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('New password')
Expected: visible
Error: strict mode violation: getByText('New password') resolved to 2 elements:
    1) <label>New password</label> aka getByText('New password', { exact: true })
    2) <label>Confirm new password</label> aka getByText('Confirm new password')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('New password')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: 📚
      - generic [ref=e8]: LessonNest
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
        - generic [ref=e21]: gmail.com
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
    - generic [ref=e62]: LessonNest · For UK primary school teachers
  - generic [ref=e64]:
    - generic [ref=e65]:
      - generic [ref=e66]: Profile settings
      - button "×" [ref=e67] [cursor=pointer]
    - generic [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70] [cursor=pointer]: 👤 Personal
        - generic [ref=e71] [cursor=pointer]: 🏫 School
        - generic [ref=e72] [cursor=pointer]: ⚙️ Preferences
        - generic [ref=e73] [cursor=pointer]: 🔑 Password
        - generic [ref=e74] [cursor=pointer]: 🗑️ Account
      - generic [ref=e76]:
        - paragraph [ref=e77]: Choose a strong password of at least 6 characters.
        - generic [ref=e78]:
          - generic [ref=e79]: New password
          - textbox "New password" [ref=e80]
        - generic [ref=e81]:
          - generic [ref=e82]: Confirm new password
          - textbox "Confirm password" [ref=e83]
        - button "Update password" [ref=e84] [cursor=pointer]
        - generic [ref=e85]:
          - generic [ref=e86]: Forgotten your password?
          - button "Send reset email" [ref=e87] [cursor=pointer]
```

# Test source

```ts
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
  66  |     await expect(page.getByText(/Change photo/i)).toBeVisible()
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
  78  |     await expect(page.getByRole('option', { name: 'Select region...' })).toBeAttached()
  79  |   })
  80  | 
  81  |   test('School tab shows year groups field', async ({ page }) => {
  82  |     await page.getByText('🏫 School').click()
  83  |     await expect(page.getByText('Year groups I teach')).toBeVisible()
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
> 102 |     await expect(page.getByText('New password')).toBeVisible()
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  103 |   })
  104 | 
  105 |   test('Password tab shows confirm password field label', async ({ page }) => {
  106 |     await page.getByText('🔑 Password').click()
  107 |     await expect(page.getByText('Confirm new password')).toBeVisible()
  108 |   })
  109 | 
  110 |   test('Password tab shows confirm password field', async ({ page }) => {
  111 |     await page.getByText('🔑 Password').click()
  112 |     await expect(page.getByText('Confirm new password')).toBeVisible()
  113 |   })
  114 | 
  115 |   test('mismatched passwords shows error', async ({ page }) => {
  116 |     await page.getByText('🔑 Password').click()
  117 |     await page.locator('input[placeholder="New password"]').fill('newpassword123')
  118 |     await page.locator('input[placeholder="Confirm password"]').fill('differentpassword')
  119 |     await expect(page.getByText(/do not match/i)).toBeVisible({ timeout: 5_000 })
  120 |   })
  121 | 
  122 |   // ── Account tab ──────────────────────────────────────────────────────────
  123 | 
  124 |   test('Account tab switches content', async ({ page }) => {
  125 |     await page.getByText('🗑️ Account').click()
  126 |     await expect(page.getByText(/Delete account/i)).toBeVisible()
  127 |   })
  128 | 
  129 |   test('Account tab shows delete warning', async ({ page }) => {
  130 |     await page.getByText('🗑️ Account').click()
  131 |     await expect(page.getByText(/permanently delete/i)).toBeVisible()
  132 |   })
  133 | 
  134 |   test('delete requires typing DELETE to confirm', async ({ page }) => {
  135 |     await page.getByText('🗑️ Account').click()
  136 |     await page.getByRole('button', { name: /Delete my account/i }).click()
  137 |     await expect(page.getByPlaceholder('DELETE')).toBeVisible({ timeout: 5_000 })
  138 |   })
  139 | 
  140 | })
  141 | 
```