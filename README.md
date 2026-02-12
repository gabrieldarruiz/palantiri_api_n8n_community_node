# n8n-nodes-palantiriapi

Nó comunitário n8n para **palantiriAPI** (API WhatsApp multi-tenant).

**Repositório:** [github.com/gabrieldarruiz/palantiri_api_n8n_community_node](https://github.com/gabrieldarruiz/palantiri_api_n8n_community_node)

Este pacote segue os [padrões de community nodes do n8n](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/): nome `n8n-nodes-*`, keyword `n8n-community-node-package`, metadados `n8n` no `package.json`, e **sem dependências de runtime** (apenas `peerDependencies` para n8n-core/n8n-workflow), em linha com os requisitos para [verified community nodes](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/#submit-your-node-for-verification-by-n8n).

## Instalação no n8n

1. No n8n: **Settings** → **Community nodes** → **Install**.
2. Instale por **npm** (quando publicar): `n8n-nodes-palantiriapi`  
   Ou por **repositório**: `https://github.com/gabrieldarruiz/palantiri_api_n8n_community_node`
3. Reinicie o n8n se pedido.

## Credenciais

- **Base URL**: URL base da sua palantiriAPI (ex.: `https://api.seudominio.com` ou `https://n8n.astrasolution.com.br/palantiri`).
- **API Key**: API Key da instância (gerada na palantiriAPI por instância) ou token JWT. A API aceita header `X-API-Key`.

## Operações

| Operação        | Descrição                          |
|-----------------|------------------------------------|
| Status          | GET status da instância WhatsApp   |
| Enviar texto    | POST send-text (to + text)        |
| Enviar imagem   | POST send-image (to, text, base64, mimetype) |
| Enviar documento| POST send-document (to, text, base64, mimetype, file_name) |
| Listar chats    | GET chats (lista de conversas)    |
| Listar mensagens| GET messages (mensagens de um chat)|

## Campo "Para" (to)

- **Número**: com código do país, ex.: `5511999999999`.
- **Grupo**: JID do grupo, ex.: `120363167603218039@g.us`.

## Desenvolvimento

O projeto usa o [n8n-node CLI](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/) (oficial) para build, lint e release. Para criar um **novo** nó do zero com o assistente interativo (nome, tipo HTTP API ou Other, template), veja [Setting node details interactively](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/#setting-node-details-interactively). Depois de `npm install`:

```bash
npm run build      # compila TypeScript e copia assets (codex, etc.)
npm run dev        # sobe o n8n local com o nó carregado e hot-reload
npm run lint       # checagem de estilo/erros (n8n-node lint)
npm run lint:fix   # correção automática quando possível
npm run release    # publica no npm (release-it + n8n-node prerelease)
```

Para testar no n8n em modo dev: `npm run dev` e acesse `http://localhost:5678`; ou instale o pacote pelo caminho da pasta (Settings → Community nodes → Install from folder).

## Erro "The specified package could not be loaded"

Esse erro costuma vir de **cache/instalação antiga** na pasta de nós do n8n. Faça o seguinte:

**Se o n8n roda em Docker (no servidor):**

1. Descubra o nome do container:  
   `docker ps | grep n8n`
2. Limpe e reinicie (troque `NOME_DO_CONTAINER` pelo nome que apareceu):  
   ```bash
   docker exec NOME_DO_CONTAINER sh -c 'rm -rf /home/node/.n8n/nodes/package.json /home/node/.n8n/nodes/node_modules'
   docker restart NOME_DO_CONTAINER
   ```
3. Espere o n8n voltar (alguns segundos) e, na interface: **Settings** → **Community nodes** → **Install** → `n8n-nodes-palantiriapi`.

**Exemplo se o container se chama `n8n`:**  
```bash
docker exec n8n sh -c 'rm -rf /home/node/.n8n/nodes/package.json /home/node/.n8n/nodes/node_modules'
docker restart n8n
```

**Se o n8n roda direto na máquina (sem Docker):**

1. Pare o n8n.
2. `rm -rf ~/.n8n/nodes/package.json ~/.n8n/nodes/node_modules`
3. Suba o n8n de novo e instale o pacote outra vez.

Há também um script em `scripts/fix-n8n-load.sh` que tenta fazer a limpeza automaticamente (Docker ou não).

## Licença

MIT
