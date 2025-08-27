const { test, expect } = require("@playwright/test"); // Import Playwright's testing utilities

const helpers = require("../utils/helpers"); // Import helper utilities (e.g., screenshot on failure)

helpers.setupScreenshotOnFailure(test); // Setup to automatically capture screenshot on test failure

const { LoginPage } = require("../pages/loginPage"); // Import the LoginPage class
const { HomeAudienceFilterPage } = require("../pages/homeAudienceFilter"); // Import the HomeAudienceFilterPage class

const loginPageData = require("../data/loginPageData.json"); // Import test data for login

// Test: User should be able to search influencers by filtering the platform audience filter
test("Verify that user should be able to search the influencer by filtering the platform audience filter", async ({ page }) => {
  try {
    // Step 1: Log in to the application
    const loginPage = new LoginPage(page);
    const homeAudienceFilterPage = new HomeAudienceFilterPage(page);

    // Navigate to login page and perform login
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 2: Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Allow time for dynamic content to load

    // Step 3: Verify user is on home page and platform filter is visible
    const isPlatformFilterVisible = await homeAudienceFilterPage.isPlatformFilterVisible();
    expect(isPlatformFilterVisible).toBe(true);

    // Step 4: Click on the platform filter
    await homeAudienceFilterPage.clickPlatformFilter();

    // Step 5: Select Instagram platform option
    await homeAudienceFilterPage.selectInstagramPlatform();

    // Step 6: Save the filter selection
    await homeAudienceFilterPage.saveFilter();

    // Step 7: Close the filter dropdown if it's still open
    await homeAudienceFilterPage.closeFilterDropdown();

    // Step 8: Verify the audience filter heading shows "Instagram"
    await homeAudienceFilterPage.verifyPlatformFilterValue("Instagram");
  } catch (error) {
    console.error("Test failed:", error);

    // Additional debugging
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    throw error;
  }
});
