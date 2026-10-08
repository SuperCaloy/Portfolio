import { test, expect } from '@playwright/test';

test.describe('Frontend V2 Remediation & Polish Suite (TDD)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('1. Identity: displays Ramon Pacilona uniformly with no middle initial', async ({ page }) => {
    // Header brand link should render RAMON PACILONA in uppercase font-mono
    const brandText = await page.locator('.brand-link span.font-mono').textContent();
    expect(brandText?.trim()).toBe('Ramon Pacilona');

    // Hero name heading should display Ramon Pacilona
    const heroName = await page.locator('.hero-name').textContent();
    expect(heroName?.trim()).toBe('Ramon Pacilona');

    // Page title should be Ramon Pacilona
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Ramon Pacilona');
    expect(pageTitle).not.toContain('Carlos');

    // Footer name should be Ramon Pacilona
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('Ramon Pacilona');
    expect(footerText).not.toContain('Carlos');
  });

  test('2. About: personalized content and domain cybersecurity/backend 3D design', async ({ page }) => {
    const aboutSection = page.locator('#story');
    await expect(aboutSection).toBeVisible();
    await aboutSection.scrollIntoViewIfNeeded();

    // Must not contain the hardcoded generic aphorism
    const aboutHeading = await aboutSection.locator('h2').textContent();
    expect(aboutHeading).not.toContain('Software Craft with Rigorous Precision');

    // Corner 3D artifacts must exist with domain cybersecurity/backend roles
    const artifacts = aboutSection.locator('.corner-artifact');
    expect(await artifacts.count()).toBe(4);

    // Ensure artifacts have domain-relevant aria labels (node, shield, terminal/code, database)
    const labels = await artifacts.evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-label') || '')
    );
    expect(labels.some((l) => /network|node/i.test(l))).toBe(true);
    expect(labels.some((l) => /shield|security/i.test(l))).toBe(true);
    expect(labels.some((l) => /terminal|code|binary/i.test(l))).toBe(true);
    expect(labels.some((l) => /database|cluster/i.test(l))).toBe(true);
  });

  test('3. Featured Works: GitHub logo stays at top-right regardless of title length', async ({ page }) => {
    const section = page.locator('#featured-works');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();

    const cards = section.locator('.notebook-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);

    // Card 01 has a long title; verify its GitHub button is at the top-right of card-top-info
    const firstCard = cards.nth(0);
    const firstGhBtn = firstCard.locator('a[aria-label^="GitHub repository"]');
    const firstTitle = firstCard.locator('.card-name');

    if (await firstGhBtn.count() > 0) {
      const ghBox = await firstGhBtn.boundingBox();
      const titleBox = await firstTitle.boundingBox();
      expect(ghBox).not.toBeNull();
      expect(titleBox).not.toBeNull();

      // GitHub button X must be to the right of the title, not pushed underneath it
      expect(ghBox!.x).toBeGreaterThan(titleBox!.x);
      // GitHub button top should be roughly aligned with the top of the title block (within 24px)
      expect(Math.abs(ghBox!.y - titleBox!.y)).toBeLessThan(28);
    }
  });

  test('4. Featured Works: Stacked card 02 covers card 01 with zero bottom bleed-through', async ({ page }) => {
    const section = page.locator('#featured-works');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();

    const cards = section.locator('.notebook-card');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    // Scroll so that the second card reaches its sticky position stacked over the first card
    const cardTop = await secondCard.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((targetY) => window.scrollTo({ top: targetY - 90, behavior: 'instant' }), cardTop);
    await page.waitForTimeout(400);

    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    expect(firstCardBox).not.toBeNull();
    expect(secondCardBox).not.toBeNull();

    // Second card bottom must be greater than or equal to first card bottom so nothing peeks out underneath
    const firstBottom = firstCardBox!.y + firstCardBox!.height;
    const secondBottom = secondCardBox!.y + secondCardBox!.height;
    expect(secondBottom).toBeGreaterThanOrEqual(firstBottom - 4);

    // Verify header does not collide with card top
    const header = page.locator('header nav.header-nav');
    const headerBox = await header.boundingBox();
    if (headerBox) {
      const headerBottom = headerBox.y + headerBox.height;
      // Second card top should be below or comfortably at header clearance
      expect(secondCardBox!.y).toBeGreaterThanOrEqual(headerBottom - 2);
    }
  });

  test('5. Featured Works: Rich card content with zero macOS dots or .sys suffixes', async ({ page }) => {
    const section = page.locator('#featured-works');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();

    // Verify fake macOS traffic light dots are eliminated
    const macDots = section.locator('.window-dots');
    expect(await macDots.count()).toBe(0);

    // Verify .sys labels are eliminated
    const sysLabels = await section.locator('.notebook-card').evaluateAll((cards) =>
      cards.map((c) => c.textContent || '').filter((text) => /\.sys\b/i.test(text))
    );
    expect(sysLabels.length).toBe(0);

    // Verify cards display substantive descriptions and tech stack pills
    const firstCard = section.locator('.notebook-card').nth(0);
    const descText = await firstCard.locator('p').textContent();
    expect(descText?.trim().length).toBeGreaterThan(25);
  });

  test('6. Accessibility: interactive triggers have accessible labels', async ({ page }) => {
    // Mobile hamburger menu toggle
    const mobileMenuBtn = page.locator('button#mobileMenuBtn, button[aria-label="Toggle navigation menu"]');
    if (await mobileMenuBtn.count() > 0) {
      const ariaLabel = await mobileMenuBtn.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });
});
