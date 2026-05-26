---
source: "Bhaskar S, Spec-Driven Development: How to Build Real Software with AI Coding Agents, Substack, 2026-05-24"
url: "https://bswamina22.substack.com/p/spec-driven-development-how-to-build"
reviewer: "Antigravity (Gemini 3.5 Flash/Medium)"
sources_used:
  - "Codex 5.3 Draft Assessment"
  - "Opus 4.7 Draft Assessment"
hitl_executioner: "Ville Takanen"
assessment_date: "2026-05-26"
---

# Content Review: Spec-Driven Development (Bhaskar S)

## A. Executive Summary

- **Verdict:** REJECTED (methodology) + SYNTHESIZED (tooling & reference)
- **Confidence:** High
- **Assessment:** The article provides a competent, practitioner-focused introduction to Spec-Driven Development (SDD) phases and highlights three industry frameworks (BMad-Method, GitHub spec-kit, and OpenSpec). However, every conceptual phase it proposes is already present in the ASDLC Knowledge Base at a significantly higher resolution. Its linear, waterfall-like methodology is rejected to prevent KB regression, while its two net-new tooling references (BMad-Method and OpenSpec) are synthesized into our references.

---

## B. Critical Analysis

### Incumbent Patterns (the ASDLC's current position)

| Article | What it covers |
|---|---|
| `concepts/spec-driven-development` | SDD definition, maturity ladder (spec-first / spec-anchored / spec-as-source). |
| `patterns/the-spec` | Structural anatomy of the specification (Blueprint + Contract). |
| `patterns/agent-constitution` | Global steering constraints, distinguishing them from toolchain/orchestration constraints. |
| `patterns/agentic-double-diamond` | Iterative, phase-based agent development loop containing verification gates. |
| `concepts/vibe-coding` | Standard anti-pattern addressed by SDD. |

### Challenger Input

Bhaskar S proposes a 6-phase SDD pipeline (`Constitution` &rarr; `Specify` &rarr; `Plan` &rarr; `Task` &rarr; `Build` &rarr; `Review`) and details three tooling approaches: BMad-Method (persona-based agent orchestration), GitHub spec-kit (CLI-driven pipeline of artifacts), and OpenSpec (CI-validated repository Markdown specs).

### Truth Arbitration & Alignment

While the core thesis—that "vibe coding" must be replaced by structured specifications to scale agentic development—aligns 100% with the ASDLC philosophy, the article's proposed lifecycle represents a much lower-resolution implementation. We reject the primary methodology because:
* The article's "Constitution" is a brief definition; our `patterns/agent-constitution` maps concrete steering rules and is backed by empirical NLP negation research.
* The article's "Specify" phase lacks our State-vs-Delta distinction, Gherkin/BDD scenarios, and architectural boundary mappings.

### Regression & Rigor Risk Analysis

* **The Waterfall Danger:** The challenger proposes a linear, non-iterative phase progression ("building is not creative work; creative decisions were made upstream; the Build Phase is about fidelity to the plan"). This underplays the ASDLC Learning Loop—derived from Kent Beck's critique—which asserts that implementation is a primary source of learning that must iteratively update the spec. Adopting this linear pipeline verbatim would regress our maturity back to a waterfall flow.
* **Scientific Rigor Evaluation:**
  * **Evidence Level:** Dialectical only. Simple thought-leadership and tool descriptions with no telemetry, benchmarks, or citations. Zero falsifiability.
  * **Boundary Conditions & Limitations:** SDD applies best to medium/large scopes with multi-step dependencies; it is overkill for minor one-off changes.
  * **Falsifiability:** If teams using this phased flow show equal/higher spec drift and rework than non-SDD/vibe-coding baselines, the core claim weakens.

---

## C. Knowledge Graph Impact

### Existing Nodes Touched

* **`concepts/spec-driven-development`** — Add Bhaskar's article, **BMad-Method**, and **OpenSpec** to the `references` list in frontmatter.
* **`pages/resources/further-reading`** — Add a logged thought leadership feed entry.

### New Nodes Proposed

* None.

### Human Feedback Applied

* **Opus/Codex Multilateral Review:** The initial draft proposed a synthesis of all phases into the KB. Multi-model consensus (incorporating Codex 5.3 and Opus 4.7 takes, with HITL review by Ville Takanen) identified that the core methodology is redundant and risk-regressive. The plan was updated to **Reject** the linear lifecycle while **Synthesizing** the net-new open-source frameworks (BMad-Method and OpenSpec).

---

## D. Action Plan

**Strategy:** INTEGRATE & LOG (Update References + Log Entry)

| # | Action | Path | Type |
|---|---|---|---|
| 1 | Add Bhaskar S, BMad, and OpenSpec to references | `src/content/concepts/spec-driven-development.md` | INTEGRATE |
| 2 | Log article feed entry in Further Reading page | `src/pages/resources/further-reading.astro` | LOG |

---

## E. Draft Content

### E.1 — Integrations

#### Integrations in `src/content/concepts/spec-driven-development.md`

Add Bhaskar's article, BMad-Method, and OpenSpec to frontmatter:
```yaml
references:
  - type: "website"
    title: "Spec-Driven Development: How to Build Real Software with AI Coding Agents"
    url: "https://bswamina22.substack.com/p/spec-driven-development-how-to-build"
    author: "Bhaskar S"
    published: 2026-05-24
    accessed: 2026-05-26
    annotation: "Defines a 6-phase SDD lifecycle and introduces three industry frameworks (BMad, spec-kit, OpenSpec) that enforce it."
  - type: "repository"
    title: "BMad-Method"
    url: "https://github.com/bmadcode/bmad-method"
    annotation: "Persona-driven agent orchestration framework (Analyst, Architect, Developer, QA) utilizing structured templates to enforce phase handoffs."
  - type: "repository"
    title: "OpenSpec"
    url: "https://github.com/openspec-ai/openspec"
    annotation: "Document-first SDD framework utilizing versioned, schema-validated Markdown specifications validated via CI checks."
```

#### Integrations in `src/pages/resources/further-reading.astro`

Insert feed entry:
```html
    <div class="feed-entry">
      <h2>Spec-Driven Development: How to Build Real Software with AI Coding Agents</h2>
      <div class="meta">
        <span><strong>Source:</strong> <a href="https://bswamina22.substack.com/p/spec-driven-development-how-to-build" target="_blank" rel="noopener">Bhaskar S (Substack, May 2026)</a></span>
      </div>
      <p>
        Bhaskar S outlines a 6-phase Spec-Driven Development (SDD) lifecycle (Constitution &rarr; Specify &rarr; Plan &rarr; Tasks &rarr; Build &rarr; Review) designed to prevent "Context Collapse" when guiding AI agents through complex feature creation. The article maps well to ASDLC concepts, but its linear phase progression underplays the iterative refinement model of the ASDLC Learning Loop. The post also highlights three tooling paradigms: BMad-Method (persona-based), GitHub spec-kit (CLI-based), and OpenSpec (CI/schema-validated specifications). We log this post as evidence of industry convergence on SDD vocabulary and have integrated BMad-Method and OpenSpec as references on the <a href="/concepts/spec-driven-development">Spec-Driven Development</a> page.
      </p>
    </div>
```

---

## F. Open Questions / Follow-ups

1. **Tooling Verification:** Monitor BMad-Method and OpenSpec repositories to track if their validation or template structures undergo breaking updates.
