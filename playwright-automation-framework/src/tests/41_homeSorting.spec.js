const { test, expect } = require("@playwright/test"); // Import Playwright's testing utilities

const helpers = require("../utils/helpers"); // Import helper utilities (e.g., screenshot on failure)

helpers.setupScreenshotOnFailure(test); // Setup to automatically capture screenshot on test failure

const { LoginPage } = require("../pages/loginPage"); // Import the LoginPage class
const { HomeSortingPage } = require("../pages/homeSorting"); // Import the HomeSortingPage class

const loginPageData = require("../data/loginPageData.json"); // Import test data for login

// Test: User should be able to search the influencer by sorting
test("Verify that user should be able to search the influencer by sorting", async ({ page }) => {
  try {
    // Step 1: Initialize page objects
    const loginPage = new LoginPage(page);
    const homeSortingPage = new HomeSortingPage(page);

    // Step 2: Navigate to login page
    await loginPage.goto();

    // Step 3: Perform login with valid credentials
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Step 4: Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 5: Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Allow time for dynamic content to load

    // Step 6: Verify user is on home page and Sort by dropdown is visible
    const isSortByVisible = await homeSortingPage.isSortByDropdownVisible();
    expect(isSortByVisible).toBe(true);

    // Step 7: Click on the Sort by dropdown
    await homeSortingPage.clickSortByDropdown();

    // Step 8: Verify Reach option is available
    const isReachOptionVisible = await homeSortingPage.isReachOptionVisible();
    expect(isReachOptionVisible).toBe(true);

    // Step 9: Select Reach option from the dropdown
    await homeSortingPage.selectReachOption();

    // Step 10: Verify the Sort by value changes to "Reach"
    await homeSortingPage.verifySortByValue("Reach");
  } catch (error) {
    console.error("Test failed:", error);

    // Additional debugging
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    throw error;
  }
});
