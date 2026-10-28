// ### 4.12 Módulo: Máscaras de Input

// > Digite com `.type()` (caractere a caractere): a máscara é reaplicada a cada `input`.

// #### TC-MSK-001: Máscara de CPF

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 6 dígitos | `529982` | `529.982` |
// | 2 | Digitar 9 dígitos | `529982247` | `529.982.247` |
// | 3 | Digitar 11 dígitos | `52998224725` | `529.982.247-25` |
// | 4 | Digitar letras misturadas | `abc529x` | `529` (letras ignoradas) |

// **Critério de Aceite:** Máscara `000.000.000-00` aplicada automaticamente.

describe("TC-MSK-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara de CPF", () => {
    const campo = () => cy.get('[data-testid="input-client-document"]');

    // | 1 | Digitar 6 dígitos | `529982` | `529.982` |
    campo().type("529982").should("have.value", "529.982");

    // | 2 | Digitar 9 dígitos | `529982247` | `529.982.247` |
    campo().clear().type("529982247").should("have.value", "529.982.247");

    // | 3 | Digitar 11 dígitos | `52998224725` | `529.982.247-25` |
    campo().clear().type("52998224725").should("have.value", "529.982.247-25");

    // | 4 | Digitar letras misturadas | `abc529x` | `529` (letras ignoradas) |
    campo().clear().type("abc529x").should("have.value", "529");
  });
});

// #### TC-MSK-002: Máscara de CNPJ

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 12 dígitos | `114447770001` | `11.444.777/0001` |
// | 2 | Digitar 14 dígitos | `11444777000161` | `11.444.777/0001-61` |
// | 3 | Digitar mais de 14 dígitos | `1144477700016199999` | `11.444.777/0001-61` (corte em 14) |
// | 4 | Digitar o 12º dígito sobre um CPF completo | `52998224725` + `9` | A máscara muda de CPF para CNPJ: `52.998.224/7259` |

// **Critério de Aceite:** Máscara `00.000.000/0000-00` aplicada a partir do 12º dígito.

describe("TC-MSK-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara de CNPJ", () => {
    const campo = () => cy.get('[data-testid="input-client-document"]');

    // | 1 | Digitar 12 dígitos | `114447770001` | `11.444.777/0001` |
    campo().type("114447770001").should("have.value", "11.444.777/0001");

    // | 2 | Digitar 14 dígitos | `11444777000161` | `11.444.777/0001-61` |
    campo()
      .clear()
      .type("11444777000161")
      .should("have.value", "11.444.777/0001-61");

    // | 3 | Digitar mais de 14 dígitos | `1144477700016199999` | `11.444.777/0001-61` (corte em 14) |
    campo()
      .clear()
      .type("1144477700016199999")
      .should("have.value", "11.444.777/0001-61");

    // | 4 | Digitar o 12º dígito sobre um CPF completo | `52998224725` + `9` | A máscara muda de CPF para CNPJ: `52.998.224/7259` |
    campo().clear().type("52998224725").should("have.value", "529.982.247-25");
    campo().type("9").should("have.value", "52.998.224/7259");
  });
});

// #### TC-MSK-003: Máscara de Celular

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 3 dígitos | `119` | `(11) 9` |
// | 2 | Digitar 10 dígitos | `1199998888` | `(11) 9999-8888` |
// | 3 | Digitar 11 dígitos | `11999998888` | `(11) 99999-8888` |
// | 4 | Digitar mais de 11 dígitos | `119999988889999` | `(11) 99999-8888` (corte em 11) |

// **Critério de Aceite:** Máscara `(00) 00000-0000` para 11 dígitos e `(00) 0000-0000` para 10.

describe("TC-MSK-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara de Celular", () => {
    const cliente = () => cy.get('[data-testid="input-client-phone"]');
    const beneficiario = () => cy.get('[data-testid="input-beneficiary-phone"]');

    // | 1 | Digitar 3 dígitos | `119` | `(11) 9` |
    cliente().type("119").should("have.value", "(11) 9");

    // | 2 | Digitar 10 dígitos | `1199998888` | `(11) 9999-8888` |
    cliente().clear().type("1199998888").should("have.value", "(11) 9999-8888");

    // | 3 | Digitar 11 dígitos | `11999998888` | `(11) 99999-8888` |
    cliente().clear().type("11999998888").should("have.value", "(11) 99999-8888");

    // | 4 | Digitar mais de 11 dígitos | `119999988889999` | `(11) 99999-8888` (corte em 11) |
    cliente()
      .clear()
      .type("119999988889999")
      .should("have.value", "(11) 99999-8888");

    // A máscara vale para os dois celulares (cliente e beneficiário).
    beneficiario()
      .clear()
      .type("21987654321")
      .should("have.value", "(21) 98765-4321");
  });
});

// #### TC-MSK-004: Máscara de CEP

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 5 dígitos | `01310` | `01310` |
// | 2 | Digitar 6 dígitos | `013101` | `01310-1` |
// | 3 | Digitar 8 dígitos | `01310100` | `01310-100` |
// | 4 | Digitar letras | `01310-ABC` | `01310` (letras ignoradas) |
// | 5 | Digitar mais de 8 dígitos | `013101009999` | `01310-100` |

// **Critério de Aceite:** Máscara `00000-000` aplicada automaticamente.

describe("TC-MSK-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara de CEP", () => {
    const cep = () => cy.get('[data-testid="input-establishment-zipcode"]');

    // | 1 | Digitar 5 dígitos | `01310` | `01310` |
    cep().type("01310").should("have.value", "01310");

    // | 2 | Digitar 6 dígitos | `013101` | `01310-1` |
    cep().clear().type("013101").should("have.value", "01310-1");

    // | 3 | Digitar 8 dígitos | `01310100` | `01310-100` |
    cep().clear().type("01310100").should("have.value", "01310-100");

    // | 4 | Digitar letras | `01310-ABC` | `01310` (letras ignoradas) |
    cep().clear().type("01310-ABC").should("have.value", "01310");

    // | 5 | Digitar mais de 8 dígitos | `013101009999` | `01310-100` |
    cep().clear().type("013101009999").should("have.value", "01310-100");
  });
});

// #### TC-MSK-005: Máscara de Placa

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
// | 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
// | 3 | Digitar minúsculas | `abc1d23` | `ABC-1D23` |
// | 4 | Digitar 4 caracteres | `ABC1` | `ABC-1` |

// **Critério de Aceite:** Ambos os formatos suportados com a máscara `AAA-9999` / `AAA-9A99`.

describe("TC-MSK-005", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Máscara de Placa", () => {
    const placa = () => cy.get('[data-testid="input-vehicle-plate"]');

    // | 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
    placa().type("ABC1D23").should("have.value", "ABC-1D23");

    // | 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
    placa().clear().type("ABC1234").should("have.value", "ABC-1234");

    // | 3 | Digitar minúsculas | `abc1d23` | `ABC-1D23` |
    placa().clear().type("abc1d23").should("have.value", "ABC-1D23");

    // | 4 | Digitar 4 caracteres | `ABC1` | `ABC-1` |
    placa().clear().type("ABC1").should("have.value", "ABC-1");
  });
});

// #### TC-MSK-006: Máscara de Ano

// **Prioridade:** P4 · **Status:** 🐞 Defeito conhecido (DEF-07) — escrever com `it.skip`

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar letras e números | `20ab24` | `2024` (apenas dígitos) |
// | 2 | Digitar mais de 4 dígitos | `202499` | `2024` (corte em 4) |

// **Critério de Aceite:** O campo aceita apenas 4 dígitos (SDD §3.12).

// **Notas Cypress:** atual: o campo mantém `20ab24` e `202499`; `maskYear` existe em
// `masks.js`, mas não está ligada ao input. A validação do ano ocorre ao gerar (TC-VEI-003).

describe("TC-MSK-006", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  // DEF-07: comportamento esperado; inverter após correção.
  it.skip("Máscara de Ano (DEF-07)", () => {
    const ano = () => cy.get('[data-testid="input-vehicle-year"]');

    // | 1 | Digitar letras e números | `20ab24` | `2024` (apenas dígitos) |
    ano().type("20ab24").should("have.value", "2024");

    // | 2 | Digitar mais de 4 dígitos | `202499` | `2024` (corte em 4) |
    ano().clear().type("202499").should("have.value", "2024");
  });
});
