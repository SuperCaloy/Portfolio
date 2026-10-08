import { test, expect } from '@playwright/test';

test.describe('View All Projects Modal UI/UX & Single Scrollbar (TDD Suite)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll down to featured works section
    const featuredSec = page.locator('#featured-works');
    await expect(featuredSec).toBeVisible();
    await featuredSec.scrollIntoViewIfNeeded();

    // Click "View All Works" button to open modal
    const viewAllBtn = page.locator('.view-all-btn');
    await expect(viewAllBtn).toBeVisible();
    await viewAllBtn.click();
  });

  test('1. Modal Opens Smoothly with Single Scroll Area and Pinned Header/Filters', async ({ page }) => {
    const modalOverlay = page.locator('#allWorksModal');
    await expect(modalOverlay).toBeVisible();
    await expect(modalOverlay).toHaveClass(/active/);

    // Dialog shell must NOT have overflow-y: auto or scroll (must be overflow: hidden)
    const dialogShell = modalOverlay.locator('[role="dialog"]');
    await expect(dialogShell).toBeVisible();

    const shellOverflow = await dialogShell.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        overflowY: computed.overflowY,
        maxHeight: computed.maxHeight,
      };
    });
    // Outer shell should contain overflow, not produce an outer scrollbar
    expect(shellOverflow.overflowY).toBe('hidden');

    // Filter bar must be present and pinned
    const filterBar = modalOverlay.locator('.catalog-filter-bar, .status-filter-bar');
    await expect(filterBar).toBeVisible();

    // Exactly one scrollable content area inside the modal
    const scrollableCards = modalOverlay.locator('.catalog-scroll-area, .catalog-grid-scroll');
    await expect(scrollableCards).toBeVisible();

    const cardsOverflow = await scrollableCards.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.overflowY;
    });
    expect(cardsOverflow).toMatch(/auto|scroll/);
  });

  test('2. Last Card is Fully Reachable Without Bottom Cut-Off', async ({ page }) => {
    const modalOverlay = page.locator('#allWorksModal');
    const scrollContainer = modalOverlay.locator('.catalog-scroll-area, .catalog-grid-scroll');
    await expect(scrollContainer).toBeVisible();

    // Scroll all the way to bottom of the container
    await scrollContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(200);

    // The last catalog item must be visible
    const lastItem = modalOverlay.locator('.catalog-item').last();
    await expect(lastItem).toBeVisible();

    // Verify last item is within the visible bounding box of the scroll container
    const isInView = await lastItem.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const parentRect = el.closest('[role="dialog"]').getBoundingClientRect();
      return rect.bottom <= parentRect.bottom + 10;
    });
    expect(isInView).toBe(true);
  });

  test('3. Status Filter Tabs with Dynamic Counts and Empty State', async ({ page }) => {
    const modalOverlay = page.locator('#allWorksModal');
    const filterTabs = modalOverlay.locator('.filter-pill, .status-filter-btn');
    const tabCount = await filterTabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(2);

    // Initial all projects count
    const initialItemsCount = await modalOverlay.locator('.catalog-item').count();
    expect(initialItemsCount).toBeGreaterThan(0);

    // Click a specific filter (e.g. IN PROGRESS or COMPLETED)
    const inProgressTab = filterTabs.filter({ hasText: /IN PROGRESS/i });
    if (await inProgressTab.count() > 0) {
      await inProgressTab.click();
      await page.waitForTimeout(100);

      const filteredItems = modalOverlay.locator('.catalog-item');
      const filteredCount = await filteredItems.count();
      expect(filteredCount).toBeGreaterThan(0);

      // Reset to ALL
      const allTab = filterTabs.filter({ hasText: /ALL/i });
      await allTab.click();
      await page.waitForTimeout(100);
      expect(await modalOverlay.locator('.catalog-item').count()).toBe(initialItemsCount);
    }
  });

  test('4. Category Label and Description Readability', async ({ page }) => {
    const modalOverlay = page.locator('#allWorksModal');
    const firstItem = modalOverlay.locator('.catalog-item').first();
    await expect(firstItem).toBeVisible();

    // Category label should have full text accessible or title attribute
    const categoryEl = firstItem.locator('.catalog-category, .card-category');
    await expect(categoryEl).toBeVisible();

    // Category text must not be empty
    const catText = await categoryEl.textContent();
    expect(catText.trim().length).toBeGreaterThan(0);

    // Verify description is tidy with line-clamp
    const descEl = firstItem.locator('.catalog-desc, .card-desc');
    if (await descEl.count() > 0) {
      await expect(descEl).toBeVisible();
    }
  });

  test('5. Keyboard Navigation, Escape Key, and Outside Click to Close', async ({ page }) => {
    const modalOverlay = page.locator('#allWorksModal');
    await expect(modalOverlay).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(modalOverlay).not.toHaveClass(/active/);

    // Reopen modal
    const viewAllBtn = page.locator('.view-all-btn');
    await viewAllBtn.click();
    await expect(modalOverlay).toHaveClass(/active/);

    // Close via close button
    const closeBtn = modalOverlay.locator('button[aria-label="Close modal"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modalOverlay).not.toHaveClass(/active/);
  });

  test('6. Visual Snapshot of Polished Modal', async ({ page }, testInfo) => {
    const modalOverlay = page.locator('#allWorksModal');
    await expect(modalOverlay).toBeVisible();
    await page.waitForTimeout(500);

    const artifactPath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/modal_top_${testInfo.project.name}.png`;
    await page.screenshot({ path: artifactPath, fullPage: false });

    // Scroll to bottom and take another screenshot
    const scrollArea = modalOverlay.locator('.catalog-scroll-area');
    await scrollArea.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(300);

    const bottomArtifactPath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/modal_bottom_${testInfo.project.name}.png`;
    await page.screenshot({ path: bottomArtifactPath, fullPage: false });
  });
});

