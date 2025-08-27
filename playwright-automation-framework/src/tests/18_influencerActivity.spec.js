const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerActivity } = require("../pages/influencerActivity");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the influencer Activity page
test("Verify that user should be able to see the influencer Activity page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerActivity = new InfluencerActivity(page);

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

    // 3. Click on the Activity tab
    await influencerActivity.clickActivityTab();

    // 4. Verify we are on the influencer activity page
    expect(await influencerActivity.isOnInfluencerActivityPage()).toBe(true);

    // 5. Verify the activity heading is visible
    expect(await influencerActivity.isActivityHeadingVisible()).toBe(true);

    // 6. Verify the activity heading text matches expected value "All Activity"
    expect(await influencerActivity.verifyActivityHeading(influencerActivity.expectedHeadingText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerActivity.getCurrentPageUrl();
    const currentTitle = await influencerActivity.getCurrentPageTitle();
    const actualHeadingText = await influencerActivity.getActivityHeadingText();
  } catch (error) {
    console.error("❌ Influencer activity page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerActivity.getCurrentPageTitle());
      console.log("Activity heading text:", await influencerActivity.getActivityHeadingText());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
