/**
 * Pure logic for Accept-header content negotiation between the HTML and
 * prebuilt `.md` representations of a content-collection article.
 *
 * Kept dependency-free (no Astro/Netlify imports) so it can be unit tested
 * in Node and reused as a thin shell by the edge function
 * (`netlify/edge-functions/markdown-negotiation.ts`), mirroring the
 * mcp.ts -> src/mcp/ layering already used in this repo.
 */

/** Collections that emit a prebuilt `.md` sibling per specs/markdown-variants/spec.md. */
export const NEGOTIABLE_COLLECTIONS = new Set(["concepts", "patterns", "practices"]);

/**
 * True when the Accept header lists `text/markdown` as one of its media
 * ranges. Tolerates multi-value lists and `;q=` parameters (media-range
 * matching, not string equality). A bare wildcard (any-type or text-only)
 * must NOT match -- only an explicit `text/markdown` entry does. Per
 * RFC 7231 §5.3.1, `q=0` (or a malformed `q`) means "not acceptable" and
 * does not match.
 */
export function acceptsMarkdown(acceptHeader: string | null | undefined): boolean {
  if (!acceptHeader) return false;
  return acceptHeader.split(",").some((part) => {
    const [mediaType, ...params] = part.split(";");
    if (mediaType?.trim().toLowerCase() !== "text/markdown") return false;
    const qParam = params.map((p) => p.trim().toLowerCase()).find((p) => p.startsWith("q="));
    if (!qParam) return true;
    const q = Number.parseFloat(qParam.slice(2));
    return Number.isFinite(q) && q > 0;
  });
}

export type ArticlePathMapping = {
  collection: string;
  slug: string;
  /** Sibling static `.md` path, e.g. `/concepts/agentic-sdlc.md`. */
  mdPath: string;
};

/**
 * Maps a canonical article URL path (`/concepts/<slug>/` or `/concepts/<slug>`)
 * to its prebuilt `.md` sibling. Returns `null` for anything that isn't a
 * single-segment article path in a negotiable collection: index pages
 * (`/concepts/`), paths already ending in `.md`, and nested/non-article
 * paths (`/concepts/foo/bar`).
 */
export function mapArticlePathToMarkdown(pathname: string): ArticlePathMapping | null {
  if (pathname.endsWith(".md")) return null;

  const trimmed = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const segments = trimmed.split("/").filter(Boolean);

  if (segments.length !== 2) return null;

  const [collection, slug] = segments;
  if (!collection || !slug) return null;
  if (!NEGOTIABLE_COLLECTIONS.has(collection)) return null;

  return {
    collection,
    slug,
    mdPath: `/${collection}/${slug}.md`,
  };
}

/** Estimate: payload length / 4, rounded up (per spec's X-Markdown-Tokens contract). */
export function estimateMarkdownTokens(payload: string): number {
  return Math.ceil(payload.length / 4);
}
