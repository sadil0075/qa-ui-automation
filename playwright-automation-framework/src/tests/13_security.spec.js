const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { SecurityPage } = require("../pages/securityPage");

const loginPageData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify navigation to Security page and see correct title
test("Verify that user is able to navigate to security page and see correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const securityPage = new SecurityPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  // 3. Open Security page and verify title
  await securityPage.openSecurityPage();
  expect(await securityPage.isOnSecurityPage()).toBe(true);

  // 4. Verify the exact title format

  expect(await securityPage.hasCorrectTitle()).toBe(true);
});
