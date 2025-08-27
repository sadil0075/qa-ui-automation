const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerAudiencePage } = require("../pages/influencerAudiencePage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the Audience data of the influencer
test("Verify that user should be able to see the Audience data of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerAudiencePage = new InfluencerAudiencePage(page);

  try {
    // 1. Login
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    // 2. Search for "Selena Gomez" and click on it
    await searchPage.searchForInfluencer(searchData.searchQueries.influencerName);

    // Verify search results are displayed
    expect(await searchPage.isSearchDropdownVisible()).toBe(true);
    expect(await searchPage.isInfluencerResultVisible(searchData.searchQueries.influencerName)).toBe(true);

    // Click on influencer result to navigate to profile page
    await searchPage.clickInfluencerResult(searchData.searchQueries.influencerName);
    expect(await searchPage.isOnInfluencerProfilePage(searchData.searchQueries.influencerName)).toBe(true);

    // 3. Click on the Audience tab
    await influencerAudiencePage.clickAudienceTab();

    // 4. Verify we are on the influencer audience page
    expect(await influencerAudiencePage.isOnInfluencerAudiencePage()).toBe(true);

    // 5. Verify the demographics heading is visible
    expect(await influencerAudiencePage.isDemographicsHeadingVisible()).toBe(true);

    // 6. Verify the demographics heading text matches expected value "Demographics"
    expect(await influencerAudiencePage.verifyDemographicsHeading(influencerAudiencePage.expectedHeadingText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerAudiencePage.getCurrentPageUrl();
    const currentTitle = await influencerAudiencePage.getCurrentPageTitle();
    const actualHeadingText = await influencerAudiencePage.getDemographicsHeadingText();
  } catch (error) {
    console.error("❌ Influencer audience page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerAudiencePage.getCurrentPageTitle());
      console.log("Demographics heading text:", await influencerAudiencePage.getDemographicsHeadingText());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
