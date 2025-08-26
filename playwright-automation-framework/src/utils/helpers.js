// Helper utilities for test automation
const fs = require("fs");
const path = require("path");

// Path for storing temporary test data
const tempDataPath = path.join(__dirname, "..", "data", "tempData.json");

module.exports = {
  // Generate a random string of specified length
  generateRandomString: (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },

  // Create a unique project name
  createProjectName: () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `Project_Automation_${random}`;
  },

  // Create a unique project handle
  createHandleName: () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `@Project_${random}`;
  },

  // Create a unique list name
  createListName: () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `List_Automation_${random}`;
  },

  // Save a value to temporary storage (tempData.json)
  saveTempValue: (key, value) => {
    try {
      let data = {};
      if (fs.existsSync(tempDataPath)) {
        data = JSON.parse(fs.readFileSync(tempDataPath, "utf-8"));
      }
      data[key] = value;
      fs.writeFileSync(tempDataPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving temporary value:", error);
      throw error;
    }
  },

  // Retrieve a value from temporary storage (tempData.json)
  getTempValue: (key) => {
    try {
      if (!fs.existsSync(tempDataPath)) return null;
      const data = JSON.parse(fs.readFileSync(tempDataPath, "utf-8"));
      return data[key];
    } catch (error) {
      console.error("Error getting temporary value:", error);
      return null;
    }
  },

  // Set up automatic screenshot capture on test failure
  setupScreenshotOnFailure: (test) => {
    try {
      const screenshotDir = path.join(process.cwd(), "result/playwright-failed-tc-screenshot");
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      } else {
        fs.rmSync(screenshotDir, { recursive: true, force: true });
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
          const safeTitle = testInfo.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
          const screenshotPath = path.join(screenshotDir, `${safeTitle}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`📸 Screenshot saved at ${screenshotPath}`);
        }
      });
    } catch (error) {
      console.error("Error setting up screenshot on failure:", error);
      throw error;
    }
  },
};
