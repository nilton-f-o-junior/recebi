// ### 4.15 Módulo: Personalização do Recibo

// #### TC-PER-001: Cores Sugeridas

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar valor padrão | — | `#accentColorHex` = `#6CACFB`; `#customColor` = `#6cacfb` |
// | 2 | Verificar os presets | — | 6 botões `.color-preset` com `data-color`: `#6CACFB`, `#4CAF50`, `#F44336`, `#FF9800`, `#9C27B0`, `#000000` |
// | 3 | Clicar no preset verde e gerar | `#4CAF50` | `#accentColorHex` = `#4CAF50`; `.receipt-wrapper` com `--receipt-accent: #4CAF50`; `.receipt-header` com fundo `rgb(76, 175, 80)` |
// | 4 | Clicar no preset vermelho | `#F44336` | `#customColor` passa a `#f44336` |

// **Critério de Aceite:** O preset escolhido define a cor de destaque do recibo.

// **Notas Cypress:** os presets não têm `data-testid`; use
// `.color-preset[data-color="#4CAF50"]`.

const PRESETS = [
  "#6CACFB",
  "#4CAF50",
  "#F44336",
  "#FF9800",
  "#9C27B0",
  "#000000",
];

const accentDoRecibo = (valor) => {
  cy.get("#receiptContent .receipt-wrapper").should(($el) => {
    const style = $el[0].ownerDocument.defaultView.getComputedStyle($el[0]);
    expect(style.getPropertyValue("--receipt-accent").trim()).to.eq(valor);
  });
};

describe("TC-PER-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Cores Sugeridas", () => {
    // | 1 | Verificar valor padrão | — | `#accentColorHex` = `#6CACFB`; `#customColor` = `#6cacfb` |
    cy.get("#accentColorHex").should("have.value", "#6CACFB");
    cy.get("#customColor").should("have.value", "#6cacfb");

    // | 2 | Verificar os presets | — | 6 botões `.color-preset` com `data-color`: `#6CACFB`, `#4CAF50`, `#F44336`, `#FF9800`, `#9C27B0`, `#000000` |
    cy.get(".color-preset")
      .should("have.length", 6)
      .then(($botoes) => {
        expect([...$botoes].map((b) => b.dataset.color)).to.deep.eq(PRESETS);
      });

    // | 3 | Clicar no preset verde e gerar | `#4CAF50` | `#accentColorHex` = `#4CAF50`; `.receipt-wrapper` com `--receipt-accent: #4CAF50`; `.receipt-header` com fundo `rgb(76, 175, 80)` |
    cy.get('.color-preset[data-color="#4CAF50"]').click();
    cy.get("#accentColorHex").should("have.value", "#4CAF50");
    cy.preencherFormulario();
    cy.gerarRecibo();
    accentDoRecibo("#4CAF50");
    cy.get("#receiptContent .receipt-header").should(
      "have.css",
      "background-color",
      "rgb(76, 175, 80)"
    );

    // | 4 | Clicar no preset vermelho | `#F44336` | `#customColor` passa a `#f44336` |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get('.color-preset[data-color="#F44336"]').click();
    cy.get("#customColor").should("have.value", "#f44336");
  });
});

// #### TC-PER-002: Cor Personalizada

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Definir cor personalizada | `#ff0000` | `#accentColorHex` = `#ff0000` |
// | 2 | Gerar | — | `.receipt-wrapper` com `--receipt-accent: #ff0000`; `.receipt-header` e `.receipt-total-box` com fundo `rgb(255, 0, 0)` |

// **Critério de Aceite:** A cor personalizada é aplicada aos elementos de destaque.

// **Notas Cypress:** `cy.get('#customColor').invoke('val', '#ff0000').trigger('input')`.

describe("TC-PER-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Cor Personalizada", () => {
    // | 1 | Definir cor personalizada | `#ff0000` | `#accentColorHex` = `#ff0000` |
    cy.get("#customColor").invoke("val", "#ff0000").trigger("input");
    cy.get("#accentColorHex").should("have.value", "#ff0000");

    // | 2 | Gerar | — | `.receipt-wrapper` com `--receipt-accent: #ff0000`; `.receipt-header` e `.receipt-total-box` com fundo `rgb(255, 0, 0)` |
    cy.preencherFormulario();
    cy.gerarRecibo();
    accentDoRecibo("#ff0000");
    cy.get("#receiptContent .receipt-header").should(
      "have.css",
      "background-color",
      "rgb(255, 0, 0)"
    );
    cy.get("#receiptContent .receipt-total-box").should(
      "have.css",
      "background-color",
      "rgb(255, 0, 0)"
    );
  });
});

// #### TC-PER-003: Seleção de Modelo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar as opções do select | `#receiptTemplate` | 2 opções: "Modelo Padrão" (`default`) e "Modelo Detalhado" (`detailed`); padrão selecionado |
// | 2 | Gerar no modelo padrão | — | Existe `.receipt-parties`; nenhum `.receipt-detailed-section` |
// | 3 | Fechar, selecionar "Modelo Detalhado" e gerar | `detailed` | Existem `.receipt-detailed-section`; nenhum `.receipt-parties` |

// **Critério de Aceite:** O modelo escolhido define o layout do recibo.

describe("TC-PER-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Seleção de Modelo", () => {
    // | 1 | Verificar as opções do select | `#receiptTemplate` | 2 opções: "Modelo Padrão" (`default`) e "Modelo Detalhado" (`detailed`); padrão selecionado |
    cy.get("#receiptTemplate").should("have.value", "default");
    cy.get("#receiptTemplate")
      .find("option")
      .then(($opcoes) => {
        expect([...$opcoes].map((o) => o.textContent.trim())).to.deep.eq([
          "Modelo Padrão",
          "Modelo Detalhado",
        ]);
        expect([...$opcoes].map((o) => o.value)).to.deep.eq([
          "default",
          "detailed",
        ]);
      });

    // | 2 | Gerar no modelo padrão | — | Existe `.receipt-parties`; nenhum `.receipt-detailed-section` |
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-parties").should("exist");
    cy.get("#receiptContent .receipt-detailed-section").should("not.exist");

    // | 3 | Fechar, selecionar "Modelo Detalhado" e gerar | `detailed` | Existem `.receipt-detailed-section`; nenhum `.receipt-parties` |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get("#receiptTemplate").select("detailed");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-detailed-section").should("exist");
    cy.get("#receiptContent .receipt-parties").should("not.exist");
  });
});
