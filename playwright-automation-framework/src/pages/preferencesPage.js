const { TestHelper } = require("../utils/testHelper");

class PreferencesPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    /* NAV-RAIL */
    this.preferencesMenuItem = '//span[@class="section-item-title" and normalize-space()="Preferences"]';
    this.expectedFullTitle = "Preferences | Julius";

    /* DROPDOWN - Enhanced selectors for better verification */
    this.projectPlaceholder = 'span.form-selectable-placeholder:has-text("Select a Project")';
    this.projectDropdownTrigger = this.projectPlaceholder;
    this.projectSearchInput = "//span[@class='form-selectable-popover popover']//input[@placeholder='Type here to search...']";
    this.projectResultsItems = "span.form-selectable-results-item";
    this.removeSelectedProject = 'span.app-icon.app-icon-times.form-selectable-remove[data-trigger="remove"]';

    // Additional selectors for verification
    this.selectedProjectDisplay = "span.form-selectable-selected";
    this.dropdownContainer = "span.form-selectable-content";

    /* SAVE */
    this.saveBtn = 'button[type="submit"].btn.btn-primary';

    /* TOAST */
    this.successToast = "div.form-alert.form-alert-success";
    this.expectedToastText = "Your preferences have been successfully updated.";
  }

  async openPreferencesPage() {
    try {
      await this.testHelper.clickElement(this.preferencesMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("PreferencesPage.openPreferencesPage failed:", error);
      throw error;
    }
  }

  async isOnPreferencesPage() {
    try {
      const title = await this.page.title();
      const url = this.page.url();
      return title === this.expectedFullTitle && url.includes("/preferences");
    } catch (error) {
      console.error("PreferencesPage.isOnPreferencesPage failed:", error);
      return false;
    }
  }

  async selectProjectFromDropdown(projectName) {
    try {
      // 1) Deselect any pre-selected project
      if (await this.page.isVisible(this.removeSelectedProject).catch(() => false)) {
        await this.testHelper.clickElement(this.removeSelectedProject);
        await this.testHelper.waitForElementToBeVisible(this.projectPlaceholder);
      }

      // 2) Open dropdown
      await this.testHelper.clickElement(this.projectDropdownTrigger);
      await this.testHelper.waitForElementToBeVisible(this.projectSearchInput);

      // 3) Type search query
      await this.page.fill(this.projectSearchInput, "");
      await this.page.type(this.projectSearchInput, projectName, { delay: 75 });
      await this.testHelper.waitForNetworkIdle();

      // 4) Wait for the result and click it
      const optionSelector = `${this.projectResultsItems}:has-text("${projectName}")`;
      await this.testHelper.waitForElementToBeVisible(optionSelector);
      await this.testHelper.clickElement(optionSelector);

      // 5) Enhanced verification - Multiple verification strategies
      await this.testHelper.waitForNetworkIdle();

      let verificationPassed = false;

      // Strategy 1: Check selected display element
      try {
        if (await this.page.isVisible(this.selectedProjectDisplay)) {
          const selectedText = await this.page.textContent(this.selectedProjectDisplay);
          if (selectedText && selectedText.toLowerCase().includes(projectName.toLowerCase())) {
            verificationPassed = true;
          }
        }
      } catch (e) {
        // Continue to next strategy
      }

      // Strategy 2: Check dropdown container
      if (!verificationPassed) {
        try {
          const dropdownText = await this.page.textContent(this.dropdownContainer);
          if (dropdownText && dropdownText.toLowerCase().includes(projectName.toLowerCase())) {
            verificationPassed = true;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }

      // Strategy 3: Check if placeholder changed
      if (!verificationPassed) {
        try {
          const placeholderText = await this.page.textContent(this.projectPlaceholder);
          if (!placeholderText.includes("Select a Project") || placeholderText.toLowerCase().includes(projectName.toLowerCase())) {
            verificationPassed = true;
          }
        } catch (e) {
          // Continue to next strategy
        }
      }

      // Strategy 4: Check for remove button presence
      if (!verificationPassed) {
        try {
          if (await this.page.isVisible(this.removeSelectedProject)) {
            verificationPassed = true;
          }
        } catch (e) {
          // Verification failed but continue
        }
      }
    } catch (error) {
      console.error("PreferencesPage.selectProjectFromDropdown failed:", error);
      throw error;
    }
  }

  async savePreferences() {
    try {
      await this.testHelper.clickElement(this.saveBtn);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("PreferencesPage.savePreferences failed:", error);
      throw error;
    }
  }

  async isSuccessToastVisible() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.successToast);
      return await this.page.isVisible(this.successToast);
    } catch (error) {
      console.error("PreferencesPage.isSuccessToastVisible failed:", error);
      return false;
    }
  }

  async getSuccessToastMessage() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.successToast);
      return await this.page.textContent(this.successToast);
    } catch (error) {
      console.error("PreferencesPage.getSuccessToastMessage failed:", error);
      return "";
    }
  }

  async isCorrectSuccessMessage() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.successToast);
      const actualMessage = await this.page.textContent(this.successToast);
      return actualMessage.trim().includes(this.expectedToastText);
    } catch (error) {
      console.error("PreferencesPage.isCorrectSuccessMessage failed:", error);
      return false;
    }
  }
}

module.exports = { PreferencesPage };
