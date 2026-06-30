---
title: "Agent Optimization Loop"
description: "The recursive process of using feedback from scenarios to continuously tune agent prompts, context, and tools."
tags: ["Meta-Pattern", "Optimization", "Agent Engineering", "Factory"]
relatedIds: ["patterns/ralph-loop", "concepts/context-engineering", "concepts/agentic-sdlc", "concepts/learning-loop", "concepts/compound-engineering"]
publishedDate: 2026-02-21
lastUpdated: 2026-03-18
status: "Experimental"
references:
  - title: "SWE-Skills-Bench: Do Agent Skills Actually Help in Real-World Software Engineering?"
    authors: ["Tingxu Han", "Yi Zhang", "Wei Song", "Chunrong Fang", "Zhenyu Chen", "Youcheng Sun", "Lijie Hu"]
    url: "https://arxiv.org/abs/2603.15401"
    type: "paper"
    published: 2026-03-19
    annotation: "Validates scenario-based evaluation over static benchmarks: acceptance-criteria-driven verification across 565 real tasks mirrors the Agent Optimization Loop's Scenario methodology."
  - title: "From Software Factories to Agent Factories: When Agents Build Agents"
    author: "Mutagent"
    url: "https://www.mutagent.io/blog/software-factories-agents-building-agents"
    type: "website"
    annotation: "Origin of the Agent Factory and Optimization Loop concepts."
    accessed: 2026-02-15
  - title: "Software Factories and the Agentic Moment: Probabilistic Satisfaction"
    author: "StrongDM"
    url: "https://factory.strongdm.ai/techniques/probabilistic-satisfaction"
    type: "website"
    annotation: "Explains shifting from boolean tests to empirical probabilistic satisfaction."
    accessed: 2026-03-09
  - title: "Self-Harness: Harnesses That Improve Themselves"
    authors: ["Hangfan Zhang", "Shao Zhang", "Kangcong Li", "Chen Zhang", "Yang Chen", "Yiqun Zhang", "Lei Bai", "Shuyue Hu"]
    url: "https://arxiv.org/abs/2606.09498"
    type: "paper"
    published: 2026-06-08
    annotation: "Introduces the Self-Harness loop for model-specific harness self-improvement, verifying edits using regression gates on held-out tasks."
  - title: "The Red Queen Gödel Machine: Co-Evolving Agents and Their Evaluators"
    authors: ["Alex Iacob", "Andrej Jovanović", "William F. Shen", "Daniel Burkhardt", "Meghdad Kurmanji", "Nurbek Tastan", "Lorenzo Sani", "Niccolò Alberto Elia Venanzi", "Ambroise Odonnat", "Zeyu Cao", "Bill Marino", "Xinchi Qiu", "Nicholas D. Lane"]
    url: "https://arxiv.org/abs/2606.26294"
    type: "paper"
    published: 2026-06-29
    annotation: "Introduces the Red Queen Gödel Machine (RQGM) and controlled utility evolution."
---

## Definition

The **Agent Optimization Loop** is the distinct lifecycle for building the agents themselves, separate from the lifecycle of the software they build. It replaces static "Evals" with dynamic **Scenarios**—realistic, localized integration tests that verify agent behavior in context.

While the [Ralph Loop](/patterns/ralph-loop) optimizes the *product* (Code) through iteration, the Agent Optimization Loop optimizes the *producer* (Agent) through meta-feedback.

## The Problem: Static Evals

Standard "Leaderboard" evaluations (GSM8K, HumanEval) measure raw intelligence, not job performance. Optimizing for them leads to overfitting on generic tasks while failing on domain-specific constraints.

In a **Software Factory**, we need agents that perform specifically well on *our* codebase, *our* patterns, and *our* constraints. A generic coding agent that knows Python well but ignores our project's `Result` type pattern is functionally broken.

## The Solution: The Factory Loop

The Agent Optimization Loop treats the agent's configuration (System Prompt, Context, Tools) as the source code, and "Scenarios" as the unit tests.

### Anatomy

The loop consists of three phases: **Seed**, **Validate**, and **Loop**.

### 1. Seed (Context Engineering)
The initial configuration of the agent. This includes:
*   **System Prompt**: The persona and behavioral constraints.
*   **Context**: The verified knowledge base (docs, specs).
*   **Tools**: The capabilities exposed to the agent.

### 2. Validate (Scenarios)
Instead of running the agent on a generic problem, we run it against a **Scenario**—a specific, representative task from our actual backlog.

*   *Scenario*: "Refactor `user.ts` to use Zod schema validation."
*   *Pass Criteria*:
    *   Code compiles.
    *   Tests pass.
    *   Linter is satisfied.
    *   **Architectural check**: Did it use the correct Zod patterns?

### 3. Loop (Meta-Optimization)
When the agent fails a scenario, we do not just fix the code (that's the Ralph Loop). We fix the **Agent**.

*   *Diagnosis*: Why did the agent fail?
    *   Did it miss a rule? -> Update System Prompt.
    *   Did it lack knowledge? -> Update Context (add a doc).
    *   Did it hallucinate a tool? -> Fix Tool definition.

This creates a compounding asset: an agent that gets smarter about *this specific codebase* over time.

### Probabilistic Satisfaction & Holdouts
In mature setups (such as an [AI Software Factory](/concepts/ai-software-factory)), evaluation shifts from boolean definitions of success ("the test suite is green") to empirical **Probabilistic Satisfaction**. Agents are evaluated against thousands of **Holdout Scenarios**—simulated user stories explicitly hidden from the agent during implementation. This prevents the agent from overfitting or "cheating" the tests, ensuring generalized competence.

## Offline vs Online Evolution

The Agent Optimization Loop manifests in two distinct modes:

### Offline Factory Optimization (Current Focus)
Optimization occurs asynchronously through explicit integration testing (Scenarios). Humans or meta-evaluators analyze failures and update the version-controlled context (Specs, `AGENTS.md`) and rerun. This guarantees determinism and peer review but has higher latency.

### Online Context Evolution (Experimental)
Often called "Continual Learning in Token Space," where an agent natively reflects over its past trajectories (e.g., distilling sessions into an `AGENTS.md` update or generating a new skill file automatically). While this enables rapid adaptation, it risks uncontrolled drift if the agent infers the wrong lesson from a failure. 

A concrete implementation of this is **Self-Harness** (Zhang et al., 2026), which operationalizes this evolution as a three-stage loop:
1. **Weakness Mining:** Clustering execution failures by verifier-grounded failure signatures to extract recurring agent-level mechanisms.
2. **Harness Proposal:** Invoking the agent to generate diverse yet minimal harness modifications targeted at those patterns.
3. **Proposal Validation:** Evaluating candidate harnesses against regression tests (on both held-in and held-out tasks) to ensure a candidate is promoted only if it improves performance on one split without degrading the other.

#### Proposer Taxonomy

The loop's Meta-Optimization phase can be driven by three distinct proposer types:
*   **Human Proposer:** Human-in-the-loop analysis where engineers examine execution traces, identify root causes, and manually modify the harness. This provides maximum safety but operates with high latency.
*   **Stronger External Meta-Agent:** Using a more capable model (e.g., GPT-4o or Claude Opus) to evaluate traces of a target agent and generate harness modifications for it.
*   **Same-Model Self-Proposer:** The target agent itself acts as the proposer, refining its own operating harness (as validated in *Self-Harness*, Zhang et al., 2026) to maximize model-specific alignment.

##### Self-Proposed Harness Optimization
*(Note: Flagged as a target glossary entry; tracked via Linear ticket [AL-76](https://linear.app/asdlc/issue/AL-76/design-and-implement-glossary-feature-for-kb-terms).)*
A sub-mode of Same-Model Self-Proposal where the agent optimizes its own scaffolding based on verifier-grounded trace signatures. In ASDLC, this remains a *proposal* loop rather than unbounded self-evolution: the allowed editable surfaces, sandbox environment, and final promotion criteria remain deterministically defined and governed by the harness and human architectural review.

In ASDLC, we treat Online Evolution as an *input* to Offline Optimization: agents can suggest updates to the context or harness, but these updates must pass deterministic validation gates or human Architectural Review before becoming canonical.

### Controlled Evaluator Evolution (Experimental)

A key limitation of standard self-improvement loops is that static evaluation criteria (scenarios or judges) become stale or prone to gaming (Goodhart's Law) as the agent's capabilities improve. The [Red Queen Gödel Machine](/concepts/red-queen-godel-machine) (Iacob et al., 2026) addresses this by **co-evolving the evaluator alongside the task agent** under non-stationary utility signals. 

However, allowing an agent loop to dynamically modify its own evaluation criteria creates a direct conflict with **Lesson #4 (Hard Harness Freeze)**, which dictates that the verification gates must remain frozen and human-governed to prevent safety regressions and drift.

To reconcile evaluator evolution with safety boundaries, the optimization loop implements **Controlled Utility Evolution**:
*   **Epoch-Frozen Criteria:** The active evaluator (e.g., prompt-based judges or review rubrics) is completely frozen for the duration of a search epoch. It serves as the static contract against which candidate agents are optimized, preserving epoch-local convergence guarantees.
*   **Governed Checkpoint Gates:** The evaluator can only be replaced at designated epoch boundaries (checkpoints). A candidate evaluator is promoted only if it statistically outperforms the incumbent on an independent, frozen **Ground-Truth Anchor** dataset using conservative $\epsilon$-best-belief scoring.
*   **Selective Erasure:** When the evaluator is replaced, only the utility records scored by the retired judge are erased. The search lazily re-evaluates older nodes as it returns to them, preventing the mixing of stale utility evidence while keeping re-scoring costs linear in the total search budget.

This ensures that while the evaluator's soft heuristics (prompts and rubrics) evolve as a curriculum, the hard promotion gate (the anchor) remains frozen and human-governed.

## Relationship to Other Patterns

**[Ralph Loop](/patterns/ralph-loop)** — The Execution Loop. The Agent Optimization Loop runs *offline* to improve the agent so that the Ralph Loop runs more efficiently *online*.

**[Context Engineering](/concepts/context-engineering)** — The discipline that informs the "Seed" and "Loop" phases. The Optimization Loop is the process of verifying that our Context Engineering is effective.

**[Agentic SDLC](/concepts/agentic-sdlc)** — The overarching framework. The Agent Optimization Loop is the engine of the "Agent Factory" component of the ASDLC.
