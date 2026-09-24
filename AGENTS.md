# AGENTS.md — Hinweise für KI-Agenten (gregWeb.Wiki)

Repo: `gregWeb.Wiki` · Lizenz: Apache-2.0 · Version: siehe `VERSION`.

## Pflichten

1. **Erst lesen:** `README.md`, `CHANGELOG.md` — danach erst ändern.
2. **Docs gehören nach gregCore:** Inhalte stehen in
   `gregCore.main/.wiki/`; hier nur via
   `scripts/sync-from-gregcore.sh` nach `wiki-source/` übernehmen.
   `src/content/docs/` ist generiert (nie von Hand editieren).
3. **Design gehört zur Landingpage:** Theme-Tokens aus
   `gregWeb.Landingpage/design.json` übernehmen
   (`src/styles/custom.css`), kein eigenes Farbsystem erfinden.
4. **Keine Secrets committen** (Keys, Tokens, `.env`).
5. **Änderungen belegen:** `npm run build` + Container-Check
   (`podman build` + `curl`) vor dem Fertigmelden.
6. **Konventionen:** Conventional Commits (`feat:`, `fix:`, `docs:`,
   `chore:` …), Doku + `CHANGELOG.md` (Unreleased) bei Features.

## Layout

- `astro.config.mjs` (Sidebar spiegelt `.wiki/_Sidebar.md`)
- `scripts/import-wiki.mjs` (Frontmatter, Slugs, `[[Links]]`)
- `wiki-source/` (vendored Snapshot), `src/styles/custom.css` (Theme)
- `Dockerfile`, `docker-compose.yml`, `nginx.conf`
