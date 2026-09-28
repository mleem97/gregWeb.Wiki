// import-wiki.mjs — copies wiki-source/*.md(.mdx) into src/content/docs/.
// Short path scheme (as short as possible):
//   {domain}/docs/{lang}/{page}   — Guidebook-Tracks + Start + Core + Deep-Dive
//   {domain}/hooks/{page}          — Hooks-Referenz + Events-Guide
//   {domain}/lexicon/              — Glossar
//   {domain}/faq/{page}            — Troubleshooting
//   {domain}/guides/{page}         — Tutorials + Shipping (Debug/UI/Porting/Release)
// .wiki sources stay FLAT (GitHub wiki), mapping lives here.
// Alte Lang-Pfade (/guidebook/..., /players/..., /developers/..., /core/...,
// /glossary/) redirect via nginx.conf (301) to the short paths.
// - Home.md            -> index.mdx (Help-Center, Perplexity-Stil, MDX)
// - _Sidebar.md        -> skip (Sidebar lebt in astro.config.mjs)
// - title from first `# H1` -> frontmatter, H1 removed from body (no double H1)
// - [[Wiki Links]] -> relative-correct short-path links, validated (warns instead of failing)
// - bare discord.gg/greg outside `code` -> Markdown link
// Run: `node scripts/import-wiki.mjs` (also via `npm run sync` / `npm run build`).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync, cpSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(here, '..');
const wikiSrc = process.env.WIKI_SRC ?? join(siteRoot, 'wiki-source');
const outDir = join(siteRoot, 'src', 'content', 'docs');

const DISCORD_URL = 'https://discord.gg/greg';

const slugOf = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Short route for a .wiki slug.
 * @returns {{dir: string, name: string}} name incl. extension (.md / .mdx for Home)
 */
function pageRoute(slug) {
  if (slug === 'home' || slug === 'index') return { dir: '', name: 'index.mdx' };
  if (slug === 'glossary') return { dir: 'lexicon', name: 'index.md' };
  if (slug === 'guidebook') return { dir: 'docs', name: 'overview.md' };
  if (slug === 'guidebook-prerequisites') return { dir: 'docs/start', name: 'prerequisites.md' };
  if (slug.startsWith('guidebook-lua-')) return { dir: 'docs/lua', name: `${slug.slice('guidebook-lua-'.length)}.md` };
  if (slug.startsWith('guidebook-csharp-')) return { dir: 'docs/csharp', name: `${slug.slice('guidebook-csharp-'.length)}.md` };
  if (slug.startsWith('guidebook-js-')) return { dir: 'docs/js', name: `${slug.slice('guidebook-js-'.length)}.md` };
  if (slug.startsWith('guidebook-rust-')) return { dir: 'docs/rust', name: `${slug.slice('guidebook-rust-'.length)}.md` };
  if (slug.startsWith('guidebook-modelling-')) return { dir: 'docs/modelling', name: `${slug.slice('guidebook-modelling-'.length)}.md` };
  if (['guidebook-debugging', 'guidebook-computer-ui', 'guidebook-porting-matrix', 'guidebook-release', 'guidebook-next-languages'].includes(slug)) {
    return { dir: 'guides', name: `${slug.slice('guidebook-'.length)}.md` };
  }
  if (slug === 'player-getting-started') return { dir: 'docs/start', name: 'getting-started.md' };
  if (slug === 'player-installation') return { dir: 'docs/start', name: 'installation.md' };
  if (slug === 'player-mod-users-guide') return { dir: 'docs/start', name: 'mod-users-guide.md' };
  if (slug === 'core-overview') return { dir: 'docs/core', name: 'overview.md' };
  if (slug === 'core-save-engine') return { dir: 'docs/core', name: 'save-engine.md' };
  if (slug === 'core-events') return { dir: 'hooks', name: 'events.md' };
  if (slug === 'hooks-reference') return { dir: 'hooks', name: 'reference.md' };
  if (slug === 'developer-getting-started') return { dir: 'docs/start', name: 'dev.md' };
  if (slug === 'developer-environment') return { dir: 'docs/start', name: 'environment.md' };
  if (slug === 'developer-first-lua-mod') return { dir: 'docs/lua', name: 'first-mod.md' };
  if (slug === 'developer-first-csharp-mod') return { dir: 'docs/csharp', name: 'first-mod.md' };
  if (slug === 'developer-events-hooks-guide') return { dir: 'hooks', name: 'guide.md' };
  if (slug.startsWith('developer-')) return { dir: 'docs/deep', name: `${slug.slice('developer-'.length)}.md` };
  if (slug === 'tutorials') return { dir: 'guides', name: 'tutorials.md' };
  if (slug === 'faq-troubleshooting') return { dir: 'faq', name: 'troubleshooting.md' };
  return { dir: '', name: `${slug}.md` };
}

/** URL path (with trailing slash) for a .wiki slug. */
function urlPathOf(slug) {
  const { dir, name } = pageRoute(slug);
  const base = name.replace(/\.mdx?$/, '');
  if (slug === 'home' || slug === 'index') return '/';
  if (base === 'index') return `/${dir}/`;
  return dir === '' ? `/${base}/` : `/${dir}/${base}/`;
}

/** Relative link from a source page (oldSlug) to a target page (oldSlug). */
function hrefFor(fromSlug, targetSlug) {
  if (targetSlug === 'home') {
    const from = urlPathOf(fromSlug);
    const depth = from.split('/').filter(Boolean).length;
    return depth === 0 ? './' : '../'.repeat(depth);
  }
  const fromDir = posix.dirname(urlPathOf(fromSlug));
  const to = urlPathOf(targetSlug);
  let rel = posix.relative(fromDir, to);
  if (rel === '') return './';
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel.replace(/\/+/g, '/');
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = readdirSync(wikiSrc).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
const known = new Set(
  files.map((f) => slugOf(f.replace(/\.mdx?$/, ''))),
);
known.add('home');

let count = 0;
let warnings = 0;
for (const file of files) {
  if (file === '_Sidebar.md' || file === '_Sidebar.mdx') continue;
  const isHome = file === 'Home.md' || file === 'Home.mdx';
  const slug = isHome ? 'home' : slugOf(file.replace(/\.mdx?$/, ''));
  const { dir, name } = pageRoute(slug);
  if (!isHome && dir === '' && slug !== 'glossary') {
    console.warn(`[wiki] unmapped page lands at root: ${file}`);
    warnings++;
  }
  const raw = readFileSync(join(wikiSrc, file), 'utf8');
  const lines = raw.split('\n');
  const h1 = lines.find((l) => l.startsWith('# '));
  const title = (h1 ?? `# ${file.replace(/\.mdx?$/, '')}`).replace(/^# /, '').trim();
  let body = raw
    .replace(/^---\n[\s\S]*?\n---\n/, '') // strip existing frontmatter if any
    .replace(/^# .*\r?\n/, '') // drop title H1 (lives in frontmatter now — avoids double H1 in Astro)
    .replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
      const [targetRaw, labelRaw] = inner.split('|').map((s) => s.trim());
      const target = slugOf(targetRaw);
      const label = labelRaw || targetRaw;
      const href = hrefFor(slug, target);
      if (!known.has(target)) {
        console.warn(`[wiki] dangling link [[${inner}]] in ${file}`);
        warnings++;
      }
      return `[${label}](${href})`;
    });
  // Fix: bare discord.gg/greg outside code spans -> Markdown link.
  // Deliberately NOT replaced inside `code` (would break backticks).
  body = body
    .split('`')
    .map((part, i) =>
      i % 2 === 0
        ? part.replace(
            /(?<!\]\()(?<!\/\/)discord\.gg\/greg\b/g,
            `[discord.gg/greg](${DISCORD_URL})`,
          )
        : part,
    )
    .join('`');

  if (isHome) {
    const frontmatter =
      `---\ntitle: ${JSON.stringify(title)}\n` +
      `description: Help Center for gregCore — guidebook, core, hooks & FAQ, filterable by CodingLang.\n` +
      `template: splash\n` +
      `hero:\n` +
      `  title: gregCore Wiki\n` +
      `  tagline: The complete guidebook for the gregCore Data Center mod framework — Harmony patching, UI overlays, save engine, scripting, and multi-mod architecture.\n` +
      `  actions:\n` +
      `    - text: Read the Guidebook\n      link: ./docs/overview/\n      icon: right-arrow\n      variant: primary\n` +
      `    - text: Install gregCore\n      link: ./docs/start/installation/\n      icon: rocket\n      variant: secondary\n` +
      `    - text: GitHub\n      link: https://github.com/mleem97/gregCore\n      icon: github\n      variant: minimal\n` +
      `---\n`;
    // Help center (Perplexity layout): breadcrumb + search + toolbar + categories.
    // MDX components — hence index.mdx instead of index.md.
    // Images: Placehold.co placeholders until final screenshots land.
    const helpCenter = `
import HelpHero from '../../components/HelpHero.astro';
import CategoryGrid from '../../components/CategoryGrid.astro';
import AudienceSwitch from '../../components/AudienceSwitch.astro';
import LangFilter from '../../components/LangFilter.astro';
import DiscordHelpButton from '../../components/DiscordHelpButton.astro';

<HelpHero />

<div class="help-toolbar">
  <AudienceSwitch />
  <LangFilter />
</div>

<CategoryGrid />

## Popular articles

| I want to… | Read |
|---|---|
| Build my first mod (Lua, C#, JS) — step by step | [Guidebook](./docs/overview/) → [Prerequisites](./docs/start/prerequisites/) → your track |
| Play with mods, install gregCore, use the Mod Hub | [Getting Started](./docs/start/getting-started/) → [Installation](./docs/start/installation/) → [Mod Users Guide](./docs/start/mod-users-guide/) |
| Look up an event or API call | [Hooks Reference](./hooks/reference/) + [Lexicon](./lexicon/) |
| Fix something broken | [FAQ Troubleshooting](./faq/troubleshooting/) |

## Recently updated

- [Rust 01 · Setup](./docs/rust/01-setup/) — native events, FFI preview
- [Porting Matrix](./guides/porting-matrix/) — same feature in Lua / C# / JS
- [Save Engine](./docs/core/save-engine/) — sidecars, gregID, SaveGuard
- [Tutorials](./guides/tutorials/) — linting, shop items, presets, packs, publishing

![Wiki overview placeholder](https://placehold.co/1200x400/0d1c2d/8aebff?text=gregCore+Wiki+%7C+Help+Center)

<div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
  <DiscordHelpButton />
  <span style="color:#859397; font-size:0.85rem;">Answers in &lt; 24h on Discord · ask with <code>version</code> + log excerpt</span>
</div>

---
`;
    const dest = join(outDir, 'index.mdx');
    writeFileSync(dest, `${frontmatter}\n${helpCenter}\n${body}`);
    count++;
    continue;
  }

  // Short description: first non-empty paragraph for SEO/previews (used by vector DB + Pagefind).
  const firstPara = body.split('\n\n').map((s) => s.trim()).find((s) => s && !s.startsWith('#') && !s.startsWith('|') && !s.startsWith('>')) || '';
  const description = firstPara.replace(/\n/g, ' ').slice(0, 160);
  const frontmatter = `---\ntitle: ${JSON.stringify(title)}\n${description ? `description: ${JSON.stringify(description)}\n` : ''}---\n`;
  const dest = join(outDir, dir, name);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${frontmatter}\n${body}`);
  count++;
}

// wiki-local/ — local MDX/MD pages that do NOT come from the .wiki snapshot
// (author docs, demos). Copied 1:1 into src/content/docs/ —
// outDir is wiped above, hence this runs last. Authors provide frontmatter
// themselves (at least title). No [[...]] rewriting: use relative links.
const localDir = join(siteRoot, 'wiki-local');
let localCount = 0;
if (existsSync(localDir)) {
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(md|mdx)$/.test(e)) continue;
      const rel = p.slice(localDir.length + 1);
      const dest = join(outDir, rel);
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(p, dest);
      localCount++;
    }
  };
  walk(localDir);
}
console.log(`[wiki] imported ${count} pages from ${wikiSrc} + ${localCount} local (${warnings} warnings)`);
