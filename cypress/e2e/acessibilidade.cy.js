require("cypress-axe");

// ## 6. Testes de Interface e Acessibilidade

// #### TC-A11-001: Labels Associados aos Campos

// **Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-05) nos passos 1–2 · ✅ passo 3

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Percorrer todos os `input`, `select` e `textarea` visíveis do formulário | — | Cada campo tem um rótulo associado (`element.labels.length ≥ 1`) |
// | 2 | Verificar campos sem rótulo | — | Nenhum campo órfão |
// | 3 | Clicar no rótulo de um campo com `for` | `label[for="clientName"]` | O campo correspondente recebe foco |

// **Critério de Aceite:** WCAG 2.1 — 1.3.1 Info and Relationships.

// **Notas Cypress:** atual — campos **sem** rótulo associado: `input-receipt-type`,
// `input-date`, `input-logo-file`, `input-logo-url`, `input-client-document`,
// `input-beneficiary-document`, `select-establishment-state`,
// `input-establishment-zipcode`, todos os `input-service-name` e
// `input-service-value` (os rótulos da 1ª linha não têm `for`) e o seletor de
// cor `#customColor`. Campos **com** rótulo válido (use no passo 3): `clientName`,
// `clientPhone`, `providerName`, `providerPhone`, `carModel`, `carPlate`,
// `carYear`, `estName`, `estCitySelect`, `estNeighborhood`, `estStreet`,
// `estNumber`, `discountValue`, `observations`, `receiptTemplate`, `privacy`.

describe("TC-A11-001", () => {
  it("Labels Associados aos Campos", () => {
    cy.abrirFormulario();

    // | 1 | Percorrer todos os `input`, `select` e `textarea` visíveis do formulário | — | Cada campo tem um rótulo associado (`element.labels.length ≥ 1`) |
    // | 2 | Verificar campos sem rótulo | — | Nenhum campo órfão |
    // DEF-05: comportamento atual; inverter após correção.
    cy.get("input, select, textarea").then(($campos) => {
      const orfaos = [...$campos]
        .filter((el) => el.type !== "hidden" && el.labels.length === 0)
        .map(
          (el) =>
            el.getAttribute("data-testid") ||
            el.id ||
            el.getAttribute("name") ||
            el.tagName
        )
        .sort();

      expect(orfaos, "campos sem rótulo associado").to.deep.eq(
        [
          "input-receipt-type",
          "input-date",
          "input-logo-file",
          "input-logo-url",
          "input-client-document",
          "input-beneficiary-document",
          "select-establishment-state",
          "input-establishment-zipcode",
          "input-service-name",
          "input-service-value",
          "customColor",
        ].sort()
      );
    });

    // Campos com rótulo válido segundo as notas do TDD.
    [
      "clientName",
      "clientPhone",
      "providerName",
      "providerPhone",
      "carModel",
      "carPlate",
      "carYear",
      "estName",
      "estCitySelect",
      "estNeighborhood",
      "estStreet",
      "estNumber",
      "discountValue",
      "observations",
      "receiptTemplate",
      "privacy",
    ].forEach((id) => {
      cy.get(`#${id}`).then(($campo) => {
        expect($campo[0].labels.length, `label de #${id}`).to.be.gte(1);
      });
    });

    // | 3 | Clicar no rótulo de um campo com `for` | `label[for="clientName"]` | O campo correspondente recebe foco |
    cy.get('label[for="clientName"]').click();
    cy.focused().should("have.attr", "id", "clientName");
  });
});

// #### TC-A11-002: Navegação por Teclado

// **Prioridade:** P2 · **Status:** 🟡 Parcial

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Pressionar Tab a partir do início da página | `cy.press(Cypress.Keys.Tab)` | Primeiro foco em `input-receipt-type` |
// | 2 | Continuar com Tab | — | Ordem lógica: tipo → data (4 paradas no Chromium: segmentos do `type=date` e seletor de calendário) → abas de logo → arquivo de logo → … |
// | 3 | Pressionar Space no checkbox de privacidade | `{ }` | Checkbox alterna |
// | 4 | Pressionar Enter no botão "Gerar Recibo Agora" com o formulário válido | `{enter}` | Preview abre |
// | 5 | Operar um `select` com o teclado | `.select()` | Valor alterado (a abertura da lista com Enter/Alt+↓ é verificação manual 🖐) |

// **Critério de Aceite:** WCAG 2.1 — 2.1.1 Keyboard.

// **Notas Cypress:** `{tab}` no `type()` não move o foco. Alternativas: `cy.press`
// (disponível no Cypress 16.1) ou `cypress-real-events` (`cy.realPress('Tab')`).

describe("TC-A11-002", () => {
  it("Navegação por Teclado", () => {
    cy.abrirFormulario();

    // | 1 | Pressionar Tab a partir do início da página | `cy.press(Cypress.Keys.Tab)` | Primeiro foco em `input-receipt-type` |
    cy.document().then((doc) => doc.body.focus());
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "data-testid", "input-receipt-type");

    // | 2 | Continuar com Tab | — | Ordem lógica: tipo → data (4 paradas no Chromium: segmentos do `type=date` e seletor de calendário) → abas de logo → arquivo de logo → … |
    for (let i = 0; i < 4; i++) {
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.focused().should("have.attr", "data-testid", "input-date");
    }
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "data-testid", "btn-tab-upload");
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "data-testid", "btn-tab-url");
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "data-testid", "input-logo-file");
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "data-testid", "input-client-name");

    // | 3 | Pressionar Space no checkbox de privacidade | `{ }` | Checkbox alterna |
    cy.get('[data-testid="input-privacy"]')
      .focus()
      .should("not.be.checked");
    cy.press(Cypress.Keyboard.Keys.SPACE);
    cy.get('[data-testid="input-privacy"]').should("be.checked");

    // | 4 | Pressionar Enter no botão "Gerar Recibo Agora" com o formulário válido | `{enter}` | Preview abre |
    // `cy.press(ENTER)` não dispara o clique nativo do botão no Chrome; o
    // `type('{enter}')` preserva a tecla Enter e aciona o submit.
    cy.preencherFormulario();
    cy.get('[data-testid="btn-generate"]').type("{enter}");
    cy.get("#printContainer").should("have.class", "visible");

    // | 5 | Operar um `select` com o teclado | `.select()` | Valor alterado (a abertura da lista com Enter/Alt+↓ é verificação manual 🖐) |
    cy.get('[data-testid="btn-close-preview"]').click();
    cy.get("#printContainer").should("not.have.class", "visible");
    cy.get('[data-testid="select-establishment-state"]')
      .focus()
      .select("RJ")
      .should("have.value", "RJ");
    cy.wait("@ibge");
  });
});

// #### TC-A11-003: Contraste de Cores

// **Prioridade:** P3 · **Status:** 🟡 Parcial (axe + inspeção visual)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar texto principal | `--text-primary` `#111827` sobre branco | Contraste ≥ 4,5:1 (medido: 17,74:1) |
// | 2 | Verificar texto secundário | `--text-secondary` `#6b7280` sobre branco | Contraste ≥ 4,5:1 (medido: 4,83:1) |
// | 3 | Verificar texto atenuado e placeholders | `--text-muted` `#9ca3af`; `--text-placeholder` `#d1d5db` | Contraste ≥ 4,5:1 (medido: 2,54:1 e 1,40:1) 🐞 |
// | 4 | Verificar mensagens de erro | `--error` `#ef4444` sobre `#fff5f5` | Contraste ≥ 4,5:1 (medido: 3,52:1; texto de 0,68 rem) 🐞 |

// **Critério de Aceite:** WCAG 2.1 — 1.4.3 Contrast (Minimum).

// **Notas Cypress:** os valores acima são das **cores do tema** (calculadas), não
// de cada elemento; confirme onde são aplicadas como texto com
// `cy.checkA11y(null, { runOnly: ['color-contrast'] })`. Os passos 3 e 4
// provavelmente falharão (DEF-05). O tema escuro **não existe** e foi removido
// deste caso.

describe("TC-A11-003", () => {
  const canal = (valor) => {
    const normalizado = valor / 255;
    return normalizado <= 0.03928
      ? normalizado / 12.92
      : ((normalizado + 0.055) / 1.055) ** 2.4;
  };

  const luminancia = (cor) => {
    const hex = cor.trim().replace("#", "");
    const canais =
      hex.length === 3
        ? [...hex].map((caractere) => parseInt(caractere + caractere, 16))
        : [0, 2, 4].map((indice) => parseInt(hex.slice(indice, indice + 2), 16));
    return (
      0.2126 * canal(canais[0]) +
      0.7152 * canal(canais[1]) +
      0.0722 * canal(canais[2])
    );
  };

  const contraste = (corA, corB) => {
    const a = luminancia(corA);
    const b = luminancia(corB);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  it("Contraste de Cores", () => {
    cy.abrirFormulario();
    cy.injectAxe();

    cy.document().then((doc) => {
      const estilos = getComputedStyle(doc.documentElement);
      const cor = (token) => estilos.getPropertyValue(token).trim();
      const branco = cor("--white");

      const principal = contraste(cor("--text-primary"), branco);
      const secundario = contraste(cor("--text-secondary"), branco);
      const atenuado = contraste(cor("--text-muted"), branco);
      const placeholder = contraste(
        cor("--text-placeholder"),
        cor("--bg-input")
      );
      const erro = contraste(cor("--error"), cor("--error-bg"));

      // | 1 | Verificar texto principal | `--text-primary` `#111827` sobre branco | Contraste ≥ 4,5:1 (medido: 17,74:1) |
      expect(principal).to.be.gte(4.5);
      expect(principal).to.be.closeTo(17.74, 0.05);

      // | 2 | Verificar texto secundário | `--text-secondary` `#6b7280` sobre branco | Contraste ≥ 4,5:1 (medido: 4,83:1) |
      expect(secundario).to.be.gte(4.5);
      expect(secundario).to.be.closeTo(4.83, 0.05);

      // | 3 | Verificar texto atenuado e placeholders | `--text-muted` `#9ca3af`; `--text-placeholder` `#d1d5db` | Contraste ≥ 4,5:1 (medido: 2,54:1 e 1,40:1) 🐞 |
      // | 4 | Verificar mensagens de erro | `--error` `#ef4444` sobre `#fff5f5` | Contraste ≥ 4,5:1 (medido: 3,52:1; texto de 0,68 rem) 🐞 |
      // DEF-05: comportamento atual; inverter após correção.
      expect(atenuado).to.be.below(4.5);
      expect(atenuado).to.be.closeTo(2.54, 0.05);
      expect(placeholder).to.be.below(4.5);
      expect(placeholder).to.be.closeTo(1.4, 0.05);
      expect(erro).to.be.below(4.5);
      expect(erro).to.be.closeTo(3.52, 0.05);
    });

    // Confirma com o axe que há violações de contraste no formulário atual.
    // DEF-05: comportamento atual; inverter após correção.
    let violacoesAxe = [];
    cy.checkA11y(
      null,
      { runOnly: ["color-contrast"] },
      (violacoes) => {
        violacoesAxe = violacoes;
      },
      true
    );
    cy.then(() => {
      expect(violacoesAxe.length, "violações de contraste").to.be.greaterThan(
        0
      );
      const nos = violacoesAxe.flatMap((violacao) => violacao.nodes);
      expect(
        nos.some((no) =>
          (no.any || []).some(
            (verificacao) =>
              verificacao.data && verificacao.data.fgColor === "#9ca3af"
          )
        ),
        "axe detecta texto atenuado (#9ca3af)"
      ).to.be.true;
    });
  });
});

// #### TC-A11-004: Campos Obrigatórios Marcados

// **Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-05) nos passos 1–4 · 🖐 passo 5

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar marcador visual | — | Asterisco (`*`) nos campos obrigatórios (SDD §5.7) |
// | 2 | Verificar `aria-required` | `form [required]` | Todos com `aria-required="true"` |
// | 3 | Verificar `aria-invalid` após erro | Nome `A` e tentar gerar | `#clientName` com `aria-invalid="true"` |
// | 4 | Verificar `aria-describedby` | — | Todo `aria-describedby` aponta para um elemento existente |
// | 5 | Verificar o anúncio por leitor de tela | NVDA/VoiceOver | "obrigatório" após o rótulo |

// **Critério de Aceite:** WCAG 2.1 — 3.3.2 Labels or Instructions.

// **Notas Cypress:** atual — (1) não há asterisco; (2) falta `aria-required` em
// `input-receipt-type`, `input-date`, `input-service-name`,
// `input-service-value` e `input-privacy`; (3) `aria-invalid` nunca é definido;
// (4) `#clientPhone` e `#providerPhone` apontam para `clientPhoneErr` e
// `providerPhoneErr`, que não existem.

describe("TC-A11-004", () => {
  // DEF-05: comportamento esperado; inverter após correção.
  it.skip("Campos Obrigatórios Marcados (DEF-05)", () => {
    cy.abrirFormulario();

    // | 1 | Verificar marcador visual | — | Asterisco (`*`) nos campos obrigatórios (SDD §5.7) |
    cy.get("form [required]").each(($campo) => {
      const id = $campo.attr("id");
      cy.get(`label[for="${id}"]`).should("contain.text", "*");
    });

    // | 2 | Verificar `aria-required` | `form [required]` | Todos com `aria-required="true"` |
    cy.get("form [required]").each(($campo) => {
      expect($campo).to.have.attr("aria-required", "true");
    });

    // | 3 | Verificar `aria-invalid` após erro | Nome `A` e tentar gerar | `#clientName` com `aria-invalid="true"` |
    cy.preencherFormulario({ clientName: "A" });
    cy.get('[data-testid="input-privacy"]').check();
    cy.get('[data-testid="btn-generate"]').click();
    cy.get('[data-testid="input-client-name"]').should(
      "have.attr",
      "aria-invalid",
      "true"
    );

    // | 4 | Verificar `aria-describedby` | — | Todo `aria-describedby` aponta para um elemento existente |
    cy.get("[aria-describedby]").each(($campo) => {
      const ids = $campo.attr("aria-describedby").split(/\s+/);
      ids.forEach((id) => cy.get(`#${id}`).should("exist"));
    });

    // | 5 | Verificar o anúncio por leitor de tela | NVDA/VoiceOver | "obrigatório" após o rótulo |
    // Verificação manual 🖐.
  });
});

// #### TC-A11-005: Gerenciamento de Foco e Anúncios no Preview

// **Prioridade:** P3 · **Status:** ✅ Automatizável

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Gerar um recibo | Massa válida | Foco em "✕ Fechar" |
// | 2 | Verificar a região viva | `#a11yLive` | Atributo `aria-live="polite"`; classe `sr-only`; texto de sucesso |
// | 3 | Verificar o bloqueio do fundo | — | `body.style.overflow` = `hidden` |

// **Critério de Aceite:** SDD §5.7 — Gerenciamento de Modal e Anúncios Dinâmicos.

describe("TC-A11-005", () => {
  it("Gerenciamento de Foco e Anúncios no Preview", () => {
    cy.abrirFormulario();
    cy.preencherFormulario();

    // | 1 | Gerar um recibo | Massa válida | Foco em "✕ Fechar" |
    cy.gerarRecibo();
    cy.get('[data-testid="btn-close-preview"]').should("be.focused");

    // | 2 | Verificar a região viva | `#a11yLive` | Atributo `aria-live="polite"`; classe `sr-only`; texto de sucesso |
    cy.get("#a11yLive")
      .should("have.attr", "aria-live", "polite")
      .and("have.class", "sr-only")
      .and("contain.text", "Recibo gerado com sucesso");

    // | 3 | Verificar o bloqueio do fundo | — | `body.style.overflow` = `hidden` |
    cy.get("body").should(($body) => {
      expect($body[0].style.overflow).to.eq("hidden");
    });
  });
});

// #### TC-A11-006: Idioma e Título das Páginas

// **Prioridade:** P3 · **Status:** 🐞 Defeito conhecido (DEF-05)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar o idioma da home | `/` | `<html lang="pt-BR">` |
// | 2 | Verificar o idioma do formulário | `/src/html/form.html` | `<html lang="pt-BR">` |
// | 3 | Verificar o título do formulário | — | "Recebi — Gerador de Recibo Online" |

// **Critério de Aceite:** WCAG 2.1 — 3.1.1 Language of Page.

// **Notas Cypress:** atual — `form.html` tem `lang="en"` e título
// "recibi - Gerador de Recibo Online" (erro de grafia). A home está correta.

describe("TC-A11-006", () => {
  it("Idioma e Título das Páginas", () => {
    // | 1 | Verificar o idioma da home | `/` | `<html lang="pt-BR">` |
    cy.visit("/");
    cy.get("html").should("have.attr", "lang", "pt-BR");

    // | 2 | Verificar o idioma do formulário | `/src/html/form.html` | `<html lang="pt-BR">` |
    // | 3 | Verificar o título do formulário | — | "Recebi — Gerador de Recibo Online" |
    // DEF-05: comportamento atual; inverter após correção.
    cy.visit("/src/html/form.html");
    cy.get("html").should("have.attr", "lang", "en");
    cy.title().should("eq", "recibi - Gerador de Recibo Online");
  });
});
