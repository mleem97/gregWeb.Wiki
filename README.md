# gregWeb.Wiki

Static docs site for the gregCore `.wiki/` guidebook (Astro Starlight,
gregFramework Terminal-Cyan theme). Single source of truth stays
`gregCore.main/.wiki/` — this repo vendors a snapshot under
`wiki-source/` (refresh via `scripts/sync-from-gregcore.sh`).

## Develop

```bash
npm ci
npm run dev      # syncs wiki-source, serves at http://localhost:4321
```

## Sync docs

```bash
./scripts/sync-from-gregcore.sh [path-to-gregCore.main]  # refresh wiki-source/
npm run sync     # validate import (warns on dangling [[links]])
```

## Container

```bash
podman build -t gregweb-wiki:latest .
podman run -d --restart unless-stopped --name gregweb-wiki -p 127.0.0.1:8090:80 gregweb-wiki:latest
```

Portainer: repository stack, compose path `docker-compose.yml`
(`WIKI_PORT` sets the host port, default 8088; Traefik block prepared).
