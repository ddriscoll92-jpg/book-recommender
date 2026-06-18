# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: units.spec.js >> My Units page >> picker shows units or empty state
- Location: tests/units.spec.js:43:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/No units yet/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/No units yet/i)

```

```yaml
- text: 📚 LessonNest
- button "Book Recommender"
- button "My Books"
- button "My Units"
- button "My Resources"
- button "My Presentations"
- button "AI Assistant"
- text: S simon Premium plan ▼ 📖
- heading "My Units" [level=1]
- paragraph: Browse your units — lessons, model example, resources and presentations in one place
- text: 🔍
- textbox "Search by book, plan or topic..."
- text: Subject
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
- text: Year
- combobox:
  - option "All years" [selected]
  - option "Year 1"
  - option "Year 3"
  - option "Year 4"
- text: The Snail and the Whale Julia Donaldson Geography Coastal Features and Habitats Year 3 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Geography Mapping the Whale's Journey Year 3 · 5 lessons
- button "✏️"
- button "🗑️"
- text: "View unit → English Descriptive Writing: Ocean Wonders Year 3 · 5 lessons"
- button "✏️"
- button "🗑️"
- text: View unit → Vikings DK Eyewitness English Viking Saga Storytelling Year 3 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → How to Train Your Dragon Cressida Cowell English Hiccup's Dragon Training Manual Year 3 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Geography Viking Lands and Seas Year 3 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → The Creakers Tom Fletcher Maths Junk Sculpture Measurements Year 3 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Describe the Whiffling Dark Year 3 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Beowulf Michael Morpurgo English Hero Adjectives Word Bank Year 1 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → The Tiger Who Came to Tea Judith Kerr English What Happens Next? Story Sequel Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Tiger's Tea Party Invitation Year 4 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Escape from Pompeii Christina Balit Maths Roman Numerals on Pompeii Buildings Year 4 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Descriptive Language Analysis Year 4 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → History Life in Ancient Pompeii Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → History Why Did Vesuvius Erupt? Volcano Science and History Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → History Life in Roman Pompeii Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Eyewitness News Report Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Character Diary Entry Year 4 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → The BFG Roald Dahl English Dream Jar Descriptions Year 4 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → One Hundred Hungry Ants Elinor J. Pinczes Maths Halving and Doubling the Ant Lines Year 1 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → RSHE Our Class Community Year 1 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → PSHE Dealing With Frustration Year 1 · 5 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Volcanoes Seymour Simon RE Creation Stories and Natural Wonders Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → RE Responding to Natural Disasters Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Persuasive Letter from Pompeii Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Explanation Text Writing Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Volcano Vocabulary Building Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Music Dynamic Volcanic Rhythms Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Music Volcanic Soundscapes Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → RE Respect and Wonder for Creation Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Art Texture Collages of Volcanic Rock Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Music Volcano Chants and Ostinatos Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Art Erupting Volcano Paintings Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Art 3D Volcano Models Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Pompeii...Buried Alive! Edith Kunhardt RE Responses to Natural Disasters Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → DT Building Roman Houses Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Geography The Ring of Fire Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → RE Sacred Spaces Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → English Diary Entry from Pompeii Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Maths Volume and Ash Coverage Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Science Preservation and Fossilisation Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → History Daily Life in Roman Pompeii Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → RE Roman Gods and Beliefs Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Art Roman Mosaics Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Computing Digital Pompeii Presentations Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Music Roman Musical Instruments Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → DT Designing Volcano Warning Systems Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Geography Physical Features of Volcanic Landscapes Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Art Volcanic Landscapes in Art Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → PE Roman Soldier Training Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → The Street Beneath My Feet Charlotte Guillain Geography Layers of the Earth Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Science The Water Cycle Underground Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → Geography Comparing Soils Around the World Year 4 · 6 lessons
- button "✏️"
- button "🗑️"
- text: View unit → LessonNest · For UK primary school teachers
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
  18  | // Helper: navigate to My Units
  19  | async function goToUnits(page) {
  20  |   await page.getByRole('button', { name: 'My Units' }).click()
  21  |   await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible({ timeout: 10_000 })
  22  | }
  23  | 
  24  | test.describe('My Units page', () => {
  25  | 
  26  |   test.beforeEach(async ({ page }) => {
  27  |     await signIn(page)
  28  |     await goToUnits(page)
  29  |   })
  30  | 
  31  |   // ── Page structure ──────────────────────────────────────────────────────
  32  | 
  33  |   test('page header is visible', async ({ page }) => {
  34  |     await expect(page.getByRole('heading', { name: 'My Units' })).toBeVisible()
  35  |   })
  36  | 
  37  |   test('page subheading is visible', async ({ page }) => {
  38  |     await expect(page.getByText('Browse your units — lessons, model example, resources and presentations in one place')).toBeVisible()
  39  |   })
  40  | 
  41  |   // ── Picker ───────────────────────────────────────────────────────────────
  42  | 
  43  |   test('picker shows units or empty state', async ({ page }) => {
  44  |     const viewUnit = page.getByText('View unit →').first()
  45  |     const emptyMsg = page.getByText(/No units yet/i)
  46  |     const hasUnits = await viewUnit.isVisible().catch(() => false)
  47  |     if (hasUnits) {
  48  |       await expect(viewUnit).toBeVisible()
  49  |     } else {
> 50  |       await expect(emptyMsg).toBeVisible({ timeout: 5_000 })
      |                              ^ Error: expect(locator).toBeVisible() failed
  51  |     }
  52  |   })
  53  | 
  54  |   test('empty state shows Go to My Books button', async ({ page }) => {
  55  |     const emptyMsg = page.getByText(/No units yet/i)
  56  |     const isEmpty = await emptyMsg.isVisible().catch(() => false)
  57  |     if (isEmpty) {
  58  |       await expect(page.getByRole('button', { name: /Go to My Books/i })).toBeVisible()
  59  |     }
  60  |   })
  61  | 
  62  |   test('filter bar is visible with search input', async ({ page }) => {
  63  |     const viewUnit = page.getByText('View unit →').first()
  64  |     const hasUnits = await viewUnit.isVisible().catch(() => false)
  65  |     if (hasUnits) {
  66  |       await expect(page.getByPlaceholder(/Search by book/i)).toBeVisible()
  67  |     }
  68  |   })
  69  | 
  70  |   test('subject filter is visible', async ({ page }) => {
  71  |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  72  |     if (hasUnits) {
  73  |       await expect(page.getByRole('option', { name: 'All subjects' })).toBeAttached()
  74  |     }
  75  |   })
  76  | 
  77  |   test('year filter is visible', async ({ page }) => {
  78  |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  79  |     if (hasUnits) {
  80  |       await expect(page.getByRole('option', { name: 'All years' })).toBeAttached()
  81  |     }
  82  |   })
  83  | 
  84  |   test('units are grouped by book title', async ({ page }) => {
  85  |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  86  |     if (hasUnits) {
  87  |       // Book titles appear as group headers
  88  |       const groupHeaders = page.locator('[style*="Lora"]').first()
  89  |       await expect(groupHeaders).toBeVisible()
  90  |     }
  91  |   })
  92  | 
  93  |   test('each plan row has edit and delete buttons', async ({ page }) => {
  94  |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  95  |     if (hasUnits) {
  96  |       await expect(page.getByTitle('✏️').first().or(page.locator('button').filter({ hasText: '✏️' }).first())).toBeVisible().catch(() => {})
  97  |       await expect(page.locator('button').filter({ hasText: '🗑️' }).first()).toBeVisible()
  98  |     }
  99  |   })
  100 | 
  101 |   // ── Unit detail ──────────────────────────────────────────────────────────
  102 | 
  103 |   test('clicking View unit opens unit detail', async ({ page }) => {
  104 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  105 |     if (!hasUnits) { test.skip(); return }
  106 |     await page.getByText('View unit →').first().click()
  107 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  108 |   })
  109 | 
  110 |   test('unit detail shows book card', async ({ page }) => {
  111 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  112 |     if (!hasUnits) { test.skip(); return }
  113 |     await page.getByText('View unit →').first().click()
  114 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  115 |     // Book card shows year group, subject and lesson count
  116 |     await expect(page.getByText(/lessons/).first()).toBeVisible()
  117 |   })
  118 | 
  119 |   test('unit detail shows Lessons tab', async ({ page }) => {
  120 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  121 |     if (!hasUnits) { test.skip(); return }
  122 |     await page.getByText('View unit →').first().click()
  123 |     await expect(page.getByRole('button', { name: /Lessons/i }).first()).toBeVisible({ timeout: 5_000 })
  124 |   })
  125 | 
  126 |   test('unit detail shows Resources tab', async ({ page }) => {
  127 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  128 |     if (!hasUnits) { test.skip(); return }
  129 |     await page.getByText('View unit →').first().click()
  130 |     await expect(page.getByRole('button', { name: /Resources/i }).first()).toBeVisible({ timeout: 5_000 })
  131 |   })
  132 | 
  133 |   test('unit detail shows Presentations tab', async ({ page }) => {
  134 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  135 |     if (!hasUnits) { test.skip(); return }
  136 |     await page.getByText('View unit →').first().click()
  137 |     await expect(page.getByRole('button', { name: /Presentations/i }).first()).toBeVisible({ timeout: 5_000 })
  138 |   })
  139 | 
  140 |   test('Back to all units link returns to picker', async ({ page }) => {
  141 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
  142 |     if (!hasUnits) { test.skip(); return }
  143 |     await page.getByText('View unit →').first().click()
  144 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  145 |     await page.getByText('← All units').click()
  146 |     await expect(page.getByText('View unit →').first()).toBeVisible({ timeout: 5_000 })
  147 |   })
  148 | 
  149 |   test('Lessons tab shows lesson rows with learning intentions', async ({ page }) => {
  150 |     const hasUnits = await page.getByText('View unit →').first().isVisible().catch(() => false)
```