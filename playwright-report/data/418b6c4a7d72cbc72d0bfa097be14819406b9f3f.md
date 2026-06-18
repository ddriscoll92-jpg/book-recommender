# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: presentations.spec.js >> My Presentations page >> From a plan tab shows subject and year filters
- Location: tests/presentations.spec.js:104:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText('All subjects').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('All subjects').first()
    14 × locator resolved to <option value="All">All subjects</option>
       - unexpected value "hidden"

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
- button "AI Assistant"
- text: S simon Premium plan ▼ 🎬
- heading "My Presentations" [level=1]
- paragraph: Generate and browse teaching slideshows for your lessons
- button "⚡ Quick presentation"
- button "📋 From a plan"
- button "🎬 My catalogue"
- paragraph: Select a plan, then choose one or more lessons. Each lesson generates its own slideshow — downloaded separately and saved to My presentations.
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
  18  | // Helper: navigate to My Presentations
  19  | async function goToPresentations(page) {
  20  |   await page.getByRole('button', { name: 'My Presentations' }).click()
  21  |   await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible({ timeout: 10_000 })
  22  | }
  23  | 
  24  | test.describe('My Presentations page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToPresentations(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByRole('heading', { name: 'My Presentations' })).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
  38  |     await expect(page.getByText('Generate and browse teaching slideshows for your lessons')).toBeVisible()
  39  |   })
  40  | 
  41  |   // ── Tabs ────────────────────────────────────────────────────────────────
  42  | 
  43  |   test('all three tabs are visible', async ({ page }) => {
  44  |     await expect(page.getByRole('button', { name: /Quick presentation/i })).toBeVisible()
  45  |     await expect(page.getByRole('button', { name: /From a plan/i })).toBeVisible()
  46  |     await expect(page.getByRole('button', { name: /My catalogue/i })).toBeVisible()
  47  |   })
  48  | 
  49  |   test('Quick presentation tab is active by default', async ({ page }) => {
  50  |     await expect(page.getByText('Describe the lesson or topic')).toBeVisible()
  51  |   })
  52  | 
  53  |   test('From a plan tab switches content', async ({ page }) => {
  54  |     await page.getByRole('button', { name: /From a plan/i }).click()
  55  |     await expect(page.getByText('Step 1 — Select a plan')).toBeVisible()
  56  |   })
  57  | 
  58  |   test('My catalogue tab switches content', async ({ page }) => {
  59  |     await page.getByRole('button', { name: /My catalogue/i }).click()
  60  |     await expect(page.getByPlaceholder('Search by title...')).toBeVisible()
  61  |   })
  62  | 
  63  |   // ── Quick presentation tab ───────────────────────────────────────────────
  64  | 
  65  |   test('textarea is present on Quick presentation tab', async ({ page }) => {
  66  |     await expect(page.locator('textarea')).toBeVisible()
  67  |   })
  68  | 
  69  |   test('all 5 example prompts are visible', async ({ page }) => {
  70  |     await expect(page.getByText(/introducing fractions for Year 4/i)).toBeVisible()
  71  |     await expect(page.getByText(/water cycle for Year 5/i)).toBeVisible()
  72  |     await expect(page.getByText(/Great Fire of London/i)).toBeVisible()
  73  |     await expect(page.getByText(/persuasive writing techniques/i)).toBeVisible()
  74  |     await expect(page.getByText(/healthy eating and food groups/i)).toBeVisible()
  75  |   })
  76  | 
  77  |   test('clicking an example prompt fills the textarea', async ({ page }) => {
  78  |     await page.getByText(/introducing fractions for Year 4/i).click()
  79  |     await expect(page.locator('textarea')).not.toBeEmpty()
  80  |   })
  81  | 
  82  |   test('generate button is disabled when textarea is empty', async ({ page }) => {
  83  |     await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeDisabled()
  84  |   })
  85  | 
  86  |   test('generate button enables when text is typed', async ({ page }) => {
  87  |     await page.locator('textarea').fill('Create a slideshow about volcanoes for Year 3')
  88  |     await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeEnabled()
  89  |   })
  90  | 
  91  |   test('clearing textarea disables generate button again', async ({ page }) => {
  92  |     await page.locator('textarea').fill('Create a slideshow about volcanoes')
  93  |     await page.locator('textarea').fill('')
  94  |     await expect(page.getByRole('button', { name: /Generate slideshow/i })).toBeDisabled()
  95  |   })
  96  | 
  97  |   // ── From a plan tab ──────────────────────────────────────────────────────
  98  | 
  99  |   test('From a plan tab shows plan search', async ({ page }) => {
  100 |     await page.getByRole('button', { name: /From a plan/i }).click()
  101 |     await expect(page.getByPlaceholder('Search plans or books...')).toBeVisible()
  102 |   })
  103 | 
  104 |   test('From a plan tab shows subject and year filters', async ({ page }) => {
  105 |     await page.getByRole('button', { name: /From a plan/i }).click()
> 106 |     await expect(page.getByText('All subjects').first()).toBeVisible()
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  107 |     await expect(page.getByText('All years').first()).toBeVisible()
  108 |   })
  109 | 
  110 |   // ── My catalogue tab ─────────────────────────────────────────────────────
  111 | 
  112 |   test('My catalogue tab shows search input', async ({ page }) => {
  113 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  114 |     await expect(page.getByPlaceholder('Search by title...')).toBeVisible()
  115 |   })
  116 | 
  117 |   test('My catalogue tab shows favourites filter', async ({ page }) => {
  118 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  119 |     await expect(page.getByText('⭐ Favourites')).toBeVisible()
  120 |   })
  121 | 
  122 |   test('My catalogue tab shows subject filter', async ({ page }) => {
  123 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  124 |     await expect(page.getByText('Subject').first()).toBeVisible()
  125 |   })
  126 | 
  127 |   test('My catalogue tab shows year filter', async ({ page }) => {
  128 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  129 |     await expect(page.getByText('Year').first()).toBeVisible()
  130 |   })
  131 | 
  132 |   test('empty catalogue shows correct message', async ({ page }) => {
  133 |     await page.getByRole('button', { name: /My catalogue/i }).click()
  134 |     // If no presentations yet, shows empty state message
  135 |     const emptyMsg = page.getByText(/No presentations yet|No presentations match/i)
  136 |     const presItem = page.locator('[style*="border-radius: 10px"]').first()
  137 |     const hasContent = await presItem.isVisible().catch(() => false)
  138 |     if (!hasContent) {
  139 |       await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
  140 |     }
  141 |   })
  142 | 
  143 | })
  144 | 
```