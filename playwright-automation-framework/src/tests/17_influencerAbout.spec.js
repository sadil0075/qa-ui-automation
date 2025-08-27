const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
const { LoginPage } = require("../pages/loginPage");
const { SearchPage } = require("../pages/searchPage");
const { InfluencerAbout } = require("../pages/influencerAbout");

const loginPageData = require("../data/loginPageData.json");
const searchData = require("../data/searchData.json");

helpers.setupScreenshotOnFailure(test);

// ✅ Test: Verify that user should be able to see the influencer about page
test("Verify that user should be able to see the influencer about page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const influencerAbout = new InfluencerAbout(page);

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

    // 3. Click on the About tab
    await influencerAbout.clickAboutTab();

    // 4. Verify we are on the influencer about page
    expect(await influencerAbout.isOnInfluencerAboutPage()).toBe(true);

    // 5. **FIXED** - Verify general information is visible using specific selector
    expect(await influencerAbout.isGeneralInformationVisible()).toBe(true);

    // 6. Verify the influencer name is visible in general information
    expect(await influencerAbout.isInfluencerNameVisible()).toBe(true);

    // 7. Verify the influencer name matches expected value
    expect(await influencerAbout.verifyInfluencerNameOnPage(searchData.searchQueries.influencerName)).toBe(true);

    // Additional logging for debugging
    const currentUrl = await influencerAbout.getCurrentPageUrl();
    const currentTitle = await influencerAbout.getCurrentPageTitle();
    const actualName = await influencerAbout.getInfluencerNameFromPage();
  } catch (error) {
    console.error("❌ Influencer about page test failed:", error);

    // Enhanced debug information
    console.log("=== DEBUG INFORMATION ===");
    console.log("Current URL:", page.url());

    try {
      console.log("Current title:", await influencerAbout.getCurrentPageTitle());

      // **NEW** - Debug information for containers
      const containerCount = await page.locator("span.block.influencer-component-container").count();
      console.log(`Found ${containerCount} information containers`);

      // Try alternative verification method
      console.log("Alternative verification:", await influencerAbout.isFirstInformationContainerVisible());
    } catch (e) {
      console.log("Could not get debug information");
    }

    throw error;
  }
});
