const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { EcommercePage } = require("../pages/ecommercePage");

const loginPageData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify navigation to E-commerce page and see correct title
test("Verify that user is able to navigate to E-commerce page and see correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const ecommercePage = new EcommercePage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  // 3. Open E-commerce page and verify title
  await ecommercePage.openEcommercePage();
  expect(await ecommercePage.isOnEcommercePage()).toBe(true);

  // 4. Verify the exact title format

  expect(await ecommercePage.hasCorrectTitle()).toBe(true);
});
