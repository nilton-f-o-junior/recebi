// ### 4.10 Módulo: Geração do Recibo

// #### TC-GER-001: Geração Completa de Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher todos os campos | Massa completa (Apêndice A), com CPF do cliente e CNPJ do beneficiário | Formulário válido |
// | 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
// | 3 | Clicar em "Gerar Recibo Agora" | — | Recibo renderizado em `#receiptContent` (preview aberto) |
// | 4 | Verificar título | Tipo `Recibo de Pagamento` | `.receipt-type` = "Recibo de Pagamento"; `.receipt-est-name` = nome do estabelecimento |
// | 5 | Verificar data | `2020-01-15` | `.receipt-date-value` = `15/01/2020`; `.receipt-city` = "São Paulo, SP" |
// | 6 | Verificar cliente | — | Card "Cliente": nome, CPF com máscara e celular |
// | 7 | Verificar beneficiário | — | Card "Beneficiário": nome, CNPJ com máscara e celular |
// | 8 | Verificar veículo | — | `.receipt-vehicle-info`: Modelo, Placa (`ABC-1D23`), Ano |
// | 9 | Verificar estabelecimento | — | Cabeçalho: "Av. Paulista, 1000 — Centro"; rodapé: nome + "Av. Paulista, 1000, Centro, São Paulo, SP" |
// | 10 | Verificar serviços | `Lavagem completa 50,00`, `Cera 30,00` | 2 linhas em `.receipt-table tbody tr` com valores em BRL |
// | 11 | Verificar total | — | `.receipt-total-value` = `R$ 80,00` |
// | 12 | Verificar carimbo de emissão | — | `.receipt-footer-timestamp` começa com "Documento emitido em" seguido de data e hora atuais |

// **Critério de Aceite:** O recibo contém todos os dados inseridos, formatados corretamente.

// **Notas Cypress:** os rótulos "Cliente", "Beneficiário", "Veículo", "Emissão",
// "Total", "Descrição" e "Valor" estão em maiúsculas por CSS; compare o texto do
// DOM. O endereço do cabeçalho usa "—" (travessão) entre número e bairro.

describe("TC-GER-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Geração Completa de Recibo", () => {
    // | 1 | Preencher todos os campos | Massa completa (Apêndice A), com CPF do cliente e CNPJ do beneficiário | Formulário válido |
    // | 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
    // | 3 | Clicar em "Gerar Recibo Agora" | — | Recibo renderizado em `#receiptContent` (preview aberto) |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-wrapper").should("have.length", 1);

    // | 4 | Verificar título | Tipo `Recibo de Pagamento` | `.receipt-type` = "Recibo de Pagamento"; `.receipt-est-name` = nome do estabelecimento |
    cy.get("#receiptContent .receipt-type").should(
      "have.text",
      "Recibo de Pagamento"
    );
    cy.get("#receiptContent .receipt-est-name").should(
      "have.text",
      "Lava-jato Express"
    );

    // | 5 | Verificar data | `2020-01-15` | `.receipt-date-value` = `15/01/2020`; `.receipt-city` = "São Paulo, SP" |
    cy.get("#receiptContent .receipt-date-value").should(
      "have.text",
      "15/01/2020"
    );
    cy.get("#receiptContent .receipt-city").should("have.text", "São Paulo, SP");

    // | 6 | Verificar cliente | — | Card "Cliente": nome, CPF com máscara e celular |
    cy.get("#receiptContent .receipt-party-card")
      .eq(0)
      .within(() => {
        cy.get(".receipt-section-label").should("have.text", "Cliente");
        cy.get(".receipt-party-name").should("have.text", "João Silva");
        cy.get(".receipt-party-detail").should(
          "contain.text",
          "529.982.247-25"
        );
        cy.get(".receipt-party-detail").should(
          "contain.text",
          "(11) 99999-8888"
        );
      });

    // | 7 | Verificar beneficiário | — | Card "Beneficiário": nome, CNPJ com máscara e celular |
    cy.get("#receiptContent .receipt-party-card")
      .eq(1)
      .within(() => {
        cy.get(".receipt-section-label").should("have.text", "Beneficiário");
        cy.get(".receipt-party-name").should("have.text", "Maria Ltda");
        cy.get(".receipt-party-detail").should(
          "contain.text",
          "11.444.777/0001-61"
        );
        cy.get(".receipt-party-detail").should(
          "contain.text",
          "(21) 98765-4321"
        );
      });

    // | 8 | Verificar veículo | — | `.receipt-vehicle-info`: Modelo, Placa (`ABC-1D23`), Ano |
    cy.get("#receiptContent .receipt-vehicle-info")
      .should("contain.text", "Modelo: Fiat Strada")
      .and("contain.text", "Placa: ABC-1D23")
      .and("contain.text", "Ano: 2024");

    // | 9 | Verificar estabelecimento | — | Cabeçalho: "Av. Paulista, 1000 — Centro"; rodapé: nome + "Av. Paulista, 1000, Centro, São Paulo, SP" |
    cy.get("#receiptContent .receipt-est-address").should(
      "have.text",
      "Av. Paulista, 1000 — Centro"
    );
    cy.get("#receiptContent .receipt-footer-sig-name").should(
      "have.text",
      "Lava-jato Express"
    );
    cy.get("#receiptContent .receipt-footer-sig-detail").should(
      "have.text",
      "Av. Paulista, 1000, Centro, São Paulo, SP"
    );

    // | 10 | Verificar serviços | `Lavagem completa 50,00`, `Cera 30,00` | 2 linhas em `.receipt-table tbody tr` com valores em BRL |
    cy.get("#receiptContent .receipt-table tbody tr").should("have.length", 2);
    cy.get("#receiptContent .receipt-table tbody tr")
      .eq(0)
      .should("contain.text", "Lavagem completa")
      .and("contain.text", "R$ 50,00");
    cy.get("#receiptContent .receipt-table tbody tr")
      .eq(1)
      .should("contain.text", "Cera")
      .and("contain.text", "R$ 30,00");

    // | 11 | Verificar total | — | `.receipt-total-value` = `R$ 80,00` |
    cy.get("#receiptContent .receipt-total-value").should("have.text", "R$ 80,00");

    // | 12 | Verificar carimbo de emissão | — | `.receipt-footer-timestamp` começa com "Documento emitido em" seguido de data e hora atuais |
    cy.get("#receiptContent .receipt-footer-timestamp")
      .invoke("text")
      .should("match", /Documento emitido em \d{2}\/\d{2}\/\d{4}/);
  });
});

// #### TC-GER-002: Visibilidade Condicional no Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar sem logo | — | Nenhum `.receipt-logo` |
// | 2 | Gerar com logo | `logo.png` | `.receipt-logo` presente |
// | 3 | Gerar sem observações | — | Nenhum `.receipt-observations` |
// | 4 | Gerar sem CPF/CNPJ | — | Os cards de cliente e beneficiário exibem nome e celular; o parágrafo do documento fica vazio |
// | 5 | Gerar sem desconto | — | Total igual à soma dos serviços |

// **Critério de Aceite:** Seções opcionais ausentes se os campos estiverem vazios.

// **Notas Cypress:** veículo e estabelecimento não podem ficar vazios (campos
// obrigatórios), então não há cenário "sem veículo/estabelecimento". Com CPF/CNPJ
// vazios, o app ainda renderiza um `<p class="receipt-party-detail">` **vazio** no
// card (aceito; não afeta o teste).

describe("TC-GER-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Visibilidade Condicional no Recibo", () => {
    // | 1 | Gerar sem logo | — | Nenhum `.receipt-logo` |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should("not.exist");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Gerar com logo | `logo.png` | `.receipt-logo` presente |
    cy.get('[data-testid="input-logo-file"]').selectFile(
      "cypress/fixtures/images/logo.png",
      { force: true }
    );
    cy.get("#logoPreviewArea").should("be.visible");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should("exist");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 3 | Gerar sem observações | — | Nenhum `.receipt-observations` |
    cy.get("#observations").clear();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-observations").should("not.exist");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 4 | Gerar sem CPF/CNPJ | — | Os cards de cliente e beneficiário exibem nome e celular; o parágrafo do documento fica vazio |
    cy.get("#clientDoc").clear();
    cy.get("#providerDoc").clear();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-party-card")
      .eq(0)
      .within(() => {
        cy.get(".receipt-party-name").should("have.text", "João Silva");
        cy.get(".receipt-party-detail").eq(0).should("have.text", "");
        cy.get(".receipt-party-detail").eq(1).should(
          "have.text",
          "(11) 99999-8888"
        );
      });
    cy.get("#receiptContent .receipt-party-card")
      .eq(1)
      .within(() => {
        cy.get(".receipt-party-name").should("have.text", "Maria Ltda");
        cy.get(".receipt-party-detail").eq(0).should("have.text", "");
        cy.get(".receipt-party-detail").eq(1).should(
          "have.text",
          "(21) 98765-4321"
        );
      });

    // | 5 | Gerar sem desconto | — | Total igual à soma dos serviços |
    cy.get("#receiptContent .receipt-total-value").should("have.text", "R$ 80,00");
  });
});

// #### TC-GER-003: Modelo de Recibo Padrão

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Manter o modelo padrão e gerar | `#receiptTemplate` = `default` | Recibo renderizado |
// | 2 | Verificar estrutura | — | Existem `.receipt-parties` (2 cards), `.receipt-vehicle-card`, tabela com cabeçalho "Descrição"/"Valor" e `.receipt-total-box` |
// | 3 | Verificar ausência de elementos do modelo detalhado | — | Nenhum `.receipt-detailed-section` |
// | 4 | Verificar rodapé | — | Rodapé minimalista (`.receipt-footer-signature-email`); nenhum `.receipt-signature-block` |

// **Critério de Aceite:** O modelo padrão renderiza a estrutura compacta.

describe("TC-GER-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Modelo de Recibo Padrão", () => {
    // | 1 | Manter o modelo padrão e gerar | `#receiptTemplate` = `default` | Recibo renderizado |
    cy.get("#receiptTemplate").should("have.value", "default");
    cy.gerarRecibo();

    // | 2 | Verificar estrutura | — | Existem `.receipt-parties` (2 cards), `.receipt-vehicle-card`, tabela com cabeçalho "Descrição"/"Valor" e `.receipt-total-box` |
    cy.get("#receiptContent .receipt-parties").should("exist");
    cy.get("#receiptContent .receipt-party-card").should("have.length", 2);
    cy.get("#receiptContent .receipt-vehicle-card").should("exist");
    cy.get("#receiptContent .receipt-table thead th")
      .eq(0)
      .should("have.text", "Descrição");
    cy.get("#receiptContent .receipt-table thead th")
      .eq(1)
      .should("have.text", "Valor");
    cy.get("#receiptContent .receipt-total-box").should("exist");

    // | 3 | Verificar ausência de elementos do modelo detalhado | — | Nenhum `.receipt-detailed-section` |
    cy.get("#receiptContent .receipt-detailed-section").should("not.exist");

    // | 4 | Verificar rodapé | — | Rodapé minimalista (`.receipt-footer-signature-email`); nenhum `.receipt-signature-block` |
    cy.get("#receiptContent .receipt-footer-signature-email").should("exist");
    cy.get("#receiptContent .receipt-signature-block").should("not.exist");
  });
});

// #### TC-GER-004: Modelo de Recibo Detalhado

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Selecionar "Modelo Detalhado" e gerar | `#receiptTemplate` = `detailed` | Recibo renderizado com seções rotuladas |
// | 2 | Verificar estrutura | Observações preenchidas | Seções, em ordem: "Dados do Recibo", "Dados do Cliente", "Dados do Beneficiário", "Informações do Veículo", "Observações", "Descrição do Serviço" |
// | 3 | Verificar cabeçalho | — | Título principal (`h1`) com o tipo do recibo; logo, se houver |
// | 4 | Verificar total | Serviços `50` + `30` | `.receipt-detailed-total-row` contém "Valor Total:" e `R$ 80,00` |
// | 5 | 🐞 Verificar rodapé detalhado | — | Esperado (SDD §3.10): blocos de assinatura para Cliente e Beneficiário. Atual: rodapé minimalista; 0 `.receipt-signature-block` |
// | 6 | Testar conteúdo longo | 50 linhas de serviço de `1,00` | `.receipt-wrapper` recebe a classe `receipt-long-content` (altura acima de 2 páginas A4 ≈ 2244 px); com 10 linhas, não recebe |

// **Critério de Aceite:** Modelo detalhado renderizado com todas as seções; padding
// extra em conteúdo longo.

// **Notas Cypress:**
// - Passo 6: o padding é aplicado 50 ms após abrir o preview (`setTimeout`); use
//   `.should('have.class', 'receipt-long-content')` (com retry). Medido: 41 linhas
//   → 2156 px (sem classe); 46 linhas → 2577 px (com classe).
// - Passo 5: o campo oculto `footerStyle` tem valor fixo `"minimal"`, e o rodapé
//   depende dele, não do modelo.

describe("TC-GER-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Modelo de Recibo Detalhado", () => {
    // | 1 | Selecionar "Modelo Detalhado" e gerar | `#receiptTemplate` = `detailed` | Recibo renderizado com seções rotuladas |
    cy.get("#receiptTemplate").select("detailed");
    cy.gerarRecibo();

    // | 2 | Verificar estrutura | Observações preenchidas | Seções, em ordem: "Dados do Recibo", "Dados do Cliente", "Dados do Beneficiário", "Informações do Veículo", "Observações", "Descrição do Serviço" |
    cy.get("#receiptContent .receipt-detailed-title").then(($titulos) => {
      expect([...$titulos].map((el) => el.textContent.trim())).to.deep.eq([
        "Dados do Recibo",
        "Dados do Cliente",
        "Dados do Beneficiário",
        "Informações do Veículo",
        "Observações",
        "Descrição do Serviço",
      ]);
    });

    // | 3 | Verificar cabeçalho | — | Título principal (`h1`) com o tipo do recibo; logo, se houver |
    cy.get("#receiptContent .receipt-header h1.receipt-est-name").should(
      "have.text",
      "Recibo de Pagamento"
    );

    // | 4 | Verificar total | Serviços `50` + `30` | `.receipt-detailed-total-row` contém "Valor Total:" e `R$ 80,00` |
    cy.get("#receiptContent .receipt-detailed-total-row")
      .should("contain.text", "Valor Total:")
      .and("contain.text", "R$ 80,00");

    // | 5 | 🐞 Verificar rodapé detalhado | — | Esperado (SDD §3.10): blocos de assinatura para Cliente e Beneficiário. Atual: rodapé minimalista; 0 `.receipt-signature-block` |
    // DEF-03: comportamento atual; inverter após correção.
    cy.get("#receiptContent .receipt-footer-signature-email").should("exist");
    cy.get("#receiptContent .receipt-signature-block").should("have.length", 0);

    // | 6 | Testar conteúdo longo | 50 linhas de serviço de `1,00` | `.receipt-wrapper` recebe a classe `receipt-long-content` (altura acima de 2 páginas A4 ≈ 2244 px); com 10 linhas, não recebe |
    cy.get('[data-testid="btn-close-preview"]').click();

    // 10 linhas: 2 da massa + 8 novas. Preenche só as novas.
    for (let i = 0; i < 8; i++) {
      cy.get('[data-testid="btn-add-service"]').click();
    }
    for (let i = 2; i < 10; i++) {
      cy.get('[data-testid="input-service-name"]').eq(i).type(`Serviço ${i + 1}`);
      cy.get('[data-testid="input-service-value"]').eq(i).type("1.00");
    }

    // Controla o setTimeout de 50 ms que aplica a classe, sem cy.wait numérico.
    // Mantém a data atual: o ano do veículo (2024) é validado contra o ano corrente.
    cy.clock(Date.now());
    cy.gerarRecibo();
    cy.tick(100);
    cy.get("#receiptContent .receipt-wrapper").should(
      "not.have.class",
      "receipt-long-content"
    );
    cy.get('[data-testid="btn-close-preview"]').click();

    // 50 linhas: acrescenta 40 às 10 existentes.
    for (let i = 0; i < 40; i++) {
      cy.get('[data-testid="btn-add-service"]').click();
    }
    for (let i = 10; i < 50; i++) {
      cy.get('[data-testid="input-service-name"]').eq(i).type(`Serviço ${i + 1}`);
      cy.get('[data-testid="input-service-value"]').eq(i).type("1.00");
    }

    cy.gerarRecibo();
    cy.tick(100);
    cy.get("#receiptContent .receipt-wrapper").should(
      "have.class",
      "receipt-long-content"
    );
  });
});

// #### TC-GER-005: Marca d'água e Estética

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar imagem decorativa do rodapé | — | `::before` de `.receipt-footer-signature-email` com `background-image` `img-baseboard.png` e `opacity` `0.5` |
// | 2 | Verificar fundo dos cards | — | `.receipt-party-card` e `.receipt-vehicle-card` com fundo `rgb(243, 244, 246)` (cinza claro) |
// | 3 | Verificar cor de destaque | `#4CAF50` | Ver TC-PER-001 |

// **Critério de Aceite:** Elementos decorativos e cores de seção aplicados.

// **Notas Cypress:** pseudo-elementos:
// `cy.window().then(win => win.getComputedStyle(el, '::before').backgroundImage)`.
// O SDD §3.10 fala em "marca d'água no fundo do documento"; o app implementa uma
// imagem decorativa no **rodapé** (DIV-09).

describe("TC-GER-005", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Marca d'água e Estética", () => {
    cy.gerarRecibo();

    // | 1 | Verificar imagem decorativa do rodapé | — | `::before` de `.receipt-footer-signature-email` com `background-image` `img-baseboard.png` e `opacity` `0.5` |
    cy.get("#receiptContent .receipt-footer-signature-email").then(($footer) => {
      const style = $footer[0].ownerDocument.defaultView.getComputedStyle(
        $footer[0],
        "::before"
      );
      expect(style.backgroundImage).to.contain("img-baseboard.png");
      expect(style.opacity).to.eq("0.5");
    });

    // | 2 | Verificar fundo dos cards | — | `.receipt-party-card` e `.receipt-vehicle-card` com fundo `rgb(243, 244, 246)` (cinza claro) |
    cy.get("#receiptContent .receipt-party-card").should(
      "have.css",
      "background-color",
      "rgb(243, 244, 246)"
    );
    cy.get("#receiptContent .receipt-vehicle-card").should(
      "have.css",
      "background-color",
      "rgb(243, 244, 246)"
    );

    // | 3 | Verificar cor de destaque | `#4CAF50` | Ver TC-PER-001 |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get('.color-preset[data-color="#4CAF50"]').click();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-header").should(
      "have.css",
      "background-color",
      "rgb(76, 175, 80)"
    );
  });
});
