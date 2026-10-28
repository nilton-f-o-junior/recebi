// ### 4.5 Módulo: Dados do Beneficiário

// #### TC-BEN-001: Preenchimento de Dados Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Nome Completo | `Empresa XYZ Ltda` | Nome aceito |
// | 2 | Preencher Celular | `21987654321` | Máscara `(21) 98765-4321` |
// | 3 | Preencher CPF/CNPJ válido | `11444777000161` | Exibido `11.444.777/0001-61`; sem erro |
// | 4 | 🐞 Deixar Celular vazio e gerar | — | Esperado (SDD §3.5): campo opcional, gera normalmente. Atual: campo `required`; o navegador bloqueia |

// **Critério de Aceite:** Nome obrigatório aceito; documento validado.

describe("TC-BEN-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({
      providerName: "Empresa XYZ Ltda",
      providerPhone: "21987654321",
      providerDoc: "11444777000161",
    });
  });

  it("Preenchimento de Dados Obrigatórios", () => {
    // | 1 | Preencher Nome Completo | `Empresa XYZ Ltda` | Nome aceito |
    cy.get('[data-testid="input-beneficiary-name"]').should(
      "have.value",
      "Empresa XYZ Ltda"
    );

    // | 2 | Preencher Celular | `21987654321` | Máscara `(21) 98765-4321` |
    cy.get('[data-testid="input-beneficiary-phone"]').should(
      "have.value",
      "(21) 98765-4321"
    );

    // | 3 | Preencher CPF/CNPJ válido | `11444777000161` | Exibido `11.444.777/0001-61`; sem erro |
    cy.get('[data-testid="input-beneficiary-document"]')
      .should("have.value", "11.444.777/0001-61")
      .and("not.have.class", "field-invalid");
    cy.get("#providerDocErr").should("not.be.visible");

    // | 4 | 🐞 Deixar Celular vazio e gerar | — | Esperado (SDD §3.5): campo opcional, gera normalmente. Atual: campo `required`; o navegador bloqueia |
    // DEF-16: comportamento atual; inverter após correção.
    cy.get('[data-testid="input-beneficiary-phone"]').clear();
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    cy.get('[data-testid="input-beneficiary-phone"]').should("match", ":invalid");
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-BEN-002: Validação de CNPJ Válido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CNPJ válido e sair do campo | `11444777000161` | Exibido `11.444.777/0001-61`; `#providerDocErr` não visível |
// | 2 | Inserir outro CNPJ válido | `55773812000161` | Exibido `55.773.812/0001-61`; sem erro |
// | 3 | Inserir um terceiro CNPJ válido | `12345678000195` | Exibido `12.345.678/0001-95`; sem erro |

// **Critério de Aceite:** CNPJs válidos aceitos e formatados.

describe("TC-BEN-002", () => {
  const validar = (cnpj, mascara) => {
    cy.get('[data-testid="input-beneficiary-document"]').clear().type(cnpj);
    cy.get('[data-testid="input-beneficiary-name"]').click(); // blur
    cy.get('[data-testid="input-beneficiary-document"]').should(
      "have.value",
      mascara
    );
    cy.get("#providerDocErr").should("not.be.visible");
  };

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de CNPJ Válido", () => {
    // | 1 | Inserir CNPJ válido e sair do campo | `11444777000161` | Exibido `11.444.777/0001-61`; `#providerDocErr` não visível |
    validar("11444777000161", "11.444.777/0001-61");

    // | 2 | Inserir outro CNPJ válido | `55773812000161` | Exibido `55.773.812/0001-61`; sem erro |
    validar("55773812000161", "55.773.812/0001-61");

    // | 3 | Inserir um terceiro CNPJ válido | `12345678000195` | Exibido `12.345.678/0001-95`; sem erro |
    validar("12345678000195", "12.345.678/0001-95");
  });
});

// #### TC-BEN-003: Validação de CNPJ Inválido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CNPJ com dígito verificador errado | `11444777000162` | `#providerDocErr` visível; `.field-invalid` no campo |
// | 2 | Inserir CNPJ incompleto (13 dígitos) | `1144477700016` | Erro visível (mesma mensagem) |
// | 3 | Inserir CNPJ com todos os dígitos iguais | `11111111111111` | Erro visível |
// | 4 | Tentar gerar com CNPJ inválido | — | Preview não abre; foco em `#providerDoc` |

// **Critério de Aceite:** CNPJs inválidos rejeitados.

describe("TC-BEN-003", () => {
  const doc = () => cy.get('[data-testid="input-beneficiary-document"]');
  const erro = () => cy.get("#providerDocErr");
  const validarInvalido = (cnpj) => {
    doc().clear().type(cnpj);
    cy.get('[data-testid="input-beneficiary-name"]').click(); // blur
    erro().should("be.visible");
    doc().should("have.class", "field-invalid");
  };

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de CNPJ Inválido", () => {
    // | 1 | Inserir CNPJ com dígito verificador errado | `11444777000162` | `#providerDocErr` visível; `.field-invalid` no campo |
    validarInvalido("11444777000162");

    // | 2 | Inserir CNPJ incompleto (13 dígitos) | `1144477700016` | Erro visível (mesma mensagem) |
    validarInvalido("1144477700016");

    // | 3 | Inserir CNPJ com todos os dígitos iguais | `11111111111111` | Erro visível |
    validarInvalido("11111111111111");

    // | 4 | Tentar gerar com CNPJ inválido | — | Preview não abre; foco em `#providerDoc` |
    cy.preencherFormulario({ providerDoc: "11444777000162" });
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.focused().should("have.attr", "data-testid", "input-beneficiary-document");
  });
});

// #### TC-BEN-004: Nome e Celular do Beneficiário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir nome com 2 caracteres e gerar | `AB` | `#providerNameErr` visível ("Mínimo 3 caracteres"); preview não abre |
// | 2 | Inserir nome válido | `Maria Ltda` | Erro removido |
// | 3 | 🐞 Inserir celular com formato incompleto e gerar | `12` | Esperado: erro de formato (como no cliente). Atual: **aceito** (o celular do beneficiário não é validado no envio) |

// **Critério de Aceite:** Nome do beneficiário validado; celular com a mesma regra do cliente.

describe("TC-BEN-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ providerName: "AB" });
  });

  it("Nome e Celular do Beneficiário", () => {
    const nome = () => cy.get('[data-testid="input-beneficiary-name"]');
    const erro = () => cy.get("#providerNameErr");
    const gerar = () => {
      cy.get('[data-testid="input-privacy"]').check();
      cy.get('[data-testid="btn-generate"]').click();
    };

    // | 1 | Inserir nome com 2 caracteres e gerar | `AB` | `#providerNameErr` visível ("Mínimo 3 caracteres"); preview não abre |
    gerar();
    erro().should("be.visible").and("have.text", "Mínimo 3 caracteres");
    nome().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 2 | Inserir nome válido | `Maria Ltda` | Erro removido |
    nome().clear().type("Maria Ltda");
    nome().should("not.have.class", "field-invalid");
    erro().should("not.be.visible");

    // | 3 | 🐞 Inserir celular com formato incompleto e gerar | `12` | Esperado: erro de formato (como no cliente). Atual: **aceito** (o celular do beneficiário não é validado no envio) |
    // DEF-06: comportamento atual; inverter após correção.
    cy.get('[data-testid="input-beneficiary-phone"]').clear().type("12");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
  });
});
