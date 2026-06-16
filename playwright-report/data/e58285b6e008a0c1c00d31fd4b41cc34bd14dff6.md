# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.js >> Home screen (pre-login) >> benefits section shows all 4 features
- Location: tests/home.spec.js:112:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Classroom resources')
Expected: visible
Error: strict mode violation: getByText('Classroom resources') resolved to 2 elements:
    1) <p>Find books, generate full units of work and creat…</p> aka getByText('Find books, generate full')
    2) <span>Classroom resources </span> aka getByText('Classroom resources', { exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Classroom resources')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: 📚
      - generic [ref=e7]: TeachReads
    - generic [ref=e8]:
      - generic [ref=e9] [cursor=pointer]: How it works
      - button "Sign in" [ref=e10] [cursor=pointer]
      - button "Get started free" [ref=e11] [cursor=pointer]
  - generic [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]: For UK primary school teachers
      - generic [ref=e15]:
        - generic [ref=e16]: 🎁
        - generic [ref=e17]: 5-day free trial — no credit card required
      - heading "Lesson planning, powered by AI" [level=1] [ref=e18]:
        - text: Lesson planning,
        - text: powered by AI
      - paragraph [ref=e19]: Find books, generate full units of work and create classroom resources — all in one place. Save hours of planning every week.
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]: 📚
          - generic [ref=e23]:
            - generic [ref=e24]: Smart book recommendations
            - text: matched to your topic and year group
        - generic [ref=e25]:
          - generic [ref=e26]: 📋
          - generic [ref=e27]:
            - generic [ref=e28]: Full units of work
            - text: with NC links, SEND adaptations and model examples
        - generic [ref=e29]:
          - generic [ref=e30]: 🛠️
          - generic [ref=e31]:
            - generic [ref=e32]: Classroom resources
            - text: worksheets, starters, exit tickets and more
        - generic [ref=e33]:
          - generic [ref=e34]: 🏫
          - generic [ref=e35]:
            - generic [ref=e36]: Your school library
            - text: manage books, track plans and reuse resources
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic [ref=e39]: S
          - generic [ref=e40]: J
          - generic [ref=e41]: R
          - generic [ref=e42]: M
        - generic [ref=e43]: Trusted by UK primary teachers
    - generic [ref=e45]:
      - heading "Get started free" [level=2] [ref=e46]
      - paragraph [ref=e47]: 5-day free trial · No credit card required
      - generic [ref=e48]:
        - button "Create account" [ref=e49] [cursor=pointer]
        - button "Sign in" [ref=e50] [cursor=pointer]
      - generic [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]: Your name
          - textbox "e.g. Sarah Jones" [ref=e54]
        - generic [ref=e55]:
          - generic [ref=e56]: Email address
          - textbox "your@school.co.uk" [ref=e57]
        - generic [ref=e58]:
          - generic [ref=e59]: Password
          - textbox "At least 6 characters" [ref=e60]
        - generic [ref=e61]:
          - generic [ref=e62]: "Your trial includes:"
          - generic [ref=e63]: ✓ 10 book searches
          - generic [ref=e64]: ✓ 10 units of work
          - generic [ref=e65]: ✓ 15 resources
          - generic [ref=e66]: ✓ 20 load mores
        - button "Start free 5-day trial" [ref=e67] [cursor=pointer]
        - generic [ref=e70]: or
        - button "Continue with Google (coming soon)" [disabled] [ref=e72]:
          - img [ref=e73]
          - generic [ref=e78]: Continue with Google (coming soon)
      - paragraph [ref=e79]: By signing up you agree to our Terms of Service and Privacy Policy
  - generic [ref=e81]:
    - heading "How it works" [level=2] [ref=e82]
    - paragraph [ref=e83]: Three steps from finding a book to having a full unit of work ready to teach
    - generic [ref=e84]:
      - generic [ref=e85]:
        - generic [ref=e86]: "1"
        - generic [ref=e87]: Find the perfect book
        - generic [ref=e88]: Search by subject, topic and year group. AI recommends books matched to your curriculum.
        - generic [ref=e89]: →
      - generic [ref=e90]:
        - generic [ref=e91]: "2"
        - generic [ref=e92]: Generate a unit of work
        - generic [ref=e93]: One click creates a full lesson sequence with NC links, SEND adaptations and model examples.
        - generic [ref=e94]: →
      - generic [ref=e95]:
        - generic [ref=e96]: "3"
        - generic [ref=e97]: Create resources
        - generic [ref=e98]: Generate differentiated worksheets, starters, exit tickets and more. Download as PDF or Word.
    - generic [ref=e99]:
      - button "Start your free 5-day trial →" [ref=e100] [cursor=pointer]
      - generic [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e103]: ✓
          - generic [ref=e104]: 5-day free trial
        - generic [ref=e105]:
          - generic [ref=e106]: ✓
          - generic [ref=e107]: No credit card needed
        - generic [ref=e108]:
          - generic [ref=e109]: ✓
          - generic [ref=e110]: Cancel anytime
  - generic [ref=e111]:
    - generic [ref=e112]:
      - generic [ref=e113]: 📚
      - generic [ref=e114]: TeachReads
    - generic [ref=e115]: For UK primary school teachers
    - generic [ref=e116]:
      - generic [ref=e117] [cursor=pointer]: Privacy
      - generic [ref=e118] [cursor=pointer]: Terms
      - generic [ref=e119] [cursor=pointer]: Contact
```

# Test source

```ts
  15  |   // ── Nav ──────────────────────────────────────────────────────────────────
  16  | 
  17  |   test('nav shows TeachReads brand', async ({ page }) => {
  18  |     await expect(page.getByText('TeachReads').first()).toBeVisible()
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
  113 |     await expect(page.getByText('Smart book recommendations')).toBeVisible()
  114 |     await expect(page.getByText('Full units of work', { exact: true })).toBeVisible()
> 115 |     await expect(page.getByText('Classroom resources')).toBeVisible()
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  116 |     await expect(page.getByText('Your school library')).toBeVisible()
  117 |   })
  118 | 
  119 |   test('how it works shows 3 steps', async ({ page }) => {
  120 |     await expect(page.getByText('Find the perfect book')).toBeVisible()
  121 |     await expect(page.getByText('Generate a unit of work')).toBeVisible()
  122 |     await expect(page.getByText('Create resources')).toBeVisible()
  123 |   })
  124 | 
  125 |   // ── Navigation shortcuts ──────────────────────────────────────────────────
  126 | 
  127 |   test('Get started free button scrolls to auth card', async ({ page }) => {
  128 |     // Scroll away first
  129 |     await page.evaluate(() => window.scrollTo(0, 500))
  130 |     await page.getByRole('button', { name: 'Get started free' }).click()
  131 |     await expect(page.locator('#auth-card')).toBeInViewport({ timeout: 5_000 })
  132 |   })
  133 | 
  134 |   test('Sign in nav button scrolls to auth card and switches to login', async ({ page }) => {
  135 |     await page.evaluate(() => window.scrollTo(0, 500))
  136 |     await page.getByRole('button', { name: 'Sign in' }).first().click()
  137 |     await expect(page.locator('#auth-card')).toBeInViewport({ timeout: 5_000 })
  138 |     // Should be in login mode — name field not visible
  139 |     await expect(page.locator('input[placeholder*="Sarah"]')).not.toBeVisible()
  140 |   })
  141 | 
  142 | })
  143 | 
```