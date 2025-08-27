const { test, expect } = require("@playwright/test");

const helpers = require("../utils/helpers");

helpers.setupScreenshotOnFailure(test);

const { LoginPage } = require("../pages/loginPage");

const { ManageAccountPage } = require("../pages/manageAccountPage");

const loginPageData = require("../data/loginPageData.json");

const personalData = require("../data/personalData.json");

// ✅ Test 1: Verify navigation to Manage Account page

test("Verify that user should be able to navigate to the Manage Account page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  await expect(page.locator(loginPage.logo)).toBeVisible();

  const manageAccountPage = new ManageAccountPage(page);

  await manageAccountPage.openUserMenu();

  await manageAccountPage.clickManageAccount();

  const isOnSettingsPage = await manageAccountPage.isOnManageAccountPage();

  expect(isOnSettingsPage).toBe(true);
});

// ✅ Test 2: Verify updating profile details

test("Verify that user should be able to update profile details on Manage Account page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  const manageAccountPage = new ManageAccountPage(page);

  await manageAccountPage.openUserMenu();

  await manageAccountPage.clickManageAccount();

  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  const { firstName, lastName, jobTitle } = personalData.profileDetails;

  await manageAccountPage.updateProfile(firstName, lastName, jobTitle);

  expect(await manageAccountPage.isProfileUpdateSuccessMessageVisible()).toBe(true);
});

// ✅ Test 3: Verify that user is able to see the amplify page

test("Verify that user is able to see the amplify page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  await expect(page.locator(loginPage.logo)).toBeVisible();

  const manageAccountPage = new ManageAccountPage(page);

  await manageAccountPage.openUserMenu();

  await manageAccountPage.clickAmplifyDashboard();

  const amplifyPageTitle = await manageAccountPage.navigateToAmplifyPageAndVerifyTitle();

  expect(amplifyPageTitle).toBe("Log In");
});
