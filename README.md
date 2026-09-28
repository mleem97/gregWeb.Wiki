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

`wiki-source/` = vendored `.wiki`-Snapshot (flach). `wiki-local/` = lokale
MDX/MD-Seiten, die nicht aus dem Snapshot kommen (z. B. Autoren-Doku
`guides/article-kit`), 1:1 nach `src/content/docs/` kopiert.
`src/content/docs/` ist generiert (nie von Hand editieren).

Kurze Pfade (`scripts/import-wiki.mjs`, `pageRoute`):
`/docs/{lang}/{page}`, `/hooks/{page}`, `/lexicon/`, `/faq/{page}`,
`/guides/{page}`. Alte Lang-Pfade leitet `nginx.conf` per 301 um.

Artikel-Bausteine (siehe `guides/article-kit` im Wiki):
`:::note|tip|caution|danger:::`-Callouts, ```-Codeblöcke mit Copy-Button,
`<Figure>`/`<CodeSnippet>` (MDX), `<div data-langs="lua csharp">` für den
globalen CodingLang-Filter. Externe URLs zentral in `src/config/site.ts`.

## Suche (Vektor-DB + Pagefind)

Ohne Config: Pagefind (Header) + Live-Filter (Homepage). Mit
Vektor-Graphen-DB fragt die Help-Suche erst deren Endpoint:

```bash
PUBLIC_VECTOR_SEARCH_URL=https://<host>/api/wiki-search npm run build
```

Vertrag: `POST { query, lang, audience }` →
`{ results: [{ title, url, snippet }] }` (Details: `src/lib/vector-search.ts`).
Fehler/timeout (>2,5 s) fallen still auf Pagefind zurück.

## Container

```bash
podman build -t gregweb-wiki:latest .
podman run -d --restart unless-stopped --name gregweb-wiki -p 127.0.0.1:8090:80 gregweb-wiki:latest
```

Portainer: repository stack, compose path `docker-compose.yml`
(`WIKI_PORT` sets the host port, default 8088; Traefik block prepared).
