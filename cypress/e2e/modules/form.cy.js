// ### 4.1 Módulo: Formulário Principal

// #### TC-FRM-001: Carregamento Inicial do Formulário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir o formulário no navegador | `/src/html/form.html` (via `baseUrl`) | Página carrega completamente (`document.readyState` = `complete`) |
// | 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
// | 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo Agora" está desabilitado |
// | 4 | Verificar estado do checkbox | — | Checkbox de privacidade está desmarcado |
// | 5 | Verificar quantidade de linhas de serviço | — | 1 linha de serviço pré-adicionada |
// | 6 | Verificar data de emissão | — | Campo pré-preenchido com a data local atual (`AAAA-MM-DD`) |
// | 7 | Verificar tipo do recibo | — | Campo pré-preenchido com "Recibo de Pagamento" |
// | 8 | Verificar select de cidade | — | Desabilitado, exibindo "Selecione o estado primeiro" |
// | 9 | Verificar painel de logo | — | Aba "Enviar do computador" ativa; painel de URL oculto |
// | 10 | Verificar preview | — | `#printContainer` não está visível |

// **Critério de Aceite:** Página carrega, todos os elementos visíveis, estado inicial correto.

// **Notas Cypress:**
// - Passo 6: o app usa `toISOString()` (UTC) 🐞 DEF-04; o teste fixa o comportamento atual.

describe("TC-FRM-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Carregamento Inicial do Formulário", () => {
    // | 1 | Abrir o formulário no navegador | `/src/html/form.html` (via `baseUrl`) | Página carrega completamente (`document.readyState` = `complete`) |
    cy.document().its("readyState").should("eq", "complete");

    // | 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
    [
      "input-receipt-type",
      "input-date",
      "input-client-name",
      "input-client-document",
      "input-client-phone",
      "input-beneficiary-name",
      "input-beneficiary-document",
      "input-beneficiary-phone",
      "input-vehicle-model",
      "input-vehicle-plate",
      "input-vehicle-year",
      "input-establishment-name",
      "select-establishment-state",
      "select-establishment-city",
      "input-establishment-neighborhood",
      "input-establishment-zipcode",
      "input-establishment-street",
      "input-establishment-number",
      "input-service-name",
      "input-service-value",
      "input-observations",
    ].forEach((id) => {
      cy.get(`[data-testid="${id}"]`).should("be.visible");
    });

    // | 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo Agora" está desabilitado |
    cy.get('[data-testid="btn-generate"]').should("be.disabled");

    // | 4 | Verificar estado do checkbox | — | Checkbox de privacidade está desmarcado |
    cy.get('[data-testid="input-privacy"]').should("not.be.checked");

    // | 5 | Verificar quantidade de linhas de serviço | — | 1 linha de serviço pré-adicionada |
    cy.get(".service-row").should("have.length", 1);

    // | 6 | Verificar data de emissão | — | Campo pré-preenchido com a data local atual (`AAAA-MM-DD`) |
    // DEF-04: comportamento atual (UTC); inverter após correção para a data local.
    cy.get('[data-testid="input-date"]').should(
      "have.value",
      new Date().toISOString().split("T")[0]
    );

    // | 7 | Verificar tipo do recibo | — | Campo pré-preenchido com "Recibo de Pagamento" |
    cy.get('[data-testid="input-receipt-type"]').should(
      "have.value",
      "Recibo de Pagamento"
    );

    // | 8 | Verificar select de cidade | — | Desabilitado, exibindo "Selecione o estado primeiro" |
    cy.get('[data-testid="select-establishment-city"]')
      .should("be.disabled")
      .and("contain.text", "Selecione o estado primeiro");

    // | 9 | Verificar painel de logo | — | Aba "Enviar do computador" ativa; painel de URL oculto |
    cy.get('[data-testid="btn-tab-upload"]').should("have.class", "active");
    cy.get("#panelUpload").should("be.visible");
    cy.get("#panelUrl").should("not.be.visible");

    // | 10 | Verificar preview | — | `#printContainer` não está visível |
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-FRM-002: Habilitação do Botão ao Marcar Privacidade

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Localizar checkbox de privacidade | — | Checkbox visível e desmarcado; botão desabilitado |
// | 2 | Clicar no checkbox | — | Checkbox marcado e botão **habilitado** |
// | 3 | Clicar em "Gerar Recibo Agora" com campos obrigatórios vazios | Formulário apenas com valores iniciais | Preview não abre; o navegador foca o primeiro campo inválido (`input-client-name`) |
// | 4 | Desmarcar o checkbox | — | Botão volta a ficar desabilitado |
// | 5 | Preencher todos os campos obrigatórios e marcar o checkbox | Massa válida (Apêndice A) | Botão habilitado e clicável |

// **Critério de Aceite:** O botão é habilitado **exclusivamente** pelo checkbox.

describe("TC-FRM-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Habilitação do Botão ao Marcar Privacidade", () => {
    // | 1 | Localizar checkbox de privacidade | — | Checkbox visível e desmarcado; botão desabilitado |
    cy.get('[data-testid="input-privacy"]')
      .should("be.visible")
      .and("not.be.checked");
    cy.get('[data-testid="btn-generate"]').should("be.disabled");

    // | 2 | Clicar no checkbox | — | Checkbox marcado e botão **habilitado** |
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="input-privacy"]').should("be.checked");
    cy.get('[data-testid="btn-generate"]').should("be.enabled");

    // | 3 | Clicar em "Gerar Recibo Agora" com campos obrigatórios vazios | Formulário apenas com valores iniciais | Preview não abre; o navegador foca o primeiro campo inválido (`input-client-name`) |
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.focused().should("have.attr", "data-testid", "input-client-name");

    // | 4 | Desmarcar o checkbox | — | Botão volta a ficar desabilitado |
    cy.get('[data-testid="input-privacy"]').uncheck();
    cy.get('[data-testid="btn-generate"]').should("be.disabled");

    // | 5 | Preencher todos os campos obrigatórios e marcar o checkbox | Massa válida (Apêndice A) | Botão habilitado e clicável |
    cy.preencherFormulario();
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]')
      .should("be.enabled")
      .and("be.visible");
  });
});

// #### TC-FRM-003: Submissão de Formulário Válido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher dados mínimos obrigatórios | Massa válida (Apêndice A) | Formulário completo |
// | 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
// | 3 | Clicar em "Gerar Recibo Agora" | — | Preview abre (`#printContainer` com classe `visible`); `window.print` **não** foi chamado |
// | 4 | Verificar renderização | — | Existe exatamente 1 `.receipt-wrapper` dentro de `#receiptContent` |
// | 5 | Verificar botão do formulário | — | Texto volta a "Gerar Recibo Agora" e botão habilitado |
// | 6 | Verificar foco e anúncio | — | Foco no botão "✕ Fechar"; `#a11yLive` contém "Recibo gerado com sucesso…" |
// | 7 | Clicar em "🖨️ Imprimir / Salvar PDF" | — | `window.print` chamado 1 vez |

// **Critério de Aceite:** Recibo gerado e exibido em preview; o diálogo de impressão só abre ao clicar no botão de impressão.

// **Notas Cypress:** o estado de loading é síncrono e não observável (DIV-07).

describe("TC-FRM-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Submissão de Formulário Válido", () => {
    // | 1 | Preencher dados mínimos obrigatórios | Massa válida (Apêndice A) | Formulário completo |
    cy.preencherFormulario();

    // | 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
    cy.get('[data-testid="input-privacy"]').check().should("be.checked");

    // | 3 | Clicar em "Gerar Recibo Agora" | — | Preview abre (`#printContainer` com classe `visible`); `window.print` **não** foi chamado |
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
    cy.get("@print").should("not.have.been.called");

    // | 4 | Verificar renderização | — | Existe exatamente 1 `.receipt-wrapper` dentro de `#receiptContent` |
    cy.get("#receiptContent .receipt-wrapper").should("have.length", 1);

    // | 5 | Verificar botão do formulário | — | Texto volta a "Gerar Recibo Agora" e botão habilitado |
    cy.get('[data-testid="btn-generate"]')
      .should("have.text", "Gerar Recibo Agora")
      .and("be.enabled");

    // | 6 | Verificar foco e anúncio | — | Foco no botão "✕ Fechar"; `#a11yLive` contém "Recibo gerado com sucesso…" |
    cy.focused().should("have.attr", "data-testid", "btn-close-preview");
    cy.get("#a11yLive").should("contain.text", "Recibo gerado com sucesso");

    // | 7 | Clicar em "🖨️ Imprimir / Salvar PDF" | — | `window.print` chamado 1 vez |
    cy.get('[data-testid="btn-print-receipt"]').click();
    cy.get("@print").should("have.been.calledOnce");
  });
});

// #### TC-FRM-004: Redirecionamento para GitHub do Projeto

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a página inicial | `/` | Página carrega |
// | 2 | Localizar o ícone do GitHub no cabeçalho | `header a[aria-label="Ver código-fonte no GitHub"]` | Ícone visível |
// | 3 | Verificar atributos do link | — | `href` = `https://github.com/nilton-f-o-junior/recebi` e `target` = `_blank` |

// **Critério de Aceite:** O link aponta para o repositório oficial e abre em nova aba.

// **Notas Cypress:** o ícone está na **home** (`index.html`), não no formulário.

describe("TC-FRM-004", () => {
  it("Redirecionamento para GitHub do Projeto", () => {
    // | 1 | Abrir a página inicial | `/` | Página carrega |
    cy.visit("/");
    cy.document().its("readyState").should("eq", "complete");

    // | 2 | Localizar o ícone do GitHub no cabeçalho | `header a[aria-label="Ver código-fonte no GitHub"]` | Ícone visível |
    cy.get('header a[aria-label="Ver código-fonte no GitHub"]').should(
      "be.visible"
    );

    // | 3 | Verificar atributos do link | — | `href` = `https://github.com/nilton-f-o-junior/recebi` e `target` = `_blank` |
    cy.get('header a[aria-label="Ver código-fonte no GitHub"]')
      .should("have.attr", "href", "https://github.com/nilton-f-o-junior/recebi")
      .and("have.attr", "target", "_blank");
  });
});

// #### TC-FRM-005: Validação Nativa de Campos Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Marcar o checkbox com o formulário vazio | — | Botão habilitado |
// | 2 | Clicar em "Gerar Recibo Agora" | — | Preview **não** abre |
// | 3 | Contar campos inválidos | `form :invalid` | 14 campos inválidos |
// | 4 | Verificar foco | — | O primeiro campo inválido (`input-client-name`) recebe foco |
// | 5 | Preencher somente o nome do cliente e tentar de novo | `João Silva` | O primeiro campo inválido passa a ser `input-client-phone` |

// **Critério de Aceite:** Nenhum recibo é gerado com campo obrigatório vazio.

describe("TC-FRM-005", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação Nativa de Campos Obrigatórios", () => {
    // | 1 | Marcar o checkbox com o formulário vazio | — | Botão habilitado |
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').should("be.enabled");

    // | 2 | Clicar em "Gerar Recibo Agora" | — | Preview **não** abre |
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 3 | Contar campos inválidos | `form :invalid` | 14 campos inválidos |
    cy.get("form :invalid").should("have.length", 14);

    // | 4 | Verificar foco | — | O primeiro campo inválido (`input-client-name`) recebe foco |
    cy.focused().should("have.attr", "data-testid", "input-client-name");

    // | 5 | Preencher somente o nome do cliente e tentar de novo | `João Silva` | O primeiro campo inválido passa a ser `input-client-phone` |
    cy.get('[data-testid="input-client-name"]').type("João Silva");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.focused().should("have.attr", "data-testid", "input-client-phone");
  });
});

// #### TC-FRM-006: Barra de Progresso do Formulário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar largura inicial de `#stepFill` | — | ≈ 17,65% (3 de 17 campos `required`: tipo, data e checkbox) |
// | 2 | Preencher o nome do cliente | `João Silva` | ≈ 23,53% |
// | 3 | Preencher todos os demais obrigatórios | Massa válida | 100% |
// | 4 | Apagar o nome do cliente | — | Largura menor que 100% |

// **Critério de Aceite:** A barra cresce conforme os obrigatórios são preenchidos.

// **Notas Cypress:** 🐞 DEF-14: o checkbox conta sempre como preenchido e uma linha nova
// não recalcula a barra até haver digitação; o teste fixa o comportamento atual.

describe("TC-FRM-006", () => {
  const largura = () =>
    cy.get("#stepFill").then(($el) => parseFloat($el[0].style.width));

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Barra de Progresso do Formulário", () => {
    // | 1 | Verificar largura inicial de `#stepFill` | — | ≈ 17,65% (3 de 17 campos `required`: tipo, data e checkbox) |
    largura().should("be.closeTo", 17.65, 0.1);

    // | 2 | Preencher o nome do cliente | `João Silva` | ≈ 23,53% |
    cy.get('[data-testid="input-client-name"]').type("João Silva");
    largura().should("be.closeTo", 23.53, 0.1);

    // | 3 | Preencher todos os demais obrigatórios | Massa válida | 100% |
    cy.preencherFormulario();
    largura().should("be.closeTo", 100, 0.1);

    // | 4 | Apagar o nome do cliente | — | Largura menor que 100% |
    cy.get('[data-testid="input-client-name"]').clear();
    largura().should("be.lessThan", 100);
  });
});
