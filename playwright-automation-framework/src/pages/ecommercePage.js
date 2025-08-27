const { TestHelper } = require("../utils/testHelper");

class EcommercePage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Left-rail link in the Manage Account area
    this.ecommerceMenuItem = '//span[@class="section-item-title" and normalize-space()="E-Commerce"]';

    // Page-level assertion helpers
    this.expectedTitlePart = "Shopify Settings";
    this.expectedFullTitle = "Shopify Settings | Julius"; // Updated to match actual title
  }

  // ---------- Navigation ----------
  async openEcommercePage() {
    try {
      await this.testHelper.clickElement(this.ecommerceMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("EcommercePage.openEcommercePage failed:", error);
      throw error;
    }
  }

  async isOnEcommercePage() {
    try {
      await this.testHelper.waitForNavigation();
      const title = await this.page.title();
      const url = this.page.url();

      // Verify both title and URL for robust validation
      const titleMatches = title === this.expectedFullTitle || title.includes(this.expectedTitlePart);
      const urlMatches = url.includes("/ecommerce") || url.includes("/shopify");

      return titleMatches && urlMatches;
    } catch (error) {
      console.error("EcommercePage.isOnEcommercePage failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("EcommercePage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  // Additional method to verify exact title match
  async hasCorrectTitle() {
    try {
      const title = await this.page.title();
      return title === this.expectedFullTitle;
    } catch (error) {
      console.error("EcommercePage.hasCorrectTitle failed:", error);
      return false;
    }
  }
}

module.exports = { EcommercePage };
