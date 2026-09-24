#!/usr/bin/env bash
# Sync .wiki sources from the gregCore checkout into ./wiki-source/.
# Usage: ./scripts/sync-from-gregcore.sh [path-to-gregCore-main]
set -euo pipefail
SRC="${1:-/home/marvin/Dokumente/Repositories/GregFramework/ModRepositories/gregCore/gregCore.main}/.wiki"
DST="$(cd "$(dirname "$0")/.." && pwd)/wiki-source"
mkdir -p "$DST"
cp "$SRC"/*.md "$DST"/
echo "[wiki] synced $(ls "$DST"/*.md | wc -l) pages: $SRC -> $DST"
