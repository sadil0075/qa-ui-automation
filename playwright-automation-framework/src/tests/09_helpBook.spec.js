const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { TestHelper } = require("../utils/testHelper");
const helpers = require("../utils/helpers");
const loginPageData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify Help Book modal opens and contains correct text
test("Verify that user is able to open the Help Book and see related help content", async ({ page }) => {
  try {
    const testHelper = new TestHelper(page);

    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // Step 2: Click on the Help Book (Help icon in header)
    await testHelper.clickElement("span.header-help-trigger");

    // Step 3: Verify modal with header
    await testHelper.waitForElementToBeVisible("h3:has-text('Related Help Articles')");
    const helpModalHeader = page.locator("h3", { hasText: "Related Help Articles" });
    await expect(helpModalHeader).toBeVisible();
  } catch (error) {
    console.error("Help Book test failed:", error);
    throw error;
  }
});
