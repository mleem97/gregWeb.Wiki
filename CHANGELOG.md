# Changelog — gregWeb.Wiki

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Version: see [`VERSION`](VERSION).

## [Unreleased]

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
