const { TestHelper } = require("../utils/testHelper");

class CampaignMessagePage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // Navigation element to open Campaign Messages page
    this.messagesSectionSelector = 'span.section-item-title:has-text("Messages")';

    // Heading element within the Campaign Messages page
    this.headingSelector = 'span.breadcrumb-item-text:has-text("Messages")';
  }

  // Check if page is still valid before performing actions
  async _ensurePageIsActive() {
    try {
      await this.page.url();
      return true;
    } catch (error) {
      console.error("Page is not active:", error);
      return false;
    }
  }

  // Navigate to the Campaign Messages page with enhanced stability
  async navigateToMessagesSection() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for page to be fully stable after campaign selection
      await this.testHelper.waitForNavigation(10000);

      // Wait for the messages section to be visible with longer timeout
      await this.testHelper.waitForElementToBeVisible(this.messagesSectionSelector, 20000);

      // Add a small wait to ensure page stability
      await this.page.waitForTimeout(2000);

      // Click the messages section
      await this.testHelper.clickElement(this.messagesSectionSelector);

      // Wait specifically for the messages heading to appear (confirms navigation success)
      await this.testHelper.waitForElementToBeVisible(this.headingSelector, 20000);
    } catch (error) {
      console.error("CampaignMessagePage.navigateToMessagesSection failed:", error);

      // Try to get current URL for debugging
      try {
        console.error("Current URL during error:", await this.page.url());
      } catch (urlError) {
        console.error("Unable to get current URL - page may be closed");
      }

      throw error;
    }
  }

  // Verify the Campaign Messages page heading
  async verifyMessagesHeadingVisible() {
    try {
      if (!(await this._ensurePageIsActive())) {
        return false;
      }

      await this.testHelper.waitForElementToBeVisible(this.headingSelector, 10000);
      return await this.testHelper.isElementVisible(this.headingSelector);
    } catch (error) {
      console.error("CampaignMessagePage.verifyMessagesHeadingVisible failed:", error);
      return false;
    }
  }
}

module.exports = { CampaignMessagePage };
