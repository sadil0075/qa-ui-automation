// src/tests/project.spec.js
const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
helpers.setupScreenshotOnFailure(test);

const { LoginPage } = require("../pages/loginPage");
const { ManageAccountPage } = require("../pages/manageAccountPage");
const { ProjectPage } = require("../pages/projectPage");
const loginPageData = require("../data/loginPageData.json");

// ✅ Test 1: Navigation and Title Verification
test("Verify that user is able to navigate to Project page and see correct title", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    const manageAccountPage = new ManageAccountPage(page);
    await manageAccountPage.openUserMenu();
    await manageAccountPage.clickManageAccount();
    expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

    const projectPage = new ProjectPage(page);
    await projectPage.goToProjectSection();

    // ✅ Verify title
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Projects | Julius");
  } catch (error) {
    console.error("Navigation to project page test failed:", error);
    throw error;
  }
});
// ✅ Test 2: Navigation and create the project
test("Verify that user should be able to create a Project with name and description only", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);
    await expect(page.locator(loginPage.logo)).toBeVisible();

    const manageAccountPage = new ManageAccountPage(page);
    await manageAccountPage.openUserMenu();
    await manageAccountPage.clickManageAccount();
    expect(await manageAccountPage.isOnManageAccountPage()).toBe(true);

    const projectPage = new ProjectPage(page);
    await projectPage.goToProjectSection();
    await projectPage.clickAddProjectButton();

    const projectName = "Project_Automation_" + helpers.generateRandomString(5);
    helpers.saveTempValue("projectName", projectName);

    await projectPage.fillProjectDetails(projectName, "Project_Automation_Description");

    await projectPage.submitProject();
    expect(await projectPage.isOnProjectHomePage()).toBe(true);
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
});
