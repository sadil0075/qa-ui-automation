const { TestHelper } = require("../utils/testHelper");

// Class representing the Home Audience Filter Page and its functionalities
class HomeAudienceFilterPage {
  // Constructor to initialize page elements and selectors for the audience filter
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Platform filter elements
    this.platformFilterButton = "//span[normalize-space()='Platform']";
    this.platformFilterTitle = ".search-demographic-filter-title";
    this.platformFilterValue = "//span[normalize-space()='Platform']/following-sibling::span[@class='search-demographic-filter-value']";

    // More specific filter options container for Platform filter only
    this.filterOptionsContainer = "//span[normalize-space()='Platform']/following-sibling::span[@class='search-demographic-filter-options']";

    // Instagram checkbox elements
    this.instagramCheckbox = 'input[value="ZGVtb2dyYXBoaWNzLnBsYXRmb3JtLmluc3RhZ3JhbXxAfEluc3RhZ3JhbQ=="]';
    this.instagramLabel = 'label[data-value="ZGVtb2dyYXBoaWNzLnBsYXRmb3JtLmluc3RhZ3JhbXxAfEluc3RhZ3JhbQ=="]';

    // Filter actions
    this.saveButton = ".btn.btn-primary.search-filter-action-save";
    this.cancelButton = ".btn.btn-cancel.search-filter-action-cancel";
    this.filterForm = ".search-filter-form";
  }

  // Method to click on the platform filter button
  async clickPlatformFilter() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.platformFilterButton);
      await this.testHelper.clickElement(this.platformFilterButton);

      // Wait for the specific Platform filter options to be visible
      await this.testHelper.waitForElementToBeVisible(this.filterOptionsContainer);
    } catch (error) {
      console.error("Error clicking platform filter:", error);
      throw error;
    }
  }

  // Method to select Instagram platform option
  async selectInstagramPlatform() {
    try {
      // Wait for Instagram checkbox to be visible
      await this.testHelper.waitForElementToBeVisible(this.instagramLabel);

      // Click on the Instagram label to select it
      await this.testHelper.clickElement(this.instagramLabel);

      // Wait a moment for the selection to register
      await this.page.waitForTimeout(1000);

      // Verify the checkbox is checked
      const isChecked = await this.page.isChecked(this.instagramCheckbox);
      if (!isChecked) {
        throw new Error("Instagram checkbox was not selected successfully");
      }
    } catch (error) {
      console.error("Error selecting Instagram platform:", error);
      throw error;
    }
  }

  // Method to save the filter selection
  async saveFilter() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.saveButton);
      await this.testHelper.clickElement(this.saveButton);

      // Instead of waiting for filter options to be hidden,
      // wait for the filter value to be updated or for network activity to complete
      await this.page.waitForTimeout(2000);

      // Optional: Try to close the filter dropdown by clicking outside or pressing Escape
      try {
        await this.page.keyboard.press("Escape");
        await this.page.waitForTimeout(500);
      } catch (escapeError) {
        console.log("Escape key didn't close the dropdown, continuing...");
      }

      // Alternative: Click outside the filter to close it
      try {
        await this.page.click("body", { position: { x: 100, y: 100 } });
        await this.page.waitForTimeout(500);
      } catch (clickError) {
        console.log("Click outside didn't close the dropdown, continuing...");
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      throw error;
    }
  }

  // Method to verify the platform filter value
  async verifyPlatformFilterValue(expectedValue) {
    try {
      // Wait for the platform filter value to be updated
      await this.testHelper.waitForElementToBeVisible(this.platformFilterValue);

      // Wait a bit more for the value to update after save
      await this.page.waitForTimeout(2000);

      const actualValue = await this.page.textContent(this.platformFilterValue);
      const trimmedValue = actualValue.trim();

      if (trimmedValue !== expectedValue) {
        throw new Error(`Expected platform filter value: "${expectedValue}", but got: "${trimmedValue}"`);
      }

      return true;
    } catch (error) {
      console.error("Error verifying platform filter value:", error);
      throw error;
    }
  }

  // Method to check if the platform filter is visible
  async isPlatformFilterVisible() {
    try {
      return await this.testHelper.isElementVisible(this.platformFilterButton);
    } catch (error) {
      console.error("Error checking platform filter visibility:", error);
      return false;
    }
  }

  // Method to get current platform filter value
  async getPlatformFilterValue() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.platformFilterValue);
      const value = await this.page.textContent(this.platformFilterValue);
      return value.trim();
    } catch (error) {
      console.error("Error getting platform filter value:", error);
      return "";
    }
  }

  // Method to close filter dropdown if it's still open
  async closeFilterDropdown() {
    try {
      // Try multiple approaches to close the dropdown
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(500);

      // Click outside the filter area
      await this.page.click("body", { position: { x: 50, y: 50 } });
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log("Could not close filter dropdown, but continuing...");
    }
  }
}

// Exporting the HomeAudienceFilterPage class for external use
module.exports = { HomeAudienceFilterPage };
