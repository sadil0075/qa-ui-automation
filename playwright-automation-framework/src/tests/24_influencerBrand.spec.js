const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerBrandPage } = require("../pages/influencerBrandPage");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the Brand data of the influencer
test("Verify that user should be able to see the Brand data of the influencer", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerBrandPage = new InfluencerBrandPage(page);

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

    // 3. Click on the Brand tab
    await influencerBrandPage.clickBrandTab();

    // 4. Verify we are on the influencer brand page
    expect(await influencerBrandPage.isOnInfluencerBrandPage()).toBe(true);

    // 5. Verify page content is loaded
    expect(await influencerBrandPage.isBrandPageContentLoaded()).toBe(true);

    // 6. Verify the brand column heading is visible
    expect(await influencerBrandPage.isBrandColumnHeadingVisible()).toBe(true);

    // 7. Verify the brand column heading text matches expected value "Brand"
    expect(await influencerBrandPage.verifyBrandColumnHeading(influencerBrandPage.expectedColumnHeadingText)).toBe(true);

    // 8. Verify the sorter element has correct attributes
    expect(await influencerBrandPage.verifyBrandColumnSorterAttributes()).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerBrandPage.getCurrentPageUrl();
    const currentTitle = await influencerBrandPage.getCurrentPageTitle();
    const actualHeadingText = await influencerBrandPage.getBrandColumnHeadingText();
  } catch (error) {
    console.error("❌ Influencer brand page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerBrandPage.getCurrentPageTitle());
      console.log("Brand column heading text:", await influencerBrandPage.getBrandColumnHeadingText());
      console.log("Brand page content loaded:", await influencerBrandPage.isBrandPageContentLoaded());

      // Debug: List all sorter elements and their attributes
      const sorterElements = await page.locator("span.sorter").all();
      //console.log(`Found ${sorterElements.length} sorter elements:`);
      for (let i = 0; i < sorterElements.length; i++) {
        const text = await sorterElements[i].textContent();
        const sortBy = await sorterElements[i].getAttribute("data-sort-by");
        //console.log(`  Sorter ${i + 1}: text="${text?.trim()}", data-sort-by="${sortBy}"`);
      }
    } catch (e) {
      console.log("Could not get debug information:", e.message);
    }

    throw error;
  }
});
