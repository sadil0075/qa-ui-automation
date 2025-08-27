const { TestHelper } = require("../utils/testHelper");

class InfluencerRelatedPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Related tab navigation
    this.relatedTabLink = 'a.section-bar-item-link.influencer-header-section-bar-item-link[href*="/related"]';

    // Alternative selector using text
    this.relatedTabLinkByText = 'a.section-bar-item-link.influencer-header-section-bar-item-link:has-text("Related")';

    // Related page heading elements
    this.similarInfluencersHeading = 'h3:has-text("Similar Influencers")';

    // Page-level assertion helpers
    this.expectedHeadingText = "Similar Influencers";
    this.expectedTitlePart = "Julius";
  }

  // ---------- Navigation ----------
  async clickRelatedTab() {
    try {
      // Try primary selector first, then fallback to text-based selector
      let tabElement;
      try {
        await this.testHelper.waitForElementToBeVisible(this.relatedTabLink);
        tabElement = this.relatedTabLink;
      } catch (error) {
        console.log("Primary selector failed, trying text-based selector");
        await this.testHelper.waitForElementToBeVisible(this.relatedTabLinkByText);
        tabElement = this.relatedTabLinkByText;
      }

      await this.testHelper.clickElement(tabElement);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("InfluencerRelatedPage.clickRelatedTab failed:", error);
      throw error;
    }
  }

  async isOnInfluencerRelatedPage() {
    try {
      await this.testHelper.waitForNavigation();
      const url = this.page.url();

      // Check URL contains /related path
      return url.includes("/related");
    } catch (error) {
      console.error("InfluencerRelatedPage.isOnInfluencerRelatedPage failed:", error);
      return false;
    }
  }

  // ---------- Related Page Content Verification ----------
  async getSimilarInfluencersHeadingText() {
    try {
      // Wait for page to be fully loaded first
      await this.testHelper.waitForNetworkIdle();

      // Find all h3 elements and look for the one containing "Similar Influencers"
      const headings = await this.page.locator("h3").all();

      for (const heading of headings) {
        const headingText = await heading.textContent();
        if (headingText && headingText.includes("Similar Influencers")) {
          // Extract just the "Similar Influencers" part by splitting on newlines and trimming
          const lines = headingText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line);
          const similarInfluencersLine = lines.find((line) => line.includes("Similar Influencers"));
          return similarInfluencersLine ? similarInfluencersLine.trim() : "";
        }
      }

      return "";
    } catch (error) {
      console.error("InfluencerRelatedPage.getSimilarInfluencersHeadingText failed:", error);
      return "";
    }
  }

  async verifySimilarInfluencersHeading(expectedText) {
    try {
      const actualText = await this.getSimilarInfluencersHeadingText();

      // Remove extra spaces and normalize the text for comparison
      const normalizedActual = actualText.replace(/\s+/g, " ").trim();
      const normalizedExpected = expectedText.replace(/\s+/g, " ").trim();

      return normalizedActual === normalizedExpected;
    } catch (error) {
      console.error("InfluencerRelatedPage.verifySimilarInfluencersHeading failed:", error);
      return false;
    }
  }

  async isSimilarInfluencersHeadingVisible() {
    try {
      // Wait for page to be fully loaded and check if any h3 contains "Similar Influencers"
      await this.testHelper.waitForNetworkIdle();

      const headings = await this.page.locator("h3").all();

      for (const heading of headings) {
        const isVisible = await heading.isVisible();
        if (isVisible) {
          const headingText = await heading.textContent();
          if (headingText && headingText.includes("Similar Influencers")) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("InfluencerRelatedPage.isSimilarInfluencersHeadingVisible failed:", error);
      return false;
    }
  }

  // Additional verification method for the help element within the heading
  async isHelpElementVisible() {
    try {
      await this.testHelper.waitForNetworkIdle();

      // Look for the help element within the h3 heading
      const helpElement = this.page.locator('h3:has-text("Similar Influencers") span.help');
      return await helpElement.isVisible();
    } catch (error) {
      console.error("InfluencerRelatedPage.isHelpElementVisible failed:", error);
      return false;
    }
  }

  async isRelatedPageContentLoaded() {
    try {
      await this.testHelper.waitForNetworkIdle();
      const h3Count = await this.page.locator("h3").count();
      //console.log(`Found ${h3Count} h3 elements on related page`);
      return h3Count > 0;
    } catch (error) {
      console.error("InfluencerRelatedPage.isRelatedPageContentLoaded failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("InfluencerRelatedPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  async getCurrentPageUrl() {
    try {
      return this.page.url();
    } catch (error) {
      console.error("InfluencerRelatedPage.getCurrentPageUrl failed:", error);
      return "";
    }
  }
}

module.exports = { InfluencerRelatedPage };
