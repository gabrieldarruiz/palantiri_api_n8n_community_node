#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "=== Limpando dist ==="
rm -rf dist

echo "=== Build ==="
npm run build

echo "=== Status git ==="
git status

echo ""
echo "Próximo: faça o commit (exemplo abaixo)."
echo "  git add -A"
echo "  git commit -m 'chore: rebuild dist, ícones com path completo e viewBox quadrado'"
echo "  npm run release   # quando quiser publicar"
