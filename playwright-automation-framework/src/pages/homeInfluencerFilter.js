const { TestHelper } = require("../utils/testHelper");

// Class representing the Home Influencer Filter Page and its functionalities
class HomeInfluencerFilterPage {
  // Constructor to initialize page elements and selectors for the influencer filter
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Interest filter elements - more specific selectors to avoid strict mode violation
    this.interestDropdown = '.search-bar-filter-label:has-text("Interest")';
    this.interestFilterValue = '.search-bar-filter:has(.search-bar-filter-label:has-text("Interest")) .search-bar-filter-value';

    // Fashion checkbox elements
    this.fashionCheckbox = 'input[value="aW50ZXJlc3QuZmFzaGlvbnxAfEZhc2hpb24="]';
    this.fashionCheckboxLabel = 'label.form-toggle.form-toggle-checkbox:has(input[value="aW50ZXJlc3QuZmFzaGlvbnxAfEZhc2hpb24="])';

    // Filter actions
    this.saveButton = ".btn.btn-primary.search-filter-action-save";
    this.cancelButton = ".btn.btn-cancel.search-filter-action-cancel";

    // Filter dropdown container
    this.filterDropdownContainer = ".search-bar-filter-dropdown";
  }

  // Method to click on the Interest dropdown
  async clickInterestDropdown() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.interestDropdown);
      await this.testHelper.clickElement(this.interestDropdown);

      // Simple wait for dropdown animation
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error("Error clicking Interest dropdown:", error);
      throw error;
    }
  }

  // Method to select Fashion checkbox from suggestions
  async selectFashionCheckbox() {
    try {
      // Try multiple approaches to find the Fashion checkbox
      let checkboxFound = false;

      // Approach 1: Wait for the specific checkbox
      try {
        await this.testHelper.waitForElementToBeVisible(this.fashionCheckboxLabel);
        checkboxFound = true;
      } catch (error) {
        console.log("Specific Fashion checkbox not found, trying alternatives...");
      }

      // Approach 2: Try to find by text content
      if (!checkboxFound) {
        try {
          await this.page.waitForSelector("text=Fashion", { timeout: 5000 });
          this.fashionCheckboxLabel = "text=Fashion";
          checkboxFound = true;
        } catch (error) {
          console.log("Fashion text not found, trying next approach...");
        }
      }

      // Approach 3: Try to find any checkbox with Fashion
      if (!checkboxFound) {
        try {
          await this.page.waitForSelector('label:has-text("Fashion")', { timeout: 5000 });
          this.fashionCheckboxLabel = 'label:has-text("Fashion")';
          checkboxFound = true;
        } catch (error) {
          console.log("Fashion label not found...");
        }
      }

      if (!checkboxFound) {
        throw new Error("Fashion checkbox not found with any approach");
      }

      // Click on the Fashion checkbox
      await this.testHelper.clickElement(this.fashionCheckboxLabel);

      // Wait for selection to register
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error("Error selecting Fashion checkbox:", error);
      throw error;
    }
  }

  // Method to click the Save button
  async clickSaveButton() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.saveButton);
      await this.testHelper.clickElement(this.saveButton);

      // Wait for the save action to complete
      await this.page.waitForTimeout(2000);

      // Wait for network to be idle
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Error clicking Save button:", error);
      throw error;
    }
  }

  // Method to verify the Interest filter heading - FIXED TO AVOID STRICT MODE VIOLATION
  async verifyInterestFilterHeading(expectedValue) {
    try {
      // Use more specific selector that targets only the Interest filter's value
      await this.testHelper.waitForElementToBeVisible(this.interestFilterValue);

      // Wait a bit for the value to update
      await this.page.waitForTimeout(1000);

      const actualValue = await this.page.textContent(this.interestFilterValue);
      const trimmedValue = actualValue.trim();

      if (trimmedValue !== expectedValue) {
        throw new Error(`Expected interest filter heading: "${expectedValue}", but got: "${trimmedValue}"`);
      }

      return true;
    } catch (error) {
      console.error("Error verifying interest filter heading:", error);
      throw error;
    }
  }

  // Method to check if Interest dropdown is visible
  async isInterestDropdownVisible() {
    try {
      return await this.testHelper.isElementVisible(this.interestDropdown);
    } catch (error) {
      console.error("Error checking Interest dropdown visibility:", error);
      return false;
    }
  }

  // Method to check if Fashion checkbox is available
  async isFashionCheckboxVisible() {
    try {
      return await this.testHelper.isElementVisible(this.fashionCheckboxLabel);
    } catch (error) {
      console.error("Error checking Fashion checkbox visibility:", error);
      return false;
    }
  }

  // Method to get current interest filter value - ALSO FIXED
  async getCurrentInterestFilterValue() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.interestFilterValue);
      const value = await this.page.textContent(this.interestFilterValue);
      return value.trim();
    } catch (error) {
      console.error("Error getting current interest filter value:", error);
      return "";
    }
  }
}

// Exporting the HomeInfluencerFilterPage class for external use
module.exports = { HomeInfluencerFilterPage };
