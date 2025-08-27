const { TestHelper } = require("../utils/testHelper");

class InfluencerEngagementPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Engagement tab navigation
    this.engagementTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="engagement"]';

    // **FIXED** - More specific selectors to target only the "Organic" heading
    this.organicEngagementHeading = 'h3:has-text("Organic")';
    this.organicText = 'h3 strong:has-text("Organic")';

    // Alternative selector using exact text matching
    this.organicHeadingExact = "h3";

    // Page-level assertion helpers
    this.expectedHeadingText = "Most Engaging Organic Posts";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickEngagementTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.engagementTabLink);
      await this.testHelper.clickElement(this.engagementTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerEngagementPage.clickEngagementTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerEngagementPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /engagement path
      return url.includes("/engagement");
    } catch (error) {
      console.error("InfluencerEngagementPage.isOnInfluencerEngagementPage failed:", error);
      return false;
    }
  }

  // ---------- **FIXED** Engagement Page Content Verification ----------
  async getEngagementHeadingText() {
    try {
      // **FIX** - Use filter with exact text matching to target only the "Organic" heading
      const organicHeadingElement = this.page.locator(this.organicHeadingExact).filter({ hasText: /^Most Engaging Organic Posts$/ }); // Exact match for Organic heading

      await this.testHelper.waitForElementToBeVisible(organicHeadingElement);
      const fullText = await organicHeadingElement.textContent();

      return fullText.trim();
    } catch (error) {
      console.error("InfluencerEngagementPage.getEngagementHeadingText failed:", error);
      return "";
    }
  }

  async verifyEngagementHeading(expectedText) {
    try {
      const actualText = await this.getEngagementHeadingText();
      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerEngagementPage.verifyEngagementHeading failed:", error);
      return false;
    }
  }

  async isEngagementHeadingVisible() {
    try {
      // **FIX** - Use filter with exact text matching to avoid strict mode violation
      const organicHeadingElement = this.page.locator(this.organicHeadingExact).filter({ hasText: /^Most Engaging Organic Posts$/ }); // Exact match for Organic heading

      return await organicHeadingElement.isVisible();
    } catch (error) {
      console.error("InfluencerEngagementPage.isEngagementHeadingVisible failed:", error);
      return false;
    }
  }

  async isOrganicTextVisible() {
    try {
      // Verify that the "Organic" strong text is visible within the heading
      await this.testHelper.waitForElementToBeVisible(this.organicText);
      return await this.page.isVisible(this.organicText);
    } catch (error) {
      console.error("InfluencerEngagementPage.isOrganicTextVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerEngagementPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerEngagementPage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerEngagementPage };
