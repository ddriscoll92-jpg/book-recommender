# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: units.spec.js >> My Units page >> Presentations tab shows Create presentation button
- Location: tests/units.spec.js:174:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Create presentation/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /Create presentation/i })

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
- paragraph: Describe the lesson or topic you'd like a slideshow for. The AI will build a complete slide deck with a title slide, objective, teaching points, activity and plenary.
- textbox "e.g. \"Create a slideshow introducing fractions for Year 4\""
- text: EXAMPLE PROMPTS ⚡ Create a slideshow introducing fractions for Year 4 ⚡ Make a slideshow on the water cycle for Year 5 Science ⚡ Create a slideshow about the Great Fire of London for Year 2 ⚡ Make a slideshow on persuasive writing techniques for Year 6 ⚡ Create a slideshow on healthy eating and food groups for Year 3 PSHE
- button "✨ Generate slideshow" [disabled]
- text: LessonNest · For UK primary school teachers
```

# Test source

```ts
  81  |     }
  82  |   })
  83  | 
  84  |   test('units are grouped by book title', async ({ page }) => {
  85  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  86  |     if (hasUnits) {
  87  |       // Book titles appear as group headers
  88  |       const groupHeaders = page.locator('[style*="Lora"]').first()
  89  |       await expect(groupHeaders).toBeVisible()
  90  |     }
  91  |   })
  92  | 
  93  |   test('each plan row has edit and delete buttons', async ({ page }) => {
  94  |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).first().isVisible().catch(() => false)
  95  |     if (hasUnits) {
  96  |       await expect(page.getByTitle('✏️').first().or(page.locator('button').filter({ hasText: '✏️' }).first())).toBeVisible().catch(() => {})
  97  |       await expect(page.locator('button').filter({ hasText: '🗑️' }).first()).toBeVisible()
  98  |     }
  99  |   })
  100 | 
  101 |   // ── Unit detail ──────────────────────────────────────────────────────────
  102 | 
  103 |   test('clicking View unit opens unit detail', async ({ page }) => {
  104 |     await page.waitForTimeout(1500)
  105 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  106 |     if (!hasUnits) { test.skip(); return }
  107 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  108 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  109 |   })
  110 | 
  111 |   test('unit detail shows book card', async ({ page }) => {
  112 |     await page.waitForTimeout(1500)
  113 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  114 |     if (!hasUnits) { test.skip(); return }
  115 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  116 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  117 |     // Book card shows year group, subject and lesson count
  118 |     await expect(page.getByText(/lessons/).first()).toBeVisible()
  119 |   })
  120 | 
  121 |   test('unit detail shows Lessons tab', async ({ page }) => {
  122 |     await page.waitForTimeout(1500)
  123 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  124 |     if (!hasUnits) { test.skip(); return }
  125 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  126 |     await expect(page.getByRole('button', { name: /Lessons/i }).first()).toBeVisible({ timeout: 5_000 })
  127 |   })
  128 | 
  129 |   test('unit detail shows Resources tab', async ({ page }) => {
  130 |     await page.waitForTimeout(1500)
  131 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  132 |     if (!hasUnits) { test.skip(); return }
  133 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  134 |     await expect(page.getByRole('button', { name: /Resources/i }).first()).toBeVisible({ timeout: 5_000 })
  135 |   })
  136 | 
  137 |   test('unit detail shows Presentations tab', async ({ page }) => {
  138 |     await page.waitForTimeout(1500)
  139 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  140 |     if (!hasUnits) { test.skip(); return }
  141 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  142 |     await expect(page.getByRole('button', { name: /Presentations/i }).first()).toBeVisible({ timeout: 5_000 })
  143 |   })
  144 | 
  145 |   test('Back to all units link returns to picker', async ({ page }) => {
  146 |     await page.waitForTimeout(1500)
  147 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  148 |     if (!hasUnits) { test.skip(); return }
  149 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  150 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  151 |     await page.getByText('← All units').click()
  152 |     await expect(page.locator('button').filter({ hasText: '✏️' }).first()).toBeVisible({ timeout: 5_000 })
  153 |   })
  154 | 
  155 |   test('Lessons tab shows lesson rows with learning intentions', async ({ page }) => {
  156 |     await page.waitForTimeout(1500)
  157 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  158 |     if (!hasUnits) { test.skip(); return }
  159 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  160 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  161 |     await expect(page.getByText(/Learning intention:/i).first()).toBeVisible({ timeout: 5_000 })
  162 |   })
  163 | 
  164 |   test('Resources tab shows Create resource button', async ({ page }) => {
  165 |     await page.waitForTimeout(1500)
  166 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  167 |     if (!hasUnits) { test.skip(); return }
  168 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  169 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  170 |     await page.getByRole('button', { name: /Resources/i }).first().click()
  171 |     await expect(page.getByRole('button', { name: /Create resource/i })).toBeVisible()
  172 |   })
  173 | 
  174 |   test('Presentations tab shows Create presentation button', async ({ page }) => {
  175 |     await page.waitForTimeout(1500)
  176 |     const hasUnits = await page.locator('button').filter({ hasText: '✏️' }).count() > 0
  177 |     if (!hasUnits) { test.skip(); return }
  178 |     await page.locator('[style*="cursor: pointer"]').filter({ hasText: /lessons/i }).first().click()
  179 |     await expect(page.getByText('← All units')).toBeVisible({ timeout: 5_000 })
  180 |     await page.getByRole('button', { name: /Presentations/i }).first().click()
> 181 |     await expect(page.getByRole('button', { name: /Create presentation/i })).toBeVisible()
      |                                                                              ^ Error: expect(locator).toBeVisible() failed
  182 |   })
  183 | 
  184 | })
  185 | 
```