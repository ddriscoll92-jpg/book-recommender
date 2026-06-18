# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resources.spec.js >> My Resources page >> From a plan tab shows resource type selector
- Location: tests/resources.spec.js:104:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Step 2/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/Step 2/i)

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
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
- text: "Geography Coastal Features and Habitats The Snail and the Whale · Year 3 · 6 lessons Select → Geography Mapping the Whale's Journey The Snail and the Whale · Year 3 · 5 lessons Select → English Descriptive Writing: Ocean Wonders The Snail and the Whale · Year 3 · 5 lessons Select → English Viking Saga Storytelling Vikings · Year 3 · 6 lessons Select → English Hiccup's Dragon Training Manual How to Train Your Dragon · Year 3 · 6 lessons Select → Geography Viking Lands and Seas How to Train Your Dragon · Year 3 · 6 lessons Select → Maths Junk Sculpture Measurements The Creakers · Year 3 · 5 lessons Select → English Describe the Whiffling Dark The Creakers · Year 3 · 5 lessons Select → English Hero Adjectives Word Bank Beowulf · Year 1 · 5 lessons Select → English What Happens Next? Story Sequel The Tiger Who Came to Tea · Year 4 · 6 lessons Select → English Tiger's Tea Party Invitation The Tiger Who Came to Tea · Year 4 · 5 lessons Select → Maths Roman Numerals on Pompeii Buildings Escape from Pompeii · Year 4 · 5 lessons Select → English Descriptive Language Analysis Escape from Pompeii · Year 4 · 5 lessons Select → History Life in Ancient Pompeii Escape from Pompeii · Year 4 · 6 lessons Select → History Why Did Vesuvius Erupt? Volcano Science and History Escape from Pompeii · Year 4 · 6 lessons Select → History Life in Roman Pompeii Escape from Pompeii · Year 4 · 6 lessons Select → English Eyewitness News Report Escape from Pompeii · Year 4 · 6 lessons Select → English Character Diary Entry Escape from Pompeii · Year 4 · 5 lessons Select → English Dream Jar Descriptions The BFG · Year 4 · 5 lessons Select → Maths Halving and Doubling the Ant Lines One Hundred Hungry Ants · Year 1 · 5 lessons Select → RSHE Our Class Community One Hundred Hungry Ants · Year 1 · 5 lessons Select → PSHE Dealing With Frustration One Hundred Hungry Ants · Year 1 · 5 lessons Select → RE Creation Stories and Natural Wonders Volcanoes · Year 4 · 6 lessons Select → RE Responding to Natural Disasters Volcanoes · Year 4 · 6 lessons Select → English Persuasive Letter from Pompeii Volcanoes · Year 4 · 6 lessons Select → English Explanation Text Writing Volcanoes · Year 4 · 6 lessons Select → English Volcano Vocabulary Building Volcanoes · Year 4 · 6 lessons Select → Music Dynamic Volcanic Rhythms Volcanoes · Year 4 · 6 lessons Select → Music Volcanic Soundscapes Volcanoes · Year 4 · 6 lessons Select → RE Respect and Wonder for Creation Volcanoes · Year 4 · 6 lessons Select → Art Texture Collages of Volcanic Rock Volcanoes · Year 4 · 6 lessons Select → Music Volcano Chants and Ostinatos Volcanoes · Year 4 · 6 lessons Select → Art Erupting Volcano Paintings Volcanoes · Year 4 · 6 lessons Select → Art 3D Volcano Models Volcanoes · Year 4 · 6 lessons Select → RE Responses to Natural Disasters Pompeii...Buried Alive! · Year 4 · 6 lessons Select → DT Building Roman Houses Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Geography The Ring of Fire Pompeii...Buried Alive! · Year 4 · 6 lessons Select → RE Sacred Spaces Pompeii...Buried Alive! · Year 4 · 6 lessons Select → English Diary Entry from Pompeii Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Maths Volume and Ash Coverage Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Science Preservation and Fossilisation Pompeii...Buried Alive! · Year 4 · 6 lessons Select → History Daily Life in Roman Pompeii Pompeii...Buried Alive! · Year 4 · 6 lessons Select → RE Roman Gods and Beliefs Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Art Roman Mosaics Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Computing Digital Pompeii Presentations Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Music Roman Musical Instruments Pompeii...Buried Alive! · Year 4 · 6 lessons Select → DT Designing Volcano Warning Systems Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Geography Physical Features of Volcanic Landscapes Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Art Volcanic Landscapes in Art Pompeii...Buried Alive! · Year 4 · 6 lessons Select → PE Roman Soldier Training Pompeii...Buried Alive! · Year 4 · 6 lessons Select → Geography Layers of the Earth The Street Beneath My Feet · Year 4 · 6 lessons Select → Science The Water Cycle Underground The Street Beneath My Feet · Year 4 · 6 lessons Select → Geography Comparing Soils Around the World The Street Beneath My Feet · Year 4 · 6 lessons Select → LessonNest · For UK primary school teachers"
```

# Test source

```ts
  9   |   await page.waitForSelector('#auth-card', { timeout: 15_000 })
  10  |   const signInTab = page.getByRole('button', { name: 'Sign in' }).first()
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
  104 |   test('From a plan tab shows resource type selector', async ({ page }) => {
  105 |     await page.getByRole('button', { name: /From a plan/i }).click()
  106 |     // Need to select a plan first before resource types appear at Step 3
  107 |     // Just verify Step 1 and 2 labels are present
  108 |     await expect(page.getByText(/Step 1/i)).toBeVisible()
> 109 |     await expect(page.getByText(/Step 2/i)).toBeVisible()
      |                                             ^ Error: expect(locator).toBeVisible() failed
  110 |   })
  111 | 
  112 |   // ── My catalogue tab ─────────────────────────────────────────────────────
  113 | 
  114 |   test('My catalogue tab shows search input', async ({ page }) => {
  115 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  116 |     await expect(page.getByPlaceholder('Search by title, topic or subject...')).toBeVisible()
  117 |   })
  118 | 
  119 |   test('My catalogue tab shows type filter', async ({ page }) => {
  120 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  121 |     await expect(page.getByRole('option', { name: 'All types' })).toBeAttached()
  122 |   })
  123 | 
  124 |   test('My catalogue tab shows subject filter', async ({ page }) => {
  125 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  126 |     await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  127 |   })
  128 | 
  129 |   test('My catalogue tab shows year filter', async ({ page }) => {
  130 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  131 |     await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  132 |   })
  133 | 
  134 |   test('My catalogue tab shows favourites filter', async ({ page }) => {
  135 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  136 |     await expect(page.getByText('⭐ Favourites')).toBeVisible()
  137 |   })
  138 | 
  139 |   test('My catalogue tab shows refresh button', async ({ page }) => {
  140 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  141 |     await expect(page.getByTitle('Refresh')).toBeVisible()
  142 |   })
  143 | 
  144 |   test('empty catalogue shows correct message', async ({ page }) => {
  145 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  146 |     const emptyMsg = page.getByText(/Generate a resource using Quick resource/i)
  147 |     const hasItems = await page.locator('[resource_type]').count() > 0
  148 |     if (!hasItems) {
  149 |       await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
  150 |     }
  151 |   })
  152 | 
  153 | })
  154 | 
```