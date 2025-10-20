# Bootcamp Helper — Extensão Chrome (Manifest V3)

Extensão simples e funcional criada para o Bootcamp II. A etapa intermediária adiciona automação completa: build automatizado, testes end-to-end com Playwright, contêiner Docker e pipeline de CI publicando artefatos.

## Principais recursos

- Popup com ação “Ping background” respondida pelo service worker (`src/popup/popup.html` e `src/background/service-worker.js`).
- Content script que destaca links nas páginas-alvo (`src/content/content.js`).
- Script de build em Node (`scripts/build-extension.mjs`) que gera `dist/extension` e `dist/extension.zip`.
- Testes E2E com Playwright (Chromium) validando o popup via `tests/extension.spec.ts`.
- Ambiente conteinerizado com Dockerfile + Docker Compose para executar build e testes.
- GitHub Actions (`.github/workflows/ci.yml`) com build, testes, artefatos (relatório HTML e `.zip`) e release automático ao publicar tags `v*`.

## Scripts npm

- `npm run build` — copia arquivos da extensão para `dist/extension` e gera `dist/extension.zip`.
- `npm run test:e2e` — executa apenas a suíte Playwright (gera relatório em `playwright-report/`).
- `npm run test` — build + Playwright (mesma sequência do CI).
- `npm run ci` — utilizado opcionalmente em pipelines (`npm ci && npm run test`).

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions` e ative o modo Desenvolvedor.
2. Clique em “Load unpacked” e selecione a raiz deste projeto.
3. Abra o popup pelo ícone da extensão (F12 para ver logs).
4. Acesse uma página em `https://developer.chrome.com/*` para visualizar o content script destacando links.

## Testes end-to-end (Playwright)

1. Gere o pacote da extensão: `npm run build`.
2. Em ambiente com interface gráfica, execute `npm run test:e2e`.
3. Em ambientes headless (ex.: WSL, CI local) ou via Docker, use `xvfb-run --auto-servernum npm run test:e2e`.
4. O relatório HTML fica em `playwright-report/index.html`. Abra com `npx playwright show-report`.

## Docker Compose

```bash
docker compose build          # monta a imagem com Playwright + build da extensão
docker compose run --rm e2e   # executa build + testes dentro do contêiner
```

O serviço `e2e` monta a pasta do projeto em `/app`, roda `npm run test` encapsulado por `xvfb-run` (para prover display virtual) e expõe o relatório/zip na própria árvore do host. O contêiner é executado com o mesmo `UID:GID` do usuário (via `user: "${UID:-1000}:${GID:-1000}"`) para evitar arquivos root na pasta `dist/`.

## Integração contínua (GitHub Actions)

- Workflow `CI` (arquivo `.github/workflows/ci.yml`) roda em `push`, `pull_request` e `workflow_dispatch`.
- Etapas: checkout → `npm ci` → instalação do Playwright → `npm run build` → `xvfb-run -- npm run test:e2e`.
- Artefatos publicados: `playwright-report` e `dist/extension.zip`.
- Ao criar uma tag `v*` (ex.: `v1.1.0`), a pipeline gera automaticamente uma Release anexando `dist/extension.zip`.

## Publicação da extensão

1. Rode `npm run build` para gerar `dist/extension.zip`.
2. Faça upload do `.zip` no Developer Dashboard do Chrome ou utilize a Release automática da pipeline (tag `v*`).
3. Para publicação manual, `scripts/package.sh` continua disponível como alternativa via shell.

## Estrutura de pastas

```
bootcamp-2/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ docs/
│  └─ index.html
├─ icons/
├─ src/
│  ├─ assets/
│  ├─ background/
│  ├─ content/
│  ├─ popup/
│  └─ styles/
├─ tests/
│  ├─ extension.spec.ts
│  └─ playwright.config.ts
├─ scripts/
│  ├─ build-extension.mjs
│  ├─ make_icons.py
│  └─ package.sh
├─ Dockerfile
├─ docker-compose.yml
├─ manifest.json
├─ package.json
├─ package-lock.json
├─ README.md
└─ LICENSE
```

> `dist/` e `playwright-report/` são gerados durante o build/teste.

## GitHub Pages

- Landing page em `docs/index.html`.
- Configure em Settings → Pages: Branch `main`, pasta `/docs`.
- Acesse: `https://<usuario>.github.io/<repo>/`.

## Licença

MIT — ver `LICENSE`.
