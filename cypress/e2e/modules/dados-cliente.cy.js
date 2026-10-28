// ### 4.4 Módulo: Dados do Cliente

// > Preencha todos os demais campos obrigatórios com a massa válida antes de gerar,
// > para que a validação nativa não bloqueie o envio antes da validação do app.

// #### TC-CLI-001: Preenchimento de Dados Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Nome Completo | `João Carlos da Silva` | Nome aceito, sem erro |
// | 2 | Preencher Celular | `11999998888` | Máscara aplicada: `(11) 99999-8888` |
// | 3 | Deixar CPF/CNPJ vazio | — | Campo opcional, sem erro |
// | 4 | Gerar o recibo | — | Preview abre; o card "Cliente" mostra nome e celular |

// **Critério de Aceite:** Nome aceito com 3+ caracteres, celular formatado, documento opcional.

describe("TC-CLI-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({
      clientName: "João Carlos da Silva",
      clientPhone: "11999998888",
      clientDoc: "",
    });
  });

  it("Preenchimento de Dados Obrigatórios", () => {
    // | 1 | Preencher Nome Completo | `João Carlos da Silva` | Nome aceito, sem erro |
    cy.get('[data-testid="input-client-name"]')
      .should("have.value", "João Carlos da Silva")
      .and("not.have.class", "field-invalid");
    cy.get("#clientNameErr").should("not.be.visible");

    // | 2 | Preencher Celular | `11999998888` | Máscara aplicada: `(11) 99999-8888` |
    cy.get('[data-testid="input-client-phone"]').should(
      "have.value",
      "(11) 99999-8888"
    );

    // | 3 | Deixar CPF/CNPJ vazio | — | Campo opcional, sem erro |
    cy.get('[data-testid="input-client-document"]')
      .should("have.value", "")
      .and("not.have.class", "field-invalid");
    cy.get("#clientDocErr").should("not.be.visible");

    // | 4 | Gerar o recibo | — | Preview abre; o card "Cliente" mostra nome e celular |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-party-card")
      .eq(0)
      .should("contain.text", "João Carlos da Silva")
      .and("contain.text", "(11) 99999-8888");
  });
});

// #### TC-CLI-002: Validação de Nome Mínimo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir 1 caractere e gerar | `A` | `#clientNameErr` visível com "Mínimo 3 caracteres"; `#clientName` com `.field-invalid`; preview não abre |
// | 2 | Inserir 2 caracteres e gerar | `AB` | Mesmo resultado |
// | 3 | Inserir 3 caracteres | `ABC` | Erro removido ao digitar (`.field-invalid` some; `#clientNameErr` deixa de ser visível); gerar abre o preview |

// **Critério de Aceite:** Nomes com menos de 3 caracteres são rejeitados com mensagem inline.

// **Notas Cypress:** o erro só aparece ao tentar gerar, não ao sair do campo.

describe("TC-CLI-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ clientName: "A" });
  });

  it("Validação de Nome Mínimo", () => {
    const nome = () => cy.get('[data-testid="input-client-name"]');
    const erro = () => cy.get("#clientNameErr");
    const gerar = () => {
      cy.get('[data-testid="input-privacy"]').check();
      cy.get('[data-testid="btn-generate"]').click();
    };

    // | 1 | Inserir 1 caractere e gerar | `A` | `#clientNameErr` visível com "Mínimo 3 caracteres"; `#clientName` com `.field-invalid`; preview não abre |
    gerar();
    erro().should("be.visible").and("have.text", "Mínimo 3 caracteres");
    nome().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 2 | Inserir 2 caracteres e gerar | `AB` | Mesmo resultado |
    nome().clear().type("AB");
    gerar();
    erro().should("be.visible");
    nome().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 3 | Inserir 3 caracteres | `ABC` | Erro removido ao digitar (`.field-invalid` some; `#clientNameErr` deixa de ser visível); gerar abre o preview |
    nome().clear().type("ABC");
    nome().should("not.have.class", "field-invalid");
    erro().should("not.be.visible");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
  });
});

// #### TC-CLI-003: Validação de CPF Válido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CPF válido e sair do campo | `52998224725` | Exibido `529.982.247-25`; `#clientDocErr` não visível |
// | 2 | Inserir outro CPF válido | `11144477735` | Exibido `111.444.777-35`; sem erro |
// | 3 | Inserir um terceiro CPF válido | `12345678909` | Exibido `123.456.789-09`; sem erro |
// | 4 | Gerar e verificar o recibo | — | CPF impresso com máscara no `.receipt-party-detail` do cliente |

// **Critério de Aceite:** CPFs válidos aceitos e formatados.

// **Notas Cypress:** a validação ocorre no `blur`.

describe("TC-CLI-003", () => {
  const validar = (cpf, mascara) => {
    cy.get('[data-testid="input-client-document"]').clear().type(cpf);
    cy.get('[data-testid="input-client-name"]').click(); // blur
    cy.get('[data-testid="input-client-document"]').should("have.value", mascara);
    cy.get("#clientDocErr").should("not.be.visible");
  };

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de CPF Válido", () => {
    // | 1 | Inserir CPF válido e sair do campo | `52998224725` | Exibido `529.982.247-25`; `#clientDocErr` não visível |
    validar("52998224725", "529.982.247-25");

    // | 2 | Inserir outro CPF válido | `11144477735` | Exibido `111.444.777-35`; sem erro |
    validar("11144477735", "111.444.777-35");

    // | 3 | Inserir um terceiro CPF válido | `12345678909` | Exibido `123.456.789-09`; sem erro |
    validar("12345678909", "123.456.789-09");

    // | 4 | Gerar e verificar o recibo | — | CPF impresso com máscara no `.receipt-party-detail` do cliente |
    cy.preencherFormulario({ clientDoc: "52998224725" });
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-party-card")
      .eq(0)
      .find(".receipt-party-detail")
      .should("contain.text", "529.982.247-25");
  });
});

// #### TC-CLI-004: Validação de CPF Inválido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CPF com dígito verificador errado e sair do campo | `52998224763` | `#clientDocErr` visível; `#clientDoc` com `.field-invalid` |
// | 2 | Inserir CPF com zeros | `00000000000` | Erro visível |
// | 3 | Inserir CPF com todos os dígitos iguais | `11111111111` | Erro visível |
// | 4 | Inserir CPF incompleto | `5299822` | Erro visível |
// | 5 | Tentar gerar com o CPF inválido | — | Preview não abre; foco em `#clientDoc` |
// | 6 | Corrigir para um CPF válido | `52998224725` | Erro removido |

// **Critério de Aceite:** CPFs inválidos rejeitados; dígitos verificadores validados.

// **Notas Cypress:** a mensagem atual do cliente é "CPF ou CPNJ inválidos" (DEF-08);
// evite asserir o texto exato até a correção.

describe("TC-CLI-004", () => {
  const doc = () => cy.get('[data-testid="input-client-document"]');
  const erro = () => cy.get("#clientDocErr");
  const validarInvalido = (cpf) => {
    doc().clear().type(cpf);
    cy.get('[data-testid="input-client-name"]').click(); // blur
    erro().should("be.visible");
    doc().should("have.class", "field-invalid");
  };

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de CPF Inválido", () => {
    // | 1 | Inserir CPF com dígito verificador errado e sair do campo | `52998224763` | `#clientDocErr` visível; `#clientDoc` com `.field-invalid` |
    validarInvalido("52998224763");

    // | 2 | Inserir CPF com zeros | `00000000000` | Erro visível |
    validarInvalido("00000000000");

    // | 3 | Inserir CPF com todos os dígitos iguais | `11111111111` | Erro visível |
    validarInvalido("11111111111");

    // | 4 | Inserir CPF incompleto | `5299822` | Erro visível |
    validarInvalido("5299822");

    // | 5 | Tentar gerar com o CPF inválido | — | Preview não abre; foco em `#clientDoc` |
    cy.preencherFormulario({ clientDoc: "52998224763" });
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.focused().should("have.attr", "data-testid", "input-client-document");

    // | 6 | Corrigir para um CPF válido | `52998224725` | Erro removido |
    doc().clear().type("52998224725");
    cy.get('[data-testid="input-client-name"]').click(); // blur
    doc().should("not.have.class", "field-invalid");
    erro().should("not.be.visible");
  });
});

// #### TC-CLI-005: Validação de Celular

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir 8 dígitos e gerar | `99998888` | Máscara `(99) 9988-88`; `#clientPhone` com `.field-invalid`; preview não abre |
// | 2 | Inserir 10 dígitos | `1199998888` | Máscara `(11) 9999-8888`; aceito |
// | 3 | Inserir 11 dígitos | `11999998888` | Máscara `(11) 99999-8888`; aceito |
// | 4 | 🐞 Inserir DDD inexistente | `00999998888` e `99999998888` | Esperado: erro "DDD inválido". Atual: **aceitos** |
// | 5 | 🐞 Verificar mensagem de erro do passo 1 | — | Esperado: mensagem visível. Atual: não há `#clientPhoneErr`; só a borda vermelha |

// **Critério de Aceite:** Celular com DDD válido e 10–11 dígitos.

describe("TC-CLI-005", () => {
  const telefone = () => cy.get('[data-testid="input-client-phone"]');
  const tentarGerar = () => {
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
  };

  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de Celular", () => {
    // | 1 | Inserir 8 dígitos e gerar | `99998888` | Máscara `(99) 9988-88`; `#clientPhone` com `.field-invalid`; preview não abre |
    cy.preencherFormulario({ clientPhone: "99998888" });
    telefone().should("have.value", "(99) 9988-88");
    tentarGerar();
    telefone().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').should("not.be.visible");

    // | 5 | 🐞 Verificar mensagem de erro do passo 1 | — | Atual: não há `#clientPhoneErr`; só a borda vermelha |
    // DEF-06: comportamento atual; inverter após correção.
    cy.get("#clientPhoneErr").should("not.exist");

    // | 2 | Inserir 10 dígitos | `1199998888` | Máscara `(11) 9999-8888`; aceito |
    cy.preencherFormulario({ clientPhone: "1199998888" });
    telefone().should("have.value", "(11) 9999-8888");
    tentarGerar();
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 3 | Inserir 11 dígitos | `11999998888` | Máscara `(11) 99999-8888`; aceito |
    cy.get('[data-testid="input-client-phone"]').clear().type("11999998888");
    telefone().should("have.value", "(11) 99999-8888");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 4 | 🐞 Inserir DDD inexistente | `00999998888` e `99999998888` | Esperado: erro "DDD inválido". Atual: **aceitos** |
    // DEF-06: comportamento atual; inverter após correção.
    cy.get('[data-testid="input-client-phone"]').clear().type("00999998888");
    telefone().should("have.value", "(00) 99999-8888");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    cy.get('[data-testid="input-client-phone"]').clear().type("99999998888");
    telefone().should("have.value", "(99) 99999-8888");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
  });
});
