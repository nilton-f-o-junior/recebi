// ## 5. Testes de Segurança e Privacidade

// #### TC-SEG-001: Transmissão Zero de Dados

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Registrar todas as requisições da página | `cy.intercept('**', req => requisicoes.push(req))` | — |
// | 2 | Preencher todos os campos com dados sensíveis e gerar | CPF, CNPJ, nomes, valores, observações | Recibo gerado |
// | 3 | Clicar em "Imprimir / Salvar PDF" | — | Nenhuma requisição `POST`, `PUT` ou `PATCH` |
// | 4 | Verificar o conteúdo das requisições | — | Nenhuma URL ou corpo contém nome, CPF, CNPJ, valores ou observações digitados |
// | 5 | 🐞 Verificar hosts contatados | — | Esperado (política de privacidade, SDD §4.1): nenhuma requisição leva dados digitados a terceiros. Atual: `GET viacep.com.br/ws/<CEP>/json/` envia o **CEP digitado** e `GET servicodados.ibge.gov.br/.../estados/<UF>/municipios` envia a UF |

// **Critério de Aceite:** Zero requisições com dados do formulário, exceto as consultas de localidade documentadas.

// **Notas Cypress:** a lista permitida de hosts nos passos 1–4 é: o próprio `baseUrl`, `fonts.googleapis.com`, `fonts.gstatic.com`, `viacep.com.br`, `servicodados.ibge.gov.br`. O passo 5 registra a divergência com a Política de Privacidade ("Nenhum dado digitado… é enviado a servidores externos"). Decisão pendente: ajustar o texto da política ou usar uma base local de cidades/CEP. No Chrome/Edge (Cypress 16) não asserir `req.httpVersion`, cabeçalhos de compressão nem status `304` no `cy.intercept`; compare método, host, URL e corpo. Repita o caso no Firefox, que usa a rede antiga.

const tid = (id) => `[data-testid="${id}"]`;

describe("TC-SEG-001", () => {
  it("Transmissão Zero de Dados", () => {
    const requisicoes = [];
    const registrar = (req) => {
      requisicoes.push({
        method: req.method,
        url: req.url,
        body: req.body,
      });
    };

    // | 1 | Registrar todas as requisições da página | `cy.intercept('**', req => requisicoes.push(req))` | — |
    // O handler amplo é registrado primeiro; os mocks específicos abaixo têm
    // prioridade e também registram a requisição, pois o handler amplo não roda
    // para rotas capturadas por um handler mais específico.
    cy.intercept("**", (req) => {
      registrar(req);
      req.continue();
    });

    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/*/municipios*",
      (req) => {
        registrar(req);
        const uf = req.url.match(/estados\/([A-Z]{2})\//)[1];
        const municipios = {
          SP: ["São Paulo"],
          RJ: ["Rio de Janeiro"],
        }[uf] || ["Cidade Teste"];
        req.reply({
          statusCode: 200,
          body: municipios.map((nome) => ({ nome })),
        });
      }
    ).as("ibge");

    cy.intercept(
      "GET",
      "https://viacep.com.br/ws/*/json/",
      (req) => {
        registrar(req);
        req.reply({ statusCode: 200, body: {} });
      }
    ).as("viacep");

    cy.visit("/src/html/form.html", {
      onBeforeLoad(win) {
        cy.stub(win, "print").as("print");
      },
    });

    // | 2 | Preencher todos os campos com dados sensíveis e gerar | CPF, CNPJ, nomes, valores, observações | Recibo gerado |
    cy.preencherFormulario();
    cy.gerarRecibo();

    // | 3 | Clicar em "Imprimir / Salvar PDF" | — | Nenhuma requisição `POST`, `PUT` ou `PATCH` |
    cy.get(tid("btn-print-receipt")).click();
    cy.get("@print").should("have.been.called");

    cy.wrap(requisicoes).should((reqs) => {
      const metodos = reqs.map((req) => req.method.toUpperCase());
      expect(metodos).not.to.include.members(["POST", "PUT", "PATCH"]);
    });

    // | 4 | Verificar o conteúdo das requisições | — | Nenhuma URL ou corpo contém nome, CPF, CNPJ, valores ou observações digitados |
    cy.wrap(requisicoes).should((reqs) => {
      const sensiveis = [
        "João Silva",
        "529.982.247-25",
        "52998224725",
        "(11) 99999-8888",
        "11999998888",
        "Maria Ltda",
        "11.444.777/0001-61",
        "11444777000161",
        "(21) 98765-4321",
        "21987654321",
        "Lavagem completa",
        "50.00",
        "Cera",
        "30.00",
        "Garantia de 30 dias",
      ];

      reqs.forEach((req) => {
        const corpo =
          typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body ?? "");
        const conteudo = `${req.url} ${corpo}`;

        sensiveis.forEach((valor) => {
          expect(conteudo, `${req.method} ${req.url}`).not.to.include(valor);
        });
      });
    });

    // | 5 | 🐞 Verificar hosts contatados | — | Esperado (política de privacidade, SDD §4.1): nenhuma requisição leva dados digitados a terceiros. Atual: `GET viacep.com.br/ws/<CEP>/json/` envia o **CEP digitado** e `GET servicodados.ibge.gov.br/.../estados/<UF>/municipios` envia a UF |
    // DEF-01: comportamento atual; inverter após correção.
    cy.wrap(requisicoes).should((reqs) => {
      const viaCep = reqs.find((req) => req.url.includes("viacep.com.br"));
      const ibge = reqs.find((req) =>
        req.url.includes("servicodados.ibge.gov.br")
      );

      expect(viaCep, "consulta ao ViaCEP").to.exist;
      expect(viaCep.url).to.include("01310100");
      expect(ibge, "consulta ao IBGE").to.exist;
      expect(ibge.url).to.match(/estados\/SP\//);
    });
  });
});

// #### TC-SEG-002: CSP Headers

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar os headers HTTP da página | `cy.request('/src/html/form.html')` | Header `content-security-policy` presente |
// | 2 | Verificar as diretivas | — | `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'self'` |
// | 3 | Verificar `connect-src` | — | Conforme SDD §4.2: `'none'` |
// | 4 | Tentar `fetch` manual | `fetch('https://exemplo.com')` na janela | Bloqueado pela CSP |

// **Critério de Aceite:** CSP configurada conforme especificação; requisições não permitidas bloqueadas.

// **Notas Cypress:** atual: o repositório não define CSP (nenhum `vercel.json` nem `<meta http-equiv>`). Além disso, `connect-src 'none'` e `script-src 'self'` quebrariam o app como está: ele consulta IBGE e ViaCEP, e `form.html` tem um script inline de inicialização. Defina a política real (com `connect-src` para esses dois hosts ou removendo a dependência) antes de escrever este teste.

describe("TC-SEG-002", () => {
  it.skip("CSP Headers (DEF-01)", () => {
    // | 1 | Verificar os headers HTTP da página | `cy.request('/src/html/form.html')` | Header `content-security-policy` presente |
    cy.request("/src/html/form.html").then((resposta) => {
      expect(resposta.headers).to.have.property("content-security-policy");
      const csp = resposta.headers["content-security-policy"];
      expect(csp).to.include("default-src 'self'");
      expect(csp).to.include("script-src 'self'");
      expect(csp).to.include("object-src 'none'");
      expect(csp).to.include("base-uri 'self'");
      // | 3 | Verificar `connect-src` | — | Conforme SDD §4.2: `'none'` |
      expect(csp).to.include("connect-src 'none'");
    });

    // | 4 | Tentar `fetch` manual | `fetch('https://exemplo.com')` na janela | Bloqueado pela CSP |
    cy.visit("/src/html/form.html");
    cy.window().then((win) => {
      return win
        .fetch("https://exemplo.com")
        .then(() => {
          throw new Error("A requisição deveria ter sido bloqueada pela CSP");
        })
        .catch((erro) => {
          expect(erro.message).to.match(/CSP|Content Security Policy|blocked/i);
        });
    });
  });
});

// #### TC-SEG-003: Sem Cookies de Rastreamento nem Persistência

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Percorrer o fluxo completo (preencher, gerar, imprimir) | Massa válida | — |
// | 2 | Verificar cookies | `cy.getCookies()` | Lista vazia |
// | 3 | Verificar `localStorage` | — | `length` = 0 |
// | 4 | Verificar `sessionStorage` | — | `length` = 0 |
// | 5 | Recarregar a página | `cy.reload()` | Formulário volta ao estado inicial; nenhum dado restaurado |

// **Critério de Aceite:** Zero cookies; dados não persistidos.

// **Notas Cypress:** no Cypress 16 `cy.getCookies()` é uma query com retry: use `cy.getCookies().should('be.empty')`, não `.then()`. Para o storage, `cy.window().its('localStorage.length').should('eq', 0)` e o equivalente para `sessionStorage`.

describe("TC-SEG-003", () => {
  it("Sem Cookies de Rastreamento nem Persistência", () => {
    // | 1 | Percorrer o fluxo completo (preencher, gerar, imprimir) | Massa válida | — |
    cy.abrirFormulario();
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.get(tid("btn-print-receipt")).click();
    cy.get("@print").should("have.been.called");

    // | 2 | Verificar cookies | `cy.getCookies()` | Lista vazia |
    cy.getCookies().should("be.empty");

    // | 3 | Verificar `localStorage` | — | `length` = 0 |
    cy.window().its("localStorage.length").should("eq", 0);

    // | 4 | Verificar `sessionStorage` | — | `length` = 0 |
    cy.window().its("sessionStorage.length").should("eq", 0);

    // | 5 | Recarregar a página | `cy.reload()` | Formulário volta ao estado inicial; nenhum dado restaurado |
    cy.reload();
    cy.get(tid("input-client-name")).should("have.value", "");
    cy.get(tid("input-privacy")).should("not.be.checked");
    cy.get(tid("input-service-name")).should("have.length", 1).and("have.value", "");
    cy.get("#printContainer").should("not.have.class", "visible");
  });
});

// #### TC-SEG-004: Consentimento de Privacidade

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar o botão sem marcar o checkbox | — | Botão desabilitado |
// | 2 | Marcar o checkbox | — | Botão habilitado |
// | 3 | Desmarcar o checkbox | — | Botão desabilitado novamente |
// | 4 | Gerar um recibo e desmarcar o checkbox com o preview aberto | `uncheck({ force: true })` | Sem efeito: o preview continua aberto e o recibo intacto |
// | 5 | Verificar o link da política | — | Link "Política de Privacidade" presente ao lado do checkbox |

// **Critério de Aceite:** Checkbox obrigatório para habilitar a geração.

describe("TC-SEG-004", () => {
  it("Consentimento de Privacidade", () => {
    cy.abrirFormulario();

    // | 1 | Verificar o botão sem marcar o checkbox | — | Botão desabilitado |
    cy.get(tid("btn-generate")).should("be.disabled");

    // | 2 | Marcar o checkbox | — | Botão habilitado |
    cy.get(tid("input-privacy")).check();
    cy.get(tid("btn-generate")).should("not.be.disabled");

    // | 3 | Desmarcar o checkbox | — | Botão desabilitado novamente |
    cy.get(tid("input-privacy")).uncheck();
    cy.get(tid("btn-generate")).should("be.disabled");

    // | 5 | Verificar o link da política | — | Link "Política de Privacidade" presente ao lado do checkbox |
    cy.get('label[for="privacy"] a')
      .should("exist")
      .and("have.attr", "href", "/src/html/politica-privacidade.html")
      .and("have.text", "Política de Privacidade");

    // | 4 | Gerar um recibo e desmarcar o checkbox com o preview aberto | `uncheck({ force: true })` | Sem efeito: o preview continua aberto e o recibo intacto |
    cy.get(tid("input-privacy")).check();
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.get(tid("input-privacy")).uncheck({ force: true });
    cy.get("#printContainer").should("have.class", "visible");
    cy.get("#receiptContent").should("contain.text", "João Silva");
    cy.get("#receiptContent").should("contain.text", "Lavagem completa");
  });
});

// #### TC-SEG-005: Escape de HTML nos Dados do Usuário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Informar HTML no nome do cliente | `<img src=x onerror="window.__xss1=1">Ana` | O recibo exibe o texto literal; nenhum `img[src="x"]` no recibo |
// | 2 | Informar HTML nas observações | `<b>neg</b><script>window.__xss2=1</script>` | Texto literal em `.receipt-observations-text`; nenhum `<b>` interpretado |
// | 3 | Informar HTML na descrição do serviço e no nome da empresa | `<i>x</i>` | Texto literal nos dois lugares |
// | 4 | Verificar execução | — | `win.__xss1` e `win.__xss2` permanecem `undefined` |

// **Critério de Aceite:** Nenhum dado digitado é interpretado como HTML.

// **Notas Cypress:** a exceção conhecida é a URL da logo (TC-LOG-008, DEF-09).

describe("TC-SEG-005", () => {
  it("Escape de HTML nos Dados do Usuário", () => {
    const nomeComHtml = '<img src=x onerror="window.__xss1=1">Ana';
    const observacoesComHtml =
      "<b>neg</b><script>window.__xss2=1</script>";
    const htmlSimples = "<i>x</i>";

    cy.abrirFormulario();
    cy.preencherFormulario({
      clientName: nomeComHtml,
      observations: observacoesComHtml,
      estName: htmlSimples,
      services: [{ name: htmlSimples, value: "50.00" }],
    });
    cy.gerarRecibo();

    // | 1 | Informar HTML no nome do cliente | `<img src=x onerror="window.__xss1=1">Ana` | O recibo exibe o texto literal; nenhum `img[src="x"]` no recibo |
    cy.get("#receiptContent .receipt-party-name")
      .first()
      .should("have.text", nomeComHtml);
    cy.get('#receiptContent img[src="x"]').should("not.exist");

    // | 2 | Informar HTML nas observações | `<b>neg</b><script>window.__xss2=1</script>` | Texto literal em `.receipt-observations-text`; nenhum `<b>` interpretado |
    cy.get("#receiptContent .receipt-observations-text").should(
      "have.text",
      observacoesComHtml
    );
    cy.get("#receiptContent b").should("not.exist");
    cy.get("#receiptContent script").should("not.exist");

    // | 3 | Informar HTML na descrição do serviço e no nome da empresa | `<i>x</i>` | Texto literal nos dois lugares |
    cy.get("#receiptContent .receipt-table-cell")
      .first()
      .should("have.text", htmlSimples);
    cy.get("#receiptContent .receipt-est-name")
      .first()
      .should("have.text", htmlSimples);
    cy.get("#receiptContent i").should("not.exist");

    // | 4 | Verificar execução | — | `win.__xss1` e `win.__xss2` permanecem `undefined` |
    cy.window().then((win) => {
      expect(win.__xss1).to.be.undefined;
      expect(win.__xss2).to.be.undefined;
    });
  });
});

// #### TC-SEG-006: Origem dos Scripts

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Listar `script[src]` do formulário | — | Todos relativos à própria origem (`/src/js/...`) |
// | 2 | Verificar bibliotecas de terceiros | — | Nenhum script de CDN externo |

// **Critério de Aceite:** Nenhum código de terceiros é executado.

describe("TC-SEG-006", () => {
  it("Origem dos Scripts", () => {
    cy.abrirFormulario();

    // | 1 | Listar `script[src]` do formulário | — | Todos relativos à própria origem (`/src/js/...`) |
    cy.get("script[src]")
      .should("have.length.greaterThan", 0)
      .each(($script) => {
        const src = $script.attr("src");
        expect(src).to.match(/^\/src\/js\//);
      });

    // | 2 | Verificar bibliotecas de terceiros | — | Nenhum script de CDN externo |
    cy.get("script[src]").then(($scripts) => {
      const externos = [...$scripts].filter((script) => {
        const src = script.getAttribute("src");
        return /^(https?:)?\/\//.test(src);
      });
      expect(externos).to.have.length(0);
    });
  });
});
