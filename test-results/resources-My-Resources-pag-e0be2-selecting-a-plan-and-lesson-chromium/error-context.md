# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resources.spec.js >> My Resources page >> From a plan tab shows resource type tiles after selecting a plan and lesson
- Location: tests/resources.spec.js:104:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('Exploring Coastal Settings').or(locator('text=/^1s/')).first()

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
      - button "My PresentationsBeta" [ref=e14] [cursor=pointer]
      - button "AI Assistant" [ref=e15] [cursor=pointer]
    - generic [ref=e17] [cursor=pointer]:
      - generic [ref=e18]: S
      - generic [ref=e19]:
        - generic [ref=e20]: simon
        - generic [ref=e21]: Premium plan
      - generic [ref=e22]: ▼
  - generic [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]: 🛠️
      - generic [ref=e27]:
        - heading "My Resources" [level=1] [ref=e28]
        - paragraph [ref=e29]: Generate and browse all your classroom resources
    - generic [ref=e30]:
      - generic [ref=e31]:
        - button "⚡ Quick resource" [ref=e32] [cursor=pointer]
        - button "📋 From a plan" [ref=e33] [cursor=pointer]
        - button "📂 My catalogue" [ref=e34] [cursor=pointer]
      - generic [ref=e36]:
        - paragraph [ref=e37]: Select a plan, choose a lesson, then pick what type of resource to generate. The AI will use the full lesson context to create something tailored.
        - generic [ref=e38]:
          - generic [ref=e39]: Step 1 — Select a plan
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]: 🔍
              - textbox "Search plans or books..." [ref=e43]
            - combobox [ref=e44] [cursor=pointer]:
              - option "All subjects" [selected]
              - option "Art"
              - option "Computing"
              - option "DT"
              - option "English"
              - option "Geography"
              - option "History"
              - option "Maths"
              - option "Music"
              - option "PE"
              - option "PSHE"
              - option "RE"
              - option "RSHE"
              - option "Science"
            - combobox [ref=e45] [cursor=pointer]:
              - option "All years" [selected]
              - option "Year 1"
              - option "Year 3"
              - option "Year 4"
          - generic [ref=e46]:
            - generic [ref=e47]: English
            - generic [ref=e48]:
              - generic [ref=e49]: Story Mapping and Retelling
              - generic [ref=e50]: Escape from Pompeii · Year 3 · 6 lessons
            - button "Change" [ref=e51] [cursor=pointer]
        - generic [ref=e52]:
          - generic [ref=e53]: Step 2 — Select a lesson
          - generic [ref=e54]:
            - generic [ref=e55] [cursor=pointer]:
              - generic [ref=e56]: "1"
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - generic [ref=e59]: Exploring the Story World of Pompeii
                  - generic [ref=e60]: explore
                - generic [ref=e61]: "Learning intention: We are learning to identify the main characters, setting and key events in 'Escape from Pompeii'."
            - generic [ref=e62] [cursor=pointer]:
              - generic [ref=e63]: "2"
              - generic [ref=e64]:
                - generic [ref=e65]:
                  - generic [ref=e66]: Sequencing the Story
                  - generic [ref=e67]: analyse
                - generic [ref=e68]: "Learning intention: We are learning to sequence the key events of the story and understand how the narrative is structured."
            - generic [ref=e69] [cursor=pointer]:
              - generic [ref=e70]: "3"
              - generic [ref=e71]:
                - generic [ref=e72]:
                  - generic [ref=e73]: Creating an Illustrated Story Map
                  - generic [ref=e74]: teach
                - generic [ref=e75]: "Learning intention: We are learning to create an illustrated story map that shows the key events of the story in sequence."
            - generic [ref=e76] [cursor=pointer]:
              - generic [ref=e77]: "4"
              - generic [ref=e78]:
                - generic [ref=e79]:
                  - generic [ref=e80]: Oral Retelling Using Story Maps
                  - generic [ref=e81]: practise
                - generic [ref=e82]: "Learning intention: We are learning to retell the story orally in sequence using our story maps as a guide."
            - generic [ref=e83] [cursor=pointer]:
              - generic [ref=e84]: "5"
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - generic [ref=e87]: Writing a Story Retelling
                  - generic [ref=e88]: practise
                - generic [ref=e89]: "Learning intention: We are learning to write a retelling of the story in sequence using descriptive language and time connectives."
            - generic [ref=e90] [cursor=pointer]:
              - generic [ref=e91]: "6"
              - generic [ref=e92]:
                - generic [ref=e93]:
                  - generic [ref=e94]: Sharing and Celebrating Our Retellings
                  - generic [ref=e95]: apply
                - generic [ref=e96]: "Learning intention: We are learning to edit our writing for clarity and share our story retelling with an audience."
    - generic [ref=e97]: LessonNest · For UK primary school teachers
```

# Test source

```ts
  11  |   if (await signInTab.isVisible()) await signInTab.click()
  12  |   await page.fill('input[type="email"]', EMAIL)
  13  |   await page.fill('input[type="password"]', PASSWORD)
  14  |   await page.getByRole('button', { name: /^sign in$/i }).last().click()
  15  |   await expect(page.getByRole('button', { name: 'Book Recommender' })).toBeVisible({ timeout: 15_000 })
  16  | }
  17  | 
  18  | // Helper: navigate to My Resources
  19  | async function goToResources(page) {
  20  |   await page.getByRole('button', { name: 'My Resources' }).click()
  21  |   await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible({ timeout: 10_000 })
  22  | }
  23  | 
  24  | test.describe('My Resources page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToResources(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByRole('heading', { name: 'My Resources' })).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
  38  |     await expect(page.getByText('Generate and browse all your classroom resources')).toBeVisible()
  39  |   })
  40  | 
  41  |   // ── Tabs ────────────────────────────────────────────────────────────────
  42  | 
  43  |   test('all three tabs are visible', async ({ page }) => {
  44  |     await expect(page.getByRole('button', { name: /Quick resource/i })).toBeVisible()
  45  |     await expect(page.getByRole('button', { name: /From a plan/i })).toBeVisible()
  46  |     await expect(page.getByRole('button', { name: /My catalogue/i })).toBeVisible()
  47  |   })
  48  | 
  49  |   test('Quick resource tab is active by default', async ({ page }) => {
  50  |     await expect(page.locator('textarea')).toBeVisible()
  51  |   })
  52  | 
  53  |   test('From a plan tab switches content', async ({ page }) => {
  54  |     await page.getByRole('button', { name: /From a plan/i }).click()
  55  |     await expect(page.getByText('Step 1')).toBeVisible()
  56  |   })
  57  | 
  58  |   test('My catalogue tab switches content', async ({ page }) => {
  59  |     await page.getByRole('button', { name: /My catalogue/i }).click()
  60  |     await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  61  |   })
  62  | 
  63  |   // ── Quick resource tab ───────────────────────────────────────────────────
  64  | 
  65  |   test('textarea is present', async ({ page }) => {
  66  |     await expect(page.locator('textarea')).toBeVisible()
  67  |   })
  68  | 
  69  |   test('all 5 example prompts are visible', async ({ page }) => {
  70  |     await expect(page.getByText(/maths worksheet for Year 4 on multiplication/i)).toBeVisible()
  71  |     await expect(page.getByText(/Year 2 phonics activity/i)).toBeVisible()
  72  |     await expect(page.getByText(/science knowledge organiser for Year 5/i)).toBeVisible()
  73  |     await expect(page.getByText(/Year 6 reading comprehension/i)).toBeVisible()
  74  |     await expect(page.getByText(/PSHE discussion activity for Year 3/i)).toBeVisible()
  75  |   })
  76  | 
  77  |   test('clicking an example prompt fills the textarea', async ({ page }) => {
  78  |     await page.getByText(/maths worksheet for Year 4 on multiplication/i).click()
  79  |     await expect(page.locator('textarea')).not.toBeEmpty()
  80  |   })
  81  | 
  82  |   test('generate button is disabled when textarea is empty', async ({ page }) => {
  83  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  84  |   })
  85  | 
  86  |   test('generate button enables when text is typed', async ({ page }) => {
  87  |     await page.locator('textarea').fill('Create a worksheet about the Romans for Year 4')
  88  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeEnabled()
  89  |   })
  90  | 
  91  |   test('clearing textarea disables generate button again', async ({ page }) => {
  92  |     await page.locator('textarea').fill('Create a worksheet about the Romans')
  93  |     await page.locator('textarea').fill('')
  94  |     await expect(page.getByRole('button', { name: /Generate resource/i })).toBeDisabled()
  95  |   })
  96  | 
  97  |   // ── From a plan tab ──────────────────────────────────────────────────────
  98  | 
  99  |   test('From a plan tab shows plan search', async ({ page }) => {
  100 |     await page.getByRole('button', { name: /From a plan/i }).click()
  101 |     await expect(page.getByPlaceholder(/Search plans/i)).toBeVisible()
  102 |   })
  103 | 
  104 |   test('From a plan tab shows resource type tiles after selecting a plan and lesson', async ({ page }) => {
  105 |     await page.getByRole('button', { name: /From a plan/i }).click()
  106 |     await expect(page.getByText(/Step 1 — Select a plan/i)).toBeVisible()
  107 |     // Click the first plan's Select button
  108 |     await page.getByText('Select →').first().click()
  109 |     await expect(page.getByText(/Step 2 — Select a lesson/i)).toBeVisible({ timeout: 5_000 })
  110 |     // Click the first lesson row to reveal Step 3
> 111 |     await page.getByText('Exploring Coastal Settings').or(page.locator('text=/^1\s/')).first().click()
      |                                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  112 |     await expect(page.getByText(/Step 3 — Choose resource type/i)).toBeVisible({ timeout: 5_000 })
  113 |   })
  114 | 
  115 |   test('From a plan tab shows Step 1 plan picker', async ({ page }) => {
  116 |     await page.getByRole('button', { name: /From a plan/i }).click()
  117 |     await expect(page.getByText(/Step 1 — Select a plan/i)).toBeVisible()
  118 |   })
  119 | 
  120 |   // ── My catalogue tab ─────────────────────────────────────────────────────
  121 | 
  122 |   test('My catalogue tab shows search input', async ({ page }) => {
  123 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  124 |     await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  125 |   })
  126 | 
  127 |   test('My catalogue tab shows type filter', async ({ page }) => {
  128 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  129 |     await expect(page.getByRole('option', { name: 'All types' })).toBeAttached()
  130 |   })
  131 | 
  132 |   test('My catalogue tab shows subject filter', async ({ page }) => {
  133 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  134 |     await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  135 |   })
  136 | 
  137 |   test('My catalogue tab shows year filter', async ({ page }) => {
  138 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  139 |     await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  140 |   })
  141 | 
  142 |   test('My catalogue tab shows favourites filter', async ({ page }) => {
  143 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  144 |     await expect(page.getByText('⭐ Favourites')).toBeVisible()
  145 |   })
  146 | 
  147 |   test('My catalogue tab shows refresh button', async ({ page }) => {
  148 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  149 |     await expect(page.getByTitle('Refresh')).toBeVisible()
  150 |   })
  151 | 
  152 |   test('empty catalogue shows correct message', async ({ page }) => {
  153 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  154 |     const emptyMsg = page.getByText(/Generate a resource using Quick resource/i)
  155 |     const hasItems = await page.locator('[resource_type]').count() > 0
  156 |     if (!hasItems) {
  157 |       await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
  158 |     }
  159 |   })
  160 | 
  161 | })
  162 | 
```