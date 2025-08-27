const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerHealthPage } = require("../pages/influencerHealthPage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the Health data of the influencer
test("Verify that user should be able to see the Health data of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerHealthPage = new InfluencerHealthPage(page);

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

    // 3. Click on the Health tab
    await influencerHealthPage.clickHealthTab();

    // 4. Verify we are on the influencer health page
    expect(await influencerHealthPage.isOnInfluencerHealthPage()).toBe(true);

    // **ENHANCED** - Verify page content is loaded
    expect(await influencerHealthPage.isHealthPageContentLoaded()).toBe(true);

    // 5. Verify the audience health heading is visible
    expect(await influencerHealthPage.isAudienceHealthHeadingVisible()).toBe(true);

    // 6. Verify the audience health heading text matches expected value "Audience Health"
    expect(await influencerHealthPage.verifyAudienceHealthHeading(influencerHealthPage.expectedHeadingText)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerHealthPage.getCurrentPageUrl();
    const currentTitle = await influencerHealthPage.getCurrentPageTitle();
    const actualHeadingText = await influencerHealthPage.getAudienceHealthHeadingText();
  } catch (error) {
    console.error("❌ Influencer health page test failed:", error);

    // **ENHANCED** debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerHealthPage.getCurrentPageTitle());
      console.log("Audience Health heading text:", await influencerHealthPage.getAudienceHealthHeadingText());
      console.log("Health page content loaded:", await influencerHealthPage.isHealthPageContentLoaded());

      // Debug: List all h3 elements and their text
      const h3Elements = await page.locator("h3").all();

      for (let i = 0; i < h3Elements.length; i++) {
        const text = await h3Elements[i].textContent();
        console.log(`  H3 ${i + 1}: "${text?.substring(0, 100)}..."`);
      }
    } catch (e) {
      console.log("Could not get debug information:", e.message);
    }

    throw error;
  }
});
