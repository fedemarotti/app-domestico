#!/bin/bash
cd "/Users/federicomarotti/Claude/Projects/App  Venta de Pastas"
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock
git add -A
git commit -m "fix: recibos A4 con margenes laterales generosos (35mm), no ocupan todo el ancho"
git push
echo "=== LISTO ==="
