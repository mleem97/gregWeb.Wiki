// Single source of truth for all external URLs.
// When Discord / User-Docs change, edit only here — everything else follows.
export const SITE_LINKS = {
	// Primary invite. If it ever expires, the fallback applies.
	discord: 'https://discord.gg/greg',
	discordFallback: 'https://discord.gg/QhbvmzEefH',
	githubCore: 'https://github.com/mleem97/gregCore',
	steamCollection: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3701575419',
	// Regular mod users are fully served on datacentermods.com —
	// this wiki is the Mod-Dev reference (docs/hooks/lexicon/faq/guides).
	userDocs: 'https://datacentermods.com',
	wikiProd: 'https://wiki.gregframework.eu',
} as const;

export type Audience = 'user' | 'moddev';
export const AUDIENCE_KEY = 'greg-audience';

export type CodingLang = 'all' | 'lua' | 'csharp' | 'js' | 'rust' | 'modelling';
export const LANG_LABEL: Record<CodingLang, string> = {
	all: 'All languages',
	lua: 'Lua',
	csharp: 'C#',
	js: 'JavaScript',
	rust: 'Rust',
	modelling: 'Modelling (OBJ)',
};

/** URL prefixes per CodingLang — the global Lang filter hides sidebar + sections by these. */
export const LANG_PREFIX: Record<Exclude<CodingLang, 'all'>, string[]> = {
	lua: ['/docs/lua/'],
	csharp: ['/docs/csharp/'],
	js: ['/docs/js/'],
	rust: ['/docs/rust/'],
	modelling: ['/docs/modelling/'],
};
