# Playwright Automation Framework

## Overview

This is an end-to-end testing framework built using Playwright for automated testing of the Julius application. The framework implements the Page Object Model (POM) design pattern and includes features like humanized typing, robust error handling, and comprehensive test reporting.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup Instructions](#setup-instructions)
3. [Framework Features](#framework-features)
4. [Running Tests](#running-tests)
5. [Page Objects](#page-objects)
6. [Test Data Management](#test-data-management)
7. [Utilities and Helpers](#utilities-and-helpers)
8. [Test Reports](#test-reports)
9. [Best Practices](#best-practices)

## Project Structure

```
playwright-automation-framework/
├── src/
│   ├── common/
│   │   └── constants.js         # Common constants and configuration
│   ├── data/
│   │   ├── loginPageData.json   # Test data for login
│   │   ├── personalData.json    # Personal information test data
│   │   └── tempData.json        # Runtime data storage
│   ├── pages/
│   │   ├── loginPage.js
│   │   ├── listPage.js
│   │   ├── campaignPage.js
│   │   └── ...                  # Other page objects
│   ├── tests/
│   │   ├── 1_login.spec.js
│   │   ├── 2_manageAccount.spec.js
│   │   └── ...                  # Test specifications
│   └── utils/
│       ├── helpers.js           # Common helper functions
│       └── testHelper.js       # Test utility functions
├── playwright.config.js         # Playwright configuration
└── package.json                 # Project dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository

```bash
   git clone <repository-url>
   cd playwright-automation-framework
```

2. Install dependencies

```bash
   npm install
```

3. Install Playwright browsers

```bash
npx playwright install
```

## Framework Features

### 1. Page Object Model (POM)

- Separate page objects for each page/component
- Encapsulated selectors and actions
- Reusable methods and elements

### 2. Humanized Interaction

- Natural typing speeds with random delays
- Human-like interaction patterns
- Configurable delays and timeouts

### 3. Robust Error Handling

- Comprehensive try-catch blocks
- Detailed error logging
- Automatic screenshot capture on failure

### 4. Test Data Management

- JSON-based test data
- Runtime data storage
- Dynamic data generation utilities

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/1_login.spec.js
```

### Run Tests in Different Browsers

````bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit


## Utilities and Helpers

### TestHelper Class

- Wrapper for common Playwright actions
- Additional wait conditions
- Network idle handling
- Element visibility checks

### Helper Functions

- Random string generation
- Dynamic data creation
- Temporary data storage
- Screenshot handling

## Test Reports

### HTML Report

- Detailed test execution results
- Screenshots of failures
- Test duration and status
- Located in `playwright-report/index.html`

### Failure Screenshots

- Automatically captured on test failure
- Stored in `playwright-Failed-TC-Screenshot/`
- Named after the test case

## Best Practices

### 1. Element Selection

- Use stable selectors (IDs, test attributes)
- Maintain selectors in page objects
- Use descriptive locator names

### 2. Waiting Strategies

```javascript
// Preferred approach
await element.waitFor({ state: "visible", timeout: 5000 });

// With network idle
await page.waitForLoadState("networkidle");
````

### 3. Error Handling

```javascript
try {
  await someAction();
} catch (error) {
  console.error("Action failed:", error);
  throw error;
}
```

### 4. Humanized Interaction

```javascript
// Type like a human
for (const char of text) {
  await element.type(char, { delay: 100 });
}
```

### 5. Test Organization

- Use numbered test files for execution order
- Group related tests together
- Keep tests independent
- Use descriptive test names

## Waits Implementation

### Types of Waits

#### 1. Explicit Waits

```javascript
// Wait for element to be visible
await page.waitForSelector("button.submit-btn", { state: "visible", timeout: 5000 });

// Wait for element to be enabled
await page.waitForSelector("input.email-field", { state: "enabled", timeout: 3000 });

// Wait for element to be hidden
await page.waitForSelector(".loading-spinner", { state: "hidden", timeout: 5000 });
```

#### 2. Network Idle Waits

```javascript
// Wait for network to be idle (no requests for 500ms)
await page.waitForLoadState('networkidle');

// Example from our framework
async navigateToListsPage() {
  try {
    await this.listNavLink.click();
    await this.testHelper.waitForNetworkIdle();
    await this.testHelper.waitForElementToBeVisible("//a[normalize-space()='New List']", 15000);
  } catch (error) {
    console.error("Failed to navigate to Lists page:", error);
    throw error;
  }
}
```

#### 3. Custom Wait Functions

```javascript
// Wait for dropdown results
await this.page.waitForFunction(
  () => {
    return document.querySelectorAll("span.form-selectable-results-item").length > 0;
  },
  null,
  { timeout: 10000 }
);
```

#### 4. Humanized Delays

```javascript
// Example from our project's listPage.js
async fillListDetails(listName, listDescription, projectName) {
  // Add delay between actions
  await this.nameInput.fill(listName);
  await this.page.waitForTimeout(300);

  // Humanized typing
  for (const char of projectName) {
    await this.projectSearchInput.type(char, { delay: 100 }); // slow typing
  }

  await this.page.waitForTimeout(1500); // let results refresh
}
```

### Wait Strategies by Component

#### 1. Form Interactions

```javascript
async fillForm() {
  // Wait for form to be ready
  await this.form.waitFor({ state: 'visible' });

  // Fill fields with delays
  await this.nameField.fill(name);
  await this.page.waitForTimeout(300);

  // Wait for validation
  await this.page.waitForSelector('.validation-message', { state: 'hidden' });
}
```

#### 2. Dropdown Handling

```javascript
// Example from our project
async handleDropdown(searchText) {
  // Wait for dropdown to be clickable
  await this.dropdown.waitFor({ state: 'visible' });
  await this.dropdown.click();

  // Wait for search input
  await this.searchInput.waitFor({ timeout: 5000 });

  // Type with human-like delays
  for (const char of searchText) {
    await this.searchInput.type(char, { delay: 100 });
  }

  // Wait for results
  await this.page.waitForFunction(
    () => document.querySelectorAll('.dropdown-item').length > 0,
    null,
    { timeout: 10000 }
  );
}
```

#### 3. Navigation Waits

```javascript
async navigateToSection() {
  await this.navLink.click();

  // Wait for multiple conditions
  await Promise.all([
    this.page.waitForURL('**/section'),
    this.page.waitForLoadState('networkidle'),
    this.page.waitForSelector('.section-content', { state: 'visible' })
  ]);
}
```

### Best Practices for Waits

1. **Dynamic Timeouts**

```javascript
// Configure based on environment
const DEFAULT_TIMEOUT = process.env.NODE_ENV === "production" ? 30000 : 10000;

// Use in waits
await element.waitFor({ timeout: DEFAULT_TIMEOUT });
```

2. **Graceful Fallbacks**

```javascript
async waitForElement(selector, timeout = 5000) {
  try {
    await this.page.waitForSelector(selector, { timeout });
  } catch (error) {
    console.warn(`Element ${selector} not found within ${timeout}ms`);
    // Implement fallback strategy
  }
}
```

3. **Combined Wait Strategies**

```javascript
async submitForm() {
  await this.submitButton.click();

  // Wait for both network and UI
  await Promise.all([
    this.page.waitForLoadState('networkidle'),
    this.page.waitForSelector('.success-message'),
    this.page.waitForSelector('.loading-indicator', { state: 'hidden' })
  ]);
}
```

### Common Wait Scenarios and Solutions

#### 1. Dynamic Content Loading

```javascript
// Wait for content to load
await page.waitForFunction(
  (expectedCount) => {
    const items = document.querySelectorAll(".list-item");
    return items.length >= expectedCount;
  },
  expectedItemCount,
  { timeout: 10000 }
);
```

#### 2. AJAX Updates

```javascript
// Wait for specific network request
await page.waitForResponse((response) => response.url().includes("/api/data") && response.status() === 200);
```

#### 3. Animation Completion

```javascript
// Wait for animation to complete
await page.waitForFunction(() => !document.querySelector(".animated").classList.contains("animating"));
```

### Debugging Wait Issues

1. **Add Logging**

```javascript
async waitWithLogging(selector, timeout) {
  console.log(`Waiting for ${selector}`);
  const startTime = Date.now();

  try {
    await this.page.waitForSelector(selector, { timeout });
    console.log(`Found ${selector} after ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error(`Failed to find ${selector} after ${Date.now() - startTime}ms`);
    throw error;
  }
}
```

2. **Visual Feedback**

```javascript
// Highlight element after wait
async highlightElement(selector) {
  await this.page.waitForSelector(selector);
  await this.page.$eval(selector, el => {
    el.style.border = '2px solid red';
    setTimeout(() => el.style.border = '', 1000);
  });
}
```

## Retry Mechanisms

### 1. Test-Level Retries

```javascript
// In playwright.config.js
module.exports = {
  retries: 2, // Retry failed tests up to 2 times
  reporter: [["html"], ["list"]],
  use: {
    trace: "retain-on-failure", // Capture trace only on failure
    screenshot: "only-on-failure", // Capture screenshots only on failure
  },
};

// Example from our tests
test(
  "Verify user can create a campaign with valid data",
  {
    retries: 1, // Override config retry for specific test
  },
  async ({ page }) => {
    // Test implementation
  }
);
```

### 2. Action-Level Retries

#### Retry in Page Objects

```javascript
// Example from our ListPage
async fillListDetails(listName, listDescription, projectName) {
  let attempts = 3;
  while (attempts > 0) {
    try {
      await this.selectProjectFromDropdown(projectName);
      break;
    } catch (error) {
      attempts--;
      if (attempts === 0) throw error;
      console.log(`Retrying project selection, ${attempts} attempts left`);
      // Close dropdown if open
      await this.page.keyboard.press("Escape").catch(() => {});
      await this.testHelper.waitForNetworkIdle();
    }
  }
}
```

#### Generic Retry Helper

```javascript
// In test.Helper.js
async retryOperation(operation, maxAttempts = 3, delay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(delay);
      }
    }
  }
  throw lastError;
}

// Usage example
async selectProjectWithRetry(projectName) {
  await this.retryOperation(
    async () => {
      await this.projectDropdown.click();
      await this.projectSearchInput.fill(projectName);
      await this.firstProjectResult.click();
    },
    3,  // maxAttempts
    1000 // delay between attempts
  );
}
```

### 3. Conditional Retries

```javascript
// Retry with condition checking
async waitForConditionWithRetry(condition, maxAttempts = 3, timeout = 5000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await this.page.waitForFunction(condition, null, {
        timeout: timeout
      });
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      console.log(`Condition check failed, attempt ${i + 1} of ${maxAttempts}`);
      await this.page.waitForTimeout(1000);
    }
  }
  return false;
}

// Usage example
await waitForConditionWithRetry(
  () => document.querySelectorAll('.list-item').length > 0
);
```

### 4. Network-Aware Retries

```javascript
// Retry based on network conditions
async submitFormWithNetworkRetry() {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await Promise.all([
        this.page.waitForResponse(
          response => response.url().includes('/api/submit') && response.status() === 200
        ),
        this.submitButton.click()
      ]);
      return;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(`Network submission failed, attempt ${attempt} of ${maxAttempts}`);
      await this.page.waitForTimeout(2000);
    }
  }
}
```

### 5. Smart Retry Strategies

```javascript
// Exponential backoff retry
async retryWithBackoff(operation, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      // Exponential backoff: 1s, 2s, 4s, etc.
      const backoffTime = Math.pow(2, attempt - 1) * 1000;
      console.log(`Retrying after ${backoffTime}ms...`);
      await this.page.waitForTimeout(backoffTime);
    }
  }
}

// Usage in tests
await retryWithBackoff(async () => {
  await page.click('.dynamic-element');
  await expect(page.locator('.result')).toBeVisible();
});
```

### 6. Retry with Recovery Actions

```javascript
// Retry with cleanup/reset between attempts
async retryWithRecovery(operation, recoveryAction, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      console.log(`Attempt ${attempt} failed, performing recovery...`);
      await recoveryAction();
      await this.page.waitForTimeout(1000);
    }
  }
}

// Example usage
await retryWithRecovery(
  async () => {
    await this.fillListDetails(listName, description, projectName);
  },
  async () => {
    // Recovery action: reset form
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }
);
```

### Best Practices for Retries

1. **Log Retry Attempts**

   - Record each retry attempt
   - Include failure reason
   - Track success after retries

2. **Configure Retry Counts**

   - Set appropriate retry limits
   - Use different limits for different operations
   - Consider environment factors

3. **Handle Cleanup**

   - Reset state between retries
   - Clear any side effects
   - Maintain test isolation

4. **Monitor Retry Patterns**
   - Track which tests need retries
   - Identify flaky tests
   - Optimize test stability

## Test Failure Handling and Screenshots

### 1. Automatic Screenshot Capture

```javascript
// In playwright.config.js
module.exports = {
  use: {
    screenshot: "only-on-failure", // Take screenshots only on failure
    trace: "retain-on-failure", // Retain trace only on failure
  },
  reporter: [
    ["html"], // HTML reporter for visual test results
    ["list"], // List reporter for console output
  ],
};
```

### 2. Custom Screenshot Implementation

```javascript
// Example from our framework's helpers.js
setupScreenshotOnFailure: (test) => {
  const screenshotDir = path.join(process.cwd(), "playwright-Failed-TC-Screenshot");

  // Create or clean screenshot directory
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  } else {
    fs.rmSync(screenshotDir, { recursive: true, force: true });
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // After each test
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      // Create safe filename from test title
      const safeTitle = testInfo.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
      const screenshotPath = path.join(screenshotDir, `${safeTitle}.png`);

      // Take full page screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`📸 Screenshot saved at ${screenshotPath}`);
    }
  });
};
```

### 3. Usage in Test Files

```javascript
// Example from our test files
const helpers = require("../utils/helpers");

// Setup screenshot capture for all tests in this file
helpers.setupScreenshotOnFailure(test);

test("Verify user can create a list", async ({ page }) => {
  try {
    // Test implementation
  } catch (error) {
    // Screenshot will be automatically captured due to failure
    throw error;
  }
});
```

### 4. Screenshot Organization

```plaintext
playwright-Failed-TC-Screenshot/
├── Verify_user_can_create_a_campaign_with_valid_data.png
├── Verify_user_can_create_a_list.png
└── ...
```

### 5. Additional Failure Artifacts

#### Trace Viewer

```javascript
// In playwright.config.js
module.exports = {
  use: {
    trace: "retain-on-failure", // Collect trace for failed tests
  },
};
```

#### Video Recording

```javascript
// In playwright.config.js
module.exports = {
  use: {
    video: "retain-on-failure", // Record video for failed tests
  },
};
```

### 6. Failure Report Structure

```plaintext
test-results/
├── 8_campaign-Verify-user-can-create-a-campaign-with-valid-data-Chromium/
│   ├── error-context.md          # Error details and context
│   ├── test-failed-1.png        # Failure screenshot
│   ├── trace.zip                # Test execution trace
│   └── video.webm               # Test execution video
└── ...
```

### 7. HTML Report Generation

```javascript
// Generate detailed HTML report
async generateTestReport() {
  const reportPath = 'playwright-report';

  // Create report directory
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }

  // Generate report with screenshots
  await playwright.report.generate({
    outputDir: reportPath,
    attachments: true,  // Include screenshots and videos
    detailed: true      // Include detailed test steps
  });
}
```

### 8. Best Practices for Failure Analysis

1. **Screenshot Naming**

   - Use descriptive test names
   - Include timestamp if needed
   - Sanitize special characters

2. **Storage Management**

   - Clean old screenshots periodically
   - Maintain organized directory structure
   - Set up automatic cleanup

3. **Report Integration**

   - Link screenshots in HTML reports
   - Include error context
   - Add test metadata

4. **Failure Documentation**
   ```javascript
   // Example of enhanced error logging
   try {
     await testAction();
   } catch (error) {
     console.error(`Test failed at ${new Date().toISOString()}`);
     console.error(`Error: ${error.message}`);
     console.error(`Page URL: ${page.url()}`);
     throw error; // Screenshot will be captured here
   }
   ```

### 9. Viewing Test Results

1. **HTML Report**

   - Open `playwright-report/index.html`
   - View test execution details
   - Access screenshots and videos

2. **Trace Viewer**

   ```bash
   npx playwright show-trace test-results/trace.zip
   ```

3. **Command Line Report**
   ```bash
   npx playwright test --reporter=list
   ```

### 10. Failure Analysis Workflow

1. **Immediate Actions**

   - Screenshot captured automatically
   - Error logged with context
   - Trace and video recorded

2. **Investigation**

   - Check screenshot for visual state
   - Review error message and stack trace
   - Analyze test execution trace
   - Watch video recording if needed

3. **Documentation**
   - All artifacts stored in organized structure
   - HTML report generated with links
   - Failure context preserved

## Common Issues and Solutions

### 1. Element Not Found

- Increase timeout values
- Check element selectors
- Verify page load completion
- Use waitForSelector with appropriate state

### 2. Test Flakiness

- Add appropriate waits
- Use networkidle where needed
- Implement retry mechanisms
- Add logging for debugging

### 3. Performance

- Use specific selectors
- Minimize unnecessary waits
- Implement parallel test execution
- Clean up test data after execution

## Contributing

1. Follow the existing code structure
2. Maintain consistent naming conventions
3. Add appropriate error handling
4. Include comments for complex logic
5. Update documentation for new features

## Support

For issues and questions, please contact the development team or create an issue in the repository.

## Video Recording

### 1. Basic Video Configuration

```javascript
// In playwright.config.js
module.exports = {
  use: {
    video: "retain-on-failure", // Record video only for failed tests
    // OR
    video: "on", // Record all tests
    // OR
    video: "off", // Disable video recording
  },
};
```

### 2. Advanced Video Settings

```javascript
// In playwright.config.js
module.exports = {
  use: {
    video: {
      mode: "retain-on-failure",
      size: { width: 1280, height: 720 }, // Video resolution
    },
    recordVideo: {
      dir: "test-results/videos/", // Custom video directory
      size: { width: 1280, height: 720 },
    },
  },
};
```

### 3. Video Output Structure

```plaintext
test-results/
├── 8_campaign-test-chromium/
│   ├── video.webm           # Test execution video
│   └── trace.zip           # Test execution trace
└── videos/                 # Custom video directory
    ├── test-1.webm
    └── test-2.webm
```

### 4. Video Recording with Retry

```javascript
// In test file
test(
  "Complex test with video",
  {
    retries: 2,
    video: "retain-on-failure",
  },
  async ({ page }) => {
    // Test implementation
  }
);
```

### 5. Video with Screenshots

```javascript
// Combined visual evidence configuration
module.exports = {
  use: {
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  reporter: [
    ["html"], // HTML reporter includes video links
    ["list"],
  ],
};
```

### 6. Video Recording Best Practices

1. **Resource Management**

   ```javascript
   // In helpers.js
   async cleanupOldRecordings() {
     const videoDir = "test-results/videos";
     const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

     const files = await fs.readdir(videoDir);
     for (const file of files) {
       const filePath = path.join(videoDir, file);
       const stats = await fs.stat(filePath);
       if (Date.now() - stats.mtime.getTime() > maxAge) {
         await fs.unlink(filePath);
       }
     }
   }
   ```

2. **Quality Settings**

   ```javascript
   module.exports = {
     use: {
       video: {
         mode: "retain-on-failure",
         size: { width: 1920, height: 1080 }, // Full HD
         quality: 90, // Higher quality (0-100)
       },
     },
   };
   ```

3. **Performance Optimization**
   ```javascript
   module.exports = {
     workers: 4, // Parallel test execution
     use: {
       video: {
         mode: "retain-on-failure",
         size: { width: 1280, height: 720 }, // Balance quality and size
       },
     },
   };
   ```

### 7. Accessing Videos in Reports

1. **HTML Report**

```javascript
// Video links automatically included in HTML report
await playwright.report.generate({
  outputDir: "playwright-report",
  attachments: true, // Include video attachments
});
```

2. **Custom Report Integration**

```javascript
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const videoPath = testInfo.outputPath("video.webm");
    console.log(`Video recording at: ${videoPath}`);

    // Add to custom report
    await customReporter.addArtifact({
      type: "video",
      path: videoPath,
      testName: testInfo.title,
    });
  }
});
```

### 8. Video Analysis Tools

1. **Frame Extraction**

```javascript
// In helpers.js
async extractFrameFromVideo(videoPath, timestamp) {
  const ffmpeg = require("fluent-ffmpeg");

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename: "frame-%s.png",
        folder: "./video-frames",
      })
      .on("end", resolve)
      .on("error", reject);
  });
}
```

2. **Video Processing**

```javascript
// Compress videos for storage
async compressVideo(videoPath) {
  const ffmpeg = require("fluent-ffmpeg");
  const outputPath = videoPath.replace(".webm", "-compressed.webm");

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions(["-crf 35"]) // Compression quality
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
```

### 9. Troubleshooting Video Recording

1. **Common Issues**

   - High disk usage
   - Performance impact
   - Missing videos
   - Corrupted recordings

2. **Solutions**

   ```javascript
   // Check video file existence
   test.afterEach(async ({}, testInfo) => {
     if (testInfo.status !== testInfo.expectedStatus) {
       const videoPath = testInfo.outputPath("video.webm");
       try {
         await fs.access(videoPath);
         console.log("Video recorded successfully");
       } catch {
         console.error("Video recording failed");
       }
     }
   });
   ```

3. **Performance Monitoring**
   ```javascript
   // Monitor resource usage
   test.beforeAll(async () => {
     const videoDir = "test-results/videos";
     const stats = await fs.stat(videoDir);
     console.log(`Current video storage: ${stats.size / 1024 / 1024}MB`);
   });
   ```
