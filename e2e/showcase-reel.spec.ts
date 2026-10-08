import { test, expect } from '@playwright/test';

test.describe('Showcase Reel UI/UX & Dynamic Database Data (TDD Suite)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const reel = page.locator('#reel');
    await expect(reel).toBeVisible();
    await reel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  });

  test('1. Continuous Marquee Scrolling and Pause on Hover', async ({ page }, testInfo) => {
    const isMobile = Boolean(testInfo.project.use.isMobile);
    const reel = page.locator('#reel');
    const track = reel.locator('#marqueeTrack');

    await expect(track).toBeVisible();

    // Verify continuous horizontal displacement over time
    const getPosition = async () => {
      return await page.evaluate(() => {
        const t = document.getElementById('marqueeTrack');
        return t ? window.getComputedStyle(t).transform : '';
      });
    };

    const initial = await getPosition();
    await page.waitForTimeout(600);
    const moved = await getPosition();

    expect(moved).not.toBe(initial);

    // Find a card whose center is visible on the active screen
    const cards = track.locator('.reel-card');
    const count = await cards.count();
    const vpWidth = page.viewportSize()?.width || 1200;
    let visibleCard = null;

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (box) {
        const centerX = box.x + box.width / 2;
        if (centerX > 0 && centerX < vpWidth) {
          visibleCard = card;
          break;
        }
      }
    }

    expect(visibleCard).not.toBeNull();
    const cardBox = await visibleCard!.boundingBox();
    expect(cardBox).not.toBeNull();

    // Trigger pause via touchstart on mobile or pointer move on desktop
    if (isMobile) {
      await visibleCard!.dispatchEvent('touchstart');
    } else if (cardBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    }
    await page.waitForTimeout(300);

    // Verify that displacement is paused while hovering or touching the card
    const paused1 = await getPosition();
    await page.waitForTimeout(400);
    const paused2 = await getPosition();

    expect(paused1).toBe(paused2);

    // Release hover or touch and verify that motion resumes
    if (isMobile) {
      await visibleCard!.dispatchEvent('touchend');
    } else {
      await page.mouse.move(0, 0);
    }
    await page.waitForTimeout(500);
    const resumed = await getPosition();

    expect(resumed).not.toBe(paused2);
  });

  test('2. Card Hover Zoom Does Not Clip Borders', async ({ page }) => {
    const reel = page.locator('#reel');
    const topWrap = reel.locator('.marquee-track-wrap').first();
    const wrapBox = await topWrap.boundingBox();
    expect(wrapBox).not.toBeNull();

    if (wrapBox) {
      await page.mouse.move(wrapBox.x + wrapBox.width / 2, wrapBox.y + wrapBox.height / 2);
    }
    await page.waitForTimeout(300);

    // Check that hovered card top border is NOT clipped by topWrap overflow
    const cards = topWrap.locator('.reel-card');
    const count = await cards.count();
    const vpWidth = page.viewportSize()?.width || 1200;
    let visibleCard = null;

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (box) {
        const centerX = box.x + box.width / 2;
        if (centerX > 0 && centerX < vpWidth) {
          visibleCard = card;
          break;
        }
      }
    }

    expect(visibleCard).not.toBeNull();
    if (visibleCard && wrapBox) {
      const cardBox = await visibleCard.boundingBox();
      expect(cardBox).not.toBeNull();
      if (cardBox) {
        // The card's top edge (with border) must stay within or equal to wrap's visible boundary
        expect(cardBox.y).toBeGreaterThanOrEqual(wrapBox.y - 1);
        expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(wrapBox.y + wrapBox.height + 1);
      }
    }
  });

  test('3. Dynamic Database Subtitle and Title with Zero Hardcoded Text', async ({ page }) => {
    const reel = page.locator('#reel');
    const cards = reel.locator('.reel-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify that NO card contains the hardcoded string "SYSTEM ARCHITECTURE"
    const hardcodedText = reel.locator('text="SYSTEM ARCHITECTURE"');
    await expect(hardcodedText).toHaveCount(0);

    // Check that cards have real subtitles and titles
    for (let i = 0; i < Math.min(count, 4); i++) {
      const card = cards.nth(i);
      const subtitle = card.locator('.reel-card-subtitle');
      const title = card.locator('.reel-card-title');

      await expect(title).toBeVisible({ timeout: 5000 });
      const titleText = await title.textContent();
      expect(titleText?.trim().length).toBeGreaterThan(0);

      // Subtitle should be present and not hardcoded generic fallback
      if (await subtitle.count() > 0) {
        const subText = await subtitle.textContent();
        expect(subText?.trim()).not.toBe('SYSTEM ARCHITECTURE');
      }
    }
  });

  test('4. Floating BackToTop Does Not Obscure Reel Section', async ({ page }) => {
    const reel = page.locator('#reel');
    await reel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const backToTop = page.locator('#floatingBackToTop');
    // While viewing the reel near top of page, BackToTop button should NOT be visible
    await expect(backToTop).not.toHaveClass(/opacity-100/);
  });

  test('5. Visual Snapshot of Showcase Reel', async ({ page }, testInfo) => {
    const reel = page.locator('#reel');
    await expect(reel).toBeVisible();
    await reel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const artifactPath = `C:/Users/caloy/.gemini/antigravity-ide/brain/84c796c7-94a0-435d-824c-25d59c15d7d0/.tempmediaStorage/reel_${testInfo.project.name}.png`;
    await page.screenshot({ path: artifactPath, fullPage: false });
  });

  test('6. Interactive Dragging and Click Suppression', async ({ page }) => {
    const track = page.locator('#marqueeTrack');
    await expect(track).toBeVisible();

    const getX = async () => {
      return await track.evaluate(el => {
        const transform = window.getComputedStyle(el).transform;
        if (!transform || transform === 'none') return 0;
        const matrix = new DOMMatrixReadOnly(transform);
        return matrix.m41;
      });
    };

    const vp = page.viewportSize() || { width: 1200, height: 800 };
    const trackBox = await track.boundingBox();
    const startX = Math.floor(vp.width / 2);
    const startY = (trackBox?.y || 300) + 60;

    // Start drag from center of viewport
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const beforeDragX = await getX();

    // Drag left by 100px
    await page.mouse.move(startX - 100, startY, { steps: 5 });
    await page.waitForTimeout(50);
    const duringDragX = await getX();

    // Displacement during drag must differ from before drag
    expect(duringDragX).not.toBe(beforeDragX);

    // Release mouse
    await page.mouse.up();
    await page.waitForTimeout(100);

    // Modal must NOT open after a drag gesture
    const modal = page.locator('#projectModal');
    expect(await modal.isVisible()).toBe(false);
  });
});


