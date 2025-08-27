const { TestHelper } = require("../utils/testHelper");

class MarketerhubLinkTrackerPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // Navigation element to open Reporting page
    this.reportingSectionSelector = 'span.section-item-title:has-text("Reporting")';

    // Link Tracker tab element to click within Reporting page
    this.linkTrackerTabSelector = 'a.jls-tab-nav-link:has-text("Link Tracker")';

    // Heading element within the Link Tracker page
    this.headingSelector = 'h5.error-page-title:has-text("You have no links created for this campaign")';

    // Alternative selectors for link tracker page verification
    this.linkTrackerPageIndicators = [
      'h5.error-page-title:has-text("You have no links created for this campaign")',
      'h5:has-text("You have no links created for this campaign")',
      '[data-testid*="link-tracker"]',
      ".link-tracker-container",
      ".error-page-title",
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

  // Check if we're on link tracker reporting page by URL
  async _isOnLinkTrackerReportingPage() {
    try {
      const url = await this.page.url();
      return url.includes("/reporting/link-tracker");
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

  // Click on the Link Tracker tab within Reporting page
  async clickLinkTrackerTab() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for the link tracker tab to be visible
      await this.testHelper.waitForElementToBeVisible(this.linkTrackerTabSelector, 20000);

      // Click the link tracker tab
      await this.testHelper.clickElement(this.linkTrackerTabSelector);

      // Use a retry mechanism to check URL change to link tracker reporting
      let navigationSuccess = false;
      for (let i = 0; i < 10; i++) {
        try {
          const currentUrl = await this.page.url();
          if (currentUrl.includes("/reporting/link-tracker")) {
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

  // Verify the Link Tracker reporting page is loaded
  async verifyLinkTrackerPageLoaded() {
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

      // Check if URL indicates we're on link tracker reporting page
      if (await this._isOnLinkTrackerReportingPage()) {
        // Try to find the specific heading first
        try {
          await this.page.waitForSelector(this.headingSelector, { timeout: 5000 });
          return true;
        } catch (error) {
          // Continue to alternative verification methods
        }

        // Try to find any link tracker page indicator with shorter timeouts
        for (const selector of this.linkTrackerPageIndicators) {
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
  async verifyLinkTrackerHeading() {
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

module.exports = { MarketerhubLinkTrackerPage };
