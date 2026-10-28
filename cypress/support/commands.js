// Comandos de apoio da suíte E2E do Recebi (Apêndice C do TDD v2.1).

const MUNICIPIOS = {
  SP: ["Campinas", "Santos", "São Paulo"],
  RJ: ["Niterói", "Rio de Janeiro"],
  MG: ["Belo Horizonte", "Uberlândia"],
  AM: ["Manaus", "Parintins"],
};

const tid = (id) => `[data-testid="${id}"]`;

// Resposta "neutra" do ViaCEP: não altera nenhum campo do formulário.
const VIACEP_NEUTRO = {};

Cypress.Commands.add("mockLocalidades", () => {
  cy.intercept(
    "GET",
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados/*/municipios*",
    (req) => {
      const uf = req.url.match(/estados\/([A-Z]{2})\//)[1];
      const nomes = MUNICIPIOS[uf] || ["Cidade Teste"];
      req.reply({ statusCode: 200, body: nomes.map((nome) => ({ nome })) });
    }
  ).as("ibge");
});

Cypress.Commands.add("mockViaCep", (corpo = VIACEP_NEUTRO) => {
  cy.intercept("GET", "https://viacep.com.br/ws/*/json/", {
    statusCode: 200,
    body: corpo,
  }).as("viacep");
});

// Abre o formulário já com APIs externas simuladas e window.print em stub.
Cypress.Commands.add("abrirFormulario", () => {
  cy.mockLocalidades();
  cy.mockViaCep();
  cy.visit("/src/html/form.html", {
    onBeforeLoad(win) {
      cy.stub(win, "print").as("print");
    },
  });
});

// Preenche o formulário com a massa válida (cypress/fixtures/recibo-valido.json),
// permitindo sobrescrever campos. Use '' para deixar um campo opcional vazio.
Cypress.Commands.add("preencherFormulario", (sobrescrever = {}) => {
  cy.fixture("recibo-valido").then((base) => {
    const d = { ...base, ...sobrescrever };
    const digitar = (id, texto) => {
      if (texto) cy.get(tid(id)).clear().type(texto);
    };

    digitar("input-receipt-type", d.receiptType);
    digitar("input-date", d.issueDate);
    digitar("input-client-name", d.clientName);
    digitar("input-client-document", d.clientDoc);
    digitar("input-client-phone", d.clientPhone);
    digitar("input-beneficiary-name", d.providerName);
    digitar("input-beneficiary-document", d.providerDoc);
    digitar("input-beneficiary-phone", d.providerPhone);
    digitar("input-vehicle-model", d.carModel);
    digitar("input-vehicle-plate", d.carPlate);
    digitar("input-vehicle-year", d.carYear);
    digitar("input-establishment-name", d.estName);

    cy.get(tid("select-establishment-state"))
      .select(d.state)
      .then(() => {
        if (d.state) cy.wait("@ibge");
      });
    cy.get(tid("select-establishment-city"))
      .should("not.be.disabled")
      .select(d.city);

    digitar("input-establishment-neighborhood", d.neighborhood);
    digitar("input-establishment-zipcode", d.cep);
    digitar("input-establishment-street", d.street);
    digitar("input-establishment-number", d.number);

    // Sair do CEP com 8 dígitos dispara a consulta ao ViaCEP.
    const cepDigitos = (d.cep || "").replace(/\D/g, "");
    if (cepDigitos.length === 8) cy.wait("@viacep");

    d.services.forEach((servico, i) => {
      if (i > 0) cy.get(tid("btn-add-service")).click();
      cy.get(tid("input-service-name")).eq(i).clear().type(servico.name);
      cy.get(tid("input-service-value")).eq(i).clear().type(servico.value);
    });

    if (d.observations) digitar("input-observations", d.observations);
    if (d.discount) {
      cy.get(tid("btn-add-discount")).click();
      cy.get(tid("input-discount-value")).clear().type(String(d.discount));
    }
  });
});

Cypress.Commands.add("gerarRecibo", () => {
  cy.get(tid("input-privacy")).check();
  cy.get(tid("btn-generate")).click();
  cy.get("#printContainer").should("have.class", "visible");
});
