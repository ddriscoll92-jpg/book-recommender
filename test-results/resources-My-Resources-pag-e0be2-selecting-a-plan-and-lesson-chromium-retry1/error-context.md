# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resources.spec.js >> My Resources page >> From a plan tab shows resource type tiles after selecting a plan and lesson
- Location: tests/resources.spec.js:104:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Step 3 — Choose resource type/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Step 3 — Choose resource type/i)

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My PresentationsBeta"
- button "AI Assistant"
- text: S simon Premium plan ▼ 🛠️
- heading "My Resources" [level=1]
- paragraph: Generate and browse all your classroom resources
- button "⚡ Quick resource"
- button "📋 From a plan"
- button "📂 My catalogue"
- paragraph: Select a plan, choose a lesson, then pick what type of resource to generate. The AI will use the full lesson context to create something tailored.
- text: Step 1 — Select a plan 🔍
- textbox "Search plans or books..."
- combobox:
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
- combobox:
  - option "All years" [selected]
  - option "Year 1"
  - option "Year 3"
  - option "Year 4"
- text: English Story Mapping and Retelling Escape from Pompeii · Year 3 · 6 lessons
- button "Change"
- text: "Step 2 — Select a lesson 1 Exploring the Story World of Pompeii explore Learning intention: We are learning to identify the main characters, setting and key events in 'Escape from Pompeii'. 2 Sequencing the Story analyse Learning intention: We are learning to sequence the key events of the story and understand how the narrative is structured. 3 Creating an Illustrated Story Map teach Learning intention: We are learning to create an illustrated story map that shows the key events of the story in sequence. 4 Oral Retelling Using Story Maps practise Learning intention: We are learning to retell the story orally in sequence using our story maps as a guide. 5 Writing a Story Retelling practise Learning intention: We are learning to write a retelling of the story in sequence using descriptive language and time connectives. 6 Sharing and Celebrating Our Retellings apply Learning intention: We are learning to edit our writing for clarity and share our story retelling with an audience. LessonNest · For UK primary school teachers"
```

# Test source

```ts
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
  110 |     // Click the first lesson row — identified by the Learning intention label inside it
  111 |     await page.locator('div').filter({ hasText: /Learning intention:/i }).first().click()
> 112 |     await expect(page.getByText(/Step 3 — Choose resource type/i)).toBeVisible({ timeout: 5_000 })
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
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