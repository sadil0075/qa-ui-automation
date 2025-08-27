const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerReachPage } = require("../pages/influencerReachPage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the Reach of the influencer
test("Verify that user should be able to see the Reach of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerReachPage = new InfluencerReachPage(page);

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

    // 3. Click on the Reach tab
    await influencerReachPage.clickReachTab();

    // 4. Verify we are on the influencer reach page
    expect(await influencerReachPage.isOnInfluencerReachPage()).toBe(true);

    // 5. Verify the reach heading is visible
    expect(await influencerReachPage.isReachHeadingVisible()).toBe(true);

    // 6. Verify the reach heading text matches expected value "Total Reach"
    expect(await influencerReachPage.verifyReachHeading(influencerReachPage.expectedHeadingText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerReachPage.getCurrentPageUrl();
    const currentTitle = await influencerReachPage.getCurrentPageTitle();
    const actualHeadingText = await influencerReachPage.getReachHeadingText();
  } catch (error) {
    console.error("❌ Influencer reach page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerReachPage.getCurrentPageTitle());
      console.log("Reach heading text:", await influencerReachPage.getReachHeadingText());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
