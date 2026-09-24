// import-wiki.mjs — copies ../.wiki/*.md into src/content/docs/ for the build.
// - Home.md            -> index.md
// - _Sidebar.md        -> skipped (sidebar lives in astro.config.mjs)
// - all other pages    -> lowercased filenames (stable slugs)
// - prepends `title:` frontmatter from the first `# H1` (Starlight requires it)
// - strips that first `# H1` from the body (Starlight renders `title:`
//   as the page H1 — keeping it would show every heading twice)
// - rewrites [[Wiki Links]] to relative markdown links, validated against
//   the page list (warns on dangling targets instead of failing)
// Run: `node scripts/import-wiki.mjs` (also via `npm run sync` / `npm run build`).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(here, '..');
const wikiSrc = process.env.WIKI_SRC ?? join(siteRoot, 'wiki-source');
const outDir = join(siteRoot, 'src', 'content', 'docs');

const slugOf = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, '-');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = readdirSync(wikiSrc).filter((f) => f.endsWith('.md'));
const known = new Set(files.map((f) => slugOf(f.replace(/\.md$/, ''))));
known.add('home');

let count = 0;
let warnings = 0;
for (const file of files) {
  if (file === '_Sidebar.md') continue;
  const raw = readFileSync(join(wikiSrc, file), 'utf8');
  const lines = raw.split('\n');
  const h1 = lines.find((l) => l.startsWith('# '));
  const title = (h1 ?? `# ${file.replace(/\.md$/, '')}`).replace(/^# /, '').trim();
  const body = raw
    .replace(/^---\n[\s\S]*?\n---\n/, '') // strip existing frontmatter if any
    .replace(/^# .*\r?\n/, '') // drop title H1 (lives in frontmatter now — avoids double H1 in Astro)
    .replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
      const [targetRaw, labelRaw] = inner.split('|').map((s) => s.trim());
      const slug = slugOf(targetRaw);
      const label = labelRaw || targetRaw;
      const href = slug === 'home' ? './' : `./${slug}/`;
      if (!known.has(slug)) {
        console.warn(`[wiki] dangling link [[${inner}]] in ${file}`);
        warnings++;
      }
      return `[${label}](${href})`;
    });
  const out = file === 'Home.md' ? 'index.md' : file.toLowerCase();
  let frontmatter = `---\ntitle: ${JSON.stringify(title)}\n---\n`;
  if (file === 'Home.md') {
    // Landing-style splash hero (gregWeb.Landingpage look).
    frontmatter =
      `---\ntitle: ${JSON.stringify(title)}\ntemplate: splash\nhero:\n` +
      `  title: gregCore Wiki\n` +
      `  tagline: The complete guidebook for the gregCore Data Center mod framework — Harmony patching, UI overlays, save engine, scripting, and multi-mod architecture.\n` +
      `  actions:\n` +
      `    - text: Read the Guidebook\n      link: ./guidebook/\n      icon: right-arrow\n      variant: primary\n` +
      `    - text: Install gregCore\n      link: ./player-installation/\n      icon: rocket\n      variant: secondary\n` +
      `    - text: GitHub\n      link: https://github.com/mleem97/gregCore\n      icon: github\n      variant: minimal\n` +
      `---\n`;
  }
  writeFileSync(join(outDir, out), `${frontmatter}\n${body}`);
  count++;
}
console.log(`[wiki] imported ${count} pages from ${wikiSrc} (${warnings} warnings)`);
