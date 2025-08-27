const { test, expect } = require("@playwright/test"); // Import Playwright's testing utilities

const helpers = require("../utils/helpers"); // Import helper utilities (e.g., screenshot on failure)

helpers.setupScreenshotOnFailure(test); // Setup to automatically capture screenshot on test failure

const { LoginPage } = require("../pages/loginPage"); // Import the LoginPage class
const { HomeSocialReachEngagementFilterPage } = require("../pages/homeSocialReachEngagementFilter"); // Import the HomeSocialReachEngagementFilterPage class

const loginPageData = require("../data/loginPageData.json"); // Import test data for login
const reachAverageEngagementData = require("../data/reachAverageEngagementData.json"); // Import test data

// Test: User should be able to search influencers by filtering the platform Social Reach & Engagement filter
test("Verify that user should be able to search the influencer by filtering the platform Social Reach & Engagement filter", async ({ page }) => {
  try {
    // Step 1: Initialize page objects
    const loginPage = new LoginPage(page);
    const homeFilterPage = new HomeSocialReachEngagementFilterPage(page);

    // Step 2: Navigate to login page
    await loginPage.goto();

    // Step 3: Perform login with valid credentials
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Step 4: Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 5: Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Allow time for dynamic content to load

    // Step 6: Verify user is on home page and Overall filter is visible
    const isOverallFilterVisible = await homeFilterPage.isOverallFilterVisible();
    expect(isOverallFilterVisible).toBe(true);

    // Step 7: Click on the Overall filter under Social Reach & Engagement
    await homeFilterPage.clickOverallFilter();

    // Step 8: Enable the reach toggle
    await homeFilterPage.toggleReach(true);

    // Step 9: Set reach minimum value from data file
    await homeFilterPage.setReachMinValue(reachAverageEngagementData.filter.reachMin);

    // Step 10: Enable the Average Engagement toggle
    await homeFilterPage.toggleEngagement(true);

    // Step 11: Set engagement minimum value from data file
    await homeFilterPage.setEngagementMinValue(reachAverageEngagementData.filter.engagementMin);

    // Step 12: Save the filter selection
    await homeFilterPage.saveFilter();

    // Step 13: Verify the Overall heading shows the correct values dynamically
    await homeFilterPage.verifyOverallFilterValue(reachAverageEngagementData.filter.reachMin, reachAverageEngagementData.filter.engagementMin);
  } catch (error) {
    console.error("Test failed:", error);

    // Additional debugging
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    throw error;
  }
});
