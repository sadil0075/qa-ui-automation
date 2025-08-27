const { TestHelper } = require("../utils/testHelper");

// pages/brandProfilesPage.js

class BrandProfilesPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.brandProfilesLink = page.locator("a.header-link", { hasText: "Brand Profiles" });
  }

  async navigateToBrandProfiles() {
    await this.testHelper.clickElement("a.header-link:has-text('Brand Profiles')");
    await this.testHelper.waitForNetworkIdle();
  }

  async getPageTitle() {
    await this.testHelper.waitForNetworkIdle();
    return await this.page.title();
  }
}

module.exports = { BrandProfilesPage };
