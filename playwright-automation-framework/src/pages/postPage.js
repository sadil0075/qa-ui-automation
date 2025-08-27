const { TestHelper } = require("../utils/testHelper");

// src/pages/postPage.js

class PostPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.postNavLink = page.locator("a.header-link", {
      hasText: "Posts",
    });
  }

  async navigateToPostPage() {
    await this.postNavLink.click();
    await this.testHelper.waitForNetworkIdle();
  }

  async verifyPostPageTitle() {
    await this.testHelper.waitForNetworkIdle();
    const title = await this.page.title();
    return title === "Posts | Julius";
  }
}

module.exports = { PostPage };
