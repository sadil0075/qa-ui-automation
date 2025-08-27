const { TestHelper } = require("../utils/testHelper");

// Class representing the Home Sorting Page and its functionalities
class HomeSortingPage {
  // Constructor to initialize page elements and selectors for the sorting functionality
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Sort by dropdown elements - more specific selectors to avoid strict mode violation
    this.sortByDropdown = '.subheader-dropdown-label:has-text("Sort by")';
    this.sortByLabel = '.subheader-dropdown-label:has-text("Sort by")';
    this.sortByValue = '.subheader-dropdown-label:has-text("Sort by") .subheader-dropdown-label-value';

    // Dropdown options - using more specific selectors
    this.reachOption = '.subheader-dropdown-item-title:text("Reach")';
    this.trendingOption = '.subheader-dropdown-item-title:text("Trending")';

    // Dropdown container - more specific to the Sort by dropdown
    this.dropdownContainer = '.subheader-dropdown:has(.subheader-dropdown-label:has-text("Sort by")) .subheader-dropdown-content';
  }

  // Method to click on the Sort by dropdown
  async clickSortByDropdown() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.sortByDropdown);
      await this.testHelper.clickElement(this.sortByDropdown);

      // Wait for the specific Sort by dropdown options to be visible
      await this.page.waitForTimeout(1000); // Small wait for dropdown animation

      // Check if dropdown is open by looking for Reach option
      await this.testHelper.waitForElementToBeVisible(this.reachOption);
    } catch (error) {
      console.error("Error clicking Sort by dropdown:", error);
      throw error;
    }
  }

  // Method to select Reach option from the dropdown
  async selectReachOption() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.reachOption);
      await this.testHelper.clickElement(this.reachOption);

      // Wait for the dropdown to close and value to update
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error("Error selecting Reach option:", error);
      throw error;
    }
  }

  // Method to verify the Sort by value
  async verifySortByValue(expectedValue) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.sortByValue);

      // Wait a bit more for the value to update
      await this.page.waitForTimeout(1000);

      const actualValue = await this.page.textContent(this.sortByValue);
      const trimmedValue = actualValue.trim();

      if (trimmedValue !== expectedValue) {
        throw new Error(`Expected sort by value: "${expectedValue}", but got: "${trimmedValue}"`);
      }

      return true;
    } catch (error) {
      console.error("Error verifying sort by value:", error);
      throw error;
    }
  }

  // Method to get current sort by value
  async getCurrentSortByValue() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.sortByValue);
      const value = await this.page.textContent(this.sortByValue);
      return value.trim();
    } catch (error) {
      console.error("Error getting current sort by value:", error);
      return "";
    }
  }

  // Method to check if Sort by dropdown is visible
  async isSortByDropdownVisible() {
    try {
      return await this.testHelper.isElementVisible(this.sortByDropdown);
    } catch (error) {
      console.error("Error checking Sort by dropdown visibility:", error);
      return false;
    }
  }

  // Method to check if Reach option is available in dropdown
  async isReachOptionVisible() {
    try {
      return await this.testHelper.isElementVisible(this.reachOption);
    } catch (error) {
      console.error("Error checking Reach option visibility:", error);
      return false;
    }
  }
}

// Exporting the HomeSortingPage class for external use
module.exports = { HomeSortingPage };
