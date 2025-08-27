const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
helpers.setupScreenshotOnFailure(test);
const { LoginPage } = require("../pages/loginPage");
const { ListPage } = require("../pages/listPage");
const loginPageData = require("../data/loginPageData.json");

// ✅ Test 1: Navigation and Title Check
test("Verify the user is able to navigate to the List page and see correct title", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    const listPage = new ListPage(page);
    await listPage.navigateToListsPage();

    const title = await page.title();
    expect(title).toBe("My Lists | Julius");
  } catch (error) {
    console.error("Navigation to list page test failed:", error);
    throw error;
  }
});

// ✅ Test 2: List Creation (Fixed)
test("Verify the user should be able to create the List by giving List Name, Description, project", async ({ page }) => {
  test.slow(); // Increase timeouts for this test

  try {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Verify login success
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // 2. Navigate to Lists page
    const listPage = new ListPage(page);
    await listPage.navigateToListsPage();
    await page.waitForLoadState("domcontentloaded"); // 🔧 Changed from "networkidle"

    // 3. Click New List button
    await listPage.clickNewListButton();

    // 4. Generate list name and get project name
    const listName = helpers.createListName();
    const projectName = helpers.getTempValue("projectName");

    if (!projectName) {
      throw new Error("Project name not found in tempData.json");
    }

    // 5. Fill list details
    await page.waitForLoadState("domcontentloaded");
    await listPage.fillListDetails(listName, "Automation_list", projectName);

    // 6. Submit list (submitList already handles all necessary waits)
    await listPage.submitList(listName);

    // 7. 🔧 FIXED: Removed redundant waitForLoadState and added timeout
    await page.waitForTimeout(2000); // Brief pause for UI to stabilize

    const isTitleCorrect = await listPage.verifyListCreated(listName);
    expect(isTitleCorrect, `List title should contain "${listName}"`).toBe(true);
  } catch (error) {
    console.error("List creation test failed with error:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
});
