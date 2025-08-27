const { TestHelper } = require("../utils/testHelper");

class ListPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.listNavLink = page.locator("a.header-link", { hasText: "Lists" });
    this.newListButton = page.locator("//a[normalize-space()='New List']");
    this.nameInput = page.locator("//input[@id='name']");
    this.descriptionInput = page.locator('input#description[name="description"]');
    this.projectDropdown = page.locator("span.form-selectable-placeholder", {
      hasText: "Select a Project",
    });
    this.projectSearchInput = page.locator("//span[@class='form-selectable-popover popover']//input[@placeholder='Type here to search...']");
    this.projectResults = page.locator("span.form-selectable-results-item");
    this.saveButton = page.locator("button.btn.btn-primary", {
      hasText: "Save List",
    });
    // Add new locator for project remove button
    this.projectRemoveButton = page.locator("span.app-icon.app-icon-times.form-selectable-remove[data-trigger='remove']");
    this.projectPlaceholder = page.locator("span.form-selectable-placeholder", { hasText: "Select a Project" });
  }

  async navigateToListsPage() {
    try {
      await this.listNavLink.click();
      await this.testHelper.waitForNetworkIdle();
      await this.testHelper.waitForElementToBeVisible("//a[normalize-space()='New List']", 15000);
    } catch (error) {
      console.error("Failed to navigate to Lists page:", error);
      throw error;
    }
  }

  async clickNewListButton() {
    try {
      await this.newListButton.click();
      await this.testHelper.waitForNetworkIdle();
      await this.testHelper.waitForElementToBeVisible("//input[@id='name']", 15000);
    } catch (error) {
      console.error("Failed to click New List button:", error);
      throw error;
    }
  }

  async fillListDetails(listName, listDescription, projectName) {
    await this.nameInput.fill(listName);
    await this.testHelper.waitForElementToBeEnabled("//input[@id='name']", 300);
    await this.descriptionInput.fill(listDescription);
    await this.testHelper.waitForElementToBeEnabled('input#description[name="description"]', 300);

    // Check if "Select a Project" placeholder is visible
    const isPlaceholderVisible = await this.projectPlaceholder.isVisible().catch(() => false); // Handle case where element doesn't exist

    if (!isPlaceholderVisible) {
      // If placeholder not visible, a project is pre-selected, so remove it
      await this.projectRemoveButton.click();
      await this.page.waitForTimeout(500); // Wait for removal animation
    }

    await this.projectDropdown.click();
    await this.projectSearchInput.waitFor({ timeout: 5000 });

    // Clear and type slowly
    await this.projectSearchInput.fill("");
    await this.testHelper.waitForElementToBeEnabled(
      "//span[@class='form-selectable-popover popover']//input[@placeholder='Type here to search...']",
      300
    );

    for (const char of projectName) {
      await this.projectSearchInput.type(char, { delay: 100 }); // slow typing
    }

    await this.page.waitForTimeout(1500); // let results refresh

    const allResults = this.page.locator("span.form-selectable-results-item");

    // Wait until some results appear
    await this.page.waitForFunction(
      () => {
        return document.querySelectorAll("span.form-selectable-results-item").length > 0;
      },
      null,
      { timeout: 10000 }
    );

    const resultCount = await allResults.count();
    let matched = false;

    for (let i = 0; i < resultCount; i++) {
      const item = allResults.nth(i);
      const text = (await item.innerText()).trim();
      //console.log(`🔸 Dropdown result ${i + 1}: "${text}"`);

      if (text.toLowerCase() === projectName.trim().toLowerCase()) {
        await item.click();
        // console.log(`✅ Selected exact match: "${text}"`);
        matched = true;
        break;
      }
    }

    // Fallback: Arrow down + Enter
    if (!matched) {
      await this.projectSearchInput.press("ArrowDown");
      await this.projectSearchInput.press("Enter");
      matched = true; // Assume selection is acceptable for fallback
    }

    await this.page.waitForTimeout(500);
  }

  async submitList(listName) {
    // 👈 UPDATED: Added listName parameter
    try {
      // Wait for save button to be visible and clickable
      await this.saveButton.waitFor({ state: "visible", timeout: 5000 });

      // Click the save button and wait for response
      const responsePromise = this.page.waitForResponse((response) => response.url().includes("/lists") && response.status() === 200);
      await this.saveButton.click();

      try {
        // Wait for response with timeout
        await responsePromise.then(
          (response) => {},
          (error) => console.log("Response wait timed out, continuing...")
        );
      } catch (error) {
        console.log("Response wait failed, continuing...");
      }

      // Wait for any of these conditions to be met
      await Promise.race([
        this.page.waitForURL("**/lists/**", { timeout: 10000 }),
        this.page.waitForSelector('text="List created successfully"', { timeout: 10000 }),
        this.page.waitForSelector("div.success-message", { timeout: 10000 }),
      ]).catch((error) => {});

      // Give a moment for UI to stabilize
      await this.page.waitForLoadState("domcontentloaded");

      /* NEW LINES 👇 — persist the list name so other tests can read it */
      const helpers = require("../utils/helpers");
      helpers.saveTempValue("lastCreatedList", listName);
    } catch (error) {
      console.error("Failed to submit list:", error);
      throw error;
    }
  }

  async verifyListCreated(listName) {
    try {
      await this.testHelper.waitForNetworkIdle();
      await this.page.waitForTimeout(1000); // Added delay for title update
      const title = await this.page.title();
      return title.includes(`${listName} | Julius`);
    } catch (error) {
      console.error("Failed to verify list creation:", error);
      return false;
    }
  }
}

module.exports = { ListPage };
