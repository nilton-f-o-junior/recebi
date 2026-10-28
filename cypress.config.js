const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // O Electron está deprecado no Cypress 16: Chrome é o navegador padrão.
  defaultBrowser: "chrome",

  video: false,

  e2e: {
    // Produção por padrão (TDD §2). No Docker, CYPRESS_baseUrl/CYPRESS_BASE_URL
    // aponta para o app local (ver docker-compose.yml).
    baseUrl:
      process.env.CYPRESS_baseUrl ||
      process.env.CYPRESS_BASE_URL ||
      "https://recebi-ten.vercel.app",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
