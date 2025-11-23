# AGENTS.md: Directives for Autonomous Contributors

**Status:** Active
**Enforcement:** Strict
**Last Updated:** 2025-01-XX (Post-Phase 2 UAT + External Agent Guidelines)

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

## 8. External Agent Submission Guidelines

When an **external AI agent** (SEO optimizer, code reviewer, dependency auditor, etc.) submits work items (PBIs, bug reports, recommendations), the following protocol MUST be followed:

### 8.1. Required Context Review (Pre-Submission)

Before generating ANY recommendations, external agents MUST read (in order):

1. **`AGENTS.md` (this file)** - Understand project directives and constraints
2. **`src/content/config.ts`** - Learn the data structure and schemas
3. **Latest UAT Report** - Check current phase and completion status (e.g., `docs/backlog/PBI-*-UAT-*.md`)
4. **`src/styles/global.css`** - Understand the "spec-sheet" aesthetic and design constraints
5. **`package.json`** - Verify current dependencies and tooling
6. **`astro.config.mjs`** - Check framework configuration

**Rationale:** Generic recommendations without context create technical debt. See `docs/backlog/PBI-0003-Review-Comparison.md` for a case study of naive vs. architecture-aligned submissions.

### 8.2. PBI Submission Format

All external PBI submissions MUST include:

#### Required Sections

```markdown
# PBI-XXXX: [Descriptive Title]

**ID:** PBI-XXXX
**Priority:** [Low/Medium/High] (justify if High)
**Effort:** [Hours with breakdown]
**Phase:** [Current project phase]
**Context Reviewed:** [List of files read before submission]

## 1. Strategic Context
[How does this align with current phase? Reference UAT reports or project goals]

## 2. User Story
As a [role], I want [feature], so that [benefit].

## 3. Architecture Alignment
[How does this leverage existing schemas/components/patterns?]
[Which AGENTS.md directives does this satisfy?]

## 4. Implementation Tasks
[Specific, testable tasks with file paths]

## 5. Out of Scope
[What is explicitly NOT included? Why?]

## 6. Acceptance Criteria
[Testable, specific criteria]

## 7. Quality Gates
- [ ] `pnpm lint` passes
- [ ] `pnpm check` passes
- [ ] `pnpm build` succeeds
[Additional validation steps]

## 8. Definition of Done
[Complete checklist]
```

#### Forbidden Patterns

❌ **Do NOT:**
- Suggest generic tools without checking existing dependencies
- Recommend major architectural changes without reading current structure
- Inflate priority without justification
- Bundle unrelated concerns (infrastructure + operations + analytics)
- Ignore design system constraints (e.g., suggesting Tailwind when we use custom CSS)
- Assume production readiness (check phase status first)
- Use vague effort estimates ("Medium" without hour breakdown)

✅ **Do:**
- Reference specific files you've read
- Leverage existing Zod schemas and components
- Scope appropriately for current phase
- Provide detailed effort breakdowns
- Explain architectural decisions
- Follow Conventional Commits for any code changes

### 8.3. Priority Guidelines for External Submissions

| Priority | Criteria | Example |
|:---------|:---------|:--------|
| **High** | Blocking deployment, security critical, breaks existing functionality | Critical security patch, build pipeline failure |
| **Medium** | Infrastructure improvements, non-blocking enhancements, optimization | SEO foundation, testing framework, analytics |
| **Low** | Nice-to-haves, documentation, visual polish | Badge colors, README updates, comment improvements |

**Default assumption:** If unsure, mark as **Medium** and let Lead Developer re-prioritize during backlog grooming.

### 8.4. Common External Agent Mistakes (Lessons Learned)

Based on `docs/backlog/PBI-0003-Review-Comparison.md`:

#### Mistake #1: Context Blindness
```diff
- "Install analytics immediately" (without checking if site is production-ready)
+ "SEO foundation for Phase 3; defer analytics to deployment PBI"
```

#### Mistake #2: Ignoring Existing Architecture
```diff
- "Add manual metadata tags for keywords"
+ "Derive keywords from existing `tags` array in Zod schema"
```

#### Mistake #3: Tool-First Instead of Architecture-First
```diff
- "Install schema-dts library for structured data"
+ "Create 50-line StructuredData.astro component (zero dependencies)"
```

#### Mistake #4: Scope Creep
```diff
- "PBI: SEO + Analytics + GSC + Lighthouse 100 + Content Rewrites"
+ "PBI-0003: Semantic SEO Foundation (defer operations to future PBI)"
```

#### Mistake #5: Design System Violations
```diff
- "Add Tailwind for responsive layouts"
+ "Use existing spec-sheet grid system from global.css"
```

### 8.5. Validation Checklist for External Submissions

Before submitting, external agents MUST verify:

- [ ] **Context:** Read all required files (AGENTS.md, config.ts, UAT reports)
- [ ] **Schemas:** Checked `src/content/config.ts` for leverage opportunities
- [ ] **Dependencies:** Ran `pnpm outdated` to check current versions
- [ ] **Design System:** Reviewed `src/styles/global.css` for constraints
- [ ] **Phase Awareness:** Identified current phase from latest UAT report
- [ ] **Priority Justified:** Explained why this priority level is appropriate
- [ ] **Effort Detailed:** Provided hour-by-hour task breakdown
- [ ] **Scope Bounded:** Listed what is explicitly out of scope
- [ ] **Quality Gates:** Defined testable acceptance criteria
- [ ] **AGENTS.md Compliance:** Cited which directives this satisfies

### 8.6. Review Process

1. **External Agent** submits PBI via pull request to `docs/backlog/`
2. **Lead Developer** reviews against this checklist
3. **Outcome:**
   - ✅ **Approved:** Added to backlog as-is
   - 🔄 **Revision Needed:** Comments added, agent revises
   - ❌ **Rejected:** Archived with lessons learned (e.g., SEO-001 → PBI-0003 rewrite)

### 8.7. Success Examples

**Good External Submission:**
```markdown
# PBI-XXXX: Add TypeScript Strict Mode

**Context Reviewed:**
- AGENTS.md (No "Vibe Coding" directive)
- tsconfig.json (currently strict: false)
- Phase 2 UAT Report (all type errors resolved)

**Architecture Alignment:**
Enables stronger type safety, aligns with "No Vibe Coding" directive.
Leverages existing TypeScript setup, zero new dependencies.

**Effort:** 2 hours
- 1 hour: Enable strict mode, fix compilation errors
- 0.5 hours: Test all routes
- 0.5 hours: Update AGENTS.md with new directive

**Out of Scope:**
- Refactoring existing components (unless type errors)
- Adding ESLint (we use Biome)
```

**Why Good:**
- Shows context review
- Aligns with existing directives
- Detailed effort breakdown
- Clear scope boundaries
- Acknowledges existing tooling (Biome, not ESLint)

## 9. Reference Documents
* **Content Schemas:** `src/content/config.ts`
* **Design System:** `src/styles/global.css`
* **Linting Config:** `biome.json`
* **Defect Reports:** `docs/defects/DEFECT-*.md`
* **PBI Documentation:** `docs/backlog/PBI-*.md`
* **External Agent Case Study:** `docs/backlog/PBI-0003-Review-Comparison.md`