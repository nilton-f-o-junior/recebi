# Progresso da implementação dos testes E2E

Fonte: `docs/TDD_Recebi_Casos_de_Teste.md` (v2.1) e plano em `docs/IMPLEMENTAR_TESTE.md`.
Ambiente: Docker (`cypress/included:16.1.0`), Chrome.

> **Nota de ambiente:** o Chrome 142+ bloqueia subrecursos de origens HTTP que não são
> `localhost` (Local Network Access). Por isso o serviço `cypress` do `docker-compose.yml`
> usa `network_mode: "service:app"` e `CYPRESS_baseUrl=http://localhost:4173`. Não trocar
> por `http://app:4173`: scripts, CSS e imagens falham sem erro visível no Cypress.

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
| 10 | Política de privacidade e segurança | POL 2, SEG 6 | 🚧 Em andamento | — | — | — | 2026-10-28 |
| 11 | Acessibilidade | A11 6 | ⏳ Pendente | — | — | — | — |
| 12 | Impressão e SEO/PWA | IMP 4, SEO 3 | ⏳ Pendente | — | — | — | — |
| 13 | Compatibilidade e responsividade | BRW 7 | ⏳ Pendente | — | — | — | — |

## Resumo

- **Lotes 0 a 9 concluídos** em 2026-10-28: **69 testes ativos passando** e **4 skips intencionais** (`MSK-006`, `SRV-008`, `LOG-008`, `PRE-005`), todos por DEF já mapeados.
- **Lote 10 em andamento** (política de privacidade e segurança). Os casos só entram na contagem depois da execução dupla em Chrome e do commit do lote.
- Cada lote é validado duas vezes em Chrome no Docker antes do commit. O status detalhado de execução e as divergências ficam nas seções abaixo.

## Divergências novas

- **TC-PRE-004:** o TDD pede "existe exatamente 1 `.receipt-wrapper`". O modal de
  preview tem um `.receipt-wrapper` de layout (`#printContainer > .receipt-wrapper`)
  e o recibo gerado tem outro dentro de `#receiptContent`. O teste verifica que há
  exatamente 1 dentro de `#receiptContent`, que é o conteúdo do recibo.

## Casos manuais (🖐)

Nenhum mapeado até o momento.
