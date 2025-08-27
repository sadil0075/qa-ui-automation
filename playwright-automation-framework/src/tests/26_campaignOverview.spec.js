const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { CampaignPage } = require("../pages/campaignPage");
const { CampaignOverviewPage } = require("../pages/campaignOverviewPage");
const loginPageData = require("../data/loginPageData.json");
const testData = require("../data/tempData.json");
const { TestHelper } = require("../utils/testHelper");
const helpers = require("../utils/helpers");

helpers.setupScreenshotOnFailure(test);

test("Verify that user is able to navigate to campaign overview page and see the details", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const campaignPage = new CampaignPage(page);
  const campaignOverviewPage = new CampaignOverviewPage(page);
  const testHelper = new TestHelper(page);

  const campaignName = testData.lastCampaignName;

  try {
    // 1. Login
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // 2. Navigate to Campaigns page
    await campaignPage.navigateToCampaignPage();

    // 3. Search for and select campaign by name from testData.json
    await campaignOverviewPage.searchAndSelectCampaign(campaignName);

    // 4. Verify the title of campaign details/overview page
    expect(await campaignOverviewPage.verifyTitleIsCampaignDetail(campaignName)).toBe(true);

    // Logs for reporting
  } catch (error) {
    console.error("❌ Campaign Overview Test failed:", error);
    throw error;
  }
});
