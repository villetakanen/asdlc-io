---
title: "Provenance"
description: "The chain of custody and intent behind software artifacts, distinguishing high-value engineered systems from 'slop'."
tags: ["Core", "Philosophy", "Quality", "Governance", "Value"]
status: "Experimental"
relatedIds: ["patterns/context-gates", "practices/micro-commits", "concepts/agentic-sdlc", "patterns/the-spec"]
lastUpdated: 2026-02-15
references:
  - title: "Code is cheap. Show me the talk."
    author: "Kailash Nadh"
    url: "https://nadh.in/blog/code-is-cheap/"
    type: "website"
    annotation: "Source of the 'Code is Cheap' and 'Provenance' philosophy."
    accessed: 2026-02-15
---

## Definition

**Provenance** in the Agentic SDLC is the traceable chain of human intent and verification behind every artifact.

As AI reduces the cost of *generating* code to near-zero, the value of software shifts from the **volume** of lines produced to its **accountability**. Code that appears magically ("vibe coding") without clear direction has low provenance and acts as a liability. Code that results from specific human intent, articulated in a Spec and verified by a Gate, has high provenance.

## The Theory of Value

The "Code is Cheap" philosophy fundamentally alters how we value software engineering activities:

1.  **Code is Cheap**: LLMs provide an effectively infinite supply of syntax.
2.  **Attention is Finite**: Human bandwidth to verify and steer is the bottleneck.
3.  **Provenance is Value**: We value what we can trust. Trust comes from knowing *who* steered the agent and *how* it was verified.

> "When one gets that big pull request (PR) on an open source repository, irrespective of its quality, if it is handwritten by a human, there is an intrinsic value and empathy for the human time and effort that is likely ascribed to it... That is what makes that code 'expensive' and not cheap." — Kailash Nadh

In an agentic system, we cannot rely on "effort" as a proxy for value. We must rely on **provenance**—the audit trail that proves a human *intended* for this code to exist and *verified* that it serves that intent.

## The Spec as "Expensive Talk"

Linus Torvalds famously said, "Talk is cheap. Show me the code."

In the AI era, this overrides. **Code is cheap. Show me the talk.**

"The Talk" is the **Spec**—the high-fidelity articulation of requirements, constraints, and architecture. Generating 10,000 lines of code is trivial; articulating *exactly* what those 10,000 lines should do is the hard, high-value work.

## ASDLC Usage

Provenance is enforced through three mechanisms:

1.  **Intent Provenance (The Spec)**: Every change must trace back to a defined PBI or Spec. No "random acts of coding."
2.  **Verification Provenance (Context Gates)**: Every state transition is gated by a verifiable check (e.g., "Verified by `architect-agent` using `checklist-v1`").
3.  **Audit Provenance (Micro-Commits)**: Granular commits reveal the *step-by-step* reasoning of the agent, rather than a giant "slop" PR.

**Applied in:**
*   [The Spec](/patterns/the-spec) — The primary artifact of Intent Provenance.
*   [Context Gates](/patterns/context-gates) — The checkpoints of Verification Provenance.
*   [Micro-Commits](/practices/micro-commits) — The unit of Audit Provenance.
