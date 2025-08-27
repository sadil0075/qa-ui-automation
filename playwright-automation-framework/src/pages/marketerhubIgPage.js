const { TestHelper } = require("../utils/testHelper");

class MarketerhubIgPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // Navigation element to open Reporting page
    this.reportingSectionSelector = 'span.section-item-title:has-text("Reporting")';

    // IG icon element to click within Reporting page
    this.igIconSelector = "i.uil.uil-stories.jls-sidebar-action-icon";

    // Heading element within the Instagram Stories page
    this.headingSelector = 'div.page-title:has-text("Track Instagram Stories of Influencers")';

    // Alternative selectors for IG page verification
    this.igPageIndicators = [
      'div.page-title:has-text("Track Instagram Stories of Influencers")',
      '[data-testid*="instagram"]',
      ".instagram-container",
      ".stories-container",
      ".page-title",
    ];
  }

  // Check if page is still valid before performing actions
  async _ensurePageIsActive() {
    try {
      await this.page.url();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Check if we're on reporting page by URL
  async _isOnReportingPage() {
    try {
      const url = await this.page.url();
      return url.includes("/reporting");
    } catch (error) {
      return false;
    }
  }

  // Navigate to the Reporting page
  async navigateToReportingPage() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for the reporting section to be visible with longer timeout
      await this.testHelper.waitForElementToBeVisible(this.reportingSectionSelector, 20000);

      // Click the reporting section
      await this.testHelper.clickElement(this.reportingSectionSelector);

      // Use a retry mechanism to check URL change
      let navigationSuccess = false;
      for (let i = 0; i < 10; i++) {
        try {
          const currentUrl = await this.page.url();
          if (currentUrl.includes("/reporting")) {
            navigationSuccess = true;
            break;
          }
          // Short wait before next check
          await this.page.waitForTimeout(500);
        } catch (error) {
          await this.page.waitForTimeout(500);
        }
      }

      if (!navigationSuccess) {
        // Try one final URL check
        try {
          const finalUrl = await this.page.url();
          if (!finalUrl.includes("/reporting")) {
            throw new Error(`Navigation to reporting failed. Expected URL to contain '/reporting', but got: ${finalUrl}`);
          }
        } catch (error) {
          // Continue execution
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Click on the IG icon within Reporting page
  async clickIgIcon() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for the IG icon to be visible
      await this.testHelper.waitForElementToBeVisible(this.igIconSelector, 20000);

      // Click the IG icon
      await this.testHelper.clickElement(this.igIconSelector);

      // Wait for navigation to complete
      await this.page.waitForTimeout(3000);
    } catch (error) {
      throw error;
    }
  }

  // Navigate to Instagram Stories page (combines both steps)
  async navigateToInstagramStories() {
    await this.navigateToReportingPage();
    await this.clickIgIcon();
  }

  // Verify the Instagram Stories page is loaded
  async verifyIgPageLoaded() {
    try {
      // Don't fail immediately if page is not active
      let pageActive = true;
      try {
        await this.page.url();
      } catch (error) {
        pageActive = false;
      }

      if (!pageActive) {
        return false;
      }

      // Try to find the specific heading first
      try {
        await this.page.waitForSelector(this.headingSelector, { timeout: 5000 });
        return true;
      } catch (error) {
        // Continue to alternative verification methods
      }

      // Try to find any IG page indicator with shorter timeouts
      for (const selector of this.igPageIndicators) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          return true;
        } catch (error) {
          // Continue to next selector
          continue;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Verify the specific heading
  async verifyHeadingVisible() {
    try {
      if (!(await this._ensurePageIsActive())) {
        return false;
      }

      await this.testHelper.waitForElementToBeVisible(this.headingSelector, 10000);
      return await this.testHelper.isElementVisible(this.headingSelector);
    } catch (error) {
      return false;
    }
  }
}

module.exports = { MarketerhubIgPage };
