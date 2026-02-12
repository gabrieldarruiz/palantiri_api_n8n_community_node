# n8n-nodes-palantiriapi

Nó comunitário n8n para **palantiriAPI** (API WhatsApp multi-tenant).

**Repositório:** [github.com/gabrieldarruiz/palantiri_api_n8n_community_node](https://github.com/gabrieldarruiz/palantiri_api_n8n_community_node)

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

```bash
cd n8n-nodes-palantiriapi
npm install
npm run build
```

Para testar no n8n em modo dev, instale o pacote pelo caminho da pasta (Settings → Community nodes → Install from folder).

## Licença

MIT
