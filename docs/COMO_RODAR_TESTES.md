# Como rodar os testes (Docker + Cypress 16.1.0)

Este projeto roda os testes E2E com **Cypress 16.1.0** 100% via **Docker**, sem necessidade de instalar Node.js, Cypress ou Nix no host.

- Versão do Cypress fixada: **16.1.0** (imagem `cypress/included:16.1.0` e `package.json` com `"cypress": "16.1.0"`)
- Testes ficam em `cypress/e2e/` (módulos em `cypress/e2e/modules/`)
- Plano de testes: [cypress/e2e/test-tree.md](../cypress/e2e/test-tree.md)

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

### Rodar toda a suíte (headless)

```bash
docker compose --profile test run --rm cypress
```

Ou via script npm:

```bash
npm run test:e2e
```

### Rodar um spec individual (recomendado para TDD)

Escreva e rode os testes um por vez:

```bash
docker compose --profile test run --rm cypress --spec "cypress/e2e/modules/form.cy.js"
```

Ou via script npm:

```bash
npm run test:e2e:spec -- "cypress/e2e/modules/form.cy.js"
```

Outros exemplos:
```bash
docker compose --profile test run --rm cypress --spec "cypress/e2e/smoke.cy.js"
docker compose --profile test run --rm cypress --spec "cypress/e2e/seguranca.cy.js"
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
- **Base URL:** em Docker, o Cypress aponta para `http://app:4173` via `CYPRESS_baseUrl`. Localmente também é possível sobrescrever com `CYPRESS_baseUrl` ou `CYPRESS_BASE_URL`.
- **Apenas pastas do projeto:** apenas o diretório do projeto é montado como volume. Não há montagem da home, raiz do disco ou `/var/run/docker.sock`.
- **Cypress 16:** mudanças como novo comportamento de visibilidade, `.type()` com delay padrão 0ms, `cy.env()`/`Cypress.expose()` ao invés de `Cypress.env()`, etc. já foram consideradas. O app não foi alterado, apenas testes/config quando estritamente necessário.
- **Muitos testes estão `it.skip`:** é normal ver vários testes pulados; apenas os ativos (como `smoke.cy.js` e parte de `modules/form.cy.js`) são executados.
