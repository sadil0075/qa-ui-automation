const { TestHelper } = require("../utils/testHelper");

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.dashboardNavLink = page.locator("a.header-link", {
      hasText: "Dashboard",
    });
  }

  async navigateToDashboard() {
    await this.dashboardNavLink.click();
    await this.testHelper.waitForNetworkIdle();
  }

  async verifyDashboardTitle() {
    await this.testHelper.waitForNetworkIdle();
    const title = await this.page.title();
    return title === "Julius";
  }
}

module.exports = { DashboardPage };
