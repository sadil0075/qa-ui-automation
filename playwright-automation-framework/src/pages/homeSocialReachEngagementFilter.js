const { TestHelper } = require("../utils/testHelper");

// Class representing the Home Social Reach & Engagement Filter Page and its functionalities
class HomeSocialReachEngagementFilterPage {
  // Constructor to initialize page elements and selectors for the social reach & engagement filter
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Overall filter elements - using specific CSS selectors to avoid strict mode violation
    this.overallFilterButton = '#search-refine .search-demographic-filter-title:text("Overall")';
    this.overallFilterValue =
      '#search-refine .search-demographic-filter:has(.search-demographic-filter-title:text("Overall")) .search-demographic-filter-value';

    // Filter options container for Overall filter
    this.filterOptionsContainer =
      '#search-refine .search-demographic-filter:has(.search-demographic-filter-title:text("Overall")) .search-demographic-filter-options';

    // Reach elements
    this.reachToggleLabel = 'label.form-toggle.form-toggle-switch.search-filter-pricing-switch:has(input[name="reach.active"])';
    this.reachToggleInput = 'input[name="reach.active"]';
    this.reachMinInput = 'input[name="reach.min"]';

    // Average Engagement elements
    this.engagementToggleLabel = 'label.form-toggle.form-toggle-switch.search-filter-pricing-switch:has(input[name="engagement.active"])';
    this.engagementToggleInput = 'input[name="engagement.active"]';
    this.engagementMinInput = 'input[name="engagement.min"]';

    // Filter actions
    this.saveButton = ".btn.btn-primary.search-filter-action-save";
    this.cancelButton = ".btn.btn-cancel.search-filter-action-cancel";
  }

  // Method to click on the Overall filter button
  async clickOverallFilter() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.overallFilterButton);
      await this.testHelper.clickElement(this.overallFilterButton);

      // Wait for the filter options to be visible
      await this.testHelper.waitForElementToBeVisible(this.filterOptionsContainer);
    } catch (error) {
      console.error("Error clicking Overall filter:", error);
      throw error;
    }
  }

  // Method to enable/disable reach toggle
  async toggleReach(enable = true) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.reachToggleLabel);

      const isChecked = await this.page.isChecked(this.reachToggleInput);

      if (isChecked !== enable) {
        await this.testHelper.clickElement(this.reachToggleLabel);
        await this.page.waitForTimeout(500); // Small wait for toggle animation
      }

      // Verify the toggle state
      const finalState = await this.page.isChecked(this.reachToggleInput);
      if (finalState !== enable) {
        throw new Error(`Failed to ${enable ? "enable" : "disable"} reach toggle`);
      }
    } catch (error) {
      console.error("Error toggling reach:", error);
      throw error;
    }
  }

  // Method to set reach minimum value
  async setReachMinValue(value) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.reachMinInput);

      // Clear existing value and set new value
      await this.page.fill(this.reachMinInput, "");
      await this.page.type(this.reachMinInput, value.toString());

      // Verify the value was set
      const actualValue = await this.page.inputValue(this.reachMinInput);
      if (actualValue !== value.toString()) {
        throw new Error(`Failed to set reach min value. Expected: ${value}, Actual: ${actualValue}`);
      }
    } catch (error) {
      console.error("Error setting reach min value:", error);
      throw error;
    }
  }

  // Method to enable/disable engagement toggle
  async toggleEngagement(enable = true) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.engagementToggleLabel);

      const isChecked = await this.page.isChecked(this.engagementToggleInput);

      if (isChecked !== enable) {
        await this.testHelper.clickElement(this.engagementToggleLabel);
        await this.page.waitForTimeout(500); // Small wait for toggle animation
      }

      // Verify the toggle state
      const finalState = await this.page.isChecked(this.engagementToggleInput);
      if (finalState !== enable) {
        throw new Error(`Failed to ${enable ? "enable" : "disable"} engagement toggle`);
      }
    } catch (error) {
      console.error("Error toggling engagement:", error);
      throw error;
    }
  }

  // Method to set engagement minimum value
  async setEngagementMinValue(value) {
    try {
      await this.testHelper.waitForElementToBeVisible(this.engagementMinInput);

      // Clear existing value and set new value
      await this.page.fill(this.engagementMinInput, "");
      await this.page.type(this.engagementMinInput, value.toString());

      // Verify the value was set
      const actualValue = await this.page.inputValue(this.engagementMinInput);
      if (actualValue !== value.toString()) {
        throw new Error(`Failed to set engagement min value. Expected: ${value}, Actual: ${actualValue}`);
      }
    } catch (error) {
      console.error("Error setting engagement min value:", error);
      throw error;
    }
  }

  // Method to save the filter selection
  async saveFilter() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.saveButton);
      await this.testHelper.clickElement(this.saveButton);

      // Wait for save action to complete
      await this.page.waitForTimeout(3000);

      // Try to close the dropdown if it's still open
      await this.closeFilterDropdown();
    } catch (error) {
      console.error("Error saving filter:", error);
      throw error;
    }
  }

  // Method to verify the Overall filter value dynamically
  async verifyOverallFilterValue(reachMin, engagementMin) {
    try {
      const expectedValue = `Reach ${reachMin}+ & Avg. Eng ${engagementMin}+`;

      // Wait for the filter value to be updated
      await this.testHelper.waitForElementToBeVisible(this.overallFilterValue);
      await this.page.waitForTimeout(2000); // Additional wait for value to update

      const actualValue = await this.page.textContent(this.overallFilterValue);
      const trimmedValue = actualValue.trim();

      if (trimmedValue !== expectedValue) {
        throw new Error(`Expected overall filter value: "${expectedValue}", but got: "${trimmedValue}"`);
      }

      return true;
    } catch (error) {
      console.error("Error verifying overall filter value:", error);
      throw error;
    }
  }

  // Method to check if the Overall filter is visible - UPDATED TO FIX STRICT MODE VIOLATION
  async isOverallFilterVisible() {
    try {
      return await this.testHelper.isElementVisible(this.overallFilterButton);
    } catch (error) {
      console.error("Error checking Overall filter visibility:", error);
      return false;
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

// Exporting the HomeSocialReachEngagementFilterPage class for external use
module.exports = { HomeSocialReachEngagementFilterPage };
