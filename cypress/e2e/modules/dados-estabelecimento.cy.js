// ### 4.7 Módulo: Dados do Estabelecimento

// > Use `cy.mockLocalidades()` e `cy.mockViaCep()` em todos os casos deste módulo
// > (Apêndice C). Os dados das cidades vêm do IBGE (SDD §3.7 previa JSON local;
// > ver DEF-01).

const ENDERECO_VIACEP = {
  logradouro: "Avenida Paulista",
  bairro: "Bela Vista",
  localidade: "São Paulo",
  uf: "SP",
};

const estado = () => cy.get("#estStateSelect");
const cidade = () => cy.get("#estCitySelect");
const cep = () => cy.get("#estCep");

const tentarGerar = () => {
  cy.get('[data-testid="input-privacy"]').check();
  cy.get('[data-testid="btn-generate"]').click();
  cy.get("#printContainer").should("not.have.class", "visible");
};

// #### TC-EST-001: Preenchimento Completo de Endereço

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Nome da Empresa | `Lava-jato Express` | Nome aceito |
// | 2 | Selecionar Estado | `SP` (São Paulo) | Estado selecionado |
// | 3 | Aguardar e selecionar Cidade | `São Paulo` | Cidades populadas e cidade selecionada |
// | 4 | Preencher Bairro | `Centro` | Bairro aceito |
// | 5 | Preencher CEP | `01310100` | Máscara aplicada: `01310-100` |
// | 6 | Preencher Rua/Logradouro | `Av. Paulista` | Rua aceita |
// | 7 | Preencher Número | `1000` | Número aceito |
// | 8 | Gerar o recibo | — | Endereço completo no recibo (ver TC-GER-001) |

// **Critério de Aceite:** Todos os campos aceitos; cidade populada após o estado.

// **Notas Cypress:** após `select('SP')`, `cy.wait('@ibge')` e `should('not.be.disabled')`
// no select de cidade. Ao sair do campo CEP com 8 dígitos o app consulta o ViaCEP e
// **sobrescreve** rua, bairro, estado e cidade (ver TC-EST-004). Para o passo 6 digitar
// depois da consulta, ou simule o ViaCEP com os mesmos dados.

describe("TC-EST-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Preenchimento Completo de Endereço", () => {
    // | 1 | Preencher Nome da Empresa | `Lava-jato Express` | Nome aceito |
    // | 2 | Selecionar Estado | `SP` (São Paulo) | Estado selecionado |
    // | 3 | Aguardar e selecionar Cidade | `São Paulo` | Cidades populadas e cidade selecionada |
    // | 4 | Preencher Bairro | `Centro` | Bairro aceito |
    // | 5 | Preencher CEP | `01310100` | Máscara aplicada: `01310-100` |
    // | 6 | Preencher Rua/Logradouro | `Av. Paulista` | Rua aceita |
    // | 7 | Preencher Número | `1000` | Número aceito |
    cy.preencherFormulario();

    cy.get("#estName").should("have.value", "Lava-jato Express");
    estado().should("have.value", "SP");
    cidade().should("have.value", "São Paulo");
    cy.get("#estNeighborhood").should("have.value", "Centro");
    cep().should("have.value", "01310-100");
    cy.get("#estStreet").should("have.value", "Av. Paulista");
    cy.get("#estNumber").should("have.value", "1000");

    // | 8 | Gerar o recibo | — | Endereço completo no recibo (ver TC-GER-001) |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-est-name").should(
      "have.text",
      "Lava-jato Express"
    );
    cy.get("#receiptContent .receipt-est-address")
      .should("contain.text", "Av. Paulista")
      .and("contain.text", "1000")
      .and("contain.text", "Centro");
    cy.get("#receiptContent .receipt-city")
      .should("contain.text", "São Paulo")
      .and("contain.text", "SP");
    cy.get("#receiptContent .receipt-footer-sig-detail").should(
      "have.text",
      "Av. Paulista, 1000, Centro, São Paulo, SP"
    );
  });
});

// #### TC-EST-002: Carregamento Dinâmico de Cidades

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar estado inicial da cidade | — | Campo desabilitado com "Selecione o estado primeiro" |
// | 2 | Selecionar Estado | Rio de Janeiro (`RJ`) | Cidade habilitada; cidades do RJ listadas após "Selecione a cidade" |
// | 3 | Selecionar Estado | Minas Gerais (`MG`) | Cidades de MG listadas |
// | 4 | Selecionar Estado | Amazonas (`AM`) | Cidades do AM listadas |
// | 5 | Alterar Estado | De MG para SP | Lista limpa e repopulada com cidades de SP |
// | 6 | Voltar para "Selecione ..." | — | Cidade volta a ficar desabilitada com "Selecione o estado primeiro" |

// **Critério de Aceite:** Cidades populadas dinamicamente e correspondentes ao estado.

// **Notas Cypress:** a requisição é
// `GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/<UF>/municipios?orderBy=nome`.
// Enquanto carrega, o select mostra "Carregando cidades..." e fica desabilitado.

describe("TC-EST-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Carregamento Dinâmico de Cidades", () => {
    // | 1 | Verificar estado inicial da cidade | — | Campo desabilitado com "Selecione o estado primeiro" |
    cidade()
      .should("be.disabled")
      .and("contain.text", "Selecione o estado primeiro");

    // | 2 | Selecionar Estado | Rio de Janeiro (`RJ`) | Cidade habilitada; cidades do RJ listadas após "Selecione a cidade" |
    estado().select("RJ");
    cy.wait("@ibge");
    cidade().should("not.be.disabled");
    cidade().find("option").first().should("have.text", "Selecione a cidade");
    cidade().find("option").should("have.length", 3);
    cidade().should("contain.text", "Niterói").and("contain.text", "Rio de Janeiro");
    cidade().select("Rio de Janeiro").should("have.value", "Rio de Janeiro");

    // | 3 | Selecionar Estado | Minas Gerais (`MG`) | Cidades de MG listadas |
    estado().select("MG");
    cy.wait("@ibge");
    cidade().should("not.be.disabled");
    cidade()
      .should("contain.text", "Belo Horizonte")
      .and("contain.text", "Uberlândia");

    // | 4 | Selecionar Estado | Amazonas (`AM`) | Cidades do AM listadas |
    estado().select("AM");
    cy.wait("@ibge");
    cidade().should("not.be.disabled");
    cidade().should("contain.text", "Manaus").and("contain.text", "Parintins");

    // | 5 | Alterar Estado | De MG para SP | Lista limpa e repopulada com cidades de SP |
    estado().select("MG");
    cy.wait("@ibge");
    estado().select("SP");
    cy.wait("@ibge");
    cidade().should("not.be.disabled");
    cidade().should("contain.text", "São Paulo").and("contain.text", "Santos");
    cidade().should("not.contain.text", "Belo Horizonte");

    // | 6 | Voltar para "Selecione ..." | — | Cidade volta a ficar desabilitada com "Selecione o estado primeiro" |
    estado().select("");
    cidade()
      .should("be.disabled")
      .and("contain.text", "Selecione o estado primeiro");
  });
});

// #### TC-EST-003: Validação de CEP

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CEP completo | `01310100` | Máscara: `01310-100` |
// | 2 | Inserir CEP incompleto e gerar | `01310` | Exibido `01310`; `#estCep` com `.field-invalid`; preview não abre |
// | 3 | Digitar letras | `01310-ABC` | Letras ignoradas: exibido `01310` |
// | 4 | 🐞 Verificar mensagem de erro do passo 2 | — | Esperado: mensagem "CEP incompleto" visível. Atual: apenas a borda vermelha, sem mensagem |

// **Critério de Aceite:** CEP aceito apenas no formato `00000-000`.

// **Notas Cypress:** letras nunca chegam ao campo (a máscara remove). Não existe
// "CEP deve conter apenas números".

describe("TC-EST-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Validação de CEP", () => {
    // | 1 | Inserir CEP completo | `01310100` | Máscara: `01310-100` |
    cep().type("01310100").blur();
    cep().should("have.value", "01310-100");
    cy.wait("@viacep");
    cy.preencherFormulario();

    // | 2 | Inserir CEP incompleto e gerar | `01310` | Exibido `01310`; `#estCep` com `.field-invalid`; preview não abre |
    cep().clear().type("01310");
    cep().should("have.value", "01310");
    tentarGerar();
    cep().should("have.class", "field-invalid");

    // | 4 | 🐞 Verificar mensagem de erro do passo 2 | — | Esperado: mensagem "CEP incompleto" visível. Atual: apenas a borda vermelha, sem mensagem |
    // DEF-10: comportamento atual; inverter após correção.
    cy.get("#estCepErr").should("not.exist");

    // | 3 | Digitar letras | `01310-ABC` | Letras ignoradas: exibido `01310` |
    cep().clear().type("01310-ABC");
    cep().should("have.value", "01310");
  });
});

// #### TC-EST-004: Preenchimento Automático por CEP

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Simular resposta do ViaCEP | `{ logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" }` | — |
// | 2 | Digitar CEP completo e sair do campo | `01310100` | Rua = "Avenida Paulista"; bairro = "Bela Vista"; estado = `SP`; cidade = "São Paulo" |
// | 3 | Verificar indicador | — | `#cepSuccess` ("✓ endereço preenchido!") visível e some após ≈ 3 s |
// | 4 | Digitar CEP com menos de 8 dígitos e sair do campo | `01310` | Nenhuma requisição ao ViaCEP |

// **Critério de Aceite:** O CEP completo preenche o endereço automaticamente.

// **Notas Cypress:** `cy.wait('@viacep')`. A requisição é
// `GET https://viacep.com.br/ws/<CEP>/json/`.

describe("TC-EST-004", () => {
  it("Preenchimento Automático por CEP", () => {
    let chamadasViaCep = 0;

    cy.abrirFormulario();
    // Intercepta depois do abrirFormulario para ser a rota mais recente e
    // contar quantas requisições o app realmente dispara.
    cy.intercept("GET", "https://viacep.com.br/ws/*/json/", (req) => {
      chamadasViaCep += 1;
      req.reply({ statusCode: 200, body: ENDERECO_VIACEP });
    }).as("viacepSpy");

    // | 2 | Digitar CEP completo e sair do campo | `01310100` | Rua = "Avenida Paulista"; bairro = "Bela Vista"; estado = `SP`; cidade = "São Paulo" |
    cep().type("01310100").blur();
    cy.wait("@viacepSpy");
    cy.get("#estStreet").should("have.value", "Avenida Paulista");
    cy.get("#estNeighborhood").should("have.value", "Bela Vista");
    estado().should("have.value", "SP");
    cidade().should("have.value", "São Paulo");

    // | 3 | Verificar indicador | — | `#cepSuccess` ("✓ endereço preenchido!") visível e some após ≈ 3 s |
    cy.get("#cepSuccess").should("be.visible");
    cy.get("#cepSuccess").should("not.be.visible", { timeout: 6000 });

    // | 4 | Digitar CEP com menos de 8 dígitos e sair do campo | `01310` | Nenhuma requisição ao ViaCEP |
    cep().clear().type("01310").blur();
    cy.then(() => {
      expect(chamadasViaCep, "requisições ao ViaCEP").to.eq(1);
    });
  });
});

// #### TC-EST-005: CEP Não Encontrado ou Falha de Rede

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Simular `{ "erro": true }` e digitar CEP | `99999999` | `#estCep` com `.field-invalid` e `title` = "CEP não encontrado"; campos de endereço intactos |
// | 2 | Simular falha de rede e digitar CEP | `01310100` | Spinner some; `title` = "Não foi possível buscar o CEP. Verifique sua conexão." |
// | 3 | Corrigir com um CEP existente | `01310100` (resposta válida) | `.field-invalid` removido e `title` vazio |

// **Critério de Aceite:** Falhas na busca de CEP não impedem o preenchimento manual.

// **Notas Cypress:** a falha de rede usa `forceNetworkError: true` no `cy.intercept`.
// O app tenta a requisição 3 vezes (retry de 800 ms); aguarde ≈ 2 s ou aumente o
// timeout do `cy.wait`.

describe("TC-EST-005", () => {
  it("CEP Não Encontrado ou Falha de Rede", () => {
    let falhas = 0;

    cy.abrirFormulario();
    cy.get("#estStreet").type("Rua Original");
    cy.get("#estNeighborhood").type("Bairro Original");

    // | 1 | Simular `{ "erro": true }` e digitar CEP | `99999999` | `#estCep` com `.field-invalid` e `title` = "CEP não encontrado"; campos de endereço intactos |
    cy.intercept("GET", "https://viacep.com.br/ws/99999999/json/", {
      statusCode: 200,
      body: { erro: true },
    }).as("cepErro");
    cep().type("99999999").blur();
    cy.wait("@cepErro");
    cep()
      .should("have.class", "field-invalid")
      .and("have.attr", "title", "CEP não encontrado");
    cy.get("#estStreet").should("have.value", "Rua Original");
    cy.get("#estNeighborhood").should("have.value", "Bairro Original");

    // | 2 | Simular falha de rede e digitar CEP | `01310100` | Spinner some; `title` = "Não foi possível buscar o CEP. Verifique sua conexão." |
    cy.intercept(
      "GET",
      "https://viacep.com.br/ws/01310100/json/",
      (req) => {
        if (falhas < 3) {
          falhas += 1;
          req.reply({ forceNetworkError: true });
        } else {
          req.reply({ statusCode: 200, body: ENDERECO_VIACEP });
        }
      }
    ).as("cepRede");

    cep().clear().type("01310100").blur();
    cy.wait("@cepRede");
    cy.get("#cepSpinner").should("not.be.visible", { timeout: 10000 });
    cep().should(
      "have.attr",
      "title",
      "Não foi possível buscar o CEP. Verifique sua conexão."
    );
    cy.then(() => {
      expect(falhas, "tentativas com falha").to.eq(3);
    });

    // | 3 | Corrigir com um CEP existente | `01310100` (resposta válida) | `.field-invalid` removido e `title` vazio |
    cep().clear().type("01310100").blur();
    cy.wait("@cepRede");
    cep().should("not.have.class", "field-invalid").and("have.attr", "title", "");
    cy.get("#estStreet").should("have.value", "Avenida Paulista");
    cy.get("#estNeighborhood").should("have.value", "Bela Vista");
    estado().should("have.value", "SP");
    cidade().should("have.value", "São Paulo");
  });
});

// #### TC-EST-006: Falha ao Carregar Cidades

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Simular erro do IBGE (`500` ou erro de rede) | — | — |
// | 2 | Selecionar um estado | `SP` | Select de cidade com "Erro ao carregar — tente novamente" |
// | 3 | Verificar que o select está habilitado | — | Habilitado (permite nova tentativa ao trocar o estado) |
// | 4 | Restaurar a simulação e trocar o estado | `RJ` | Cidades carregadas normalmente |

// **Critério de Aceite:** Falha de carregamento é comunicada e recuperável.

describe("TC-EST-006", () => {
  it("Falha ao Carregar Cidades", () => {
    cy.abrirFormulario();

    // | 1 | Simular erro do IBGE (`500` ou erro de rede) | — | — |
    cy.intercept("GET", "**/estados/SP/municipios*", {
      statusCode: 500,
    }).as("ibgeErro");

    // | 2 | Selecionar um estado | `SP` | Select de cidade com "Erro ao carregar — tente novamente" |
    estado().select("SP");
    cy.wait("@ibgeErro");
    cidade()
      .should("contain.text", "Erro ao carregar — tente novamente")
      // | 3 | Verificar que o select está habilitado | — | Habilitado (permite nova tentativa ao trocar o estado) |
      .and("not.be.disabled");

    // | 4 | Restaurar a simulação e trocar o estado | `RJ` | Cidades carregadas normalmente |
    estado().select("RJ");
    cy.wait("@ibge");
    cidade().should("not.be.disabled");
    cidade()
      .should("contain.text", "Rio de Janeiro")
      .and("contain.text", "Niterói");
    cidade().select("Rio de Janeiro").should("have.value", "Rio de Janeiro");
  });
});

// #### TC-EST-007: Estado e Cidade Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher tudo, mas deixar o estado em "Selecione ..." e gerar | — | Preview não abre; foco em `#estStateSelect` |
// | 2 | Selecionar estado e deixar a cidade vazia e gerar | `SP` | Preview não abre; foco em `#estCitySelect` |
// | 3 | Selecionar a cidade e gerar | `São Paulo` | Preview abre |
// | 4 | 🐞 Verificar sinalização visual | — | Esperado: borda vermelha e mensagem nos selects. Atual: a classe `.field-invalid` é aplicada, mas o CSS só estiliza `input.field-invalid`; os selects não mudam visualmente |

// **Critério de Aceite:** Não há recibo sem estado e cidade.

// **Notas Cypress:** estado e cidade **não** têm atributo `required`; a validação é do
// app (não aparece em `:invalid`).

describe("TC-EST-007", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.preencherFormulario();
  });

  it("Estado e Cidade Obrigatórios", () => {
    // | 1 | Preencher tudo, mas deixar o estado em "Selecione ..." e gerar | — | Preview não abre; foco em `#estStateSelect` |
    estado().select("");
    tentarGerar();
    cy.focused().should("have.id", "estStateSelect");

    // | 4 | 🐞 Verificar sinalização visual | — | Esperado: borda vermelha e mensagem nos selects. Atual: a classe `.field-invalid` é aplicada, mas o CSS só estiliza `input.field-invalid`; os selects não mudam visualmente |
    // DEF-10: comportamento atual; inverter após correção.
    estado().should("have.class", "field-invalid");
    estado().should(($el) => {
      expect($el.css("border-color")).not.to.eq("rgb(239, 68, 68)");
    });
    cy.get("#estStateSelectErr").should("not.exist");

    // | 2 | Selecionar estado e deixar a cidade vazia e gerar | `SP` | Preview não abre; foco em `#estCitySelect` |
    estado().select("SP");
    cy.wait("@ibge");
    cidade().should("have.value", "");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.focused().should("have.id", "estCitySelect");
    cidade().should("have.class", "field-invalid");
    cidade().should(($el) => {
      expect($el.css("border-color")).not.to.eq("rgb(239, 68, 68)");
    });
    cy.get("#estCitySelectErr").should("not.exist");

    // | 3 | Selecionar a cidade e gerar | `São Paulo` | Preview abre |
    cidade().select("São Paulo");
    cy.get('[data-testid="btn-generate"]').click();
    cy.get("#printContainer").should("have.class", "visible");
  });
});
