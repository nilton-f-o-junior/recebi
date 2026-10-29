// ### 4.16 Módulo: Política de Privacidade

// #### TC-POL-001: Acesso e Conteúdo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar o link no formulário | `label[for="privacy"] a` | `href` = `/src/html/politica-privacidade.html` |
// | 2 | Abrir a página | — | Título da aba "Política de Privacidade — Recebi"; `h1` contém "Privacidade" |
// | 3 | Verificar o conteúdo | — | 6 `.section-card`; texto "não coleta, armazena nem transmite" |
// | 4 | Verificar a revelação progressiva | Rolar a página | `.section-card.visible` aumenta até todos os cards ficarem visíveis |

// **Critério de Aceite:** A política está acessível e declara o tratamento de dados.

// **Notas Cypress:** o link abre na **mesma aba**; clicar nele a partir do formulário preenchido descarta os dados (DEF-17). Para testar a página, visite-a diretamente. Para a revelação progressiva, assertar a classe `.visible` (`have.class`) e não `be.visible`: se os cards forem ocultados por `transform`, o algoritmo de visibilidade `modern` do Cypress 16 não os trata como ocultos.

describe("TC-POL-001", () => {
  it("Acesso e Conteúdo", () => {
    // | 1 | Verificar o link no formulário | `label[for="privacy"] a` | `href` = `/src/html/politica-privacidade.html` |
    cy.abrirFormulario();
    cy.get('label[for="privacy"] a')
      .should("exist")
      .and("have.attr", "href", "/src/html/politica-privacidade.html");

    // | 2 | Abrir a página | — | Título da aba "Política de Privacidade — Recebi"; `h1` contém "Privacidade" |
    cy.visit("/src/html/politica-privacidade.html");
    cy.title().should("eq", "Política de Privacidade — Recebi");
    cy.get("h1").should("contain.text", "Privacidade");

    // | 3 | Verificar o conteúdo | — | 6 `.section-card`; texto "não coleta, armazena nem transmite" |
    cy.get(".section-card").should("have.length", 6);
    cy.get(".highlight-box").should(
      "contain.text",
      "não coleta, armazena nem transmite"
    );

    // | 4 | Verificar a revelação progressiva | Rolar a página | `.section-card.visible` aumenta até todos os cards ficarem visíveis |
    cy.get(".section-card.visible").should(($visiveis) => {
      expect($visiveis.length).to.be.greaterThan(0);
      expect($visiveis.length).to.be.lessThan(6);
    });
    cy.get(".section-card.visible").then(($visiveis) => {
      const visiveisIniciais = $visiveis.length;

      cy.get(".section-card").each(($card) => {
        cy.wrap($card).scrollIntoView();
      });

      cy.get(".section-card.visible").should(($todos) => {
        expect($todos.length).to.eq(6);
        expect($todos.length).to.be.greaterThan(visiveisIniciais);
      });
    });
  });
});

// #### TC-POL-002: Contato

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Localizar o contato | `a[href^="mailto:"]` | `href` = `mailto:nilton.f.o.junior@gmail.com` |

// **Critério de Aceite:** O canal de contato está disponível.

// **Notas Cypress:** a página informa "Última atualização: março de 2025"; confirme se a data ainda é válida.

describe("TC-POL-002", () => {
  it("Contato", () => {
    // | 1 | Localizar o contato | `a[href^="mailto:"]` | `href` = `mailto:nilton.f.o.junior@gmail.com` |
    cy.visit("/src/html/politica-privacidade.html");
    cy.get('a[href^="mailto:"]')
      .should("have.length", 1)
      .and("have.attr", "href", "mailto:nilton.f.o.junior@gmail.com");
  });
});
