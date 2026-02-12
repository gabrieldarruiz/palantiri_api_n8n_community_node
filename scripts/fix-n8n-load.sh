#!/bin/bash
# Corrige erro "The specified package could not be loaded" no n8n.
# Rode no servidor onde o n8n está (Docker ou não).

set -e

echo "=== Limpando pasta de community nodes do n8n ==="

if command -v docker &>/dev/null; then
  # Encontrar container do n8n (nome pode variar: n8n, n8n_1, root-n8n-1, etc.)
  CONTAINER=$(docker ps --format '{{.Names}}' | grep -i n8n | head -1)
  if [ -z "$CONTAINER" ]; then
    echo "Nenhum container n8n encontrado. Liste com: docker ps"
    exit 1
  fi
  echo "Container n8n: $CONTAINER"
  echo "Removendo package.json e node_modules em /home/node/.n8n/nodes ..."
  docker exec "$CONTAINER" sh -c 'rm -rf /home/node/.n8n/nodes/package.json /home/node/.n8n/nodes/node_modules 2>/dev/null; echo "Limpeza feita."'
  echo "Reiniciando container..."
  docker restart "$CONTAINER"
  echo "Pronto. Aguarde o n8n subir e instale de novo: n8n-nodes-palantiriapi"
else
  # n8n sem Docker (executando direto)
  N8N_NODES="${N8N_NODES_DIR:-$HOME/.n8n/nodes}"
  echo "Pasta de nós: $N8N_NODES"
  if [ ! -d "$N8N_NODES" ]; then
    echo "Pasta não encontrada. Se o n8n usa outra pasta, defina N8N_NODES_DIR."
    exit 1
  fi
  rm -rf "$N8N_NODES/package.json" "$N8N_NODES/node_modules"
  echo "Limpeza feita. Reinicie o n8n e instale de novo o pacote."
fi
