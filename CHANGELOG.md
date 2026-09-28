# Changelog — gregWeb.Wiki

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Version: see [`VERSION`](VERSION).

## [Unreleased]

### Added

- Kurzes Pfad-Schema (so kurz wie möglich): `/docs/{lang}/{page}`
  (Tracks + Start + Core + Deep-Dive), `/hooks/{page}`, `/lexicon/`,
  `/faq/{page}`, `/guides/{page}`. Mapping in `scripts/import-wiki.mjs`
  (`pageRoute` + `urlPathOf`), Sidebar/Top-Nav/Cards folgen. Alte
  Lang-Pfade (`/guidebook/…`, `/players/…`, `/developers/…`, `/core/…`,
  `/glossary/`) leitet `nginx.conf` per 301 um.
- Artikel-Kit für Autoren (`guides/article-kit`, Quelle: `wiki-local/` —
  lokale MDX-Seiten, die der Import 1:1 übernimmt): `:::note|tip|caution
  |danger:::`-Callouts (neumorph gestylt), ```-Code mit nativem
  Copy-Button (expressive-code, GitHub-Stil), `<Figure>` (Bild + Caption,
  Placehold.co-Platzhalter), `<CodeSnippet>` (Titelzeile + Copy),
  `<div data-langs="…">`-Sektionen für den globalen Filter.
- CodingLang-Filter global: zusätzlich zur Homepage filtert er
  Sidebar-Track-Einträge (per URL-Präfix aus `LANG_PREFIX`, Start/
  Framework/Guides bleiben immer sichtbar) und Artikel-Sektionen mit
  `data-langs`. Codeblöcke bewusst nicht auto-gefiltert. Persistiert
  (`localStorage`), Zähler in der Toolbar.
- Suche vector-ready: `src/lib/vector-search.ts` definiert den Vertrag
  (`POST { query, lang, audience }` → `{ results: [{ title, url,
  snippet }] }`, 2,5-s-Timeout mit Pagefind-Fallback). Per
  `PUBLIC_VECTOR_SEARCH_URL`-Build-Env als Meta-Tag injiziert, HelpHero
  zeigt Dropdown-Treffer (Enter = erster Treffer), Badge „Vektor-Suche
  aktiv", sonst Pagefind + Card-Filter.
- Discord-Fallback (`discord.gg/QhbvmzEefH` in `src/config/site.ts`,
  Link im Footer), User-Audience zeigt auf `https://datacentermods.com`
  (normale User werden dort bedient, Wiki = Mod-Dev-Referenz).
- Help-Center-Startseite im Perplexity-Stil (aber entflochten): `HelpHero`
  (Breadcrumb + „How can we help?" + Suche mit `/`-Shortcut + Live-Filter),
  `CategoryGrid` (9 Kategorien mit Placehold.co-Bildern, `data-langs` /
  `data-audiences`), Popular/Recent-Blöcke, `DiscordHelpButton`
  („Get more help >" in Akzent `#8aebff`, dunkle Schrift, Discord-Logo).
  Startseite ist jetzt `index.mdx` (MDX aktiviert via `@astrojs/mdx`,
  nach Starlight einsortiert wegen expressive-code-Reihenfolge).
- `AudienceSwitch` (User ⇄ Mod-Dev, `localStorage`, Header-kompakt +
  Homepage-Toolbar): User sieht Hinweis-Banner + Weiterleitung auf
  `https://datacentermods.com/docs`, Mod-Dev die volle Referenz.
  Zentrale URLs in `src/config/site.ts` (Discord/GitHub/User-Docs).
- `LangFilter`-Dropdown (CodingLang: All/Lua/C#/JS/Rust/Modelling,
  `localStorage`): filtert Kategorie-Cards clientseitig, mit Zähler.
- `ArticleFooter` auf allen Doc-Seiten (via `Footer`-Override):
  „Was this article helpful?" (lokal gespeichert) + Still-stuck-Box
  mit Discord-Button.
- Soft-Neumorphism (subtil, flach-minimalistisch bleibt Basis):
  `--neu-out/--neu-in`-Tokens, erhabene Cards/Toolbar/Tabellen/Code,
  Perplexity-engere Artikelspalte (46rem), `h2`-Trennlinien.

### Changed

- Next.js-docs style information architecture: real URL namespaces
  (`/hooks/*`, `/guides/*`, `/players/*`, `/developers/*`,
  `/core/*`, `/guidebook/*`) instead of one flat page list, plus a
  grouped sidebar (Getting Started → Guidebook → Guides → Hooks →
  Core → Developers → Glossary). Implemented in
  `scripts/import-wiki.mjs` (route map + directory-correct relative
  links) and `astro.config.mjs`; `.wiki/` sources stay flat (GitHub
  wiki requirement). Top nav and Home cards point at the new routes.
- Oxide-style layout (docs.oxidemod.com): top nav with Guidebook ·
  Core · Hooks · Glossary · FAQ via custom `Header.astro` override
  (hidden on narrow viewports, sidebar takes over), landing page with
  section cards (Guidebook / Core / Hooks / Glossary / FAQ), sidebar
  order Guidebook → Core → Hooks → Glossary → FAQ → Players →
  Developers. Mirrored in gregCore `.wiki/_Sidebar.md`.
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
- Link-Normalisierung in `scripts/import-wiki.mjs`: keine doppelten
  Slashes mehr (`hrefFor`), bare `discord.gg/greg` außerhalb von
  Code-Spans wird zum Markdown-Link (in `` `code` `` bewusst nicht,
  sonst brechen Backticks), dazu `description`-Frontmatter für
  SEO/Previews.
- Sidebar entflochten und skalierbar: `01 · Start`, `02 · Tracks by
  Language` (Lua/C#/JS/Rust/Modelling, collapsed, Rust mit
  Preview-Badge), `03 · Framework`, `04 · How-To & Help`,
  `05 · Deep-Dive` (First Steps/Systems/Advanced), Glossary.
  Top-Nav jetzt Start · Guidebook · Core · Hooks · FAQ; `site`
  gesetzt (Sitemap funktioniert).

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
