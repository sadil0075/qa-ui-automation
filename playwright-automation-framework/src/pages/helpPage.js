const { TestHelper } = require("../utils/testHelper");

class HelpPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.helpIcon = page.locator("span.header-help-trigger");
    this.helpModalHeader = page.locator("h3", { hasText: "Related Help Articles" });
  }

  async openHelpBook() {
    await this.testHelper.clickElement("span.header-help-trigger");
    await this.testHelper.waitForElementToBeVisible("h3:has-text('Related Help Articles')");
  }

  async verifyHelpModalVisible() {
    await this.testHelper.waitForElementToBeVisible("h3:has-text('Related Help Articles')");
    return await this.helpModalHeader.isVisible();
  }
}

module.exports = { HelpPage };
