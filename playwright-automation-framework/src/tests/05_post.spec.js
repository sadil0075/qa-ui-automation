// src/tests/post.spec.js

const { test, expect } = require("@playwright/test");
const helpers = require("../utils/helpers");
helpers.setupScreenshotOnFailure(test);

const { LoginPage } = require("../pages/loginPage");
const { PostPage } = require("../pages/postPage");
const loginPageData = require("../data/loginPageData.json");

test("Verify that user is able to navigate to Post page and see correct title", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginPageData.validUser.email, loginPageData.validUser.password);

    const postPage = new PostPage(page);
    await postPage.navigateToPostPage();

    const isTitleCorrect = await postPage.verifyPostPageTitle();
    expect(isTitleCorrect).toBe(true);
  } catch (error) {
    console.error("Post page navigation test failed:", error);
    throw error;
  }
});
