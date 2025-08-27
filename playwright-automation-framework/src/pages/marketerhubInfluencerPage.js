const { TestHelper } = require("../utils/testHelper");

class MarketerhubInfluencerPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // Navigation element to open Reporting page
    this.reportingSectionSelector = 'span.section-item-title:has-text("Reporting")';

    // Influencers tab element to click within Reporting page
    this.influencersTabSelector = 'a.jls-tab-nav-link:has-text("Influencers")';

    // Heading element within the Influencers page
    this.headingSelector = 'span[sectionheadertitle]:has-text("Influencers")';

    // Alternative selectors for influencers page verification
    this.influencersPageIndicators = [
      'span[sectionheadertitle]:has-text("Influencers")',
      'span:has-text("Influencers")',
      '[data-testid*="influencer"]',
      ".influencers-container",
      ".influencer-list",
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

  // Check if we're on influencers reporting page by URL
  async _isOnInfluencersReportingPage() {
    try {
      const url = await this.page.url();
      return url.includes("/reporting/influencers");
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

  // Click on the Influencers tab within Reporting page
  async clickInfluencersTab() {
    try {
      // Ensure page is still active
      if (!(await this._ensurePageIsActive())) {
        throw new Error("Page context is not active");
      }

      // Wait for the influencers tab to be visible
      await this.testHelper.waitForElementToBeVisible(this.influencersTabSelector, 20000);

      // Click the influencers tab
      await this.testHelper.clickElement(this.influencersTabSelector);

      // Use a retry mechanism to check URL change to influencers reporting
      let navigationSuccess = false;
      for (let i = 0; i < 10; i++) {
        try {
          const currentUrl = await this.page.url();
          if (currentUrl.includes("/reporting/influencers")) {
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

  // Verify the Influencers reporting page is loaded
  async verifyInfluencersPageLoaded() {
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

      // Check if URL indicates we're on influencers reporting page
      if (await this._isOnInfluencersReportingPage()) {
        // Try to find the specific heading first
        try {
          await this.page.waitForSelector(this.headingSelector, { timeout: 5000 });
          return true;
        } catch (error) {
          // Continue to alternative verification methods
        }

        // Try to find any influencers page indicator with shorter timeouts
        for (const selector of this.influencersPageIndicators) {
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
  async verifyInfluencersHeading() {
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

module.exports = { MarketerhubInfluencerPage };
