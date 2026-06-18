# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: books.spec.js >> My Books page >> Add to library modal can be closed
- Location: tests/books.spec.js:141:7

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByText(/Add book to library/i)
Expected: not visible
Received: visible
Timeout:  3000ms

Call log:
  - Expect "not toBeVisible" with timeout 3000ms
  - waiting for getByText(/Add book to library/i)
    10 × locator resolved to <div>Add book to library</div>
       - unexpected value "visible"

```

```yaml
- text: Add book to library
```

# Test source

```ts
  45  |   test('Add to library button is visible', async ({ page }) => {
  46  |     await expect(page.getByRole('button', { name: /Add to library/i })).toBeVisible()
  47  |   })
  48  | 
  49  |   test('Find books button navigates to Book Recommender', async ({ page }) => {
  50  |     await page.getByRole('button', { name: /Find books/i }).click()
  51  |     await expect(page.getByRole('heading', { name: 'Book Recommender' })).toBeVisible({ timeout: 5_000 })
  52  |   })
  53  | 
  54  |   // ── Filter bar ───────────────────────────────────────────────────────────
  55  | 
  56  |   test('search input is visible', async ({ page }) => {
  57  |     await expect(page.getByPlaceholder(/Search/i).first()).toBeVisible()
  58  |   })
  59  | 
  60  |   test('subject filter is visible', async ({ page }) => {
  61  |     await expect(page.getByRole('option', { name: 'All subjects' }).first()).toBeAttached()
  62  |   })
  63  | 
  64  |   test('year group filter is visible', async ({ page }) => {
  65  |     await expect(page.getByRole('option', { name: 'All years' }).first()).toBeAttached()
  66  |   })
  67  | 
  68  |   test('Has plans filter pill is visible', async ({ page }) => {
  69  |     await expect(page.getByText('📝 Has plans')).toBeVisible()
  70  |   })
  71  | 
  72  |   // ── Book grid ────────────────────────────────────────────────────────────
  73  | 
  74  |   test('books are displayed in a grid', async ({ page }) => {
  75  |     await page.waitForTimeout(1500)
  76  |     const hasBooks = await page.locator('[style*="grid"]').first().isVisible().catch(() => false)
  77  |     if (hasBooks) {
  78  |       await expect(page.locator('[style*="grid"]').first()).toBeVisible()
  79  |     }
  80  |   })
  81  | 
  82  |   test('book cards show title and author', async ({ page }) => {
  83  |     await page.waitForTimeout(1500)
  84  |     const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
  85  |     if (bookCount > 0) {
  86  |       // Books have View plans or Create plan buttons
  87  |       await expect(page.locator('button').filter({ hasText: /View plans|Create plan/i }).first()).toBeVisible()
  88  |     }
  89  |   })
  90  | 
  91  |   test('favourite star is visible on book cards', async ({ page }) => {
  92  |     await page.waitForTimeout(1500)
  93  |     const bookCount = await page.locator('button').filter({ hasText: /View plans|Create plan/i }).count()
  94  |     if (bookCount > 0) {
  95  |       await expect(page.locator('button').filter({ hasText: /⭐|☆/ }).first()).toBeVisible()
  96  |     }
  97  |   })
  98  | 
  99  |   // ── Sections ─────────────────────────────────────────────────────────────
  100 | 
  101 |   test('Favourites section is visible when books are starred', async ({ page }) => {
  102 |     await page.waitForTimeout(1500)
  103 |     const favSection = page.getByText('⭐ Favourites')
  104 |     const hasFavs = await favSection.isVisible().catch(() => false)
  105 |     if (hasFavs) {
  106 |       await expect(favSection).toBeVisible()
  107 |     }
  108 |   })
  109 | 
  110 |   test('Library section is visible', async ({ page }) => {
  111 |     await page.waitForTimeout(1500)
  112 |     const libSection = page.getByText('📚 Library').first()
  113 |     const hasLib = await libSection.isVisible().catch(() => false)
  114 |     if (hasLib) {
  115 |       await expect(libSection).toBeVisible()
  116 |     }
  117 |   })
  118 | 
  119 |   test('Recently used section is visible', async ({ page }) => {
  120 |     await page.waitForTimeout(1500)
  121 |     const recentSection = page.getByText('🕐 Recently used').first()
  122 |     const hasRecent = await recentSection.isVisible().catch(() => false)
  123 |     if (hasRecent) {
  124 |       await expect(recentSection).toBeVisible()
  125 |     }
  126 |   })
  127 | 
  128 |   // ── Add to library modal ─────────────────────────────────────────────────
  129 | 
  130 |   test('Add to library opens a modal', async ({ page }) => {
  131 |     await page.getByRole('button', { name: /Add to library/i }).click()
  132 |     await expect(page.getByText(/Add book to library/i)).toBeVisible({ timeout: 5_000 })
  133 |   })
  134 | 
  135 |   test('Add to library modal has title and author fields', async ({ page }) => {
  136 |     await page.getByRole('button', { name: /Add to library/i }).click()
  137 |     await expect(page.getByPlaceholder(/Title/i)).toBeVisible({ timeout: 5_000 })
  138 |     await expect(page.getByPlaceholder(/Author/i)).toBeVisible({ timeout: 5_000 })
  139 |   })
  140 | 
  141 |   test('Add to library modal can be closed', async ({ page }) => {
  142 |     await page.getByRole('button', { name: /Add to library/i }).click()
  143 |     await expect(page.getByText(/Add book to library/i)).toBeVisible({ timeout: 5_000 })
  144 |     await page.keyboard.press('Escape')
> 145 |     await expect(page.getByText(/Add book to library/i)).not.toBeVisible({ timeout: 3_000 })
      |                                                              ^ Error: expect(locator).not.toBeVisible() failed
  146 |   })
  147 | 
  148 |   // ── Has plans filter ─────────────────────────────────────────────────────
  149 | 
  150 |   test('Has plans filter toggles on click', async ({ page }) => {
  151 |     const pill = page.getByText('📝 Has plans')
  152 |     await pill.click()
  153 |     // After clicking, it should be active (green background)
  154 |     await expect(pill).toBeVisible()
  155 |     await pill.click() // toggle off
  156 |   })
  157 | 
  158 | })
  159 | 
```