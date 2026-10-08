import { test, expect } from '@playwright/test';

test.describe('Visual Polish & Fluid Gradient (TDD Suite)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Fluid Mouse-Following Gradient Glow with Lerp Easing', async ({ page }) => {
    const spotlight = page.locator('#spotlight');
    await expect(spotlight).toBeAttached();

    // Verify spotlight has fluid styling and emerald gradient
    const style = await spotlight.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundImage: computed.backgroundImage,
        opacity: parseFloat(computed.opacity),
        position: computed.position,
        zIndex: computed.zIndex,
      };
    });

    expect(style.position).toBe('fixed');
    // Opacity should be clearly visible (not washed out to 0.04)
    expect(style.opacity).toBeGreaterThanOrEqual(0.15);
    // Background should contain emerald/green rgb values
    expect(style.backgroundImage).toMatch(/rgba?\((16,\s*185,\s*129|5,\s*150,\s*105|6,\s*78,\s*59)/);

    // Test mouse movement tracking with easing
    await page.mouse.move(400, 300);
    // Wait a brief frame for lerp to interpolate
    await page.waitForTimeout(100);

    const transformAfterMove = await spotlight.evaluate((el) => el.style.transform);
    expect(transformAfterMove).toMatch(/translate3d\([0-9.]+px,\s*[0-9.]+px,\s*0px?\)/);
  });

  test('2. Ambient Background Micro-Grid Texture', async ({ page }) => {
    const grid = page.locator('#ambientGrid, .ambient-grid');
    await expect(grid).toBeAttached();
    await expect(grid).toBeVisible();

    const gridStyle = await grid.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        pointerEvents: computed.pointerEvents,
        position: computed.position,
      };
    });
    expect(gridStyle.pointerEvents).toBe('none');
    expect(gridStyle.position).toBe('fixed');
  });

  test('3. About Section Word-Splitting Bug Prevention', async ({ page }) => {
    const aboutSection = page.locator('#story, .about-sec');
    await expect(aboutSection).toBeVisible();

    // Words should be enclosed in word containers to prevent mid-syllable splitting
    const wordSpans = aboutSection.locator('.word-wrap, .word-container');
    const wordCount = await wordSpans.count();
    expect(wordCount).toBeGreaterThan(10);
  });

  test('4. Contact Section Button Accent Fidelity', async ({ page }) => {
    const submitBtn = page.locator('#contact form button[type="submit"]');
    await expect(submitBtn).toBeVisible();

    // Submit button should use vibrant emerald accent, not dark muddy emerald-800
    const btnClass = await submitBtn.getAttribute('class');
    expect(btnClass).not.toContain('bg-emerald-800');
    expect(btnClass).toMatch(/bg-emerald-500|bg-emerald-600/);
  });

  test('5. Project Cards Double-Bezel and Window Header Bar', async ({ page }) => {
    const featuredSec = page.locator('#featured-works');
    await expect(featuredSec).toBeVisible();

    // Check for macOS-style mock window bar above project screenshot
    const windowBars = featuredSec.locator('.project-window-bar, .window-mock-bar');
    const barCount = await windowBars.count();
    expect(barCount).toBeGreaterThan(0);

    // Check for double bezel inner core
    const cardCores = featuredSec.locator('.notebook-core, .project-core');
    const coreCount = await cardCores.count();
    expect(coreCount).toBeGreaterThan(0);
  });

  test('6. Showcase Reel Hover Scrim Overlay and Metadata', async ({ page }) => {
    const reel = page.locator('#reel');
    await expect(reel).toBeVisible();

    const reelCards = reel.locator('.reel-card');
    const count = await reelCards.count();
    expect(count).toBeGreaterThan(0);

    // Each reel card should have a hover scrim containing project title/meta
    const scrims = reel.locator('.reel-scrim, .reel-meta-overlay');
    const scrimCount = await scrims.count();
    expect(scrimCount).toBeGreaterThan(0);
  });

  test('7. Experience Chronological Timeline Spine and Nodes', async ({ page }) => {
    const expSec = page.locator('#experience');
    await expect(expSec).toBeVisible();

    const spineNodes = expSec.locator('.timeline-spine-node, .timeline-node');
    const nodeCount = await spineNodes.count();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('8. Certificates Verification Beacon and Sheen', async ({ page }) => {
    const certSec = page.locator('#certificates');
    await expect(certSec).toBeVisible();

    const beacons = certSec.locator('.cert-beacon, .verify-beacon');
    const beaconCount = await beacons.count();
    expect(beaconCount).toBeGreaterThan(0);
  });
});

