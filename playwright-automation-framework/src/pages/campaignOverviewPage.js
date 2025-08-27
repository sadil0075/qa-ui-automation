const { TestHelper } = require("../utils/testHelper");

class CampaignOverviewPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    this.campaignRowLink = (campaignName) => `a.table-link:has-text("${campaignName}")`;
  }

  async searchAndSelectCampaign(campaignName) {
    try {
      // Wait for the search result and click on it
      const campaignSelector = this.campaignRowLink(campaignName);
      await this.testHelper.waitForElementToBeVisible(campaignSelector);
      await this.testHelper.clickElement(campaignSelector);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("CampaignOverviewPage.searchAndSelectCampaign failed:", error);
      throw error;
    }
  }

  async verifyTitleIsCampaignDetail(campaignName) {
    try {
      await this.testHelper.waitForNavigation();
      const expectedTitle = `${campaignName} | Julius`;
      const actualTitle = await this.page.title();
      return actualTitle === expectedTitle;
    } catch (error) {
      console.error("CampaignOverviewPage.verifyTitleIsCampaignDetail failed:", error);
      return false;
    }
  }
}

module.exports = { CampaignOverviewPage };
