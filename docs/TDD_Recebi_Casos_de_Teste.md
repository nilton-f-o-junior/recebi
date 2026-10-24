# Plano de Testes — Sistema Recebi

**Versão do Documento:** 2.0
**Data de Atualização:** Outubro 2026
**Sistema:** Recebi — Gerador de Recibos Online
**Tipo:** Aplicação Web Client-Side (HTML/CSS/JS puro, sem build)
**Ferramenta de automação:** Cypress 15 (E2E)
**Critério de Qualidade:** ISO 29119 / IEEE 829

> **O que mudou em relação à v1.0.** A v1.0 foi escrita a partir do SDD, antes da implementação. A v2.0 foi reescrita a partir do **comportamento real da aplicação**, verificado no código-fonte e executado em Chromium. Os resultados esperados agora descrevem o que o app faz; quando o app diverge do SDD, o caso é marcado como **defeito conhecido (DEF-xx)** e listado na [seção 10](#10-defeitos-conhecidos-e-pendências). Também foram corrigidos dados de teste inválidos (CPF/CNPJ), adicionados os módulos que não existiam (Home, Preview, Personalização, Política de Privacidade, SEO/PWA) e incluídas dicas de implementação em Cypress.

---

## Índice

1. [Introdução e Objetivos](#1-introdução-e-objetivos)
2. [Escopo dos Testes](#2-escopo-dos-testes)
3. [Abordagem de Testes e Convenções para Cypress](#3-abordagem-de-testes-e-convenções-para-cypress)
4. [Casos de Teste por Módulo](#4-casos-de-teste-por-módulo)
   - 4.1 [Formulário Principal](#41-módulo-formulário-principal) (TC-FRM)
   - 4.2 [Informações do Recibo](#42-módulo-informações-do-recibo) (TC-INF)
   - 4.3 [Upload de Logo](#43-módulo-upload-de-logo) (TC-LOG)
   - 4.4 [Dados do Cliente](#44-módulo-dados-do-cliente) (TC-CLI)
   - 4.5 [Dados do Beneficiário](#45-módulo-dados-do-beneficiário) (TC-BEN)
   - 4.6 [Dados do Veículo](#46-módulo-dados-do-veículo) (TC-VEI)
   - 4.7 [Dados do Estabelecimento](#47-módulo-dados-do-estabelecimento) (TC-EST)
   - 4.8 [Serviços e Produtos](#48-módulo-serviços-e-produtos) (TC-SRV)
   - 4.9 [Observações](#49-módulo-observações) (TC-OBS)
   - 4.10 [Geração do Recibo](#410-módulo-geração-do-recibo) (TC-GER)
   - 4.11 [Validação de Campos](#411-módulo-validação-de-campos) (TC-VAL)
   - 4.12 [Máscaras de Input](#412-módulo-máscaras-de-input) (TC-MSK)
   - 4.13 [Página Inicial](#413-módulo-página-inicial) (TC-HOM)
   - 4.14 [Preview e Impressão do Recibo](#414-módulo-preview-e-impressão-do-recibo) (TC-PRE)
   - 4.15 [Personalização do Recibo](#415-módulo-personalização-do-recibo) (TC-PER)
   - 4.16 [Política de Privacidade](#416-módulo-política-de-privacidade) (TC-POL)
5. [Testes de Segurança e Privacidade](#5-testes-de-segurança-e-privacidade)
6. [Testes de Interface e Acessibilidade](#6-testes-de-interface-e-acessibilidade)
7. [Testes de Impressão e PDF](#7-testes-de-impressão-e-pdf)
8. [Testes de Navegadores e Dispositivos](#8-testes-de-navegadores-e-dispositivos)
9. [Testes de SEO e PWA](#9-testes-de-seo-e-pwa)
10. [Defeitos Conhecidos e Pendências](#10-defeitos-conhecidos-e-pendências)
11. [Critérios de Aceite](#11-critérios-de-aceite)
12. [Histórico de Revisões](#12-histórico-de-revisões)
- [Apêndice A — Massa de Dados](#apêndice-a--massa-de-dados)
- [Apêndice B — Mapa de Seletores](#apêndice-b--mapa-de-seletores)
- [Apêndice C — Comandos Cypress de Apoio](#apêndice-c--comandos-cypress-de-apoio)
- [Apêndice D — Estrutura de Arquivos de Teste](#apêndice-d--estrutura-de-arquivos-de-teste)

---

## 1. Introdução e Objetivos

### 1.1 Propósito

Este documento apresenta o plano detalhado de casos de teste do sistema **Recebi**, uma aplicação web client-side para geração de recibos, orçamentos, ordens de serviço e comprovantes de pagamento. Ele serve de fonte única para escrever os testes automatizados em Cypress: cada caso (`TC-XXX-NNN`) corresponde a um `describe` e cada tabela de passos é copiada como comentário acima do código correspondente.

### 1.2 Objetivos dos Testes

| Objetivo | Descrição |
|----------|-----------|
| Verificação Funcional | Assegurar que as funcionalidades se comportam como descrito neste plano |
| Validação de Regras de Negócio | Confirmar validações (CPF/CNPJ, celular, CEP, ano) e regras de campos obrigatórios/opcionais |
| Segurança e Privacidade | Garantir que dados do usuário não são enviados, persistidos nem executados como código |
| Usabilidade e Acessibilidade | Verificar teclado, rótulos, ARIA e comportamento responsivo |
| Compatibilidade | Confirmar funcionamento em múltiplos navegadores e dispositivos |
| Impressão/PDF | Validar o CSS de impressão e o fluxo de impressão |
| Rastreabilidade com o SDD | Registrar onde a implementação diverge da especificação (defeitos conhecidos) |

### 1.3 Critérios de Entrada

- [ ] SDD (`docs/SDD_RECEBI.md`) disponível como referência
- [ ] Dependências instaladas (`npm install`) e Cypress abrindo (`npx cypress open`)
- [ ] `baseUrl` configurado em `cypress.config.js` (produção por padrão; sobrescrevível com `CYPRESS_BASE_URL`)
- [ ] Massa de dados do [Apêndice A](#apêndice-a--massa-de-dados) criada como fixture
- [ ] Comandos de apoio do [Apêndice C](#apêndice-c--comandos-cypress-de-apoio) em `cypress/support/commands.js`
- [ ] Navegadores de teste instalados (Chrome, Firefox, Edge; Safari quando aplicável)

---

## 2. Escopo dos Testes

### 2.1 Escopo Incluído

| Área | Módulos | Prioridade |
|------|---------|------------|
| Funcionalidade Core | Formulário, Geração de Recibo, Validação, Preview | Alta |
| Entrada de Dados | Logo, Cliente, Beneficiário, Veículo, Estabelecimento | Alta |
| Cálculos | Serviços/Produtos, Desconto, Total | Alta |
| Interface | Layout, Responsividade, Acessibilidade, Home | Média |
| Impressão | Preview, CSS `@media print`, título do arquivo, PDF | Alta |
| Segurança | Requisições de rede, XSS, SVG, armazenamento, CSP | Alta |
| Conteúdo estático | Política de Privacidade, SEO, manifest | Baixa |

### 2.2 Escopo Excluído

| Área | Motivo |
|------|--------|
| Backend/API próprios | Sistema é 100% client-side |
| Banco de Dados | Não há persistência de dados |
| Autenticação | Sistema não requer login |
| Service Worker / offline | Não implementado (não há `serviceWorker` no código) |
| Tema escuro | Não implementado (não há CSS de tema escuro) |
| APIs de terceiros (IBGE, ViaCEP) | Disponibilidade externa; **sempre simuladas com `cy.intercept`** nos testes |
| Diálogo nativo de impressão / arquivo PDF | Não automatizável em Cypress; cobertos por teste manual (🖐) |

---

## 3. Abordagem de Testes e Convenções para Cypress

### 3.1 Tipos de Teste Aplicados

| Tipo de Teste | Aplicação no Recebi |
|---------------|---------------------|
| Teste Funcional E2E | Fluxo completo: formulário → validação → geração → preview |
| Teste de Regras de Entrada | Máscaras, validadores de CPF/CNPJ, celular, CEP, ano |
| Teste de Integração (com mocks) | Carregamento de cidades (IBGE) e busca de CEP (ViaCEP) |
| Teste de Regressão | Execução completa a cada alteração |
| Teste de Acessibilidade | Rótulos, ARIA, teclado, foco |
| Teste Cross-Browser | `--browser chrome/firefox/edge` |
| Teste de Responsividade | `cy.viewport()` |
| Teste de Impressão | Emulação de `@media print` (Chromium) + verificação manual |

### 3.2 Ambiente de Teste

| Componente | Especificação |
|------------|---------------|
| Aplicação | `https://recebi-ten.vercel.app` (padrão) ou `http://localhost:<porta>` servindo a **raiz do repositório** (o app usa caminhos absolutos como `/src/html/form.html`) |
| Cypress | 15.x; `baseUrl` em `cypress.config.js` |
| Chrome / Edge / Firefox | Versão estável atual |
| Safari / iOS / Android | Verificação manual (ou WebKit experimental) |
| Fuso horário | Os testes de data devem calcular a data **local**, nunca fixar valores |

### 3.3 Legenda de Prioridade e Status

| Prioridade | Descrição | Meta |
|------------|-----------|------|
| P1 — Crítica | Funcionalidade core, impede o uso | 100% devem passar |
| P2 — Alta | Funcionalidade importante | > 95% |
| P3 — Média | Melhoria de UX | > 80% |
| P4 — Baixa | Funcionalidade secundária | > 60% |

| Status | Significado |
|--------|-------------|
| ✅ Automatizável | Pode ser escrito em Cypress como descrito |
| 🟡 Parcial | Parte automatizável, parte manual (indicado nas notas) |
| 🖐 Manual | Não automatizável (diálogo do SO, navegador específico, avaliação visual) |
| 🐞 Defeito conhecido | O app diverge do esperado (ver DEF-xx). A tabela traz o comportamento **esperado**; a nota traz o **comportamento atual**. Escreva com `it.skip` até a correção ou assegure o comportamento atual em um teste separado |

### 3.4 Convenções para Cypress

**1. Visite o formulário diretamente.** Exceto em TC-HOM e TC-FRM-004, use `cy.visit('/src/html/form.html')` (via `cy.abrirFormulario()`), sem passar pela home.

**2. Validação nativa do navegador vem primeiro.** O `<form>` não tem `novalidate`. Campos `required` vazios, `step` inválido e `type=number` com texto **impedem o `submit`** antes do código do app rodar. Consequências para os testes:
- Para campo vazio, **não** espere mensagem do app: verifique `cy.get(sel).should('match', ':invalid')` ou `$el[0].checkValidity() === false`, e que `#printContainer` **não** ficou visível.
- As validações do app (mensagens, `.field-invalid`, scroll e foco) só rodam quando o campo está **preenchido, porém inválido** (ex.: nome `"A"`, ano `"1800"`, CEP `"01310"`, celular `"(99) 9988-88"`).
- Ao clicar em "Gerar Recibo Agora" com campo `required` vazio, o navegador foca o primeiro campo inválido (na ordem do DOM).

**3. O botão "Gerar" nasce desabilitado.** Marque `input-privacy` antes de clicar. Ele fica habilitado **somente** pelo checkbox, não pelo preenchimento do formulário.

**4. APIs externas sempre simuladas.** Selecionar um estado chama o IBGE; sair do campo CEP com 8 dígitos chama o ViaCEP. Use `cy.mockLocalidades()` e `cy.mockViaCep()` (Apêndice C) e aguarde com `cy.wait('@ibge')` / `cy.wait('@viacep')`. A Google Fonts também gera requisições, mas não afeta os testes.

**5. `window.print` e `alert`.**
- `window.print` é chamado **somente** ao clicar em `btn-print-receipt`. Use `cy.stub(win, 'print')` em `onBeforeLoad` (já feito por `cy.abrirFormulario()`).
- Erros de upload de logo saem por `alert()`. Use `cy.on('window:alert', cy.stub().as('alert'))` **antes** da ação.

**6. Texto em maiúsculas é CSS.** `.receipt-type` e vários rótulos do recibo usam `text-transform: uppercase`. O DOM guarda `"Ordem de Serviço"`. Use `.should('have.text', 'Ordem de Serviço')` e, se quiser, `.should('have.css', 'text-transform', 'uppercase')`.

**7. Datas.** O campo de data é `type=date` (valor `AAAA-MM-DD`). No recibo, a data sai em **`dd/mm/aaaa`** (ex.: `15/01/2020`). Calcule a data local com `new Date()` (`getFullYear/getMonth/getDate`), não com `toISOString()` (ver DEF-04).

**8. Upload.** Use `cy.get('[data-testid="input-logo-file"]').selectFile(arquivo, { force: true })` (seleção) e `selectFile(arquivo, { action: 'drag-drop' })` sobre `dropzone-logo` (arrastar). O `<input type=file>` fica sobreposto à dropzone.

**9. Cor e data por `invoke`.** Para `input[type=color]`: `.invoke('val', '#ff0000').trigger('input')`. Para `type=date`: `.clear().type('2020-01-15')`.

**10. Teclado.** `{tab}` no `type()` não move o foco. Para ordem de tabulação use `cy.press(Cypress.Keys.Tab)` (Cypress ≥ 14.3; confira na documentação da sua versão) ou o plugin `cypress-real-events`. O `input[type=date]` consome vários Tabs (dia, mês, ano).

**11. `@media print`.** Só é emulável em navegadores Chromium, via CDP:
`Cypress.automation('remote:debugger:protocol', { command: 'Emulation.setEmulatedMedia', params: { media: 'print' } })`. Restaure com `media: 'screen'` ao final do teste.

**12. Padrão de comentário.** Cada `describe('TC-XXX-NNN')` traz a tabela do TDD comentada, e cada passo é comentado com a linha da tabela acima do código:

```js
// | 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo" está desabilitado |
cy.get('[data-testid="btn-generate"]').should('be.disabled')
```

### 3.5 Comportamento Geral Relevante da Aplicação

| Tema | Comportamento (verificado) |
|------|---------------------------|
| Campos obrigatórios (`required`) | Tipo do recibo, data, nome/celular do cliente, nome/celular do beneficiário, modelo/placa/ano do veículo, nome/bairro/CEP/rua/número do estabelecimento, descrição e valor de **cada** linha de serviço, checkbox de privacidade |
| Obrigatórios por validação do app (não `required` nativo) | Estado e cidade (foco no select, sem mensagem) |
| Opcionais | Logo, CPF/CNPJ (cliente e beneficiário), observações, desconto |
| Persistência | Nenhuma: sem `localStorage`, `sessionStorage` nem cookies; os dados somem ao recarregar |
| Rede | Apenas IBGE (cidades) e ViaCEP (CEP) sob ação do usuário, mais Google Fonts |
| Barra de progresso | `#stepFill` mostra `preenchidos / inputs required`; o checkbox de privacidade **sempre** conta como preenchido (valor `"on"`); nasce em `17,6471%` |
| Preview | O recibo abre em um overlay (`#printContainer.visible`); o formulário permanece no DOM com os dados |

---
## 4. Casos de Teste por Módulo

> **Como ler as tabelas.** A coluna "Resultado Esperado" traz o comportamento **correto**. Quando o app diverge, o passo é marcado com 🐞 e a nota do caso informa o **comportamento atual**. Dados de teste citados (CPF, CNPJ etc.) estão no [Apêndice A](#apêndice-a--massa-de-dados). Seletores estão no [Apêndice B](#apêndice-b--mapa-de-seletores).

### 4.1 Módulo: Formulário Principal

**Arquivo de teste:** `cypress/e2e/modules/form.cy.js`

#### TC-FRM-001: Carregamento Inicial do Formulário

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir o formulário no navegador | `/src/html/form.html` (via `baseUrl`) | Página carrega completamente (`document.readyState` = `complete`) |
| 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
| 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo Agora" está desabilitado |
| 4 | Verificar estado do checkbox | — | Checkbox de privacidade está desmarcado |
| 5 | Verificar quantidade de linhas de serviço | — | 1 linha de serviço pré-adicionada |
| 6 | Verificar data de emissão | — | Campo pré-preenchido com a data local atual (`AAAA-MM-DD`) |
| 7 | Verificar tipo do recibo | — | Campo pré-preenchido com "Recibo de Pagamento" |
| 8 | Verificar select de cidade | — | Desabilitado, exibindo "Selecione o estado primeiro" |
| 9 | Verificar painel de logo | — | Aba "Enviar do computador" ativa; painel de URL oculto |
| 10 | Verificar preview | — | `#printContainer` não está visível |

**Critério de Aceite:** Página carrega, todos os elementos visíveis, estado inicial correto.

**Notas Cypress:**
- Campos do passo 2: `input-receipt-type`, `input-date`, `input-client-*`, `input-beneficiary-*`, `input-vehicle-*`, `input-establishment-*`, `select-establishment-state`, `select-establishment-city` (visível mas desabilitado), `input-service-name`, `input-service-value`, `input-observations`.
- Passo 6: calcule a data local com `new Date()` (`getFullYear/getMonth/getDate`, com `padStart`). O app usa `toISOString()` (UTC), então após as 21h em UTC-3 a data fica um dia adiantada. 🐞 DEF-04: se o teste rodar à noite no Brasil, ele falha corretamente.

#### TC-FRM-002: Habilitação do Botão ao Marcar Privacidade

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Localizar checkbox de privacidade | — | Checkbox visível e desmarcado; botão desabilitado |
| 2 | Clicar no checkbox | — | Checkbox marcado e botão **habilitado** |
| 3 | Clicar em "Gerar Recibo Agora" com campos obrigatórios vazios | Formulário apenas com valores iniciais | Preview não abre; o navegador foca o primeiro campo inválido (`input-client-name`) |
| 4 | Desmarcar o checkbox | — | Botão volta a ficar desabilitado |
| 5 | Preencher todos os campos obrigatórios e marcar o checkbox | Massa válida (Apêndice A) | Botão habilitado e clicável |

**Critério de Aceite:** O botão é habilitado **exclusivamente** pelo checkbox. A obrigatoriedade dos campos é verificada no clique (validação nativa + validação do app), não no estado do botão.

**Notas Cypress:** a versão 1.0 afirmava que o botão ficava desabilitado até os campos serem válidos. O app não faz isso (`updateSubmitState` olha só o checkbox).

#### TC-FRM-003: Submissão de Formulário Válido

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher dados mínimos obrigatórios | Massa válida (Apêndice A) | Formulário completo |
| 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
| 3 | Clicar em "Gerar Recibo Agora" | — | Preview abre (`#printContainer` com classe `visible`); `window.print` **não** foi chamado |
| 4 | Verificar renderização | — | Existe exatamente 1 `.receipt-wrapper` dentro de `#receiptContent` |
| 5 | Verificar botão do formulário | — | Texto volta a "Gerar Recibo Agora" e botão habilitado |
| 6 | Verificar foco e anúncio | — | Foco no botão "✕ Fechar"; `#a11yLive` contém "Recibo gerado com sucesso…" |
| 7 | Clicar em "🖨️ Imprimir / Salvar PDF" | — | `window.print` chamado 1 vez |

**Critério de Aceite:** Recibo gerado e exibido em preview; o diálogo de impressão só abre ao clicar no botão de impressão.

**Notas Cypress:**
- O texto "Gerando…" e o estado desabilitado existem apenas durante a execução síncrona de `handleFormSubmit` e são revertidos no `finally`; **não são observáveis** pelo Cypress. Não escreva asserção de spinner/loading (DIV-07).
- Passo 7 depende do stub de `window.print` (`cy.abrirFormulario()`): `cy.get('@print').should('have.been.calledOnce')`.

#### TC-FRM-004: Redirecionamento para GitHub do Projeto

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a página inicial | `/` | Página carrega |
| 2 | Localizar o ícone do GitHub no cabeçalho | `header a[aria-label="Ver código-fonte no GitHub"]` | Ícone visível |
| 3 | Verificar atributos do link | — | `href` = `https://github.com/nilton-f-o-junior/recebi` e `target` = `_blank` |

**Critério de Aceite:** O link aponta para o repositório oficial e abre em nova aba.

**Notas Cypress:** o ícone está na **home** (`index.html`), não no formulário. Não clique: o Cypress não acompanha nova aba. Verifique os atributos. Sugestão: adicionar `data-testid="link-github"`.

#### TC-FRM-005: Validação Nativa de Campos Obrigatórios

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Marcar o checkbox com o formulário vazio | — | Botão habilitado |
| 2 | Clicar em "Gerar Recibo Agora" | — | Preview **não** abre |
| 3 | Contar campos inválidos | `form :invalid` | 14 campos inválidos (celulares, nomes, modelo, placa, ano, estabelecimento, bairro, CEP, rua, número, descrição e valor do serviço) |
| 4 | Verificar foco | — | O primeiro campo inválido (`input-client-name`) recebe foco |
| 5 | Preencher somente o nome do cliente e tentar de novo | `João Silva` | O primeiro campo inválido passa a ser `input-client-phone` |

**Critério de Aceite:** Nenhum recibo é gerado com campo obrigatório vazio.

**Notas Cypress:** `cy.get('form :invalid').should('have.length', 14)` e `cy.focused().should('have.attr', 'data-testid', 'input-client-name')`. Selects de estado e cidade **não** entram na contagem (não têm `required`; ver TC-EST-007).

#### TC-FRM-006: Barra de Progresso do Formulário

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar largura inicial de `#stepFill` | — | ≈ 17,65% (3 de 17 campos `required`: tipo, data e checkbox) |
| 2 | Preencher o nome do cliente | `João Silva` | ≈ 23,53% |
| 3 | Preencher todos os demais obrigatórios | Massa válida | 100% |
| 4 | Apagar o nome do cliente | — | Largura menor que 100% |

**Critério de Aceite:** A barra cresce conforme os obrigatórios são preenchidos.

**Notas Cypress:** compare com tolerância (`parseFloat(width)` com `closeTo`). 🐞 DEF-14: o checkbox de privacidade conta sempre como preenchido (seu valor é `"on"`), e adicionar uma linha de serviço vazia não recalcula a barra até que haja digitação.

---

### 4.2 Módulo: Informações do Recibo

**Arquivo de teste:** `cypress/e2e/modules/info-recibo.cy.js`

#### TC-INF-001: Seleção de Tipo de Recibo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar valor inicial | — | Campo de **texto livre** com "Recibo de Pagamento" |
| 2 | Alterar para "Orçamento" e gerar | `Orçamento` | `.receipt-type` contém "Orçamento" (exibido em maiúsculas por CSS) |
| 3 | Alterar para "Ordem de Serviço" e gerar | `Ordem de Serviço` | `.receipt-type` contém "Ordem de Serviço" |
| 4 | Alterar para "Comprovante de Pagamento" e gerar | `Comprovante de Pagamento` | `.receipt-type` contém "Comprovante de Pagamento" |
| 5 | Gerar no modelo detalhado | Modelo "Modelo Detalhado" | O tipo aparece como título principal (`.receipt-est-name`, `h1`) |
| 6 | Apagar o campo e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |

**Critério de Aceite:** O texto do campo vira o título do documento.

**Notas Cypress:** a versão 1.0 previa um select com 4 opções e a mensagem "Selecione o tipo de documento". O app (e o SDD §3.2) usam campo de texto livre. Use `.should('have.text', …)` e `.should('have.css', 'text-transform', 'uppercase')` para o efeito visual.

#### TC-INF-002: Data de Emissão

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–4) · 🐞 DEF-15 (passos 2–3, formato)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar valor inicial | — | Data atual pré-preenchida (`AAAA-MM-DD`) |
| 2 | Alterar para data passada e gerar | `2020-01-15` | 🐞 Esperado (SDD): "15 de janeiro de 2020". Atual: `15/01/2020` em `.receipt-date-value` |
| 3 | Alterar para data futura e gerar | `2030-06-20` | 🐞 Esperado (SDD): "20 de junho de 2030". Atual: `20/06/2030` |
| 4 | Apagar a data e tentar gerar | `` (vazio) | Campo `:invalid`; preview não abre |
| 5 | Gerar no modelo detalhado | `2020-01-15` | A linha "Data de Emissão" exibe a mesma data |

**Critério de Aceite:** Data formatada corretamente no recibo.

**Notas Cypress:** o SDD §3.2 pede a data por extenso. A função `Utils.formatDateLong` existe, mas o recibo usa `toLocaleDateString("pt-BR")`. Escreva o teste para o formato atual (`dd/mm/aaaa`) **ou** `it.skip` para o formato do SDD até haver decisão.

---

### 4.3 Módulo: Upload de Logo

**Arquivo de teste:** `cypress/e2e/modules/upload-logo.cy.js`

> Gere os arquivos de imagem em `cypress/fixtures/` (um PNG pequeno, um JPG e SVGs de teste) ou em memória com `selectFile({ contents: Cypress.Buffer.from(...), fileName, mimeType })`.

#### TC-LOG-001: Upload de Imagem via Drag and Drop

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar estado inicial da dropzone | — | Placeholder "Clique aqui ou arraste a imagem" visível; preview oculto |
| 2 | Arrastar sobre a dropzone | evento `dragover` | Classe `drag-over` aplicada à dropzone |
| 3 | Soltar arquivo PNG válido | `logo.png` (< 2 MB) | Miniatura em `#logoPreviewImg` com `src` `data:image/png…`; dropzone com `has-image`; placeholder oculto |
| 4 | Verificar botão "Remover imagem" | — | `btn-remove-logo` visível |
| 5 | Clicar em "Remover imagem" | — | Placeholder volta; preview oculto; sem `has-image`; `input-logo-file` vazio |

**Critério de Aceite:** Upload por arraste funciona, preview exibido e remoção restaura o estado inicial.

**Notas Cypress:** `cy.get('[data-testid="dropzone-logo"]').selectFile('cypress/fixtures/logo.png', { action: 'drag-drop' })`. A classe `drag-over` é verificada com `.trigger('dragover')` antes do soltar.

#### TC-LOG-002: Upload de Imagem via Clique

**Prioridade:** P2 · **Status:** 🟡 Parcial (o seletor de arquivos do SO é manual)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar o input de arquivo | `input-logo-file` | Existe, com `accept` = `image/png,image/jpeg,image/webp,image/svg+xml` |
| 2 | Selecionar arquivo JPG válido | `logo.jpg` (1 MB) | Miniatura exibida |
| 3 | Gerar recibo com logo | Massa válida | `.receipt-logo` presente, `src` começando com `data:image/jpeg` |
| 4 | Remover a logo e gerar novamente | — | Nenhum `.receipt-logo` no recibo |

**Critério de Aceite:** Arquivo carregado e logo impressa no documento.

**Notas Cypress:** `selectFile(..., { force: true })` no input. A abertura do seletor nativo de arquivos não é automatizável 🖐.

#### TC-LOG-003: Validação de Formato de Arquivo

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–4) · 🐞 DEF-09 (passo 5)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Tentar upload de PDF | `documento.pdf` (`application/pdf`) | `alert("Por favor, selecione um arquivo de imagem válido.")`; sem preview |
| 2 | Tentar upload de EXE | `app.exe` | Mesmo alerta; sem preview |
| 3 | Tentar upload de TXT | `readme.txt` | Mesmo alerta; sem preview |
| 4 | Upload de PNG válido | `logo.png` | Sem alerta; preview exibido |
| 5 | 🐞 Tentar upload de GIF por arraste | `animacao.gif` | Esperado (SDD): rejeitado (apenas PNG, JPG, SVG, WEBP). Atual: **aceito** |

**Critério de Aceite:** Arquivos que não são imagem são rejeitados com alerta.

**Notas Cypress:** `cy.on('window:alert', cy.stub().as('alert'))` antes do `selectFile`; verifique `'@alert'` com `calledWith`. O filtro `accept` só vale para o seletor; a validação do código é `file.type.startsWith("image/")`. A mensagem **não** é "Formato não suportado".

#### TC-LOG-004: Validação de Tamanho de Arquivo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Upload de PNG de 2,5 MB | 2.621.440 bytes | `alert("A imagem deve ter no máximo 2 MB.")`; sem preview |
| 2 | Upload de PNG de exatamente 2 MB | 2.097.152 bytes | Aceito; miniatura exibida (limite é `> 2 MB`) |
| 3 | Upload de PNG de 1,99 MB | ≈ 2.086.666 bytes | Aceito; miniatura exibida |
| 4 | Upload de PNG de 2 MB + 1 byte | 2.097.153 bytes | Alerta de tamanho; sem preview |

**Critério de Aceite:** Arquivos maiores que 2 MB são rejeitados com alerta.

**Notas Cypress:** gere o conteúdo com `Cypress.Buffer.alloc(tamanho)` e `selectFile({ contents, fileName: 'x.png', mimeType: 'image/png' })`. O conteúdo não precisa ser um PNG decodificável (a checagem é por `file.type` e `file.size`).

#### TC-LOG-005: Inserção de Logo via URL

**Prioridade:** P3 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-09 (passo 4)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Clicar na aba "Inserir link (URL)" | `btn-tab-url` | Painel de URL visível; painel de upload oculto; aba com classe `active` |
| 2 | Informar URL válida e gerar | `https://exemplo.com/logo.png` (imagem simulada) | `.receipt-logo` com `src` igual à URL |
| 3 | Informar URL que não carrega e gerar | `https://exemplo.com/404.png` (simulada com 404) | Recibo gerado; a imagem é ocultada (`display: none`, via `onerror`) |
| 4 | 🐞 Informar texto que não é URL | `logo-exemplo` | Esperado (SDD §3.3): mensagem de erro e prévia no formulário. Atual: sem validação nem prévia; o recibo gera com imagem oculta |

**Critério de Aceite:** URLs válidas aparecem no recibo; falhas não quebram a geração.

**Notas Cypress:** simule a imagem com `cy.intercept('GET', 'https://exemplo.com/logo.png', { fixture: 'logo.png' })`. O campo é `type="text"` (o SDD prevê `type="url"`).

#### TC-LOG-006: Sanitização de SVG

**Prioridade:** P1 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-09 (passo 4)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Upload de SVG com `<script>` | `logo_maliciosa.svg` | Logo processada; o SVG decodificado do `src` não contém `<script` |
| 2 | Upload de SVG com `onload` entre aspas duplas | `logo_onload.svg` (`onload="alert(1)"`) | Atributo `onload` removido |
| 3 | Upload de SVG com `href="javascript:…"` | `logo_js_href.svg` | Atributo `href` removido |
| 4 | 🐞 Upload de SVG com handler entre aspas simples | `logo_onclick_simples.svg` (`onclick='x()'`) | Esperado: removido. Atual: **mantido** (o sanitizador só trata aspas duplas) |

**Critério de Aceite:** Elementos potencialmente maliciosos removidos do SVG.

**Notas Cypress:** decodifique o `src` do `#logoPreviewImg`: `Cypress.Buffer.from(src.split(',')[1], 'base64').toString()`. Em `<img>` o SVG não executa scripts, mas o arquivo preservado continua inseguro se reutilizado.

#### TC-LOG-007: Alternância entre Abas de Logo

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar aba inicial | — | "Enviar do computador" ativa |
| 2 | Enviar uma logo por arquivo | `logo.png` | Preview exibido |
| 3 | Alternar para URL e informar uma URL | `https://exemplo.com/logo.png` | Painel de URL visível |
| 4 | Gerar recibo | — | A logo do recibo é a **URL** (o modo ativo decide) |
| 5 | Voltar para a aba de upload e gerar | — | A logo do recibo é a do arquivo enviado |
| 6 | Remover o arquivo e gerar | — | Sem `.receipt-logo` |

**Critério de Aceite:** A aba ativa define qual logo é usada.

#### TC-LOG-008: Atributo de Imagem Injetável pela URL da Logo

**Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-09) — escrever com `it.skip`

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Na aba de URL, informar um valor com aspas | `x" onerror="window.__xss=1" data-x="` | O valor é tratado como texto: nenhum atributo extra no `<img>` |
| 2 | Gerar recibo | — | `win.__xss` permanece `undefined` |

**Critério de Aceite:** Dados do usuário nunca viram atributos HTML executáveis.

**Notas Cypress:** atual: `resolvedLogo` é interpolado **sem escape** em `<img src="${resolvedLogo}">`; o `onerror` injetado **executa** (XSS no próprio usuário). Correção: escapar o valor (ou criar o elemento via DOM e atribuir `src`).

---

### 4.4 Módulo: Dados do Cliente

**Arquivo de teste:** `cypress/e2e/modules/dados-cliente.cy.js`

> Nos casos abaixo, preencha todos os demais campos obrigatórios com a massa válida antes de gerar, para que a validação nativa não bloqueie o envio antes da validação do app.

#### TC-CLI-001: Preenchimento de Dados Obrigatórios

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome Completo | `João Carlos da Silva` | Nome aceito, sem erro |
| 2 | Preencher Celular | `11999998888` | Máscara aplicada: `(11) 99999-8888` |
| 3 | Deixar CPF/CNPJ vazio | — | Campo opcional, sem erro |
| 4 | Gerar o recibo | — | Preview abre; o card "Cliente" mostra nome e celular |

**Critério de Aceite:** Nome aceito com 3+ caracteres, celular formatado, documento opcional.

#### TC-CLI-002: Validação de Nome Mínimo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir 1 caractere e gerar | `A` | `#clientNameErr` visível com "Mínimo 3 caracteres"; `#clientName` com `.field-invalid`; preview não abre |
| 2 | Inserir 2 caracteres e gerar | `AB` | Mesmo resultado |
| 3 | Inserir 3 caracteres | `ABC` | Erro removido ao digitar (`.field-invalid` some; `#clientNameErr` deixa de ser visível); gerar abre o preview |

**Critério de Aceite:** Nomes com menos de 3 caracteres são rejeitados com mensagem inline.

**Notas Cypress:** o erro só aparece **ao tentar gerar**, não ao sair do campo. A mensagem é "Mínimo 3 caracteres" (não "Nome deve ter no mínimo 3 caracteres"). O foco vai para `#clientName`.

#### TC-CLI-003: Validação de CPF Válido

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CPF válido e sair do campo | `52998224725` | Exibido `529.982.247-25`; `#clientDocErr` não visível |
| 2 | Inserir outro CPF válido | `11144477735` | Exibido `111.444.777-35`; sem erro |
| 3 | Inserir um terceiro CPF válido | `12345678909` | Exibido `123.456.789-09`; sem erro |
| 4 | Gerar e verificar o recibo | — | CPF impresso com máscara no `.receipt-party-detail` do cliente |

**Critério de Aceite:** CPFs válidos aceitos e formatados.

**Notas Cypress:** a versão 1.0 usava `529.982.247-62`, que é **inválido** (o correto é `-25`). A validação ocorre no `blur`.

#### TC-CLI-004: Validação de CPF Inválido

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CPF com dígito verificador errado e sair do campo | `52998224763` | `#clientDocErr` visível; `#clientDoc` com `.field-invalid` |
| 2 | Inserir CPF com zeros | `00000000000` | Erro visível |
| 3 | Inserir CPF com todos os dígitos iguais | `11111111111` | Erro visível |
| 4 | Inserir CPF incompleto | `5299822` | Erro visível |
| 5 | Tentar gerar com o CPF inválido | — | Preview não abre; foco em `#clientDoc` |
| 6 | Corrigir para um CPF válido | `52998224725` | Erro removido |

**Critério de Aceite:** CPFs inválidos rejeitados; dígitos verificadores validados.

**Notas Cypress:** a mensagem atual do cliente é "CPF ou CPNJ inválidos" (erro de digitação, 🐞 DEF-08). Evite asserir o texto exato até a correção; verifique visibilidade e a classe. A versão 1.0 tratava `123.456.789-09` como inválido, mas ele é **válido**.

#### TC-CLI-005: Validação de Celular

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-06 (passos 4–5)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir 8 dígitos e gerar | `99998888` | Máscara `(99) 9988-88`; `#clientPhone` com `.field-invalid`; preview não abre |
| 2 | Inserir 10 dígitos | `1199998888` | Máscara `(11) 9999-8888`; aceito |
| 3 | Inserir 11 dígitos | `11999998888` | Máscara `(11) 99999-8888`; aceito |
| 4 | 🐞 Inserir DDD inexistente | `00999998888` e `99999998888` | Esperado: erro "DDD inválido". Atual: **aceitos** |
| 5 | 🐞 Verificar mensagem de erro do passo 1 | — | Esperado: mensagem visível ("Celular inválido"). Atual: não há elemento `#clientPhoneErr`; só a borda vermelha |

**Critério de Aceite:** Celular com DDD válido e 10–11 dígitos.

**Notas Cypress:** o app aceita 10 e 11 dígitos (formato `(XX) XXXX-XXXX` ou `(XX) XXXXX-XXXX`). Digitar mais de 11 dígitos é cortado pela máscara.

---

### 4.5 Módulo: Dados do Beneficiário

**Arquivo de teste:** `cypress/e2e/modules/dados-beneficiario.cy.js`

#### TC-BEN-001: Preenchimento de Dados Obrigatórios

**Prioridade:** P1 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-16 (passo 4)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome Completo | `Empresa XYZ Ltda` | Nome aceito |
| 2 | Preencher Celular | `21987654321` | Máscara `(21) 98765-4321` |
| 3 | Preencher CPF/CNPJ válido | `11444777000161` | Exibido `11.444.777/0001-61`; sem erro |
| 4 | 🐞 Deixar Celular vazio e gerar | — | Esperado (SDD §3.5): campo opcional, gera normalmente. Atual: campo `required`; o navegador bloqueia |

**Critério de Aceite:** Nome obrigatório aceito; documento validado.

**Notas Cypress:** a versão 1.0 usava `12.345.678/0001-90`, que é **inválido**. Para o passo 4, escreva o teste do comportamento atual (`:invalid`) ou `it.skip` aguardando decisão.

#### TC-BEN-002: Validação de CNPJ Válido

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CNPJ válido e sair do campo | `11444777000161` | Exibido `11.444.777/0001-61`; `#providerDocErr` não visível |
| 2 | Inserir outro CNPJ válido | `55773812000161` | Exibido `55.773.812/0001-61`; sem erro |
| 3 | Inserir um terceiro CNPJ válido | `12345678000195` | Exibido `12.345.678/0001-95`; sem erro |

**Critério de Aceite:** CNPJs válidos aceitos e formatados.

**Notas Cypress:** a versão 1.0 usava `55.773.812/0001-55` (**inválido**).

#### TC-BEN-003: Validação de CNPJ Inválido

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CNPJ com dígito verificador errado | `11444777000162` | `#providerDocErr` visível; `.field-invalid` no campo |
| 2 | Inserir CNPJ incompleto (13 dígitos) | `1144477700016` | Erro visível (mesma mensagem) |
| 3 | Inserir CNPJ com todos os dígitos iguais | `11111111111111` | Erro visível |
| 4 | Tentar gerar com CNPJ inválido | — | Preview não abre; foco em `#providerDoc` |

**Critério de Aceite:** CNPJs inválidos rejeitados.

**Notas Cypress:** mensagem atual do beneficiário: "CPF ou CNPJ inválido". Não existe mensagem específica "CNPJ incompleto".

#### TC-BEN-004: Nome e Celular do Beneficiário

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–2) · 🐞 DEF-06 (passo 3)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir nome com 2 caracteres e gerar | `AB` | `#providerNameErr` visível ("Mínimo 3 caracteres"); preview não abre |
| 2 | Inserir nome válido | `Maria Ltda` | Erro removido |
| 3 | 🐞 Inserir celular com formato incompleto e gerar | `12` | Esperado: erro de formato (como no cliente). Atual: **aceito** (o celular do beneficiário não é validado no envio) |

**Critério de Aceite:** Nome do beneficiário validado; celular com a mesma regra do cliente.

---

### 4.6 Módulo: Dados do Veículo

**Arquivo de teste:** `cypress/e2e/modules/dados-veiculo.cy.js`

#### TC-VEI-001: Preenchimento de Campos Obrigatórios

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Modelo | `Fiat Strada` | Modelo aceito |
| 2 | Preencher Placa Mercosul | `ABC1D23` | Máscara: `ABC-1D23` |
| 3 | Preencher Ano | `2024` | Ano aceito |
| 4 | Gerar recibo | — | `.receipt-vehicle-card` com "Modelo: Fiat Strada", "Placa: ABC-1D23", "Ano: 2024" |
| 5 | Modelo com 1 caractere e gerar | `F` | `#carModelErr` visível ("Mínimo 2 caracteres"); preview não abre |

**Critério de Aceite:** Campos aceitos e seção impressa no recibo.

#### TC-VEI-002: Máscara e Formato de Placa

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
| 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
| 3 | Digitar minúsculas e pontuação | `ab-c1.d2 3` | `ABC-1D23` (maiúsculas, caracteres especiais removidos) |
| 4 | Digitar mais de 7 caracteres | `ABC1D23XYZ` | `ABC-1D23` (cortado em 7) |
| 5 | Digitar placa incompleta e gerar | `ABC12` | Aceita: exibido `ABC-12` (o app não valida o formato da placa) |

**Critério de Aceite:** Ambos os formatos (Mercosul e antigo) recebem a máscara.

**Notas Cypress:** o app só aplica máscara à placa; não existem mensagens "Placa incompleta/inválida" (nem o SDD §3.12 as especifica; ver DIV-08). Não use `ABD-1X23` como "inválida": ela **é** uma placa Mercosul válida (`LLL#L##`).

#### TC-VEI-003: Validação de Ano do Veículo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir ano válido | `2024` | Ano aceito |
| 2 | Inserir ano limite inferior | `1900` | Aceito |
| 3 | Inserir ano atual + 1 | `<ano atual>+1` | Aceito |
| 4 | Inserir ano muito antigo | `1899` e `1800` | `#carYearErr` visível ("Ano inválido"); preview não abre |
| 5 | Inserir ano atual + 2 | `<ano atual>+2` | Erro visível |
| 6 | Inserir 3 dígitos | `999` | Erro visível |
| 7 | Inserir 5 dígitos | `20245` | Erro visível |
| 8 | Inserir letras | `abcd` | Erro visível |

**Critério de Aceite:** Aceitos apenas anos de 1900 a (ano atual + 1), com 4 dígitos.

**Notas Cypress:** calcule `const ano = new Date().getFullYear()` no teste; **não fixe** 2027/2050. Existe uma única mensagem ("Ano inválido") para todos os casos. 🐞 DEF-07: o campo não tem máscara numérica (aceita letras na digitação; só valida ao gerar).

#### TC-VEI-004: Visibilidade Condicional da Seção

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar com modelo, placa e ano preenchidos | Massa válida | `.receipt-vehicle-card` presente com os três campos |
| 2 | Tentar gerar com o modelo vazio | — | Modelo `:invalid`; preview não abre (a seção veículo é **sempre** impressa quando o formulário é válido) |
| 3 | Gerar no modelo detalhado | Massa válida | Seção "Informações do Veículo" com Modelo, Placa e Ano |

**Critério de Aceite:** Como Modelo e Ano são obrigatórios, a seção sempre aparece em recibos gerados.

**Notas Cypress:** a versão 1.0 supunha veículo opcional. O SDD §3.6 confirma: "A seção é sempre renderizada". Placa é `required` no app; no SDD é opcional (🐞 DEF-16).

---

### 4.7 Módulo: Dados do Estabelecimento

**Arquivo de teste:** `cypress/e2e/modules/dados-estabelecimento.cy.js`

> Use `cy.mockLocalidades()` e `cy.mockViaCep()` em todos os casos deste módulo (Apêndice C). Os dados das cidades vêm do IBGE (SDD §3.7 previa JSON local; ver DEF-01).

#### TC-EST-001: Preenchimento Completo de Endereço

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome da Empresa | `Lava-jato Express` | Nome aceito |
| 2 | Selecionar Estado | `SP` (São Paulo) | Estado selecionado |
| 3 | Aguardar e selecionar Cidade | `São Paulo` | Cidades populadas e cidade selecionada |
| 4 | Preencher Bairro | `Centro` | Bairro aceito |
| 5 | Preencher CEP | `01310100` | Máscara aplicada: `01310-100` |
| 6 | Preencher Rua/Logradouro | `Av. Paulista` | Rua aceita |
| 7 | Preencher Número | `1000` | Número aceito |
| 8 | Gerar o recibo | — | Endereço completo no recibo (ver TC-GER-001) |

**Critério de Aceite:** Todos os campos aceitos; cidade populada após o estado.

**Notas Cypress:** após `select('SP')`, `cy.wait('@ibge')` e `should('not.be.disabled')` no select de cidade. Ao sair do campo CEP com 8 dígitos o app consulta o ViaCEP e **sobrescreve** rua, bairro, estado e cidade (ver TC-EST-004). Para o passo 6 digitar depois da consulta, ou simule o ViaCEP com os mesmos dados.

#### TC-EST-002: Carregamento Dinâmico de Cidades

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar estado inicial da cidade | — | Campo desabilitado com "Selecione o estado primeiro" |
| 2 | Selecionar Estado | Rio de Janeiro (`RJ`) | Cidade habilitada; cidades do RJ listadas após "Selecione a cidade" |
| 3 | Selecionar Estado | Minas Gerais (`MG`) | Cidades de MG listadas |
| 4 | Selecionar Estado | Amazonas (`AM`) | Cidades do AM listadas |
| 5 | Alterar Estado | De MG para SP | Lista limpa e repopulada com cidades de SP |
| 6 | Voltar para "Selecione ..." | — | Cidade volta a ficar desabilitada com "Selecione o estado primeiro" |

**Critério de Aceite:** Cidades populadas dinamicamente e correspondentes ao estado.

**Notas Cypress:** a requisição é `GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/<UF>/municipios?orderBy=nome`. Enquanto carrega, o select mostra "Carregando cidades..." e fica desabilitado.

#### TC-EST-003: Validação de CEP

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-10 (passo 4)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CEP completo | `01310100` | Máscara: `01310-100` |
| 2 | Inserir CEP incompleto e gerar | `01310` | Exibido `01310`; `#estCep` com `.field-invalid`; preview não abre |
| 3 | Digitar letras | `01310-ABC` | Letras ignoradas: exibido `01310` |
| 4 | 🐞 Verificar mensagem de erro do passo 2 | — | Esperado: mensagem "CEP incompleto" visível. Atual: apenas a borda vermelha, sem mensagem |

**Critério de Aceite:** CEP aceito apenas no formato `00000-000`.

**Notas Cypress:** letras nunca chegam ao campo (a máscara remove). Não existe "CEP deve conter apenas números".

#### TC-EST-004: Preenchimento Automático por CEP

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Simular resposta do ViaCEP | `{ logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" }` | — |
| 2 | Digitar CEP completo e sair do campo | `01310100` | Rua = "Avenida Paulista"; bairro = "Bela Vista"; estado = `SP`; cidade = "São Paulo" |
| 3 | Verificar indicador | — | `#cepSuccess` ("✓ endereço preenchido!") visível e some após ≈ 3 s |
| 4 | Digitar CEP com menos de 8 dígitos e sair do campo | `01310` | Nenhuma requisição ao ViaCEP |

**Critério de Aceite:** O CEP completo preenche o endereço automaticamente.

**Notas Cypress:** `cy.wait('@viacep')`. A requisição é `GET https://viacep.com.br/ws/<CEP>/json/`.

#### TC-EST-005: CEP Não Encontrado ou Falha de Rede

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Simular `{ "erro": true }` e digitar CEP | `99999999` | `#estCep` com `.field-invalid` e `title` = "CEP não encontrado"; campos de endereço intactos |
| 2 | Simular falha de rede e digitar CEP | `01310100` | Spinner some; `title` = "Não foi possível buscar o CEP. Verifique sua conexão." |
| 3 | Corrigir com um CEP existente | `01310100` (resposta válida) | `.field-invalid` removido e `title` vazio |

**Critério de Aceite:** Falhas na busca de CEP não impedem o preenchimento manual.

**Notas Cypress:** a falha de rede usa `forceNetworkError: true` no `cy.intercept`. O app tenta a requisição 3 vezes (retry de 800 ms); aguarde ≈ 2 s ou aumente o timeout do `cy.wait`.

#### TC-EST-006: Falha ao Carregar Cidades

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Simular erro do IBGE (`500` ou erro de rede) | — | — |
| 2 | Selecionar um estado | `SP` | Select de cidade com "Erro ao carregar — tente novamente" |
| 3 | Verificar que o select está habilitado | — | Habilitado (permite nova tentativa ao trocar o estado) |
| 4 | Restaurar a simulação e trocar o estado | `RJ` | Cidades carregadas normalmente |

**Critério de Aceite:** Falha de carregamento é comunicada e recuperável.

#### TC-EST-007: Estado e Cidade Obrigatórios

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–3) · 🐞 DEF-10 (passo 4)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher tudo, mas deixar o estado em "Selecione ..." e gerar | — | Preview não abre; foco em `#estStateSelect` |
| 2 | Selecionar estado e deixar a cidade vazia e gerar | `SP` | Preview não abre; foco em `#estCitySelect` |
| 3 | Selecionar a cidade e gerar | `São Paulo` | Preview abre |
| 4 | 🐞 Verificar sinalização visual | — | Esperado: borda vermelha e mensagem nos selects. Atual: a classe `.field-invalid` é aplicada, mas o CSS só estiliza `input.field-invalid`; os selects não mudam visualmente |

**Critério de Aceite:** Não há recibo sem estado e cidade.

**Notas Cypress:** estado e cidade **não** têm atributo `required`; a validação é do app (não aparece em `:invalid`).

---

### 4.8 Módulo: Serviços e Produtos

**Arquivo de teste:** `cypress/e2e/modules/servicos-produtos.cy.js`

> **O total não é exibido no formulário.** O SDD §3.8 prevê total em tempo real e linha de total fixada; o app só calcula o total ao gerar o recibo (🐞 DEF-02). Nos casos abaixo, os totais são verificados em `.receipt-total-value` **depois de gerar**. Cada linha de serviço tem descrição e valor `required`; uma linha vazia adicionada bloqueia a geração (TC-SRV-009).

#### TC-SRV-001: Adição de Serviço

**Prioridade:** P1 · **Status:** ✅ Automatizável (🐞 DEF-02 para total em tempo real)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar linha inicial | — | 1 `.service-row` com campos vazios e rótulos "Serviço / Produto" e "Valor (R$)" |
| 2 | Preencher o primeiro serviço | `Lavagem completa`, `50.00` | Linha preenchida |
| 3 | Clicar em "+ Adicionar serviço" | — | Nova linha ao final (2 `.service-row`); a nova linha não tem rótulos |
| 4 | Preencher o segundo serviço | `Cera`, `30.00` | Linha preenchida |
| 5 | Gerar o recibo | — | Duas linhas na tabela; `.receipt-total-value` = `R$ 80,00` |
| 6 | 🐞 Verificar total no formulário | — | Esperado (SDD): total "R$ 80,00" visível e atualizado em tempo real. Atual: não existe |

**Critério de Aceite:** Serviços adicionados; total correto no recibo.

#### TC-SRV-002: Remoção de Serviço

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Ter 2 serviços na lista | `S1: 50`, `S2: 30` | 2 `.service-row` |
| 2 | Clicar em "×" do segundo serviço | `btn-remove-service` (2ª linha) | Segunda linha removida (1 `.service-row`) |
| 3 | Gerar o recibo | — | Uma linha na tabela; total `R$ 50,00` |

**Critério de Aceite:** Serviço removido e total refletido no recibo.

#### TC-SRV-003: Restrição de Remoção da Única Linha

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar 1 serviço na lista | — | Botão "×" **visível e habilitado** |
| 2 | Clicar em "×" | — | Linha **não** removida (continua 1 `.service-row`) |
| 3 | Adicionar serviço | — | 2 serviços presentes |
| 4 | Clicar em "×" da primeira linha | — | Remoção permitida; resta 1 linha |

**Critério de Aceite:** A última linha não pode ser removida.

**Notas Cypress:** a versão 1.0 supunha botão oculto/desabilitado; o app só ignora o clique (`rows.length <= 1`).

#### TC-SRV-004: Cálculo de Total com Múltiplos Serviços

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Adicionar 3 serviços | `10.50`, `20.30`, `15.20` | — |
| 2 | Gerar o recibo | — | `.receipt-total-value` = `R$ 46,00` (formato BRL) |
| 3 | Alterar o valor do primeiro e gerar | `10.50` → `15.00` | Total `R$ 50,50` |
| 4 | Valor com milhar | `1234.50` (único serviço) | `R$ 1.234,50` na linha e no total |
| 5 | Valor com mais de 2 casas decimais | `10.999` | O navegador bloqueia: campo `:invalid` com `validity.stepMismatch`; preview não abre |

**Critério de Aceite:** Total correto, formatação BRL, no máximo 2 casas decimais.

**Notas Cypress:** o passo 5 é garantido pelo `step="0.01"` do `<input type=number>`, não pelo código do app. A soma `10.5 + 20.3 + 15.2` fecha em `46` sem ruído visível.

#### TC-SRV-005: Validação de Serviço Obrigatório

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar descrição e valor vazios e gerar | — | Campos `:invalid` (nativo); preview não abre |
| 2 | Preencher apenas a descrição e gerar | `Lavagem` | Campo de valor `:invalid`; preview não abre |
| 3 | Preencher apenas o valor e gerar | `50.00` | Campo de descrição `:invalid`; preview não abre |
| 4 | Preencher descrição e valor `0` e gerar | `Lavagem`, `0` | Preview não abre; o foco vai para "+ Adicionar serviço" (nenhum serviço com valor > 0) |
| 5 | Preencher descrição e valor válidos | `Lavagem`, `50.00` | Preview abre |

**Critério de Aceite:** Nenhum recibo é gerado sem ao menos um serviço com valor positivo.

**Notas Cypress:** não existem as mensagens "Adicione ao menos um serviço", "Informe o valor…" ou "Informe a descrição…". O passo 4 é a única validação do app (foco no botão `.btn-add`, sem mensagem).

#### TC-SRV-006: Valores Negativos e Não Numéricos

**Prioridade:** P3 · **Status:** ✅ Automatizável (passos 1–2) · 🐞 DEF-12 (passo 3)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar letras no campo de valor | `abc` | Campo permanece vazio (`type=number`) |
| 2 | Valor negativo como único serviço e gerar | `-5` | Preview não abre (nenhum serviço com valor > 0) |
| 3 | 🐞 Valor negativo em um segundo serviço, com um serviço válido de 50 | `-10` | Esperado (SDD: "número positivo"): rejeitado. Atual: aceito; total `R$ 40,00` |

**Critério de Aceite:** Apenas valores positivos são aceitos.

#### TC-SRV-007: Aplicação de Desconto (Porcentagem)

**Prioridade:** P2 · **Status:** ✅ Automatizável (🐞 DEF-12 para valores negativos)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar que o campo de desconto está oculto | — | `#discountContainer` oculto |
| 2 | Clicar em "+ Adicionar desconto" | `btn-add-discount` | Campo "Valor do Desconto (%)" visível |
| 3 | Inserir 10% com serviços `50` + `30` e gerar | `10` | Total `R$ 72,00` |
| 4 | Inserir 100% | `100` | Total `R$ 0,00` |
| 5 | Inserir 150% | `150` | Total `R$ 0,00` (nunca negativo) |
| 6 | Inserir 12,5% | `12.5` | Total `R$ 70,00` |
| 7 | Apagar o desconto | `` (vazio) | Total volta ao valor bruto `R$ 80,00` |
| 8 | 🐞 Inserir desconto negativo | `-10` | Esperado: rejeitado. Atual: aceito; total `R$ 88,00` (aumenta) |

**Critério de Aceite:** Desconto percentual subtraído do total bruto; total nunca negativo.

#### TC-SRV-008: Exibição de Desconto no Recibo

**Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-02) — escrever com `it.skip`

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar recibo com desconto | Serviços `50` + `30`, desconto `10%` | Recibo renderizado |
| 2 | Verificar a seção de totais | — | Exibe **Subtotal** (`R$ 80,00`), **Desconto** (`R$ 8,00`) e **Total Geral** (`R$ 72,00`) |
| 3 | Gerar recibo sem desconto | — | Seção de desconto omitida; exibe apenas o Total |

**Critério de Aceite:** Detalhamento financeiro correto no documento final (SDD §3.8).

**Notas Cypress:** atual: o recibo mostra **somente** o Total (`R$ 72,00`); as palavras "Subtotal" e "Desconto" não aparecem. Escreva um teste paralelo que fixe o comportamento atual (apenas o total) se quiser regressão enquanto o defeito não é corrigido.

#### TC-SRV-009: Linha de Serviço Vazia Bloqueia a Geração

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher o formulário com 1 serviço válido | Massa válida | — |
| 2 | Clicar em "+ Adicionar serviço" e deixar a nova linha vazia | — | 2 `.service-row` |
| 3 | Tentar gerar | — | Preview não abre; os 2 campos da nova linha estão `:invalid` |
| 4 | Remover a linha vazia e gerar | `btn-remove-service` | Preview abre |

**Critério de Aceite:** Linhas vazias precisam ser preenchidas ou removidas.

---
### 4.9 Módulo: Observações

**Arquivo de teste:** `cypress/e2e/modules/observacoes.cy.js`

#### TC-OBS-001: Campo de Observações Opcional

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar o campo vazio e gerar | — | Campo opcional; recibo gerado sem erro |
| 2 | Inserir texto curto | `Pagamento em dinheiro` | Texto aceito |
| 3 | Inserir texto de 500 caracteres | 500 × `x` | Texto aceito integralmente (`value.length` = 500) |
| 4 | Digitar 550 caracteres | 550 × `y` | O campo limita a 500 caracteres (`maxlength="500"`) |

**Critério de Aceite:** Campo opcional; limite de 500 caracteres respeitado.

**Notas Cypress:** `.type('y'.repeat(550), { delay: 0 })` respeita o `maxlength`. Para preencher rápido o passo 3, use `.invoke('val', 'x'.repeat(500)).trigger('input')`.

#### TC-OBS-002: Exibição Condicional no Recibo

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar com observações vazias (modelo padrão) | — | Não existe `.receipt-observations` |
| 2 | Gerar com observações preenchidas | `Garantia de 30 dias` | `.receipt-observations-text` contém o texto |
| 3 | Gerar no modelo detalhado, vazio | — | Não existe a seção "Observações" |
| 4 | Gerar no modelo detalhado, preenchido | `Garantia de 30 dias` | Seção "Observações" presente com o texto |

**Critério de Aceite:** Seção visível apenas se observações preenchidas.

#### TC-OBS-003: Contador de Caracteres

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar o contador antes de digitar | — | `#observationsCount` vazio |
| 2 | Digitar 10 caracteres | `xxxxxxxxxx` | "10/500 caracteres" |
| 3 | Digitar 450 caracteres | 450 × `x` | Contador **não** está na cor de erro |
| 4 | Digitar 451 caracteres | 451 × `x` | Contador na cor de erro (`rgb(239, 68, 68)`) |
| 5 | Digitar 500 caracteres | 500 × `x` | "500/500 caracteres", cor de erro |

**Critério de Aceite:** Contador atualizado em tempo real; alerta visual nos últimos 50 caracteres.

---

### 4.10 Módulo: Geração do Recibo

**Arquivo de teste:** `cypress/e2e/modules/geracao-recibo.cy.js`

#### TC-GER-001: Geração Completa de Recibo

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher todos os campos | Massa completa (Apêndice A), com CPF do cliente e CNPJ do beneficiário | Formulário válido |
| 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
| 3 | Clicar em "Gerar Recibo Agora" | — | Recibo renderizado em `#receiptContent` (preview aberto) |
| 4 | Verificar título | Tipo `Recibo de Pagamento` | `.receipt-type` = "Recibo de Pagamento"; `.receipt-est-name` = nome do estabelecimento |
| 5 | Verificar data | `2020-01-15` | `.receipt-date-value` = `15/01/2020`; `.receipt-city` = "São Paulo, SP" |
| 6 | Verificar cliente | — | Card "Cliente": nome, CPF com máscara e celular |
| 7 | Verificar beneficiário | — | Card "Beneficiário": nome, CNPJ com máscara e celular |
| 8 | Verificar veículo | — | `.receipt-vehicle-info`: Modelo, Placa (`ABC-1D23`), Ano |
| 9 | Verificar estabelecimento | — | Cabeçalho: "Av. Paulista, 1000 — Centro"; rodapé: nome + "Av. Paulista, 1000, Centro, São Paulo, SP" |
| 10 | Verificar serviços | `Lavagem completa 50,00`, `Cera 30,00` | 2 linhas em `.receipt-table tbody tr` com valores em BRL |
| 11 | Verificar total | — | `.receipt-total-value` = `R$ 80,00` |
| 12 | Verificar carimbo de emissão | — | `.receipt-footer-timestamp` começa com "Documento emitido em" seguido de data e hora atuais |

**Critério de Aceite:** O recibo contém todos os dados inseridos, formatados corretamente.

**Notas Cypress:** os rótulos "Cliente", "Beneficiário", "Veículo", "Emissão", "Total", "Descrição" e "Valor" estão em maiúsculas por CSS; compare o texto do DOM. O endereço do cabeçalho usa "—" (travessão) entre número e bairro.

#### TC-GER-002: Visibilidade Condicional no Recibo

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar sem logo | — | Nenhum `.receipt-logo` |
| 2 | Gerar com logo | `logo.png` | `.receipt-logo` presente |
| 3 | Gerar sem observações | — | Nenhum `.receipt-observations` |
| 4 | Gerar sem CPF/CNPJ | — | Os cards de cliente e beneficiário exibem nome e celular; o parágrafo do documento fica vazio |
| 5 | Gerar sem desconto | — | Total igual à soma dos serviços |

**Critério de Aceite:** Seções opcionais ausentes se os campos estiverem vazios.

**Notas Cypress:** veículo e estabelecimento não podem ficar vazios (campos obrigatórios), então não há cenário "sem veículo/estabelecimento". Com CPF/CNPJ vazios, o app ainda renderiza um `<p class="receipt-party-detail">` **vazio** no card (aceito; não afeta o teste).

#### TC-GER-003: Modelo de Recibo Padrão

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Manter o modelo padrão e gerar | `#receiptTemplate` = `default` | Recibo renderizado |
| 2 | Verificar estrutura | — | Existem `.receipt-parties` (2 cards), `.receipt-vehicle-card`, tabela com cabeçalho "Descrição"/"Valor" e `.receipt-total-box` |
| 3 | Verificar ausência de elementos do modelo detalhado | — | Nenhum `.receipt-detailed-section` |
| 4 | Verificar rodapé | — | Rodapé minimalista (`.receipt-footer-signature-email`); nenhum `.receipt-signature-block` |

**Critério de Aceite:** O modelo padrão renderiza a estrutura compacta.

#### TC-GER-004: Modelo de Recibo Detalhado

**Prioridade:** P2 · **Status:** ✅ Automatizável (passos 1–4, 6) · 🐞 DEF-03 (passo 5)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Selecionar "Modelo Detalhado" e gerar | `#receiptTemplate` = `detailed` | Recibo renderizado com seções rotuladas |
| 2 | Verificar estrutura | Observações preenchidas | Seções, em ordem: "Dados do Recibo", "Dados do Cliente", "Dados do Beneficiário", "Informações do Veículo", "Observações", "Descrição do Serviço" |
| 3 | Verificar cabeçalho | — | Título principal (`h1`) com o tipo do recibo; logo, se houver |
| 4 | Verificar total | Serviços `50` + `30` | `.receipt-detailed-total-row` contém "Valor Total:" e `R$ 80,00` |
| 5 | 🐞 Verificar rodapé detalhado | — | Esperado (SDD §3.10): blocos de assinatura para Cliente e Beneficiário. Atual: rodapé minimalista; 0 `.receipt-signature-block` |
| 6 | Testar conteúdo longo | 50 linhas de serviço de `1,00` | `.receipt-wrapper` recebe a classe `receipt-long-content` (altura acima de 2 páginas A4 ≈ 2244 px); com 10 linhas, não recebe |

**Critério de Aceite:** Modelo detalhado renderizado com todas as seções; padding extra em conteúdo longo.

**Notas Cypress:**
- Passo 6: o padding é aplicado 50 ms após abrir o preview (`setTimeout`); use `.should('have.class', 'receipt-long-content')` (com retry). Medido: 41 linhas → 2156 px (sem classe); 46 linhas → 2577 px (com classe).
- Passo 5: o campo oculto `footerStyle` tem valor fixo `"minimal"`, e o rodapé depende dele, não do modelo.

#### TC-GER-005: Marca d'água e Estética

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar imagem decorativa do rodapé | — | `::before` de `.receipt-footer-signature-email` com `background-image` `img-baseboard.png` e `opacity` `0.5` |
| 2 | Verificar fundo dos cards | — | `.receipt-party-card` e `.receipt-vehicle-card` com fundo `rgb(243, 244, 246)` (cinza claro) |
| 3 | Verificar cor de destaque | `#4CAF50` | Ver TC-PER-001 |

**Critério de Aceite:** Elementos decorativos e cores de seção aplicados.

**Notas Cypress:** pseudo-elementos: `cy.window().then(win => win.getComputedStyle(el, '::before').backgroundImage)`. O SDD §3.10 fala em "marca d'água no fundo do documento"; o app implementa uma imagem decorativa no **rodapé** (DIV-09).

---

### 4.11 Módulo: Validação de Campos

**Arquivo de teste:** `cypress/e2e/modules/validacao-campos.cy.js`

> Lembrete: campos vazios obrigatórios são barrados pelo navegador (TC-FRM-005). Os casos abaixo usam valores **preenchidos porém inválidos**.

#### TC-VAL-001: Validação em Tempo Real

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar nome inválido e sair do campo (blur) | `A` | **Nenhum** erro aparece (os erros de nome só surgem ao tentar gerar) |
| 2 | Tentar gerar | — | `#clientNameErr` visível; `.field-invalid` aplicada |
| 3 | Corrigir para nome válido | `João` | Erro removido imediatamente (evento `input`) |
| 4 | Digitar CPF inválido e sair do campo | `52998224763` | Erro do documento aparece **no blur** (`onblur`) |
| 5 | Corrigir o CPF | `52998224725` | Erro removido |

**Critério de Aceite:** Erros de documento aparecem no blur; os demais, no envio; todos somem ao corrigir.

**Notas Cypress:** a v1.0 previa erro no blur para o nome. O código só **remove** erros no blur/input quando o campo passa a ter valor.

#### TC-VAL-002: Scroll até Primeiro Erro

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher o formulário com 2 campos inválidos | Nome `A` e ano `1800` (demais válidos) | Formulário preenchido |
| 2 | Tentar gerar | — | Preview não abre; erros visíveis em nome e ano |
| 3 | Verificar foco | — | `#clientName` está focado e dentro da área visível |
| 4 | Corrigir o nome e tentar gerar | `João Silva` | O foco passa para `#carYear` |

**Critério de Aceite:** Scroll suave e foco no primeiro campo inválido.

**Notas Cypress:** o "primeiro" segue a ordem de validação do código (tipo, data, nome, celular do cliente, nome do beneficiário, modelo, ano, empresa, estado, cidade, bairro, rua, número, CEP), que não é idêntica à ordem do DOM (CEP vem antes de rua e número). Verifique a visibilidade com `getBoundingClientRect()` ou `cy.get(...).should('be.visible')` após o scroll.

#### TC-VAL-003: Classe CSS de Erro

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Provocar erro no nome e tentar gerar | `A` | O `input` ganha a classe `.field-invalid`; a mensagem `#clientNameErr` ganha `.visible` |
| 2 | Verificar estilo | — | Borda `rgb(239, 68, 68)` e fundo `rgb(255, 245, 245)` |
| 3 | Corrigir o campo | `João` | Ambas as classes removidas |

**Critério de Aceite:** Estilos aplicados e removidos corretamente.

**Notas Cypress:** o SDD cita `.field-error` como classe do campo; no app, `.field-error` é a classe do **span da mensagem** e `.field-invalid` é a do campo (DIV-03).

#### TC-VAL-004: Documento Opcional, Porém Validado

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar com CPF e CNPJ vazios | — | Preview abre |
| 2 | Gerar com CPF inválido no cliente | `52998224763` | Preview não abre; foco em `#clientDoc` |
| 3 | Gerar com CPF válido no cliente e CNPJ inválido no beneficiário | `52998224725` / `11444777000162` | Preview não abre; foco em `#providerDoc` |
| 4 | Corrigir o CNPJ | `11444777000161` | Preview abre |

**Critério de Aceite:** Documento vazio é aceito; preenchido, é validado.

---

### 4.12 Módulo: Máscaras de Input

**Arquivo de teste:** `cypress/e2e/modules/mascaras-input.cy.js`

> Digite com `.type()` (caractere a caractere): a máscara é reaplicada a cada `input`.

#### TC-MSK-001: Máscara de CPF

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 6 dígitos | `529982` | `529.982` |
| 2 | Digitar 9 dígitos | `529982247` | `529.982.247` |
| 3 | Digitar 11 dígitos | `52998224725` | `529.982.247-25` |
| 4 | Digitar letras misturadas | `abc529x` | `529` (letras ignoradas) |

**Critério de Aceite:** Máscara `000.000.000-00` aplicada automaticamente.

**Notas Cypress:** a máscara parcial não completa com `_` (`529.982.247`, não `529.982.247-__`).

#### TC-MSK-002: Máscara de CNPJ

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 12 dígitos | `114447770001` | `11.444.777/0001` |
| 2 | Digitar 14 dígitos | `11444777000161` | `11.444.777/0001-61` |
| 3 | Digitar mais de 14 dígitos | `1144477700016199999` | `11.444.777/0001-61` (corte em 14) |
| 4 | Digitar o 12º dígito sobre um CPF completo | `52998224725` + `9` | A máscara muda de CPF para CNPJ: `52.998.224/7259` |

**Critério de Aceite:** Máscara `00.000.000/0000-00` aplicada a partir do 12º dígito.

#### TC-MSK-003: Máscara de Celular

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 3 dígitos | `119` | `(11) 9` |
| 2 | Digitar 10 dígitos | `1199998888` | `(11) 9999-8888` |
| 3 | Digitar 11 dígitos | `11999998888` | `(11) 99999-8888` |
| 4 | Digitar mais de 11 dígitos | `119999988889999` | `(11) 99999-8888` (corte em 11) |

**Critério de Aceite:** Máscara `(00) 00000-0000` para 11 dígitos e `(00) 0000-0000` para 10.

**Notas Cypress:** a v1.0 usava `1199998888` esperando `(11) 99999-8888`; com 10 dígitos o resultado correto é `(11) 9999-8888`. A máscara vale para os dois celulares (cliente e beneficiário).

#### TC-MSK-004: Máscara de CEP

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 5 dígitos | `01310` | `01310` |
| 2 | Digitar 6 dígitos | `013101` | `01310-1` |
| 3 | Digitar 8 dígitos | `01310100` | `01310-100` |
| 4 | Digitar letras | `01310-ABC` | `01310` (letras ignoradas) |
| 5 | Digitar mais de 8 dígitos | `013101009999` | `01310-100` |

**Critério de Aceite:** Máscara `00000-000` aplicada automaticamente.

#### TC-MSK-005: Máscara de Placa

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar placa Mercosul | `ABC1D23` | `ABC-1D23` |
| 2 | Digitar placa antiga | `ABC1234` | `ABC-1234` |
| 3 | Digitar minúsculas | `abc1d23` | `ABC-1D23` |
| 4 | Digitar 4 caracteres | `ABC1` | `ABC-1` |

**Critério de Aceite:** Ambos os formatos suportados com a máscara `AAA-9999` / `AAA-9A99`.

#### TC-MSK-006: Máscara de Ano

**Prioridade:** P4 · **Status:** 🐞 Defeito conhecido (DEF-07) — escrever com `it.skip`

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar letras e números | `20ab24` | `2024` (apenas dígitos) |
| 2 | Digitar mais de 4 dígitos | `202499` | `2024` (corte em 4) |

**Critério de Aceite:** O campo aceita apenas 4 dígitos (SDD §3.12).

**Notas Cypress:** atual: o campo mantém `20ab24` e `202499`; `maskYear` existe em `masks.js`, mas não está ligada ao input. A validação do ano ocorre ao gerar (TC-VEI-003).

---

### 4.13 Módulo: Página Inicial

**Arquivo de teste:** `cypress/e2e/modules/home.cy.js` (novo)

#### TC-HOM-001: Conteúdo da Página Inicial

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a home | `/` | Título da aba "Recebi — Gerador de Recibos Online Grátis" |
| 2 | Verificar texto de apresentação | — | "Crie recibos profissionais para sua Estética ou Lava Jato — 100% grátis e sem cadastro." |
| 3 | Verificar botão principal | `btn-start-form` | Visível, com o texto "Gerar Recibo" |
| 4 | Verificar rodapé | — | Contém "© 2026 Nilton F. O. Júnior" |
| 5 | Verificar idioma | — | `<html lang="pt-BR">` |

**Critério de Aceite:** A home apresenta o produto e o botão de início.

#### TC-HOM-002: Navegação para o Formulário

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Clicar em "Gerar Recibo" | `btn-start-form` | URL passa a terminar em `/src/html/form.html` |
| 2 | Verificar a página | — | Formulário visível; botão "Gerar Recibo Agora" desabilitado |

**Critério de Aceite:** O botão leva ao formulário.

**Notas Cypress:** o `<button>` fica dentro de um `<a>` (HTML inválido); funciona no Chromium, mas confirme manualmente no Firefox e no Safari (BRW-002, BRW-003).

---

### 4.14 Módulo: Preview e Impressão do Recibo

**Arquivo de teste:** `cypress/e2e/modules/preview-recibo.cy.js` (novo)

#### TC-PRE-001: Abertura do Preview

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo válido | Massa válida | `#printContainer` com classe `visible` |
| 2 | Verificar bloqueio de rolagem | — | `document.body.style.overflow` = `hidden` |
| 3 | Verificar foco | — | Foco no botão "✕ Fechar" (primeiro botão de `.print-actions`) |
| 4 | Verificar anúncio | — | `#a11yLive` contém "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar." |
| 5 | Verificar botões de ação | — | `btn-close-preview` e `btn-print-receipt` visíveis |

**Critério de Aceite:** Preview acessível, com foco gerenciado.

#### TC-PRE-002: Fechamento do Preview

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Clicar em "✕ Fechar" | `btn-close-preview` | `#printContainer` deixa de ser visível |
| 2 | Verificar rolagem | — | `body.style.overflow` vazio |
| 3 | Verificar dados do formulário | — | Todos os campos mantêm os valores digitados |

**Critério de Aceite:** Fechar o preview não perde dados.

#### TC-PRE-003: Impressão e Título do Arquivo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar com data `2020-01-15`, cliente `João Silva` e modelo `Fiat Strada` | — | Preview aberto |
| 2 | Clicar em "🖨️ Imprimir / Salvar PDF" | `btn-print-receipt` | `window.print` chamado 1 vez |
| 3 | Verificar o título durante a impressão | — | `document.title` = `15.01.2020 - João Silva - Fiat Strada` |
| 4 | Aguardar ≈ 1 s | — | `document.title` restaurado ("recibi - Gerador de Recibo Online") |

**Critério de Aceite:** O nome sugerido para o PDF segue `DD.MM.AAAA - Cliente - Modelo`.

**Notas Cypress:** `cy.stub(win, 'print').callsFake(() => { titulo = win.document.title })`. O título restaurado é o `<title>` da página, que hoje tem erro de grafia ("recibi"; DEF-05).

#### TC-PRE-004: Regeneração do Recibo

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo e fechar o preview | — | — |
| 2 | Alterar o nome do cliente e gerar de novo | `Ana Souza` | Existe exatamente 1 `.receipt-wrapper`; o nome exibido é `Ana Souza` |

**Critério de Aceite:** Cada geração substitui o conteúdo anterior.

#### TC-PRE-005: Fechar o Preview com a Tecla Esc

**Prioridade:** P3 · **Status:** 🐞 Defeito conhecido (DEF-11) — escrever com `it.skip`

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo | — | Preview aberto |
| 2 | Pressionar Esc | `{esc}` | Preview fechado |
| 3 | Verificar o foco | — | Foco devolvido ao botão "Gerar Recibo Agora" |

**Critério de Aceite:** Modal fechável pelo teclado, com foco restaurado (boa prática WAI-ARIA).

**Notas Cypress:** atual: Esc não fecha o preview, e o código não devolve o foco ao fechar.

---

### 4.15 Módulo: Personalização do Recibo

**Arquivo de teste:** `cypress/e2e/modules/personalizacao.cy.js` (novo)

#### TC-PER-001: Cores Sugeridas

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar valor padrão | — | `#accentColorHex` = `#6CACFB`; `#customColor` = `#6cacfb` |
| 2 | Verificar os presets | — | 6 botões `.color-preset` com `data-color`: `#6CACFB`, `#4CAF50`, `#F44336`, `#FF9800`, `#9C27B0`, `#000000` |
| 3 | Clicar no preset verde e gerar | `#4CAF50` | `#accentColorHex` = `#4CAF50`; `.receipt-wrapper` com `--receipt-accent: #4CAF50`; `.receipt-header` com fundo `rgb(76, 175, 80)` |
| 4 | Clicar no preset vermelho | `#F44336` | `#customColor` passa a `#f44336` |

**Critério de Aceite:** O preset escolhido define a cor de destaque do recibo.

**Notas Cypress:** os presets não têm `data-testid`; use `.color-preset[data-color="#4CAF50"]`.

#### TC-PER-002: Cor Personalizada

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Definir cor personalizada | `#ff0000` | `#accentColorHex` = `#ff0000` |
| 2 | Gerar | — | `.receipt-wrapper` com `--receipt-accent: #ff0000`; `.receipt-header` e `.receipt-total-box` com fundo `rgb(255, 0, 0)` |

**Critério de Aceite:** A cor personalizada é aplicada aos elementos de destaque.

**Notas Cypress:** `cy.get('#customColor').invoke('val', '#ff0000').trigger('input')`.

#### TC-PER-003: Seleção de Modelo

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar as opções do select | `#receiptTemplate` | 2 opções: "Modelo Padrão" (`default`) e "Modelo Detalhado" (`detailed`); padrão selecionado |
| 2 | Gerar no modelo padrão | — | Existe `.receipt-parties`; nenhum `.receipt-detailed-section` |
| 3 | Fechar, selecionar "Modelo Detalhado" e gerar | `detailed` | Existem `.receipt-detailed-section`; nenhum `.receipt-parties` |

**Critério de Aceite:** O modelo escolhido define o layout do recibo.

---

### 4.16 Módulo: Política de Privacidade

**Arquivo de teste:** `cypress/e2e/modules/politica-privacidade.cy.js` (novo)

#### TC-POL-001: Acesso e Conteúdo

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar o link no formulário | `label[for="privacy"] a` | `href` = `/src/html/politica-privacidade.html` |
| 2 | Abrir a página | — | Título da aba "Política de Privacidade — Recebi"; `h1` contém "Privacidade" |
| 3 | Verificar o conteúdo | — | 6 `.section-card`; texto "não coleta, armazena nem transmite" |
| 4 | Verificar a revelação progressiva | Rolar a página | `.section-card.visible` aumenta até todos os cards ficarem visíveis |

**Critério de Aceite:** A política está acessível e declara o tratamento de dados.

**Notas Cypress:** o link abre na **mesma aba**; clicar nele a partir do formulário preenchido descarta os dados (DEF-17). Para testar a página, visite-a diretamente.

#### TC-POL-002: Contato

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Localizar o contato | `a[href^="mailto:"]` | `href` = `mailto:nilton.f.o.junior@gmail.com` |

**Critério de Aceite:** O canal de contato está disponível.

**Notas Cypress:** a página informa "Última atualização: março de 2025"; confirme se a data ainda é válida.

---
## 5. Testes de Segurança e Privacidade

**Arquivo de teste:** `cypress/e2e/seguranca.cy.js`

#### TC-SEG-001: Transmissão Zero de Dados

**Prioridade:** P1 · **Status:** ✅ Automatizável (passos 1–4) · 🐞 DEF-01 (passo 5)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Registrar todas as requisições da página | `cy.intercept('**', req => requisicoes.push(req))` | — |
| 2 | Preencher todos os campos com dados sensíveis e gerar | CPF, CNPJ, nomes, valores, observações | Recibo gerado |
| 3 | Clicar em "Imprimir / Salvar PDF" | — | Nenhuma requisição `POST`, `PUT` ou `PATCH` |
| 4 | Verificar o conteúdo das requisições | — | Nenhuma URL ou corpo contém nome, CPF, CNPJ, valores ou observações digitados |
| 5 | 🐞 Verificar hosts contatados | — | Esperado (política de privacidade, SDD §4.1): nenhuma requisição leva dados digitados a terceiros. Atual: `GET viacep.com.br/ws/<CEP>/json/` envia o **CEP digitado** e `GET servicodados.ibge.gov.br/.../estados/<UF>/municipios` envia a UF |

**Critério de Aceite:** Zero requisições com dados do formulário, exceto as consultas de localidade documentadas.

**Notas Cypress:** a lista permitida de hosts nos passos 1–4 é: o próprio `baseUrl`, `fonts.googleapis.com`, `fonts.gstatic.com`, `viacep.com.br`, `servicodados.ibge.gov.br`. O passo 5 registra a divergência com a Política de Privacidade ("Nenhum dado digitado… é enviado a servidores externos"). Decisão pendente: ajustar o texto da política ou usar uma base local de cidades/CEP.

#### TC-SEG-002: CSP Headers

**Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-01) — escrever com `it.skip`

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar os headers HTTP da página | `cy.request('/src/html/form.html')` | Header `content-security-policy` presente |
| 2 | Verificar as diretivas | — | `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'self'` |
| 3 | Verificar `connect-src` | — | Conforme SDD §4.2: `'none'` |
| 4 | Tentar `fetch` manual | `fetch('https://exemplo.com')` na janela | Bloqueado pela CSP |

**Critério de Aceite:** CSP configurada conforme especificação; requisições não permitidas bloqueadas.

**Notas Cypress:** atual: o repositório não define CSP (nenhum `vercel.json` nem `<meta http-equiv>`). Além disso, `connect-src 'none'` e `script-src 'self'` quebrariam o app como está: ele consulta IBGE e ViaCEP, e `form.html` tem um script inline de inicialização. Defina a política real (com `connect-src` para esses dois hosts ou removendo a dependência) antes de escrever este teste.

#### TC-SEG-003: Sem Cookies de Rastreamento nem Persistência

**Prioridade:** P2 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Percorrer o fluxo completo (preencher, gerar, imprimir) | Massa válida | — |
| 2 | Verificar cookies | `cy.getCookies()` | Lista vazia |
| 3 | Verificar `localStorage` | — | `length` = 0 |
| 4 | Verificar `sessionStorage` | — | `length` = 0 |
| 5 | Recarregar a página | `cy.reload()` | Formulário volta ao estado inicial; nenhum dado restaurado |

**Critério de Aceite:** Zero cookies; dados não persistidos.

#### TC-SEG-004: Consentimento de Privacidade

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar o botão sem marcar o checkbox | — | Botão desabilitado |
| 2 | Marcar o checkbox | — | Botão habilitado |
| 3 | Desmarcar o checkbox | — | Botão desabilitado novamente |
| 4 | Gerar um recibo e desmarcar o checkbox com o preview aberto | `uncheck({ force: true })` | Sem efeito: o preview continua aberto e o recibo intacto |
| 5 | Verificar o link da política | — | Link "Política de Privacidade" presente ao lado do checkbox |

**Critério de Aceite:** Checkbox obrigatório para habilitar a geração.

#### TC-SEG-005: Escape de HTML nos Dados do Usuário

**Prioridade:** P1 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Informar HTML no nome do cliente | `<img src=x onerror="window.__xss1=1">Ana` | O recibo exibe o texto literal; nenhum `img[src="x"]` no recibo |
| 2 | Informar HTML nas observações | `<b>neg</b><script>window.__xss2=1</script>` | Texto literal em `.receipt-observations-text`; nenhum `<b>` interpretado |
| 3 | Informar HTML na descrição do serviço e no nome da empresa | `<i>x</i>` | Texto literal nos dois lugares |
| 4 | Verificar execução | — | `win.__xss1` e `win.__xss2` permanecem `undefined` |

**Critério de Aceite:** Nenhum dado digitado é interpretado como HTML.

**Notas Cypress:** a exceção conhecida é a URL da logo (TC-LOG-008, DEF-09).

#### TC-SEG-006: Origem dos Scripts

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Listar `script[src]` do formulário | — | Todos relativos à própria origem (`/src/js/...`) |
| 2 | Verificar bibliotecas de terceiros | — | Nenhum script de CDN externo |

**Critério de Aceite:** Nenhum código de terceiros é executado.

---

## 6. Testes de Interface e Acessibilidade

**Arquivo de teste:** `cypress/e2e/acessibilidade.cy.js`

> Recomenda-se `cypress-axe` (dependências `cypress-axe` e `axe-core`) para os passos de contraste e ARIA: `cy.injectAxe()` e `cy.checkA11y()`.

#### TC-A11-001: Labels Associados aos Campos

**Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-05) nos passos 1–2 · ✅ passo 3

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Percorrer todos os `input`, `select` e `textarea` visíveis do formulário | — | Cada campo tem um rótulo associado (`element.labels.length ≥ 1`) |
| 2 | Verificar campos sem rótulo | — | Nenhum campo órfão |
| 3 | Clicar no rótulo de um campo com `for` | `label[for="clientName"]` | O campo correspondente recebe foco |

**Critério de Aceite:** WCAG 2.1 — 1.3.1 Info and Relationships.

**Notas Cypress:** atual — campos **sem** rótulo associado: `input-receipt-type`, `input-date`, `input-logo-file`, `input-logo-url`, `input-client-document`, `input-beneficiary-document`, `select-establishment-state`, `input-establishment-zipcode`, todos os `input-service-name` e `input-service-value` (os rótulos da 1ª linha não têm `for`) e o seletor de cor `#customColor`. Campos **com** rótulo válido (use no passo 3): `clientName`, `clientPhone`, `providerName`, `providerPhone`, `carModel`, `carPlate`, `carYear`, `estName`, `estCitySelect`, `estNeighborhood`, `estStreet`, `estNumber`, `discountValue`, `observations`, `receiptTemplate`, `privacy`.

#### TC-A11-002: Navegação por Teclado

**Prioridade:** P2 · **Status:** 🟡 Parcial

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Pressionar Tab a partir do início da página | `cy.press(Cypress.Keys.Tab)` | Primeiro foco em `input-receipt-type` |
| 2 | Continuar com Tab | — | Ordem lógica: tipo → data (4 paradas no Chromium: segmentos do `type=date` e seletor de calendário) → abas de logo → arquivo de logo → … |
| 3 | Pressionar Space no checkbox de privacidade | `{ }` | Checkbox alterna |
| 4 | Pressionar Enter no botão "Gerar Recibo Agora" com o formulário válido | `{enter}` | Preview abre |
| 5 | Operar um `select` com o teclado | `.select()` | Valor alterado (a abertura da lista com Enter/Alt+↓ é verificação manual 🖐) |

**Critério de Aceite:** WCAG 2.1 — 2.1.1 Keyboard.

**Notas Cypress:** `{tab}` no `type()` não move o foco. Alternativas: `cy.press` (Cypress ≥ 14.3) ou `cypress-real-events` (`cy.realPress('Tab')`).

#### TC-A11-003: Contraste de Cores

**Prioridade:** P3 · **Status:** 🟡 Parcial (axe + inspeção visual)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar texto principal | `--text-primary` `#111827` sobre branco | Contraste ≥ 4,5:1 (medido: 17,74:1) |
| 2 | Verificar texto secundário | `--text-secondary` `#6b7280` sobre branco | Contraste ≥ 4,5:1 (medido: 4,83:1) |
| 3 | Verificar texto atenuado e placeholders | `--text-muted` `#9ca3af`; `--text-placeholder` `#d1d5db` | Contraste ≥ 4,5:1 (medido: 2,54:1 e 1,40:1) 🐞 |
| 4 | Verificar mensagens de erro | `--error` `#ef4444` sobre `#fff5f5` | Contraste ≥ 4,5:1 (medido: 3,52:1; texto de 0,68 rem) 🐞 |

**Critério de Aceite:** WCAG 2.1 — 1.4.3 Contrast (Minimum).

**Notas Cypress:** os valores acima são das **cores do tema** (calculadas), não de cada elemento; confirme onde são aplicadas como texto com `cy.checkA11y(null, { runOnly: ['color-contrast'] })`. Os passos 3 e 4 provavelmente falharão (DEF-05). O tema escuro **não existe** e foi removido deste caso.

#### TC-A11-004: Campos Obrigatórios Marcados

**Prioridade:** P2 · **Status:** 🐞 Defeito conhecido (DEF-05) nos passos 1–4 · 🖐 passo 5

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar marcador visual | — | Asterisco (`*`) nos campos obrigatórios (SDD §5.7) |
| 2 | Verificar `aria-required` | `form [required]` | Todos com `aria-required="true"` |
| 3 | Verificar `aria-invalid` após erro | Nome `A` e tentar gerar | `#clientName` com `aria-invalid="true"` |
| 4 | Verificar `aria-describedby` | — | Todo `aria-describedby` aponta para um elemento existente |
| 5 | Verificar o anúncio por leitor de tela | NVDA/VoiceOver | "obrigatório" após o rótulo |

**Critério de Aceite:** WCAG 2.1 — 3.3.2 Labels or Instructions.

**Notas Cypress:** atual — (1) não há asterisco; (2) falta `aria-required` em `input-receipt-type`, `input-date`, `input-service-name`, `input-service-value` e `input-privacy`; (3) `aria-invalid` nunca é definido; (4) `#clientPhone` e `#providerPhone` apontam para `clientPhoneErr` e `providerPhoneErr`, que não existem.

#### TC-A11-005: Gerenciamento de Foco e Anúncios no Preview

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo | Massa válida | Foco em "✕ Fechar" |
| 2 | Verificar a região viva | `#a11yLive` | Atributo `aria-live="polite"`; classe `sr-only`; texto de sucesso |
| 3 | Verificar o bloqueio do fundo | — | `body.style.overflow` = `hidden` |

**Critério de Aceite:** SDD §5.7 — Gerenciamento de Modal e Anúncios Dinâmicos.

#### TC-A11-006: Idioma e Título das Páginas

**Prioridade:** P3 · **Status:** 🐞 Defeito conhecido (DEF-05)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar o idioma da home | `/` | `<html lang="pt-BR">` |
| 2 | Verificar o idioma do formulário | `/src/html/form.html` | `<html lang="pt-BR">` |
| 3 | Verificar o título do formulário | — | "Recebi — Gerador de Recibo Online" |

**Critério de Aceite:** WCAG 2.1 — 3.1.1 Language of Page.

**Notas Cypress:** atual — `form.html` tem `lang="en"` e título "recibi - Gerador de Recibo Online" (erro de grafia). A home está correta.

---

## 7. Testes de Impressão e PDF

**Arquivo de teste:** `cypress/e2e/impressao.cy.js`

> Para os passos automatizáveis, gere um recibo e emule a mídia de impressão (somente Chromium): `Cypress.automation('remote:debugger:protocol', { command: 'Emulation.setEmulatedMedia', params: { media: 'print' } })`. Restaure para `screen` no `after`/`afterEach`.

#### TC-IMP-001: CSS @media print — Formulário Oculto

**Prioridade:** P1 · **Status:** ✅ Automatizável (Chromium)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo e emular `print` | — | — |
| 2 | Verificar o formulário | `main` | `display: none` |
| 3 | Verificar o recibo | `#printContainer` | `display: block` |
| 4 | Verificar botões de ação | `.print-actions` | `display: none` |
| 5 | Verificar cabeçalho e rodapé da página | `body > header` | `display: none` |

**Critério de Aceite:** Apenas o recibo aparece na impressão.

**Notas Cypress:** o app oculta tudo o que é filho direto de `body` e não é `#printContainer`.

#### TC-IMP-002: CSS @media print — Layout A4

**Prioridade:** P2 · **Status:** ✅ Automatizável (Chromium)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Localizar as regras `@page` | `document.styleSheets` → `CSSPageRule` | `size: A4` |
| 2 | Verificar as margens da página | — | `margin-top` e `margin-bottom` de 24 mm; laterais 0; primeira página com margem 0 e `margin-bottom` de 24 mm |
| 3 | Verificar o recibo | `.receipt-wrapper` em `print` | Largura 100%, sem sombra e sem borda arredondada |

**Critério de Aceite:** Recibo formatado para papel A4.

**Notas Cypress:** o SDD §5.6 descreve margens de 15 mm e fonte de 11 pt; o app usa margens de 24 mm no topo/rodapé e não define 11 pt (o corpo do recibo mede 16 px). Trate como divergência de documentação (DIV-01): este caso fixa o comportamento atual.

#### TC-IMP-003: Cores na Impressão

**Prioridade:** P3 · **Status:** 🟡 Parcial

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Escolher a cor `#4CAF50`, gerar e emular `print` | — | `.receipt-header` com fundo `rgb(76, 175, 80)` e `print-color-adjust: exact` |
| 2 | Verificar o total | `.receipt-total-box` | Fundo igual à cor de destaque, com `print-color-adjust: exact` |
| 3 | Verificar os cards | `.receipt-vehicle-card` | Fundo `rgb(243, 244, 246)` e borda cinza |
| 4 | Verificar legibilidade em preto e branco | Pré-visualização do navegador | Texto legível; logo reconhecível 🖐 |

**Critério de Aceite:** Cores de destaque preservadas na impressão e texto legível.

**Notas Cypress:** o SDD §5.6 prevê impressão monocromática "sem fundos coloridos"; o app **força** as cores (DIV-01). Decida qual comportamento vale e ajuste este caso.

#### TC-IMP-004: Salvar como PDF

**Prioridade:** P2 · **Status:** 🖐 Manual

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar um recibo e clicar em "Imprimir / Salvar PDF" | — | Diálogo de impressão com o destino "Salvar como PDF" |
| 2 | Verificar o nome sugerido | — | `DD.MM.AAAA - Cliente - Modelo` |
| 3 | Salvar e abrir o PDF | — | Recibo completo e legível, em A4 |
| 4 | Verificar a logo no PDF | Recibo com logo | Logo renderizada corretamente |
| 5 | Verificar documento longo | 50 serviços, modelo detalhado | Várias páginas sem quebras que cortem a tabela ou o total |

**Critério de Aceite:** O PDF contém todos os dados, em formato A4.

---

## 8. Testes de Navegadores e Dispositivos

**Arquivo de teste:** `cypress/e2e/compatibilidade.cy.js`

> **Estratégia.** Os casos BRW-001 a BRW-004 são **o mesmo teste de fumaça** executado em navegadores diferentes (`npx cypress run --browser chrome|firefox|edge`). Escreva um único `describe` com o fluxo (abrir → preencher → gerar → imprimir com stub) e rode-o por navegador. Os casos BRW-005 a BRW-007 usam `cy.viewport()`.

#### TC-BRW-001: Compatibilidade Chrome

**Prioridade:** P1 · **Status:** ✅ Automatizável (`--browser chrome`)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a aplicação | Chrome (stable) | Página carrega corretamente |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros no console |
| 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |

**Critério de Aceite:** 100% da funcionalidade no Chrome.

#### TC-BRW-002: Compatibilidade Firefox

**Prioridade:** P2 · **Status:** ✅ Automatizável (`--browser firefox`)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a aplicação, clicar em "Gerar Recibo" na home | Firefox (stable) | Navega para o formulário (o botão está dentro de um `<a>`) |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 3 | Imprimir | Stub de `window.print` | Chamado 1 vez; diálogo real verificado manualmente 🖐 |

**Critério de Aceite:** 100% da funcionalidade no Firefox.

#### TC-BRW-003: Compatibilidade Safari

**Prioridade:** P2 · **Status:** 🖐 Manual (ou WebKit experimental do Cypress)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a aplicação | Safari (stable) | Página carrega corretamente |
| 2 | Simular impressão | Cmd+P | Layout não quebrado |
| 3 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 4 | Verificar `input[type=date]` e `input[type=color]` | — | Controles utilizáveis |

**Critério de Aceite:** Layout de impressão não quebrado no Safari.

#### TC-BRW-004: Compatibilidade Microsoft Edge

**Prioridade:** P3 · **Status:** ✅ Automatizável (`--browser edge`)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a aplicação | Edge (stable) | Página carrega corretamente |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 3 | Imprimir | Stub de `window.print` | Chamado 1 vez |

**Critério de Aceite:** 100% da funcionalidade no Edge.

#### TC-BRW-005: Responsividade Mobile (iOS)

**Prioridade:** P2 · **Status:** 🟡 Parcial (layout automatizável; Safari iOS real é manual)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir com viewport de iPhone | `cy.viewport(375, 667)` | Grades `.grid-2`, `.grid-3` e `.grid-cards` em 1 coluna; sem rolagem horizontal |
| 2 | Preencher o formulário | Massa válida | Campos acessíveis; linha de serviço em 2 colunas (descrição na linha de cima; valor e "×" embaixo) |
| 3 | Testar a dropzone | `selectFile` | Upload funcional |
| 4 | Gerar o recibo | — | `.receipt-wrapper` não excede a largura da viewport; legibilidade conferida manualmente 🖐 |

**Critério de Aceite:** Layout mobile funcional.

#### TC-BRW-006: Responsividade Mobile (Android)

**Prioridade:** P2 · **Status:** 🟡 Parcial

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir com viewport Android | `cy.viewport(360, 640)` | Layout em coluna única; sem rolagem horizontal |
| 2 | Preencher o formulário | Massa válida | Campos acessíveis; rolagem funcional |
| 3 | Testar a dropzone | `selectFile` | Upload funcional |
| 4 | Gerar o recibo | — | Recibo dentro da largura da viewport |

**Critério de Aceite:** Layout mobile funcional.

#### TC-BRW-007: Responsividade Tablet e Pontos de Quebra

**Prioridade:** P3 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Viewport de tablet | `cy.viewport(768, 1024)` | `.grid-2` e `.grid-cards` com 2 colunas; `.grid-3` com 3 colunas; sem rolagem horizontal |
| 2 | Viewport no limite | `cy.viewport(640, 900)` | Todas as grades em 1 coluna |
| 3 | Viewport logo acima do limite | `cy.viewport(641, 900)` | `.grid-2`, `.grid-cards` e `.grid-3` voltam a múltiplas colunas |
| 4 | Verificar espaçamento | — | Padding lateral adequado (inspeção visual 🖐) |

**Critério de Aceite:** Layout adaptado para tablet.

**Notas Cypress:** o ponto de quebra do app é **640 px** (`max-width: 640px`); o SDD §5.5 fala em 768 px (DIV-02). Leia as colunas com `getComputedStyle(el).gridTemplateColumns.split(' ').length`.

---

## 9. Testes de SEO e PWA

**Arquivo de teste:** `cypress/e2e/seo-pwa.cy.js` (novo)

#### TC-SEO-001: Metadados da Página Inicial

**Prioridade:** P4 · **Status:** ✅ Automatizável

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar título e descrição | `/` | Título "Recebi — Gerador de Recibos Online Grátis"; `meta[name=description]` preenchida |
| 2 | Verificar `canonical` | — | `link[rel=canonical]` com `href` definido |
| 3 | Verificar Open Graph | — | `og:type`, `og:url`, `og:title`, `og:description`, `og:image` presentes |
| 4 | Verificar Twitter Card | — | `twitter:card` = `summary_large_image` |
| 5 | Verificar `theme-color` e `manifest` | — | `meta[name=theme-color]` = `#3D95C5`; `link[rel=manifest]` = `/manifest.json` |
| 6 | Verificar JSON-LD | `script[type="application/ld+json"]` | JSON válido; `@type` = `WebApplication`; `offers.price` = `0`; `priceCurrency` = `BRL` |

**Critério de Aceite:** Metadados completos e consistentes.

#### TC-SEO-002: Manifest e Ícones

**Prioridade:** P4 · **Status:** ✅ Automatizável (passo 1) · 🐞 DEF-13 (passos 2–3)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Ler `/manifest.json` | `cy.request` | `name` e `short_name` = "Recebi"; `start_url` = `/index.html`; `display` = `standalone`; `theme_color` = `#3D95C5` |
| 2 | 🐞 Requisitar cada ícone do manifest | `assets/icons/icon-192.png`, `assets/icons/icon-512.png` | Status 200 e `content-type` de imagem. Atual: os arquivos **não existem no repositório** |
| 3 | 🐞 Requisitar a imagem Open Graph | `/assets/og/recebi-og.jpg` | Status 200. Atual: arquivo inexistente no repositório |

**Critério de Aceite:** Manifest válido, com ícones e imagem social acessíveis.

#### TC-SEO-003: robots.txt e sitemap.xml

**Prioridade:** P4 · **Status:** ✅ Automatizável (passos 1–2) · 🐞 DEF-13 (passo 3)

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Ler `/robots.txt` | — | Contém `User-agent: *`, `Allow: /src/html/form.html` e a linha `Sitemap:` |
| 2 | Ler `/sitemap.xml` | — | XML com 3 `<url>`: home, formulário e política de privacidade |
| 3 | 🐞 Comparar domínios | — | Esperado: o mesmo domínio em `canonical`, `og:url`, JSON-LD, `robots.txt` e `sitemap.xml`. Atual: `canonical`/`og:url`/JSON-LD/`Sitemap:` usam `recebi.com.br`; o `sitemap.xml` lista `recebi-ten.vercel.app` |

**Critério de Aceite:** Arquivos de indexação consistentes.

---
## 10. Defeitos Conhecidos e Pendências

Esta seção reúne as divergências entre o **SDD** e o **comportamento atual**, encontradas ao verificar a aplicação. Cada item indica os casos de teste afetados. Quando o defeito for corrigido, remova o `it.skip` do caso e ajuste a nota correspondente.

### 10.1 Defeitos (o app diverge do SDD)

| ID | Severidade | Descrição | Evidência | Casos afetados | Sugestão de correção |
|----|-----------|-----------|-----------|----------------|----------------------|
| DEF-01 | Alta | **Sem CSP; app consulta serviços externos com dados digitados.** O SDD §4.2 exige `connect-src 'none'`; não há `vercel.json` nem `<meta>` de CSP. Selecionar o estado chama o IBGE e sair do CEP chama o ViaCEP (envia o **CEP digitado**). O SDD §3.7 previa cidades em JSON local, e a Política de Privacidade afirma que nenhum dado digitado é enviado a servidores externos | `location.js` (`fetch`); ausência de headers/meta | SEG-001 (passo 5), SEG-002, SEG-006, EST-001 a EST-006 | Definir CSP no host; embutir cidades em JSON local e remover/ajustar a consulta de CEP, **ou** alterar a política e o SDD e liberar apenas esses hosts em `connect-src` |
| DEF-02 | Média | **Sem Subtotal/Desconto no recibo e sem total no formulário.** O recibo exibe só o Total; o formulário não mostra total em tempo real (SDD §3.8, §5.4) | `receipt-builder.js`; `services.js` (`updateServiceTotal` só atualiza a barra) | SRV-001, SRV-008 | Exibir total na lista de serviços; no recibo, linhas "Subtotal", "Desconto" e "Total Geral" |
| DEF-03 | Média | **Rodapé detalhado nunca aparece.** `footerStyle` é um `<input type=hidden>` fixo em `"minimal"`; o modelo detalhado não exibe blocos de assinatura (SDD §3.10) | `form.html` (`name="footerStyle" value="minimal"`) | GER-004 (passo 5) | Escolher o rodapé pelo modelo (detalhado → assinaturas) ou oferecer a opção ao usuário |
| DEF-04 | Média | **Data inicial calculada em UTC.** `new Date().toISOString()` adianta a data após as 21h no Brasil (UTC-3). Medido: às 23:30 de 20/10 o campo vem com `2026-10-21` | `form.js` (`initForm`) | FRM-001 (passo 6), INF-002 (passo 1) | Montar `AAAA-MM-DD` com `getFullYear/getMonth/getDate` locais |
| DEF-05 | Média | **Acessibilidade.** Campos sem `label for` (lista em TC-A11-001); `aria-required` ausente em tipo, data, serviços e privacidade; `aria-invalid` nunca definido; `aria-describedby` de celular aponta para elementos inexistentes; sem asterisco; `lang="en"` e título "recibi" em `form.html`; contraste baixo em placeholders, texto atenuado e mensagens de erro | Inspeção do DOM e cálculo de contraste | A11-001, A11-003, A11-004, A11-006, PRE-003 (título) | Associar rótulos; completar ARIA; criar `#clientPhoneErr` e `#providerPhoneErr`; `lang="pt-BR"`; corrigir título; ajustar cores |
| DEF-06 | Média | **Celular.** DDD não é validado (`(00)` e `(99)` aceitos); não existe o elemento de mensagem `#clientPhoneErr`; o celular do beneficiário não é validado no envio (aceita `12`) | `validator.js` (`isValidPhone`); `form.js` | CLI-005, BEN-004 | Validar DDD; criar os spans de erro; validar `providerPhone` quando preenchido |
| DEF-07 | Baixa | **Ano sem máscara.** `maskYear` existe, mas não está ligada ao campo; aceita letras e mais de 4 caracteres até o envio | `masks.js`; `form.html` | MSK-006, VEI-003 | Ligar `oninput="maskYear(this)"` ou usar `inputmode="numeric"` com `maxlength="4"` |
| DEF-08 | Baixa | **Erro de digitação:** "CPF ou CPNJ inválidos" na mensagem do cliente | `form.html` (`#clientDocErr`) | CLI-004 | Corrigir para "CPF ou CNPJ inválido" |
| DEF-09 | Média | **Logo.** (a) URL sem validação nem prévia (SDD §3.3); (b) a URL é interpolada **sem escape** em `<img src="…">`: um valor com aspas injeta atributos e executa código (XSS no próprio usuário); (c) arquivos GIF/BMP etc. passam por arraste (`image/*`); (d) o sanitizador de SVG só remove atributos com aspas duplas | `receipt-builder.js`; `logo.js` | LOG-003 (passo 5), LOG-005, LOG-006 (passo 4), LOG-008 | Escapar `resolvedLogo` (ou criar o `<img>` via DOM); validar a URL; whitelist de MIME; sanitizar SVG com parser (DOMParser) |
| DEF-10 | Média | **Erros sem mensagem visível.** CEP, estado, cidade, bairro, rua e número só ganham `.field-invalid` ou foco; o CSS estiliza apenas `input.field-invalid`, então `select` não muda de aparência | `form.js`; `template.css` | EST-003, EST-007, CLI-005 | Mensagens inline para esses campos; estilizar `select.field-invalid` |
| DEF-11 | Baixa | **Preview (modal).** Esc não fecha; ao fechar, o foco não volta ao botão de origem | `receipt-builder.js` (`closePreview`) | PRE-005, A11-005 | Tratar `keydown` Esc e restaurar o foco |
| DEF-12 | Média | **Valores negativos.** Serviço com valor negativo é aceito (se outro serviço for válido) e desconto negativo aumenta o total (SDD §3.11: "número positivo") | `form.js`; `services.js` | SRV-006, SRV-007 | `min="0.01"` no valor do serviço, `min="0" max="100"` no desconto, e validação no código |
| DEF-13 | Baixa | **SEO/PWA.** Ícones do manifest (`assets/icons/icon-192.png`, `icon-512.png`) e `og:image` (`/assets/og/recebi-og.jpg`) não existem no repositório; `canonical`, `og:url`, JSON-LD e `robots.txt` usam `recebi.com.br`, enquanto o `sitemap.xml` usa `recebi-ten.vercel.app` | `manifest.json`; `index.html`; `sitemap.xml` | SEO-001 a SEO-003 | Adicionar os arquivos; unificar o domínio |
| DEF-14 | Baixa | **Barra de progresso.** O checkbox de privacidade sempre conta como preenchido (valor `"on"`) e uma nova linha de serviço não recalcula a barra | `form.js` (`updateProgress`) | FRM-006 | Contar apenas campos de texto; chamar `updateProgress()` ao adicionar linha |
| DEF-15 | Baixa | **Formato da data no recibo.** O SDD §3.2 prevê "16 de abril de 2026"; o app imprime `16/04/2026` (`Utils.formatDateLong` existe, mas não é usada) | `receipt-builder.js` | INF-002 | Usar `Utils.formatDateLong` (ou atualizar o SDD) |
| DEF-16 | Baixa | **Obrigatoriedade mais rígida que o SDD.** Celular do beneficiário (§3.5) e Placa (§3.6) são opcionais no SDD, mas `required` no app | `form.html` | BEN-001, VEI-001, VEI-002 | Decidir e alinhar app ou SDD |
| DEF-17 | Baixa | **Link da Política de Privacidade abre na mesma aba**, descartando o formulário preenchido | `form.html` (`label[for=privacy] a`) | POL-001 | Adicionar `target="_blank" rel="noopener"` |

### 10.2 Divergências de documentação (SDD desatualizado ou ambíguo)

Estas não são necessariamente defeitos do app; decida se o app ou o SDD deve mudar. Os testes fixam o **comportamento atual**.

| ID | Divergência | Casos afetados |
|----|-------------|----------------|
| DIV-01 | SDD §5.6: impressão com margens de 15 mm, fonte de 11 pt e **monocromática**. App: `@page` A4 com margens de 24 mm (topo/rodapé), sem 11 pt, e cores de destaque **forçadas** (`print-color-adjust: exact`) | IMP-002, IMP-003 |
| DIV-02 | SDD §5.5: coluna única abaixo de 768 px. App: ponto de quebra em **640 px** | BRW-005 a BRW-007 |
| DIV-03 | SDD §3.11: o campo inválido recebe `.field-error`. App: o campo recebe `.field-invalid` e `.field-error` é a mensagem | VAL-003 |
| DIV-04 | SDD §3.10 (passo 5): gerar "aciona `window.print()`". App: abre um preview e só imprime pelo botão (coerente com SDD §5.7) | FRM-003, PRE-003 |
| DIV-05 | SDD §5.4: notificações *toast* ("Logo removida", "Serviço adicionado"). App: não há toasts | — |
| DIV-06 | SDD §3.11: "Tipo do Recibo não pode estar no estado padrão", mas §3.2 define o valor padrão "Recibo de Pagamento" e campo livre | INF-001 |
| DIV-07 | SDD §5.4: botão com *spinner* durante "Gerando…". O estado é síncrono e imperceptível | FRM-003 |
| DIV-08 | O SDD define apenas a **máscara** da placa; a v1.0 do TDD exigia mensagens "Placa incompleta/inválida", que não estão especificadas | VEI-002 |
| DIV-09 | SDD §3.10: "marca d'água no fundo do documento". App: imagem decorativa semitransparente no **rodapé** | GER-005 |
| DIV-10 | Política de Privacidade: "Última atualização: março de 2025" | POL-002 |

### 10.3 Como tratar defeitos nos testes

1. Escreva o teste do comportamento **esperado** e marque `it.skip('…', () => { /* DEF-xx */ })`; ou
2. Escreva um teste que **fixa o comportamento atual**, com o comentário `// DEF-xx: comportamento atual; inverter após correção`.
3. Ao corrigir o defeito, troque `it.skip` por `it`, remova as notas e atualize esta seção.

---

## 11. Critérios de Aceite

### 11.1 Fase 1 (MVP)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-01 | Recibo gerado com dados completos | TC-GER-001, TC-FRM-003 |
| CA-02 | Impressão aciona o diálogo do navegador | TC-PRE-003, TC-IMP-001, TC-IMP-004 |
| CA-03 | Nenhum dado digitado enviado a servidores externos | TC-SEG-001 (ver DEF-01) |
| CA-04 | Campos obrigatórios validados | TC-FRM-005, TC-VAL-001, TC-VAL-002 |

### 11.2 Fase 2 (Qualidade)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-05 | CPF/CNPJ validados corretamente | TC-CLI-003, TC-CLI-004, TC-BEN-002, TC-BEN-003, TC-VAL-004 |
| CA-06 | Máscaras aplicadas corretamente | TC-MSK-001 a TC-MSK-006 |
| CA-07 | Erros exibidos inline e removidos ao corrigir | TC-VAL-001, TC-VAL-003 |

### 11.3 Fase 3 (Logo e Visual)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-08 | Upload de logo funciona | TC-LOG-001, TC-LOG-002, TC-LOG-007 |
| CA-09 | Logos validadas e sanitizadas | TC-LOG-003, TC-LOG-004, TC-LOG-006, TC-LOG-008 (ver DEF-09) |
| CA-10 | URL de logo funcional | TC-LOG-005 |
| CA-11 | Cor de destaque e modelo de recibo aplicados | TC-PER-001 a TC-PER-003, TC-GER-003, TC-GER-004 |

### 11.4 Fase 4 (Localização)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-12 | Cidades carregadas por estado | TC-EST-002, TC-EST-006 |
| CA-13 | Endereço preenchido por CEP | TC-EST-004, TC-EST-005 |

### 11.5 Fase 5 (PWA e SEO)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-14 | Manifest funcional, com ícones acessíveis | TC-SEO-002 (ver DEF-13) |
| CA-15 | Metadados SEO corretos | TC-SEO-001 |
| CA-16 | JSON-LD válido | TC-SEO-001 (passo 6) e Google Rich Results (manual) |

### 11.6 Fase 6 (Polimento)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-17 | Score Lighthouse > 90 | Auditoria Lighthouse (manual) |
| CA-18 | Acessibilidade WCAG AA | TC-A11-001 a TC-A11-006 (ver DEF-05) |
| CA-19 | Layout responsivo | TC-BRW-005 a TC-BRW-007 |

> O critério "Tema escuro funcional" da v1.0 foi removido: o tema escuro não existe no produto.

---

## 12. Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | Abril 2026 | QA Team | Versão inicial, escrita a partir do SDD v1.0 |
| 2.0 | Outubro 2026 | QA Team | Reescrita a partir do comportamento verificado da aplicação: dados de teste corrigidos (CPF/CNPJ, placa, máscaras, anos); novos módulos (Home, Preview, Personalização, Política, SEO/PWA); casos ampliados (EST-004 a 007, SRV-006/009, LOG-007/008, SEG-005/006, A11-005/006 e outros); preenchidas as lacunas TC-SRV-006 e TC-GER-003; seção de defeitos conhecidos; notas de implementação para Cypress; apêndices de massa de dados, seletores e comandos |

---

## Apêndice A — Massa de Dados

### A.1 Documentos

| Tipo | Valor | Máscara | Validade |
|------|-------|---------|----------|
| CPF | `52998224725` | `529.982.247-25` | ✅ válido |
| CPF | `11144477735` | `111.444.777-35` | ✅ válido |
| CPF | `12345678909` | `123.456.789-09` | ✅ válido |
| CPF | `52998224763` | `529.982.247-63` | ❌ dígito verificador errado |
| CPF | `00000000000` | `000.000.000-00` | ❌ sequência repetida |
| CPF | `11111111111` | `111.111.111-11` | ❌ sequência repetida |
| CPF | `5299822` | `529.982.2` | ❌ incompleto |
| CNPJ | `11444777000161` | `11.444.777/0001-61` | ✅ válido |
| CNPJ | `55773812000161` | `55.773.812/0001-61` | ✅ válido |
| CNPJ | `12345678000195` | `12.345.678/0001-95` | ✅ válido |
| CNPJ | `11444777000162` | `11.444.777/0001-62` | ❌ dígito verificador errado |
| CNPJ | `1144477700016` | `11.444.777/0001-6` | ❌ 13 dígitos |
| CNPJ | `11111111111111` | `11.111.111/1111-11` | ❌ sequência repetida |

### A.2 Celular, CEP, placa e ano

| Campo | Entrada | Exibido | Aceito no envio? |
|-------|---------|---------|------------------|
| Celular | `11999998888` | `(11) 99999-8888` | Sim |
| Celular | `1199998888` | `(11) 9999-8888` | Sim |
| Celular | `99998888` | `(99) 9988-88` | Não |
| Celular | `00999998888` | `(00) 99999-8888` | Sim 🐞 DEF-06 |
| CEP | `01310100` | `01310-100` | Sim |
| CEP | `01310` | `01310` | Não |
| Placa | `ABC1D23` | `ABC-1D23` | Sim |
| Placa | `ABC1234` | `ABC-1234` | Sim |
| Placa | `ABD1X23` | `ABD-1X23` | Sim (**é** uma placa Mercosul válida) |
| Ano | `1900` | `1900` | Sim |
| Ano | `<ano atual>+1` | — | Sim |
| Ano | `1899`, `<ano atual>+2`, `999`, `20245`, `abcd` | — | Não |

### A.3 Fixture do formulário completo

Salve como `cypress/fixtures/recibo-valido.json`:

```json
{
  "receiptType": "Recibo de Pagamento",
  "issueDate": "2020-01-15",
  "clientName": "João Silva",
  "clientDoc": "52998224725",
  "clientPhone": "11999998888",
  "providerName": "Maria Ltda",
  "providerDoc": "11444777000161",
  "providerPhone": "21987654321",
  "carModel": "Fiat Strada",
  "carPlate": "ABC1D23",
  "carYear": "2024",
  "estName": "Lava-jato Express",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Centro",
  "cep": "01310100",
  "street": "Av. Paulista",
  "number": "1000",
  "observations": "Garantia de 30 dias",
  "services": [
    { "name": "Lavagem completa", "value": "50.00" },
    { "name": "Cera", "value": "30.00" }
  ]
}
```

### A.4 Totais de referência

| Serviços | Desconto | Total no recibo |
|----------|----------|-----------------|
| `50,00` + `30,00` | — | `R$ 80,00` |
| `50,00` + `30,00` | 10% | `R$ 72,00` |
| `50,00` + `30,00` | 12,5% | `R$ 70,00` |
| `50,00` + `30,00` | 100% ou 150% | `R$ 0,00` |
| `10,50` + `20,30` + `15,20` | — | `R$ 46,00` |
| `1234,50` | — | `R$ 1.234,50` |

### A.5 Dados da v1.0 corrigidos

| Item da v1.0 | Problema | Correção na v2.0 |
|--------------|----------|------------------|
| CPF `529.982.247-62` | Inválido | `529.982.247-25` |
| CPF `123.456.789-09` como inválido | É um CPF **válido** | Usar `111.111.111-11` como sequência inválida |
| CNPJ `55.773.812/0001-55` | Inválido | `55.773.812/0001-61` |
| CNPJ `12.345.678/0001-90` | Inválido | `12.345.678/0001-95` |
| Placa `ABD-1X23` como inválida | É uma placa Mercosul válida | Removida como exemplo de inválida |
| Celular `1199998888` → `(11) 99999-8888` | 10 dígitos geram `(11) 9999-8888` | Usar 11 dígitos |
| Celular `999998888` → `(99) 99998-8888` | Resultado real `(99) 9998-888` | Caso removido |
| Máscaras parciais `529.982.247-__`, `01310-___` | O app não completa com `_` | `529.982.247`, `01310` |
| Anos `2027` e `2050` fixos | Dependem do ano corrente | Calcular com `new Date().getFullYear()` |
| Tipo de recibo como select de 4 opções | É um campo de texto livre | TC-INF-001 reescrito |
| Data "15 de janeiro de 2020" | App imprime `15/01/2020` | TC-INF-002 + DEF-15 |

---

## Apêndice B — Mapa de Seletores

### B.1 Página inicial (`/`)

| Elemento | Seletor |
|----------|---------|
| Botão "Gerar Recibo" | `[data-testid="btn-start-form"]` |
| Link do GitHub | `header a[aria-label="Ver código-fonte no GitHub"]` (sugestão: `data-testid="link-github"`) |

### B.2 Formulário (`/src/html/form.html`)

| Campo | `data-testid` | `id` / `name` | Mensagem de erro |
|-------|---------------|---------------|------------------|
| Tipo do recibo | `input-receipt-type` | `receiptType` | — |
| Data de emissão | `input-date` | `issueDate` | — |
| Aba de upload | `btn-tab-upload` | `#tabUpload` | — |
| Aba de URL | `btn-tab-url` | `#tabUrl` | — |
| Dropzone da logo | `dropzone-logo` | `#logoDropArea` | — |
| Input de arquivo da logo | `input-logo-file` | `#logoFileInput` | alerta nativo |
| Prévia da logo | — | `#logoPreviewImg`, `#logoPreviewArea`, `#logoPlaceholder` | — |
| Remover logo | `btn-remove-logo` | `#logoClearBtn` | — |
| URL da logo | `input-logo-url` | `#logoUrlInput` (`logoUrl`) | — |
| Nome do cliente | `input-client-name` | `#clientName` | `#clientNameErr` |
| CPF/CNPJ do cliente | `input-client-document` | `#clientDoc` | `#clientDocErr` |
| Celular do cliente | `input-client-phone` | `#clientPhone` | *(não existe)* |
| Nome do beneficiário | `input-beneficiary-name` | `#providerName` | `#providerNameErr` |
| CPF/CNPJ do beneficiário | `input-beneficiary-document` | `#providerDoc` | `#providerDocErr` |
| Celular do beneficiário | `input-beneficiary-phone` | `#providerPhone` | *(não existe)* |
| Modelo do veículo | `input-vehicle-model` | `#carModel` | `#carModelErr` |
| Placa | `input-vehicle-plate` | `#carPlate` | — |
| Ano | `input-vehicle-year` | `#carYear` | `#carYearErr` |
| Nome da empresa | `input-establishment-name` | `#estName` | `#estNameErr` |
| Estado | `select-establishment-state` | `#estStateSelect` | — |
| Cidade | `select-establishment-city` | `#estCitySelect` | — |
| Bairro | `input-establishment-neighborhood` | `#estNeighborhood` | — |
| CEP | `input-establishment-zipcode` | `#estCep` (+ `#cepSpinner`, `#cepSuccess`) | — |
| Rua | `input-establishment-street` | `#estStreet` | — |
| Número | `input-establishment-number` | `#estNumber` | — |
| Descrição do serviço | `input-service-name` (um por linha) | `name="serviceName[]"` | — |
| Valor do serviço | `input-service-value` (um por linha) | `name="serviceValue[]"` | — |
| Remover serviço | `btn-remove-service` (um por linha) | — | — |
| Linha de serviço | — | `.service-row`, container `#servicesContainer` | — |
| Adicionar serviço | `btn-add-service` | `.btn-add` (1º) | — |
| Adicionar desconto | `btn-add-discount` | `#discountContainer` | — |
| Desconto (%) | `input-discount-value` | `#discountValue` | — |
| Observações | `input-observations` | `#observations`, contador `#observationsCount` | — |
| Cores sugeridas | — | `.color-preset[data-color="#RRGGBB"]` | — |
| Cor personalizada | — | `#customColor`; valor final em `#accentColorHex` | — |
| Modelo do recibo | — | `#receiptTemplate` (`default` / `detailed`) | — |
| Privacidade | `input-privacy` | `#privacy` | — |
| Gerar | `btn-generate` | `.btn-submit` | — |
| Barra de progresso | — | `#stepFill` | — |
| Formulário | — | `#receiptForm` | — |

### B.3 Preview e recibo

| Elemento | Seletor |
|----------|---------|
| Container do preview | `#printContainer` (visível com `.visible`) |
| Conteúdo | `#receiptContent` > `.receipt-wrapper` |
| Fechar | `[data-testid="btn-close-preview"]` |
| Imprimir | `[data-testid="btn-print-receipt"]` |
| Região viva | `#a11yLive` |
| Tipo do recibo (padrão) | `.receipt-type` |
| Nome do estabelecimento | `.receipt-est-name` (no detalhado é o `h1` do tipo) |
| Endereço do cabeçalho | `.receipt-est-address` |
| Data / cidade | `.receipt-date-value` / `.receipt-city` |
| Logo | `.receipt-logo` |
| Cards de cliente e beneficiário | `.receipt-party-card` (`.receipt-party-name`, `.receipt-party-detail`) |
| Veículo | `.receipt-vehicle-card`, `.receipt-vehicle-info` |
| Tabela de serviços | `.receipt-table tbody tr` |
| Total | `.receipt-total-value` (padrão), `.receipt-detailed-total-row` (detalhado) |
| Observações | `.receipt-observations`, `.receipt-observations-text` |
| Rodapé / carimbo | `.receipt-footer-signature-email`, `.receipt-footer-timestamp` |
| Modelo detalhado | `.receipt-detailed-section`, `.receipt-detailed-title`, `.receipt-detailed-row` |
| Conteúdo longo | `.receipt-long-content` (no `.receipt-wrapper`) |

### B.4 Sugestão de novos `data-testid`

Para tornar os testes menos frágeis, adicione ao app: `link-github`, `link-privacy-policy`, `input-custom-color`, `select-receipt-template`, `receipt-wrapper`, `receipt-total`, `receipt-type` e `color-preset` (com `data-color`).

---

## Apêndice C — Comandos Cypress de Apoio

Em `cypress/support/commands.js`:

```js
const MUNICIPIOS = {
  SP: ['Campinas', 'Santos', 'São Paulo'],
  RJ: ['Niterói', 'Rio de Janeiro'],
  MG: ['Belo Horizonte', 'Uberlândia'],
  AM: ['Manaus', 'Parintins'],
}

const tid = (id) => `[data-testid="${id}"]`

// Resposta "neutra" do ViaCEP: não altera nenhum campo do formulário.
const VIACEP_NEUTRO = {}

Cypress.Commands.add('mockLocalidades', () => {
  cy.intercept(
    'GET',
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados/*/municipios*',
    (req) => {
      const uf = req.url.match(/estados\/([A-Z]{2})\//)[1]
      const nomes = MUNICIPIOS[uf] || ['Cidade Teste']
      req.reply({ statusCode: 200, body: nomes.map((nome) => ({ nome })) })
    }
  ).as('ibge')
})

Cypress.Commands.add('mockViaCep', (corpo = VIACEP_NEUTRO) => {
  cy.intercept('GET', 'https://viacep.com.br/ws/*/json/', {
    statusCode: 200,
    body: corpo,
  }).as('viacep')
})

// Abre o formulário já com APIs externas simuladas e window.print em stub.
Cypress.Commands.add('abrirFormulario', () => {
  cy.mockLocalidades()
  cy.mockViaCep()
  cy.visit('/src/html/form.html', {
    onBeforeLoad(win) {
      cy.stub(win, 'print').as('print')
    },
  })
})

// Preenche o formulário com a massa válida (cypress/fixtures/recibo-valido.json),
// permitindo sobrescrever campos. Use '' para deixar um campo opcional vazio.
Cypress.Commands.add('preencherFormulario', (sobrescrever = {}) => {
  cy.fixture('recibo-valido').then((base) => {
    const d = { ...base, ...sobrescrever }
    const digitar = (id, texto) => {
      if (texto) cy.get(tid(id)).clear().type(texto)
    }

    digitar('input-receipt-type', d.receiptType)
    digitar('input-date', d.issueDate)
    digitar('input-client-name', d.clientName)
    digitar('input-client-document', d.clientDoc)
    digitar('input-client-phone', d.clientPhone)
    digitar('input-beneficiary-name', d.providerName)
    digitar('input-beneficiary-document', d.providerDoc)
    digitar('input-beneficiary-phone', d.providerPhone)
    digitar('input-vehicle-model', d.carModel)
    digitar('input-vehicle-plate', d.carPlate)
    digitar('input-vehicle-year', d.carYear)
    digitar('input-establishment-name', d.estName)

    cy.get(tid('select-establishment-state')).select(d.state)
    cy.wait('@ibge')
    cy.get(tid('select-establishment-city')).should('not.be.disabled').select(d.city)

    digitar('input-establishment-neighborhood', d.neighborhood)
    digitar('input-establishment-zipcode', d.cep)
    digitar('input-establishment-street', d.street)
    digitar('input-establishment-number', d.number)

    d.services.forEach((servico, i) => {
      if (i > 0) cy.get(tid('btn-add-service')).click()
      cy.get(tid('input-service-name')).eq(i).clear().type(servico.name)
      cy.get(tid('input-service-value')).eq(i).clear().type(servico.value)
    })

    if (d.observations) digitar('input-observations', d.observations)
    if (d.discount) {
      cy.get(tid('btn-add-discount')).click()
      cy.get(tid('input-discount-value')).clear().type(String(d.discount))
    }
  })
})

Cypress.Commands.add('gerarRecibo', () => {
  cy.get(tid('input-privacy')).check()
  cy.get(tid('btn-generate')).click()
  cy.get('#printContainer').should('have.class', 'visible')
})
```

Exemplo de uso (TC-FRM-003):

```js
describe('TC-FRM-003', () => {
  beforeEach(() => cy.abrirFormulario())

  it('Submissão de Formulário Válido', () => {
    cy.preencherFormulario()
    cy.gerarRecibo()

    // | 3 | Clicar em "Gerar Recibo Agora" | — | Preview abre; window.print não foi chamado |
    cy.get('@print').should('not.have.been.called')

    // | 7 | Clicar em "Imprimir / Salvar PDF" | — | window.print chamado 1 vez |
    cy.get(tid('btn-print-receipt')).click()
    cy.get('@print').should('have.been.calledOnce')
  })
})
```

> **Atenção:** `cy.fixture` e `cy.wait('@ibge')` dentro de um comando exigem que `mockLocalidades` já tenha sido chamado (feito em `abrirFormulario`). Se o seu teste abrir o formulário de outra forma, chame `cy.mockLocalidades()` antes.

---

## Apêndice D — Estrutura de Arquivos de Teste

Cada arquivo contém um `describe` por caso de teste (`describe('TC-XXX-NNN')`), com o título do caso no `it`.

```text
cypress/e2e/
  modules/form.cy.js  (6 casos)
  modules/info-recibo.cy.js  (2 casos)
  modules/upload-logo.cy.js  (8 casos)
  modules/dados-cliente.cy.js  (5 casos)
  modules/dados-beneficiario.cy.js  (4 casos)
  modules/dados-veiculo.cy.js  (4 casos)
  modules/dados-estabelecimento.cy.js  (7 casos)
  modules/servicos-produtos.cy.js  (9 casos)
  modules/observacoes.cy.js  (3 casos)
  modules/geracao-recibo.cy.js  (5 casos)
  modules/validacao-campos.cy.js  (4 casos)
  modules/mascaras-input.cy.js  (6 casos)
  modules/home.cy.js  (2 casos)
  modules/preview-recibo.cy.js  (5 casos)
  modules/personalizacao.cy.js  (3 casos)
  modules/politica-privacidade.cy.js  (2 casos)
  seguranca.cy.js  (6 casos)
  acessibilidade.cy.js  (6 casos)
  impressao.cy.js  (4 casos)
  compatibilidade.cy.js  (7 casos)
  seo-pwa.cy.js  (3 casos)
```

**Total:** 101 casos de teste em 21 arquivos. Arquivos novos em relação à v1.0: `modules/home.cy.js`, `modules/preview-recibo.cy.js`, `modules/personalizacao.cy.js`, `modules/politica-privacidade.cy.js` e `seo-pwa.cy.js`.

Para rodar um arquivo por vez: `npx cypress run --spec "cypress/e2e/modules/form.cy.js"`. Para abrir a interface: `ELECTRON_OZONE_PLATFORM_HINT=auto npx cypress open`.

---

_Fim do Documento — Recebi — Plano de Casos de Teste v2.0_
