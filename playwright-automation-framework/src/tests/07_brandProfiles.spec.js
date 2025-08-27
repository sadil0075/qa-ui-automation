const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { BrandProfilesPage } = require("../pages/brandProfilesPage");
const loginPageData = require("../data/loginPageData.json");
const helpers = require("../utils/helpers");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Navigate to Brand Profiles and verify title
test("Verify user can navigate to Brand Profiles page and see correct title", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    const brandProfilesPage = new BrandProfilesPage(page);
    await brandProfilesPage.navigateToBrandProfiles();

    const title = await brandProfilesPage.getPageTitle();
    expect(title).toBe("Brand Profiles | Julius");
  } catch (error) {
    console.error("Brand Profiles navigation test failed:", error);
    throw error;
  }
});
