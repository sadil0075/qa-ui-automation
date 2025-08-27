const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { GroupsPage } = require("../pages/groupsPage");

const loginPageData = require("../data/loginPageData.json");
const groupData = require("../data/groupData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test 1: Verify the title of the Groups page
test("Verify that user can navigate to the Groups page and see the correct title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const groupsPage = new GroupsPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

  // 3. Open Groups page and verify title
  await groupsPage.openGroupsPage();
  expect(await groupsPage.isOnGroupsPage()).toBe(true);
});

// ✅ Test 2: Verify that user can create a new group
test("Verify that user can create a new group from the Groups page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const manageAccountPage = new ManageAccountPage(page);
  const groupsPage = new GroupsPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

  // 2. Navigate to Manage Account → Groups
  await manageAccountPage.openUserMenu();
  await manageAccountPage.clickManageAccount();
  await groupsPage.openGroupsPage();
  expect(await groupsPage.isOnGroupsPage()).toBe(true);

  // 3. Click Create New Group button
  await groupsPage.clickCreateNewGroup();
  expect(await groupsPage.isOnCreateGroupPage()).toBe(true);

  // 4. Fill group details and create group
  const timestampedName = `${groupData.groupDetails.name} ${Date.now()}`;
  await groupsPage.createGroup(timestampedName, groupData.groupDetails.description);

  // 5. Verify the title of the page after group creation
  expect(await groupsPage.isOnGroupCreatedSuccessPage()).toBe(true);

  // 6. **SIMPLIFIED** - Verify successful group creation by page navigation
  expect(await groupsPage.isGroupCreatedSuccessfully()).toBe(true);
});
