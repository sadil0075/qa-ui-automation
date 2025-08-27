const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { CustomTagsPage } = require("../pages/customTagsPage");

const loginPageData = require("../data/loginPageData.json");
const customTagsData = require("../data/customTagsData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify navigation to Custom Tags page and see correct title
test("Verify that user is able to navigate to custom tag page and see correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const customTagsPage = new CustomTagsPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  // 3. Open Custom Tags page and verify title
  await customTagsPage.openCustomTagsPage();
  expect(await customTagsPage.isOnCustomTagsPage()).toBe(true);
});

// ✅ Test 2: Verify that user can create a new tag
test("Verify that user should be able to create the tag", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const customTagsPage = new CustomTagsPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account → Custom Tags
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  await customTagsPage.openCustomTagsPage();
  expect(await customTagsPage.isOnCustomTagsPage()).toBe(true);

  // 3. Click Add a Tag button to open modal
  await customTagsPage.clickAddTagButton();
  expect(await customTagsPage.isModalOpen()).toBe(true);

  // 4. Generate random tag name using helper method
  const randomNumber = helpers.generateRandomString(5);
  const tagName = `Automation_tag_${randomNumber}`;

  // 5. Fill tag details and create tag
  await customTagsPage.createTag(tagName, customTagsData.tagDetails.description);

  // 6. Verify the title of the page after tag creation
  expect(await customTagsPage.isOnTagCreatedSuccessPage()).toBe(true);
});
