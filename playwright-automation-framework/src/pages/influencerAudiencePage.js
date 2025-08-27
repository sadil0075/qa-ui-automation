const { TestHelper } = require("../utils/testHelper");

class InfluencerAudiencePage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Audience tab navigation
    this.audienceTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="audience"]';

    // Audience page heading elements
    this.demographicsHeading = 'span:has-text("Demographics")';

    // Alternative selector for the heading
    this.headingElement = "span";

    // Page-level assertion helpers
    this.expectedHeadingText = "Demographics";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickAudienceTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.audienceTabLink);
      await this.testHelper.clickElement(this.audienceTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerAudiencePage.clickAudienceTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerAudiencePage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /audience path
      return url.includes("/audience");
    } catch (error) {
      console.error("InfluencerAudiencePage.isOnInfluencerAudiencePage failed:", error);
      return false;
    }
  }

  // ---------- Audience Page Content Verification ----------
  async getDemographicsHeadingText() {
    try {
      // Use filter with exact text matching to target the specific "Demographics" element
      const demographicsElement = this.page.locator(this.headingElement).filter({ hasText: /^Demographics$/ }); // Exact match using regex

      await this.testHelper.waitForElementToBeVisible(demographicsElement);
      const fullText = await demographicsElement.textContent();

      return fullText.trim();
    } catch (error) {
      console.error("InfluencerAudiencePage.getDemographicsHeadingText failed:", error);
      return "";
    }
  }

  async verifyDemographicsHeading(expectedText) {
    try {
      const actualText = await this.getDemographicsHeadingText();
      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerAudiencePage.verifyDemographicsHeading failed:", error);
      return false;
    }
  }

  async isDemographicsHeadingVisible() {
    try {
      // Use filter with exact text matching to avoid strict mode violation
      const demographicsElement = this.page.locator(this.headingElement).filter({ hasText: /^Demographics$/ }); // Exact match using regex

      return await demographicsElement.isVisible();
    } catch (error) {
      console.error("InfluencerAudiencePage.isDemographicsHeadingVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerAudiencePage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerAudiencePage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerAudiencePage };
