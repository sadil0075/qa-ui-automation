const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");

const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { PreferencesPage } = require("../pages/preferencesPage");

const loginData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify navigation to Preferences page and see correct title
test("Verify that user is able to navigate to preference page and see correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const preferencesPage = new PreferencesPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(loginData.validUser.email, loginData.validUser.password);

  // Navigate to Manage Account → Preferences
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  await preferencesPage.openPreferencesPage();
  expect(await preferencesPage.isOnPreferencesPage()).toBe(true);
});

// ✅ Test 2: Verify that user can change preference settings
test("Verify that user should be able to change the preference setting", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const preferencesPage = new PreferencesPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(loginData.validUser.email, loginData.validUser.password);

  // Navigate to Manage Account → Preferences
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  await preferencesPage.openPreferencesPage();
  expect(await preferencesPage.isOnPreferencesPage()).toBe(true);

  // Get project name from tempData.json
  const projectName = helpers.getTempValue("projectName");
  if (!projectName) throw new Error("projectName not found in tempData.json");

  // Select project and save
  await preferencesPage.selectProjectFromDropdown(projectName);
  await preferencesPage.savePreferences();

  // Verify success toast
  expect(await preferencesPage.isSuccessToastVisible()).toBe(true);
  expect(await preferencesPage.isCorrectSuccessMessage()).toBe(true);
});
