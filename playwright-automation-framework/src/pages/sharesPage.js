const { TestHelper } = require("../utils/testHelper");

class SharesPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Left-rail link in the Manage Account area
    this.sharesMenuItem = '//span[@class="section-item-title" and normalize-space()="Shares"]';

    // Page-level assertion helpers
    this.expectedTitlePart = "Shares";
    this.expectedFullTitle = "Shares | Julius"; // Updated to match actual title
  }

  // ---------- Navigation ----------
  async openSharesPage() {
    try {
      await this.testHelper.clickElement(this.sharesMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("SharesPage.openSharesPage failed:", error);
      throw error;
    }
  }

  async isOnSharesPage() {
    try {
      await this.testHelper.waitForNavigation();
      const title = await this.page.title();
      const url = this.page.url();

      // Verify both title and URL for robust validation
      const titleMatches = title === this.expectedFullTitle || title.includes(this.expectedTitlePart);
      const urlMatches = url.includes("/shares");

      return titleMatches && urlMatches;
    } catch (error) {
      console.error("SharesPage.isOnSharesPage failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("SharesPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  // Additional method to verify exact title match
  async hasCorrectTitle() {
    try {
      const title = await this.page.title();
      return title === this.expectedFullTitle;
    } catch (error) {
      console.error("SharesPage.hasCorrectTitle failed:", error);
      return false;
    }
  }
}

module.exports = { SharesPage };
