// Vector search — contract for the graph DB with processing/enrichment.
// The help search queries this endpoint first (when configured via meta tag),
// otherwise it falls back to Pagefind. The backend is NOT implemented here —
// only the client contract, so the search page can dock on later.
//
// Configuration (build env): PUBLIC_VECTOR_SEARCH_URL=https://<host>/api/wiki-search
// → astro.config.mjs injects it as <meta name="greg-vector-search"> into the head.
//
// Request:  POST { query: string, lang: string, audience: string }
// Response: { results: [{ title: string, url: string, snippet: string }] }
// Rules: empty results = no hits (show the Pagefind hint instead),
// HTTP errors/timeout (>2.5s) = silent fallback to Pagefind.

export interface VectorHit {
	title: string;
	url: string;
	snippet: string;
}

const TIMEOUT_MS = 2500;

export function vectorEndpoint(): string | null {
	const meta = document.querySelector('meta[name="greg-vector-search"]');
	const url = meta?.getAttribute('content')?.trim();
	return url ? url : null;
}

export async function vectorSearch(query: string, lang: string, audience: string): Promise<VectorHit[]> {
	const endpoint = vectorEndpoint();
	if (!endpoint) return [];
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query, lang, audience }),
			signal: ctrl.signal,
		});
		if (!res.ok) return [];
		const data = await res.json();
		if (!Array.isArray(data?.results)) return [];
		return data.results
			.filter((r) => r && typeof r.title === 'string' && typeof r.url === 'string')
			.slice(0, 8)
			.map((r) => ({ title: r.title, url: r.url, snippet: String(r.snippet ?? '') }));
	} catch {
		return [];
	} finally {
		clearTimeout(timer);
	}
}
