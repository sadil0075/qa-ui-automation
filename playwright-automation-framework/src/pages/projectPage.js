class ProjectPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.projectSection = page.locator("span.section-item-title", {
      hasText: "Projects",
    });
    this.addProjectButton = page.locator('a[data-action="create-project"]');
    this.nameInput = page.locator("input#name");
    this.descriptionInput = page.locator("input#description");
    this.platformDropdown = page.locator('select[name="platform"]');
    this.createButton = page.locator('button[type="submit"]:has-text("Create Project")');
  }

  async goToProjectSection() {
    await this.projectSection.click();
  }

  async clickAddProjectButton() {
    await this.addProjectButton.click();
  }

  async fillProjectDetails(projectName, projectDescription, platform = null) {
    await this.nameInput.fill(projectName);
    await this.descriptionInput.fill(projectDescription);

    if (platform) {
      await this.platformDropdown.selectOption(platform);
    }
  }

  async submitProject() {
    await this.createButton.click();
  }

  async isOnProjectHomePage() {
    const title = await this.page.title();
    return title.includes("Projects | Julius");
  }
}

module.exports = { ProjectPage };
