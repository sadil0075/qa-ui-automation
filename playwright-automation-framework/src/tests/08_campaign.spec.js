const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/loginPage");
const { CampaignPage } = require("../pages/campaignPage");
const helpers = require("../utils/helpers");
const loginPageData = require("../data/loginPageData.json");

helpers.setupScreenshotOnFailure(test);

test("Verify user can navigate to Campaign page and see correct title", async ({ page }) => {
  try {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Navigate to Campaign page
    const campaignPage = new CampaignPage(page);
    await campaignPage.navigateToCampaignPage();
    expect(await campaignPage.verifyCampaignTitle()).toBe(true);
  } catch (error) {
    console.error("Campaign Page Navigation Test Failed:", error);
    throw error;
  }
});

test("Verify user can create a campaign with valid data", async ({ page }) => {
  // Increase test timeout
  test.setTimeout(120000);

  try {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    // Navigate to Campaign page
    const campaignPage = new CampaignPage(page);
    await campaignPage.navigateToCampaignPage();
    expect(await campaignPage.verifyCampaignTitle()).toBe(true);

    // Create new campaign with retries
    let maxRetries = 3;
    let lastError = null;

    // This will be defined before the loop, so we can store in tempData at the right place
    let campaignName = "";

    while (maxRetries > 0) {
      try {
        // Click new campaign button
        await campaignPage.clickNewCampaignButton();

        // Generate unique campaign name each retry
        campaignName = `Campaign_${helpers.generateRandomString(5)}_${Date.now()}`;
        const projectName = helpers.getTempValue("projectName") || "Project_Automation_ak2Fk";

        // Fill campaign form
        await campaignPage.fillCampaignForm(campaignName, 1000, "#automation", projectName);

        // Submit form
        await campaignPage.submitCampaignForm();

        // Verify campaign creation
        expect(await campaignPage.verifyCampaignTitle()).toBe(true);

        // Save campaign name in tempData.json
        helpers.saveTempValue("lastCampaignName", campaignName);

        // If we get here, test passed
        break;
      } catch (error) {
        lastError = error;
        maxRetries--;

        if (maxRetries === 0) {
          console.error("Campaign Creation Test Failed after all retries:", error);
          throw error;
        }

        console.log(`Retrying campaign creation, ${maxRetries} attempts left`);

        try {
          // Try to recover the page state
          await page.reload();
          await campaignPage.navigateToCampaignPage();
          await campaignPage.verifyCampaignTitle();
        } catch (recoveryError) {
          console.log("Failed to recover page state, will retry anyway");
        }
      }
    }
  } catch (error) {
    console.error("Campaign Creation Test Failed:", error);
    throw error;
  }
});
