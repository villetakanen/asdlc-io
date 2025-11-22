# AGENTS.md: Directives for Autonomous Contributors

**Status:** Active
**Enforcement:** Strict
**Last Updated:** 2025-01-XX (Post-Phase 2 UAT)

This file defines the operating protocols for any Large Language Model (LLM), Agent, or Copilot interacting with this repository.

## 1. Core Directives (Global)
* **No "Vibe Coding":** Do not guess types. Do not use `any`. Do not hallucinate imports. ALL component imports in `.astro` files MUST be explicitly declared (enforced by Astro 5+).
* **Schema First:** Before generating any `.md` or `.mdx` content, you MUST read `src/content/config.ts`. All frontmatter must validate against the Zod schemas defined there.
* **Style:** Adhere to the "Spec-Sheet" aesthetic defined in `src/styles/global.css`. Do not add inline styles or Tailwind classes.
* **Explicit Imports:** Every `.astro` file MUST explicitly import all components and layouts used. No implicit component resolution.
* **Modern APIs Only:** Always use the latest recommended APIs. For Astro 5+, use Content Layer API (`glob` loader) instead of legacy `type: 'content'` collections.
* **Dependency Currency:** Dependencies SHOULD be kept up-to-date. When major version updates occur, follow official migration guides and use provided migration tools.

## 2. Astro-Specific Rules (Astro 5+)
* **Content Collections:** Use `loader: glob({ pattern, base })` instead of `type: 'content'`.
* **Entry Properties:** Use `entry.id` (not `entry.slug`) for routing in `getStaticPaths()`.
* **Rendering:** Import and use `render(entry)` function, not `await entry.render()`.
* **Date Schema:** Use `z.coerce.date()` for automatic string-to-date parsing in frontmatter.
* **Component Imports:** ALL Astro components, layouts, and utilities MUST be explicitly imported at the top of each `.astro` file.

## 3. GitHub Copilot / Cursor Rules
* **Context Awareness:** Always check `.vscode/settings.json` to understand the Biome formatter settings.
* **Commit Protocol:** When generating commit messages, strictly follow Conventional Commits (e.g., `feat:`, `fix:`, `arch:`, `docs:`, `chore:`).
* **Reference:** [GitHub Copilot Best Practices](https://docs.github.com/en/copilot)

## 4. Gemini / Vertex Agent Rules
* **Reasoning Traces:** When proposing architectural changes, you must provide a `<thinking>` block explaining *why* a pattern was chosen before outputting code.
* **Context Window:** Prioritize `src/content/config.ts` and `AGENTS.md` in your context window. Drop `node_modules` or build artifacts.
* **Reference:** [Google Cloud Vertex AI Agent Design](https://cloud.google.com/vertex-ai/docs/generative-ai/agent-design)

## 5. Dependency Management Rules
* **Version Currency:** Before implementing features, check if dependencies are current using `pnpm outdated`.
* **Migration Tools:** When updating major versions, use official migration CLIs when available (e.g., `biome migrate`, framework upgrade tools).
* **Breaking Changes:** Read migration guides thoroughly. Document breaking changes in defect reports or PRs.
* **Quality Gates:** After dependency updates, ALL quality gates MUST pass: `pnpm lint`, `pnpm check`, `pnpm build`.
* **Security Priority:** Security patches should be applied promptly, even if they require minor code adjustments.

## 6. Lessons Learned from UAT (Phase 2+)
* **DEFECT-001:** Always implement explicit imports. Missing imports cause TypeScript compilation failures.
* **DEFECT-002:** Outdated dependencies create security risks and compatibility issues. Use migration tools to reduce manual work.
* **DEFECT-003:** Legacy APIs should be migrated to modern equivalents during major version upgrades to prevent future breaking changes.
* **DEFECT-005:** CSS must be imported in component frontmatter, not linked via `<link href="/src/...">`. Dev server masks this issue.

## 7. Quality Checklist (Pre-Commit)
Before committing ANY code, verify:
- [ ] `pnpm lint` passes (Biome 2.x formatting and linting)
- [ ] `pnpm check` passes (Astro type checking, 0 errors)
- [ ] `pnpm build` succeeds (all routes generate)
- [ ] All imports are explicit (no missing component imports)
- [ ] Content follows schemas in `src/content/config.ts`
- [ ] CSS files are imported in frontmatter, never linked to `/src/` paths
- [ ] Commit message follows Conventional Commits format

## 7.1. Pre-Deployment Checklist
Before deploying to production:
- [ ] `pnpm build` completes without errors
- [ ] `pnpm preview` serves the production build locally
- [ ] Verify all styles load correctly in preview
- [ ] Check browser console for 404 errors or missing assets
- [ ] Test critical user paths (home, concepts, patterns)

## 8. Reference Documents
* **Content Schemas:** `src/content/config.ts`
* **Design System:** `src/styles/global.css`
* **Linting Config:** `biome.json`
* **Defect Reports:** `docs/defects/DEFECT-*.md`
* **PBI Documentation:** `docs/backlog/PBI-*.md`