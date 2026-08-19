---
name: assess
description: "Critically assess source material against the ASDLC Knowledge Base and produce a Content Review Report. Checks consistency, non-duplication, and structural soundness."
argument-hint: "[URL, text snippet, or prompt to assess]"
version: 1.0.0
---

# Assess — content engineering review

Critically assess source material against the ASDLC Knowledge Base and produce a Content Review Report recommending amendment, synthesis, new content, or a reference.

## Prime directive

> **Burden of proof.** The Knowledge Base is the Incumbent Truth. New content must *prove* it is better, more accurate, or more useful than what exists. We do not regress to the mean by accepting every new article as fact.

## Boundaries

- **In scope:** reading the source material, comparing it against the corpus, and writing the review report plus its ledger entry.
- **Out of scope:** writing the article itself (`dev` after a decision), reviewing code (`critic`), traffic-driven refresh triage (`curator`).

## Input

Source material: a raw prompt, text snippet, or URL. If the input is a URL, fetch it first; if it is a snippet, use it directly.

## Phase 1 — Context loading

1. **Analyze the input** — identify key themes, concepts, and keywords. If the input is about "AI agents testing code", the keywords are `testing`, `verification`, `agents`, `code review`.
2. **Search the KB** — grep and glob `src/content/` to find related existing articles. Use filesystem tools rather than MCP calls: inside this repo, `src/content/` is the source of truth.
3. **Read related articles** — load the matches to establish the baseline.
4. **Check foundational alignment** — read `src/content/concepts/agentic-sdlc.md` and `src/content/patterns/agentic-double-diamond.md`. Also check `AGENTS.md` for operating context.
5. **Load content specs** — read the relevant archetype from `specs/content-articles/`:
   - `spec.md` (shared contract)
   - `concept.md` (definitions), `pattern.md` (structures), or `practice.md` (operations)
   - Decide whether the source fits a Pattern (shape), Practice (steps), or Concept (idea).
6. **Load assessor memory** — read `docs/assessments/lessons.md` and keep those heuristics in mind. Also scan `docs/assessments/ledger.jsonl` (`hitl_pivots`, `lessons_learned`): if a correction has recurred two or more times but is not yet in `lessons.md`, treat it as a live heuristic now and flag it for promotion in Phase 5.G.

## Phase 2 — Adversarial assessment

Stress-test the input against current KB maturity and scientific writing standards.

1. **Regression check** — does this propose a simpler or naive solution we have already evolved past (e.g. "just use context" when we have Context Gates)? Verdict: **REGRESSIVE**. Reject, or frame as the basic level.
2. **Evidence and telemetry check** — is this opinion or empirical fact? Distinguish subjective best practice from objective benchmark; check whether the input cites research, papers, or telemetry. Thought leadership that aligns philosophically may belong in Further Reading rather than being rejected.
3. **Scientific writing and rigor check**
   - *Tone:* objective, factual, free of marketing fluff and anthropomorphic language?
   - *Falsifiability:* formulated so it can be tested and disproved? What are the failure modes?
   - *Boundary conditions:* does it document constraints, prerequisites, and where it *fails*?
   - *Semantic precision:* are technical terms defined precisely and integrated with sibling nodes in the knowledge graph?
   - *Evaluator evolution:* if the input proposes self-improvement, learned evaluators, mutable judges, or non-stationary utilities, identify what stays frozen inside the evaluation epoch, what may change at promotion boundaries, and what independent anchor prevents circular validation.
4. **Context match** — does this apply to our constraints (agentic, high-maturity, industrial)? Verdict: **MISMATCH** if it solves a problem we don't have.
5. **Truth arbitration** — on conflict, the KB is the Incumbent. The input must provide superior evidence to displace it. Highlight conflicts; never overwrite without an explicit "supersedes" decision.

## Phase 3 — Gap analysis

Compare the source material against the loaded context.

1. **Duplicate check** — does this concept already exist (e.g. "AI code checking" vs. `patterns/adversarial-code-review`)? If yes → **AMEND** or **REFERENCE**, not a new article.
   - *SEO and taxonomy exception:* a new concept article is justified despite conceptual overlap if it represents a major industry category designation or high-volume search term (e.g. "Harness Engineering") needing a dedicated landing page and taxonomic anchor. Keep them distinct: the concept explains the *what and why*; the practice explains the *how*.
   - *Canonical research term exception:* a new concept article may also be justified when the source introduces a named framework likely to become a reusable research or industry reference, even if it overlaps existing patterns. Require an explicit HITL or editorial rationale, and keep the page definitional.
2. **Conflict check** — does it contradict established ASDLC principles (e.g. "vibe coding" vs. determinism)? Default to **REJECT**; recommend **SYNTHESIS** only for a superior dialectic.
   - *Hard-harness reconciliation:* for sources that mutate evaluators, judges, tools, sandboxes, or success criteria, do not accept the mutation as normal online autonomy. Synthesis requires a governed boundary — frozen in-epoch contracts, deterministic or human-governed promotion, independent ground-truth anchors, and regression checks against unrelated holdouts.
3. **Missing link check** — does it fill a known gap (e.g. "how to write a PBI" when we only have "the PBI" pattern)? If yes → **CREATE NEW**.

## Phase 4 — Human in the loop

**STOP** before finalizing. Present the draft verdict, nodes touched, and action plan to the user:

- "Do you agree with this assessment?"
- "Are there other nodes in the knowledge graph we should touch?"

Then incorporate the feedback:

- Label additions born from this discussion "Added following human review", to keep provenance traceable.
- *Disagreement preservation:* if multiple assessors or drafts disagree, record the disagreement and the HITL rationale rather than flattening it into a single verdict. This matters most when the user overrides a duplicate-check rejection to create a taxonomy anchor.

## Phase 5 — Content Review Report

Write the report to `docs/assessments/{YYYY-MM-DD}-{slug}.md`, where the date is today and the slug derives from the source title. Also output it in chat. Follow the structure in `docs/assessments/TEMPLATE.md`.

Begin the report with a YAML frontmatter block:

- `source` — author or institution, title, platform or publisher, date
- `url` — source URL
- `reviewer` — agent name and model name
- `sources_used` — other draft assessments or sources roped in
- `hitl_executioner` — the active human reviewer
- `assessment_date` — YYYY-MM-DD

### A. Executive summary
- **Verdict:** accepted | rejected | synthesized | disputed
- **Confidence:** High / Medium / Low
- **Assessment:** brief summary of value vs. risk

### B. Critical analysis
- **Incumbent pattern:** existing article name
- **Challenger input:** the new idea
- **Analysis:** why better, worse, or different
- **Regression risk:** is this a step backward?
- **Scientific rigor evaluation:**
  - **Evidence level:** Empirical (benchmarks, telemetry) | Consensus (standard practice with citations) | Dialectical (pure theory)
  - **Boundary conditions and limitations:** under what constraints does this hold?
  - **Falsifiability:** what evidence or test would prove it incorrect?
  - **Citations / reference map:** what sources are referenced, or should be added?

### C. Knowledge graph impact
- **Existing nodes touched:** related articles
- **New nodes proposed:** potential new articles
- **Human feedback applied:** changes from Phase 4

### D. Action plan

Select the best strategy:

- **INTEGRATE** — update existing articles
- **EXPAND** — create a new article following the `specs/content-articles/` archetypes
- **COMBINATION** — create new plus update neighbors
- **REJECT / ARCHIVE** — redundant, no action
- **LOG AS THOUGHT LEADERSHIP** — add to `src/pages/resources/further-reading.astro`

### E. Draft content (optional)

If creating a new article, provide a stub following the relevant archetype: title and description, frontmatter (tags, status), the definition, and the placement path under `src/content/`.

### F. Assessor learning ledger update

Append a JSON line to `docs/assessments/ledger.jsonl` with status `pending`:

```json
{"timestamp":"YYYY-MM-DDTHH:MM:SSZ","id":"YYYY-MM-DD-slug","challenger":"Source Title (Author)","initial_verdict":"[accepted|rejected|synthesized|disputed]","hitl_pivots":["Pivot 1", "Pivot 2"],"final_verdict":"[accepted|rejected|synthesized|disputed]","execution_status":"pending","execution_retro":"","lessons_learned":""}
```

### G. Promote recurring lessons (close the loop)

The ledger is a write-only log — it is **not** loaded during future assessments; only `lessons.md` is, in Phase 1.6. A lesson left only in the ledger is one the assessor will never see again, which is how the same correction recurs.

After writing the ledger line, judge whether this assessment's `lessons_learned` or any `hitl_pivot` is **generalizable** (applies beyond this source) or **recurs** with a pattern flagged in Phase 1.6. If so, propose a one-line addition or amendment to `docs/assessments/lessons.md`, gated by the human reviewer — the [Compound Loop](/patterns/compound-loop) applied to the assessor's own memory (discrimination at the gate, writeback to the loaded substrate). One-off, source-specific lessons stay in the ledger only.

## Task

$ARGUMENTS

