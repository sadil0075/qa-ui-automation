const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./playwright-automation-framework/src/tests",
  outputDir: "./result/test-results",

  // CI-optimized timeouts
  timeout: process.env.CI ? 45000 : 60000, // 45s in CI, 60s locally
  expect: {
    timeout: process.env.CI ? 10000 : 15000, // 10s in CI, 15s locally
  },

  // Single worker configuration
  retries: process.env.CI ? 2 : 1, // More retries in CI for stability
  workers: 1, // Always use single worker (no parallel execution)

  // Enhanced reporter configuration
  reporter: process.env.CI
    ? [
        ["html", { outputFolder: "./result/playwright-report" }],
        ["github"], // GitHub annotations in CI
        ["list"], // Console output
        ["json", { outputFile: "./result/test-results/results.json" }], // JSON for CI processing
      ]
    : [["html", { outputFolder: "./result/playwright-report" }], ["list"]],

  use: {
    baseURL: "https://app.juliusdev.net/login",

    // Failure investigation tools
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Optimized timeouts for single worker execution
    actionTimeout: process.env.CI ? 20000 : 30000,
    navigationTimeout: process.env.CI ? 20000 : 30000,

    // Viewport configuration
    viewport: { width: 1280, height: 720 },

    // Wait strategies
    actionMode: "wait",
    navigationMode: "wait",

    // CI-specific browser settings
    launchOptions: {
      args: process.env.CI
        ? [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
          ]
        : [
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process",
          ],
    },
  },

  projects: [
    {
      name: "Chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Inherit launch options from global use config
      },
    },

    // Uncomment below for cross-browser testing (still single worker)
    // {
    //   name: "Firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "WebKit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  // Global setup and teardown (optional)
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),

  // Web server configuration (if needed)
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
