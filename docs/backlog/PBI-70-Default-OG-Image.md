# PBI-70: Default Social Media Image (Status: Completed)

## 1. Directive
Replace the default Open Graph / social media image from `/og-default.svg` to `/asdlc.png` so that all pages without a page-specific image use the PNG brand asset.

## 2. Scope
- Single-line change in `src/components/SEOMetadata.astro` (line 15).
- No schema changes, no new props, no new components.

## 3. Dependencies
- `public/asdlc.png` must exist and be committed (currently untracked).

## 4. Context
The `image` prop plumbing already works end-to-end: `SEOMetadata.astro` accepts an optional `image` prop, `BaseLayout.astro` passes it through, and content pages can supply it. The only change is the **fallback value** when no image is provided.

SVG is not universally supported as an OG image format (Facebook, LinkedIn, and many link-preview services reject SVGs). Using PNG ensures broad compatibility.

## 5. Changes Required
- [ ] Change the default image path in `src/components/SEOMetadata.astro` from `/og-default.svg` to `/asdlc.png`.
- [ ] Ensure `public/asdlc.png` is tracked in git.

## 6. Verification
- [ ] `pnpm build` succeeds.
- [ ] View page source of any built page — `og:image` and `twitter:image` meta tags reference `/asdlc.png` (absolute URL).
- [ ] Pages that pass a custom `image` prop still use that image (no regression).

## 7. Notes
- `public/og-default.svg` can be removed in a follow-up cleanup if no longer referenced elsewhere.
- Future PBI may add an `image` field to `articleSchema` in `src/content/config.ts` to allow per-article OG images; that is **out of scope** here.
