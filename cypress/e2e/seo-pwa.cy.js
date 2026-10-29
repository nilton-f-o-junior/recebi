// ## 9. Testes de SEO e PWA

// #### TC-SEO-001: Metadados da Página Inicial

// **Prioridade:** P4 · **Status:** ✅ Automatizável

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Verificar título e descrição | `/` | Título "Recebi — Gerador de Recibos Online Grátis"; `meta[name=description]` preenchida |
// | 2 | Verificar `canonical` | — | `link[rel=canonical]` com `href` definido |
// | 3 | Verificar Open Graph | — | `og:type`, `og:url`, `og:title`, `og:description`, `og:image` presentes |
// | 4 | Verificar Twitter Card | — | `twitter:card` = `summary_large_image` |
// | 5 | Verificar `theme-color` e `manifest` | — | `meta[name=theme-color]` = `#3D95C5`; `link[rel=manifest]` = `/manifest.json` |
// | 6 | Verificar JSON-LD | `script[type="application/ld+json"]` | JSON válido; `@type` = `WebApplication`; `offers.price` = `0`; `priceCurrency` = `BRL` |

// **Critério de Aceite:** Metadados completos e consistentes.

// #### TC-SEO-002: Manifest e Ícones

// **Prioridade:** P4 · **Status:** ✅ Automatizável (passo 1) · 🐞 DEF-13 (passos 2–3)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Ler `/manifest.json` | `cy.request` | `name` e `short_name` = "Recebi"; `start_url` = `/index.html`; `display` = `standalone`; `theme_color` = `#3D95C5` |
// | 2 | 🐞 Requisitar cada ícone do manifest | `assets/icons/icon-192.png`, `assets/icons/icon-512.png` | Status 200 e `content-type` de imagem. Atual: os arquivos **não existem no repositório** |
// | 3 | 🐞 Requisitar a imagem Open Graph | `/assets/og/recebi-og.jpg` | Status 200. Atual: arquivo inexistente no repositório |

// **Critério de Aceite:** Manifest válido, com ícones e imagem social acessíveis.

// #### TC-SEO-003: robots.txt e sitemap.xml

// **Prioridade:** P4 · **Status:** ✅ Automatizável (passos 1–2) · 🐞 DEF-13 (passo 3)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Ler `/robots.txt` | — | Contém `User-agent: *`, `Allow: /src/html/form.html` e a linha `Sitemap:` |
// | 2 | Ler `/sitemap.xml` | — | XML com 3 `<url>`: home, formulário e política de privacidade |
// | 3 | 🐞 Comparar domínios | — | Esperado: o mesmo domínio em `canonical`, `og:url`, JSON-LD, `robots.txt` e `sitemap.xml`. Atual: `canonical`/`og:url`/JSON-LD/`Sitemap:` usam `recebi.com.br`; o `sitemap.xml` lista `recebi-ten.vercel.app` |

// **Critério de Aceite:** Arquivos de indexação consistentes.

describe("TC-SEO-001", () => {
  it("Metadados da Página Inicial", () => {
    cy.visit("/");

    // | 1 | Verificar título e descrição | `/` | Título "Recebi — Gerador de Recibos Online Grátis"; `meta[name=description]` preenchida |
    cy.title().should("eq", "Recebi — Gerador de Recibos Online Grátis");
    cy.get('meta[name="description"]')
      .invoke("attr", "content")
      .should("not.be.empty");

    // | 2 | Verificar `canonical` | — | `link[rel=canonical]` com `href` definido |
    cy.get('link[rel="canonical"]').should(($link) => {
      expect($link.attr("href")).to.be.a("string").and.not.empty;
    });

    // | 3 | Verificar Open Graph | — | `og:type`, `og:url`, `og:title`, `og:description`, `og:image` presentes |
    ["og:type", "og:url", "og:title", "og:description", "og:image"].forEach(
      (propriedade) => {
        cy.get(`meta[property="${propriedade}"]`)
          .invoke("attr", "content")
          .should("not.be.empty");
      }
    );

    // | 4 | Verificar Twitter Card | — | `twitter:card` = `summary_large_image` |
    cy.get('meta[name="twitter:card"]').should(
      "have.attr",
      "content",
      "summary_large_image"
    );

    // | 5 | Verificar `theme-color` e `manifest` | — | `meta[name=theme-color]` = `#3D95C5`; `link[rel=manifest]` = `/manifest.json` |
    cy.get('meta[name="theme-color"]').should(
      "have.attr",
      "content",
      "#3D95C5"
    );
    cy.get('link[rel="manifest"]').should(
      "have.attr",
      "href",
      "/manifest.json"
    );

    // | 6 | Verificar JSON-LD | `script[type="application/ld+json"]` | JSON válido; `@type` = `WebApplication`; `offers.price` = `0`; `priceCurrency` = `BRL` |
    cy.get('script[type="application/ld+json"]').then(($script) => {
      const dados = JSON.parse($script.text());
      expect(dados["@type"]).to.eq("WebApplication");
      expect(String(dados.offers.price)).to.eq("0");
      expect(dados.offers.priceCurrency).to.eq("BRL");
    });
  });
});

describe("TC-SEO-002", () => {
  it("Manifest e Ícones", () => {
    // | 1 | Ler `/manifest.json` | `cy.request` | `name` e `short_name` = "Recebi"; `start_url` = `/index.html`; `display` = `standalone`; `theme_color` = `#3D95C5` |
    cy.request("/manifest.json").then((resposta) => {
      const manifest =
        typeof resposta.body === "string"
          ? JSON.parse(resposta.body)
          : resposta.body;

      expect(manifest.name).to.eq("Recebi");
      expect(manifest.short_name).to.eq("Recebi");
      expect(manifest.start_url).to.eq("/index.html");
      expect(manifest.display).to.eq("standalone");
      expect(manifest.theme_color).to.eq("#3D95C5");
      expect(manifest.icons).to.have.length(2);

      // | 2 | 🐞 Requisitar cada ícone do manifest | `assets/icons/icon-192.png`, `assets/icons/icon-512.png` | Status 200 e `content-type` de imagem. Atual: os arquivos **não existem no repositório** |
      // DEF-13: comportamento atual; inverter após correção.
      manifest.icons.forEach((icone) => {
        cy.request({
          url: `/${icone.src}`,
          failOnStatusCode: false,
        }).then((respostaIcone) => {
          expect(respostaIcone.status, icone.src).to.eq(200);
          expect(
            respostaIcone.headers["content-type"],
            `content-type de ${icone.src}`
          ).to.include("text/html");
        });
      });
    });

    // | 3 | 🐞 Requisitar a imagem Open Graph | `/assets/og/recebi-og.jpg` | Status 200. Atual: arquivo inexistente no repositório |
    // DEF-13: comportamento atual; inverter após correção.
    cy.request({
      url: "/assets/og/recebi-og.jpg",
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.headers["content-type"]).to.include("text/html");
    });
  });
});

describe("TC-SEO-003", () => {
  it("robots.txt e sitemap.xml", () => {
    // | 1 | Ler `/robots.txt` | — | Contém `User-agent: *`, `Allow: /src/html/form.html` e a linha `Sitemap:` |
    cy.request("/robots.txt").then((resposta) => {
      expect(resposta.body).to.include("User-agent: *");
      expect(resposta.body).to.include("Allow: /src/html/form.html");
      expect(resposta.body).to.match(/Sitemap:\s*https?:\/\/\S+/);
    });

    // | 2 | Ler `/sitemap.xml` | — | XML com 3 `<url>`: home, formulário e política de privacidade |
    cy.request("/sitemap.xml").then((resposta) => {
      const xml = new DOMParser().parseFromString(
        resposta.body,
        "application/xml"
      );
      const locais = [...xml.querySelectorAll("url > loc")].map((local) =>
        local.textContent.trim()
      );

      expect(locais).to.have.length(3);
      expect(locais[0]).to.match(/\/$/);
      expect(locais[1]).to.include("/src/html/form.html");
      expect(locais[2]).to.include("/src/html/politica-privacidade.html");
    });

    // | 3 | 🐞 Comparar domínios | — | Esperado: o mesmo domínio em `canonical`, `og:url`, JSON-LD, `robots.txt` e `sitemap.xml`. Atual: `canonical`/`og:url`/JSON-LD/`Sitemap:` usam `recebi.com.br`; o `sitemap.xml` lista `recebi-ten.vercel.app` |
    // DEF-13: comportamento atual; inverter após correção.
    cy.visit("/");
    cy.window().then((win) => {
      const doc = win.document;
      const canonical = doc.querySelector('link[rel="canonical"]').href;
      const ogUrl = doc.querySelector('meta[property="og:url"]').content;
      const jsonLd = JSON.parse(
        doc.querySelector('script[type="application/ld+json"]').textContent
      );

      return cy.request("/robots.txt").then((robots) => {
        const sitemapRobots = robots.body.match(
          /Sitemap:\s*(https?:\/\/\S+)/
        )[1];

        return cy.request("/sitemap.xml").then((sitemap) => {
          const xml = new DOMParser().parseFromString(
            sitemap.body,
            "application/xml"
          );
          const locais = [...xml.querySelectorAll("url > loc")].map((local) =>
            local.textContent.trim()
          );

          expect(new URL(canonical).origin).to.eq("https://recebi.com.br");
          expect(new URL(ogUrl).origin).to.eq("https://recebi.com.br");
          expect(new URL(jsonLd.url).origin).to.eq("https://recebi.com.br");
          expect(new URL(sitemapRobots).origin).to.eq("https://recebi.com.br");

          locais.forEach((local) => {
            expect(new URL(local).origin).to.eq(
              "https://recebi-ten.vercel.app"
            );
          });
        });
      });
    });
  });
});
