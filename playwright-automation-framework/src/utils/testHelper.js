const { expect } = require("@playwright/test");

// Class representing the Test Helper utilities for common Playwright operations
class TestHelper {
  // Constructor to initialize the test helper with a page instance
  constructor(page) {
    this.page = page;
  }

  // Method to check if the page instance is still valid
  async _ensurePageValid() {
    try {
      await this.page.url();
      return true;
    } catch (error) {
      console.error("Error checking page validity:", error);
      return false;
    }
  }

  // Method to wait for navigation to complete with recovery
  async waitForNavigation(timeout = 45000) {
    if (!(await this._ensurePageValid())) return;

    try {
      await this.page.waitForLoadState("commit", { timeout: 5000 }).catch(() => {});

      try {
        await this.page.waitForLoadState("networkidle", {
          timeout: Math.max(timeout - 5000, 0),
        });
      } catch (error) {
        await this.page
          .waitForLoadState("domcontentloaded", {
            timeout: 5000,
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error("Error waiting for navigation:", error);
    }
  }

  // Method to wait for an element to be visible with recovery
  async waitForElementToBeVisible(selectorOrLocator, timeout = 45000) {
    if (!(await this._ensurePageValid())) return;

    let element;
    if (typeof selectorOrLocator === "string") {
      element = this.page.locator(selectorOrLocator);
    } else {
      element = selectorOrLocator; // assume it's already a Locator
    }
    let attempts = 3;

    while (attempts > 0) {
      try {
        await element.waitFor({
          state: "visible",
          timeout: Math.min(timeout / attempts, 15000),
        });
        return;
      } catch (error) {
        attempts--;
        if (attempts === 0) throw error;

        console.error(`Error waiting for element visibility (${attempts} attempts left):`, error);
        await this.waitForNavigation(5000);
      }
    }
  }

  // Method to wait for an element to be hidden
  async waitForElementToBeHidden(selector, timeout = 45000) {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: "hidden", timeout });
    } catch (error) {
      console.error("Error waiting for element to be hidden:", error);
      throw error;
    }
  }

  // Method to wait for an element to be enabled
  async waitForElementToBeEnabled(selector, timeout = 45000) {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: "visible", timeout: Math.min(timeout, 15000) });
      await expect(element).toBeEnabled({ timeout: Math.max(timeout - 15000, 5000) });
    } catch (error) {
      await this.waitForNavigation(5000);
      await element.waitFor({ state: "visible", timeout: 5000 });
      await expect(element).toBeEnabled({ timeout: 5000 });
    }
  }

  // Method to wait for a network request to complete
  async waitForRequest(urlOrPredicate, timeout = 30000) {
    try {
      return await this.page.waitForRequest(urlOrPredicate, { timeout });
    } catch (error) {
      console.error("Error waiting for request:", error);
      throw error;
    }
  }

  // Method to wait for a network response to be received
  async waitForResponse(urlOrPredicate, timeout = 30000) {
    try {
      return await this.page.waitForResponse(urlOrPredicate, { timeout });
    } catch (error) {
      console.error("Error waiting for response:", error);
      throw error;
    }
  }

  // Method to wait for the network to be idle
  async waitForNetworkIdle(options = { timeout: 45000 }) {
    try {
      await this.waitForNavigation(options.timeout);
    } catch (error) {
      console.error("Error waiting for network idle:", error);
      throw error;
    }
  }

  // Method to click an element with robust recovery
  async clickElement(selector, timeout = 45000) {
    if (!(await this._ensurePageValid())) return;

    let attempts = 3;
    while (attempts > 0) {
      try {
        await this.waitForElementToBeVisible(selector, timeout / attempts);

        try {
          await this.page.click(selector, {
            timeout: Math.min(timeout / attempts, 15000),
            force: attempts === 1,
          });
          await this.waitForNavigation(5000);
          return;
        } catch (error) {
          const element = this.page.locator(selector);
          await element.scrollIntoViewIfNeeded().catch(() => {});

          await element.click({
            timeout: Math.min(timeout / attempts, 15000),
            force: attempts === 1,
          });
          await this.waitForNavigation(5000);
          return;
        }
      } catch (error) {
        attempts--;
        if (attempts === 0) {
          console.error(`Error clicking element after all attempts:`, error);
          throw error;
        }
        console.error(`Error clicking element (${attempts} attempts left):`, error);
        await this.waitForNavigation(5000);
      }
    }
  }

  // Method to fill text in an input field with recovery
  async fillText(selector, text, timeout = 45000) {
    if (!(await this._ensurePageValid())) return;

    let attempts = 3;
    while (attempts > 0) {
      try {
        await this.waitForElementToBeVisible(selector, timeout / attempts);

        try {
          await this.page.fill(selector, "");
          await this.page.fill(selector, text);
          return;
        } catch (error) {
          const element = this.page.locator(selector);
          await element.click({ clickCount: 3, timeout: 5000 });
          await this.page.keyboard.press("Backspace");
          await element.type(text, {
            timeout: Math.min(timeout / attempts, 15000),
          });
          return;
        }
      } catch (error) {
        attempts--;
        if (attempts === 0) {
          console.error(`Error filling text after all attempts:`, error);
          throw error;
        }
        console.error(`Error filling text (${attempts} attempts left):`, error);
        await this.waitForNavigation(5000);
      }
    }
  }

  // Method to check if an element exists and is visible
  async isElementVisible(selector, timeout = 5000) {
    if (!(await this._ensurePageValid())) return false;

    try {
      await this.waitForElementToBeVisible(selector, timeout);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Exporting the TestHelper class for external use
module.exports = { TestHelper };
