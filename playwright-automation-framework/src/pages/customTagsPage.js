const { TestHelper } = require("../utils/testHelper");

class CustomTagsPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(page);

    // ---------- Locators ----------
    // Left-rail link in the Manage Account area
    this.customTagsMenuItem = '//span[@class="section-item-title" and normalize-space()="Custom Tags"]';

    // "Add a Tag" button (modal trigger)
    this.addTagBtn = 'a[data-action="create-tag"][data-trigger="modal"]';

    // **UPDATED** - More specific modal selectors
    this.tagCreationModal = ".modal.modal-active:not(#modal-amplify-trial):not(#modal-amplify-inactive):not(#modal-amplify-trialended)";

    // **BETTER APPROACH** - Target form elements directly instead of modal container
    this.tagNameInput = "input#display_name";
    this.tagDescriptionInput = "input#description";

    // Submit button in modal
    this.createTagBtn = 'button[type="submit"].btn.btn-primary';

    // Page-level assertion helpers
    this.expectedTitlePart = "Tags";
  }

  // ---------- Navigation ----------
  async openCustomTagsPage() {
    try {
      await this.testHelper.clickElement(this.customTagsMenuItem);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("CustomTagsPage.openCustomTagsPage failed:", error);
      throw error;
    }
  }

  async isOnCustomTagsPage() {
    try {
      const title = await this.page.title();
      const url = this.page.url();
      return title.includes(this.expectedTitlePart) && url.includes("/tags");
    } catch (error) {
      console.error("CustomTagsPage.isOnCustomTagsPage failed:", error);
      return false;
    }
  }

  // ---------- Tag creation ----------
  async clickAddTagButton() {
    try {
      await this.testHelper.clickElement(this.addTagBtn);
      // **UPDATED** - Wait for form elements instead of generic modal
      await this.testHelper.waitForElementToBeVisible(this.tagNameInput);
    } catch (error) {
      console.error("CustomTagsPage.clickAddTagButton failed:", error);
      throw error;
    }
  }

  // **UPDATED** - Check for form visibility instead of modal
  async isModalOpen() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.tagNameInput);
      await this.testHelper.waitForElementToBeVisible(this.tagDescriptionInput);
      return (await this.page.isVisible(this.tagNameInput)) && (await this.page.isVisible(this.tagDescriptionInput));
    } catch (error) {
      console.error("CustomTagsPage.isModalOpen failed:", error);
      return false;
    }
  }

  async createTag(tagName, description) {
    try {
      // **UPDATED** - Direct form interaction without modal dependency
      await this.testHelper.waitForElementToBeVisible(this.tagNameInput);
      await this.testHelper.waitForElementToBeVisible(this.tagDescriptionInput);
      await this.testHelper.waitForElementToBeEnabled(this.createTagBtn);

      // Fill form fields
      await this.testHelper.fillText(this.tagNameInput, tagName);
      await this.testHelper.fillText(this.tagDescriptionInput, description);

      // Submit form
      await this.testHelper.clickElement(this.createTagBtn);
      await this.testHelper.waitForNavigation();

      // Add a small delay for page to stabilize
      await this.page.waitForTimeout(1000);

      /* NEW LINE 👇 — persist the tag so other tests can read it */
      const helpers = require("../utils/helpers");
      helpers.saveTempValue("lastCreatedTag", tagName);
    } catch (error) {
      console.error("CustomTagsPage.createTag failed:", error);
      throw error;
    }
  }

  // 🔧 FIXED: Removed redundant waitForNavigation() call
  async isOnTagCreatedSuccessPage() {
    try {
      // Don't wait for navigation again - it was already handled in createTag()
      // Just check if we're on the correct page

      // Add a small wait for page to be ready
      await this.page.waitForLoadState("domcontentloaded");

      const title = await this.page.title();
      const url = this.page.url();

      // Success indicators: Back on tags page after creation
      return title.includes(this.expectedTitlePart) && url.includes("/tags");
    } catch (error) {
      console.error("CustomTagsPage.isOnTagCreatedSuccessPage failed:", error);
      return false;
    }
  }

  async getCurrentPageTitle() {
    try {
      return await this.page.title();
    } catch (error) {
      console.error("CustomTagsPage.getCurrentPageTitle failed:", error);
      return "";
    }
  }
}

module.exports = { CustomTagsPage };
