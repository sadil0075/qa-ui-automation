const { TestHelper } = require("../utils/testHelper");

// Class representing the Home Page and its functionalities
class HomePage {
  // Constructor to initialize page elements and selectors for the home page
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Home page elements
    this.helpLink = 'a[href="http://get.julius.help/"][target="_blank"]';
    this.careersLink = 'a[href="https://www.juliusworks.com/careers"][target="_blank"]';
    this.blogLink = 'a[href="https://juliusworks.com/blog/"][target="_blank"]';
    this.privacyPolicyLink = 'a[href="https://juliusworks.com/privacy-policy"][target="_blank"]';
    this.logo = 'span.logo-img.logo-by-triller.logo-img-header[title="Julius"]';

    // Updated pagination elements with more robust selectors
    this.paginationDropdown = "span.app-icon.app-icon-triangle-down";
    this.dropdownOption100 = 'span[data-item-name="100"][data-item-title="100"][data-dropdown-type="page-size"]';
    this.dropdownLabel = "span.subheader-dropdown-label";
  }

  // Method to navigate to the home page (assuming it's the default page after login)
  async goto() {
    try {
      await this.page.goto("/");
      // Wait for the page to be ready
      await this.testHelper.waitForElementToBeVisible(this.logo);
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Error navigating to home page:", error);
      throw error;
    }
  }

  // Method to click on Help link and return the new page context
  async clickHelpLink() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.helpLink);
      const context = this.page.context();
      const newPagePromise = context.waitForEvent("page");
      await this.testHelper.clickElement(this.helpLink);
      const newPage = await newPagePromise;

      await newPage.waitForLoadState("load");
      await newPage.waitForLoadState("domcontentloaded");
      await newPage.waitForLoadState("networkidle");
      await newPage.waitForTimeout(3000);

      return newPage;
    } catch (error) {
      console.error("Error clicking help link:", error);
      throw error;
    }
  }

  // Method to click on Careers link and return the new page context
  async clickCareersLink() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.careersLink);
      const context = this.page.context();
      const newPagePromise = context.waitForEvent("page");
      await this.testHelper.clickElement(this.careersLink);
      const newPage = await newPagePromise;

      await newPage.waitForLoadState("load");
      await newPage.waitForLoadState("domcontentloaded");
      await newPage.waitForLoadState("networkidle");
      await newPage.waitForTimeout(3000);

      return newPage;
    } catch (error) {
      console.error("Error clicking careers link:", error);
      throw error;
    }
  }

  // Method to click on Blog link and return the new page context
  async clickBlogLink() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.blogLink);
      const context = this.page.context();
      const newPagePromise = context.waitForEvent("page");
      await this.testHelper.clickElement(this.blogLink);
      const newPage = await newPagePromise;

      await newPage.waitForLoadState("load");
      await newPage.waitForLoadState("domcontentloaded");
      await newPage.waitForLoadState("networkidle");
      await newPage.waitForTimeout(3000);

      return newPage;
    } catch (error) {
      console.error("Error clicking blog link:", error);
      throw error;
    }
  }

  // Method to click on Privacy Policy link and return the new page context
  async clickPrivacyPolicyLink() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.privacyPolicyLink);
      const context = this.page.context();
      const newPagePromise = context.waitForEvent("page");
      await this.testHelper.clickElement(this.privacyPolicyLink);
      const newPage = await newPagePromise;

      await newPage.waitForLoadState("load");
      await newPage.waitForLoadState("domcontentloaded");
      await newPage.waitForLoadState("networkidle");
      await newPage.waitForTimeout(3000);

      return newPage;
    } catch (error) {
      console.error("Error clicking privacy policy link:", error);
      throw error;
    }
  }

  // Enhanced method to click on pagination dropdown with better handling
  async clickPaginationDropdown() {
    try {
      // Use .first() to select the first matching dropdown (pagination one)
      const paginationDropdownElement = this.page.locator(this.paginationDropdown).first();

      // Wait for element to be visible and clickable
      await paginationDropdownElement.waitFor({ state: "visible" });

      // Click the pagination dropdown
      await paginationDropdownElement.click();

      // Wait for dropdown options to be visible with extended timeout
      await this.testHelper.waitForElementToBeVisible(this.dropdownOption100);

      // Additional wait to ensure dropdown is fully opened
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error("Error clicking pagination dropdown:", error);
      throw error;
    }
  }

  // Enhanced method to select 100 from pagination dropdown
  async selectPagination100() {
    try {
      // Wait for the 100 option to be visible with extended timeout
      await this.testHelper.waitForElementToBeVisible(this.dropdownOption100);

      // Additional wait to ensure option is clickable
      await this.page.waitForTimeout(500);

      // Click on the 100 option
      await this.testHelper.clickElement(this.dropdownOption100);

      // Wait for the page to update after selection with extended timeout
      await this.testHelper.waitForNetworkIdle();

      // Additional wait to ensure the change is reflected in the UI
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error("Error selecting 100 from pagination dropdown:", error);
      throw error;
    }
  }

  // Enhanced method to get the pagination dropdown label text with retry mechanism
  async getPaginationDropdownLabel() {
    try {
      // Use .first() to get the first dropdown label (pagination one)
      const labelElement = this.page.locator(this.dropdownLabel).first();

      // Wait for element to be visible
      await labelElement.waitFor({ state: "visible" });

      // Get the text content
      const labelText = await labelElement.textContent();

      // Trim whitespace and return the text
      return labelText.trim();
    } catch (error) {
      console.error("Error getting pagination dropdown label:", error);
      throw error;
    }
  }

  // New method to wait for label to update to expected value
  async waitForLabelToUpdate(expectedText, maxWaitSeconds = 15) {
    try {
      const maxAttempts = maxWaitSeconds * 2; // Check every 500ms
      let attempts = 0;

      while (attempts < maxAttempts) {
        const currentText = await this.getPaginationDropdownLabel();

        if (currentText === expectedText) {
          return true;
        }

        // Wait 500ms before next attempt
        await this.page.waitForTimeout(500);
        attempts++;
      }

      return false;
    } catch (error) {
      console.error("Error waiting for label to update:", error);
      return false;
    }
  }

  // Enhanced method to verify pagination dropdown shows expected text
  async verifyPaginationDropdownLabel(expectedText) {
    try {
      // First, wait for the label to update to expected text
      const isUpdated = await this.waitForLabelToUpdate(expectedText);

      if (!isUpdated) {
        // If still not updated, get current text for debugging
        const actualText = await this.getPaginationDropdownLabel();
        console.error(`Label did not update to "${expectedText}". Current text: "${actualText}"`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error verifying pagination dropdown label:", error);
      return false;
    }
  }

  // Method to verify the title of the help page
  async verifyHelpPageTitle(helpPage) {
    try {
      await helpPage.waitForLoadState("networkidle");
      await helpPage.waitForTimeout(2000);
      const title = await helpPage.title();
      const currentUrl = helpPage.url();

      return {
        title: title,
        url: currentUrl,
      };
    } catch (error) {
      console.error("Error verifying help page title:", error);
      throw error;
    }
  }

  // Method to verify the title of the careers page
  async verifyCareersPageTitle(careersPage) {
    try {
      await careersPage.waitForLoadState("networkidle");
      await careersPage.waitForTimeout(2000);
      const title = await careersPage.title();
      return title;
    } catch (error) {
      console.error("Error verifying careers page title:", error);
      throw error;
    }
  }

  // Method to verify the title of the blog page
  async verifyBlogPageTitle(blogPage) {
    try {
      await blogPage.waitForLoadState("networkidle");
      await blogPage.waitForTimeout(2000);
      const title = await blogPage.title();
      return title;
    } catch (error) {
      console.error("Error verifying blog page title:", error);
      throw error;
    }
  }

  // Method to verify the title of the privacy policy page
  async verifyPrivacyPolicyPageTitle(privacyPolicyPage) {
    try {
      await privacyPolicyPage.waitForLoadState("networkidle");
      await privacyPolicyPage.waitForTimeout(2000);
      const title = await privacyPolicyPage.title();
      return title;
    } catch (error) {
      console.error("Error verifying privacy policy page title:", error);
      throw error;
    }
  }

  // Method to verify if help link is visible
  async isHelpLinkVisible() {
    try {
      return await this.testHelper.isElementVisible(this.helpLink);
    } catch (error) {
      console.error("Error checking help link visibility:", error);
      return false;
    }
  }

  // Method to verify if careers link is visible
  async isCareersLinkVisible() {
    try {
      return await this.testHelper.isElementVisible(this.careersLink);
    } catch (error) {
      console.error("Error checking careers link visibility:", error);
      return false;
    }
  }

  // Method to verify if blog link is visible
  async isBlogLinkVisible() {
    try {
      return await this.testHelper.isElementVisible(this.blogLink);
    } catch (error) {
      console.error("Error checking blog link visibility:", error);
      return false;
    }
  }

  // Method to verify if privacy policy link is visible
  async isPrivacyPolicyLinkVisible() {
    try {
      return await this.testHelper.isElementVisible(this.privacyPolicyLink);
    } catch (error) {
      console.error("Error checking privacy policy link visibility:", error);
      return false;
    }
  }

  // Method to verify if pagination dropdown is visible
  async isPaginationDropdownVisible() {
    try {
      // Use .first() to check the first matching dropdown
      return await this.page.locator(this.paginationDropdown).first().isVisible();
    } catch (error) {
      console.error("Error checking pagination dropdown visibility:", error);
      return false;
    }
  }

  // Method to check if user is on home page (logo is visible)
  async isOnHomePage() {
    try {
      return await this.testHelper.isElementVisible(this.logo);
    } catch (error) {
      console.error("Error checking if on home page:", error);
      return false;
    }
  }
}

// Exporting the HomePage class for external use
module.exports = { HomePage };
