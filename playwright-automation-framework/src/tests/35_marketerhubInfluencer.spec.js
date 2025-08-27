const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { CampaignPage } = require("../pages/campaignPage");
const { CampaignOverviewPage } = require("../pages/campaignOverviewPage");
const { MarketerhubInfluencerPage } = require("../pages/marketerhubInfluencerPage");
const loginPageData = require("../data/loginPageData.json");
const testData = require("../data/tempData.json");
const { TestHelper } = require("../utils/testHelper");
const helpers = require("../utils/helpers");

helpers.setupScreenshotOnFailure(test);

test("Verify that user is able to navigate to reporting page, click influencers tab and see the Influencers page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const campaignPage = new CampaignPage(page);
  const campaignOverviewPage = new CampaignOverviewPage(page);
  const marketerhubInfluencerPage = new MarketerhubInfluencerPage(page);
  const testHelper = new TestHelper(page);

  const campaignName = testData.lastCampaignName;

  try {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible({ timeout: 15000 });

    // Step 2: Navigate to Campaigns page
    await campaignPage.navigateToCampaignPage();

    // Wait for navigation to complete
    await testHelper.waitForNavigation(10000);

    // Step 3: Select campaign and land on overview page
    await campaignOverviewPage.searchAndSelectCampaign(campaignName);

    // Verify we're on campaign overview by checking for Overview section
    await expect(page.locator('span.section-item-title:has-text("Overview")')).toBeVisible({ timeout: 20000 });

    // Ensure the sidebar sections are loaded by checking count to avoid strict mode violation
    await expect(page.locator("span.section-item-title")).toHaveCount(9, { timeout: 10000 });

    // Step 4: Navigate to reporting page
    await marketerhubInfluencerPage.navigateToReportingPage();

    // Step 5: Click on the Influencers tab
    await marketerhubInfluencerPage.clickInfluencersTab();

    // Step 6: Verify the Influencers page is loaded
    const isInfluencersPageLoaded = await marketerhubInfluencerPage.verifyInfluencersPageLoaded();
    expect(isInfluencersPageLoaded).toBe(true);

    // Step 7: Verify the specific heading "Influencers"
    const isCorrectHeading = await marketerhubInfluencerPage.verifyInfluencersHeading();
    expect(isCorrectHeading).toBe(true);
  } catch (error) {
    throw error;
  }
});
