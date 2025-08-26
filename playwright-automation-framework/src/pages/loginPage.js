const { TestHelper } = require("../utils/testHelper");

// Class representing the Login Page and its functionalities
class LoginPage {
  // Constructor to initialize page elements and selectors for the login page
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);

    // Login elements
    this.emailInput = 'input[name="email"].auth-field';
    this.passwordInput = 'input[name="password"].auth-field';
    this.loginButton = 'input[type="submit"][value="Sign In"]';
    this.logo = 'span.logo-img.logo-by-triller.logo-img-header[title="Julius"]';
    this.errorMsg = ".auth-error-message, .error-message";

    // User menu and logout elements
    this.avatarIcon = "span.avatar-gravatar";
    this.logoutLink = 'a.action-menu-item-link.header-user-actions-item-link[href="https://app.juliusdev.net/logout"]';
  }

  // Method to navigate to the login page
  async goto() {
    try {
      await this.page.goto("/login");
      // Wait for the login form to be ready
      await this.testHelper.waitForElementToBeVisible(this.emailInput);
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Error navigating to login page:", error);
      throw error;
    }
  }

  // Method to log in with provided email and password
  async login(email, password) {
    try {
      // Clear and fill email
      await this.testHelper.fillText(this.emailInput, email);
      await this.testHelper.fillText(this.passwordInput, password);
      await this.testHelper.clickElement(this.loginButton);
      // Wait for navigation to complete
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  // Method to open the user menu
  async openUserMenu() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.avatarIcon);
      await this.testHelper.clickElement(this.avatarIcon);
    } catch (error) {
      console.error("Error opening user menu:", error);
      throw error;
    }
  }

  // Method to logout from the application
  async logout() {
    try {
      // Open user menu first
      await this.openUserMenu();

      // Wait for logout link to be visible and click it
      await this.testHelper.waitForElementToBeVisible(this.logoutLink);
      await this.testHelper.clickElement(this.logoutLink);

      // Wait for navigation to complete (should redirect to login page)
      await this.testHelper.waitForNavigation();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  // Method to check if the page logo is visible
  async isLogoVisible() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.logo);
      return await this.page.isVisible(this.logo);
    } catch (error) {
      console.error("Error checking logo visibility:", error);
      return false;
    }
  }

  // Method to check if an error message is visible on the page
  async isErrorVisible() {
    try {
      await this.testHelper.waitForElementToBeVisible(this.errorMsg);
      return await this.page.isVisible(this.errorMsg);
    } catch (error) {
      console.error("Error checking error message visibility:", error);
      return false;
    }
  }

  // Method to check if user is logged in (logo is visible)
  async isLoggedIn() {
    try {
      return await this.isLogoVisible();
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  }

  // Method to check if user is on login page
  async isOnLoginPage() {
    try {
      const currentUrl = this.page.url();
      return currentUrl.includes("/login");
    } catch (error) {
      console.error("Error checking if on login page:", error);
      return false;
    }
  }
}

// Exporting the LoginPage class for external use
module.exports = { LoginPage };
