// src/tests/dashboard.spec.js

const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
helpers.setupScreenshotOnFailure(test);

const { LoginPage } = require("../pages/loginPage");
const { DashboardPage } = require("../pages/dashboardPage");
const loginPageData = require("../data/loginPageData.json");

test("Verify that user is able to navigate to Dashboard page and see correct title", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToDashboard();

    const isTitleCorrect = await dashboardPage.verifyDashboardTitle();
    expect(isTitleCorrect).toBe(true);
  } catch (error) {
    console.error("Dashboard page navigation test failed:", error);
    throw error;
  }
});
