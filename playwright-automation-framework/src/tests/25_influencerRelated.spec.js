const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerRelatedPage } = require("../pages/influencerRelatedPage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the Related data of the influencer
test("Verify that user should be able to see the Related data of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerRelatedPage = new InfluencerRelatedPage(page);

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

    // 3. Click on the Related tab
    await influencerRelatedPage.clickRelatedTab();

    // 4. Verify we are on the influencer related page
    expect(await influencerRelatedPage.isOnInfluencerRelatedPage()).toBe(true);

    // 5. Verify page content is loaded
    expect(await influencerRelatedPage.isRelatedPageContentLoaded()).toBe(true);

    // 6. Verify the similar influencers heading is visible
    expect(await influencerRelatedPage.isSimilarInfluencersHeadingVisible()).toBe(true);

    // 7. Verify the similar influencers heading text matches expected value "Similar Influencers"
    expect(await influencerRelatedPage.verifySimilarInfluencersHeading(influencerRelatedPage.expectedHeadingText)).toBe(true);

    // 8. Verify the help element is present within the heading
    expect(await influencerRelatedPage.isHelpElementVisible()).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerRelatedPage.getCurrentPageUrl();
    const currentTitle = await influencerRelatedPage.getCurrentPageTitle();
    const actualHeadingText = await influencerRelatedPage.getSimilarInfluencersHeadingText();
  } catch (error) {
    console.error("❌ Influencer related page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerRelatedPage.getCurrentPageTitle());
      console.log("Similar Influencers heading text:", await influencerRelatedPage.getSimilarInfluencersHeadingText());
      console.log("Related page content loaded:", await influencerRelatedPage.isRelatedPageContentLoaded());

      // Debug: List all h3 elements and their text
      const h3Elements = await page.locator("h3").all();
      //console.log(`Found ${h3Elements.length} h3 elements:`);
      for (let i = 0; i < h3Elements.length; i++) {
        const text = await h3Elements[i].textContent();
        //console.log(`  H3 ${i + 1}: "${text?.substring(0, 100)}..."`);
      }

      // Debug: Check for Related tab element
      const relatedTabs = await page.locator('a:has-text("Related")').all();
      //console.log(`Found ${relatedTabs.length} Related tab elements`);
    } catch (e) {
      console.log("Could not get debug information:", e.message);
    }

    throw error;
  }
});
