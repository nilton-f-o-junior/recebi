# Implementação dos testes do Recebi: planejamento e prompt

## Parte 1 — Planejamento

### Princípios
- **Um lote = um commit.** Cada lote é um conjunto pequeno de casos do TDD, implementado, executado e verde antes de ser commitado. Nunca se commita teste vermelho.
- **Do mais simples para o mais dependente.** Primeiro infraestrutura e casos sem rede nem upload; por último acessibilidade, impressão e compatibilidade.
- **O TDD é a fonte.** Cada `describe('TC-XXX-NNN')` copia a tabela do caso como comentário. Casos marcados com 🐞 (DEF-xx) usam `it.skip` ou fixam o comportamento atual, conforme a seção 10.3 do TDD.
- **Um arquivo de progresso** (`cypress/PROGRESSO.md`) registra lotes concluídos, para a sessão poder ser retomada a qualquer momento.

### Lotes (101 casos em 13 lotes + infraestrutura)

| Lote | Conteúdo | Casos | Arquivo(s) de teste | Por que nessa ordem |
|------|----------|-------|---------------------|---------------------|
| 0 | Infraestrutura: `cypress.config.js`, `commands.js` (Apêndice C), fixture `recibo-valido.json`, imagens de teste, scripts do `package.json` | — | — | Tudo depende disso |
| 1 | Home e formulário principal | HOM-001/002, FRM-001 a 006 (8) | `home.cy.js`, `form.cy.js` | Valida a infra com o caminho mais curto |
| 2 | Máscaras | MSK-001 a 006 (6) | `mascaras-input.cy.js` | Sem rede nem upload; resultado determinístico |
| 3 | Cliente, beneficiário e veículo | CLI 5, BEN 4, VEI 4 (13) | `dados-cliente.cy.js`, `dados-beneficiario.cy.js`, `dados-veiculo.cy.js` | Usam o fluxo "preencher e gerar" |
| 4 | Informações do recibo e observações | INF 2, OBS 3 (5) | `info-recibo.cy.js`, `observacoes.cy.js` | Curtos |
| 5 | Serviços e produtos | SRV 9 | `servicos-produtos.cy.js` | Cálculos e linhas dinâmicas |
| 6 | Estabelecimento | EST 7 | `dados-estabelecimento.cy.js` | Exige mocks de IBGE e ViaCEP |
| 7 | Upload de logo | LOG 8 | `upload-logo.cy.js` | Exige fixtures e `selectFile` |
| 8 | Geração, preview e personalização | GER 5, PRE 5, PER 3 (13) | `geracao-recibo.cy.js`, `preview-recibo.cy.js`, `personalizacao.cy.js` | Dependem de tudo que veio antes |
| 9 | Validação de campos | VAL 4 | `validacao-campos.cy.js` | Transversal; reaproveita os anteriores |
| 10 | Política de privacidade e segurança | POL 2, SEG 6 (8) | `politica-privacidade.cy.js`, `seguranca.cy.js` | Segurança usa interceptação ampla |
| 11 | Acessibilidade | A11-001 a 006 (6) | `acessibilidade.cy.js` | Muitos 🐞; exige `cypress-axe` |
| 12 | Impressão e SEO/PWA | IMP 4, SEO 3 (7) | `impressao.cy.js`, `seo-pwa.cy.js` | CDP só em Chrome; vários 🐞 |
| 13 | Compatibilidade e responsividade | BRW 7 | `compatibilidade.cy.js` | Roda o mesmo fluxo em vários navegadores/viewports |

### Gate de cada lote (definição de "pronto")
1. Spec(s) do lote executadas no Docker do projeto, em Chrome, apenas nos arquivos do lote: **0 falhas**.
2. Executadas uma segunda vez para detectar flake. Se houver diferença entre as duas execuções, o lote não está pronto.
3. Nenhum `cy.wait(<número>)` solto, nenhum `.only`, nenhum dado de teste fixo que dependa da data de hoje.
4. `cypress/PROGRESSO.md` atualizado.
5. Commit só com os arquivos do lote.

### Mensagem de commit
`test(<área>): <o que foi coberto> (TC-XXX-NNN a TC-XXX-MMM)`, com corpo listando `it.skip` e o DEF-xx de cada um. Exemplos:
- `test(infra): config do Cypress 16.1, comandos de apoio e fixtures`
- `test(mascaras): cobre TC-MSK-001 a 006`
- `test(estabelecimento): cobre TC-EST-001 a 007 com mocks de IBGE e ViaCEP`

---

## Parte 2 — Prompt 

````text
Você vai implementar a suíte de testes E2E do projeto Recebi em Cypress 16.1.x, seguindo o plano de testes em docs/TDD_Recebi_Casos_de_Teste_v2.1.md (se estiver em outro caminho, procure o arquivo TDD_Recebi_Casos_de_Teste_v2.1.md). Esse documento é a fonte única: leia-o inteiro antes de começar, em especial as seções 3 (convenções e a 3.6 sobre o Cypress 16), 10 (defeitos conhecidos) e os apêndices A a D.

## Regras gerais
- Trabalhe em lotes pequenos. Cada lote termina com testes passando e um commit. Nunca faça commit com teste falhando.
- NÃO altere o código da aplicação (src/, index.html etc.). Os testes descrevem o comportamento do app; se um teste falhar, descubra se o erro está no teste, no TDD ou no app, e siga a seção "Quando um teste falha".
- Não faça push. Não crie branches a menos que eu peça. Trabalhe na branch atual.
- Cada caso do TDD vira um `describe('TC-XXX-NNN: <título>')`. Copie a tabela de passos do TDD como comentário e comente cada passo com a linha correspondente, como no padrão da seção 3.4 item 12.
- Use os seletores do Apêndice B (`data-testid` quando existir) e os comandos do Apêndice C (`cy.abrirFormulario`, `cy.preencherFormulario`, `cy.gerarRecibo`, `cy.mockLocalidades`, `cy.mockViaCep`). Não use `cy.wait(<número>)`; espere por alias ou por asserção. Não use `.only`.
- Não use `Cypress.env()`, `cy.exec()`, `cy.end()` nem `Cypress.config()` para viewport durante o teste (removidos/proibidos no Cypress 16). Não configure `forceHttp1` nem `visibilityStrategy: 'legacy'`.
- Datas sempre calculadas com `new Date()` local, nunca fixas (ver DEF-04 e a seção 3.4 item 7).
- Casos marcados com 🐞 (DEF-xx): escreva `it.skip('<título> (DEF-xx)', ...)` com o comportamento esperado, e, quando o TDD indicar, um teste separado que fixa o comportamento atual com o comentário `// DEF-xx: comportamento atual; inverter após correção`.
- Casos 🖐 (manuais): não implemente; deixe um `it.skip` com a nota "manual" e liste-os no PROGRESSO.md.

## Lotes (nesta ordem; não pule)
0. Infraestrutura: cypress.config.js (defaultBrowser 'chrome', baseUrl, specPattern conforme o Apêndice C), cypress/support/commands.js e e2e.js, cypress/fixtures/recibo-valido.json (Apêndice A.3) e imagens de teste (PNG, JPG, SVGs), scripts no package.json e/ou comandos no docker-compose para abrir/rodar (`chrome`, `firefox`), .gitignore para cypress/videos e cypress/screenshots. O projeto já roda o Cypress 16.1 em Docker (`cypress/included`, app + Cypress), sem Nix: não crie nem altere nada de Nix, apenas confirme a versão e o Chrome na imagem e verifique com um spec mínimo rodando no Docker.
1. HOM-001/002 e FRM-001 a FRM-006 → home.cy.js, form.cy.js
2. MSK-001 a MSK-006 → mascaras-input.cy.js
3. CLI-001 a 005, BEN-001 a 004, VEI-001 a 004 → dados-cliente.cy.js, dados-beneficiario.cy.js, dados-veiculo.cy.js
4. INF-001/002, OBS-001 a 003 → info-recibo.cy.js, observacoes.cy.js
5. SRV-001 a SRV-009 → servicos-produtos.cy.js
6. EST-001 a EST-007 → dados-estabelecimento.cy.js (sempre com mocks de IBGE e ViaCEP)
7. LOG-001 a LOG-008 → upload-logo.cy.js
8. GER-001 a 005, PRE-001 a 005, PER-001 a 003 → geracao-recibo.cy.js, preview-recibo.cy.js, personalizacao.cy.js
9. VAL-001 a VAL-004 → validacao-campos.cy.js
10. POL-001/002, SEG-001 a SEG-006 → politica-privacidade.cy.js, seguranca.cy.js
11. A11-001 a A11-006 → acessibilidade.cy.js (instale cypress-axe e axe-core como devDependencies; confirme compatibilidade com Cypress 16)
12. IMP-001 a 004, SEO-001 a 003 → impressao.cy.js, seo-pwa.cy.js
13. BRW-001 a BRW-007 → compatibilidade.cy.js (um único fluxo de fumaça executado por navegador, mais os casos de viewport)

Os arquivos ficam em cypress/e2e/ (e cypress/e2e/modules/ conforme o Apêndice D).

## Procedimento de cada lote
1. Antes de começar, anuncie em uma linha qual lote vai fazer. Crie as tarefas do lote.
2. Leia no TDD os casos do lote e as notas de Cypress de cada um.
3. Implemente os specs do lote.
4. Execute os specs do lote **pelo Docker do projeto** (imagem `cypress/included`, conforme o README), em Chrome: o equivalente a `cypress run --browser chrome --spec "<specs do lote>"`. Descubra no README/docker-compose o comando exato e use-o em todos os lotes. Não use o Cypress do Nix.
5. Corrija o que falhar (ver "Quando um teste falha"). Repita até zerar as falhas.
6. Execute de novo, uma segunda vez, para detectar flake. Se os resultados diferirem, estabilize antes de seguir.
7. Confira: sem `.only`, sem `cy.wait(<número>)`, sem datas fixas, comentários dos passos presentes, skips com DEF-xx.
8. Atualize cypress/PROGRESSO.md (tabela de lotes: status, casos implementados, casos em skip com o DEF, casos manuais, data).
9. Faça o commit somente com os arquivos do lote (`git add` por caminho, nunca `git add .`). Mensagem: `test(<área>): <cobertura> (TC-XXX-NNN a TC-XXX-MMM)` e, no corpo, a lista de `it.skip` com o DEF-xx de cada um.
10. Resuma em até 3 linhas: lote concluído, nº de testes passando, nº de skips, hash do commit. Siga para o próximo lote sem esperar confirmação, exceto se ocorrer um dos casos de parada abaixo.

## Quando um teste falha
Classifique antes de mexer:
a) Erro do teste (seletor, espera, massa de dados): corrija o teste.
b) O TDD está desatualizado ou impreciso (o app se comporta de outro jeito e não há DEF correspondente): ajuste o teste para o comportamento real, registre a divergência no PROGRESSO.md na seção "Divergências novas" e pare para me avisar ao fim do lote, sem editar o TDD.
c) Possível defeito do app: escreva o teste esperado como `it.skip` com um novo identificador `DEF-NEW-n` descrito no PROGRESSO.md, fixe o comportamento atual em teste separado e siga.
d) Falha causada pelo Cypress 16 (visibilidade, rede nativa, etc.): consulte a seção 3.6 do TDD; prefira reescrever a asserção para algo independente do algoritmo. Não use opções deprecadas para "fazer passar".

## Casos de parada (pare e me pergunte)
- Mais de uma tentativa de correção sem sucesso no mesmo teste, ou flake que você não consegue estabilizar.
- Necessidade de alterar o código da aplicação ou o TDD.
- Dependência nova além de cypress-axe/axe-core (e cypress-real-events, se necessário para o TC-A11-002).
- Qualquer comando que baixe ou apague arquivos fora do projeto.

## Primeiro passo
Comece pelo lote 0. Antes de escrever código, leia o package.json, a estrutura de pastas e qualquer cypress.config.* existente, e me diga em 5 linhas o que encontrou e o que vai criar ou alterar.
````

---

## Dicas para tornar a implementação mais fácil
- **Rode o prompt lote a lote** se preferir revisar entre commits: troque "siga para o próximo lote" por "pare ao fim de cada lote".
- **Mantenha o app servido localmente** (`baseUrl` apontando para a raiz do repositório, por exemplo com `npx serve .`) para os testes não dependerem do site em produção.
- **Primeiro lote que importa é o 1:** se `cy.abrirFormulario()` e `cy.gerarRecibo()` funcionarem, o restante é repetição.
- **Commits pequenos facilitam reverter:** se um lote introduzir flake, `git revert` desfaz só aquele lote.
