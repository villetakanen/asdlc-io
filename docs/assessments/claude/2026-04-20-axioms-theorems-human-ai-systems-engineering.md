# Content Review: Axioms and Theorems of Human-AI Systems Engineering

**Source:** [Ed Hodapp, *Axioms and Theorems of Human-AI Systems Engineering*](https://hodapp.com/posts/axioms-and-theorems-of-human-ai-systems-engineering/)
**Published:** 2026-04-17
**Assessed:** 2026-04-20
**Reviewer:** @Content (Claude) with parallel read from Gemini 3.1

---

## A. Executive Summary

- **Verdict:** SYNTHESIZED
- **Confidence:** High
- **Assessment:** Hodapp articulates a useful bias taxonomy for AI agents working in systems-engineering domains (firmware, kernels, compilers, protocols). The "Convenient-Tool Bias" and "Solve-It-Alone Bias" are concrete, diagnosable failure modes rooted in training-distribution skew. These extend — rather than duplicate — our existing coverage of LLM failure modes (Pink Elephant / negation bias). The article's proposed artifact (a verbose, reasoning-rich `CLAUDE.md`) conflicts with our incumbent Gloaguen et al. (2026)-backed minimalism, and we do **not** adopt it. The bias framing is worth a new concept node; the format is not.

Primary action: log as Thought Leadership **and** create `concepts/agent-bias.md` to capture the bias taxonomy as a first-class concept, linked from `agent-constitution` as a "Why" reference.

---

## B. Critical Analysis

### Incumbent Patterns
- `concepts/context-anchoring` — LLM attention biases (Pink Elephant / negation)
- `patterns/agent-constitution` — steering constraints, "ASK" tier, constitutional values
- `practices/agents-md-spec` — Minimal by Design, Toolchain First (Gloaguen et al., 2026)
- `concepts/ai-amplification` — AI as high-pass filter for process maturity

### Challenger Input
Hodapp proposes:
1. **Eight Axioms** (stable principles) + **Seven Theorems** (context-dependent rules)
2. **Training-Set Bias** as a predictable, diagnosable constraint — specifically:
   - **Convenient-Tool Bias:** AI reaches for high-level tools (curl, docker-compose, grep) that entangle layers in systems work
   - **Solve-It-Alone Bias:** AI continues investigation autonomously rather than pausing for clarification
3. `CLAUDE.md` as **shared theory** — a reasoning-rich document that teaches subsequent instances through axioms and justifications rather than rote rules
4. **Domain-specific behavioral profiles** — community-maintained personas for systems engineering, compilers, kernel work

### Analysis

**Where Hodapp extends the KB (novel, valuable):**

- The *Convenient-Tool Bias* is a **positive-anchor, training-distribution** failure mode — mechanically distinct from our existing *Context Anchoring* (negation/attention) coverage. Pink Elephant explains why "don't use tRPC" fails; Convenient-Tool Bias explains why "build a low-level hardware driver" drifts toward curl/docker even without any anchor in the prompt. Different mechanism, different remediation, different place in the knowledge graph.
- First-party confirmation: maintainer has independently observed the same pattern — system prompts inducing positive biases, particularly toward `curl`, suggesting the bias class extends beyond training distribution alone to **system-prompt-induced positive anchoring** as a related but distinct mechanism.
- *Solve-It-Alone Bias* gives empirical weight to the `ASK` tier in `agent-constitution` — it reframes "ask before guessing" not as a stylistic nicety but as a structural counterweight to a documented training-distribution failure.
- The systems-engineering frame (firmware, compilers) is a useful stress test for ASDLC: if the factory model holds in kernel work, not just CRUD apps, that's evidence of generality.

**Corroborating empirical evidence (added post-assessment via web search):**

Hodapp's claims are not isolated anecdote — they align with peer-reviewed research that *predates* his article and strengthens the case for a first-class concept:

- **Training-Set Bias (Convenient-Tool / library preference):** Twist, Zhang, Harman, Syme, Noppen, Yannakoudakis, Nauck (2025), *"LLMs Love Python: A Study of LLMs' Bias for Programming Languages and Libraries"* (arXiv 2503.17181). Across 8 LLMs: **NumPy over-used in up to 45% of cases** where it was not required and deviated from ground-truth solutions; Python selected as default in 58% of high-performance project initialization tasks where it was not the optimal language; Rust never selected once. Root cause identified as GitHub-corpus training-distribution skew. This is near-perfect empirical confirmation of Hodapp's Convenient-Tool Bias, with Mark Harman (a major SE researcher) on the author list.
- **System-Prompt-Induced Bias:** Neumann, Kirsten, Zafar, Singh (2025), *"Position is Power: System Prompts as a Mechanism of Bias in Large Language Models"* (arXiv 2505.21091, published in ACM FAccT 2025). Tested 6 commercial LLMs (Claude-3.5-Sonnet/Haiku, GPT-4o/Mini, Gemini-1.5-Pro/Flash). Finding: **the position of information in system prompts versus user prompts systematically shapes model outputs** — confirming that *where* and *how* tools are mentioned in system-level directives creates measurable bias. This directly underwrites the maintainer's `curl` observation as a documented mechanism, not an anecdote.
- **Steerability limits:** Lovering et al. (2024), *"Evaluating the Prompt Steerability of Large Language Models"* (arXiv 2411.12405). Finds that LLM steerability is constrained by **baseline behavioral skew** and is **asymmetric** across persona dimensions. Confirms the structural claim that some biases are easier to reinforce than to correct — relevant to the KB position that deterministic gates beat pure constitutional steering.
- **Mitigation evidence:** Huang et al. (2024), *"Bias Testing and Mitigation in LLM-based Code Generation"* (arXiv 2309.14345, ACM TOSEM). Finds that **direct prompt engineering strategies have limited effectiveness in mitigating bias**, while **test-execution feedback substantially reduces bias ratios** (e.g., GPT-4 from 59.88% → 4.79%). Independent validation of the ASDLC preference for deterministic verification gates over steering-only approaches — the `Context Gates` pattern.

Taken together, this evidence moves the assessment from "interesting thought leadership" to "well-supported concept gap." The KB should not merely log Hodapp as further reading; it should incorporate the bias class as a first-class concept backed by peer-reviewed research.

**Where Hodapp duplicates the KB (low marginal value):**

- A1 (Confidence without evidence) → covered by `concepts/provenance` + `patterns/adversarial-code-review`
- A4 (Build bottom-up) → standard TDD/XP; see `concepts/extreme-programming`
- A6 (Rigorous path at decision points) → Agent Constitution values
- A8 (Stop and ask) → `ASK` tier in `agent-constitution`
- T2 (Behavioral tests first) → `concepts/behavior-driven-development`
- T3 (Repro before fix) → standard engineering practice
- T4 (Integration tests before push) → standard DevOps
- T6 (Pre-commit pipeline: blocking gates + independent reviews) → `patterns/context-gates` + `patterns/adversarial-code-review`
- T7 (Greenfield iteration) → `patterns/agentic-double-diamond` (Discover/Define)

**Where Hodapp conflicts with the KB (regressive, rejected):**

Hodapp's proposed artifact is a verbose `CLAUDE.md` containing axioms, theorems, reasoning, and domain justifications. This directly contradicts `practices/agents-md-spec`, which is built on Gloaguen et al. (2026): a 138-repository empirical study finding that **verbose context files reduce agent task success while inflating inference cost by 20%+**. The mechanism is documented: agents follow verbose instructions faithfully, broadening exploration and increasing reasoning cost without improving outcomes.

Hodapp's own A2 ("Principles transfer; processes do not") could be reconciled with minimalism — *if* principles compress better than rules, a handful of axioms might qualify as minimal. But the artifact Hodapp actually proposes is not that; it is a comprehensive theoretical document. On the evidence available, the KB position holds: the bias framing is valuable, the format is an antipattern.

### Regression Risk

**Low on the concept, high on the format.** Adopting the bias taxonomy enriches the KB. Adopting the CLAUDE.md-as-shared-theory format would regress against research the KB already cites. We take the former and decline the latter, and we name the tension explicitly in the thought-leadership entry so future readers understand why.

---

## C. Knowledge Graph Impact

### Existing Nodes Touched
- `src/pages/resources/further-reading.astro` — add thought-leadership entry with nuanced framing
- `src/content/patterns/agent-constitution.md` — add `relatedIds` link to new `concepts/agent-bias`; brief reference in the "Boundaries" or "Self-Correction Loop" section explaining that constitutional steering counterweights training-distribution biases
- `src/content/concepts/context-anchoring.md` — add `relatedIds` link to `concepts/agent-bias` to disambiguate negation-bias (Pink Elephant) from positive-anchor / training-distribution bias

### New Nodes Proposed
- **`concepts/agent-bias.md`** — new concept article capturing training-set bias and system-prompt-induced positive anchoring as a class of diagnosable agent failure modes. See Section E for the stub.

### Human Feedback Applied
- **Added following human review:** Scoping the new concept to cover *both* training-set bias (Hodapp's contribution) *and* system-prompt-induced positive bias (maintainer's first-party observation, particularly around `curl`). This broadens the concept beyond Hodapp's frame to a more complete taxonomy.
- **Added following human review:** Bidirectional link from `agent-constitution` → `agent-bias` as the "Why" behind constitutional steering.
- **Added following human review:** Rejected Gemini's proposal to integrate Hodapp's "shared theory" framing into `agent-constitution.md` directly — it conflicts with Gloaguen et al. (2026) and would regress the minimalism the KB is built on.

---

## D. Action Plan

**Strategy: COMBINATION** — Create new concept + log as thought leadership + update cross-references.

### 1. Create `src/content/concepts/agent-bias.md`
- New concept article (see Section E for stub)
- Status: `Experimental` (initial publication, refine as evidence accumulates)
- References: Hodapp article, Truong et al. (2023) for contrast with negation bias, maintainer field observations

### 2. Update `src/pages/resources/further-reading.astro`
- Add feed entry for Hodapp article
- Frame: credit the bias taxonomy and systems-engineering lens; flag the tension between Hodapp's verbose CLAUDE.md proposal and the Gloaguen et al. (2026) empirical finding that underpins our minimalism

### 3. Cross-link updates (bidirectional)
- `patterns/agent-constitution.md` — add `concepts/agent-bias` to `relatedIds`; add a 1–2 sentence note in "Self-Correction Loop" or "Anatomy of a Constitution" explaining that constitutional steering is, in part, a counterweight to documented agent biases
- `concepts/context-anchoring.md` — add `concepts/agent-bias` to `relatedIds`; add a disambiguation sentence clarifying that Context Anchoring is the *negation/attention* failure, while Agent Bias covers *positive-anchor / training-distribution* failures
- `concepts/agent-bias.md` — reciprocal `relatedIds` back to both

### 4. Out of scope (explicitly not doing)
- Do **not** amend `agent-constitution.md` to endorse Hodapp's "shared theory" / verbose-CLAUDE.md format — conflicts with `agents-md-spec` and Gloaguen et al. (2026)
- Do **not** expand `agentic-sdlc.md` to reference bias — it belongs at the concept layer, not the framework overview

---

## E. Draft Content: `concepts/agent-bias.md`

**Placement:** `src/content/concepts/agent-bias.md`

```yaml
---
title: "Agent Bias"
longTitle: "Agent Bias: Training-Set and System-Prompt Failure Modes"
description: "Systematic tendencies in AI agent behavior that skew decisions toward specific tools or patterns regardless of task fit — rooted in training distribution or system-prompt anchoring."
tags: ["LLM", "Agents", "Bias", "Context Engineering", "Failure Modes"]
publishedDate: 2026-04-20
lastUpdated: 2026-04-20
status: "Experimental"
relatedIds:
  - concepts/context-anchoring
  - concepts/ai-amplification
  - patterns/agent-constitution
  - practices/agents-md-spec
  - patterns/context-gates
references:
  - type: "paper"
    title: "LLMs Love Python: A Study of LLMs' Bias for Programming Languages and Libraries"
    author: "Lukas Twist, Jie M. Zhang, Mark Harman, Don Syme, Joost Noppen, Helen Yannakoudakis, Detlef Nauck"
    url: "https://arxiv.org/abs/2503.17181"
    published: 2025-03-21
    accessed: 2026-04-20
    annotation: "Empirical study across 8 LLMs finding NumPy over-used in up to 45% of cases and Python selected as default in 58% of tasks where it was not optimal — primary empirical evidence for Convenient-Tool / training-distribution bias."
  - type: "paper"
    title: "Position is Power: System Prompts as a Mechanism of Bias in Large Language Models"
    author: "Anna Neumann, Elisabeth Kirsten, Muhammad Bilal Zafar, Jatinder Singh"
    url: "https://arxiv.org/abs/2505.21091"
    published: 2025-05-27
    accessed: 2026-04-20
    publisher: "ACM FAccT 2025"
    annotation: "Tests 6 commercial LLMs (Claude, GPT-4o, Gemini) showing that position of information in system vs user prompts systematically shapes outputs — empirical basis for system-prompt-induced positive anchoring."
  - type: "paper"
    title: "Evaluating the Prompt Steerability of Large Language Models"
    author: "Charles Lovering, Michael Krumdick, Viet Dac Lai, Nilesh Kumar, Varshini Reddy, Rik Koncel-Kedziorski, Chris Tanner"
    url: "https://arxiv.org/abs/2411.12405"
    published: 2024-11-19
    accessed: 2026-04-20
    annotation: "Formal steerability benchmark. Finds baseline behavioral skew and asymmetric steerability across persona dimensions — confirms structural limits of pure prompt-based bias correction."
  - type: "paper"
    title: "Bias Testing and Mitigation in LLM-based Code Generation"
    author: "Dong Huang, Qingwen Bu, Jie Zhang, Xiaofei Xie, Junjie Chen, Heming Cui"
    url: "https://arxiv.org/abs/2309.14345"
    published: 2023-09-03
    accessed: 2026-04-20
    publisher: "ACM TOSEM"
    annotation: "Finds prompt-engineering mitigation has limited effect, while test-execution feedback reduces bias substantially (GPT-4: 59.88% → 4.79%) — validates deterministic gates over pure steering."
  - type: "website"
    title: "Axioms and Theorems of Human-AI Systems Engineering"
    author: "Ed Hodapp"
    url: "https://hodapp.com/posts/axioms-and-theorems-of-human-ai-systems-engineering/"
    published: 2026-04-17
    accessed: 2026-04-20
    annotation: "Identifies Convenient-Tool Bias and Solve-It-Alone Bias as predictable training-distribution failures in systems-engineering domains (firmware, kernels, compilers)."
  - type: "paper"
    title: "Language Models Are Not Naysayers: An Analysis of Language Models on Negation Benchmarks"
    author: "Thinh Hung Truong, Timothy Baldwin, Karin Verspoor, Trevor Cohn"
    url: "https://arxiv.org/abs/2306.08189"
    published: 2023-06-14
    annotation: "Distinct failure mode (negation insensitivity) that contrasts with positive-anchor and training-distribution biases covered here — the Pink Elephant mechanism in Context Anchoring."
---
```

**Suggested body outline** (target 800–1200 words, Archetype A):

1. **Definition** — Agent Bias is a systematic, empirically-measurable tendency in AI agent behavior that skews decisions toward specific tools, libraries, languages, or patterns regardless of task fit. Unlike the *Pink Elephant Problem* covered in [Context Anchoring](/concepts/context-anchoring) (a negation/attention failure where suppressed concepts remain active in the attention window), Agent Bias is a *positive-direction baseline* failure: the agent reaches for something it was not told to reach for, because the reach is baked in either at pre-training or at system-prompt level.

2. **Two mechanisms:**
   - **Training-Set Bias** — Training distributions skew toward popular ecosystems and high-level application code. Twist et al. (2025) studied 8 LLMs and found NumPy over-used in up to **45% of cases** where it was unnecessary, Python selected in **58% of high-performance initialization tasks** where it was not optimal, and Rust never selected once. Root cause: GitHub-corpus training-distribution skew. This extends to *tool* selection: agents default to "convenient" tools (curl, docker-compose, grep) that entangle layers in systems work (Hodapp, 2026).
   - **System-Prompt-Induced Bias** — Neumann et al. (2025, ACM FAccT) demonstrated across 6 commercial LLMs that the *position* of information in system prompts versus user prompts systematically shapes model outputs. Practical consequence: naming a tool anywhere in a system prompt or `CLAUDE.md` — even in a passing "we use X for Y" sentence — elevates its downstream selection frequency, a phenomenon confirmed by maintainer field observation (e.g., `curl` over-selection after any system-prompt mention).

3. **Distinct from Context Anchoring** — Context Anchoring is the *negation* failure (telling the agent not to use tRPC makes tRPC more likely, per Truong et al. 2023). Agent Bias is the *baseline-distribution* failure: the agent reaches for a tool absent any anchor, because the tool is statistically over-represented in either training data or the persistent system prompt. Both are real, both are empirically documented, and they require different mitigations.

4. **Diagnostic symptoms:**
   - Agent proposes high-level orchestration tooling (curl, docker, Python) in a low-level systems task
   - Agent continues a confused investigation rather than pausing for clarification (Solve-It-Alone Bias)
   - Agent's tool/library selection is stable across tasks where the task should drive different choices
   - Incidental tool mentions in `CLAUDE.md` or system prompt correlate with elevated selection frequency downstream

5. **Remediation strategies (in order of reliability):**
   - **Deterministic gates** — the most reliable mitigation. Huang et al. (2024, ACM TOSEM) found prompt engineering has *limited* effect on code-generation bias, while test-execution feedback reduced bias ratios from 59.88% to 4.79% in GPT-4. A linter that blocks `curl` calls in a kernel module is more reliable than a constitution that discourages them. See [Context Gates](/patterns/context-gates).
   - **Audit system-prompt tool mentions** — every named tool in `CLAUDE.md` is a positive anchor. Remove incidental mentions. This complements the "Minimal by Design" principle in [AGENTS.md Specification](/practices/agents-md-spec) with a new reason: not just attention dilution, but active positive-direction bias.
   - **Recognize-and-override steering** (Hodapp A5) — constitutional rules like "At decision points, take the rigorous path over the convenient one." Lovering et al. (2024) show steerability is *asymmetric* — steering helps, but cannot fully override baseline skew, so steering must be paired with gates.
   - **Domain-specific agent personas** — for systems work, compilers, embedded targets. Useful, but subject to the cost/benefit of verbose context files per Gloaguen et al. (2026).

6. **ASDLC Usage** — Agent Bias is a foundational "Why" for several downstream patterns: [Agent Constitution](/patterns/agent-constitution) (provides steering language to counterweight biases), [AGENTS.md Specification](/practices/agents-md-spec) (disciplines tool-mention to avoid creating new positive anchors), [Context Gates](/patterns/context-gates) (deterministic verification where steering is insufficient), and [AI Amplification](/concepts/ai-amplification) (biases are one of the "chaos" amplifiers that maturity filters must catch). It is a sibling concept to [Context Anchoring](/concepts/context-anchoring) — both are documented LLM failure modes, acting through different mechanisms and requiring different mitigations.

---

## Appendix: Parallel Assessment Notes

A parallel assessment was run with Gemini 3.1 (high). Points of agreement: verdict (SYNTHESIZED), confidence (High), identification of Training-Set Bias as the core novel contribution. Points of divergence:

- Gemini did **not** flag the conflict between Hodapp's verbose CLAUDE.md format and `practices/agents-md-spec` / Gloaguen et al. (2026). This report rejects that aspect of Hodapp's proposal on empirical grounds.
- Gemini proposed integrating Hodapp's "shared theory" framing directly into `agent-constitution.md`. This report declines that integration for the same reason.
- Gemini *floated* a new `concepts/agent-biases.md` node. This report commits to it (as `agent-bias`), with the scope broadened per maintainer review to include system-prompt-induced positive bias alongside Hodapp's training-set framing.
