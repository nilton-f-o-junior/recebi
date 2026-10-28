// ### 4.9 Módulo: Observações

// #### TC-OBS-001: Campo de Observações Opcional

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Deixar o campo vazio e gerar | — | Campo opcional; recibo gerado sem erro |
// | 2 | Inserir texto curto | `Pagamento em dinheiro` | Texto aceito |
// | 3 | Inserir texto de 500 caracteres | 500 × `x` | Texto aceito integralmente (`value.length` = 500) |
// | 4 | Digitar 550 caracteres | 550 × `y` | O campo limita a 500 caracteres (`maxlength="500"`) |

// **Critério de Aceite:** Campo opcional; limite de 500 caracteres respeitado.

describe("TC-OBS-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Campo de Observações Opcional", () => {
    const obs = () => cy.get('[data-testid="input-observations"]');

    // | 1 | Deixar o campo vazio e gerar | — | Campo opcional; recibo gerado sem erro |
    cy.preencherFormulario({ observations: "" });
    cy.gerarRecibo();
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Inserir texto curto | `Pagamento em dinheiro` | Texto aceito |
    obs().type("Pagamento em dinheiro").should("have.value", "Pagamento em dinheiro");

    // | 3 | Inserir texto de 500 caracteres | 500 × `x` | Texto aceito integralmente (`value.length` = 500) |
    obs()
      .clear()
      .invoke("val", "x".repeat(500))
      .trigger("input")
      .should(($el) => {
        expect($el.val()).to.have.length(500);
      });

    // | 4 | Digitar 550 caracteres | 550 × `y` | O campo limita a 500 caracteres (`maxlength="500"`) |
    obs()
      .clear()
      .type("y".repeat(550))
      .should(($el) => {
        expect($el.val()).to.have.length(500);
      });
  });
});

// #### TC-OBS-002: Exibição Condicional no Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar com observações vazias (modelo padrão) | — | Não existe `.receipt-observations` |
// | 2 | Gerar com observações preenchidas | `Garantia de 30 dias` | `.receipt-observations-text` contém o texto |
// | 3 | Gerar no modelo detalhado, vazio | — | Não existe a seção "Observações" |
// | 4 | Gerar no modelo detalhado, preenchido | `Garantia de 30 dias` | Seção "Observações" presente com o texto |

// **Critério de Aceite:** Seção visível apenas se observações preenchidas.

describe("TC-OBS-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Exibição Condicional no Recibo", () => {
    const fechar = () => cy.get('[data-testid="btn-close-preview"]').click();

    // | 1 | Gerar com observações vazias (modelo padrão) | — | Não existe `.receipt-observations` |
    cy.preencherFormulario({ observations: "" });
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-observations").should("not.exist");
    fechar();

    // | 2 | Gerar com observações preenchidas | `Garantia de 30 dias` | `.receipt-observations-text` contém o texto |
    cy.get('[data-testid="input-observations"]').type("Garantia de 30 dias");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-observations-text").should(
      "have.text",
      "Garantia de 30 dias"
    );
    fechar();

    // | 3 | Gerar no modelo detalhado, vazio | — | Não existe a seção "Observações" |
    cy.get('[data-testid="input-observations"]').clear();
    cy.get("#receiptTemplate").select("detailed");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-detailed-title")
      .filter(":contains('Observações')")
      .should("not.exist");
    fechar();

    // | 4 | Gerar no modelo detalhado, preenchido | `Garantia de 30 dias` | Seção "Observações" presente com o texto |
    cy.get('[data-testid="input-observations"]').type("Garantia de 30 dias");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-detailed-title")
      .filter(":contains('Observações')")
      .should("exist");
    cy.get("#receiptContent .receipt-detailed-observations").should(
      "have.text",
      "Garantia de 30 dias"
    );
  });
});

// #### TC-OBS-003: Contador de Caracteres

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar o contador antes de digitar | — | `#observationsCount` vazio |
// | 2 | Digitar 10 caracteres | `xxxxxxxxxx` | "10/500 caracteres" |
// | 3 | Digitar 450 caracteres | 450 × `x` | Contador **não** está na cor de erro |
// | 4 | Digitar 451 caracteres | 451 × `x` | Contador na cor de erro (`rgb(239, 68, 68)`) |
// | 5 | Digitar 500 caracteres | 500 × `x` | "500/500 caracteres", cor de erro |

// **Critério de Aceite:** Contador atualizado em tempo real; alerta visual nos últimos 50 caracteres.

describe("TC-OBS-003", () => {
  const ERRO = "rgb(239, 68, 68)";

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Contador de Caracteres", () => {
    // | 1 | Verificar o contador antes de digitar | — | `#observationsCount` vazio |
    cy.get("#observationsCount").should("have.text", "");

    // | 2 | Digitar 10 caracteres | `xxxxxxxxxx` | "10/500 caracteres" |
    cy.get('[data-testid="input-observations"]').type("x".repeat(10));
    cy.get("#observationsCount").should("have.text", "10/500 caracteres");

    // | 3 | Digitar 450 caracteres | 450 × `x` | Contador **não** está na cor de erro |
    cy.get('[data-testid="input-observations"]')
      .clear()
      .invoke("val", "x".repeat(450))
      .trigger("input");
    cy.get("#observationsCount")
      .should("have.text", "450/500 caracteres")
      .and("not.have.css", "color", ERRO);

    // | 4 | Digitar 451 caracteres | 451 × `x` | Contador na cor de erro (`rgb(239, 68, 68)`) |
    cy.get('[data-testid="input-observations"]')
      .clear()
      .invoke("val", "x".repeat(451))
      .trigger("input");
    cy.get("#observationsCount")
      .should("have.text", "451/500 caracteres")
      .and("have.css", "color", ERRO);

    // | 5 | Digitar 500 caracteres | 500 × `x` | "500/500 caracteres", cor de erro |
    cy.get('[data-testid="input-observations"]').clear().type("x".repeat(500));
    cy.get("#observationsCount")
      .should("have.text", "500/500 caracteres")
      .and("have.css", "color", ERRO);
  });
});
