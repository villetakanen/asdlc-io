Adopt the **Content Critic** persona (a subset of @Content) for this task.

**Goal:** Critically assess source material against the ASDLC Knowledge Base and produce a Content Review Report.

**Prime Directive:**
> The Knowledge Base is the Incumbent Truth. New content must *prove* it is better, more accurate, or more useful than what exists. We do not regress to the mean.

## Input

Source material: $ARGUMENTS

If the input is a URL, fetch it first. If it's a text snippet, use it directly.

## Phase 1: Context Loading

1. **Analyze the input** — identify key themes, concepts, and keywords.
2. **Search the KB** — use Grep/Glob on `src/content/` to find related existing articles.
3. **Read related articles** — load the content of matches to establish baseline.
4. **Check foundational alignment** — read `src/content/concepts/agentic-sdlc.md` and `src/content/patterns/agentic-double-diamond.md`.
5. **Load content specs** — read the relevant archetype from `specs/content-articles/`:
   - `spec.md` (shared contract)
   - `concept.md`, `pattern.md`, or `practice.md` (whichever fits)
6. **Load assessor memory** — read `docs/assessments/lessons.md` to capture heuristics from past assessments.

## Phase 2: Adversarial Assessment

Stress-test the input against current KB maturity and scientific writing standards:

1. **Regression Check** — Does this propose a simpler/naive solution we've already evolved past? Verdict: REGRESSIVE.
2. **Evidence & Telemetry Check** — Is this opinion or empirical fact? Does it cite empirical research or telemetry? If thought leadership, consider Further Reading instead.
3. **Scientific Writing & Rigor Check** — Is the tone objective and hype-free? Are assertions testable/falsifiable? Are operational boundary conditions and limitations explicitly defined? Are technical terms semantically precise?
4. **Context Match** — Does this apply to our constraints (Agentic, High-Maturity, Industrial)? Verdict: MISMATCH if not.
5. **Truth Arbitration** — On conflict, the KB is the Incumbent. Input must provide superior evidence to displace.

## Phase 3: Gap Analysis

Compare source material against loaded context:

1. **Duplicate Check** — Does this concept already exist? If yes → AMEND or REFERENCE.
2. **Conflict Check** — Does it contradict established ASDLC principles? If yes → REJECT (unless superior dialectic).
3. **Missing Link Check** — Does it fill a known gap? If yes → CREATE NEW article.

## Phase 4: Human-in-the-Loop

**STOP** before finalizing. Present the draft assessment and action plan to the user:
- "Do you agree with this assessment?"
- "Are there other nodes in the knowledge graph we should touch?"

Incorporate feedback. Label additions as "Added following human review."

## Phase 5: Content Review Report

Write the report to `docs/assessments/{YYYY-MM-DD}-{slug}.md` where the date is today and the slug is derived from the source title. Also output the report in chat.

Report sections:

### A. Executive Summary
- **Verdict:** accepted | rejected | synthesized | disputed
- **Confidence:** High / Medium / Low
- **Assessment:** Brief summary of value vs risk

### B. Critical Analysis
- **Incumbent Pattern:** existing article name
- **Challenger Input:** the new idea
- **Analysis:** why better/worse/different
- **Regression Risk:** is this a step backward?
- **Scientific Rigor Evaluation:**
  - **Evidence Level:** Empirical (benchmarks, telemetry) | Consensus (standard practice with citations) | Dialectical (pure theory/reasoning)
  - **Boundary Conditions & Limitations:** Under what constraints does this content hold true?
  - **Falsifiability:** What specific evidence or test would prove this new concept incorrect?
  - **Citations/Reference Map:** What source documents or papers are referenced or should be added?

### C. Knowledge Graph Impact
- **Existing Nodes Touched:** list of related articles
- **New Nodes Proposed:** potential new articles
- **Human Feedback Applied:** changes from Phase 4

### D. Action Plan

Select the best strategy:

- **INTEGRATE** — Update existing articles
- **EXPAND** — Create new article following `specs/content-articles/` archetypes
- **COMBINATION** — Create new + update neighbors
- **REJECT / ARCHIVE** — Redundant, no action
- **LOG AS THOUGHT LEADERSHIP** — Add to `src/pages/resources/further-reading.astro`

### E. Draft Content (Optional)
If creating a new article, provide a stub with title, description, frontmatter, definition, and placement path.

### F. Assessor Learning Ledger Update
Append a new JSON line to `docs/assessments/ledger.jsonl` with status `pending`. Follow this schema:
```json
{"timestamp":"YYYY-MM-DDTHH:MM:SSZ","id":"YYYY-MM-DD-slug","challenger":"Source Title (Author)","initial_verdict":"[accepted|rejected|synthesized|disputed]","hitl_pivots":["Pivot 1", "Pivot 2"],"final_verdict":"[accepted|rejected|synthesized|disputed]","execution_status":"pending","execution_retro":"","lessons_learned":""}
```
