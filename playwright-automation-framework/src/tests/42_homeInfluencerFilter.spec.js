const { test, expect } = require("@playwright/test"); // Import Playwright's testing utilities

const helpers = require("../utils/helpers"); // Import helper utilities (e.g., screenshot on failure)

helpers.setupScreenshotOnFailure(test); // Setup to automatically capture screenshot on test failure

const { LoginPage } = require("../pages/loginPage"); // Import the LoginPage class
const { HomeInfluencerFilterPage } = require("../pages/homeInfluencerFilter"); // Import the HomeInfluencerFilterPage class

const loginPageData = require("../data/loginPageData.json"); // Import test data for login

// Test: User should be able to search the influencer by influencer sorting
test("Verify that user should be able to search the influencer by influencer sorting", async ({ page }) => {
  try {
    // Step 1: Initialize page objects
    const loginPage = new LoginPage(page);
    const homeInfluencerFilterPage = new HomeInfluencerFilterPage(page);

    // Step 2: Navigate to login page
    await loginPage.goto();

    // Step 3: Perform login with valid credentials
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Step 4: Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 5: Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Allow time for dynamic content to load

    // Step 6: Verify user is on home page and Interest dropdown is visible
    const isInterestDropdownVisible = await homeInfluencerFilterPage.isInterestDropdownVisible();
    expect(isInterestDropdownVisible).toBe(true);

    // Step 7: Click on the Interest dropdown
    await homeInfluencerFilterPage.clickInterestDropdown();

    // Step 8: Verify Fashion checkbox is available in suggestions
    const isFashionCheckboxVisible = await homeInfluencerFilterPage.isFashionCheckboxVisible();
    expect(isFashionCheckboxVisible).toBe(true);

    // Step 9: Select Fashion checkbox from suggestions
    await homeInfluencerFilterPage.selectFashionCheckbox();

    // Step 10: Click the Save button
    await homeInfluencerFilterPage.clickSaveButton();

    // Step 11: Verify the Interest filter heading shows "Fashion"
    await homeInfluencerFilterPage.verifyInterestFilterHeading("Fashion");
  } catch (error) {
    console.error("Test failed:", error);

    // Additional debugging
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    throw error;
  }
});
