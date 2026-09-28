// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import { SITE_LINKS } from './src/config/site.ts';

// Info architecture (decluttered, scalable, short paths):
//   /docs/{lang}/{page}  — tracks + start + core + deep-dive
//   /hooks/{page}        — reference + events guide
//   /lexicon/            — glossary   /faq/{page} — troubleshooting
//   /guides/{page}       — tutorials + shipping
// .wiki -> short mapping lives in scripts/import-wiki.mjs (pageRoute),
// old long paths redirect via nginx.conf (301).
const luaTrack = [
	{ label: 'Lua 01 · First Mod', slug: 'docs/lua/01-first-mod' },
	{ label: 'Lua 02 · Events', slug: 'docs/lua/02-events' },
	{ label: 'Lua 03 · Timers + Storage', slug: 'docs/lua/03-timers-storage' },
	{ label: 'Lua 04 · UI', slug: 'docs/lua/04-ui' },
	{ label: 'Lua 05 · Systems', slug: 'docs/lua/05-systems' },
	{ label: 'Lua · Complete Project', slug: 'docs/lua/complete-project' },
	{ label: 'Lua · First Mod (deep)', slug: 'docs/lua/first-mod' },
];
const csharpTrack = [
	{ label: 'C# 01 · Setup', slug: 'docs/csharp/01-setup' },
	{ label: 'C# 02 · Lifecycle', slug: 'docs/csharp/02-lifecycle' },
	{ label: 'C# 03 · UI', slug: 'docs/csharp/03-ui' },
	{ label: 'C# 04 · Patches', slug: 'docs/csharp/04-patches' },
	{ label: 'C# 05 · Saves + Shop', slug: 'docs/csharp/05-saves-shop' },
	{ label: 'C# · Complete Project', slug: 'docs/csharp/complete-project' },
	{ label: 'C# 06 · Deploy + Debug', slug: 'docs/csharp/06-deploy-debug' },
	{ label: 'C# · First Mod (deep)', slug: 'docs/csharp/first-mod' },
];
const jsTrack = [
	{ label: 'JS 01 · Setup', slug: 'docs/js/01-setup' },
	{ label: 'JS 02 · Project', slug: 'docs/js/02-project' },
];
const rustTrack = [
	{ label: 'Rust 01 · Setup', slug: 'docs/rust/01-setup', badge: { text: 'Preview', variant: 'note' } },
	{ label: 'Rust 02 · Project', slug: 'docs/rust/02-project', badge: { text: 'Preview', variant: 'note' } },
];
const modellingTrack = [
	{ label: 'Modelling Overview', slug: 'docs/modelling/overview' },
	{ label: 'OBJ + Blender', slug: 'docs/modelling/obj-blender' },
	{ label: 'Shop Item', slug: 'docs/modelling/shop-item' },
	{ label: 'Static Item', slug: 'docs/modelling/static-item' },
	{ label: 'Troubleshooting', slug: 'docs/modelling/troubleshooting' },
];

/** Vector search endpoint (optional): PUBLIC_VECTOR_SEARCH_URL as build env.
 *  When set, HelpHero queries the vector graph DB first (with processing),
 *  otherwise Pagefind directly. Contract: src/lib/vector-search.ts. */
const vectorSearchUrl = process.env.PUBLIC_VECTOR_SEARCH_URL ?? '';

// https://astro.build/config
export default defineConfig({
	site: 'https://wiki.gregframework.eu',
	integrations: [
		starlight({
			title: 'gregCore Wiki',
			description: 'Guidebook, Core reference, Hooks and Glossary for the gregCore Data Center mod framework.',
			customCss: ['./src/styles/custom.css'],
			components: {
				// Help-center header (Start · Guidebook · Core · Hooks · FAQ + audience switch).
				Header: './src/components/Header.astro',
				// Article footer (feedback + Discord "Get more help >").
				Footer: './src/components/Footer.astro',
			},
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: 'any' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#051424' } },
				...(vectorSearchUrl
					? [{ tag: 'meta', attrs: { name: 'greg-vector-search', content: vectorSearchUrl } }]
					: []),
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: SITE_LINKS.githubCore },
				{ icon: 'discord', label: 'Discord', href: SITE_LINKS.discord },
			],
			sidebar: [
				{ label: 'Home', slug: 'index' },
				{
					label: '01 · Start',
					items: [
						{ label: 'Getting Started', slug: 'docs/start/getting-started' },
						{ label: 'Installation', slug: 'docs/start/installation' },
						{ label: 'Mod Users Guide', slug: 'docs/start/mod-users-guide' },
						{ label: 'Prerequisites', slug: 'docs/start/prerequisites' },
						{ label: 'Guidebook Overview', slug: 'docs/overview' },
						{ label: 'Dev Setup', slug: 'docs/start/dev' },
						{ label: 'Environment', slug: 'docs/start/environment' },
					],
				},
				{
					label: '02 · Tracks by Language',
					collapsed: true,
					items: [
						{ label: 'Lua', collapsed: true, items: luaTrack },
						{ label: 'C#', collapsed: true, items: csharpTrack },
						{ label: 'JavaScript', collapsed: true, items: jsTrack },
						{ label: 'Rust', collapsed: true, items: rustTrack },
						{ label: 'Modelling (OBJ)', collapsed: true, items: modellingTrack },
					],
				},
				{
					label: '03 · Framework',
					items: [
						{ label: 'Core Overview', slug: 'docs/core/overview' },
						{ label: 'Save Engine', slug: 'docs/core/save-engine' },
						{ label: 'Core Events', slug: 'hooks/events' },
						{ label: 'Hooks Reference', slug: 'hooks/reference' },
						{ label: 'Events + Hooks Guide', slug: 'hooks/guide' },
					],
				},
				{
					label: '04 · How-To & Help',
					items: [
						{ label: 'Tutorials', slug: 'guides/tutorials' },
						{ label: 'FAQ + Troubleshooting', slug: 'faq/troubleshooting' },
						{ label: 'Debugging', slug: 'guides/debugging' },
						{ label: 'Computer UI', slug: 'guides/computer-ui' },
						{ label: 'Porting Matrix', slug: 'guides/porting-matrix' },
						{ label: 'Release', slug: 'guides/release' },
						{ label: 'Next Languages', slug: 'guides/next-languages', badge: { text: 'Preview', variant: 'note' } },
						{ label: 'Article Kit · Authors', slug: 'guides/article-kit', badge: { text: 'Authors', variant: 'tip' } },
					],
				},
				{
					label: '05 · Deep-Dive',
					collapsed: true,
					items: [
						{ label: 'Timers + Coroutines', slug: 'docs/deep/timers-coroutines' },
						{ label: 'Data Storage', slug: 'docs/deep/data-storage' },
						{ label: 'UI Panels + HUD', slug: 'docs/deep/ui-panels-hud' },
						{ label: 'Shop Items', slug: 'docs/deep/shop-items' },
						{ label: 'Hardware IDs + Inventory', slug: 'docs/deep/hardware-ids-inventory' },
						{ label: 'Harmony + IL2CPP', slug: 'docs/deep/harmony-il2cpp' },
						{ label: 'Scripting Bridges', slug: 'docs/deep/scripting-bridges' },
						{ label: 'Native Co-op', slug: 'docs/deep/native-coop' },
						{ label: 'Best Practices', slug: 'docs/deep/best-practices' },
						{ label: 'Publishing', slug: 'docs/deep/publishing' },
						{ label: 'GregLint', slug: 'docs/deep/greglint' },
					],
				},
				{ label: 'Lexicon', slug: 'lexicon' },
			],
		}),
		// MDX after Starlight: expressive-code (Starlight-internal) must run before mdx().
		// Enables components + images in .mdx (homepage, later articles).
		mdx(),
	],
});
