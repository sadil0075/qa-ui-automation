const { TestHelper } = require("../utils/testHelper");

class InfluencerPost {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Posts tab navigation
    this.postsTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="posts"]';

    // Posts page search elements
    this.postsSearchPlaceholder = "div.posts-search-input-placeholder";

    // Page-level assertion helpers
    this.expectedPlaceholderText = "Search for posts…";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickPostsTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.postsTabLink);
      await this.testHelper.clickElement(this.postsTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerPost.clickPostsTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerPostsPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /posts path
      return url.includes("/posts");
    } catch (error) {
      console.error("InfluencerPost.isOnInfluencerPostsPage failed:", error);
      return false;
    }
  }

  // ---------- Posts Page Content Verification ----------
  async getSearchPlaceholderText() {
    try {
      // Wait for the placeholder element to be visible
      await this.testHelper.waitForElementToBeVisible(this.postsSearchPlaceholder);
      return await this.page.textContent(this.postsSearchPlaceholder);
    } catch (error) {
      console.error("InfluencerPost.getSearchPlaceholderText failed:", error);
      return "";
    }
  }

  async verifySearchPlaceholder(expectedText) {
    try {
      const actualText = await this.getSearchPlaceholderText();
      return actualText.trim() === expectedText;
    } catch (error) {
      console.error("InfluencerPost.verifySearchPlaceholder failed:", error);
      return false;
    }
  }

  async isSearchPlaceholderVisible() {
    try {
      // Wait for and check if search placeholder is visible
      await this.testHelper.waitForElementToBeVisible(this.postsSearchPlaceholder);
      return await this.page.isVisible(this.postsSearchPlaceholder);
    } catch (error) {
      console.error("InfluencerPost.isSearchPlaceholderVisible failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerPost.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerPost.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerPost };
