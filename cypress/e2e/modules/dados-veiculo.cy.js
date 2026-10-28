// ### 4.6 Módulo: Dados do Veículo

// #### TC-VEI-001: Preenchimento de Campos Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Modelo | `Fiat Strada` | Modelo aceito |
// | 2 | Preencher Placa Mercosul | `ABC1D23` | Máscara: `ABC-1D23` |
// | 3 | Preencher Ano | `2024` | Ano aceito |
// | 4 | Gerar recibo | — | `.receipt-vehicle-card` com "Modelo: Fiat Strada", "Placa: ABC-1D23", "Ano: 2024" |
// | 5 | Modelo com 1 caractere e gerar | `F` | `#carModelErr` visível ("Mínimo 2 caracteres"); preview não abre |

// **Critério de Aceite:** Campos aceitos e seção impressa no recibo.

describe("TC-VEI-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Preenchimento de Campos Obrigatórios", () => {
    const modelo = () => cy.get('[data-testid="input-vehicle-model"]');

    // | 1 | Preencher Modelo | `Fiat Strada` | Modelo aceito |
    modelo().should("have.value", "Fiat Strada");

    // | 2 | Preencher Placa Mercosul | `ABC1D23` | Máscara: `ABC-1D23` |
    cy.get('[data-testid="input-vehicle-plate"]').should("have.value", "ABC-1D23");

    // | 3 | Preencher Ano | `2024` | Ano aceito |
    cy.get('[data-testid="input-vehicle-year"]').should("have.value", "2024");

    // | 4 | Gerar recibo | — | `.receipt-vehicle-card` com "Modelo: Fiat Strada", "Placa: ABC-1D23", "Ano: 2024" |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-vehicle-card")
      .should("contain.text", "Modelo: Fiat Strada")
      .and("contain.text", "Placa: ABC-1D23")
      .and("contain.text", "Ano: 2024");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 5 | Modelo com 1 caractere e gerar | `F` | `#carModelErr` visível ("Mínimo 2 caracteres"); preview não abre |
    modelo().clear().type("F");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#carModelErr").should("be.visible").and("have.text", "Mínimo 2 caracteres");
    modelo().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-VEI-002: Máscara e Formato de Placa

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
// | 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
// | 3 | Digitar minúsculas e pontuação | `ab-c1.d2 3` | `ABC-1D23` (maiúsculas, caracteres especiais removidos) |
// | 4 | Digitar mais de 7 caracteres | `ABC1D23XYZ` | `ABC-1D23` (cortado em 7) |
// | 5 | Digitar placa incompleta e gerar | `ABC12` | Aceita: exibido `ABC-12` (o app não valida o formato da placa) |

// **Critério de Aceite:** Ambos os formatos (Mercosul e antigo) recebem a máscara.

describe("TC-VEI-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara e Formato de Placa", () => {
    const placa = () => cy.get('[data-testid="input-vehicle-plate"]');

    // | 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
    placa().type("ABC1D23").should("have.value", "ABC-1D23");

    // | 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
    placa().clear().type("ABC1234").should("have.value", "ABC-1234");

    // | 3 | Digitar minúsculas e pontuação | `ab-c1.d2 3` | `ABC-1D23` (maiúsculas, caracteres especiais removidos) |
    placa().clear().type("ab-c1.d2 3").should("have.value", "ABC-1D23");

    // | 4 | Digitar mais de 7 caracteres | `ABC1D23XYZ` | `ABC-1D23` (cortado em 7) |
    placa().clear().type("ABC1D23XYZ").should("have.value", "ABC-1D23");

    // | 5 | Digitar placa incompleta e gerar | `ABC12` | Aceita: exibido `ABC-12` (o app não valida o formato da placa) |
    cy.preencherFormulario({ carPlate: "ABC12" });
    placa().should("have.value", "ABC-12");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-vehicle-card").should("contain.text", "Placa: ABC-12");
  });
});

// #### TC-VEI-003: Validação de Ano do Veículo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir ano válido | `2024` | Ano aceito |
// | 2 | Inserir ano limite inferior | `1900` | Aceito |
// | 3 | Inserir ano atual + 1 | `<ano atual>+1` | Aceito |
// | 4 | Inserir ano muito antigo | `1899` e `1800` | `#carYearErr` visível ("Ano inválido"); preview não abre |
// | 5 | Inserir ano atual + 2 | `<ano atual>+2` | Erro visível |
// | 6 | Inserir 3 dígitos | `999` | Erro visível |
// | 7 | Inserir 5 dígitos | `20245` | Erro visível |
// | 8 | Inserir letras | `abcd` | Erro visível |

// **Critério de Aceite:** Aceitos apenas anos de 1900 a (ano atual + 1), com 4 dígitos.

// **Notas Cypress:** o ano é calculado em tempo de execução; não fixe 2027/2050.
// 🐞 DEF-07: o campo não tem máscara numérica (aceita letras na digitação; só valida ao gerar).

describe("TC-VEI-003", () => {
  const anoAtual = new Date().getFullYear();
  const ano = () => cy.get('[data-testid="input-vehicle-year"]');
  const erro = () => cy.get("#carYearErr");

  const gerarCom = (valor) => {
    ano().clear().type(String(valor));
    cy.get('[data-testid="btn-generate"]').click();
  };

  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
    cy.get('[data-testid="input-privacy"]').check();
  });

  it("Validação de Ano do Veículo", () => {
    // | 1 | Inserir ano válido | `2024` | Ano aceito |
    gerarCom(2024);
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Inserir ano limite inferior | `1900` | Aceito |
    gerarCom(1900);
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 3 | Inserir ano atual + 1 | `<ano atual>+1` | Aceito |
    gerarCom(anoAtual + 1);
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 4 | Inserir ano muito antigo | `1899` e `1800` | `#carYearErr` visível ("Ano inválido"); preview não abre |
    [1899, 1800].forEach((valor) => {
      gerarCom(valor);
      erro().should("be.visible").and("have.text", "Ano inválido");
      ano().should("have.class", "field-invalid");
      cy.get("#printContainer").should("not.have.class", "visible");
    });

    // | 5 | Inserir ano atual + 2 | `<ano atual>+2` | Erro visível |
    gerarCom(anoAtual + 2);
    erro().should("be.visible");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 6 | Inserir 3 dígitos | `999` | Erro visível |
    gerarCom(999);
    erro().should("be.visible");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 7 | Inserir 5 dígitos | `20245` | Erro visível |
    gerarCom(20245);
    erro().should("be.visible");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 8 | Inserir letras | `abcd` | Erro visível |
    // DEF-07: o campo aceita letras na digitação; a validação só ocorre ao gerar.
    gerarCom("abcd");
    ano().should("have.value", "abcd");
    erro().should("be.visible");
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-VEI-004: Visibilidade Condicional da Seção

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar com modelo, placa e ano preenchidos | Massa válida | `.receipt-vehicle-card` presente com os três campos |
// | 2 | Tentar gerar com o modelo vazio | — | Modelo `:invalid`; preview não abre (a seção veículo é **sempre** impressa quando o formulário é válido) |
// | 3 | Gerar no modelo detalhado | Massa válida | Seção "Informações do Veículo" com Modelo, Placa e Ano |

// **Critério de Aceite:** Como Modelo e Ano são obrigatórios, a seção sempre aparece em recibos gerados.

describe("TC-VEI-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Visibilidade Condicional da Seção", () => {
    const modelo = () => cy.get('[data-testid="input-vehicle-model"]');

    // | 1 | Gerar com modelo, placa e ano preenchidos | Massa válida | `.receipt-vehicle-card` presente com os três campos |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-vehicle-card").should("exist");
    cy.get("#receiptContent .receipt-vehicle-info")
      .should("contain.text", "Fiat Strada")
      .and("contain.text", "ABC-1D23")
      .and("contain.text", "2024");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Tentar gerar com o modelo vazio | — | Modelo `:invalid`; preview não abre (a seção veículo é **sempre** impressa quando o formulário é válido) |
    modelo().clear();
    cy.get('[data-testid="btn-generate"]').click();
    modelo().should("match", ":invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 3 | Gerar no modelo detalhado | Massa válida | Seção "Informações do Veículo" com Modelo, Placa e Ano |
    modelo().type("Fiat Strada");
    cy.get("#receiptTemplate").select("detailed");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#receiptContent .receipt-detailed-title")
      .filter(":contains('Informações do Veículo')")
      .should("exist");
    cy.get("#receiptContent .receipt-detailed-section")
      .filter(":contains('Informações do Veículo')")
      .within(() => {
        cy.contains(".receipt-detailed-label", "Modelo")
          .siblings(".receipt-detailed-value")
          .should("have.text", "Fiat Strada");
        cy.contains(".receipt-detailed-label", "Placa")
          .siblings(".receipt-detailed-value")
          .should("have.text", "ABC-1D23");
        cy.contains(".receipt-detailed-label", "Ano")
          .siblings(".receipt-detailed-value")
          .should("have.text", "2024");
      });
  });
});
