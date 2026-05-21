---
title: "Compound Engineering"
description: "A practice of structuring knowledge work around feedback loops where each cycle accumulates learnings into persistent context."
tags:
  - Methodology
  - Learning
  - Agent Architecture
relatedIds:
  - concepts/learning-loop
  - concepts/context-engineering
  - concepts/triple-debt-model
  - concepts/feedback-loop-compression
  - patterns/compound-loop
  - patterns/ralph-loop
  - patterns/agent-optimization-loop
  - patterns/context-gates
  - patterns/adversarial-code-review
status: "Live"
publishedDate: 2026-05-21
lastUpdated: 2026-05-21
references:
  - type: "website"
    title: "Compound Engineering: The Definitive Guide"
    url: "https://every.to/source-code/compound-engineering-the-definitive-guide"
    author: "Every, Inc."
    accessed: 2026-05-20
    annotation: "Every's canonical articulation of the Plan-Work-Review-Compound loop and the 80/20 time-allocation prescription."
  - type: "website"
    title: "Compound Engineering: How Every Codes With Agents"
    url: "https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents"
    author: "Every, Inc."
    accessed: 2026-05-20
    annotation: "Operational description of compound engineering as practiced internally at Every, including the workspace-as-memory framing."
  - type: "repository"
    title: "compound-engineering-plugin"
    url: "https://github.com/EveryInc/compound-engineering-plugin"
    author: "Every, Inc."
    annotation: "Open-source plugin that implements the compound-engineering loop in coding-agent environments."
  - type: "website"
    title: "Compound Engineering: The Complete Guide to 300-700% Faster Development"
    url: "https://www.vincirufus.com/en/posts/compound-engineering/"
    author: "Vinci Rufus"
    accessed: 2026-05-20
    annotation: "Secondary-literature summary popularizing the 300-700% productivity-multiplier headline. Methodology for the claim is not specified."
  - type: "website"
    title: "The Shift from Models to Compound AI Systems"
    url: "https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/"
    author: "Berkeley Artificial Intelligence Research"
    accessed: 2026-05-20
    annotation: "Defines 'compound AI system' as a runtime architecture composing multiple components within a single inference session — frequently conflated with compound engineering in secondary literature."
  - type: "video"
    title: "Compound Engineering Explained"
    url: "https://www.youtube.com/watch?v=kjVNYUnM-_0"
    author: "Kevin Rose"
    published: 2026-01-19
    annotation: "Long-form interview surfacing compound engineering to a general technology-podcast audience."
---

## Definition

**Compound engineering** is a practice of structuring knowledge work around feedback loops where each cycle's output includes both the artifact and the learnings about producing it, written back to persistent context for future practitioners — human or agent — to ingest. The term was popularized by Every, Inc. in January 2026 in the context of software development. The underlying pattern is general: it applies wherever knowledge work compounds, from software engineering to service design, project management, service-desk knowledge bases, and operations after-action reviews.

## Key Characteristics

Compound engineering, as articulated by Every, is operationalized as a four-stage loop:

- **Plan** (roughly 40% of cycle time). The practitioner or agent produces an executable plan: behavioral requirements, codebase research (grepping for prior patterns, related utilities, past attempts), external constraints (API specs, framework limits, rate limits), file-level architectural design, and explicit failure paths for idempotency edge cases.
- **Work**. The agent generates changes alongside matching tests. Multiple parallel worktrees are common.
- **Review**. Automated layers (lint, static analysis, unit tests) run first, then structural review of both the artifact and the systemic choices made during execution. Humans and supervisor agents act as architecture owners.
- **Compound**. The reviewer extracts the operational lessons and near-misses identified during review, and writes them back to persistent context files on disk — `AGENTS.md`, `CLAUDE.md`, skill registries, `STRATEGY.md`. Subsequent runs ingest the updated context immediately.

Every maintains an open-source plugin that implements the loop in coding-agent environments.

A defining prescription attached to the practice is an 80/20 time allocation: approximately 80% of practitioner time in planning and review, 20% in execution and documentation of learnings. The headline performance claim is a 300–700% productivity multiplier over baseline software development.

A central framing in the practice is that the workspace itself functions as a memory artifact. The codebase plus its context files becomes the team's accumulated procedural knowledge, not just a record of the current state. Many teams were already accumulating lessons into project context files informally; the named practice gives teams a vocabulary to coordinate on it deliberately rather than by accident.

## Prior Art and Adjacent Concepts

Compound engineering is a term, not an invention. The structural patterns it relies on existed before Every named them, and conflating them is a common source of confusion in the secondary literature.

**Compound AI systems.** The Berkeley Artificial Intelligence Research group uses *compound AI system* to describe an architecture that composes multiple interacting components — model calls, retrievers, guardrails, tools — within a single inference session to solve cognitive tasks. This is a runtime architecture paradigm: multiple components inside one cycle. It is not the same as Every's compound engineering. Berkeley composes capability within a session; Every accumulates capability across sessions.

**Iterative agent loops with accumulated context.** The single-task variant of the same iterate-and-accumulate pattern — where an agent iterates against an accumulating context until a task converges — predates compound engineering and is widely known in the agentic-coding community as the [Ralph Loop](/patterns/ralph-loop). The [Compound Loop](/patterns/compound-loop) generalizes it to the team-and-codebase scale, where the accumulation substrate is the project's persistent context rather than the agent's working memory.

**Agent optimization through feedback.** The broader frame of feedback-driven improvement of agent behavior over time has multiple instantiations. Compound engineering implements one version — the codebase-as-memory variant, sibling to the [Agent Optimization Loop](/patterns/agent-optimization-loop), which optimizes the agent's configuration (system prompt, context, tools) through scenario-based meta-feedback. ASDLC's [Learning Loop](/concepts/learning-loop) describes a closely related cycle that crystallizes discovered constraints into living specs rather than into general agent-context files — same compound dynamic, different durable substrate. Alternatives include procedural-memory frameworks that distill agent trajectories into reusable instructions, and infrastructure-first memory services accessible via Model Context Protocol that store memories as labeled, directed graphs and support temporal reasoning across distinct sessions.

**Experience compounding.** Every itself distinguishes "compound engineering" from "experience compounding" in some of their writing, with the latter describing the temporal-memory aspect specifically. The two terms are often used interchangeably in secondary literature; readers should expect both to refer to the same underlying practice in most contexts.

What compound engineering adds, attributed to Every: the team-and-codebase scale framing, the operational vocabulary (Plan-Work-Review-Compound), and the public articulation that turned a previously-tacit practice into a teachable one.

## Applications Beyond Software

Every's articulation is software-specific. The underlying loop is not. Wherever a team produces artifacts and learns from producing them, the compound step applies.

- **Service design.** Each research engagement — user interviews, journey maps, service blueprints, co-design workshops — generates not only the artifact but methodological learnings about producing it: which questions opened the right conversations, which edge cases the script missed, which synthesis patterns held up across studies. Without a compound step, every engagement reinvents method. With one, the team's working practice accumulates as fast as the deliverables do.

- **Project management.** Sprint retrospectives are the canonical compound step that mostly fails. The artifact (a retro doc) is produced; the lessons fade by the next retro. A compound loop applied to project management persists those learnings into the team's working memory: estimation-calibration data, dependency-mapping templates, risk patterns by domain, decision logs that survive personnel turnover. The retro becomes procedural memory, not meeting minutes.

- **Service-desk knowledge bases.** Tickets are the unit of work; resolutions are the artifact; the compound step is what turns recurring patterns into runbooks, escalation rules, and self-service articles. Without it, the team rediscovers the same fix for the same problem until headcount runs out. With it, ticket volume scales sub-linearly with customer count.

- **Operations and situation-report tools.** After-action reviews from incidents, exercises, or deployments generate doctrine. The compound step is what turns the AAR into updated playbooks, alerting thresholds, training scenarios, and on-call rotations that reflect what the last incident taught. The "lessons learned" file that nobody reads is the canonical failure mode.

- **Research synthesis, content production, sales operations, design systems.** Wherever cycles repeat and the practitioner can articulate what they learned this cycle, the compound loop applies. The constraints are not domain — they are editorial discipline at the compound step and a persistent context substrate that subsequent cycles can read.

Compound engineering as Every describes it is a software-development instance. The pattern is general.

## Open Questions

Several aspects of compound engineering as currently described in industry treatment remain under-specified or unresolved.

**The compound step has no enforced editorial discipline.** Cross-cycle knowledge accumulation goes wrong when the wrong lessons are written back to disk. The practice as articulated does not require verification that a candidate lesson is worth persisting, that it generalizes, or that it does not contradict existing context. Without discrimination at the compound step, the persistent context accumulates noise alongside signal — increasingly polished, but increasingly miscalibrated to the original intent.

**Memory architecture choices are non-trivial and under-discussed.** Writing lessons to `AGENTS.md` is one approach: ecosystem-coupled memory, frictionless for single-team deployments but creating de facto lock-in to whichever orchestration framework reads it. Standalone memory services accessible via Model Context Protocol are another: infrastructure-first memory, supporting temporal reasoning, entity resolution, and cross-session synthesis but adding operational complexity. The choice has substantial implications for portability, observability, and long-term maintenance cost; the secondary literature treats it as a footnote.

**Infinite-loop and denial-of-wallet risks are not addressed in the practice's framing.** Autonomous compound loops are susceptible to recursive execution failures: agents consume substantial compute resources without converging on a completion. Without deterministic guardrails — hard turn limits, task-ID idempotency, semantic similarity gates between successive cognitive turns, watchdog supervisor models, token budgets, and circuit breakers — a compound loop can quietly accumulate thousands of dollars in API charges before human operators detect the anomaly. The Plan-Work-Review-Compound vocabulary does not, on its face, name the gate structure required to prevent these failures.

**Verification is not yet deterministic.** The Review stage relies on a mix of automated tools (lint, static analysis) and supervisor-agent judgment. The supervisor-agent layer is itself probabilistic and inherits the same failure modes as the executing agents. The practice does not currently include or require a deterministic verification layer that removes the language model from binary pass/fail decisions.

**The 80/20 prescription is presented as both observation and target.** The shift in time allocation — most effort in planning and review, less in execution — is plausible: once execution is largely automated, the binding constraint moves to specification and verification quality. Whether 80/20 is a universal ratio, a workflow-specific observation from Every's internal practice, or a directional heuristic is not clarified. The number should be read as directional rather than prescriptive.

**Productivity claims lack shared methodology.** The 300–700% multiplier headline is unverified and methodology for measuring "productivity" in this context is not standardized. Some teams will see those gains. Many will see less. Some will see negative returns in early adoption, when the loop's overhead compounds before the memory layer begins to pay back. Expect variance, and budget for a learning curve where the loop costs more than it returns.

**Provenance and attestation are not part of the compound step.** When lessons are written to `AGENTS.md`, the practice does not require recording who wrote them, when, against what evidence, and whether the lesson is still current. At organizational scale, this becomes a governance gap.

## ASDLC Usage

In ASDLC's vocabulary, the structural pattern compound engineering operationalizes is documented as the [Compound Loop](/patterns/compound-loop) — sibling to the task-scale [Ralph Loop](/patterns/ralph-loop), generalizing to the team and the codebase as accumulation substrate. The most consequential failure mode the practice faces at organizational scale is Intent Debt from the [Triple Debt Model](/concepts/triple-debt-model): lessons compound, but if they are the wrong lessons, the persistent context accumulates increasingly polished misalignment with the team's original intent. The gate structure that the practice's compound step lacks, and the verification layer its Review step does not yet require, are concerns ASDLC's broader vocabulary addresses through [Context Gates](/patterns/context-gates) and [Adversarial Code Review](/patterns/adversarial-code-review).
