const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { CampaignPage } = require("../pages/campaignPage");
const { CampaignOverviewPage } = require("../pages/campaignOverviewPage");
const { CampaignDocumentsPage } = require("../pages/campaignDocumentsPage");
const loginPageData = require("../data/loginPageData.json");
const testData = require("../data/tempData.json");
const { TestHelper } = require("../utils/testHelper");
const helpers = require("../utils/helpers");

helpers.setupScreenshotOnFailure(test);

test("Verify that user is able to navigate to campaign documents page and see the document details", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const campaignPage = new CampaignPage(page);
  const campaignOverviewPage = new CampaignOverviewPage(page);
  const campaignDocumentsPage = new CampaignDocumentsPage(page);
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

    // Step 4: Navigate to campaign documents section
    await campaignDocumentsPage.navigateToDocumentsSection();

    // Step 5: Verify the Campaign Documents page
    const isDocumentsPageLoaded = await campaignDocumentsPage.verifyDocumentsPageLoaded();
    expect(isDocumentsPageLoaded).toBe(true);
  } catch (error) {
    throw error;
  }
});
