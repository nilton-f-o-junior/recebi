const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  chromeWebSecurity: false,

  e2e: {
    // Produção por padrão; pode ser sobrescrito pela variável de ambiente
    // CYPRESS_BASE_URL (ex.: CYPRESS_BASE_URL=http://localhost:3000 npx cypress open).
    baseUrl: process.env.CYPRESS_BASE_URL || "https://recebi-ten.vercel.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
