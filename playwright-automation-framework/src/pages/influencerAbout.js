const { TestHelper } = require("../utils/testHelper");

class InfluencerAbout {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // About tab navigation
    this.aboutTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="about"]';

    // **FIXED** - Use exact text matching to avoid strict mode violations
    this.influencerNameElement = "span.influencer-component-container-row-value";

    // Use specific selector to target the general information container
    this.generalInformationContainer = 'span.block.influencer-component-container:has-text("Real Name")';

    // Page-level assertion helpers
    this.expectedInfluencerName = "Selena Gomez";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickAboutTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.aboutTabLink);
      await this.testHelper.clickElement(this.aboutTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerAbout.clickAboutTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerAboutPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /about path
      return url.includes("/about");
    } catch (error) {
      console.error("InfluencerAbout.isOnInfluencerAboutPage failed:", error);
      return false;
    }
  }

  // ---------- **FIXED** Information Verification ----------
  async getInfluencerNameFromPage() {
    try {
      // **FIX** - Use filter with exact text matching to target only "Selena Gomez"
      const exactNameElement = this.page.locator(this.influencerNameElement).filter({ hasText: /^Selena Gomez$/ }); // Exact match using regex

      await this.testHelper.waitForElementToBeVisible(exactNameElement);
      return await exactNameElement.textContent();
    } catch (error) {
      console.error("InfluencerAbout.getInfluencerNameFromPage failed:", error);
      return "";
    }
  }

  async verifyInfluencerNameOnPage(expectedName) {
    try {
      const actualName = await this.getInfluencerNameFromPage();
      return actualName.trim() === expectedName;
    } catch (error) {
      console.error("InfluencerAbout.verifyInfluencerNameOnPage failed:", error);
      return false;
    }
  }

  async isInfluencerNameVisible() {
    try {
      // **FIX** - Use filter with exact text matching to avoid strict mode violation
      const exactNameElement = this.page.locator(this.influencerNameElement).filter({ hasText: /^Selena Gomez$/ }); // Exact match using regex

      return await exactNameElement.isVisible();
    } catch (error) {
      console.error("InfluencerAbout.isInfluencerNameVisible failed:", error);
      return false;
    }
  }

  async isGeneralInformationVisible() {
    try {
      // Target the specific general information container that contains "Real Name"
      await this.testHelper.waitForElementToBeVisible(this.generalInformationContainer);
      return await this.page.isVisible(this.generalInformationContainer);
    } catch (error) {
      console.error("InfluencerAbout.isGeneralInformationVisible failed:", error);
      return false;
    }
  }

  // **NEW** - Alternative method using first() to get the first container
  async isFirstInformationContainerVisible() {
    try {
      // Use count to check if any containers exist, then target the first one
      const containerCount = await this.page.locator("span.block.influencer-component-container").count();
      if (containerCount > 0) {
        const firstContainer = this.page.locator("span.block.influencer-component-container").first();
        return await firstContainer.isVisible();
      }
      return false;
    } catch (error) {
      console.error("InfluencerAbout.isFirstInformationContainerVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerAbout.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerAbout.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerAbout };
