// ## 8. Testes de Navegadores e Dispositivos

// #### TC-BRW-001: Compatibilidade Chrome

// **Prioridade:** P1 · **Status:** ✅ Automatizável (`--browser chrome`)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a aplicação | Chrome (stable) | Página carrega corretamente |
// | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros no console |
// | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |

// **Critério de Aceite:** 100% da funcionalidade no Chrome.

// #### TC-BRW-002: Compatibilidade Firefox

// **Prioridade:** P2 · **Status:** ✅ Automatizável (`--browser firefox`)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a aplicação, clicar em "Gerar Recibo" na home | Firefox (stable) | Navega para o formulário (o botão está dentro de um `<a>`) |
// | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
// | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |

// **Critério de Aceite:** 100% da funcionalidade no Firefox.

// #### TC-BRW-003: Compatibilidade Safari

// **Prioridade:** P2 · **Status:** 🖐 Manual (ou WebKit experimental do Cypress)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a aplicação | Safari (stable) | Página carrega corretamente |
// | 2 | Simular impressão | Cmd+P | Layout não quebrado |
// | 3 | Preencher e gerar | Fluxo completo | Funciona sem erros |
// | 4 | Verificar `input[type=date]` e `input[type=color]` | — | Controles utilizáveis |

// **Critério de Aceite:** Layout de impressão não quebrado no Safari.

// **Notas Cypress:** o Safari não está disponível no `cypress/included`; o caso
// permanece manual, com a tabela do TDD.

// #### TC-BRW-004: Compatibilidade Microsoft Edge

// **Prioridade:** P3 · **Status:** ✅ Automatizável (`--browser edge`)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a aplicação | Edge (stable) | Página carrega corretamente |
// | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
// | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez |

// **Critério de Aceite:** 100% da funcionalidade no Edge.

// #### TC-BRW-005: Responsividade Mobile (iOS)

// **Prioridade:** P2 · **Status:** 🟡 Parcial (layout automatizável; Safari iOS real é manual)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir com viewport de iPhone | `cy.viewport(375, 667)` | Grades `.grid-2`, `.grid-3` e `.grid-cards` em 1 coluna; sem rolagem horizontal |
// | 2 | Preencher o formulário | Massa válida | Campos acessíveis; linha de serviço em 2 colunas (descrição na linha de cima; valor e "×" embaixo) |
// | 3 | Testar a dropzone | `selectFile` | Upload funcional |
// | 4 | Gerar o recibo | — | `.receipt-wrapper` não excede a largura da viewport; legibilidade conferida manualmente 🖐 |

// **Critério de Aceite:** Layout mobile funcional.

// #### TC-BRW-006: Responsividade Mobile (Android)

// **Prioridade:** P2 · **Status:** 🟡 Parcial

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir com viewport Android | `cy.viewport(360, 640)` | Layout em coluna única; sem rolagem horizontal |
// | 2 | Preencher o formulário | Massa válida | Campos acessíveis; rolagem funcional |
// | 3 | Testar a dropzone | `selectFile` | Upload funcional |
// | 4 | Gerar o recibo | — | Recibo dentro da largura da viewport |

// **Critério de Aceite:** Layout mobile funcional.

// #### TC-BRW-007: Responsividade Tablet e Pontos de Quebra

// **Prioridade:** P3 · **Status:** ✅ Automatizável

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Viewport de tablet | `cy.viewport(768, 1024)` | `.grid-2` e `.grid-cards` com 2 colunas; `.grid-3` com 3 colunas; sem rolagem horizontal |
// | 2 | Viewport no limite | `cy.viewport(640, 900)` | Todas as grades em 1 coluna |
// | 3 | Viewport logo acima do limite | `cy.viewport(641, 900)` | `.grid-2`, `.grid-cards` e `.grid-3` voltam a múltiplas colunas |
// | 4 | Verificar espaçamento | — | Padding lateral adequado (inspeção visual 🖐) |

// **Critério de Aceite:** Layout adaptado para tablet.

// **Notas Cypress:** o ponto de quebra do app é **640 px** (`max-width: 640px`);
// o SDD §5.5 fala em 768 px (DIV-02). Leia as colunas com
// `getComputedStyle(el).gridTemplateColumns.split(' ').length`.

// O mesmo fluxo de fumaça é executado por navegador com
// `--browser chrome|firefox|edge`; o Safari permanece manual.
const abrirFormularioPelaHome = () => {
  cy.mockLocalidades();
  cy.mockViaCep();
  cy.visit("/");
  cy.get('[data-testid="btn-start-form"]').should("be.visible").click();
  cy.location("pathname").should("eq", "/src/html/form.html");
  cy.get("#receiptForm").should("be.visible");
  cy.window().then((win) => {
    cy.stub(win, "print").as("print");
    cy.spy(win.console, "error").as("consoleError");
  });
};

const preencherGerarEImprimir = () => {
  cy.preencherFormulario();
  cy.gerarRecibo();
  cy.get("#receiptContent .receipt-wrapper").should("be.visible");
  cy.get("@consoleError").should("not.have.been.called");

  cy.get('[data-testid="btn-print-receipt"]').click();
  cy.get("@print").should("have.been.calledOnce");
};

const verificarColunas = (seletor, esperado) => {
  cy.get(seletor)
    .filter(":visible")
    .should(($elementos) => {
      expect($elementos.length, `${seletor} visível`).to.be.gte(1);

      [...$elementos].forEach((elemento) => {
        const estilo = elemento.ownerDocument.defaultView.getComputedStyle(
          elemento
        );
        const colunas = estilo.gridTemplateColumns
          .split(" ")
          .filter(Boolean);

        expect(
          colunas.length,
          `${seletor} deve ter ${esperado} coluna(s)`
        ).to.eq(esperado);
      });
    });
};

const verificarSemRolagemHorizontal = () => {
  cy.document().then((doc) => {
    expect(
      doc.documentElement.scrollWidth,
      "largura do documento sem rolagem horizontal"
    ).to.be.lte(doc.documentElement.clientWidth + 1);
  });
};

const verificarLinhaServicoMobile = () => {
  cy.get("#servicesContainer .service-row")
    .first()
    .should(($row) => {
      const win = $row[0].ownerDocument.defaultView;
      const estilo = win.getComputedStyle($row[0]);
      const colunas = estilo.gridTemplateColumns.split(" ").filter(Boolean);
      const linhas = estilo.gridTemplateRows.split(" ").filter(Boolean);

      expect(colunas).to.have.length(2);
      expect(linhas).to.have.length(2);

      const campos = $row.find(".field");
      const descricao = win.getComputedStyle(campos[0]);
      const valor = win.getComputedStyle(campos[1]);
      const remover = win.getComputedStyle($row.find(".btn-remove")[0]);

      expect(descricao.gridColumnStart).to.eq("1");
      expect(descricao.gridColumnEnd).to.eq("-1");
      expect(valor.gridColumnStart).to.eq("1");
      expect(remover.gridColumnStart).to.eq("2");
    });
};

const enviarLogoPelaDropzone = () => {
  cy.get('[data-testid="dropzone-logo"]').selectFile(
    "cypress/fixtures/images/logo.png",
    { action: "drag-drop" }
  );
  cy.get("#logoPreviewImg").should(($img) => {
    expect($img.attr("src") || "").to.match(/^data:image\/png/);
  });
};

const verificarReciboDentroDaViewport = () => {
  cy.window().then((win) => {
    const wrapper = win.document.querySelector(
      "#receiptContent .receipt-wrapper"
    );
    expect(wrapper, "recibo gerado").to.not.be.null;

    const retangulo = wrapper.getBoundingClientRect();
    expect(retangulo.width).to.be.lte(win.innerWidth);
    expect(retangulo.left).to.be.gte(0);
    expect(retangulo.right).to.be.lte(win.innerWidth + 1);
  });
};

describe("TC-BRW-001", () => {
  it("Compatibilidade Chrome", () => {
    // | 1 | Abrir a aplicação | Chrome (stable) | Página carrega corretamente |
    abrirFormularioPelaHome();

    // | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros no console |
    // | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |
    preencherGerarEImprimir();
  });
});

describe("TC-BRW-002", () => {
  it("Compatibilidade Firefox", () => {
    // | 1 | Abrir a aplicação, clicar em "Gerar Recibo" na home | Firefox (stable) | Navega para o formulário (o botão está dentro de um `<a>`) |
    abrirFormularioPelaHome();

    // | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
    // | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |
    preencherGerarEImprimir();
  });
});

describe("TC-BRW-003", () => {
  it.skip("Compatibilidade Safari (manual)", () => {
    // | 1 | Abrir a aplicação | Safari (stable) | Página carrega corretamente |
    // | 2 | Simular impressão | Cmd+P | Layout não quebrado |
    // | 3 | Preencher e gerar | Fluxo completo | Funciona sem erros |
    // | 4 | Verificar `input[type=date]` e `input[type=color]` | — | Controles utilizáveis |
    //
    // Verificação manual: o Safari não está instalado no ambiente Docker.
  });
});

describe("TC-BRW-004", () => {
  it("Compatibilidade Microsoft Edge", () => {
    // | 1 | Abrir a aplicação | Edge (stable) | Página carrega corretamente |
    abrirFormularioPelaHome();

    // | 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
    // | 3 | Imprimir | Stub de `window.print` | Chamado 1 vez |
    preencherGerarEImprimir();
  });
});

describe("TC-BRW-005", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.abrirFormulario();
  });

  it("Responsividade Mobile (iOS)", () => {
    // | 1 | Abrir com viewport de iPhone | `cy.viewport(375, 667)` | Grades `.grid-2`, `.grid-3` e `.grid-cards` em 1 coluna; sem rolagem horizontal |
    verificarColunas(".grid-2", 1);
    verificarColunas(".grid-3", 1);
    verificarColunas(".grid-cards", 1);
    verificarSemRolagemHorizontal();

    // | 2 | Preencher o formulário | Massa válida | Campos acessíveis; linha de serviço em 2 colunas (descrição na linha de cima; valor e "×" embaixo) |
    cy.preencherFormulario();
    verificarLinhaServicoMobile();

    // | 3 | Testar a dropzone | `selectFile` | Upload funcional |
    enviarLogoPelaDropzone();

    // | 4 | Gerar o recibo | — | `.receipt-wrapper` não excede a largura da viewport; legibilidade conferida manualmente 🖐 |
    cy.gerarRecibo();
    verificarReciboDentroDaViewport();
  });
});

describe("TC-BRW-006", () => {
  beforeEach(() => {
    cy.viewport(360, 640);
    cy.abrirFormulario();
  });

  it("Responsividade Mobile (Android)", () => {
    // | 1 | Abrir com viewport Android | `cy.viewport(360, 640)` | Layout em coluna única; sem rolagem horizontal |
    verificarColunas(".grid-2", 1);
    verificarColunas(".grid-3", 1);
    verificarColunas(".grid-cards", 1);
    verificarSemRolagemHorizontal();

    // | 2 | Preencher o formulário | Massa válida | Campos acessíveis; rolagem funcional |
    cy.preencherFormulario();
    verificarLinhaServicoMobile();

    // | 3 | Testar a dropzone | `selectFile` | Upload funcional |
    enviarLogoPelaDropzone();

    // | 4 | Gerar o recibo | — | Recibo dentro da largura da viewport |
    cy.gerarRecibo();
    verificarReciboDentroDaViewport();
  });
});

describe("TC-BRW-007", () => {
  beforeEach(() => {
    cy.viewport(768, 1024);
    cy.abrirFormulario();
  });

  it("Responsividade Tablet e Pontos de Quebra", () => {
    // | 1 | Viewport de tablet | `cy.viewport(768, 1024)` | `.grid-2` e `.grid-cards` com 2 colunas; `.grid-3` com 3 colunas; sem rolagem horizontal |
    verificarColunas(".grid-2", 2);
    verificarColunas(".grid-cards", 2);
    verificarColunas(".grid-3", 3);
    verificarSemRolagemHorizontal();

    // | 2 | Viewport no limite | `cy.viewport(640, 900)` | Todas as grades em 1 coluna |
    cy.viewport(640, 900);
    verificarColunas(".grid-2", 1);
    verificarColunas(".grid-cards", 1);
    verificarColunas(".grid-3", 1);
    verificarSemRolagemHorizontal();

    // | 3 | Viewport logo acima do limite | `cy.viewport(641, 900)` | `.grid-2`, `.grid-cards` e `.grid-3` voltam a múltiplas colunas |
    cy.viewport(641, 900);
    verificarColunas(".grid-2", 2);
    verificarColunas(".grid-cards", 2);
    verificarColunas(".grid-3", 3);
    verificarSemRolagemHorizontal();

    // | 4 | Verificar espaçamento | — | Padding lateral adequado (inspeção visual 🖐) |
    // Verificação visual no navegador.
  });
});
