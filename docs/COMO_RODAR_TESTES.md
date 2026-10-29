# Como rodar os testes (Docker + Cypress 16.1.0)

Este projeto roda os testes E2E com **Cypress 16.1.0** 100% via **Docker**, sem necessidade de instalar Node.js, Cypress ou Nix no host.

- Versão do Cypress fixada: **16.1.0** (imagem `cypress/included:16.1.0` e `package.json` com `"cypress": "16.1.0"`)
- Testes ficam em `cypress/e2e/` (casos globais na raiz e módulos em `cypress/e2e/modules/`)
- TDD (fonte dos casos): [docs/TDD_Recebi_Casos_de_Teste.md](TDD_Recebi_Casos_de_Teste.md)
- Inventário dos 101 casos: [cypress/e2e/test-tree.md](../cypress/e2e/test-tree.md)
- Progresso e skips por lote: [cypress/PROGRESSO.md](../cypress/PROGRESSO.md)

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado
- Porta `4173` livre no host

## 1) Subir a aplicação

Em modo desenvolvimento, o app é servido pelo container `app` (Nginx) na porta `4173`. O código do projeto é montado como volume para refletir alterações sem rebuild.

```bash
docker compose up -d app
```

Acesse: [http://localhost:4173](http://localhost:4173)

Para verificar se está saudável:
```bash
docker compose ps
```

## 2) Rodar os testes

O serviço `cypress` utiliza o **profile `test`**, portanto **não** sobe junto com `docker compose up`.

### Rodar toda a suíte (headless, Chrome)

O `defaultBrowser` do projeto é `chrome`; para deixar explícito, use `--browser chrome`:

```bash
docker compose --profile test run --rm cypress --browser chrome
```

Ou via script npm:

```bash
npm run test:e2e:chrome
```

### Rodar um spec individual (recomendado para TDD)

Escreva e rode os testes um por vez:

```bash
docker compose --profile test run --rm cypress --browser chrome --spec "cypress/e2e/modules/form.cy.js"
```

Ou via script npm:

```bash
npm run test:e2e:spec -- "cypress/e2e/modules/form.cy.js"
```

Outros exemplos:
```bash
docker compose --profile test run --rm cypress --browser chrome --spec "cypress/e2e/home.cy.js"
docker compose --profile test run --rm cypress --browser chrome --spec "cypress/e2e/seguranca.cy.js"
```

### Interface gráfica (cypress open) - opcional/manual

O modo interativo (`cypress open`) **não está configurado** neste `docker-compose.yml`. Caso queira utilizá-lo, é necessário configurar manualmente o ambiente gráfico (X11/Wayland) do seu sistema, o que está fora do escopo automatizado deste projeto. O padrão deste setup é **headless** (`cypress run`).

## 3) Screenshots e vídeos

Ao rodar os testes, artefatos são gerados dentro da pasta do projeto:

- Screenshots: `cypress/screenshots/`
- Vídeos: `cypress/videos/`

Essas pastas já estão listadas no `.gitignore`.

## 4) Derrubar tudo

```bash
docker compose down
```

## Dicas e observações

- **Sem arquivos como root:** o container `cypress` usa mapeamento `user: "${UID}:${GID}"` para evitar criação de arquivos com permissão root no host.
- **Base URL e Chrome 142+:** o serviço `cypress` usa `network_mode: "service:app"` e aponta para `http://localhost:4173`. Isso é obrigatório porque o Chrome 142+ bloqueia subrecursos (JS, CSS, imagens) de origens HTTP que não sejam `localhost` (Local Network Access). **Não troque para `http://app:4173`**: a página pode carregar parcialmente, mas os scripts falham sem erro visível no Cypress. Fora do Docker, `baseUrl` pode ser sobrescrita com `CYPRESS_baseUrl` ou `CYPRESS_BASE_URL`.
- **Apenas pastas do projeto:** apenas o diretório do projeto é montado como volume. Não há montagem da home, raiz do disco ou `/var/run/docker.sock`.
- **Cypress 16:** mudanças como novo comportamento de visibilidade, `.type()` com delay padrão 0ms, `cy.env()`/`Cypress.expose()` ao invés de `Cypress.env()`, etc. já foram consideradas. O app não foi alterado, apenas testes/config quando estritamente necessário.
- **Skips são intencionais:** os casos com defeito conhecido (🐞/DEF-xx) usam `it.skip` e estão listados em [cypress/PROGRESSO.md](../cypress/PROGRESSO.md). Não há mais uma suíte majoritariamente desativada: os lotes concluídos têm testes ativos que rodam em Chrome.
- **Status atual:** o acompanhamento por lote, incluindo skips e divergências, fica em [cypress/PROGRESSO.md](../cypress/PROGRESSO.md).
