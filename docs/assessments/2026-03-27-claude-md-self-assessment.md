# CLAUDE.md Self-Assessment Against ASDLC Knowledge Base

**Date:** 2026-03-27
**Source:** `CLAUDE.md` (279 lines, project root)
**Assessed Against:** ASDLC Knowledge Base (incumbent truth)

---

## A. Executive Summary

- **Verdict:** DISPUTED
- **Confidence:** High
- **Assessment:** The CLAUDE.md violates multiple principles documented in the project's own knowledge base — specifically the agents-md-spec practice, agent-personas practice, agent-constitution pattern, and context-engineering concept. The file is ~3x the recommended density, embeds full persona definitions that should be session-scoped skills, restates toolchain constraints that Biome/TypeScript already enforce, and includes documentation-grade content that belongs in specs or the KB itself. The irony is sharp: the KB is world-class guidance on writing lean agents.md files, but the project's own CLAUDE.md doesn't follow it.

---

## B. Critical Analysis

### B1. Minimal by Design — VIOLATION

**Incumbent:** `/practices/agents-md-spec`
> "Research (Gloaguen et al., 2026): LLM-generated context files *reduce* agent success rates while increasing cost 20%+. Minimal developer-written files: +4% improvement, but *only* when precise."

**Challenger (CLAUDE.md):** 279 lines. The agents-md-spec prescribes **five core sections**: Mission, Toolchain Registry, Judgment Boundaries, Personas Registry, Context Map. The current CLAUDE.md has **10 numbered sections** plus subsections, XML rule_sets, code examples, mermaid workflow documentation, MCP architecture docs, and external contributor guidelines.

**Regression Risk:** HIGH. Every unnecessary line competes for attention with lines that matter.

---

### B2. Toolchain-First Principle — VIOLATION

**Incumbent:** `/patterns/agent-constitution`
> "Antipattern: Restating toolchain constraints in agents.md"

**Incumbent:** `/concepts/context-engineering`
> Decision hierarchy: (1) Can runtime gate enforce it? → Use gate. (2) Can toolchain config enforce it? → Use config. (3) Neither? → It belongs in context.

**Violations found in CLAUDE.md:**

| CLAUDE.md Rule | Already Enforced By |
|---|---|
| "No `any` types" | `tsconfig.json` strict mode |
| "Biome (No ESLint/Prettier)" | `biome.json` existence + `package.json` scripts |
| "No Tailwind" | Not installed in `package.json` |
| "TypeScript 5.x (Strict Mode: ON)" | `tsconfig.json` |
| "Use `z.coerce.date()` for date fields" | Schema validation at build time |
| Import ordering / formatting rules | `biome.json` |

**Regression Risk:** MEDIUM. Restating toolchain constraints is noise that dilutes actual judgment boundaries. Per the constitution pattern, these belong in the deterministic layer, not the steering layer.

---

### B3. Persona Definitions Inline — VIOLATION

**Incumbent:** `/practices/agent-personas`
> "Personas are session-scoped, not project-scoped. Loading irrelevant personas increases reasoning cost without improving outcomes. Full definitions live in skill/workflow files, not agents.md. agents.md contains **registry only** (names + invocation patterns)."

**Challenger (CLAUDE.md):** Sections 1.1–1.4 contain full persona definitions for @Lead, @Designer, @Content, @Dev — complete with Goals, Deliverables, Hard Constraints, and Guidelines. This is ~80 lines of content that should be in skill files (and partially already is — the skill registry shows `/lead`, `/dev`, `/assess`, `/critic`).

**Regression Risk:** HIGH. Every session loads all four personas regardless of task. A dev task loads the @Designer and @Content guidelines. A content task loads the @Lead spec-writing rules. This is exactly the anti-pattern the KB warns against.

---

### B4. Pink Elephant Problem — VIOLATION

**Incumbent:** `/practices/agents-md-spec`
> "Telling agent 'don't use tRPC' makes it active in attention; fix structural friction instead."

**Violations found in CLAUDE.md (Tier 3 "NEVER DO"):**
- "NEVER use `any`" → Already enforced by tsconfig strict. Stating it makes `any` salient.
- "NEVER use legacy `type: 'content'`" → No legacy code exists. Stating it introduces the legacy pattern into attention.
- "NEVER output code with broken imports" → Aspirational, not actionable. What agent *intends* to output broken imports?
- "NEVER link CSS via `<link href="/src/...">`" → Fix via linting or build-time error, not a prompt rule.

**Regression Risk:** MEDIUM. Each "NEVER" activates the prohibited pattern in the attention mechanism.

---

### B5. Documentation Masquerading as Context — VIOLATION

**Incumbent:** `/concepts/context-engineering`
> Context should be "information delivered Just-in-Time to the right station."

**Sections that are documentation, not operational context:**

| Section | Should Be |
|---|---|
| §5 Command Registry | Already in `package.json` scripts — agent reads this |
| §6 MCP Knowledge Base | Architecture docs → `specs/` or KB article |
| §7 External Agent Submission | Contributor docs → `CONTRIBUTING.md` |
| §9 Mermaid Diagram Convention | Workflow docs → skill file or `specs/` |
| §10 Context References | Redundant — agent can find `config.ts` and `global.css` |
| Tech Stack table (§2) | Discoverable from `package.json`, `astro.config.mjs`, `biome.json` |

**Regression Risk:** MEDIUM. Documentation content inflates the file, reducing signal-to-noise ratio.

---

### B6. Mission Statement — PARTIAL COMPLIANCE

**Incumbent:** `/practices/agents-md-spec`
> "Mission (2–4 sentences) — project purpose and constraints"

**CLAUDE.md §1.0:** The mission section is good but verbose. The core mission ("Build the definitive playbook for the Industrialization of Knowledge Work") is buried after a blockquote and followed by 12 lines of philosophy. The agents-md-spec calls for 2–4 sentences.

**Regression Risk:** LOW. The content is valuable but could be tighter.

---

### B7. Judgment Boundaries — GOOD, with noise

**Incumbent:** `/practices/agents-md-spec`
> "Judgment Boundaries (NEVER / ASK / ALWAYS) — behavioral rules requiring reasoning"

**CLAUDE.md §4:** The tiered structure (ALWAYS/ASK/NEVER) aligns well with the spec. However, some entries fail the "requires reasoning" test:

- **Good:** "ASK before adding new dependencies" (requires judgment)
- **Good:** "ASK before modifying global.css" (requires judgment)
- **Good:** "ALWAYS enforce One H1 Per Page" (not enforceable by toolchain)
- **Bad:** "ALWAYS validate content against config.ts" (build does this)
- **Bad:** "NEVER use `any`" (tsconfig does this)

---

## C. Knowledge Graph Impact

### Existing Nodes Touched
- `/practices/agents-md-spec` — Primary standard. CLAUDE.md should be a reference implementation.
- `/practices/agent-personas` — Persona registry vs. full definitions.
- `/patterns/agent-constitution` — Steering vs. deterministic constraint taxonomy.
- `/concepts/context-engineering` — Toolchain-first decision hierarchy.
- `/concepts/spec-driven-development` — Specs live in `specs/`, not agents.md.

### New Nodes Proposed
- None. The KB already covers this comprehensively. The gap is practice, not theory.

### Human Feedback Applied
- (Pending Phase 4)

---

## D. Action Plan

**Strategy:** INTEGRATE — Refactor CLAUDE.md to comply with its own KB.

### Proposed Refactored Structure (~80–100 lines target)

```
§1. Mission (2–4 sentences)
§2. Toolchain Registry (commands only — point to configs, don't describe what they enforce)
§3. Judgment Boundaries (ALWAYS / ASK / NEVER — only rules requiring reasoning)
§4. Personas Registry (names + triggers only — full defs in skill files)
§5. Context Map (only if repo structure is non-obvious)
```

### Specific Actions

| # | Action | What Changes |
|---|---|---|
| 1 | **Extract personas to skill files** | Move §1.1–1.4 full definitions into `/lead`, `/dev`, `/assess`, `/critic` skills (some already exist). Replace with 4-line registry. |
| 2 | **Delete toolchain-restated rules** | Remove rules already enforced by tsconfig, biome.json, or build pipeline. |
| 3 | **Delete documentation sections** | Remove §5 Command Registry (discoverable), §6 MCP docs, §7 External Submission, §9 Mermaid Convention, §10 Context References. Move to specs/ or skill files as needed. |
| 4 | **Compress mission** | Reduce §1.0 to 2–4 sentences. |
| 5 | **Prune judgment boundaries** | Remove entries from §4 that fail the "requires reasoning" test. |
| 6 | **Eliminate Pink Elephants** | Reframe "NEVER" rules as structural constraints where possible; delete those already enforced by toolchain. |
| 7 | **Delete XML code examples** | The good/bad examples in §7 are tutorial content, not operational context. |

### Expected Outcome
- **Before:** 279 lines, 10 sections, full persona definitions, toolchain restating, documentation content
- **After:** ~80–100 lines, 5 sections, persona registry, judgment-only boundaries, zero toolchain restating

---

## E. The Irony Score

The KB contains some of the most rigorous, research-backed guidance on writing agents.md files published anywhere. The agents-md-spec practice alone cites empirical research showing unnecessary context *reduces* agent success rates. The agent-constitution pattern provides a precise taxonomy for what belongs in prompts vs. toolchain vs. runtime.

The project's own CLAUDE.md violates the core thesis of its own knowledge base. This is the cobbler's children going barefoot.

**Fixing this would also serve as a reference implementation** — the CLAUDE.md becomes living proof that the KB's guidance works in practice.
