const { test, expect } = require("@playwright/test"); // Import Playwright's testing utilities

const helpers = require("../utils/helpers"); // Import helper utilities (e.g., screenshot on failure)

//helpers.setupScreenshotOnFailure(test); // Setup to automatically capture screenshot on test failure

const { LoginPage } = require("../pages/loginPage"); // Import the LoginPage class to interact with the login UI

const loginPageData = require("../data/loginPageData.json"); // Import test data for login

// Test: User should be able to log in with valid credentials
test("Verify that user should be able to login with valid Email-id & Password", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Verify the logo of the page is visible
    await expect(page.locator(loginPage.logo)).toBeVisible();
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
});

// Test: User should be able to logout from the application
test("Verify that user should be able to logout from the application", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);

    // Step 1: User should be logged in the application
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 2: User click on the user menu and logout
    await loginPage.logout();

    // Step 3: Verify user is redirected to login page after logout
    await expect(page).toHaveURL(/\/login/);

    // Optional: Verify that login form is visible (confirming logout was successful)
    await expect(page.locator(loginPage.emailInput)).toBeVisible();
  } catch (error) {
    console.error("Logout test failed:", error);
    throw error;
  }
});
