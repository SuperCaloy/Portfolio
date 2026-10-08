import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const now = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const dateFolder = process.env.PLAYWRIGHT_DATE || `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const timeFolder = process.env.PLAYWRIGHT_TIME || `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
const dateOutputDir = process.env.PLAYWRIGHT_OUTPUT_DIR || `./playwright/results/${dateFolder}/${timeFolder}`;

/** GPU flags, shared by every Chromium project */
const gpuLaunchOptions = {
  ignoreDefaultArgs: ['--disable-gpu'],
  args: [
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--use-angle=d3d11',
  ],
};

/** Every viewport to test. Add or remove rows as needed. */
const viewports = [
  { name: 'mobile-320',   width: 320,  height: 568,  mobile: true  }, // small phone (iPhone SE 1st gen)
  { name: 'mobile-375',   width: 375,  height: 667,  mobile: true  }, // iPhone SE / 8
  { name: 'mobile-414',   width: 414,  height: 896,  mobile: true  }, // large phone
  { name: 'tablet-768',   width: 768,  height: 1024, mobile: true  }, // iPad portrait
  { name: 'tablet-1024',  width: 1024, height: 768,  mobile: true  }, // iPad landscape
  { name: 'laptop-1280',  width: 1280, height: 720,  mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900,  mobile: false },
  { name: 'desktop-1920', width: 1920, height: 1080, mobile: false },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Files run one after another within a worker, to keep CPU load down */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Limit workers so your PC stays usable */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: `${dateOutputDir}/html-report`, open: 'never' }],
  ],
  outputDir: `${dateOutputDir}/artifacts`,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* One project per viewport, all on Chromium */
  projects: viewports.map(({ name, width, height, mobile }) => ({
    name,
    use: {
      ...devices['Desktop Chrome'],
      // channel: 'chromium', // optional: full Chromium (new headless) for better GPU use, needs Playwright 1.49+
      viewport: { width, height },
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: mobile ? 2 : 1,
      launchOptions: gpuLaunchOptions,
    },
  })),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});