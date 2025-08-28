const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { Credentials } = require("../utils/credentials"); // Import the new credentials helper

test("Verify that user should be able to login with valid Email-id & Password", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    const validUser = Credentials.getValidUser(); // Get credentials from helper

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    // Verify the logo of the page is visible
    await expect(page.locator(loginPage.logo)).toBeVisible();
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
});

test("Verify that user should be able to logout from the application", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    const validUser = Credentials.getValidUser(); // Get credentials from helper

    // Step 1: User should be logged in the application
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    // Verify successful login by checking logo visibility
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Step 2: User click on the user menu and logout
    await loginPage.logout();

    // Step 3: Verify user is redirected to login page after logout
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator(loginPage.emailInput)).toBeVisible();
  } catch (error) {
    console.error("Logout test failed:", error);
    throw error;
  }
});
