#!/usr/bin/env bash
set -euo pipefail

NAME="bootcamp-helper"
OUT_ZIP="${NAME}.zip"

echo "Empacotando extensão em ${OUT_ZIP}..."
TMPDIR=".pkg_tmp"
rm -rf "${TMPDIR}" "${OUT_ZIP}"
mkdir -p "${TMPDIR}"

# Copia apenas o que é necessário para rodar a extensão
cp -R manifest.json icons src "${TMPDIR}/"

(cd "${TMPDIR}" && zip -r "../${OUT_ZIP}" . >/dev/null)

rm -rf "${TMPDIR}"
echo "OK: ${OUT_ZIP} gerado. Faça upload como Release no GitHub."

