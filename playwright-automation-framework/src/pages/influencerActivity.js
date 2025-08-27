const { TestHelper } = require("../utils/testHelper");

class InfluencerActivity {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Activity tab navigation
    this.activityTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="activity"]';

    // Activity page heading - using specific selector to avoid strict mode violations
    this.activityHeading = 'span:has-text("All Activity")';

    // Alternative selector for activity heading
    this.activityHeadingExact = "span";

    // Page-level assertion helpers
    this.expectedHeadingText = "All Activity";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickActivityTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.activityTabLink);
      await this.testHelper.clickElement(this.activityTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerActivity.clickActivityTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerActivityPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /activity path
      return url.includes("/activity");
    } catch (error) {
      console.error("InfluencerActivity.isOnInfluencerActivityPage failed:", error);
      return false;
    }
  }

  // ---------- Content Verification ----------
  async getActivityHeadingText() {
    try {
      // Use filter with exact text matching to target the specific "All Activity" element
      const headingElement = this.page.locator(this.activityHeadingExact).filter({ hasText: /^All Activity$/ }); // Exact match using regex

      await this.testHelper.waitForElementToBeVisible(headingElement);
      return await headingElement.textContent();
    } catch (error) {
      console.error("InfluencerActivity.getActivityHeadingText failed:", error);
      return "";
    }
  }

  async verifyActivityHeading(expectedText) {
    try {
      const actualText = await this.getActivityHeadingText();
      return actualText.trim() === expectedText;
    } catch (error) {
      console.error("InfluencerActivity.verifyActivityHeading failed:", error);
      return false;
    }
  }

  async isActivityHeadingVisible() {
    try {
      // Use filter with exact text matching to avoid strict mode violation
      const headingElement = this.page.locator(this.activityHeadingExact).filter({ hasText: /^All Activity$/ }); // Exact match using regex

      return await headingElement.isVisible();
    } catch (error) {
      console.error("InfluencerActivity.isActivityHeadingVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerActivity.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerActivity.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerActivity };
