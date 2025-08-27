const { TestHelper } = require("../utils/testHelper");

class CampaignPage {
  constructor(page) {
    this.page = page;
    this.testHelper = new TestHelper(this.page);
    this.campaignNavLink = page.locator("a.header-link", { hasText: "Campaigns" });
    this.newCampaignButton = page.locator('a[data-action="create-campaign"]');
    this.nameInput = page.locator('input[name="name"]');
    this.statusDropdown = page.locator('select[name="status_id"]');
    this.budgetInput = page.locator('input[name="budget"]');
    this.hashtagInput = page.locator("ul.form-tags-list input.taggle_input");
    this.projectDropdown = page.locator("span.form-selectable-placeholder", {
      hasText: "Select a Project",
    });
    this.projectSearchInput = page.locator("//span[@class='form-selectable-popover popover']//input[@placeholder='Type here to search...']");
    this.projectResults = page.locator("span.form-selectable-results-item");
    this.createCampaignButton = page.locator("button.btn.btn-primary", { hasText: "Create Campaign" });
  }

  async navigateToCampaignPage() {
    try {
      await this.testHelper.clickElement("a.header-link:has-text('Campaigns')");
      await this.testHelper.waitForNavigation();
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Failed to navigate to campaign page:", error);
      throw error;
    }
  }

  async verifyCampaignTitle(expectedTitle = "Julius") {
    try {
      await this.testHelper.waitForNavigation();
      await this.testHelper.waitForNetworkIdle();
      const title = await this.page.title();
      return title === expectedTitle;
    } catch (error) {
      console.error("Failed to verify campaign title:", error);
      return false;
    }
  }

  async clickNewCampaignButton() {
    try {
      await this.testHelper.clickElement('a[data-action="create-campaign"]');
      await this.testHelper.waitForNavigation();
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Failed to click new campaign button:", error);
      throw error;
    }
  }

  async fillCampaignForm(campaignName, budgetValue, hashtag, projectName) {
    try {
      // Fill basic details with waits between actions
      await this.testHelper.fillText('input[name="name"]', campaignName);
      await this.testHelper.waitForNetworkIdle();

      await this.statusDropdown.selectOption("2"); // Active
      await this.testHelper.waitForNetworkIdle();

      await this.testHelper.fillText('input[name="budget"]', budgetValue.toString());
      await this.testHelper.waitForNetworkIdle();

      // Handle hashtag input
      await this.testHelper.fillText("ul.form-tags-list input.taggle_input", hashtag);
      await this.page.keyboard.press("Enter");
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Failed to fill campaign form:", error);
      throw error;
    }
  }

  async selectProjectFromDropdown(projectName) {
    try {
      // Click dropdown and wait for it to open
      await this.testHelper.clickElement("span.form-selectable-placeholder:has-text('Select a Project')");
      await this.testHelper.waitForNetworkIdle();

      // Wait for search input to be visible
      const searchInputSelector = "//span[@class='form-selectable-popover popover']//input[@placeholder='Type here to search...']";
      await this.testHelper.waitForElementToBeVisible(searchInputSelector);

      // Clear existing text and add small delay
      await this.projectSearchInput.fill("");
      await this.page.waitForTimeout(300); // Keep original timing for stability

      // Humanized typing - character by character
      for (const char of projectName) {
        await this.projectSearchInput.type(char, { delay: 100 });
        await this.testHelper.waitForNetworkIdle();
      }

      // Additional delay after typing to let search results populate
      await this.page.waitForTimeout(1500); // Keep original timing for stability

      // Wait for search results with a robust strategy
      await this.page
        .waitForFunction(
          (text) => {
            const elements = document.querySelectorAll("span.form-selectable-results-item");
            return Array.from(elements).some((el) => el.textContent.toLowerCase().includes(text.toLowerCase()));
          },
          projectName,
          { timeout: 30000 } // 30 second timeout
        )
        .catch(async () => {
          console.log("Initial search failed, attempting to refresh search...");
          // If waiting fails, try refreshing the search
          await this.projectSearchInput.fill("");
          await this.testHelper.waitForNetworkIdle();
          // Retry with humanized typing
          for (const char of projectName) {
            await this.projectSearchInput.type(char, { delay: 100 });
            await this.testHelper.waitForNetworkIdle();
          }
        });

      // Try multiple selection strategies
      const resultSelector = `span.form-selectable-results-item:has-text("${projectName}")`;
      const allResults = this.projectResults;
      let matched = false;

      try {
        // Strategy 1: Check for exact match in results
        const resultCount = await allResults.count();
        for (let i = 0; i < resultCount; i++) {
          const item = allResults.nth(i);
          const text = (await item.innerText()).trim();
          if (text.toLowerCase() === projectName.trim().toLowerCase()) {
            await item.click();
            matched = true;
            break;
          }
        }

        // Strategy 2: Direct click with TestHelper if no exact match found
        if (!matched) {
          await this.testHelper.clickElement(resultSelector);
          matched = true;
        }
      } catch (error) {
        console.log("Direct click strategies failed, trying alternative methods...");

        try {
          // Strategy 3: Force click with JavaScript evaluation
          matched = await this.page.evaluate((text) => {
            const elements = document.querySelectorAll("span.form-selectable-results-item");
            const element = Array.from(elements).find((el) => el.textContent.toLowerCase().includes(text.toLowerCase()));
            if (element) {
              element.click();
              return true;
            }
            return false;
          }, projectName);
        } catch (error) {
          console.log("JavaScript click failed, trying keyboard navigation...");

          // Strategy 4: Keyboard navigation as final fallback
          await this.projectSearchInput.press("ArrowDown");
          await this.page.waitForTimeout(300); // Keep original timing for stability
          await this.projectSearchInput.press("Enter");
          matched = true;
        }
      }

      // Verify selection was successful
      await this.testHelper.waitForNetworkIdle();
      const dropdownText = await this.projectDropdown.textContent();
      if (!dropdownText.toLowerCase().includes(projectName.toLowerCase())) {
        throw new Error("Project selection verification failed");
      }
    } catch (error) {
      console.error("Failed to select project from dropdown:", error);
      throw error;
    }
  }

  async submitCampaignForm() {
    try {
      await this.testHelper.clickElement("button.btn.btn-primary:has-text('Create Campaign')");
      await this.testHelper.waitForNavigation();
      await this.testHelper.waitForNetworkIdle();
    } catch (error) {
      console.error("Failed to submit campaign form:", error);
      throw error;
    }
  }
}

module.exports = { CampaignPage };
