const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,

  e2e: {
    // Em Docker usar http://app:4173 via CYPRESS_baseUrl/CYPRESS_BASE_URL
    baseUrl: process.env.CYPRESS_baseUrl || process.env.CYPRESS_BASE_URL || "http://localhost:4173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
