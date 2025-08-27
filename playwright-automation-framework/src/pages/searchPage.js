import { TestHelper } from "../utils/testHelper.js";

class SearchPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Search bar input field
    this.searchInput = 'input.form-search-field.header-search-form-field[type="search"]';

    // Search dropdown and results - **UPDATED** to be more specific
    this.searchDropdown = ".header-search-results";
    this.searchResultItem = "a.header-search-result";

    // **SPECIFIC** - Target only the Influencer result to avoid strict mode violation
    this.influencerSearchResult = 'a.header-search-result[data-type="Influencer"]';

    // Specific influencer result selectors
    this.influencerResultType = "span.header-search-result-type.header-search-result-type-influencer";
    this.searchResultTitle = "span.header-search-result-title";

    // Expected search result data
    this.expectedInfluencerName = "Selena Gomez";
    this.expectedResultType = "Influencer";

    // **UPDATED** - Export profile elements with FIXED selectors
    this.exportProfileButton = 'a[data-trigger="modal"][data-modal-href*="/export"] span.app-icon.app-icon-boxed-arrow-down.action-bar-item-icon';
    this.csvOption = 'span.form-label-toggle-content:has-text("CSV")';
    this.exportPdfButton = 'button.btn.btn-primary.distribution-modal-submit[data-toggle-allows-bubble="true"]';

    // **NEW** - Compare page navigation elements
    this.compareButton = "span.app-icon.app-icon-compare.action-bar-item-icon";
    this.comparePageHeading = "h2.navigation-bar-title";

    // **FIXED** - Campaign functionality elements with SPECIFIC selectors
    this.campaignButton = 'a[data-action="add-to-campaign"][data-trigger="modal"] span.app-icon.app-icon-bubble.action-bar-item-icon';
    this.campaignDropdown = 'span.form-input.form-selectable-content:has(span.form-selectable-placeholder:text("Select a Campaign"))';
    this.campaignPlaceholder = 'span.form-selectable-placeholder:has-text("Select a Campaign")';
    this.campaignSearchInput = 'input.form-search-field[placeholder="Type here to search..."][data-trigger="autocomplete"]';
    this.campaignSearchResults = ".form-selectable-results-item";
    this.confirmButton = 'button.btn.btn-primary[type="submit"]:has(span.app-icon.app-icon-plus.btn-icon)';
    this.recentActivityLink = 'a[href*="/campaigns/"]';
    this.campaignRemoveButton = 'span.app-icon.app-icon-times.form-selectable-remove[data-trigger="remove"]';

    // **NEW** - List functionality elements
    this.listButton = 'a[data-action="add-to-list"][data-trigger="modal"] span.app-icon.app-icon-copy.action-bar-item-icon';
    this.listDropdown = 'span.form-input.form-selectable-content:has(span.form-selectable-placeholder:text("Select a List"))';
    this.listPlaceholder = 'span.form-selectable-placeholder:has-text("Select a List")';
    this.listSearchInput = 'input.form-search-field[placeholder="Type here to search..."][data-trigger="autocomplete"]';
    this.listSearchResults = ".form-selectable-results-item";
    this.addButton = 'button.btn.btn-primary[type="submit"]:has(span.app-icon.app-icon-plus.btn-icon)';
    this.recentActivityListLink = 'a[href*="/lists/"]';
    this.listRemoveButton = 'span.app-icon.app-icon-times.form-selectable-remove[data-trigger="remove"]';
  }

  // ---------- Search Actions ----------
  async clickSearchBar() {
    try {
      await this.testHelper.clickElement(this.searchInput);
      await this.testHelper.waitForElementToBeVisible(this.searchInput);
    } catch (error) {
      console.error("SearchPage.clickSearchBar failed:", error);
      throw error;
    }
  }

  async searchForInfluencer(influencerName) {
    try {
      // Click search bar and wait for it to be active
      await this.testHelper.clickElement(this.searchInput);
      await this.testHelper.waitForElementToBeVisible(this.searchInput);

      // Clear existing text and type search query
      await this.page.fill(this.searchInput, "");
      await this.page.type(this.searchInput, influencerName, { delay: 100 });

      // Wait for search results to populate
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("SearchPage.searchForInfluencer failed:", error);
      throw error;
    }
  }

  // ---------- **UPDATED** Search Results Verification ----------
  async isSearchDropdownVisible() {
    try {
      // **FIX** - Wait for the specific influencer result instead of generic results
      await this.testHelper.waitForElementToBeVisible(this.influencerSearchResult);
      return await this.page.isVisible(this.influencerSearchResult);
    } catch (error) {
      console.error("SearchPage.isSearchDropdownVisible failed:", error);
      return false;
    }
  }

  async isInfluencerResultVisible(influencerName) {
    try {
      // **FIX** - Use specific selector that targets only the influencer result
      const influencerResultSelector = `a.header-search-result[data-name="${influencerName}"][data-type="Influencer"]`;
      await this.testHelper.waitForElementToBeVisible(influencerResultSelector);
      return await this.page.isVisible(influencerResultSelector);
    } catch (error) {
      console.error("SearchPage.isInfluencerResultVisible failed:", error);
      return false;
    }
  }

  async verifyInfluencerSearchResult(influencerName) {
    try {
      // **FIX** - Target the specific influencer result element
      const influencerResultSelector = `a.header-search-result[data-name="${influencerName}"][data-type="Influencer"]`;
      await this.testHelper.waitForElementToBeVisible(influencerResultSelector);

      // Get the specific influencer result element
      const resultElement = this.page.locator(influencerResultSelector);
      const isVisible = await resultElement.isVisible();

      if (isVisible) {
        // Verify the title matches
        const titleElement = resultElement.locator(this.searchResultTitle);
        const titleText = await titleElement.textContent();

        // Verify the type is "Influencer"
        const typeElement = resultElement.locator(this.influencerResultType);
        const typeText = await typeElement.textContent();

        return titleText.trim() === influencerName && typeText.trim() === this.expectedResultType;
      }

      return false;
    } catch (error) {
      console.error("SearchPage.verifyInfluencerSearchResult failed:", error);
      return false;
    }
  }

  // **NEW METHOD** - Count all search results (handles multiple results properly)
  async getSearchResultsCount() {
    try {
      // Wait for any search result to appear
      await this.testHelper.waitForElementToBeVisible(this.influencerSearchResult);
      // Count all search results using page.locator().count() which doesn't have strict mode issues
      return await this.page.locator(this.searchResultItem).count();
    } catch (error) {
      console.error("SearchPage.getSearchResultsCount failed:", error);
      return 0;
    }
  }

  // **NEW METHOD** - Verify all search result types for debugging
  async getAllSearchResultTypes() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.influencerSearchResult);
      const allResults = await this.page.locator(this.searchResultItem).all();
      const resultTypes = [];

      for (const result of allResults) {
        const dataType = await result.getAttribute("data-type");
        const dataName = await result.getAttribute("data-name");
        const dataPlatform = await result.getAttribute("data-platform");

        resultTypes.push({
          type: dataType,
          name: dataName,
          platform: dataPlatform,
        });
      }

      return resultTypes;
    } catch (error) {
      console.error("SearchPage.getAllSearchResultTypes failed:", error);
      return [];
    }
  }

  async getInfluencerResultHref(influencerName) {
    try {
      const influencerResultSelector = `a.header-search-result[data-name="${influencerName}"][data-type="Influencer"]`;
      await this.testHelper.waitForElementToBeVisible(influencerResultSelector);
      return await this.page.getAttribute(influencerResultSelector, "href");
    } catch (error) {
      console.error("SearchPage.getInfluencerResultHref failed:", error);
      return "";
    }
  }

  // **NEW METHOD** - Navigate to influencer profile
  async clickInfluencerResult(influencerName) {
    try {
      // Target the specific influencer result link
      const influencerResultSelector = `a.header-search-result[data-name="${influencerName}"][data-type="Influencer"]`;
      await this.testHelper.waitForElementToBeVisible(influencerResultSelector);

      // Click the influencer result to navigate to profile
      await this.testHelper.clickElement(influencerResultSelector);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("SearchPage.clickInfluencerResult failed:", error);
      throw error;
    }
  }

  // **FIXED** - Improved profile page verification with error handling
  async isOnInfluencerProfilePage(influencerName) {
    try {
      // **FIX** - Check if page is still valid before proceeding
      try {
        await this.page.url(); // Test if page context is still valid
      } catch (error) {
        console.error("Page context lost, cannot verify profile page");
        return false;
      }

      // **FIX** - More robust page state waiting
      await this.page.waitForLoadState("domcontentloaded");

      const title = await this.page.title();
      const url = this.page.url();

      // Expected title: "Selena Gomez | Julius"
      const expectedTitle = `${influencerName} | Julius`;

      // Verify both title and URL
      const titleMatches = title === expectedTitle;
      const urlMatches = url.includes(`/${influencerName.toLowerCase().replace(" ", "-")}`);

      return titleMatches && urlMatches;
    } catch (error) {
      console.error("SearchPage.isOnInfluencerProfilePage failed:", error);
      return false;
    }
  }

  // **FIXED** - Improved current page title method with error handling
  async getCurrentPageTitle() {
    try {
      // **FIX** - Check if page is still valid
      try {
        await this.page.url(); // Test if page context is still valid
      } catch (error) {
        console.error("Page context lost, cannot get title");
        return "";
      }

      return await this.page.title();
    } catch (error) {
      console.error("SearchPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }

  // **NEW METHODS** - Export Profile Functionality with FIXED selectors
  async clickExportProfile() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.exportProfileButton);
      await this.testHelper.clickElement(this.exportProfileButton);

      // **FIX** - Wait for the CSV option directly instead of generic modal
      // This avoids the strict mode violation with multiple modals
      await this.testHelper.waitForElementToBeVisible(this.csvOption);
    } catch (error) {
      console.error("SearchPage.clickExportProfile failed:", error);
      throw error;
    }
  }

  async selectCsvOption() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.csvOption);
      await this.testHelper.clickElement(this.csvOption);
    } catch (error) {
      console.error("SearchPage.selectCsvOption failed:", error);
      throw error;
    }
  }

  async clickExportPdfButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.exportPdfButton);
      await this.testHelper.clickElement(this.exportPdfButton);

      // Wait for export process to start
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("SearchPage.clickExportPdfButton failed:", error);
      throw error;
    }
  }

  // **UPDATED** - More specific modal checking methods
  async isExportModalVisible() {
    try {
      // **FIX** - Check for CSV option visibility instead of generic modal
      // This is more reliable than checking for the modal container
      return await this.testHelper.isElementVisible(this.csvOption);
    } catch (error) {
      console.error("SearchPage.isExportModalVisible failed:", error);
      return false;
    }
  }

  async isCsvOptionVisible() {
    try {
      return await this.testHelper.isElementVisible(this.csvOption);
    } catch (error) {
      console.error("SearchPage.isCsvOptionVisible failed:", error);
      return false;
    }
  }

  async isExportPdfButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.exportPdfButton);
    } catch (error) {
      console.error("SearchPage.isExportPdfButtonVisible failed:", error);
      return false;
    }
  }

  // **NEW METHODS** - Compare Page Navigation Functionality
  async clickCompareButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.compareButton);
      await this.testHelper.clickElement(this.compareButton);

      // Wait for navigation to compare page
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("SearchPage.clickCompareButton failed:", error);
      throw error;
    }
  }

  async verifyComparePageHeading() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.comparePageHeading);

      const headingText = await this.page.textContent(this.comparePageHeading);
      const trimmedHeading = headingText.trim();

      return trimmedHeading === "Comparing Influencers";
    } catch (error) {
      console.error("SearchPage.verifyComparePageHeading failed:", error);
      return false;
    }
  }

  async isCompareButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.compareButton);
    } catch (error) {
      console.error("SearchPage.isCompareButtonVisible failed:", error);
      return false;
    }
  }

  async isOnComparePage() {
    try {
      const currentUrl = this.page.url();
      const hasCompareInUrl = currentUrl.includes("/compare");
      const hasCorrectHeading = await this.verifyComparePageHeading();

      return hasCompareInUrl && hasCorrectHeading;
    } catch (error) {
      console.error("SearchPage.isOnComparePage failed:", error);
      return false;
    }
  }

  // **FIXED** - Campaign Functionality with SPECIFIC selectors
  async clickCampaignButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.campaignButton);
      await this.testHelper.clickElement(this.campaignButton);

      // **FIX** - Wait for specific campaign dropdown instead of generic one
      await this.testHelper.waitForElementToBeVisible(this.campaignDropdown);
    } catch (error) {
      console.error("SearchPage.clickCampaignButton failed:", error);
      throw error;
    }
  }

  async clickSelectCampaignDropdown() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.campaignDropdown);
      await this.testHelper.clickElement(this.campaignDropdown);

      // Wait for search input to appear
      await this.testHelper.waitForElementToBeVisible(this.campaignSearchInput);
    } catch (error) {
      console.error("SearchPage.clickSelectCampaignDropdown failed:", error);
      throw error;
    }
  }

  async searchAndSelectCampaign(campaignName) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.campaignSearchInput);

      // Clear and search
      await this.page.fill(this.campaignSearchInput, "");
      await this.testHelper.waitForElementToBeEnabled(this.campaignSearchInput);

      // Type campaign name
      for (const char of campaignName) {
        await this.page.type(this.campaignSearchInput, char, { delay: 100 });
      }

      await this.page.waitForTimeout(1500);

      // Wait for search results
      await this.page.waitForFunction(() => document.querySelectorAll(".form-selectable-results-item").length > 0, null, { timeout: 10000 });

      const allResults = this.page.locator(this.campaignSearchResults);
      const resultCount = await allResults.count();
      let matched = false;

      // Strategy 1: Look for campaign name anywhere in the text (not just exact match)
      for (let i = 0; i < resultCount; i++) {
        const item = allResults.nth(i);
        const text = (await item.innerText()).trim();

        // Check if the campaign name is contained within the text (case insensitive)
        if (text.toLowerCase().includes(campaignName.trim().toLowerCase())) {
          // Exclude the "Would you like to create" option
          if (!text.toLowerCase().includes("would you like to create")) {
            await item.click();
            matched = true;
            break;
          }
        }
      }

      // Strategy 2: Keyboard navigation fallback
      if (!matched) {
        // Use page.keyboard instead of locator.press()
        await this.page.keyboard.press("ArrowDown");
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press("Enter");
        matched = true;
      }

      // Wait for selection to register
      await this.page.waitForTimeout(500);
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("SearchPage.searchAndSelectCampaign failed:", error);
      throw error;
    }
  }

  async clickConfirmButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.confirmButton);
      await this.testHelper.clickElement(this.confirmButton);

      // Wait for navigation back to profile page
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("SearchPage.clickConfirmButton failed:", error);
      throw error;
    }
  }

  async verifyCampaignInRecentActivity(campaignName) {
    try {
      // Wait a moment for recent activity to update
      await this.page.waitForTimeout(2000);

      // **FIX** - Find all campaign links and check for the specific campaign name
      const allCampaignLinks = this.page.locator('a[href*="/campaigns/"]');
      const linkCount = await allCampaignLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = allCampaignLinks.nth(i);
        const linkText = await link.textContent();
        const trimmedText = linkText.trim();

        if (trimmedText === campaignName) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("SearchPage.verifyCampaignInRecentActivity failed:", error);
      return false;
    }
  }

  async isCampaignButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.campaignButton);
    } catch (error) {
      console.error("SearchPage.isCampaignButtonVisible failed:", error);
      return false;
    }
  }

  async isCampaignDropdownVisible() {
    try {
      return await this.testHelper.isElementVisible(this.campaignDropdown);
    } catch (error) {
      console.error("SearchPage.isCampaignDropdownVisible failed:", error);
      return false;
    }
  }

  async isCampaignSearchInputVisible() {
    try {
      return await this.testHelper.isElementVisible(this.campaignSearchInput);
    } catch (error) {
      console.error("SearchPage.isCampaignSearchInputVisible failed:", error);
      return false;
    }
  }

  async isConfirmButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.confirmButton);
    } catch (error) {
      console.error("SearchPage.isConfirmButtonVisible failed:", error);
      return false;
    }
  }

  // **NEW METHODS** - List Functionality (Inspired by listPage.js humanized approach)
  async clickListButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.listButton);
      await this.testHelper.clickElement(this.listButton);

      // Wait for specific list dropdown instead of generic one
      await this.testHelper.waitForElementToBeVisible(this.listDropdown);
    } catch (error) {
      console.error("SearchPage.clickListButton failed:", error);
      throw error;
    }
  }

  async clickSelectListDropdown() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.listDropdown);
      await this.testHelper.clickElement(this.listDropdown);

      // Wait for search input to appear
      await this.testHelper.waitForElementToBeVisible(this.listSearchInput);
    } catch (error) {
      console.error("SearchPage.clickSelectListDropdown failed:", error);
      throw error;
    }
  }

  async searchAndSelectList(listName) {
    try {
      // Humanized approach inspired by listPage.js
      await this.testHelper.waitForElementToBeVisible(this.listSearchInput);

      // Clear and enable the search input
      await this.page.fill(this.listSearchInput, "");
      await this.testHelper.waitForElementToBeEnabled(this.listSearchInput);

      // Humanized typing - character by character like in listPage.js
      for (const char of listName) {
        await this.page.type(this.listSearchInput, char, { delay: 100 });
      }

      // Wait for search results to populate
      await this.page.waitForTimeout(1500);

      // Wait for search results with robust strategy (like listPage.js)
      await this.page.waitForFunction(
        () => {
          return document.querySelectorAll(".form-selectable-results-item").length > 0;
        },
        null,
        { timeout: 10000 }
      );

      const allResults = this.page.locator(this.listSearchResults);
      const resultCount = await allResults.count();
      let matched = false;

      // Strategy 1: Exact match search (like listPage.js)
      for (let i = 0; i < resultCount; i++) {
        const item = allResults.nth(i);
        const text = (await item.innerText()).trim();

        if (text.toLowerCase() === listName.trim().toLowerCase()) {
          await item.click();
          matched = true;
          break;
        }
      }

      // Strategy 2: Fallback - Arrow down + Enter (like listPage.js)
      if (!matched) {
        await this.page.keyboard.press("ArrowDown");
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press("Enter");
        matched = true;
      }

      // Wait for selection to register
      await this.page.waitForTimeout(500);
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("SearchPage.searchAndSelectList failed:", error);
      throw error;
    }
  }

  // **FIXED** - Add button click with better navigation handling
  async clickAddButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.addButton);

      // **FIX** - Handle potential page navigation more robustly
      try {
        // Click the add button and wait for either navigation or modal close
        await Promise.race([
          this.testHelper.clickElement(this.addButton),
          this.page.waitForNavigation({ timeout: 10000 }),
          this.page.waitForURL("**/selena-gomez**", { timeout: 10000 }),
        ]);
      } catch (navigationError) {
        // If navigation fails, try direct click
        await this.page.click(this.addButton);
      }

      // **FIX** - Wait for page to stabilize instead of immediate navigation check
      await this.page.waitForLoadState("domcontentloaded");
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("SearchPage.clickAddButton failed:", error);
      throw error;
    }
  }

  // **FIXED** - Improved recent activity verification with better error handling
  async verifyListInRecentActivity(listName) {
    try {
      // **FIX** - Check if page is still valid
      try {
        await this.page.url(); // Test if page context is still valid
      } catch (error) {
        console.error("Page context lost, cannot verify recent activity");
        return false;
      }

      // Wait longer for recent activity to update after add operation
      await this.page.waitForTimeout(3000);

      // **FIX** - More robust list link finding
      try {
        const allListLinks = this.page.locator('a[href*="/lists/"]');
        const linkCount = await allListLinks.count();

        for (let i = 0; i < linkCount; i++) {
          const link = allListLinks.nth(i);
          const linkText = await link.textContent();
          const trimmedText = linkText.trim();

          if (trimmedText === listName) {
            return true;
          }
        }

        return false;
      } catch (linkError) {
        console.error("Error finding list links:", linkError);
        return false;
      }
    } catch (error) {
      console.error("SearchPage.verifyListInRecentActivity failed:", error);
      return false;
    }
  }

  async isListButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.listButton);
    } catch (error) {
      console.error("SearchPage.isListButtonVisible failed:", error);
      return false;
    }
  }

  async isListDropdownVisible() {
    try {
      return await this.testHelper.isElementVisible(this.listDropdown);
    } catch (error) {
      console.error("SearchPage.isListDropdownVisible failed:", error);
      return false;
    }
  }

  async isListSearchInputVisible() {
    try {
      return await this.testHelper.isElementVisible(this.listSearchInput);
    } catch (error) {
      console.error("SearchPage.isListSearchInputVisible failed:", error);
      return false;
    }
  }

  async isAddButtonVisible() {
    try {
      return await this.testHelper.isElementVisible(this.addButton);
    } catch (error) {
      console.error("SearchPage.isAddButtonVisible failed:", error);
      return false;
    }
  }
}

export { SearchPage };
