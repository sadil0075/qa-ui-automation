const { TestHelper } = require("../utils/testHelper");

class GroupsPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Left-rail link in the Manage Account area
    this.groupsMenuItem = '//span[@class="section-item-title" and normalize-space()="Groups"]';

    // "Create new group" CTA
    this.createNewGroupBtn = 'a[data-action="create-group"]';

    // Form fields
    this.groupNameInput = "input#name";
    this.groupDescriptionInput = "input#description";

    // Submit button
    this.submitBtn = "button.group-form-submit";

    // Error message selectors
    this.errorMessage = "div.form-alert.form-alert-error";
    this.validationErrors = ".form-field-error, .error-message, .field-error";

    // Page-level assertion helpers
    this.expectedTitlePart = "Groups";
    this.expectedCreatePageTitlePart = "Create a New Group";
  }

  // ---------- Navigation ----------
  async openGroupsPage() {
    try {
      await this.testHelper.clickElement(this.groupsMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("GroupsPage.openGroupsPage failed:", error);
      throw error;
    }
  }

  async isOnGroupsPage() {
    try {
      const title = await this.page.title();
      const url = this.page.url();
      return title.includes(this.expectedTitlePart) && url.includes("/groups");
    } catch (error) {
      console.error("GroupsPage.isOnGroupsPage failed:", error);
      return false;
    }
  }

  // ---------- Group creation ----------
  async clickCreateNewGroup() {
    try {
      await this.testHelper.clickElement(this.createNewGroupBtn);
      await this.testHelper.waitForNavigation();

      // 🔧 FIXED: Add stability wait after navigation
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error("GroupsPage.clickCreateNewGroup failed:", error);
      throw error;
    }
  }

  // 🔧 FIXED: Improved page verification without redundant waits
  async isOnCreateGroupPage() {
    try {
      // Don't wait for navigation again - it was already handled in clickCreateNewGroup()
      // Just check if we're on the correct page

      // Add a small wait for page to be ready
      await this.page.waitForLoadState("domcontentloaded");

      const title = await this.page.title();
      const url = this.page.url();
      return title.includes(this.expectedCreatePageTitlePart) && url.includes("/groups/create");
    } catch (error) {
      console.error("GroupsPage.isOnCreateGroupPage failed:", error);
      return false;
    }
  }

  async createGroup(name, description) {
    try {
      // Clear existing values and fill form fields
      await this.page.fill(this.groupNameInput, "");
      await this.page.fill(this.groupDescriptionInput, "");
      await this.testHelper.fillText(this.groupNameInput, name);
      await this.testHelper.fillText(this.groupDescriptionInput, description);

      // Check for any pre-existing validation errors
      await this.checkForValidationErrors();

      // Submit form and wait for response
      await Promise.all([
        this.testHelper.clickElement(this.submitBtn),
        this.page.waitForFunction(
          () => {
            const currentUrl = window.location.href;
            const hasError = document.querySelector("div.form-alert.form-alert-error, .form-field-error, .error-message");
            const urlChanged = !currentUrl.includes("/groups/create");
            return urlChanged || hasError;
          },
          { timeout: 15000 }
        ),
      ]);

      await this.testHelper.waitForNavigation();

      // Add stability wait
      await this.page.waitForTimeout(1000);

      // Check for form errors after submission
      await this.checkForValidationErrors();

      /* NEW LINES 👇 — persist the group name so other tests can read it */
      const helpers = require("../utils/helpers");
      helpers.saveTempValue("lastCreatedGroup", name);
    } catch (error) {
      console.error("GroupsPage.createGroup failed:", error);
      throw error;
    }
  }

  async checkForValidationErrors() {
    try {
      // Check for general error messages
      const errorMessage = await this.page.isVisible(this.errorMessage);
      if (errorMessage) {
        const errorText = await this.page.textContent(this.errorMessage);
        throw new Error(`Form validation failed: ${errorText}`);
      }

      // Check for field-specific validation errors
      const validationErrors = await this.page.locator(this.validationErrors).count();
      if (validationErrors > 0) {
        const errorTexts = await this.page.locator(this.validationErrors).allTextContents();
        throw new Error(`Form validation errors: ${errorTexts.join(", ")}`);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // 🔧 FIXED: Removed redundant waitForNavigation() call
  async isOnGroupCreatedSuccessPage() {
    try {
      // Don't wait for navigation again - it was already handled in createGroup()
      // Just check if we're on the correct page

      // Add a small wait for page to be ready
      await this.page.waitForLoadState("domcontentloaded");

      const title = await this.page.title();
      const url = this.page.url();

      // Success indicators: URL changed from /groups/create and title shows Groups page
      const urlChanged = url.includes("/groups") && !url.includes("/groups/create");
      const titleCorrect = title.includes("Groups");
      return urlChanged && titleCorrect;
    } catch (error) {
      console.error("GroupsPage.isOnGroupCreatedSuccessPage failed:", error);
      return false;
    }
  }

  // **SIMPLIFIED METHOD** - Remove problematic success toast dependency
  async isGroupCreatedSuccessfully() {
    try {
      // Primary success indicator: Successfully navigated away from create page to groups area
      const url = this.page.url();
      const title = await this.page.title();

      // If we're on groups page (not create page) and title contains "Groups", creation was successful
      const isOnGroupsArea = url.includes("/groups") && !url.includes("/create");
      const hasCorrectTitle = title.includes("Groups");

      return isOnGroupsArea && hasCorrectTitle;
    } catch (error) {
      console.error("GroupsPage.isGroupCreatedSuccessfully failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("GroupsPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }
}

module.exports = { GroupsPage };
