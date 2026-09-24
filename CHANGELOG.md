# Changelog — gregWeb.Wiki

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Version: see [`VERSION`](VERSION).

## [Unreleased]

### Changed

- Sidebar: `Hooks`, `Glossary` und `FAQ + Help` sind eigene
  Top-Level-Gruppen (aufklappbar) direkt nach Home — `Reference` ist
  aufgelöst. Zugehörige Seiten: Hooks ← Core Events, Events + Hooks
  Guide, Lua 02 Events; FAQ ← Debugging, Modelling Troubleshooting,
  Porting Matrix. `Core`/`Developers` sind entsprechend entschlackt,
  Guidebook-Tracks bleiben vollständig. Rust-Track aufgenommen.
  Gespiegelt in gregCore `.wiki/_Sidebar.md`.
- `wiki-source/` auf aktuellen `.wiki`-Stand synchronisiert (u. a. neue
  Rust-Seiten).

### Fixed

- Doppelte Überschriften: `scripts/import-wiki.mjs` übernimmt das erste
  `# H1` nur noch als Frontmatter-`title` und entfernt es aus dem Body —
  Starlight rendert den Titel sonst doppelt (Frontmatter-H1 + Markdown-H1).

### Added

- Initial Astro Starlight site built from gregCore `.wiki/` (52 pages).
- Terminal-Cyan theme from `gregWeb.Landingpage` `design.json`
  (background `#051424`, primary `#8aebff`, Space Grotesk / Inter /
  JetBrains Mono, glass header, dark-only).
- Splash hero on the landing page (Guidebook / Install / GitHub
  actions), GitHub + Discord social links, Pagefind search.
- `scripts/import-wiki.mjs` (frontmatter, slug + `[[link]]`
  resolution with dangling-link warnings) and
  `scripts/sync-from-gregcore.sh` (vendor snapshot into
  `wiki-source/`).
- Container: multi-stage Dockerfile (node:24 → nginx), compose with
  `WIKI_PORT` and prepared Traefik block.
