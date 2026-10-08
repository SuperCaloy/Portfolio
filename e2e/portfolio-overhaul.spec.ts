import { test, expect } from '@playwright/test';

test.describe('Portfolio Frontend Overhaul V2 (TDD Suite)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Initial Preloader & Smooth Hydration', async ({ page }) => {
    // Check that hero becomes visible after preloader dissolves
    const heroHeading = page.locator('.hero-name, h1');
    await expect(heroHeading).toBeVisible({ timeout: 10000 });
  });

  test('2. Atmospheric Lighting, Spotlight & Progress Hairline', async ({ page }) => {
    // Check progress hairline and atmospheric elements
    const progressLine = page.locator('#progressLine, .progress-line');
    await expect(progressLine).toBeAttached();

    const spotlight = page.locator('#spotlight, .spotlight');
    await expect(spotlight).toBeAttached();
  });

  test('3. Dynamic Floating Header & Mobile Navigation', async ({ page }) => {
    // Floating navigation bar exists
    const nav = page.locator('nav.header-nav, header nav');
    await expect(nav).toBeVisible();

    // Contains brand name and live dot indicator
    const brandDot = nav.locator('.dot-brand');
    await expect(brandDot).toBeVisible();

    // Section links are present
    const projectsLink = page.locator('nav a[href="#projects"]');
    await expect(projectsLink).toBeVisible();
  });

  test('4. Typographic Hero & Dynamic Data Binding', async ({ page }) => {
    // Metallic chrome heading with dynamic user name
    const heroName = page.locator('.hero-name');
    await expect(heroName).toBeVisible();
    await expect(heroName).toContainText(/Ramon Carlos (E\.\s*)?Pacilona/i);

    // Desktop and mobile responsive name spans
    const desktopSpan = heroName.locator('span.hidden.sm\\:inline');
    const mobileSpan = heroName.locator('span.inline.sm\\:hidden');
    await expect(desktopSpan).toContainText(/Ramon.*Pacilona/i);
    await expect(mobileSpan).toContainText(/Ramon.*Pacilona/i);

    // Resume button in CTA row
    const resumeBtn = page.locator('.resume-btn');
    await expect(resumeBtn).toBeVisible();
    await expect(resumeBtn).toHaveAttribute('href', /resume/i);

    // Badges removed per user requests
    const statsBar = page.locator('.stats-bar');
    await expect(statsBar).toHaveCount(0);
    const availableBadge = page.locator('text=/AVAILABLE FOR CONTRACT|Available for Hire/i');
    await expect(availableBadge).toHaveCount(0);
    const philosophyEyebrow = page.locator('text=/Engineering Philosophy/i');
    await expect(philosophyEyebrow).toHaveCount(0);
  });

  test('5. Dual-Track Showcase Reel (Scroll-Driven)', async ({ page }) => {
    // Showcase reel section exists
    const reelSection = page.locator('#reel');
    await expect(reelSection).toBeVisible();

    // Both top and bottom tracks exist
    const rightTrack = page.locator('#marqueeRight, .marquee-track-right');
    const leftTrack = page.locator('#marqueeLeft, .marquee-track-left');
    await expect(rightTrack).toBeAttached();
    await expect(leftTrack).toBeAttached();

    // Contains dynamically populated reel cards
    const reelCards = reelSection.locator('.reel-card');
    await expect(reelCards.first()).toBeVisible();
  });

  test('6. About Section with 3D Artifacts & Character Lighting', async ({ page }) => {
    const aboutSec = page.locator('#story, .about-sec');
    await expect(aboutSec).toBeVisible();

    // Reveal text paragraph with character spans
    const revealText = page.locator('#revealText, .reveal-text');
    await expect(revealText).toBeVisible();

    // Telemetry pills row removed per design preference
    const telemetryRow = page.locator('.telemetry-row');
    await expect(telemetryRow).toHaveCount(0);

    // 4 Interactive 3D corner artifacts
    const artifacts = aboutSec.locator('.corner-artifact');
    await expect(artifacts).toHaveCount(4);

    // Verify artifact images load successfully
    const moonImg = aboutSec.locator('img[src*="moon_icon.png"]');
    const shieldImg = aboutSec.locator('img[src*="shield_icon.png"]');
    const legoImg = aboutSec.locator('img[src*="lego_icon.png"]');
    const cursorImg = aboutSec.locator('img[src*="cursor_icon.png"]');

    await expect(moonImg).toBeVisible();
    await expect(shieldImg).toBeVisible();
    await expect(legoImg).toBeVisible();
    await expect(cursorImg).toBeVisible();

    // Verify clicking artifact is interactive
    await moonImg.click();
  });

  test('7. Notebook Style Sticky Stacking Recent Work & Modal', async ({ page }) => {
    const recentWorkSec = page.locator('#featured-works, #recent-work');
    await expect(recentWorkSec).toBeVisible();

    // Notebook card deck
    const notebookCards = recentWorkSec.locator('.notebook-card');
    await expect(notebookCards.first()).toBeVisible();

    // View All Works trigger button
    const viewAllBtn = recentWorkSec.locator('.view-all-btn');
    await expect(viewAllBtn).toBeVisible();

    // Clicking card opens detailed project modal
    await notebookCards.first().click();
    const projectModal = page.locator('#projectModal');
    await expect(projectModal).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(projectModal).not.toHaveClass(/active/);
  });

  test('8. Tech Stack Bento with Category Filters & Expanders', async ({ page }) => {
    const techSec = page.locator('#tech');
    await expect(techSec).toBeVisible();

    // Filter pills
    const filterPills = techSec.locator('.filter-pill');
    await expect(filterPills.first()).toBeVisible();

    // Tech bento cards
    const techCards = techSec.locator('.tech-card');
    await expect(techCards.first()).toBeVisible();
  });

  test('9. Experience Timeline & Detail Modal', async ({ page }) => {
    const expSec = page.locator('#experience');
    await expect(expSec).toBeVisible();

    // Timeline nodes with double-bezel cards
    const expCards = expSec.locator('.exp-shell');
    await expect(expCards.first()).toBeVisible();

    // Clicking opens experience modal
    await expCards.first().click();
    const expModal = page.locator('#experienceModal');
    await expect(expModal).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(expModal).not.toHaveClass(/active/);
  });

  test('10. Certifications Grid & Catalog Modal', async ({ page }) => {
    const certsSec = page.locator('#certificates');
    await expect(certsSec).toBeVisible();

    // Certificate cards
    const certCards = certsSec.locator('.cert-shell');
    await expect(certCards.first()).toBeVisible();

    // Clicking opens certificate modal
    await certCards.first().click();
    const certModal = page.locator('#certModal');
    await expect(certModal).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(certModal).not.toHaveClass(/active/);
  });

  test('11. Contact Form & Footer with Dynamic Local Time', async ({ page }) => {
    const contactSec = page.locator('#contact');
    await expect(contactSec).toBeVisible();

    // Form inputs
    await expect(contactSec.locator('input#name')).toBeVisible();
    await expect(contactSec.locator('input#email, input[type="email"]')).toBeVisible();
    await expect(contactSec.locator('textarea')).toBeVisible();

    // Footer with live clock
    const footer = page.locator('footer.footbar, footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/LOCAL TIME:/i);
  });

  test('12. Viewport Responsiveness: Zero Horizontal Overflow', async ({ page }) => {
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(100);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(isOverflowing).toBe(false);
    }
  });

  test('13. Regression Bug 1: Footer GitHub and LinkedIn Links with SVG Icons', async ({ page }) => {
    const footer = page.locator('footer.footbar, footer');
    await expect(footer).toBeVisible();

    const githubLink = footer.locator('a[aria-label="GitHub Profile"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', /github\.com/i);
    await expect(githubLink.locator('svg')).toBeVisible();

    const linkedinLink = footer.locator('a[aria-label="LinkedIn Profile"]');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/i);
    await expect(linkedinLink.locator('svg')).toBeVisible();

    // Footer back to top removed per user preference
    const footerBackToTop = footer.locator('button:has-text("BACK TO TOP"), a:has-text("BACK TO TOP")');
    await expect(footerBackToTop).toHaveCount(0);
  });

  test('14. Regression Bug 2: Smart Back to Top Visibility on Scroll Up or Page Bottom', async ({ page }) => {
    const floatingBtn = page.locator('#floatingBackToTop');
    await expect(floatingBtn).toBeAttached();

    // While scrolling down, button should stay hidden
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(floatingBtn).toHaveClass(/opacity-0/);

    // Scrolling up slightly triggers visibility
    await page.evaluate(() => window.scrollTo({ top: 550, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(floatingBtn).toHaveClass(/opacity-100/);

    // Scrolling down again hides it
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(floatingBtn).toHaveClass(/opacity-0/);

    // Scrolling to bottom of document triggers visibility
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(floatingBtn).toHaveClass(/opacity-100/);

    // Clicking it scrolls back up to top
    await floatingBtn.locator('button').click();
    await page.waitForTimeout(1200);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(150);
  });

  test('15. Regression Bug 3: Showcase Reel Cards are Photo-Only with Click to Modal', async ({ page }) => {
    const reelSection = page.locator('#reel');
    await expect(reelSection).toBeVisible();

    // Check that cards have images and zero .tag or badge elements
    const reelCards = reelSection.locator('.reel-card');
    await expect(reelCards.first()).toBeVisible();

    const tagCount = await reelSection.locator('.reel-card .tag').count();
    expect(tagCount).toBe(0);

    const firstCardImg = reelCards.first().locator('img');
    await expect(firstCardImg).toBeVisible();

    // Clicking card opens the project modal
    await reelCards.first().dispatchEvent('click');
    const projectModal = page.locator('#projectModal');
    await expect(projectModal).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(projectModal).not.toHaveClass(/active/);
  });

  test('16. Regression Bug 4: Theme Toggle Completely Removed with Permanent Dark Mode', async ({ page }) => {
    // No theme toggle buttons exist in the DOM
    const themeToggle = page.locator('button[aria-label*="theme" i]');
    await expect(themeToggle).toHaveCount(0);

    // Root html element has dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('17. Regression Bug 5: Experience, Projects, and Certificates Modals Deep Verification', async ({ page }) => {
    // 1. Projects modal
    const recentWorkSec = page.locator('#featured-works, #recent-work');
    const projectInspectBtn = recentWorkSec.locator('.project-spec-btn').first();
    await projectInspectBtn.click({ force: true });
    const projectModal = page.locator('#projectModal');
    await expect(projectModal).toHaveClass(/active/);
    await expect(projectModal.locator('h2')).toBeVisible();
    await expect(projectModal.locator('[data-lenis-prevent]')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(projectModal).not.toHaveClass(/active/);

    // 2. Experience modal
    const expSec = page.locator('#experience');
    const expTrigger = expSec.locator('.exp-trigger-btn').first();
    await expTrigger.click({ force: true });
    const expModal = page.locator('#experienceModal');
    await expect(expModal).toHaveClass(/active/);
    await expect(expModal.locator('h2')).toBeVisible();
    await expect(expModal.locator('[data-lenis-prevent]')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(expModal).not.toHaveClass(/active/);

    // 3. Certificates modal
    const certSec = page.locator('#certificates');
    const certTrigger = certSec.locator('.cert-trigger-btn').first();
    await certTrigger.click({ force: true });
    const certModal = page.locator('#certModal');
    await expect(certModal).toHaveClass(/active/);
    await expect(certModal.locator('h2')).toBeVisible();
    await expect(certModal.locator('[data-lenis-prevent]')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(certModal).not.toHaveClass(/active/);
  });
});

