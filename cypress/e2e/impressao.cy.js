// ## 7. Testes de Impressão e PDF

// #### TC-IMP-001: CSS @media print — Formulário Oculto

// **Prioridade:** P1 · **Status:** ✅ Automatizável (Chromium)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo e emular `print` | — | — |
// | 2 | Verificar o formulário | `main` | `display: none` |
// | 3 | Verificar o recibo | `#printContainer` | `display: block` |
// | 4 | Verificar botões de ação | `.print-actions` | `display: none` |
// | 5 | Verificar cabeçalho e rodapé da página | `body > header` | `display: none` |

// **Critério de Aceite:** Apenas o recibo aparece na impressão.

// **Notas Cypress:** o app oculta tudo o que é filho direto de `body` e não é
// `#printContainer`. `Cypress.automation` é chamado imediatamente; por isso a
// emulação é agendada dentro de `cy.then`, depois de gerar o recibo.

// #### TC-IMP-002: CSS @media print — Layout A4

// **Prioridade:** P2 · **Status:** ✅ Automatizável (Chromium)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Localizar as regras `@page` | `document.styleSheets` → `CSSPageRule` | `size: A4` |
// | 2 | Verificar as margens da página | — | `margin-top` e `margin-bottom` de 24 mm; laterais 0; primeira página com margem 0 e `margin-bottom` de 24 mm |
// | 3 | Verificar o recibo | `.receipt-wrapper` em `print` | Largura 100%, sem sombra e sem borda arredondada |

// **Critério de Aceite:** Recibo formatado para papel A4.

// **Notas Cypress:** o SDD §5.6 descreve margens de 15 mm e fonte de 11 pt; o
// app usa margens de 24 mm no topo/rodapé e não define 11 pt (o corpo do recibo
// mede 16 px). Trate como divergência de documentação (DIV-01): este caso fixa
// o comportamento atual.

// #### TC-IMP-003: Cores na Impressão

// **Prioridade:** P3 · **Status:** 🟡 Parcial

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Escolher a cor `#4CAF50`, gerar e emular `print` | — | `.receipt-header` com fundo `rgb(76, 175, 80)` e `print-color-adjust: exact` |
// | 2 | Verificar o total | `.receipt-total-box` | Fundo igual à cor de destaque, com `print-color-adjust: exact` |
// | 3 | Verificar os cards | `.receipt-vehicle-card` | Fundo `rgb(243, 244, 246)` e borda cinza |
// | 4 | Verificar legibilidade em preto e branco | Pré-visualização do navegador | Texto legível; logo reconhecível 🖐 |

// **Critério de Aceite:** Cores de destaque preservadas na impressão e texto legível.

// **Notas Cypress:** o SDD §5.6 prevê impressão monocromática "sem fundos
// coloridos"; o app **força** as cores (DIV-01). Este caso fixa o comportamento
// atual para os passos 1–3; o passo 4 é manual.

// #### TC-IMP-004: Salvar como PDF

// **Prioridade:** P2 · **Status:** 🖐 Manual

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo e clicar em "Imprimir / Salvar PDF" | — | Diálogo de impressão com o destino "Salvar como PDF" |
// | 2 | Verificar o nome sugerido | — | `DD.MM.AAAA - Cliente - Modelo` |
// | 3 | Salvar e abrir o PDF | — | Recibo completo e legível, em A4 |
// | 4 | Verificar a logo no PDF | Recibo com logo | Logo renderizada corretamente |
// | 5 | Verificar documento longo | 50 serviços, modelo detalhado | Várias páginas sem quebras que cortem a tabela ou o total |

// **Critério de Aceite:** O PDF contém todos os dados, em formato A4.

const emularMidia = (media) =>
  cy.then(() =>
    Cypress.automation("remote:debugger:protocol", {
      command: "Emulation.setEmulatedMedia",
      params: { media },
    })
  );

const regrasDePagina = (doc) => {
  const regras = [];

  const percorrer = (lista) => {
    [...lista].forEach((regra) => {
      if (regra.type === CSSRule.PAGE_RULE) {
        regras.push(regra);
      }
      if (regra.cssRules) {
        percorrer(regra.cssRules);
      }
    });
  };

  [...doc.styleSheets].forEach((folha) => {
    try {
      percorrer(folha.cssRules);
    } catch (erro) {
      // Folhas cross-origin não expõem cssRules.
    }
  });

  return regras;
};

describe("TC-IMP-001", () => {
  afterEach(() => {
    emularMidia("screen");
  });

  it("CSS @media print — Formulário Oculto", () => {
    cy.abrirFormulario();
    cy.preencherFormulario();
    cy.gerarRecibo();

    // | 1 | Gerar um recibo e emular `print` | — | — |
    emularMidia("print");

    // | 2 | Verificar o formulário | `main` | `display: none` |
    cy.get("main").should("have.css", "display", "none");

    // | 3 | Verificar o recibo | `#printContainer` | `display: block` |
    cy.get("#printContainer").should("have.css", "display", "block");

    // | 4 | Verificar botões de ação | `.print-actions` | `display: none` |
    cy.get(".print-actions").should("have.css", "display", "none");

    // | 5 | Verificar cabeçalho e rodapé da página | `body > header` | `display: none` |
    cy.get("body > header").should("have.css", "display", "none");
  });
});

describe("TC-IMP-002", () => {
  afterEach(() => {
    emularMidia("screen");
  });

  it("CSS @media print — Layout A4", () => {
    cy.abrirFormulario();
    cy.preencherFormulario();
    cy.gerarRecibo();
    emularMidia("print");

    // | 1 | Localizar as regras `@page` | `document.styleSheets` → `CSSPageRule` | `size: A4` |
    cy.document().then((doc) => {
      const regras = regrasDePagina(doc);
      expect(regras.length, "regras @page encontradas").to.be.gte(1);

      const geral = regras.find((regra) => regra.selectorText === "");
      expect(geral, "@page geral").to.not.be.undefined;
      expect(geral.style.size).to.match(/^a4$/i);

      // | 2 | Verificar as margens da página | — | `margin-top` e `margin-bottom` de 24 mm; laterais 0; primeira página com margem 0 e `margin-bottom` de 24 mm |
      expect(geral.style.marginTop).to.eq("24mm");
      expect(geral.style.marginBottom).to.eq("24mm");
      expect(geral.style.marginLeft).to.eq("0px");
      expect(geral.style.marginRight).to.eq("0px");

      const primeira = regras.find((regra) => regra.selectorText === ":first");
      expect(primeira, "@page :first").to.not.be.undefined;
      expect(primeira.style.marginTop).to.eq("0px");
      expect(primeira.style.marginBottom).to.eq("24mm");
      expect(primeira.style.marginLeft).to.eq("0px");
      expect(primeira.style.marginRight).to.eq("0px");
    });

    // | 3 | Verificar o recibo | `.receipt-wrapper` em `print` | Largura 100%, sem sombra e sem borda arredondada |
    cy.get("#receiptContent .receipt-wrapper").then(($wrapper) => {
      const elemento = $wrapper[0];
      const estilo = elemento.ownerDocument.defaultView.getComputedStyle(elemento);
      const container = elemento.closest("#printContainer");

      expect(parseFloat(estilo.width)).to.be.closeTo(
        container.clientWidth,
        1
      );
      expect(estilo.maxWidth).to.eq("100%");
      expect(estilo.boxShadow).to.eq("none");
      expect(estilo.borderRadius).to.eq("0px");
    });
  });
});

describe("TC-IMP-003", () => {
  afterEach(() => {
    emularMidia("screen");
  });

  it("Cores na Impressão", () => {
    cy.abrirFormulario();

    // | 1 | Escolher a cor `#4CAF50`, gerar e emular `print` | — | `.receipt-header` com fundo `rgb(76, 175, 80)` e `print-color-adjust: exact` |
    cy.get('.color-preset[data-color="#4CAF50"]').click();
    cy.get("#accentColorHex").should("have.value", "#4CAF50");
    cy.preencherFormulario();
    cy.gerarRecibo();
    emularMidia("print");

    cy.get("#receiptContent .receipt-header").should(($el) => {
      const estilo = $el[0].ownerDocument.defaultView.getComputedStyle($el[0]);
      expect(estilo.backgroundColor).to.eq("rgb(76, 175, 80)");
      expect(estilo.getPropertyValue("print-color-adjust")).to.eq("exact");
    });

    // | 2 | Verificar o total | `.receipt-total-box` | Fundo igual à cor de destaque, com `print-color-adjust: exact` |
    cy.get("#receiptContent .receipt-total-box").should(($el) => {
      const estilo = $el[0].ownerDocument.defaultView.getComputedStyle($el[0]);
      expect(estilo.backgroundColor).to.eq("rgb(76, 175, 80)");
      expect(estilo.getPropertyValue("print-color-adjust")).to.eq("exact");
    });

    // | 3 | Verificar os cards | `.receipt-vehicle-card` | Fundo `rgb(243, 244, 246)` e borda cinza |
    cy.get("#receiptContent .receipt-vehicle-card").should(($el) => {
      const estilo = $el[0].ownerDocument.defaultView.getComputedStyle($el[0]);
      expect(estilo.backgroundColor).to.eq("rgb(243, 244, 246)");
      expect(estilo.borderTopColor).to.eq("rgb(229, 231, 235)");
      expect(estilo.borderTopWidth).to.eq("1px");
    });

    // | 4 | Verificar legibilidade em preto e branco | Pré-visualização do navegador | Texto legível; logo reconhecível 🖐 |
    // Verificação manual 🖐.
  });
});

describe("TC-IMP-004", () => {
  // Caso manual: o diálogo nativo de impressão/PDF não é controlável pelo Cypress.
  it.skip("Salvar como PDF (manual)", () => {
    // | 1 | Gerar um recibo e clicar em "Imprimir / Salvar PDF" | — | Diálogo de impressão com o destino "Salvar como PDF" |
    // | 2 | Verificar o nome sugerido | — | `DD.MM.AAAA - Cliente - Modelo` |
    // | 3 | Salvar e abrir o PDF | — | Recibo completo e legível, em A4 |
    // | 4 | Verificar a logo no PDF | Recibo com logo | Logo renderizada corretamente |
    // | 5 | Verificar documento longo | 50 serviços, modelo detalhado | Várias páginas sem quebras que cortem a tabela ou o total |
  });
});
