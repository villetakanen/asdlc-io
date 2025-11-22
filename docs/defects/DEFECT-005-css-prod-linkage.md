# DEFECT-005: CSS Linkage Broken in Production

**Status:** RESOLVED
**Severity:** Critical (Visual Regression)
**Reported:** Post-Launch (Netlify Deployment)
**Resolved:** 2025-01-XX

## Summary

CSS styling was completely missing in production (Netlify) while working correctly in local development. This was caused by an incorrect CSS link path that worked in Astro's dev server but failed in production builds.

## Problem Statement

After deploying to Netlify, the site appeared completely unstyled - no borders, no fonts, no layout grid. All visual styling from `src/styles/global.css` was missing.

### Root Cause

The `BaseLayout.astro` file used a `<link>` tag with an incorrect path:

```html
<link rel="stylesheet" href="/src/styles/global.css" />
```

**Why it worked in dev:**
- Astro's dev server can resolve `/src/` paths and serve files directly from the source tree
- HMR (Hot Module Replacement) applies CSS changes instantly

**Why it failed in production:**
- Production builds don't include the `src/` directory
- The `/src/styles/global.css` path returns a 404 in production
- No CSS loads → completely unstyled site

## Solution

Replace the `<link>` tag with a direct CSS import in the component's frontmatter:

```astro
---
import "../styles/global.css";
---
```

### Why This Works

1. **Astro's Build Pipeline:** CSS imports are processed by Vite during build
2. **Automatic Bundling:** CSS is bundled and optimized for production
3. **Inline or External:** Astro decides whether to inline or create separate CSS files based on size
4. **Cache-Friendly:** External CSS files get content hashes for cache busting

## Implementation

### File Changed
`src/layouts/BaseLayout.astro`

### Before
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  ...
```

### After
```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <title>{title} | ASDLC.io</title>
  </head>
  ...
```

## Verification

### Build Output
```bash
pnpm build
# Result: 5 page(s) built in 591ms
# CSS is now inlined in <style> tags in HTML output
```

### Production HTML
```html
<head>
  <style>
    :root{--c-bg: #ffffff;--c-fg: #050505;...}
    /* All global.css content inlined */
  </style>
</head>
```

### Quality Gates (All Passed)
- ✅ `pnpm lint` - 10 files checked, no fixes needed
- ✅ `pnpm check` - 0 errors, 0 warnings, 0 hints
- ✅ `pnpm build` - 5 pages generated successfully

## Impact

### Before Fix
- Site completely unstyled in production
- Poor user experience
- Unprofessional appearance
- Launch blocked

### After Fix
- All styles render correctly in production
- Consistent appearance between dev and prod
- Optimized CSS delivery (inlined for performance)
- Ready for production use

## Lessons Learned

1. **Always Test Production Builds Locally:** Run `pnpm build && pnpm preview` before deploying
2. **Dev/Prod Parity:** Astro's dev server is more forgiving than production builds
3. **Follow Framework Conventions:** Astro documentation recommends importing CSS, not linking to source files
4. **CSS Import is Standard:** Modern build tools expect CSS to be imported as modules

## AGENTS.md Compliance

### Violated Directives
- ❌ **Modern APIs Only:** Using `<link>` to source files is legacy approach
- ❌ **Quality Checklist:** Should have tested production build before deployment

### Corrective Actions
- ✅ Updated to use modern CSS import syntax
- ✅ Verified production build locally
- ✅ All quality gates pass

## Prevention

### Pre-Deployment Checklist
Add to `AGENTS.md` or create `PUBLISHING.md`:

```markdown
- [ ] Run `pnpm build` successfully
- [ ] Run `pnpm preview` to test production build locally
- [ ] Verify styles load correctly in preview
- [ ] Check browser console for 404 errors
- [ ] Test on actual deployment platform (Netlify, Vercel, etc.)
```

### Astro Best Practices
Document in project README:
- Import CSS files in component frontmatter
- Never link to `/src/` paths in production HTML
- Use Astro's asset pipeline for all static resources

## References

- **Astro Docs:** [Styling & CSS](https://docs.astro.build/en/guides/styling/)
- **Vite Docs:** [CSS Code Splitting](https://vitejs.dev/guide/features.html#css-code-splitting)
- **File Changed:** `src/layouts/BaseLayout.astro`
- **Related:** `DEFECT-004` (Pre-publish checklist - should have caught this)

---

**Status: RESOLVED** - CSS now loads correctly in production via proper import mechanism.