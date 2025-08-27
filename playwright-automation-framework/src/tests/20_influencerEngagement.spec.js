const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerEngagementPage } = require("../pages/influencerEngagementPage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the engagement of the influencer
test("Verify that user should be able to see the engagement of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerEngagementPage = new InfluencerEngagementPage(page);

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

    // 3. Click on the Engagement tab
    await influencerEngagementPage.clickEngagementTab();

    // 4. Verify we are on the influencer engagement page
    expect(await influencerEngagementPage.isOnInfluencerEngagementPage()).toBe(true);

    // 5. Verify the engagement heading is visible
    expect(await influencerEngagementPage.isEngagementHeadingVisible()).toBe(true);

    // 6. Verify the "Organic" strong text is visible within the heading
    expect(await influencerEngagementPage.isOrganicTextVisible()).toBe(true);

    // 7. Verify the complete heading text matches expected value "Most Engaging Organic Posts"
    expect(await influencerEngagementPage.verifyEngagementHeading(influencerEngagementPage.expectedHeadingText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerEngagementPage.getCurrentPageUrl();
    const currentTitle = await influencerEngagementPage.getCurrentPageTitle();
    const actualHeadingText = await influencerEngagementPage.getEngagementHeadingText();
  } catch (error) {
    console.error("❌ Influencer engagement page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerEngagementPage.getCurrentPageTitle());
      console.log("Engagement heading text:", await influencerEngagementPage.getEngagementHeadingText());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
