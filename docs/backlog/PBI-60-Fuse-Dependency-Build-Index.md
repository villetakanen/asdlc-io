# PBI-60: Build-Time Fuse.js Index Generation

> Status: Ready

## Directive

Add `fuse.js` as a project dependency and extend the build script to generate a pre-compiled Fuse.js search index alongside the existing `articles.json`. Add a gitignore entry for the generated index file.

**Scope:**
- `package.json` (add dependency)
- `scripts/generate-mcp-index.mjs` (extend)
- `.gitignore` (add entry)

## Dependencies
- Blocked by: None
- Must merge before: PBI-61, PBI-62

## Context
Ref: `plans/mcp-server/mcp-search.md` — Sections: "Dependency", "Build Script Changes"

The build script (`scripts/generate-mcp-index.mjs`) currently reads all markdown files from `src/content/`, filters by status (Live/Experimental), and writes `src/mcp/articles.json`. This PBI extends it to also produce a Fuse.js search index at `src/mcp/fuse-index.json` using `Fuse.createIndex()`.

## Changes Required

**1. `package.json`:**

Add `fuse.js` to `dependencies` (not `devDependencies` — the edge function needs it at runtime):

```
"fuse.js": "^7.0.0"
```

Run `pnpm install` after.

**2. `scripts/generate-mcp-index.mjs`:**

After the existing `writeFileSync` for `articles.json` (line 53), add:

- Import `Fuse` from `fuse.js` (add to top of file)
- Define the keys array with weights:

```javascript
const fuseKeys = [
  { name: "title", weight: 1.0 },
  { name: "tags", weight: 0.8 },
  { name: "slug", weight: 0.6 },
  { name: "description", weight: 0.4 },
  { name: "content", weight: 0.2 },
];
```

- Create the index: `const fuseIndex = Fuse.createIndex(fuseKeys, articles)`
- Define output path: `const FUSE_INDEX_FILE = resolve("src/mcp/fuse-index.json")`
- Serialize and write: `writeFileSync(FUSE_INDEX_FILE, JSON.stringify(fuseIndex.toJSON()))`
- Log file size for observability (use `statSync` or compute from the JSON string length)

**3. `.gitignore`:**

Add the following line (near the top, after `dist/`):

```
src/mcp/fuse-index.json
```

## Verification
- [ ] `fuse.js` appears in `dependencies` in `package.json`
- [ ] `pnpm install` succeeds without errors
- [ ] `node scripts/generate-mcp-index.mjs` produces both `src/mcp/articles.json` and `src/mcp/fuse-index.json`
- [ ] Console output logs article count AND Fuse index file path/size
- [ ] `src/mcp/fuse-index.json` is valid JSON (parseable)
- [ ] Index file size is < 500 KB
- [ ] `src/mcp/fuse-index.json` is covered by `.gitignore`
- [ ] Existing `articles.json` output is identical (no regressions)
- [ ] `pnpm check` passes

## Notes
- Do NOT modify the existing `articles.json` generation logic — it must produce identical output
- The `fuseKeys` array here MUST match the keys used in PBI-61's `FUSE_OPTIONS`. Divergence between build-time and runtime keys causes score inconsistency.
- `fuse.js` goes in `dependencies`, not `devDependencies`, because the Netlify Edge Function imports it at runtime
- The generated `fuse-index.json` will be regenerated during every `prebuild` (which runs before `pnpm build`), so gitignoring it is safe

## Blocks
- PBI-61 (needs `fuse.js` installed to import in `content.ts`)
- PBI-62 (needs `fuse-index.json` to exist for edge function import)

## Related
- Spec: `plans/mcp-server/mcp-search.md`
- Existing build script: `scripts/generate-mcp-index.mjs`
