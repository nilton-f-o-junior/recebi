// ### 4.14 Módulo: Preview e Impressão do Recibo

// #### TC-PRE-001: Abertura do Preview

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo válido | Massa válida | `#printContainer` com classe `visible` |
// | 2 | Verificar bloqueio de rolagem | — | `document.body.style.overflow` = `hidden` |
// | 3 | Verificar foco | — | Foco no botão "✕ Fechar" (primeiro botão de `.print-actions`) |
// | 4 | Verificar anúncio | — | `#a11yLive` contém "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar." |
// | 5 | Verificar botões de ação | — | `btn-close-preview` e `btn-print-receipt` visíveis |

// **Critério de Aceite:** Preview acessível, com foco gerenciado.

describe("TC-PRE-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Abertura do Preview", () => {
    // | 1 | Gerar um recibo válido | Massa válida | `#printContainer` com classe `visible` |
    cy.gerarRecibo();

    // | 2 | Verificar bloqueio de rolagem | — | `document.body.style.overflow` = `hidden` |
    cy.document().then((doc) => {
      expect(doc.body.style.overflow).to.eq("hidden");
    });

    // | 3 | Verificar foco | — | Foco no botão "✕ Fechar" (primeiro botão de `.print-actions`) |
    cy.get('[data-testid="btn-close-preview"]').should("be.focused");
    cy.get(".print-actions button")
      .first()
      .invoke("text")
      .then((texto) => {
        expect(texto.trim()).to.eq("✕ Fechar");
      });

    // | 4 | Verificar anúncio | — | `#a11yLive` contém "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar." |
    cy.get("#a11yLive").should(
      "have.text",
      "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar."
    );

    // | 5 | Verificar botões de ação | — | `btn-close-preview` e `btn-print-receipt` visíveis |
    cy.get('[data-testid="btn-close-preview"]').should("be.visible");
    cy.get('[data-testid="btn-print-receipt"]').should("be.visible");
  });
});

// #### TC-PRE-002: Fechamento do Preview

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Clicar em "✕ Fechar" | `btn-close-preview` | `#printContainer` deixa de ser visível |
// | 2 | Verificar rolagem | — | `body.style.overflow` vazio |
// | 3 | Verificar dados do formulário | — | Todos os campos mantêm os valores digitados |

// **Critério de Aceite:** Fechar o preview não perde dados.

describe("TC-PRE-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Fechamento do Preview", () => {
    cy.gerarRecibo();

    // | 1 | Clicar em "✕ Fechar" | `btn-close-preview` | `#printContainer` deixa de ser visível |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get("#printContainer")
      .should("not.have.class", "visible")
      .and("not.be.visible");

    // | 2 | Verificar rolagem | — | `body.style.overflow` vazio |
    cy.document().then((doc) => {
      expect(doc.body.style.overflow).to.eq("");
    });

    // | 3 | Verificar dados do formulário | — | Todos os campos mantêm os valores digitados |
    cy.get('[data-testid="input-receipt-type"]').should(
      "have.value",
      "Recibo de Pagamento"
    );
    cy.get('[data-testid="input-date"]').should("have.value", "2020-01-15");
    cy.get("#clientName").should("have.value", "João Silva");
    cy.get("#clientDoc").should("have.value", "529.982.247-25");
    cy.get("#clientPhone").should("have.value", "(11) 99999-8888");
    cy.get("#providerName").should("have.value", "Maria Ltda");
    cy.get("#providerDoc").should("have.value", "11.444.777/0001-61");
    cy.get("#carModel").should("have.value", "Fiat Strada");
    cy.get("#carPlate").should("have.value", "ABC-1D23");
    cy.get("#estName").should("have.value", "Lava-jato Express");
    cy.get("#estCep").should("have.value", "01310-100");
  });
});

// #### TC-PRE-003: Impressão e Título do Arquivo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar com data `2020-01-15`, cliente `João Silva` e modelo `Fiat Strada` | — | Preview aberto |
// | 2 | Clicar em "🖨️ Imprimir / Salvar PDF" | `btn-print-receipt` | `window.print` chamado 1 vez |
// | 3 | Verificar o título durante a impressão | — | `document.title` = `15.01.2020 - João Silva - Fiat Strada` |
// | 4 | Aguardar ≈ 1 s | — | `document.title` restaurado ("recibi - Gerador de Recibo Online") |

// **Critério de Aceite:** O nome sugerido para o PDF segue `DD.MM.AAAA - Cliente - Modelo`.

// **Notas Cypress:** `cy.stub(win, 'print').callsFake(() => { titulo = win.document.title })`.
// O título restaurado é o `<title>` da página, que hoje tem erro de grafia
// ("recibi"; DEF-05).

describe("TC-PRE-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Impressão e Título do Arquivo", () => {
    // | 1 | Gerar com data `2020-01-15`, cliente `João Silva` e modelo `Fiat Strada` | — | Preview aberto |
    cy.gerarRecibo();

    // | 2 | Clicar em "🖨️ Imprimir / Salvar PDF" | `btn-print-receipt` | `window.print` chamado 1 vez |
    let tituloDurante = "";
    cy.window().then((win) => {
      cy.get("@print").then((printStub) => {
        printStub.callsFake(() => {
          tituloDurante = win.document.title;
        });
      });
    });
    cy.get('[data-testid="btn-print-receipt"]').click();
    cy.get("@print").should("have.been.calledOnce");

    // | 3 | Verificar o título durante a impressão | — | `document.title` = `15.01.2020 - João Silva - Fiat Strada` |
    cy.then(() => {
      expect(tituloDurante).to.eq("15.01.2020 - João Silva - Fiat Strada");
    });

    // | 4 | Aguardar ≈ 1 s | — | `document.title` restaurado ("recibi - Gerador de Recibo Online") |
    cy.window().should((win) => {
      expect(win.document.title).to.eq("recibi - Gerador de Recibo Online");
    });
  });
});

// #### TC-PRE-004: Regeneração do Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo e fechar o preview | — | — |
// | 2 | Alterar o nome do cliente e gerar de novo | `Ana Souza` | Existe exatamente 1 `.receipt-wrapper`; o nome exibido é `Ana Souza` |

// **Critério de Aceite:** Cada geração substitui o conteúdo anterior.

describe("TC-PRE-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Regeneração do Recibo", () => {
    // | 1 | Gerar um recibo e fechar o preview | — | — |
    cy.gerarRecibo();
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Alterar o nome do cliente e gerar de novo | `Ana Souza` | Existe exatamente 1 `.receipt-wrapper`; o nome exibido é `Ana Souza` |
    cy.get("#clientName").clear().type("Ana Souza");
    cy.gerarRecibo();
    // O modal também tem um .receipt-wrapper de layout; o recibo gerado fica
    // dentro de #receiptContent e deve ser único.
    cy.get("#receiptContent .receipt-wrapper").should("have.length", 1);
    cy.get("#receiptContent .receipt-party-name").first().should(
      "have.text",
      "Ana Souza"
    );
  });
});

// #### TC-PRE-005: Fechar o Preview com a Tecla Esc

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo | — | Preview aberto |
// | 2 | Pressionar Esc | `{esc}` | Preview fechado |
// | 3 | Verificar o foco | — | Foco devolvido ao botão "Gerar Recibo Agora" |

// **Critério de Aceite:** Modal fechável pelo teclado, com foco restaurado (boa
// prática WAI-ARIA).

// **Notas Cypress:** atual: Esc não fecha o preview, e o código não devolve o foco
// ao fechar.

describe("TC-PRE-005", () => {
  // DEF-11: comportamento esperado; inverte após correção.
  it.skip("Fechar o Preview com a Tecla Esc (DEF-11)", () => {
    cy.abrirFormulario();
    cy.preencherFormulario();

    // | 1 | Gerar um recibo | — | Preview aberto |
    cy.gerarRecibo();

    // | 2 | Pressionar Esc | `{esc}` | Preview fechado |
    cy.get("body").type("{esc}");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 3 | Verificar o foco | — | Foco devolvido ao botão "Gerar Recibo Agora" |
    cy.get('[data-testid="btn-generate"]').should("be.focused");
  });
});
