---
title: "Provenance"
description: "The chain of custody and intent behind software artifacts, distinguishing high-value engineered systems from 'slop'."
tags: ["Core", "Philosophy", "Quality", "Governance", "Value"]
status: "Live"
relatedIds: ["patterns/context-gates", "practices/micro-commits", "concepts/agentic-sdlc", "patterns/the-spec", "concepts/triple-debt-model"]
publishedDate: 2026-02-15
lastUpdated: 2026-03-28
references:
  - title: "Code is cheap. Show me the talk."
    author: "Kailash Nadh"
    url: "https://nadh.in/blog/code-is-cheap/"
    type: "website"
    annotation: "Source of the 'Code is Cheap' and 'Provenance' philosophy."
    accessed: 2026-02-15
  - type: "website"
    title: "Using AI Coding Assistants — Linux Kernel Documentation"
    url: "https://github.com/torvalds/linux/blob/master/Documentation/process/coding-assistants.rst"
    author: "Linux Kernel Project"
    accessed: 2026-04-15
    annotation: "The Linux kernel's official policy on AI-assisted contributions. Formalizes human-only DCO sign-off and the Assisted-by attribution tag — a level-invariant governance principle where individual commits may be agent-assisted but the program increment requires human accountability."
  - type: "paper"
    title: "From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI"
    url: "https://arxiv.org/abs/2603.22106"
    author: "Margaret-Anne Storey"
    published: 2026-03-23
    accessed: 2026-03-25
    annotation: "Defines Intent Debt — the absence of externalized rationale and constraints. Provenance is one enforcement mechanism for reducing Intent Debt, not its full scope."
---

## Definition

**Provenance** is the traceable chain of human intent and verification behind every software artifact. It answers three questions: *who* decided this should exist, *why* they decided it, and *how* the result was verified.

As AI reduces the cost of *generating* code to near-zero, the value of software shifts from the volume of lines produced to its accountability. Code that appears without clear direction has low provenance and acts as a liability. Code that results from specific human intent, articulated in a Spec and verified by a Gate, has high provenance.

## Key Characteristics

- **Code is Cheap.** LLMs provide an effectively infinite supply of syntax. Generating 10,000 lines of code is trivial; articulating *exactly* what those 10,000 lines should do is the hard, high-value work.
- **Attention is Finite.** Human bandwidth to verify and steer is the bottleneck.
- **Provenance is Value.** We value what we can trust. Trust comes from knowing *who* steered the agent and *how* it was verified. In an agentic system, we cannot rely on "effort" as a proxy for value — we must rely on the audit trail that proves a human *intended* for this code to exist.

> "When one gets that big pull request (PR) on an open source repository, irrespective of its quality, if it is handwritten by a human, there is an intrinsic value and empathy for the human time and effort that is likely ascribed to it... That is what makes that code 'expensive' and not cheap." — Kailash Nadh

Linus Torvalds famously said, "Talk is cheap. Show me the code." In the AI era, this inverts: **Code is cheap. Show me the talk.** "The Talk" is the [Spec](/patterns/the-spec) — the high-fidelity articulation of requirements, constraints, and architecture.

## Provenance and Intent Debt

Provenance and Intent Debt (Storey, 2026) are related but distinct concepts. **Provenance** is the traceability chain — *who* decided, *when*, and *how* it was verified. **Intent Debt** is the absence of externalized rationale — the *why* behind a decision was never captured in a durable artifact.

A codebase can have perfect provenance (every commit signed, every PR linked to a ticket, every gate passed) and still carry severe Intent Debt if the *rationale* — the constraints, trade-offs, and rejected alternatives — was never written down. Provenance is one enforcement mechanism for reducing Intent Debt, but it is not sufficient on its own. Full mitigation requires explicit intent artifacts: [Specs](/patterns/the-spec), [ADRs](/patterns/the-adr), and [Constitutions](/patterns/agent-constitution).

## ASDLC Usage

Provenance is enforced through three mechanisms:

1.  **Intent Provenance (The Spec)**: Every change must trace back to a defined PBI or Spec. No "random acts of coding."
2.  **Verification Provenance (Context Gates)**: Every state transition is gated by a verifiable check (e.g., "Verified by `architect-agent` using `checklist-v1`").
3.  **Audit Provenance (Identity & Tracking)**: The granular chain of custody showing who did what.
    *   **Micro-Commits**: Granular, step-by-step reasoning rather than a single giant AI slop PR.
    *   **Identity Separation**: Models must operate under distinct, cryptographically isolated credentials (e.g., unique API tokens per agent persona), ensuring every action is explicitly attributed to a specific model's reasoning pathway.

Related:
- [The Spec](/patterns/the-spec) — The primary artifact of Intent Provenance
- [Context Gates](/patterns/context-gates) — The checkpoints of Verification Provenance
- [Micro-Commits](/practices/micro-commits) — The unit of Audit Provenance
- [Triple Debt Model](/concepts/triple-debt-model) — Diagnostic framework positioning Provenance within Intent Debt mitigation
