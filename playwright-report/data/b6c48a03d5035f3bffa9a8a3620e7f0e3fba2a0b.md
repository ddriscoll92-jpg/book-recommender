# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.js >> Navigation >> profile dropdown closes when clicking outside
- Location: tests/navigation.spec.js:78:7

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByText('Profile & settings')
Expected: not visible
Received: visible
Timeout:  3000ms

Call log:
  - Expect "not toBeVisible" with timeout 3000ms
  - waiting for getByText('Profile & settings')
    10 × locator resolved to <div>👤  Profile & settings</div>
       - unexpected value "visible"

```

```yaml
- text: 👤 Profile & settings
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
  17  | test.describe('Navigation', () => {
  18  | 
  19  |   test.beforeEach(async ({ page }) => {
  20  |     await signIn(page)
  21  |   })
  22  | 
  23  |   test('Book Recommender nav link loads correct page', async ({ page }) => {
  24  |     await page.getByRole('button', { name: 'Book Recommender' }).click()
  25  |     await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible()
  26  |   })
  27  | 
  28  |   test('My Books nav link loads correct page', async ({ page }) => {
  29  |     await page.getByRole('button', { name: 'My Books' }).click()
  30  |     await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
  31  |   })
  32  | 
  33  |   test('My Units nav link loads correct page', async ({ page }) => {
  34  |     await page.getByRole('button', { name: 'My Units' }).click()
  35  |     await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible()
  36  |   })
  37  | 
  38  |   test('My Resources nav link loads correct page', async ({ page }) => {
  39  |     await page.getByRole('button', { name: 'My Resources' }).click()
  40  |     await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible()
  41  |   })
  42  | 
  43  |   test('My Presentations nav link loads correct page', async ({ page }) => {
  44  |     await page.getByRole('button', { name: 'My Presentations' }).click()
  45  |     await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible()
  46  |   })
  47  | 
  48  |   test('AI Assistant nav link loads correct page', async ({ page }) => {
  49  |     await page.getByRole('button', { name: 'AI Assistant' }).click()
  50  |     await expect(page.getByRole('heading', { name: 'AI Teaching Assistant' })).toBeVisible()
  51  |   })
  52  | 
  53  |   test('active nav item is highlighted', async ({ page }) => {
  54  |     await page.getByRole('button', { name: 'My Books' }).click()
  55  |     await expect(page.getByRole('button', { name: 'My Books' })).toHaveAttribute('data-active', 'true').catch(async () => {
  56  |       // Fallback: check the button has active styling (cursor change or colour)
  57  |       await expect(page.getByRole('button', { name: 'My Books' })).toBeVisible()
  58  |     })
  59  |   })
  60  | 
  61  |   // ── Profile dropdown ─────────────────────────────────────────────────────
  62  | 
  63  |   test('profile dropdown opens on click', async ({ page }) => {
  64  |     await page.getByText('▼').first().click()
  65  |     await expect(page.getByText('Profile & settings')).toBeVisible()
  66  |   })
  67  | 
  68  |   test('profile dropdown shows all menu items', async ({ page }) => {
  69  |     await page.getByText('▼').first().click()
  70  |     await expect(page.getByText('Profile & settings')).toBeVisible()
  71  |     await expect(page.getByText('Plan options')).toBeVisible()
  72  |     await expect(page.getByText('Invite a colleague')).toBeVisible()
  73  |     await expect(page.getByText('Privacy & Terms')).toBeVisible()
  74  |     await expect(page.getByText('Contact us')).toBeVisible()
  75  |     await expect(page.getByText('Sign Out')).toBeVisible()
  76  |   })
  77  | 
  78  |   test('profile dropdown closes when clicking outside', async ({ page }) => {
  79  |     await page.getByText('▼').first().click()
  80  |     await expect(page.getByText('Profile & settings')).toBeVisible()
  81  |     await page.locator('body').click({ position: { x: 100, y: 400 } })
> 82  |     await expect(page.getByText('Profile & settings')).not.toBeVisible({ timeout: 3_000 })
      |                                                            ^ Error: expect(locator).not.toBeVisible() failed
  83  |   })
  84  | 
  85  |   // ── Invite modal ─────────────────────────────────────────────────────────
  86  | 
  87  |   test('invite modal opens from profile dropdown', async ({ page }) => {
  88  |     await page.getByText('▼').first().click()
  89  |     await page.getByText('Invite a colleague').click()
  90  |     await expect(page.getByText('📨 Invite a colleague')).toBeVisible({ timeout: 5_000 })
  91  |   })
  92  | 
  93  |   test('invite modal has email input', async ({ page }) => {
  94  |     await page.getByText('▼').first().click()
  95  |     await page.getByText('Invite a colleague').click()
  96  |     await expect(page.getByPlaceholder(/colleague@school/i)).toBeVisible()
  97  |   })
  98  | 
  99  |   test('invite modal send button disabled when email empty', async ({ page }) => {
  100 |     await page.getByText('▼').first().click()
  101 |     await page.getByText('Invite a colleague').click()
  102 |     await expect(page.getByRole('button', { name: /Send invite/i })).toBeDisabled()
  103 |   })
  104 | 
  105 |   test('invite modal send button enabled when email entered', async ({ page }) => {
  106 |     await page.getByText('▼').first().click()
  107 |     await page.getByText('Invite a colleague').click()
  108 |     await page.getByPlaceholder(/colleague@school/i).fill('test@school.co.uk')
  109 |     await expect(page.getByRole('button', { name: /Send invite/i })).toBeEnabled()
  110 |   })
  111 | 
  112 |   test('invite modal can be cancelled', async ({ page }) => {
  113 |     await page.getByText('▼').first().click()
  114 |     await page.getByText('Invite a colleague').click()
  115 |     await expect(page.getByText('📨 Invite a colleague')).toBeVisible()
  116 |     await page.getByRole('button', { name: /Cancel/i }).click()
  117 |     await expect(page.getByText('📨 Invite a colleague')).not.toBeVisible({ timeout: 3_000 })
  118 |   })
  119 | 
  120 |   // ── Plan options / upgrade ───────────────────────────────────────────────
  121 | 
  122 |   test('Plan options opens upgrade page', async ({ page }) => {
  123 |     await page.getByText('▼').first().click()
  124 |     await page.getByText('Plan options').click()
  125 |     await expect(page.getByText(/Choose your plan/i).or(page.getByText(/Upgrade/i)).first()).toBeVisible({ timeout: 5_000 })
  126 |   })
  127 | 
  128 |   // ── Privacy & Terms ──────────────────────────────────────────────────────
  129 | 
  130 |   test('Privacy & Terms opens legal page', async ({ page }) => {
  131 |     await page.getByText('▼').first().click()
  132 |     await page.getByText('Privacy & Terms').click()
  133 |     await expect(page.getByText(/Privacy Policy/i).first()).toBeVisible({ timeout: 5_000 })
  134 |   })
  135 | 
  136 |   test('Contact us opens contact page', async ({ page }) => {
  137 |     await page.getByText('▼').first().click()
  138 |     await page.getByText('Contact us').click()
  139 |     await expect(page.getByText(/Contact/i).first()).toBeVisible({ timeout: 5_000 })
  140 |   })
  141 | 
  142 | })
  143 | 
```