/**
 * Content negotiation for Live/Experimental content-collection articles.
 *
 * When a GET/HEAD request to a canonical article URL (`/concepts/<slug>/`,
 * `/patterns/<slug>/`, `/practices/<slug>/`) carries an `Accept` header that
 * lists `text/markdown`, this rewrites (internally) to the prebuilt static
 * `.md` sibling and returns its body as a 200 response at the *original*
 * URL -- no visible redirect. Every other request (wrong Accept, non-article
 * path, missing `.md` variant, any thrown error) falls through to
 * `context.next()` untouched. See specs/markdown-variants/spec.md,
 * "Content negotiation via edge function (reopened 2026-07-15)".
 *
 * Supersedes the `conditions = {Accept = "text/markdown"}` netlify.toml
 * redirects, which never fired: Netlify redirect `conditions` only match
 * Country/Language/Role/Cookie, not arbitrary request headers.
 *
 * Registration pattern follows the repo's existing edge function, mcp.ts.
 */

// @ts-ignore: External Netlify Edge types
import type { Config, Context } from 'https://edge.netlify.com';
import {
  acceptsMarkdown,
  estimateMarkdownTokens,
  mapArticlePathToMarkdown,
} from '../../src/lib/markdown-negotiation.ts';

export default async function handler(request: Request, context: Context): Promise<Response> {
  try {
    // Load-bearing guard: this handler may call context.next() twice (rewrite
    // attempt, then fall-through). That is only safe because GET/HEAD requests
    // carry no body -- a request body can be consumed exactly once. Widening
    // this guard to body-carrying methods would reintroduce that hazard.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return context.next();
    }

    if (!acceptsMarkdown(request.headers.get('Accept'))) {
      return context.next();
    }

    const url = new URL(request.url);
    const mapping = mapArticlePathToMarkdown(url.pathname);
    if (!mapping) {
      return context.next();
    }

    const mdUrl = new URL(mapping.mdPath, url.origin);
    const mdResponse = await context.next(new Request(mdUrl.toString(), request));

    if (!mdResponse.ok) {
      // Draft article / unknown slug: no prebuilt .md payload. Fail open to
      // Netlify's normal HTML/404 handling for the original request.
      return context.next();
    }

    const body = await mdResponse.text();

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'X-Markdown-Tokens': String(estimateMarkdownTokens(body)),
      },
    });
  } catch {
    // Negotiation must never surface a 5xx: fall through to the default response.
    return context.next();
  }
}

// Edge Function configuration
export const config: Config = {
  path: ['/concepts/*', '/patterns/*', '/practices/*'],
  excludedPath: ['/concepts/*.md', '/patterns/*.md', '/practices/*.md'],
};
