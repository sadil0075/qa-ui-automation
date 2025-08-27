const { TestHelper } = require("../utils/testHelper");

class InfluencerHealthPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Health tab navigation
    this.healthTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="health"]';

    // Health page heading elements - more specific selectors
    this.audienceHealthHeading = 'h3:has-text("Audience Health")';

    // Page-level assertion helpers
    this.expectedHeadingText = "Audience Health";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickHealthTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.healthTabLink);
      await this.testHelper.clickElement(this.healthTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerHealthPage.clickHealthTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerHealthPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /health path
      return url.includes("/health");
    } catch (error) {
      console.error("InfluencerHealthPage.isOnInfluencerHealthPage failed:", error);
      return false;
    }
  }

  // ---------- **FIXED** Health Page Content Verification ----------
  async getAudienceHealthHeadingText() {
    try {
      // **FIX** - Wait for page to be fully loaded first
      await this.testHelper.waitForNetworkIdle();

      // **FIX** - Use more specific targeting and handle the complex structure
      const headings = await this.page.locator("h3").all();

      for (const heading of headings) {
        const headingText = await heading.textContent();
        if (headingText && headingText.includes("Audience Health")) {
          // Extract just the "Audience Health" part by splitting on newlines and trimming
          const lines = headingText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line);
          const audienceHealthLine = lines.find((line) => line.includes("Audience Health"));
          return audienceHealthLine ? audienceHealthLine.trim() : "";
        }
      }

      return "";
    } catch (error) {
      console.error("InfluencerHealthPage.getAudienceHealthHeadingText failed:", error);
      return "";
    }
  }

  async verifyAudienceHealthHeading(expectedText) {
    try {
      const actualText = await this.getAudienceHealthHeadingText();

      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerHealthPage.verifyAudienceHealthHeading failed:", error);
      return false;
    }
  }

  async isAudienceHealthHeadingVisible() {
    try {
      // **FIX** - Wait for page to be fully loaded and check if any h3 contains "Audience Health"
      await this.testHelper.waitForNetworkIdle();

      const headings = await this.page.locator("h3").all();

      for (const heading of headings) {
        const isVisible = await heading.isVisible();
        if (isVisible) {
          const headingText = await heading.textContent();
          if (headingText && headingText.includes("Audience Health")) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("InfluencerHealthPage.isAudienceHealthHeadingVisible failed:", error);
      return false;
    }
  }

  // **NEW** - Alternative method using count-based approach
  async isHealthPageContentLoaded() {
    try {
      await this.testHelper.waitForNetworkIdle();
      const h3Count = await this.page.locator("h3").count();

      return h3Count > 0;
    } catch (error) {
      console.error("InfluencerHealthPage.isHealthPageContentLoaded failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerHealthPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerHealthPage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerHealthPage };
