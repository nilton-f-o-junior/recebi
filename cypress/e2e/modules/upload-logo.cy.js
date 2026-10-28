// ### 4.3 Módulo: Upload de Logo

// > Gere os arquivos de imagem em `cypress/fixtures/` (um PNG pequeno, um JPG e
// > SVGs de teste) ou em memória com
// > `selectFile({ contents: Cypress.Buffer.from(...), fileName, mimeType })`.

const ALERTA_FORMATO = "Por favor, selecione um arquivo de imagem válido.";
const ALERTA_TAMANHO = "A imagem deve ter no máximo 2 MB.";
const LOGO_URL = "https://exemplo.com/logo.png";
const LOGO_404 = "https://exemplo.com/404.png";

const dropzone = () => cy.get('[data-testid="dropzone-logo"]');
const inputLogo = () => cy.get('[data-testid="input-logo-file"]');
const previewLogo = () => cy.get("#logoPreviewImg");
const areaPreview = () => cy.get("#logoPreviewArea");
const placeholder = () => cy.get("#logoPlaceholder");
const botaoRemover = () => cy.get('[data-testid="btn-remove-logo"]');

// Envia um arquivo em memória pela dropzone (ignora o filtro `accept`).
const soltarArquivo = (fileName, mimeType, contents) =>
  dropzone().selectFile(
    { contents: Cypress.Buffer.from(contents), fileName, mimeType },
    { action: "drag-drop" }
  );

// Envia um arquivo em memória pelo input escondido.
const escolherArquivo = (fileName, mimeType, contents) =>
  inputLogo().selectFile(
    { contents: Cypress.Buffer.from(contents), fileName, mimeType },
    { force: true }
  );

// #### TC-LOG-001: Upload de Imagem via Drag and Drop

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar estado inicial da dropzone | — | Placeholder "Clique aqui ou arraste a imagem" visível; preview oculto |
// | 2 | Arrastar sobre a dropzone | evento `dragover` | Classe `drag-over` aplicada à dropzone |
// | 3 | Soltar arquivo PNG válido | `logo.png` (< 2 MB) | Miniatura em `#logoPreviewImg` com `src` `data:image/png…`; dropzone com `has-image`; placeholder oculto |
// | 4 | Verificar botão "Remover imagem" | — | `btn-remove-logo` visível |
// | 5 | Clicar em "Remover imagem" | — | Placeholder volta; preview oculto; sem `has-image`; `input-logo-file` vazio |

// **Critério de Aceite:** Upload por arraste funciona, preview exibido e remoção
// restaura o estado inicial.

// **Notas Cypress:** `cy.get('[data-testid="dropzone-logo"]').selectFile('cypress/fixtures/logo.png', { action: 'drag-drop' })`.
// A classe `drag-over` é verificada com `.trigger('dragover')` antes do soltar.

describe("TC-LOG-001", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Upload de Imagem via Drag and Drop", () => {
    // | 1 | Verificar estado inicial da dropzone | — | Placeholder "Clique aqui ou arraste a imagem" visível; preview oculto |
    placeholder()
      .should("be.visible")
      .and("contain.text", "Clique aqui ou arraste a imagem");
    areaPreview().should("not.be.visible");

    // | 2 | Arrastar sobre a dropzone | evento `dragover` | Classe `drag-over` aplicada à dropzone |
    dropzone().trigger("dragover");
    dropzone().should("have.class", "drag-over");

    // | 3 | Soltar arquivo PNG válido | `logo.png` (< 2 MB) | Miniatura em `#logoPreviewImg` com `src` `data:image/png…`; dropzone com `has-image`; placeholder oculto |
    dropzone().selectFile("cypress/fixtures/images/logo.png", {
      action: "drag-drop",
    });
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/png/);
    });
    dropzone().should("have.class", "has-image");
    placeholder().should("not.be.visible");

    // | 4 | Verificar botão "Remover imagem" | — | `btn-remove-logo` visível |
    botaoRemover().should("be.visible");

    // | 5 | Clicar em "Remover imagem" | — | Placeholder volta; preview oculto; sem `has-image`; `input-logo-file` vazio |
    botaoRemover().click();
    placeholder().should("be.visible");
    areaPreview().should("not.be.visible");
    dropzone().should("not.have.class", "has-image");
    inputLogo().should("have.value", "");
  });
});

// #### TC-LOG-002: Upload de Imagem via Clique

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar o input de arquivo | `input-logo-file` | Existe, com `accept` = `image/png,image/jpeg,image/webp,image/svg+xml` |
// | 2 | Selecionar arquivo JPG válido | `logo.jpg` (1 MB) | Miniatura exibida |
// | 3 | Gerar recibo com logo | Massa válida | `.receipt-logo` presente, `src` começando com `data:image/jpeg` |
// | 4 | Remover a logo e gerar novamente | — | Nenhum `.receipt-logo` no recibo |

// **Critério de Aceite:** Arquivo carregado e logo impressa no documento.

// **Notas Cypress:** `selectFile(..., { force: true })` no input. A abertura do
// seletor nativo de arquivos não é automatizável 🖐.

describe("TC-LOG-002", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Upload de Imagem via Clique", () => {
    // | 1 | Verificar o input de arquivo | `input-logo-file` | Existe, com `accept` = `image/png,image/jpeg,image/webp,image/svg+xml` |
    inputLogo()
      .should("exist")
      .and(
        "have.attr",
        "accept",
        "image/png,image/jpeg,image/webp,image/svg+xml"
      );

    // | 2 | Selecionar arquivo JPG válido | `logo.jpg` (1 MB) | Miniatura exibida |
    inputLogo().selectFile("cypress/fixtures/images/logo.jpg", {
      force: true,
    });
    areaPreview().should("be.visible");
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/jpeg/);
    });

    // | 3 | Gerar recibo com logo | Massa válida | `.receipt-logo` presente, `src` começando com `data:image/jpeg` |
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/jpeg/);
    });

    // | 4 | Remover a logo e gerar novamente | — | Nenhum `.receipt-logo` no recibo |
    cy.get('[data-testid="btn-close-preview"]').click();
    botaoRemover().click();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should("not.exist");
  });
});

// #### TC-LOG-003: Validação de Formato de Arquivo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Tentar upload de PDF | `documento.pdf` (`application/pdf`) | `alert("Por favor, selecione um arquivo de imagem válido.")`; sem preview |
// | 2 | Tentar upload de EXE | `app.exe` | Mesmo alerta; sem preview |
// | 3 | Tentar upload de TXT | `readme.txt` | Mesmo alerta; sem preview |
// | 4 | Upload de PNG válido | `logo.png` | Sem alerta; preview exibido |
// | 5 | 🐞 Tentar upload de GIF por arraste | `animacao.gif` | Esperado (SDD): rejeitado (apenas PNG, JPG, SVG, WEBP). Atual: **aceito** |

// **Critério de Aceite:** Arquivos que não são imagem são rejeitados com alerta.

// **Notas Cypress:** `cy.on('window:alert', cy.stub().as('alert'))` antes do
// `selectFile`; verifique `'@alert'` com `calledWith`. O filtro `accept` só vale
// para o seletor; a validação do código é `file.type.startsWith("image/")`. A
// mensagem **não** é "Formato não suportado".

describe("TC-LOG-003", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.on("window:alert", cy.stub().as("alerta"));
  });

  it("Validação de Formato de Arquivo", () => {
    // | 1 | Tentar upload de PDF | `documento.pdf` (`application/pdf`) | `alert("Por favor, selecione um arquivo de imagem válido.")`; sem preview |
    soltarArquivo("documento.pdf", "application/pdf", "%PDF-1.4");
    cy.get("@alerta").should("have.been.calledWith", ALERTA_FORMATO);
    areaPreview().should("not.be.visible");

    // | 2 | Tentar upload de EXE | `app.exe` | Mesmo alerta; sem preview |
    cy.get("@alerta").invoke("resetHistory");
    soltarArquivo("app.exe", "application/x-msdownload", "MZ");
    cy.get("@alerta").should("have.been.calledWith", ALERTA_FORMATO);
    areaPreview().should("not.be.visible");

    // | 3 | Tentar upload de TXT | `readme.txt` | Mesmo alerta; sem preview |
    cy.get("@alerta").invoke("resetHistory");
    soltarArquivo("readme.txt", "text/plain", "conteúdo");
    cy.get("@alerta").should("have.been.calledWith", ALERTA_FORMATO);
    areaPreview().should("not.be.visible");

    // | 4 | Upload de PNG válido | `logo.png` | Sem alerta; preview exibido |
    cy.get("@alerta").invoke("resetHistory");
    dropzone().selectFile("cypress/fixtures/images/logo.png", {
      action: "drag-drop",
    });
    cy.get("@alerta").should("not.have.been.called");
    areaPreview().should("be.visible");
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/png/);
    });

    // | 5 | 🐞 Tentar upload de GIF por arraste | `animacao.gif` | Esperado (SDD): rejeitado (apenas PNG, JPG, SVG, WEBP). Atual: **aceito** |
    // DEF-09: comportamento atual; inverter após correção.
    cy.get("@alerta").invoke("resetHistory");
    soltarArquivo("animacao.gif", "image/gif", "GIF89a");
    cy.get("@alerta").should("not.have.been.called");
    areaPreview().should("be.visible");
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/gif/);
    });
  });
});

// #### TC-LOG-004: Validação de Tamanho de Arquivo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Upload de PNG de 2,5 MB | 2.621.440 bytes | `alert("A imagem deve ter no máximo 2 MB.")`; sem preview |
// | 2 | Upload de PNG de exatamente 2 MB | 2.097.152 bytes | Aceito; miniatura exibida (limite é `> 2 MB`) |
// | 3 | Upload de PNG de 1,99 MB | ≈ 2.086.666 bytes | Aceito; miniatura exibida |
// | 4 | Upload de PNG de 2 MB + 1 byte | 2.097.153 bytes | Alerta de tamanho; sem preview |

// **Critério de Aceite:** Arquivos maiores que 2 MB são rejeitados com alerta.

// **Notas Cypress:** gere o conteúdo com `Cypress.Buffer.alloc(tamanho)` e
// `selectFile({ contents, fileName: 'x.png', mimeType: 'image/png' })`. O
// conteúdo não precisa ser um PNG decodificável (a checagem é por `file.type` e
// `file.size`).

describe("TC-LOG-004", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.on("window:alert", cy.stub().as("alerta"));
  });

  it("Validação de Tamanho de Arquivo", () => {
    const MB = 1024 * 1024;
    const enviarPng = (nome, tamanho) =>
      escolherArquivo(nome, "image/png", Cypress.Buffer.alloc(tamanho));

    // | 1 | Upload de PNG de 2,5 MB | 2.621.440 bytes | `alert("A imagem deve ter no máximo 2 MB.")`; sem preview |
    enviarPng("grande.png", 2.5 * MB);
    cy.get("@alerta").should("have.been.calledWith", ALERTA_TAMANHO);
    areaPreview().should("not.be.visible");

    // | 2 | Upload de PNG de exatamente 2 MB | 2.097.152 bytes | Aceito; miniatura exibida (limite é `> 2 MB`) |
    cy.get("@alerta").invoke("resetHistory");
    enviarPng("limite.png", 2 * MB);
    cy.get("@alerta").should("not.have.been.called");
    areaPreview().should("be.visible");
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/png/);
    });

    // | 3 | Upload de PNG de 1,99 MB | ≈ 2.086.666 bytes | Aceito; miniatura exibida |
    cy.get("@alerta").invoke("resetHistory");
    enviarPng("quase.png", 2086666);
    cy.get("@alerta").should("not.have.been.called");
    areaPreview().should("be.visible");

    // | 4 | Upload de PNG de 2 MB + 1 byte | 2.097.153 bytes | Alerta de tamanho; sem preview |
    // Remove a miniatura aceita no passo 3 para isolar o estado "sem preview".
    botaoRemover().click();
    areaPreview().should("not.be.visible");
    cy.get("@alerta").invoke("resetHistory");
    enviarPng("limite-mais-um.png", 2 * MB + 1);
    cy.get("@alerta").should("have.been.calledWith", ALERTA_TAMANHO);
    areaPreview().should("not.be.visible");
  });
});

// #### TC-LOG-005: Inserção de Logo via URL

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Clicar na aba "Inserir link (URL)" | `btn-tab-url` | Painel de URL visível; painel de upload oculto; aba com classe `active` |
// | 2 | Informar URL válida e gerar | `https://exemplo.com/logo.png` (imagem simulada) | `.receipt-logo` com `src` igual à URL |
// | 3 | Informar URL que não carrega e gerar | `https://exemplo.com/404.png` (simulada com 404) | Recibo gerado; a imagem é ocultada (`display: none`, via `onerror`) |
// | 4 | 🐞 Informar texto que não é URL | `logo-exemplo` | Esperado (SDD §3.3): mensagem de erro e prévia no formulário. Atual: sem validação nem prévia; o recibo gera com imagem oculta |

// **Critério de Aceite:** URLs válidas aparecem no recibo; falhas não quebram a
// geração.

// **Notas Cypress:** simule a imagem com
// `cy.intercept('GET', 'https://exemplo.com/logo.png', { fixture: 'logo.png' })`.
// O campo é `type="text"` (o SDD prevê `type="url"`).

describe("TC-LOG-005", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.intercept("GET", LOGO_URL, { fixture: "images/logo.png" }).as("logoOk");
    cy.intercept("GET", LOGO_404, { statusCode: 404 }).as("logo404");
  });

  it("Inserção de Logo via URL", () => {
    // | 1 | Clicar na aba "Inserir link (URL)" | `btn-tab-url` | Painel de URL visível; painel de upload oculto; aba com classe `active` |
    cy.get('[data-testid="btn-tab-url"]').click();
    cy.get("#panelUrl").should("be.visible");
    cy.get("#panelUpload").should("not.be.visible");
    cy.get("#tabUrl").should("have.class", "active");
    cy.get("#tabUpload").should("not.have.class", "active");

    // | 2 | Informar URL válida e gerar | `https://exemplo.com/logo.png` (imagem simulada) | `.receipt-logo` com `src` igual à URL |
    cy.get("#logoUrlInput").type(LOGO_URL);
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.wait("@logoOk");
    cy.get("#receiptContent .receipt-logo").should(($img) => {
      expect($img.attr("src")).to.eq(LOGO_URL);
    });

    // | 3 | Informar URL que não carrega e gerar | `https://exemplo.com/404.png` (simulada com 404) | Recibo gerado; a imagem é ocultada (`display: none`, via `onerror`) |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get("#logoUrlInput").clear().type(LOGO_404);
    cy.gerarRecibo();
    cy.wait("@logo404");
    cy.get("#receiptContent .receipt-logo").should("have.css", "display", "none");

    // | 4 | 🐞 Informar texto que não é URL | `logo-exemplo` | Esperado (SDD §3.3): mensagem de erro e prévia no formulário. Atual: sem validação nem prévia; o recibo gera com imagem oculta |
    // DEF-09: comportamento atual; inverter após correção.
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get("#logoUrlInput").clear().type("logo-exemplo");
    cy.get("#logoUrlErr").should("not.exist");
    areaPreview().should("not.be.visible");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should("have.css", "display", "none");
  });
});

// #### TC-LOG-006: Sanitização de SVG

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Upload de SVG com `<script>` | `logo_maliciosa.svg` | Logo processada; o SVG decodificado do `src` não contém `<script` |
// | 2 | Upload de SVG com `onload` entre aspas duplas | `logo_onload.svg` (`onload="alert(1)"`) | Atributo `onload` removido |
// | 3 | Upload de SVG com `href="javascript:…"` | `logo_js_href.svg` | Atributo `href` removido |
// | 4 | 🐞 Upload de SVG com handler entre aspas simples | `logo_onclick_simples.svg` (`onclick='x()'`) | Esperado: removido. Atual: **mantido** (o sanitizador só trata aspas duplas) |

// **Critério de Aceite:** Elementos potencialmente maliciosos removidos do SVG.

// **Notas Cypress:** decodifique o `src` do `#logoPreviewImg`:
// `Cypress.Buffer.from(src.split(',')[1], 'base64').toString()`. Em `<img>` o SVG
// não executa scripts, mas o arquivo preservado continua inseguro se reutilizado.

describe("TC-LOG-006", () => {
  beforeEach(() => {
    cy.abrirFormulario();
  });

  it("Sanitização de SVG", () => {
    // Garante que o preview já decodifica o SVG recém-carregado (com o marcador
    // único de cada passo).
    const conferirSvg = (marcador, verificar) => {
      previewLogo().should(($img) => {
        const src = $img.attr("src") || "";
        expect(src).to.match(/^data:image\/svg\+xml;base64,/);
        const svg = Cypress.Buffer.from(src.split(",")[1], "base64").toString();
        expect(svg, "marcador do arquivo").to.contain(marcador);
        verificar(svg);
      });
    };

    // | 1 | Upload de SVG com `<script>` | `logo_maliciosa.svg` | Logo processada; o SVG decodificado do `src` não contém `<script` |
    inputLogo().selectFile("cypress/fixtures/images/logo-com-script.svg", {
      force: true,
    });
    previewLogo().should(($img) => {
      const src = $img.attr("src") || "";
      expect(src).to.match(/^data:image\/svg\+xml;base64,/);
      const svg = Cypress.Buffer.from(src.split(",")[1], "base64").toString();
      expect(svg).not.to.contain("<script");
      expect(svg.toLowerCase()).not.to.contain("onload");
      expect(svg.toLowerCase()).not.to.contain("javascript:");
    });

    // | 2 | Upload de SVG com `onload` entre aspas duplas | `logo_onload.svg` (`onload="alert(1)"`) | Atributo `onload` removido |
    escolherArquivo(
      "logo_onload.svg",
      "image/svg+xml",
      '<svg xmlns="http://www.w3.org/2000/svg" id="passo2" onload="alert(1)"><rect width="10" height="10"/></svg>'
    );
    conferirSvg("passo2", (svg) => {
      expect(svg.toLowerCase()).not.to.contain("onload");
    });

    // | 3 | Upload de SVG com `href="javascript:…"` | `logo_js_href.svg` | Atributo `href` removido |
    escolherArquivo(
      "logo_js_href.svg",
      "image/svg+xml",
      '<svg xmlns="http://www.w3.org/2000/svg" id="passo3"><a href="javascript:alert(1)"><rect width="10" height="10"/></a></svg>'
    );
    conferirSvg("passo3", (svg) => {
      expect(svg.toLowerCase()).not.to.contain("javascript:");
    });

    // | 4 | 🐞 Upload de SVG com handler entre aspas simples | `logo_onclick_simples.svg` (`onclick='x()'`) | Esperado: removido. Atual: **mantido** (o sanitizador só trata aspas duplas) |
    // DEF-09: comportamento atual; inverter após correção.
    escolherArquivo(
      "logo_onclick_simples.svg",
      "image/svg+xml",
      "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"passo4\"><rect width=\"10\" height=\"10\" onclick='alert(1)'/></svg>"
    );
    conferirSvg("passo4", (svg) => {
      expect(svg.toLowerCase()).to.contain("onclick='alert(1)'");
    });
  });
});

// #### TC-LOG-007: Alternância entre Abas de Logo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar aba inicial | — | "Enviar do computador" ativa |
// | 2 | Enviar uma logo por arquivo | `logo.png` | Preview exibido |
// | 3 | Alternar para URL e informar uma URL | `https://exemplo.com/logo.png` | Painel de URL visível |
// | 4 | Gerar recibo | — | A logo do recibo é a **URL** (o modo ativo decide) |
// | 5 | Voltar para a aba de upload e gerar | — | A logo do recibo é a do arquivo enviado |
// | 6 | Remover o arquivo e gerar | — | Sem `.receipt-logo` |

// **Critério de Aceite:** A aba ativa define qual logo é usada.

describe("TC-LOG-007", () => {
  beforeEach(() => {
    cy.abrirFormulario();
    cy.intercept("GET", LOGO_URL, { fixture: "images/logo.png" }).as("logoOk");
  });

  it("Alternância entre Abas de Logo", () => {
    // | 1 | Verificar aba inicial | — | "Enviar do computador" ativa |
    cy.get("#tabUpload").should("have.class", "active");
    cy.get("#panelUpload").should("be.visible");
    cy.get("#tabUrl").should("not.have.class", "active");

    // | 2 | Enviar uma logo por arquivo | `logo.png` | Preview exibido |
    inputLogo().selectFile("cypress/fixtures/images/logo.png", {
      force: true,
    });
    areaPreview().should("be.visible");
    previewLogo().should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/png/);
    });

    // | 3 | Alternar para URL e informar uma URL | `https://exemplo.com/logo.png` | Painel de URL visível |
    cy.get('[data-testid="btn-tab-url"]').click();
    cy.get("#panelUrl").should("be.visible");
    cy.get("#panelUpload").should("not.be.visible");
    cy.get("#logoUrlInput").type(LOGO_URL);

    // | 4 | Gerar recibo | — | A logo do recibo é a **URL** (o modo ativo decide) |
    cy.preencherFormulario();
    cy.gerarRecibo();
    cy.wait("@logoOk");
    cy.get("#receiptContent .receipt-logo").should(($img) => {
      expect($img.attr("src")).to.eq(LOGO_URL);
    });

    // | 5 | Voltar para a aba de upload e gerar | — | A logo do recibo é a do arquivo enviado |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get('[data-testid="btn-tab-upload"]').click();
    cy.get("#panelUpload").should("be.visible");
    cy.get("#panelUrl").should("not.be.visible");
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should(($img) => {
      expect($img.attr("src") || "").to.match(/^data:image\/png/);
    });

    // | 6 | Remover o arquivo e gerar | — | Sem `.receipt-logo` |
    cy.get('[data-testid="btn-close-preview"]').click();
    botaoRemover().click();
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should("not.exist");
  });
});

// #### TC-LOG-008: Atributo de Imagem Injetável pela URL da Logo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Na aba de URL, informar um valor com aspas | `x" onerror="window.__xss=1" data-x="` | O valor é tratado como texto: nenhum atributo extra no `<img>` |
// | 2 | Gerar recibo | — | `win.__xss` permanece `undefined` |

// **Critério de Aceite:** Dados do usuário nunca viram atributos HTML executáveis.

// **Notas Cypress:** atual: `resolvedLogo` é interpolado **sem escape** em
// `<img src="${resolvedLogo}">`; o `onerror` injetado **executa** (XSS no próprio
// usuário). Correção: escapar o valor (ou criar o elemento via DOM e atribuir
// `src`).

describe("TC-LOG-008", () => {
  // DEF-09: comportamento esperado; inverter após correção.
  it.skip("Atributo de Imagem Injetável pela URL da Logo (DEF-09)", () => {
    cy.abrirFormulario();
    cy.get('[data-testid="btn-tab-url"]').click();

    // | 1 | Na aba de URL, informar um valor com aspas | `x" onerror="window.__xss=1" data-x="` | O valor é tratado como texto: nenhum atributo extra no `<img>` |
    cy.get("#logoUrlInput").type('x" onerror="window.__xss=1" data-x="');
    cy.preencherFormulario();

    // | 2 | Gerar recibo | — | `win.__xss` permanece `undefined` |
    cy.gerarRecibo();
    cy.get("#receiptContent .receipt-logo").should(($img) => {
      expect($img.attr("onerror")).to.be.undefined;
      expect($img.attr("data-x")).to.be.undefined;
    });
    cy.window().its("__xss").should("be.undefined");
  });
});
