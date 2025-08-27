const { TestHelper } = require("../utils/testHelper");

class ManageAccountPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.avatarIcon = "span.avatar-gravatar";
    this.manageAccountLink = '//a[normalize-space()="Manage Account"]';
    this.expectedTitlePart = "Profile";

    // Amplify related selectors
    this.amplifyDashboardLink = 'a.action-menu-item-link.header-user-actions-item-link[data-amplify-status="amplify_trial_available"]';

    // More specific selectors for different modal scenarios
    this.amplifyPopupModals = [
      '#modal-amplify-inactive a[href="https://julius.amplify.ai"][target="_blank"]',
      '#modal-amplify-trialended a[href="https://julius.amplify.ai"][target="_blank"]',
      'a[href="https://julius.amplify.ai"][target="_blank"]',
    ];

    // Profile form selectors
    this.firstNameInput = "input#first_name";
    this.lastNameInput = "input#last_name";
    this.jobTitleInput = "input#job_title";
    this.updateProfileButton = "button.group-form-submit.btn.btn-primary";
    this.successMessage = "div.form-alert.form-alert-success";
  }

  async openUserMenu() {
    await this.testHelper.clickElement(this.avatarIcon);
  }

  async clickManageAccount() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.manageAccountLink);
      const manageAccount = this.page.locator(this.manageAccountLink);
      await manageAccount.scrollIntoViewIfNeeded();
      await this.testHelper.clickElement(this.manageAccountLink);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("Error clicking manage account:", error);
      throw error;
    }
  }

  async clickAmplifyDashboard() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.amplifyDashboardLink);
      const amplifyDashboard = this.page.locator(this.amplifyDashboardLink);
      await amplifyDashboard.scrollIntoViewIfNeeded();
      await this.testHelper.clickElement(this.amplifyDashboardLink);
    } catch (error) {
      console.error("Error clicking amplify dashboard:", error);
      throw error;
    }
  }

  async navigateToAmplifyPageAndVerifyTitle() {
    try {
      // Wait a moment for any modal to appear
      await this.page.waitForTimeout(2000);

      // Try to find the correct amplify link from different possible modals
      let amplifyUrl = null;
      let clickableElement = null;

      for (const selector of this.amplifyPopupModals) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 3000 })) {
            amplifyUrl = await element.getAttribute("href");
            clickableElement = element;

            break;
          }
        } catch (error) {
          console.log(`Selector ${selector} not found or not visible`);
          continue;
        }
      }

      if (!amplifyUrl) {
        throw new Error("No visible Amplify.ai link found in any modal");
      }

      // Open new tab with the amplify URL
      const newTab = await this.page.context().newPage();
      await newTab.goto(amplifyUrl);
      await this.testHelper.waitForNavigation();

      // Get the title of the new page
      const pageTitle = await newTab.title();

      // Close the new tab
      await newTab.close();

      return pageTitle;
    } catch (error) {
      console.error("Error navigating to amplify page:", error);
      throw error;
    }
  }

  async isOnManageAccountPage() {
    try {
      await this.testHelper.waitForNavigation();
      const currentURL = this.page.url();
      const title = await this.page.title();
      return currentURL.includes("/profile") && title.includes(this.expectedTitlePart);
    } catch (error) {
      console.error("Error checking manage account page:", error);
      return false;
    }
  }

  async updateProfile(firstName, lastName, jobTitle) {
    try {
      await this.testHelper.fillText(this.firstNameInput, firstName);
      await this.testHelper.fillText(this.lastNameInput, lastName);
      await this.testHelper.fillText(this.jobTitleInput, jobTitle);
      await this.testHelper.clickElement(this.updateProfileButton);
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async isProfileUpdateSuccessMessageVisible() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.successMessage);
      return await this.page.isVisible(this.successMessage);
    } catch (error) {
      console.error("Error checking success message:", error);
      return false;
    }
  }
}

module.exports = { ManageAccountPage };
