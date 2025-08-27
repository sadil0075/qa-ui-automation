const { TestHelper } = require("../utils/testHelper");

class InfluencerBrandPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Brand tab navigation
    this.brandTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[data-tab="brands"]';

    // Brand page column heading elements
    this.brandColumnHeading = 'span.sorter[data-sort-by="brand"]';

    // Page-level assertion helpers
    this.expectedColumnHeadingText = "Brand";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickBrandTab() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.brandTabLink);
      await this.testHelper.clickElement(this.brandTabLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerBrandPage.clickBrandTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerBrandPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /brands path
      return url.includes("/brands");
    } catch (error) {
      console.error("InfluencerBrandPage.isOnInfluencerBrandPage failed:", error);
      return false;
    }
  }

  // ---------- Brand Page Content Verification ----------
  async getBrandColumnHeadingText() {
    try {
      // Wait for page to be fully loaded first
      await this.testHelper.waitForNetworkIdle();

      // Wait for the specific brand column heading element
      await this.testHelper.waitForElementToBeVisible(this.brandColumnHeading);

      const headingElement = this.page.locator(this.brandColumnHeading);
      const fullText = await headingElement.textContent();

      return fullText.trim();
    } catch (error) {
      console.error("InfluencerBrandPage.getBrandColumnHeadingText failed:", error);
      return "";
    }
  }

  async verifyBrandColumnHeading(expectedText) {
    try {
      const actualText = await this.getBrandColumnHeadingText();

      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerBrandPage.verifyBrandColumnHeading failed:", error);
      return false;
    }
  }

  async isBrandColumnHeadingVisible() {
    try {
      // Wait for page to be fully loaded
      await this.testHelper.waitForNetworkIdle();

      // Wait for and check if brand column heading is visible
      await this.testHelper.waitForElementToBeVisible(this.brandColumnHeading);
      return await this.page.isVisible(this.brandColumnHeading);
    } catch (error) {
      console.error("InfluencerBrandPage.isBrandColumnHeadingVisible failed:", error);
      return false;
    }
  }

  // Additional verification method for the specific sorter attributes
  async verifyBrandColumnSorterAttributes() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.brandColumnHeading);

      const element = this.page.locator(this.brandColumnHeading);

      // Verify the specific attributes mentioned in the element
      const sortBy = await element.getAttribute("data-sort-by");
      const initialSortDirection = await element.getAttribute("data-initial-sort-direction");
      const forceReload = await element.getAttribute("data-force-reload");

      return sortBy === "brand" && initialSortDirection === "asc" && forceReload === "false";
    } catch (error) {
      console.error("InfluencerBrandPage.verifyBrandColumnSorterAttributes failed:", error);
      return false;
    }
  }

  async isBrandPageContentLoaded() {
    try {
      await this.testHelper.waitForNetworkIdle();
      const sorterCount = await this.page.locator("span.sorter").count();

      return sorterCount > 0;
    } catch (error) {
      console.error("InfluencerBrandPage.isBrandPageContentLoaded failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerBrandPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerBrandPage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerBrandPage };
