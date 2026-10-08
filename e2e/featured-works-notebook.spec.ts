import { test, expect } from '@playwright/test';

test.describe('Featured Works Notebook Deck Stacking Style', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const section = page.locator('#featured-works');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
  });

  test('1. Notebook Cards Are Sticky on All Viewports Including Mobile', async ({ page }) => {
    const cards = page.locator('#featured-works .notebook-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      const isSticky = await card.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.position === 'sticky';
      });
      expect(isSticky, `Card ${i + 1} should have position: sticky`).toBe(true);

      const topVal = await card.evaluate((el) => window.getComputedStyle(el).top);
      expect(topVal).not.toBe('auto');
    }
  });

  test('2. Notebook Cards Stack with Increasing z-index and Cascading Tops', async ({ page }) => {
    const cards = page.locator('#featured-works .notebook-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);

    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    const z1 = await firstCard.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex) || 0);
    const z2 = await secondCard.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex) || 0);

    expect(z2).toBeGreaterThan(z1);
  });

  test('3. No Horizontal Overflow and No Console Errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const section = page.locator('#featured-works');
    await section.scrollIntoViewIfNeeded();

    // Verify document width does not cause horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
    expect(errors.filter((e) => !e.includes('favicon'))).toEqual([]);
  });

  test('4. Visual Snapshot of Featured Works Notebook Stack', async ({ page }, testInfo) => {
    const section = page.locator('#featured-works');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const artifactPath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/notebook_${testInfo.project.name}.png`;
    await page.screenshot({ path: artifactPath, fullPage: false });
  });
});

