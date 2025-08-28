// Helper to get credentials from environment or fallback to local data
const fs = require("fs");
const path = require("path");

class Credentials {
  static getValidUser() {
    // First, try to get from environment variables
    if (process.env.LOGIN_EMAIL && process.env.LOGIN_PASSWORD) {
      return {
        email: process.env.LOGIN_EMAIL,
        password: process.env.LOGIN_PASSWORD,
      };
    }

    // Fallback to JSON file for local development
    try {
      const dataPath = path.join(__dirname, "..", "data", "loginPageData.json");
      const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return data.validUser;
    } catch (error) {
      throw new Error("Unable to load credentials from environment or JSON file");
    }
  }

  static getInvalidUser() {
    // For invalid user, you can keep it in JSON or hardcode
    try {
      const dataPath = path.join(__dirname, "..", "data", "loginPageData.json");
      const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return data.invalidUser;
    } catch (error) {
      return {
        email: "invalid@triller.co",
        password: "wrongpassword",
      };
    }
  }
}

module.exports = { Credentials };
