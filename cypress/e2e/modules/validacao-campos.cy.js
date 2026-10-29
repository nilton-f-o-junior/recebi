// ### 4.11 Módulo: Validação de Campos

// > Lembrete: campos vazios obrigatórios são barrados pelo navegador (TC-FRM-005). Os casos abaixo usam valores **preenchidos porém inválidos**.

// #### TC-VAL-001: Validação em Tempo Real

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar nome inválido e sair do campo (blur) | `A` | **Nenhum** erro aparece (os erros de nome só surgem ao tentar gerar) |
// | 2 | Tentar gerar | — | `#clientNameErr` visível; `.field-invalid` aplicada |
// | 3 | Corrigir para nome válido | `João` | Erro removido imediatamente (evento `input`) |
// | 4 | Digitar CPF inválido e sair do campo | `52998224763` | Erro do documento aparece **no blur** (`onblur`) |
// | 5 | Corrigir o CPF | `52998224725` | Erro removido |

// **Critério de Aceite:** Erros de documento aparecem no blur; os demais, no envio; todos somem ao corrigir.

// **Notas Cypress:** a v1.0 previa erro no blur para o nome. O código só **remove** erros no blur/input quando o campo passa a ter valor.

describe("TC-VAL-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ clientName: "A" });
  });

  it("Validação em Tempo Real", () => {
    const nome = () => cy.get('[data-testid="input-client-name"]');
    const erroNome = () => cy.get("#clientNameErr");
    const documento = () => cy.get('[data-testid="input-client-document"]');
    const erroDocumento = () => cy.get("#clientDocErr");
    const tentarGerar = () => {
      cy.get('[data-testid="input-privacy"]').check();
      cy.get('[data-testid="btn-generate"]').click();
    };

    // | 1 | Digitar nome inválido e sair do campo (blur) | `A` | **Nenhum** erro aparece (os erros de nome só surgem ao tentar gerar) |
    nome().clear().type("A").blur();
    erroNome().should("not.be.visible");
    nome().should("not.have.class", "field-invalid");

    // | 2 | Tentar gerar | — | `#clientNameErr` visível; `.field-invalid` aplicada |
    tentarGerar();
    erroNome().should("be.visible").and("have.text", "Mínimo 3 caracteres");
    nome().should("have.class", "field-invalid");
    cy.get("#printContainer").should("not.have.class", "visible");

    // | 3 | Corrigir para nome válido | `João` | Erro removido imediatamente (evento `input`) |
    nome().clear().type("João");
    erroNome().should("not.be.visible");
    nome().should("not.have.class", "field-invalid");

    // | 4 | Digitar CPF inválido e sair do campo | `52998224763` | Erro do documento aparece **no blur** (`onblur`) |
    documento().clear().type("52998224763").blur();
    erroDocumento().should("be.visible");
    documento().should("have.class", "field-invalid");

    // | 5 | Corrigir o CPF | `52998224725` | Erro removido |
    documento().clear().type("52998224725").blur();
    erroDocumento().should("not.be.visible");
    documento().should("not.have.class", "field-invalid");
  });
});

// #### TC-VAL-002: Scroll até Primeiro Erro

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher o formulário com 2 campos inválidos | Nome `A` e ano `1800` (demais válidos) | Formulário preenchido |
// | 2 | Tentar gerar | — | Preview não abre; erros visíveis em nome e ano |
// | 3 | Verificar foco | — | `#clientName` está focado e dentro da área visível |
// | 4 | Corrigir o nome e tentar gerar | `João Silva` | O foco passa para `#carYear` |

// **Critério de Aceite:** Scroll suave e foco no primeiro campo inválido.

// **Notas Cypress:** o "primeiro" segue a ordem de validação do código (tipo, data, nome, celular do cliente, nome do beneficiário, modelo, ano, empresa, estado, cidade, bairro, rua, número, CEP), que não é idêntica à ordem do DOM (CEP vem antes de rua e número). Verifique a visibilidade com `getBoundingClientRect()` ou `cy.get(...).should('be.visible')` após o scroll.

describe("TC-VAL-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ clientName: "A", carYear: "1800" });
  });

  it("Scroll até Primeiro Erro", () => {
    // | 1 | Preencher o formulário com 2 campos inválidos | Nome `A` e ano `1800` (demais válidos) | Formulário preenchido |
    cy.get('[data-testid="input-client-name"]').should("have.value", "A");
    cy.get('[data-testid="input-vehicle-year"]').should("have.value", "1800");

    // | 2 | Tentar gerar | — | Preview não abre; erros visíveis em nome e ano |
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get("#clientNameErr").should("be.visible");
    cy.get("#carYearErr").should("be.visible");

    // | 3 | Verificar foco | — | `#clientName` está focado e dentro da área visível |
    cy.get('[data-testid="input-client-name"]').should("be.focused");
    cy.get('[data-testid="input-client-name"]').should(($el) => {
      const rect = $el[0].getBoundingClientRect();
      const win = $el[0].ownerDocument.defaultView;
      expect(rect.top).to.be.at.least(0);
      expect(rect.bottom).to.be.at.most(win.innerHeight);
    });

    // | 4 | Corrigir o nome e tentar gerar | `João Silva` | O foco passa para `#carYear` |
    cy.get('[data-testid="input-client-name"]').clear().type("João Silva");
    cy.get('#clientNameErr').should("not.be.visible");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get("#carYearErr").should("be.visible");
    cy.get('[data-testid="input-vehicle-year"]').should("be.focused");
  });
});

// #### TC-VAL-003: Classe CSS de Erro

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Provocar erro no nome e tentar gerar | `A` | O `input` ganha a classe `.field-invalid`; a mensagem `#clientNameErr` ganha `.visible` |
// | 2 | Verificar estilo | — | Borda `rgb(239, 68, 68)` e fundo `rgb(255, 245, 245)` |
// | 3 | Corrigir o campo | `João` | Ambas as classes removidas |

// **Critério de Aceite:** Estilos aplicados e removidos corretamente.

// **Notas Cypress:** o SDD cita `.field-error` como classe do campo; no app, `.field-error` é a classe do **span da mensagem** e `.field-invalid` é a do campo (DIV-03).

describe("TC-VAL-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ clientName: "A" });
  });

  it("Classe CSS de Erro", () => {
    const nome = () => cy.get('[data-testid="input-client-name"]');
    const erro = () => cy.get("#clientNameErr");

    // | 1 | Provocar erro no nome e tentar gerar | `A` | O `input` ganha a classe `.field-invalid`; a mensagem `#clientNameErr` ganha `.visible` |
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    nome().should("have.class", "field-invalid");
    erro().should("have.class", "visible").and("be.visible");

    // | 2 | Verificar estilo | — | Borda `rgb(239, 68, 68)` e fundo `rgb(255, 245, 245)` |
    nome()
      .should("have.css", "border-color", "rgb(239, 68, 68)")
      .and("have.css", "background-color", "rgb(255, 245, 245)");

    // | 3 | Corrigir o campo | `João` | Ambas as classes removidas |
    nome().clear().type("João");
    nome().should("not.have.class", "field-invalid");
    erro().should("not.have.class", "visible").and("not.be.visible");
  });
});

// #### TC-VAL-004: Documento Opcional, Porém Validado

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar com CPF e CNPJ vazios | — | Preview abre |
// | 2 | Gerar com CPF inválido no cliente | `52998224763` | Preview não abre; foco em `#clientDoc` |
// | 3 | Gerar com CPF válido no cliente e CNPJ inválido no beneficiário | `52998224725` / `11444777000162` | Preview não abre; foco em `#providerDoc` |
// | 4 | Corrigir o CNPJ | `11444777000161` | Preview abre |

// **Critério de Aceite:** Documento vazio é aceito; preenchido, é validado.

describe("TC-VAL-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario({ clientDoc: "", providerDoc: "" });
  });

  it("Documento Opcional, Porém Validado", () => {
    const documentoCliente = () => cy.get('[data-testid="input-client-document"]');
    const documentoBeneficiario = () =>
      cy.get('[data-testid="input-beneficiary-document"]');

    // | 1 | Gerar com CPF e CNPJ vazios | — | Preview abre |
    cy.gerarRecibo();
    cy.get("#clientDocErr").should("not.be.visible");
    cy.get("#providerDocErr").should("not.be.visible");
    cy.get('[data-testid="btn-close-preview"]').click();

    // | 2 | Gerar com CPF inválido no cliente | `52998224763` | Preview não abre; foco em `#clientDoc` |
    documentoCliente().clear().type("52998224763");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get("#clientDocErr").should("be.visible");
    documentoCliente().should("be.focused");

    // | 3 | Gerar com CPF válido no cliente e CNPJ inválido no beneficiário | `52998224725` / `11444777000162` | Preview não abre; foco em `#providerDoc` |
    documentoCliente().clear().type("52998224725");
    documentoBeneficiario().clear().type("11444777000162");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get("#providerDocErr").should("be.visible");
    documentoBeneficiario().should("be.focused");

    // | 4 | Corrigir o CNPJ | `11444777000161` | Preview abre |
    documentoBeneficiario().clear().type("11444777000161");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
  });
});
