# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assistant.spec.js >> AI Assistant page >> page subheading is visible
- Location: tests/assistant.spec.js:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AI Teaching Assistant')
Expected: visible
Error: strict mode violation: getByText('AI Teaching Assistant') resolved to 2 elements:
    1) <h1>AI Teaching Assistant</h1> aka getByRole('heading', { name: 'AI Teaching Assistant' })
    2) <div>Hello! I'm your AI teaching assistant. I can help…</div> aka getByText('Hello! I\'m your AI teaching')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('AI Teaching Assistant')

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
      - button "AI Assistant" [active] [ref=e15] [cursor=pointer]
    - generic [ref=e17] [cursor=pointer]:
      - generic [ref=e18]: S
      - generic [ref=e19]:
        - generic [ref=e20]: simon
        - generic [ref=e21]: gmail.com
      - generic [ref=e22]: ▼
  - generic [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e25]: 🤖
      - generic [ref=e26]:
        - heading "AI Teaching Assistant" [level=1] [ref=e27]
        - paragraph [ref=e28]: Ask anything about teaching, planning, differentiation and more
    - generic [ref=e29]: Please do not enter pupil names or personal data in this chat.
    - generic [ref=e30]:
      - generic [ref=e32]:
        - generic [ref=e33]: 🤖
        - generic [ref=e34]: Hello! I'm your AI teaching assistant. I can help with lesson planning, differentiation strategies, SEND support, assessment ideas, behaviour management, curriculum advice, and much more. What would you like help with today?
      - generic [ref=e35]:
        - textbox "Ask a teaching question... (Enter to send, Shift+Enter for new line)" [ref=e36]
        - button "Send" [disabled] [ref=e37]
    - generic [ref=e38]:
      - generic [ref=e39]: Suggested questions
      - generic [ref=e40]:
        - button "💬 How can I differentiate a lesson on fractions for mixed ability Year 4?" [ref=e41] [cursor=pointer]
        - button "💬 Give me 5 strategies for supporting a pupil with dyslexia in English lessons" [ref=e42] [cursor=pointer]
        - button "💬 What are effective ways to teach the 5 times table to Year 2?" [ref=e43] [cursor=pointer]
        - button "💬 How do I write a positive report comment for a below-expected pupil?" [ref=e44] [cursor=pointer]
        - button "💬 What does Ofsted look for in an outstanding primary lesson?" [ref=e45] [cursor=pointer]
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
  15  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  16  | }
  17  | 
  18  | // Helper: navigate to AI Assistant
  19  | async function goToAssistant(page) {
  20  |   await page.getByRole('button', { name: 'AI Assistant' }).click()
> 21  |   await expect(page.getByText('AI Teaching Assistant')).toBeVisible({ timeout: 10_000 })
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  22  | }
  23  | 
  24  | test.describe('AI Assistant page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToAssistant(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByText('AI Teaching Assistant')).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
  38  |     await expect(page.getByText('Ask anything about teaching, planning, differentiation and more')).toBeVisible()
  39  |   })
  40  | 
  41  |   test('privacy notice is visible', async ({ page }) => {
  42  |     await expect(page.getByText(/do not enter pupil names/i)).toBeVisible()
  43  |   })
  44  | 
  45  |   test('welcome message is shown', async ({ page }) => {
  46  |     await expect(page.getByText(/Hello! I'm your AI teaching assistant/i)).toBeVisible()
  47  |   })
  48  | 
  49  |   // ── Suggested prompts ───────────────────────────────────────────────────
  50  | 
  51  |   test('all 5 suggested prompts are visible', async ({ page }) => {
  52  |     await expect(page.getByText(/differentiate a lesson on fractions/i)).toBeVisible()
  53  |     await expect(page.getByText(/strategies for supporting a pupil with dyslexia/i)).toBeVisible()
  54  |     await expect(page.getByText(/teach the 5 times table/i)).toBeVisible()
  55  |     await expect(page.getByText(/positive report comment/i)).toBeVisible()
  56  |     await expect(page.getByText(/Ofsted look for/i)).toBeVisible()
  57  |   })
  58  | 
  59  |   test('clicking a suggested prompt fills the input', async ({ page }) => {
  60  |     await page.getByText(/differentiate a lesson on fractions/i).click()
  61  |     const textarea = page.locator('textarea')
  62  |     await expect(textarea).not.toBeEmpty()
  63  |   })
  64  | 
  65  |   // ── Input and send button ───────────────────────────────────────────────
  66  | 
  67  |   test('textarea is present', async ({ page }) => {
  68  |     await expect(page.locator('textarea')).toBeVisible()
  69  |   })
  70  | 
  71  |   test('send button is disabled when input is empty', async ({ page }) => {
  72  |     const sendBtn = page.getByRole('button', { name: /send/i })
  73  |     await expect(sendBtn).toBeDisabled()
  74  |   })
  75  | 
  76  |   test('send button enables when text is typed', async ({ page }) => {
  77  |     await page.locator('textarea').fill('How do I plan a lesson?')
  78  |     const sendBtn = page.getByRole('button', { name: /send/i })
  79  |     await expect(sendBtn).toBeEnabled()
  80  |   })
  81  | 
  82  |   test('typing and clearing input disables send button again', async ({ page }) => {
  83  |     await page.locator('textarea').fill('How do I plan a lesson?')
  84  |     await page.locator('textarea').fill('')
  85  |     const sendBtn = page.getByRole('button', { name: /send/i })
  86  |     await expect(sendBtn).toBeDisabled()
  87  |   })
  88  | 
  89  |   test('user message appears in chat after sending', async ({ page }) => {
  90  |     const message = 'What is phonics?'
  91  |     await page.locator('textarea').fill(message)
  92  |     await page.getByRole('button', { name: /send/i }).click()
  93  |     // User message should appear immediately
  94  |     await expect(page.getByText(message)).toBeVisible()
  95  |     // Input should be cleared
  96  |     await expect(page.locator('textarea')).toBeEmpty()
  97  |   })
  98  | 
  99  |   test('"Thinking..." indicator appears while waiting for response', async ({ page }) => {
  100 |     await page.locator('textarea').fill('What is phonics?')
  101 |     await page.getByRole('button', { name: /send/i }).click()
  102 |     // Thinking indicator should appear briefly
  103 |     await expect(page.getByText('Thinking...')).toBeVisible({ timeout: 5_000 })
  104 |   })
  105 | 
  106 | })
  107 | 
```