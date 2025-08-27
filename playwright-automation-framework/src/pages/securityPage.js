const { TestHelper } = require("../utils/testHelper");

class SecurityPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Left-rail link in the Manage Account area
    this.securityMenuItem = '//span[@class="section-item-title" and normalize-space()="Security"]';

    // Page-level assertion helpers
    this.expectedTitlePart = "Security";
    this.expectedFullTitle = "Security | Julius"; // Updated to match actual title
  }

  // ---------- Navigation ----------
  async openSecurityPage() {
    try {
      await this.testHelper.clickElement(this.securityMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("SecurityPage.openSecurityPage failed:", error);
      throw error;
    }
  }

  async isOnSecurityPage() {
    try {
      await this.testHelper.waitForNavigation();
      const title = await this.page.title();
      const url = this.page.url();

      // Verify both title and URL for robust validation
      const titleMatches = title === this.expectedFullTitle || title.includes(this.expectedTitlePart);
      const urlMatches = url.includes("/security");

      return titleMatches && urlMatches;
    } catch (error) {
      console.error("SecurityPage.isOnSecurityPage failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("SecurityPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  // Additional method to verify exact title match
  async hasCorrectTitle() {
    try {
      const title = await this.page.title();
      return title === this.expectedFullTitle;
    } catch (error) {
      console.error("SecurityPage.hasCorrectTitle failed:", error);
      return false;
    }
  }
}

module.exports = { SecurityPage };
