# Progresso da implementação dos testes E2E

Fonte: `docs/TDD_Recebi_Casos_de_Teste.md` (v2.1) e plano em `docs/IMPLEMENTAR_TESTE.md`.
Ambiente: Docker (`cypress/included:16.1.0`), Chrome.

> **Nota de ambiente:** o Chrome 142+ bloqueia subrecursos de origens HTTP que não são
> `localhost` (Local Network Access). Por isso o serviço `cypress` do `docker-compose.yml`
> usa `network_mode: "service:app"` e `CYPRESS_baseUrl=http://localhost:4173`. Não trocar
> por `http://app:4173`: scripts, CSS e imagens falham sem erro visível no Cypress.
>
> **Nota do axe:** `cypress-axe@1.7.0` declara peer `^10`–`^15`, mas foi validado com
> Cypress 16.1.0 no Chrome 153. A instalação usou `--legacy-peer-deps`; as versões de
> `cypress-axe` e `axe-core` estão fixadas no `package.json`.

## Lotes

| Lote | Conteúdo | Casos | Status | Implementados | Skip (DEF) | Manuais | Data |
|------|----------|-------|--------|---------------|------------|---------|------|
| 0 | Infraestrutura (config, comandos, fixtures, imagens, scripts) | — | ✅ Concluído | — | — | — | 2026-10-28 |
| 1 | Home e formulário principal | HOM-001/002, FRM-001 a 006 | ✅ Concluído | 8 | — | — | 2026-10-28 |
| 2 | Máscaras | MSK-001 a 006 | ✅ Concluído | 5 | 1 (DEF-07) | — | 2026-10-28 |
| 3 | Cliente, beneficiário e veículo | CLI 5, BEN 4, VEI 4 | ✅ Concluído | 13 | — | — | 2026-10-28 |
| 4 | Informações do recibo e observações | INF 2, OBS 3 | ✅ Concluído | 5 | — | — | 2026-10-28 |
| 5 | Serviços e produtos | SRV 9 | ✅ Concluído | 8 | 1 (DEF-02) | — | 2026-10-28 |
| 6 | Estabelecimento | EST 7 | ✅ Concluído | 7 | — | — | 2026-10-28 |
| 7 | Upload de logo | LOG 8 | ✅ Concluído | 7 | 1 (DEF-09) | — | 2026-10-28 |
| 8 | Geração, preview e personalização | GER 5, PRE 5, PER 3 | ✅ Concluído | 12 | 1 (DEF-11) | — | 2026-10-28 |
| 9 | Validação de campos | VAL 4 | ✅ Concluído | 4 | — | — | 2026-10-28 |
| 10 | Política de privacidade e segurança | POL 2, SEG 6 | ✅ Concluído | 7 | 1 (DEF-01) | — | 2026-10-28 |
| 11 | Acessibilidade | A11 6 | ✅ Concluído | 5 | 1 (DEF-05) | — | 2026-10-28 |
| 12 | Impressão e SEO/PWA | IMP 4, SEO 3 | ✅ Concluído | 6 | — | 1 (IMP-004) | 2026-10-28 |
| 13 | Compatibilidade e responsividade | BRW 7 | ✅ Concluído | 6 | — | 1 (BRW-003) | 2026-10-29 |

## Resumo

- **Lotes 0 a 13 concluídos** em 2026-10-29: **93 testes ativos passando**, **6 skips intencionais** (`MSK-006`, `SRV-008`, `LOG-008`, `PRE-005`, `SEG-002`, `A11-004`), todos por DEF já mapeados, e **2 casos manuais** (IMP-004 e BRW-003). Total: **101 casos cobertos**.
- O lote 13 foi executado duas vezes no Chrome (gate) e uma vez em Firefox e Edge; o fluxo de fumaça passou nos três navegadores. O Safari permanece manual.
- Cada lote é validado duas vezes em Chrome no Docker antes do commit. O status detalhado de execução e as divergências ficam nas seções abaixo.

## Defeitos conhecidos cobertos

- **DEF-01 (TC-SEG-001 / TC-SEG-002):** o ViaCEP recebe o CEP digitado e o IBGE recebe a UF; o repositório não define CSP. Em TC-SEG-001 os passos 1–4 são verificados e o passo 5 fixa o comportamento atual com `// DEF-01: comportamento atual; inverter após correção`; TC-SEG-002 permanece `it.skip` até a política de CSP ser definida.
- **DEF-05 (TC-A11-001 / TC-A11-003 / TC-A11-004 / TC-A11-006):** o formulário tem campos sem `label` associado, contraste abaixo de 4,5:1 em textos atenuados/placeholders/erros, campos obrigatórios sem `aria-required`/`aria-invalid` e `lang="en"` com título grafado incorretamente. TC-A11-001/003/006 fixam o comportamento atual com `// DEF-05: comportamento atual; inverter após correção`; TC-A11-004 permanece `it.skip`.
- **DEF-13 (TC-SEO-002 / TC-SEO-003):** os ícones do manifest e a imagem Open Graph não existem no repositório; o fallback do nginx devolve o `index.html` com status 200 e `content-type: text/html` em vez de imagem. `canonical`, `og:url`, JSON-LD e `robots.txt` usam `recebi.com.br`, enquanto o `sitemap.xml` lista `recebi-ten.vercel.app`. TC-SEO-002/003 fixam o comportamento atual com `// DEF-13: comportamento atual; inverter após correção`.

## Divergências novas

- **TC-IMP-001/002/003:** `Cypress.automation` executa no momento da chamada, não na
  ordem da fila do Cypress. Para emular `print` depois de gerar o recibo, o teste usa
  `cy.then(() => Cypress.automation(...))`; a restauração para `screen` ocorre no
  `afterEach`.
- **DIV-01 (TC-IMP-002/003):** o SDD §5.6 prevê margens de 15 mm, fonte de 11 pt e
  impressão monocromática; o app usa 24 mm no topo/rodapé, corpo de 16 px e **força** as
  cores de destaque com `print-color-adjust: exact`. Os testes fixam o comportamento atual.
- **DIV-02 (TC-BRW-007):** o SDD §5.5 descreve o ponto de quebra do layout em 768 px,
  mas o app usa `max-width: 640px`. O teste fixa o comportamento atual e verifica as
  grades em 768, 640 e 641 px.
- **TC-A11-002:** `cy.press(ENTER)` no botão focado não dispara o clique nativo no Chrome
  153. O teste usa `type("{enter}")`, mantendo a tecla Enter, e registra a limitação.
- **TC-A11-003:** além dos tokens previstos no TDD, o axe também aponta contraste de
  `--accent` (`#3d95c5`, 3,33:1) em títulos de seção e abas. O teste valida os tokens
  documentados e usa o axe apenas para confirmar que há violações atuais; o accent não
  é cobrado individualmente.
- **TC-PRE-004:** o TDD pede "existe exatamente 1 `.receipt-wrapper`". O modal de
  preview tem um `.receipt-wrapper` de layout (`#printContainer > .receipt-wrapper`)
  e o recibo gerado tem outro dentro de `#receiptContent`. O teste verifica que há
  exatamente 1 dentro de `#receiptContent`, que é o conteúdo do recibo.

## Casos manuais (🖐)

- **TC-IMP-004 (Salvar como PDF):** o diálogo nativo de impressão e o arquivo PDF não
  são controláveis pelo Cypress. O caso permanece `it.skip` com a tabela do TDD e os
  5 passos manuais.
- **TC-BRW-003 (Compatibilidade Safari):** o Safari não está disponível na imagem
  `cypress/included`. O caso permanece `it.skip` com a tabela do TDD e os 4 passos
  manuais (abrir, simular impressão, preencher/gerar e usar os controles de data/cor).
