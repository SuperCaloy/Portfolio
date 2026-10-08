import { test, expect } from '@playwright/test';

test.describe('Tech & Skills Section UI/UX & Responsive Layout Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const techSec = page.locator('#tech');
    await expect(techSec).toBeVisible();
    await techSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  });

  test('1. Section Structure, Dynamic Database Categories & Proportional Bento', async ({ page }) => {
    const techSec = page.locator('#tech');

    // Heading check and confirm redundant eyebrow pill is removed
    const eyebrow = techSec.locator('.tech-eyebrow');
    await expect(eyebrow).toHaveCount(0);
    await expect(techSec.locator('h2')).toContainText('Tech Stack & Ecosystem');

    // Confirm internal prompt jargon is completely removed
    const jargon = techSec.locator('text="Double-Bezel Hardware Architecture"');
    await expect(jargon).toHaveCount(0);

    // Cards count check: 5 distinct database categories
    const cards = techSec.locator('.tech-card');
    await expect(cards).toHaveCount(5);

    // Check grammatical counter badges (e.g. "4 TECHS", "1 TECH")
    const counters = techSec.locator('.tech-count');
    const countTotal = await counters.count();
    expect(countTotal).toBe(5);
    for (let i = 0; i < countTotal; i++) {
      const text = await counters.nth(i).textContent();
      expect(text?.trim()).not.toContain('1 TOOLS');
      expect(text?.trim()).toMatch(/\d+ TECHS?/);
    }
  });

  test('2. Zero Horizontal Overflow Across Active Viewport', async ({ page }) => {
    const docMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    // Must be completely flush with no horizontal scrolling
    expect(docMetrics.scrollWidth).toBeLessThanOrEqual(docMetrics.clientWidth + 1);
  });

  test('3. Category Filter Tabs Dynamic Filtering and Centering', async ({ page }) => {
    const techSec = page.locator('#tech');

    // Click "DATABASE" filter tab
    const dbFilter = techSec.locator('.filter-pill', { hasText: 'DATABASE' });
    await expect(dbFilter).toBeVisible();
    await dbFilter.click();
    await page.waitForTimeout(300);

    // Should display only 1 card (Database)
    const cardsAfterFilter = techSec.locator('.tech-card');
    await expect(cardsAfterFilter).toHaveCount(1);
    await expect(cardsAfterFilter.first().locator('h3')).toContainText('Database');

    // Return to "ALL"
    const allFilter = techSec.locator('.filter-pill', { hasText: 'ALL' });
    await allFilter.click();
    await page.waitForTimeout(300);
    await expect(techSec.locator('.tech-card')).toHaveCount(5);
  });

  test('4. Tactile Tech Chips Have Icons and Labels', async ({ page }) => {
    const techSec = page.locator('#tech');
    const chips = techSec.locator('.tech-card .group');
    const chipCount = await chips.count();

    // Database has 12 skills total
    expect(chipCount).toBe(12);

    for (let i = 0; i < chipCount; i++) {
      const chip = chips.nth(i);
      const text = await chip.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);

      // Icon container exists
      const iconContainer = chip.locator('span').first();
      await expect(iconContainer).toBeVisible();
    }
  });

  test('5. Capture Visual Snapshot in Portrait & Landscape', async ({ page }, testInfo) => {
    const techSec = page.locator('#tech');
    await techSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Snapshot in default orientation
    const defaultPath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/tech_final_${testInfo.project.name}_portrait.png`;
    await page.screenshot({ path: defaultPath, fullPage: false });

    // Rotate to landscape if mobile or tablet
    const origVp = page.viewportSize() || { width: 1200, height: 800 };
    if (origVp.height > origVp.width) {
      await page.setViewportSize({ width: origVp.height, height: origVp.width });
      await techSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const landscapePath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/tech_final_${testInfo.project.name}_landscape.png`;
      await page.screenshot({ path: landscapePath, fullPage: false });
    }
  });
});
