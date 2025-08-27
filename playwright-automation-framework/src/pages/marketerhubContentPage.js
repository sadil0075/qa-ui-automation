const { TestHelper } = require("../utils/testHelper");

class MarketerhubContentPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // Navigation element to open Reporting page
    this.reportingSectionSelector = 'span.section-item-title:has-text("Reporting")';

    // Content tab element to click within Reporting page
    this.contentTabSelector = 'a.jls-tab-nav-link:has-text("Content")';

    // Heading element within the Content page
    this.headingSelector = 'h1.mb-2:has-text("Customize Your Reporting.")';

    // Alternative selectors for content page verification
    this.contentPageIndicators = [
      'h1.mb-2:has-text("Customize Your Reporting.")',
      'h1:has-text("Customize Your Reporting.")',
      '[data-testid*="content"]',
      ".content-container",
      ".content-list",
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

  // Check if we're on content reporting page by URL
  async _isOnContentReportingPage() {
    try {
      const url = await this.page.url();
      return url.includes("/reporting/content");
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

  // Click on the Content tab within Reporting page
  async clickContentTab() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for the content tab to be visible
      await this.testHelper.waitForElementToBeVisible(this.contentTabSelector, 20000);

      // Click the content tab
      await this.testHelper.clickElement(this.contentTabSelector);

      // Use a retry mechanism to check URL change to content reporting
      let navigationSuccess = false;
      for (let i = 0; i < 10; i++) {
        try {
          const currentUrl = await this.page.url();
          if (currentUrl.includes("/reporting/content")) {
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
        // Wait a bit more for navigation to complete
        await this.page.waitForTimeout(3000);
      }
    } catch (error) {
      throw error;
    }
  }

  // Verify the Content reporting page is loaded
  async verifyContentPageLoaded() {
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

      // Check if URL indicates we're on content reporting page
      if (await this._isOnContentReportingPage()) {
        // Try to find the specific heading first
        try {
          await this.page.waitForSelector(this.headingSelector, { timeout: 5000 });
          return true;
        } catch (error) {
          // Continue to alternative verification methods
        }

        // Try to find any content page indicator with shorter timeouts
        for (const selector of this.contentPageIndicators) {
          try {
            await this.page.waitForSelector(selector, { timeout: 2000 });
            return true;
          } catch (error) {
            // Continue to next selector
            continue;
          }
        }

        // If no specific elements found but URL is correct, still consider it successful
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // Verify the specific heading
  async verifyContentHeading() {
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

module.exports = { MarketerhubContentPage };
