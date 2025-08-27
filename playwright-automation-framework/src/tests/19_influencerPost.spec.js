const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerPost } = require("../pages/influencerPost");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the influencer post page
test("Verify that user should be able to see the influencer post page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerPost = new InfluencerPost(page);

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

    // 3. Click on the Posts tab
    await influencerPost.clickPostsTab();

    // 4. Verify we are on the influencer posts page
    expect(await influencerPost.isOnInfluencerPostsPage()).toBe(true);

    // 5. Verify the search placeholder is visible
    expect(await influencerPost.isSearchPlaceholderVisible()).toBe(true);

    // 6. Verify the search placeholder text matches expected value "Search for posts…"
    expect(await influencerPost.verifySearchPlaceholder(influencerPost.expectedPlaceholderText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerPost.getCurrentPageUrl();
    const currentTitle = await influencerPost.getCurrentPageTitle();
    const actualPlaceholderText = await influencerPost.getSearchPlaceholderText();
  } catch (error) {
    console.error("❌ Influencer posts page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerPost.getCurrentPageTitle());
      console.log("Search placeholder text:", await influencerPost.getSearchPlaceholderText());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
