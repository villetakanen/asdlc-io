# Content Review Report: Linux Kernel Coding Assistants Guidelines

**Source:** [Documentation/process/coding-assistants.rst](https://github.com/torvalds/linux/blob/master/Documentation/process/coding-assistants.rst)
**Author:** Linux Kernel Project (Torvalds et al.)
**Assessed:** 2026-04-15
**Assessor:** Claude Opus 4.6 (Content Critic)
**Human feedback:** Incorporated — user clarified that human sign-off on program increments is a level-invariant principle, valid at L3 as well as L1-L2. User also identified `practices/micro-commits.md` as an additional integration target.

## A. Executive Summary

* **Verdict:** SYNTHESIZED
* **Confidence:** High
* **Assessment:** The Linux kernel's official policy on AI-assisted contributions is a landmark governance document from the world's largest open-source project. It formalizes two principles ASDLC already advocates — human accountability for program increments and traceable provenance of AI involvement — but provides concrete, implementable artifacts (the `Assisted-by` tag format, the DCO human-only rule) that the KB currently lacks. Value is as **evidence**, not as new theory. Best incorporated as a reference into `concepts/provenance.md` and `practices/micro-commits.md`, and logged as Further Reading.

## B. Critical Analysis

### Incumbent Pattern: Provenance (`concepts/provenance.md`)

The KB's Provenance concept defines three layers:
1. **Intent Provenance** — every change traces to a Spec/PBI
2. **Verification Provenance** — state transitions gated by checks
3. **Audit Provenance** — granular chain of custody (micro-commits, identity separation)

The kernel document addresses primarily Audit Provenance (attribution) and adds a legal dimension (DCO/GPL certification) that the KB does not currently cover.

### Incumbent Pattern: Micro-Commits (`practices/micro-commits.md`)

The KB's Micro-Commits practice covers granular commits as "save points" for rollback and audit. Section 5 ("Tidy History for Comprehension") treats squash-before-merge as optional cleanup for readability. This undersells the governance significance of the merge boundary.

### Challenger Input: The Kernel's Governance Model

The kernel document establishes three rules:

1. **Human-only DCO sign-off:** "AI agents MUST NOT add Signed-off-by tags." Only the human developer can legally certify origin and licensing compliance.
2. **Attribution format:** `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]` — a structured tag for tracing AI involvement at the commit level.
3. **Human ultimate accountability:** The submitting human bears full responsibility for reviewing AI-generated code, ensuring licensing compliance, and certifying the contribution.

### Analysis

The kernel operates at L1-L2 autonomy (AI as tool, human as driver/reviewer), but the core principle — **a human must own the program increment** — is level-invariant. At L3 Conditional Autonomy, individual atomic commits may be agent-authored, but the merge to `main` (the "program increment") still requires human sign-off. The human may be a "monitor" or "driver" of the automation, but the accountability boundary doesn't shift.

This maps directly to the micro-commits workflow: agents produce granular, `Assisted-by`-tagged commits during development. At the merge boundary, a human asserts ownership via sign-off. The squash-and-merge is not just cleanup — it's the **governance gate** where human accountability is formalized.

This aligns with ASDLC's existing positions:
- **Levels of Autonomy:** L3 defines the human as "Change Owner" who "validates CI/CD, footprint, & intervenes on drift"
- **Provenance:** "Code that results from specific human intent, articulated in a Spec and verified by a Gate, has high provenance"
- **Agentic SDLC:** "Agents do not replace humans; they industrialize execution"

### Regression Risk: None

Initially flagged as potentially regressive (L1-L2 framing). Following human review, re-assessed: the human sign-off requirement is not an L1-L2 limitation but a **universal governance invariant**. The kernel's conservative framing reflects its domain constraints (GPL licensing, patch-based workflow), not a philosophical disagreement with higher autonomy levels.

## C. Knowledge Graph Impact

### Existing Nodes Touched

| Article | Impact | Action |
|---|---|---|
| `concepts/provenance.md` | Add as reference — concrete real-world Audit Provenance implementation | **UPDATE** (add reference) |
| `practices/micro-commits.md` | Add as reference + strengthen governance framing of merge boundary | **UPDATE** (add reference, amend Section 5) |
| Further Reading page | Add as notable governance document | **UPDATE** |

### New Nodes Proposed

None. The source material does not introduce new concepts, patterns, or practices beyond what the KB already covers. A future "Attribution Practices" article could use this as foundational evidence if the topic accumulates more sources.

### Human Feedback Applied

- Upgraded from "partially regressive" to "level-invariant principle" — human clarified that the sign-off requirement applies at L3, not just L1-L2
- The key insight: individual commits can be co-authored by agents, but the program increment (PR to main) requires human ownership — this is true whether the human is a "coder" (L1) or a "monitor/driver" (L3)
- Added following human review: `practices/micro-commits.md` identified as integration target — the merge boundary is a governance gate, not just a cleanup step

## D. Action Plan

**Strategy: INTEGRATE + LOG**

1. **INTEGRATE into `concepts/provenance.md`:**
   - Add kernel doc as a `reference` in frontmatter
   - Brief mention of `Assisted-by` tag as industry evidence for Audit Provenance

2. **INTEGRATE into `practices/micro-commits.md`:**
   - Add kernel doc as a `reference` in frontmatter
   - Strengthen Section 5 ("Tidy History") to frame the merge-to-main as the human accountability boundary, not just optional cleanup
   - Cite the kernel's `Signed-off-by` (human) vs `Assisted-by` (agent) distinction as real-world evidence

3. **LOG AS FURTHER READING:**
   - Add to `src/pages/resources/further-reading.astro` under governance/process category

## E. Draft Reference Entry

Proposed reference for both articles:

```yaml
- type: "website"
  title: "Using AI Coding Assistants — Linux Kernel Documentation"
  url: "https://github.com/torvalds/linux/blob/master/Documentation/process/coding-assistants.rst"
  author: "Linux Kernel Project"
  accessed: 2026-04-15
  annotation: "The Linux kernel's official policy on AI-assisted contributions. Formalizes human-only DCO sign-off and the Assisted-by attribution tag — a level-invariant governance principle where individual commits may be agent-assisted but the program increment requires human accountability."
```
