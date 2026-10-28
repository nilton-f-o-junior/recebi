// ### 4.13 Módulo: Página Inicial

// #### TC-HOM-001: Conteúdo da Página Inicial

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a home | `/` | Título da aba "Recebi — Gerador de Recibos Online Grátis" |
// | 2 | Verificar texto de apresentação | — | "Crie recibos profissionais para sua Estética ou Lava Jato — 100% grátis e sem cadastro." |
// | 3 | Verificar botão principal | `btn-start-form` | Visível, com o texto "Gerar Recibo" |
// | 4 | Verificar rodapé | — | Contém "© 2026 Nilton F. O. Júnior" |
// | 5 | Verificar idioma | — | `<html lang="pt-BR">` |

// **Critério de Aceite:** A home apresenta o produto e o botão de início.

describe("TC-HOM-001", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Conteúdo da Página Inicial", () => {
    // | 1 | Abrir a home | `/` | Título da aba "Recebi — Gerador de Recibos Online Grátis" |
    cy.title().should("eq", "Recebi — Gerador de Recibos Online Grátis");

    // | 2 | Verificar texto de apresentação | — | "Crie recibos profissionais para sua Estética ou Lava Jato — 100% grátis e sem cadastro." |
    cy.get("main p").should(($p) => {
      expect($p.text().replace(/\s+/g, " ").trim()).to.eq(
        "Crie recibos profissionais para sua Estética ou Lava Jato — 100% grátis e sem cadastro."
      );
    });

    // | 3 | Verificar botão principal | `btn-start-form` | Visível, com o texto "Gerar Recibo" |
    cy.get('[data-testid="btn-start-form"]')
      .should("be.visible")
      .and("have.text", "Gerar Recibo");

    // | 4 | Verificar rodapé | — | Contém "© 2026 Nilton F. O. Júnior" |
    cy.get("footer").should("contain.text", "© 2026 Nilton F. O. Júnior");

    // | 5 | Verificar idioma | — | `<html lang="pt-BR">` |
    cy.get("html").should("have.attr", "lang", "pt-BR");
  });
});

// #### TC-HOM-002: Navegação para o Formulário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Clicar em "Gerar Recibo" | `btn-start-form` | URL passa a terminar em `/src/html/form.html` |
// | 2 | Verificar a página | — | Formulário visível; botão "Gerar Recibo Agora" desabilitado |

// **Critério de Aceite:** O botão leva ao formulário.

// **Notas Cypress:** o `<button>` fica dentro de um `<a>` (HTML inválido); funciona no Chromium,
// mas confirme manualmente no Firefox e no Safari (BRW-002, BRW-003).

describe("TC-HOM-002", () => {
  it("Navegação para o Formulário", () => {
    cy.visit("/");

    // | 1 | Clicar em "Gerar Recibo" | `btn-start-form` | URL passa a terminar em `/src/html/form.html` |
    cy.get('[data-testid="btn-start-form"]').click();
    cy.location("pathname").should("eq", "/src/html/form.html");

    // | 2 | Verificar a página | — | Formulário visível; botão "Gerar Recibo Agora" desabilitado |
    cy.get("#receiptForm").should("be.visible");
    cy.get('[data-testid="btn-generate"]')
      .should("be.visible")
      .and("be.disabled");
  });
});
