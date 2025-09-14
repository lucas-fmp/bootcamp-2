# Bootcamp Helper — Extensão Chrome (Manifest V3)

Extensão simples e funcional para o Bootcamp II, com popup (UI), service worker (background) e content script opcional para demonstrar injeção de código em páginas específicas.

- Manifest: MV3, sem dependências de Node no runtime da extensão.
- Permissões enxutas: `storage`, `tabs` e `host_permissions` amplos (ajuste conforme o escopo real).
- Compatível com Chrome 114+.
- Landing page do projeto em `docs/` (GitHub Pages).

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions` e ative o modo Desenvolvedor.
2. Clique em “Load unpacked” e selecione a raiz deste projeto.
3. Clique no ícone da extensão para abrir o popup. Use F12 para ver logs.
4. Acesse uma página em `https://developer.chrome.com/*` para ver o content script destacando links.

## Uso rápido

- No popup, clique em “Ping background” para enviar uma mensagem ao service worker. O horário de resposta será exibido no popup.

## Estrutura de Pastas

```
my-chrome-extension/
├─ src/
│  ├─ popup/
│  │  ├─ popup.html
│  │  ├─ popup.js
│  │  └─ popup.css
│  ├─ content/
│  │  └─ content.js
│  ├─ background/
│  │  └─ service-worker.js
│  ├─ assets/
│  │  └─ logo.svg
│  └─ styles/
│     └─ global.css
├─ icons/
│  ├─ icon16.png
│  ├─ icon32.png
│  ├─ icon48.png
│  └─ icon128.png
├─ docs/
│  └─ index.html
├─ manifest.json
├─ README.md
└─ LICENSE
```

## Manifest (MV3)

Ver `manifest.json`. Padrão usado:

- `action.default_popup`: `src/popup/popup.html`
- `background.service_worker`: `src/background/service-worker.js`
- `content_scripts`: injetado em `https://developer.chrome.com/*`
- Permissões: `["storage", "tabs"]`
- Host permissions: `["https://*/*", "http://*/*"]`

Aplique o princípio do menor privilégio e restrinja `host_permissions` conforme seu caso.

## Desenvolvimento e Teste

- Popup: abra pelo ícone da extensão na barra do Chrome.
- Background: verifique logs na aba `Service Worker` das devtools da extensão.
- Content script: navegue até `https://developer.chrome.com/*` e veja os links destacados.

## Empacotamento (.zip)

Há um script simples em `scripts/package.sh` que cria `bootcamp-helper.zip` com os arquivos necessários. Execute:

```bash
bash scripts/package.sh
```

Depois, crie uma Release no GitHub e anexe o `.zip`.

## GitHub Pages

- A landing page está em `docs/index.html`.
- Em Settings → Pages, selecione Branch `main` e Folder `/docs`.
- Acesse: `https://<usuario>.github.io/<repo>/`.

## Ícones

Ícones PNG mínimos (placeholder) estão em `icons/`. São PNGs transparentes de 1×1 utilizados como marcadores. Você pode substituí-los por ícones reais (16, 32, 48, 128 px) a qualquer momento.

## Licença

MIT — ver `LICENSE`.
