const { TestHelper } = require("../utils/testHelper");

class InfluencerReachPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Reach tab navigation
    this.reachTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="reach"]';

    // **FIXED** - More specific selectors to target only the "Total Reach" heading
    this.reachHeading = "h3.influencer-reach-header";
    this.totalReachHeading = 'h3.influencer-reach-header:has-text("Total Reach")';

    // Page-level assertion helpers
    this.expectedHeadingText = "Total Reach";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickReachTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.reachTabLink);
      await this.testHelper.clickElement(this.reachTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerReachPage.clickReachTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerReachPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /reach path
      return url.includes("/reach");
    } catch (error) {
      console.error("InfluencerReachPage.isOnInfluencerReachPage failed:", error);
      return false;
    }
  }

  // ---------- **FIXED** Reach Page Content Verification ----------
  async getReachHeadingText() {
    try {
      // **FIX** - Use filter with text matching to target only the "Total Reach" heading
      const totalReachElement = this.page.locator(this.reachHeading).filter({ hasText: /Total Reach/ }); // Filter for text containing "Total Reach"

      await this.testHelper.waitForElementToBeVisible(totalReachElement);
      const fullText = await totalReachElement.textContent();

      // Clean up the text by removing extra characters and normalizing spaces
      return fullText.replace(/[⇆↵]/g, "").replace(/\s+/g, " ").trim();
    } catch (error) {
      console.error("InfluencerReachPage.getReachHeadingText failed:", error);
      return "";
    }
  }

  async verifyReachHeading(expectedText) {
    try {
      const actualText = await this.getReachHeadingText();
      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerReachPage.verifyReachHeading failed:", error);
      return false;
    }
  }

  async isReachHeadingVisible() {
    try {
      // **FIX** - Use filter with text matching to avoid strict mode violation
      const totalReachElement = this.page.locator(this.reachHeading).filter({ hasText: /Total Reach/ }); // Filter for text containing "Total Reach"

      return await totalReachElement.isVisible();
    } catch (error) {
      console.error("InfluencerReachPage.isReachHeadingVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerReachPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerReachPage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerReachPage };
