// ### 4.2 Módulo: Informações do Recibo

// #### TC-INF-001: Seleção de Tipo de Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar valor inicial | — | Campo de **texto livre** com "Recibo de Pagamento" |
// | 2 | Alterar para "Orçamento" e gerar | `Orçamento` | `.receipt-type` contém "Orçamento" (exibido em maiúsculas por CSS) |
// | 3 | Alterar para "Ordem de Serviço" e gerar | `Ordem de Serviço` | `.receipt-type` contém "Ordem de Serviço" |
// | 4 | Alterar para "Comprovante de Pagamento" e gerar | `Comprovante de Pagamento` | `.receipt-type` contém "Comprovante de Pagamento" |
// | 5 | Gerar no modelo detalhado | Modelo "Modelo Detalhado" | O tipo aparece como título principal (`.receipt-est-name`, `h1`) |
// | 6 | Apagar o campo e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |

// **Critério de Aceite:** O texto do campo vira o título do documento.

describe("TC-INF-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Seleção de Tipo de Recibo", () => {
    const tipo = () => cy.get('[data-testid="input-receipt-type"]');
    const gerarCom = (texto) => {
      tipo().clear().type(texto);
      cy.gerarRecibo();
      cy.get(".receipt-type").should("have.text", texto);
      cy.get('[data-testid="btn-close-preview"]').click();
    };

    // | 1 | Verificar valor inicial | — | Campo de **texto livre** com "Recibo de Pagamento" |
    tipo().should("be.visible").and("have.value", "Recibo de Pagamento");

    // | 2 | Alterar para "Orçamento" e gerar | `Orçamento` | `.receipt-type` contém "Orçamento" (exibido em maiúsculas por CSS) |
    gerarCom("Orçamento");
    cy.get(".receipt-type").should("have.css", "text-transform", "uppercase");

    // | 3 | Alterar para "Ordem de Serviço" e gerar | `Ordem de Serviço` | `.receipt-type` contém "Ordem de Serviço" |
    gerarCom("Ordem de Serviço");

    // | 4 | Alterar para "Comprovante de Pagamento" e gerar | `Comprovante de Pagamento` | `.receipt-type` contém "Comprovante de Pagamento" |
    gerarCom("Comprovante de Pagamento");

    // | 5 | Gerar no modelo detalhado | Modelo "Modelo Detalhado" | O tipo aparece como título principal (`.receipt-est-name`, `h1`) |
    cy.get("#receiptTemplate").select("detailed");
    tipo().clear().type("Orçamento");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-est-name")
      .should("have.prop", "tagName", "H1")
      .and("have.text", "Orçamento");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 6 | Apagar o campo e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |
    cy.get("#receiptTemplate").select("default");
    tipo().clear();
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    tipo().should("match", ":invalid");
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-INF-002: Data de Emissão

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar valor inicial | — | Data atual pré-preenchida (`AAAA-MM-DD`) |
// | 2 | Alterar para data passada e gerar | `2020-01-15` | 🐞 Esperado (SDD): "15 de janeiro de 2020". Atual: `15/01/2020` em `.receipt-date-value` |
// | 3 | Alterar para data futura e gerar | `2030-06-20` | 🐞 Esperado (SDD): "20 de junho de 2030". Atual: `20/06/2030` |
// | 4 | Apagar a data e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |
// | 5 | Gerar no modelo detalhado | `2020-01-15` | A linha "Data de Emissão" exibe a mesma data |

// **Critério de Aceite:** Data formatada corretamente no recibo.

// **Notas Cypress:** o formato por extenso do SDD não é usado (DEF-15); o teste fixa o
// comportamento atual `dd/mm/aaaa`.

describe("TC-INF-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Data de Emissão", () => {
    const data = () => cy.get('[data-testid="input-date"]');

    // | 1 | Verificar valor inicial | — | Data atual pré-preenchida (`AAAA-MM-DD`) |
    // DEF-04: comportamento atual (UTC); inverter após correção para a data local.
    data().should("have.value", new Date().toISOString().split("T")[0]);

    // Demais passos exigem o formulário completo; a massa só é aplicada depois
    // de verificar o valor inicial da data.
    cy.preencherFormulario();

    // | 2 | Alterar para data passada e gerar | `2020-01-15` | 🐞 Esperado (SDD): "15 de janeiro de 2020". Atual: `15/01/2020` em `.receipt-date-value` |
    data().clear().type("2020-01-15");
    cy.gerarRecibo();
    cy.get(".receipt-date-value").should("have.text", "15/01/2020");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 3 | Alterar para data futura e gerar | `2030-06-20` | 🐞 Esperado (SDD): "20 de junho de 2030". Atual: `20/06/2030` |
    data().clear().type("2030-06-20");
    cy.gerarRecibo();
    cy.get(".receipt-date-value").should("have.text", "20/06/2030");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 4 | Apagar a data e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |
    data().clear();
    cy.get('[data-testid="btn-generate"]').click();
    data().should("match", ":invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 5 | Gerar no modelo detalhado | `2020-01-15` | A linha "Data de Emissão" exibe a mesma data |
    data().type("2020-01-15");
    cy.get("#receiptTemplate").select("detailed");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-detailed-row")
      .contains(".receipt-detailed-label", "Data de Emissão")
      .siblings(".receipt-detailed-value")
      .should("have.text", "15/01/2020");
  });
});
