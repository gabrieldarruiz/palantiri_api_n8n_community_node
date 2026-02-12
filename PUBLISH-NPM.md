# Publicar no npm

## 1. Conta npm

- Se não tiver: [npmjs.com/signup](https://www.npmjs.com/signup)
- Recomendado: ativar **2FA** (o aviso amarelo no site) em Account → Security

## 2. Nome do pacote

O nome `n8n-nodes-palantiriapi` pode já estar em uso. Verifique:

```bash
npm view n8n-nodes-palantiriapi
```

- Se der **404** → o nome está livre, pode publicar com ele.
- Se mostrar um pacote → use nome com escopo (ex.: `@gabrieldarruiz/n8n-nodes-palantiriapi`).

Para usar escopo, no `package.json` troque:

```json
"name": "@gabrieldarruiz/n8n-nodes-palantiriapi"
```

(e na primeira publicação use `npm publish --access public`)

## 3. Antes de publicar (evitar "package could not be loaded")

O n8n exige que o tarball tenha **build válido** e **metadata n8n**:

- `main` em `package.json` deve apontar para um arquivo que **existe** no pacote: `dist/nodes/PalantiriApi/PalantiriApi.node.js`
- A pasta `dist/` deve conter nós, credenciais **e o codex** `PalantiriApi.node.json` (o build já copia com `tsc && cp nodes/.../PalantiriApi.node.json dist/...`)

Sempre confira o que será publicado:

```bash
npm run build
npm pack --dry-run
```

Na lista deve aparecer **`dist/nodes/PalantiriApi/PalantiriApi.node.json`**. Se não aparecer, o codex não vai no npm e o n8n pode logar "No codex available" e, em alguns casos, falhar ao carregar.

No servidor do n8n, para conferir se o pacote existe e qual versão está instalada:

```bash
npm view n8n-nodes-palantiriapi version
ls -la node_modules/n8n-nodes-palantiriapi/dist/nodes/PalantiriApi/
```

**Por que `peerDependencies` (e não `dependencies`) para n8n-core/n8n-workflow:**  
Se o pacote declarar essas libs como `dependencies`, o npm instala cópias em `~/.n8n/nodes/node_modules/`. O n8n 2.x (pnpm/workspace) usa suas próprias versões; duas versões em runtime gera "The specified package could not be loaded" na etapa de instalação/validação. Com `peerDependencies`, o pacote usa as libs do runtime do n8n e evita esse conflito.

## 4. Publicar

No terminal, na pasta do projeto:

```bash
cd /Users/darraos/ws/go_study/n8n-nodes-palantiriapi

# Login no npm (pede usuário, senha e e-mail)
npm login

# Build (gera dist + codex)
npm run build

# Publicar (prepublishOnly roda o build de novo)
npm version patch   # ou minor/major, ex.: 0.1.3 → 0.1.4
npm publish
```

Se tiver usado **nome com escopo** (`@gabrieldarruiz/...`):

```bash
npm publish --access public
```

## 5. Instalar no n8n

Depois de publicado:

1. n8n → **Settings** → **Community nodes** → **Install**
2. Nome do pacote:
   - `n8n-nodes-palantiriapi` (nome sem escopo), ou
   - `@gabrieldarruiz/n8n-nodes-palantiriapi` (com escopo)

## 6. Atualizações

Depois de mudar o código:

1. Suba a versão no `package.json`, ex.: `"version": "0.1.1"`
2. `npm run build`
3. `npm publish`
