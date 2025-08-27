const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { SharesPage } = require("../pages/sharesPage");

const loginPageData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify navigation to Shares page and see correct title
test("Verify that user is able to navigate to shares page and see correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const sharesPage = new SharesPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  // 3. Open Shares page and verify title
  await sharesPage.openSharesPage();
  expect(await sharesPage.isOnSharesPage()).toBe(true);

  // 4. Verify the exact title format

  expect(await sharesPage.hasCorrectTitle()).toBe(true);
});
