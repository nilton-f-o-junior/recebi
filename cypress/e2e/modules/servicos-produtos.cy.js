// ### 4.8 Módulo: Serviços e Produtos

// > **O total não é exibido no formulário.** O SDD §3.8 prevê total em tempo real e
// > linha de total fixada; o app só calcula o total ao gerar o recibo (🐞 DEF-02).
// > Cada linha de serviço tem descrição e valor `required`; uma linha vazia
// > adicionada bloqueia a geração (TC-SRV-009).

const linhasServico = () => cy.get("#servicesContainer .service-row");
const nomesServico = () => cy.get('[data-testid="input-service-name"]');
const valoresServico = () => cy.get('[data-testid="input-service-value"]');
const totalDoRecibo = () => cy.get(".receipt-total-value");
const linhasDoRecibo = () =>
  cy.get("#receiptContent .receipt-table tbody tr");

const tentarGerar = () => {
  cy.get('[data-testid="input-privacy"]').check();
  cy.get('[data-testid="btn-generate"]').click();
  cy.get("#printContainer").should("not.have.class", "visible");
};

const fecharPreview = () =>
  cy.get('[data-testid="btn-close-preview"]').click();

// #### TC-SRV-001: Adição de Serviço

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar linha inicial | — | 1 `.service-row` com campos vazios e rótulos "Serviço / Produto" e "Valor (R$)" |
// | 2 | Preencher o primeiro serviço | `Lavagem completa`, `50.00` | Linha preenchida |
// | 3 | Clicar em "+ Adicionar serviço" | — | Nova linha ao final (2 `.service-row`); a nova linha não tem rótulos |
// | 4 | Preencher o segundo serviço | `Cera`, `30.00` | Linha preenchida |
// | 5 | Gerar o recibo | — | Duas linhas na tabela; `.receipt-total-value` = `R$ 80,00` |
// | 6 | 🐞 Verificar total no formulário | — | Esperado (SDD): total "R$ 80,00" visível e atualizado em tempo real. Atual: não existe |

// **Critério de Aceite:** Serviços adicionados; total correto no recibo.

describe("TC-SRV-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Adição de Serviço", () => {
    // | 1 | Verificar linha inicial | — | 1 `.service-row` com campos vazios e rótulos "Serviço / Produto" e "Valor (R$)" |
    linhasServico().should("have.length", 1);
    nomesServico().should("have.value", "");
    valoresServico().should("have.value", "");
    linhasServico().first().find("label").should("have.length", 2);
    linhasServico()
      .first()
      .find("label")
      .eq(0)
      .should("have.text", "Serviço / Produto");
    linhasServico()
      .first()
      .find("label")
      .eq(1)
      .should("have.text", "Valor (R$)");

    // | 2 | Preencher o primeiro serviço | `Lavagem completa`, `50.00` | Linha preenchida |
    nomesServico().type("Lavagem completa");
    valoresServico().type("50.00");

    // | 3 | Clicar em "+ Adicionar serviço" | — | Nova linha ao final (2 `.service-row`); a nova linha não tem rótulos |
    cy.get('[data-testid="btn-add-service"]').click();
    linhasServico().should("have.length", 2);
    linhasServico().eq(1).find("label").should("have.length", 0);

    // | 4 | Preencher o segundo serviço | `Cera`, `30.00` | Linha preenchida |
    nomesServico().eq(1).type("Cera");
    valoresServico().eq(1).type("30.00");

    // | 5 | Gerar o recibo | — | Duas linhas na tabela; `.receipt-total-value` = `R$ 80,00` |
    cy.preencherFormulario();
    cy.gerarRecibo();
    linhasDoRecibo().should("have.length", 2);
    totalDoRecibo().should("have.text", "R$ 80,00");

    // | 6 | 🐞 Verificar total no formulário | — | Esperado (SDD): total "R$ 80,00" visível e atualizado em tempo real. Atual: não existe |
    // DEF-02: comportamento atual; inverter após correção.
    cy.get("#receiptForm").should("not.contain.text", "R$ 80,00");
  });
});

// #### TC-SRV-002: Remoção de Serviço

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Ter 2 serviços na lista | `S1: 50`, `S2: 30` | 2 `.service-row` |
// | 2 | Clicar em "×" do segundo serviço | `btn-remove-service` (2ª linha) | Segunda linha removida (1 `.service-row`) |
// | 3 | Gerar o recibo | — | Uma linha na tabela; total `R$ 50,00` |

// **Critério de Aceite:** Serviço removido e total refletido no recibo.

describe("TC-SRV-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Remoção de Serviço", () => {
    // | 1 | Ter 2 serviços na lista | `S1: 50`, `S2: 30` | 2 `.service-row` |
    linhasServico().should("have.length", 2);

    // | 2 | Clicar em "×" do segundo serviço | `btn-remove-service` (2ª linha) | Segunda linha removida (1 `.service-row`) |
    cy.get('[data-testid="btn-remove-service"]').eq(1).click();
    linhasServico().should("have.length", 1);

    // | 3 | Gerar o recibo | — | Uma linha na tabela; total `R$ 50,00` |
    cy.gerarRecibo();
    linhasDoRecibo().should("have.length", 1);
    totalDoRecibo().should("have.text", "R$ 50,00");
  });
});

// #### TC-SRV-003: Restrição de Remoção da Única Linha

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar 1 serviço na lista | — | Botão "×" **visível e habilitado** |
// | 2 | Clicar em "×" | — | Linha **não** removida (continua 1 `.service-row`) |
// | 3 | Adicionar serviço | — | 2 serviços presentes |
// | 4 | Clicar em "×" da primeira linha | — | Remoção permitida; resta 1 linha |

// **Critério de Aceite:** A última linha não pode ser removida.

// **Notas Cypress:** a versão 1.0 supunha botão oculto/desabilitado; o app só ignora o
// clique (`rows.length <= 1`).

describe("TC-SRV-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Restrição de Remoção da Única Linha", () => {
    // | 1 | Verificar 1 serviço na lista | — | Botão "×" **visível e habilitado** |
    linhasServico().should("have.length", 1);
    cy.get('[data-testid="btn-remove-service"]')
      .should("be.visible")
      .and("not.be.disabled");

    // | 2 | Clicar em "×" | — | Linha **não** removida (continua 1 `.service-row`) |
    cy.get('[data-testid="btn-remove-service"]').click();
    linhasServico().should("have.length", 1);

    // | 3 | Adicionar serviço | — | 2 serviços presentes |
    cy.get('[data-testid="btn-add-service"]').click();
    linhasServico().should("have.length", 2);

    // | 4 | Clicar em "×" da primeira linha | — | Remoção permitida; resta 1 linha |
    cy.get('[data-testid="btn-remove-service"]').eq(0).click();
    linhasServico().should("have.length", 1);
  });
});

// #### TC-SRV-004: Cálculo de Total com Múltiplos Serviços

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Adicionar 3 serviços | `10.50`, `20.30`, `15.20` | — |
// | 2 | Gerar o recibo | — | `.receipt-total-value` = `R$ 46,00` (formato BRL) |
// | 3 | Alterar o valor do primeiro e gerar | `10.50` → `15.00` | Total `R$ 50,50` |
// | 4 | Valor com milhar | `1234.50` (único serviço) | `R$ 1.234,50` na linha e no total |
// | 5 | Valor com mais de 2 casas decimais | `10.999` | O navegador bloqueia: campo `:invalid` com `validity.stepMismatch`; preview não abre |

// **Critério de Aceite:** Total correto, formatação BRL, no máximo 2 casas decimais.

// **Notas Cypress:** o passo 5 é garantido pelo `step="0.01"` do `<input type=number>`,
// não pelo código do app. A soma `10.5 + 20.3 + 15.2` fecha em `46` sem ruído visível.

describe("TC-SRV-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Cálculo de Total com Múltiplos Serviços", () => {
    // | 1 | Adicionar 3 serviços | `10.50`, `20.30`, `15.20` | — |
    cy.preencherFormulario({
      services: [
        { name: "Serviço A", value: "10.50" },
        { name: "Serviço B", value: "20.30" },
        { name: "Serviço C", value: "15.20" },
      ],
    });
    linhasServico().should("have.length", 3);

    // | 2 | Gerar o recibo | — | `.receipt-total-value` = `R$ 46,00` (formato BRL) |
    cy.gerarRecibo();
    totalDoRecibo().should("have.text", "R$ 46,00");
    fecharPreview();

    // | 3 | Alterar o valor do primeiro e gerar | `10.50` → `15.00` | Total `R$ 50,50` |
    valoresServico().eq(0).clear().type("15.00");
    cy.gerarRecibo();
    totalDoRecibo().should("have.text", "R$ 50,50");
    fecharPreview();

    // | 4 | Valor com milhar | `1234.50` (único serviço) | `R$ 1.234,50` na linha e no total |
    cy.preencherFormulario({
      services: [{ name: "Serviço único", value: "1234.50" }],
    });
    linhasServico().should("have.length", 1);
    cy.gerarRecibo();
    linhasDoRecibo().should("have.length", 1);
    linhasDoRecibo()
      .eq(0)
      .find(".receipt-table-cell")
      .eq(1)
      .should("have.text", "R$ 1.234,50");
    totalDoRecibo().should("have.text", "R$ 1.234,50");
    fecharPreview();

    // | 5 | Valor com mais de 2 casas decimais | `10.999` | O navegador bloqueia: campo `:invalid` com `validity.stepMismatch`; preview não abre |
    valoresServico().eq(0).clear().type("10.999");
    valoresServico()
      .eq(0)
      .then(($el) => {
        expect($el[0].validity.stepMismatch, "stepMismatch").to.eq(true);
      });
    valoresServico().eq(0).should("match", ":invalid");
    tentarGerar();
  });
});

// #### TC-SRV-005: Validação de Serviço Obrigatório

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Deixar descrição e valor vazios e gerar | — | Campos `:invalid` (nativo); preview não abre |
// | 2 | Preencher apenas a descrição e gerar | `Lavagem` | Campo de valor `:invalid`; preview não abre |
// | 3 | Preencher apenas o valor e gerar | `50.00` | Campo de descrição `:invalid`; preview não abre |
// | 4 | Preencher descrição e valor `0` e gerar | `Lavagem`, `0` | Preview não abre; o foco vai para "+ Adicionar serviço" (nenhum serviço com valor > 0) |
// | 5 | Preencher descrição e valor válidos | `Lavagem`, `50.00` | Preview abre |

// **Critério de Aceite:** Nenhum recibo é gerado sem ao menos um serviço com valor positivo.

// **Notas Cypress:** não existem as mensagens "Adicione ao menos um serviço", "Informe o
// valor…" ou "Informe a descrição…". O passo 4 é a única validação do app (foco no botão
// `.btn-add`, sem mensagem).

describe("TC-SRV-005", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({
      services: [{ name: "Lavagem", value: "50.00" }],
    });
  });

  it("Validação de Serviço Obrigatório", () => {
    // | 1 | Deixar descrição e valor vazios e gerar | — | Campos `:invalid` (nativo); preview não abre |
    nomesServico().clear();
    valoresServico().clear();
    tentarGerar();
    nomesServico().should("match", ":invalid");
    valoresServico().should("match", ":invalid");

    // | 2 | Preencher apenas a descrição e gerar | `Lavagem` | Campo de valor `:invalid`; preview não abre |
    nomesServico().type("Lavagem");
    tentarGerar();
    nomesServico().should("not.match", ":invalid");
    valoresServico().should("match", ":invalid");

    // | 3 | Preencher apenas o valor e gerar | `50.00` | Campo de descrição `:invalid`; preview não abre |
    nomesServico().clear();
    valoresServico().type("50.00");
    tentarGerar();
    nomesServico().should("match", ":invalid");
    valoresServico().should("not.match", ":invalid");

    // | 4 | Preencher descrição e valor `0` e gerar | `Lavagem`, `0` | Preview não abre; o foco vai para "+ Adicionar serviço" (nenhum serviço com valor > 0) |
    nomesServico().type("Lavagem");
    valoresServico().clear().type("0");
    tentarGerar();
    cy.focused().should("have.attr", "data-testid", "btn-add-service");

    // | 5 | Preencher descrição e valor válidos | `Lavagem`, `50.00` | Preview abre |
    valoresServico().clear().type("50.00");
    cy.gerarRecibo();
  });
});

// #### TC-SRV-006: Valores Negativos e Não Numéricos

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar letras no campo de valor | `abc` | Campo permanece vazio (`type=number`) |
// | 2 | Valor negativo como único serviço e gerar | `-5` | Preview não abre (nenhum serviço com valor > 0) |
// | 3 | 🐞 Valor negativo em um segundo serviço, com um serviço válido de 50 | `-10` | Esperado (SDD: "número positivo"): rejeitado. Atual: aceito; total `R$ 40,00` |

// **Critério de Aceite:** Apenas valores positivos são aceitos.

describe("TC-SRV-006", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({
      services: [{ name: "Lavagem", value: "50.00" }],
    });
  });

  it("Valores Negativos e Não Numéricos", () => {
    // | 1 | Digitar letras no campo de valor | `abc` | Campo permanece vazio (`type=number`) |
    valoresServico().clear().type("abc");
    valoresServico().should("have.value", "");

    // | 2 | Valor negativo como único serviço e gerar | `-5` | Preview não abre (nenhum serviço com valor > 0) |
    valoresServico().clear().type("-5");
    tentarGerar();
    cy.focused().should("have.attr", "data-testid", "btn-add-service");

    // | 3 | 🐞 Valor negativo em um segundo serviço, com um serviço válido de 50 | `-10` | Esperado (SDD: "número positivo"): rejeitado. Atual: aceito; total `R$ 40,00` |
    // DEF-12: comportamento atual; inverter após correção.
    cy.preencherFormulario({
      services: [
        { name: "Serviço válido", value: "50" },
        { name: "Serviço negativo", value: "-10" },
      ],
    });
    linhasServico().should("have.length", 2);
    cy.gerarRecibo();
    totalDoRecibo().should("have.text", "R$ 40,00");
  });
});

// #### TC-SRV-007: Aplicação de Desconto (Porcentagem)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar que o campo de desconto está oculto | — | `#discountContainer` oculto |
// | 2 | Clicar em "+ Adicionar desconto" | `btn-add-discount` | Campo "Valor do Desconto (%)" visível |
// | 3 | Inserir 10% com serviços `50` + `30` e gerar | `10` | Total `R$ 72,00` |
// | 4 | Inserir 100% | `100` | Total `R$ 0,00` |
// | 5 | Inserir 150% | `150` | Total `R$ 0,00` (nunca negativo) |
// | 6 | Inserir 12,5% | `12.5` | Total `R$ 70,00` |
// | 7 | Apagar o desconto | `` (vazio) | Total volta ao valor bruto `R$ 80,00` |
// | 8 | 🐞 Inserir desconto negativo | `-10` | Esperado: rejeitado. Atual: aceito; total `R$ 88,00` (aumenta) |

// **Critério de Aceite:** Desconto percentual subtraído do total bruto; total nunca negativo.

describe("TC-SRV-007", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Aplicação de Desconto (Porcentagem)", () => {
    const desconto = () => cy.get('[data-testid="input-discount-value"]');
    const gerarCom = (valor) => {
      if (valor === "") desconto().clear();
      else desconto().clear().type(String(valor));
      cy.gerarRecibo();
    };

    // | 1 | Verificar que o campo de desconto está oculto | — | `#discountContainer` oculto |
    cy.get("#discountContainer").should("have.css", "display", "none");

    // | 2 | Clicar em "+ Adicionar desconto" | `btn-add-discount` | Campo "Valor do Desconto (%)" visível |
    cy.get('[data-testid="btn-add-discount"]').click();
    cy.get("#discountContainer").should("be.visible");
    desconto().should("be.visible");

    // | 3 | Inserir 10% com serviços `50` + `30` e gerar | `10` | Total `R$ 72,00` |
    gerarCom(10);
    totalDoRecibo().should("have.text", "R$ 72,00");
    fecharPreview();

    // | 4 | Inserir 100% | `100` | Total `R$ 0,00` |
    gerarCom(100);
    totalDoRecibo().should("have.text", "R$ 0,00");
    fecharPreview();

    // | 5 | Inserir 150% | `150` | Total `R$ 0,00` (nunca negativo) |
    gerarCom(150);
    totalDoRecibo().should("have.text", "R$ 0,00");
    fecharPreview();

    // | 6 | Inserir 12,5% | `12.5` | Total `R$ 70,00` |
    gerarCom(12.5);
    totalDoRecibo().should("have.text", "R$ 70,00");
    fecharPreview();

    // | 7 | Apagar o desconto | `` (vazio) | Total volta ao valor bruto `R$ 80,00` |
    gerarCom("");
    totalDoRecibo().should("have.text", "R$ 80,00");
    fecharPreview();

    // | 8 | 🐞 Inserir desconto negativo | `-10` | Esperado: rejeitado. Atual: aceito; total `R$ 88,00` (aumenta) |
    // DEF-12: comportamento atual; inverter após correção.
    gerarCom(-10);
    totalDoRecibo().should("have.text", "R$ 88,00");
  });
});

// #### TC-SRV-008: Exibição de Desconto no Recibo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar recibo com desconto | Serviços `50` + `30`, desconto `10%` | Recibo renderizado |
// | 2 | Verificar a seção de totais | — | Exibe **Subtotal** (`R$ 80,00`), **Desconto** (`R$ 8,00`) e **Total Geral** (`R$ 72,00`) |
// | 3 | Gerar recibo sem desconto | — | Seção de desconto omitida; exibe apenas o Total |

// **Critério de Aceite:** Detalhamento financeiro correto no documento final (SDD §3.8).

// **Notas Cypress:** atual: o recibo mostra **somente** o Total (`R$ 72,00`); as palavras
// "Subtotal" e "Desconto" não aparecem.

describe("TC-SRV-008", () => {
  // DEF-02: comportamento esperado; inverter após correção.
  it.skip("Exibição de Desconto no Recibo (DEF-02)", () => {
    cy.abrirFormulario();
    cy.preencherFormulario({ discount: 10 });
    cy.gerarRecibo();

    // | 2 | Verificar a seção de totais | — | Exibe **Subtotal** (`R$ 80,00`), **Desconto** (`R$ 8,00`) e **Total Geral** (`R$ 72,00`) |
    cy.get("#receiptContent").should("contain.text", "Subtotal");
    cy.get("#receiptContent").should("contain.text", "R$ 80,00");
    cy.get("#receiptContent").should("contain.text", "Desconto");
    cy.get("#receiptContent").should("contain.text", "R$ 8,00");
    cy.get("#receiptContent").should("contain.text", "Total Geral");
    cy.get("#receiptContent").should("contain.text", "R$ 72,00");

    // | 3 | Gerar recibo sem desconto | — | Seção de desconto omitida; exibe apenas o Total |
    fecharPreview();
    cy.get('[data-testid="input-discount-value"]').clear();
    cy.gerarRecibo();
    cy.get("#receiptContent").should("not.contain.text", "Subtotal");
    cy.get("#receiptContent").should("not.contain.text", "Desconto");
  });
});

// #### TC-SRV-009: Linha de Serviço Vazia Bloqueia a Geração

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher o formulário com 1 serviço válido | Massa válida | — |
// | 2 | Clicar em "+ Adicionar serviço" e deixar a nova linha vazia | — | 2 `.service-row` |
// | 3 | Tentar gerar | — | Preview não abre; os 2 campos da nova linha estão `:invalid` |
// | 4 | Remover a linha vazia e gerar | `btn-remove-service` | Preview abre |

// **Critério de Aceite:** Linhas vazias precisam ser preenchidas ou removidas.

describe("TC-SRV-009", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({
      services: [{ name: "Lavagem", value: "50.00" }],
    });
  });

  it("Linha de Serviço Vazia Bloqueia a Geração", () => {
    // | 1 | Preencher o formulário com 1 serviço válido | Massa válida | — |
    linhasServico().should("have.length", 1);

    // | 2 | Clicar em "+ Adicionar serviço" e deixar a nova linha vazia | — | 2 `.service-row` |
    cy.get('[data-testid="btn-add-service"]').click();
    linhasServico().should("have.length", 2);

    // | 3 | Tentar gerar | — | Preview não abre; os 2 campos da nova linha estão `:invalid` |
    tentarGerar();
    nomesServico().eq(1).should("match", ":invalid");
    valoresServico().eq(1).should("match", ":invalid");

    // | 4 | Remover a linha vazia e gerar | `btn-remove-service` | Preview abre |
    cy.get('[data-testid="btn-remove-service"]').eq(1).click();
    linhasServico().should("have.length", 1);
    cy.gerarRecibo();
  });
});
