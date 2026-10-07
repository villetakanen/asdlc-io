---
title: "Domain-Driven Specification"
longTitle: "Using DDD to Ground BDD and Parallel Agent Work"
description: "Use domain language, ownership boundaries, and event contracts to ground executable BDD scenarios, independent review, and parallel agent implementation."
authors: ["sachin-kundu"]
tags: ["Domain-Driven Design", "Behavior-Driven Development", "Specifications", "AI Agents", "Architecture"]
relatedIds:
  - patterns/the-spec
  - concepts/behavior-driven-development
  - practices/living-specs
  - patterns/context-map
  - patterns/adversarial-code-review
  - patterns/ralph-loop
lastUpdated: 2026-10-07
status: "Experimental"
references:
  - type: "website"
    title: "How I Use Domain-Driven Design in AI-Assisted Software Delivery"
    url: "https://zachoverzero.substack.com/p/how-i-use-domain-driven-design-in"
    author: "Sachin Kundu"
    publisher: "Prompt to Production"
    published: 2026-07-22
    accessed: 2026-10-05
    annotation: "Source practitioner account for this workflow: domain glossaries, structured DDD context maps, requirement-to-BDD reconciliation, independent domain review, and bounded-context partitioning for parallel agents. The tool-library example is illustrative, not a measured evaluation."
  - type: "paper"
    title: "Automating Domain-Driven Design: Experience with a Prompting Framework"
    url: "https://arxiv.org/abs/2603.26244v1"
    authors: ["Tobias Eisenreich", "Husein Jusic", "Stefan Wagner"]
    published: 2026-03-27
    doi: "10.48550/arXiv.2603.26244"
    annotation: "Qualitative FTAPI case study supporting expert review of domain terminology, context granularity, and accumulated errors in later design stages."
---

## Definition

Domain-Driven Specification is the process of using Domain-Driven Design (DDD) artifacts to ground agent generated implementation in explicit business meaning. It connects requirements, a domain glossary, bounded contexts, context relationships, and domain events to executable behavioral specifications.

The practice implements the [Spec pattern](/patterns/the-spec): domain models inform the Blueprint, while [Behavior-Driven Development](/concepts/behavior-driven-development) supplies the Contract. Humans decide what the domain means. Agents help explore, document, implement, and review those decisions.

## When to Use

Use this practice when business distinctions, ownership boundaries, or invariants must survive across requirements, implementation, tests, and documentation. It is particularly useful when multiple agents work on different parts of the same system.

This document uses a community tool library to provide a running example. Members reserve and borrow drills, ladders, cameras, and other equipment.

- A `ToolModel` describes a type of tool.
- A `ToolItem` represents one physical item.
- A `Reservation` allocates an item for future collection.
- A `Loan` begins when the member collects it.
- An `Inspection` determines whether a returned item can circulate again.

Mixing these distinctions can produce an implementation that appears coherent while expressing the wrong business rules.

Skip the full process for changes whose domain meaning and architectural boundaries are already clear and unchanged. A small correction within an established model does not require a new glossary or context map.

## The Process

### 1. Clarify requirements through conversation

Begin with describing the business workflow. Describe normal behavior, exceptions, unresolved questions, and assumptions. Use the agent to organize the discussion, identify ambiguities, and propose missing cases.

For the tool library, an initial requirement might be:

> Members should be able to reserve a drill and collect it later. A returned drill should become available again, except when it is damaged. It is not yet clear whether reservations apply to a tool model or a specific physical item.

The useful outcome is clarification of the domain.

Once the ambiguities have been examined, the requirement can be generated:

> **AC-LEND-07:** A member reserves a specific available `ToolItem` for a defined collection period. Collection starts a `Loan`. Returning the `ToolItem` ends the `Loan` and places the item `UnderInspection`. It cannot be reserved again until `Maintenance` records that the `Inspection` passed.

Assign stable identifiers to testable acceptance criteria. These identifiers will later connect requirements to executable scenarios.

### 2. Establish a context-scoped glossary

Record the concepts that appear in the requirements. Define their meanings, distinguish neighboring concepts, and identify alternative names that would obscure those distinctions.

```yaml
bounded_context: Lending
terms:
  ToolItem:
    definition: A single physical unit that can be reserved and loaned.
    not_to_be_confused_with: [ToolModel]
    aliases_to_avoid: [Tool, Equipment]
  Reservation:
    definition: A temporary allocation of a ToolItem for future collection.
    not_to_be_confused_with: [Loan]
    aliases_to_avoid: [Booking]
  Loan:
    definition: The period during which a member has collected a ToolItem.
    not_to_be_confused_with: [Reservation, Rental]
  UnderInspection:
    definition: The state after return and before Maintenance approves circulation.
```

The glossary is a design artifact. Deciding whether two terms are synonyms requires deciding whether they represent the same business concept.

Use the agreed language consistently in requirements, code, APIs, events, and BDD scenarios. Investigate terminology drift as a possible modeling error. A generated substitution from `Reservation` to `Booking` may appear harmless while weakening the connection between the specification and implementation.

Refine the glossary alongside the bounded contexts. This design is iterative.

[Eisenreich et al. (2026, §V-A)](https://arxiv.org/html/2603.26244v1) found that agents can generate useful glossary drafts but also generic or artificial terms. Validate generated vocabulary against stakeholder language.

### 3. Decide bounded contexts and ownership

Ask agents to propose alternative boundaries and explain their consequences. Treat those proposals as inputs to architectural judgment.

Again [Eisenreich et al. (2026, §V-C)](https://arxiv.org/html/2603.26244v1) found that agents can generate plausible boundaries that overlook coupling and can produce impractical splits. Evaluate consolidation as well as separation. This requires human judgement and is an essential step to generate good architecture which reflects the domaian.

For the tool library, one proposal might place all behavior inside a single context. Another might separate Catalog, Lending, Maintenance, and Billing.

Evaluate each boundary against:

- The coherence of the language inside it.
- The business capability it owns.
- The changes that must cross it.
- The coupling and operational complexity it introduces.

Separating Lending from Maintenance may be useful because ending a loan and approving an item for circulation are different responsibilities. Separating every distinct noun into its own context may introduce coordination without improving the model.

Approve the boundaries before implementation agents build on them. When new information changes the model, revise the approved artifacts through the [Living Specs](/practices/living-specs) refinement cycle.

### 4. Record DDD context relationships in structured form

Maintain a textual representation of the relationships between bounded contexts. Record ownership, published events, consumed events, integration contracts, and dependency restrictions.

This is a **DDD context map**. It serves a different purpose from ASDLC's [Context Map](/patterns/context-map), which is a navigation index for retrieving knowledge.

```yaml
contexts:
  lending:
    owns: [Reservation, Loan]
    publishes: [ToolReturned]
    forbidden_dependencies: [maintenance.persistence]
  maintenance:
    consumes: [ToolReturned]
    publishes: [InspectionPassed, DamageDetected]
```

The relationship is explicit: Lending announces that a tool was returned. Maintenance owns inspection and determines whether the item is fit to circulate again.

Where an external system uses a different model, define an anti-corruption layer(ACL). An external maintenance service may expose `assetId` and `conditionCode`. An ACL adapter translates those values into the local domain language. The external vocabulary stays at the integration boundary.

Reference the map from the project's agent instructions. Enforce dependency boundaries with linters and tools such as [dependency-cruiser](https://github.com/sverweij/dependency-cruiser). Validate event payloads against agreed schemas with tools such as [Ajv](https://ajv.js.org/); and use executable tests to check behavior across contexts.

### 5. Define domain events with explicit ownership

Return to the requirements and context relationships when identifying events. Check who knows that an event occurred, what the event means, and what information consumers need.

`ToolReturned` belongs to Lending because Lending knows when the member returns the borrowed item. `InspectionPassed` belongs to Maintenance because Maintenance owns the inspection decision.

Prefer an event that expresses business meaning:

```json
{
  "type": "ToolReturned",
  "toolItemId": "T-184",
  "loanId": "L-902",
  "returnedAt": "..."
}
```

A generic `ToolUpdated` event with database row identifiers and changed-field lists leaves consumers to infer the business meaning and couples them to internal storage details.

Review event names and payloads before parallel implementation begins. They form the integration contracts between contexts and chosing these well helps run parallel agents to work on different domain context without merge conflicts and integration problems.

### 6. Derive BDD scenarios from the domain model

Use the glossary to name concepts, bounded contexts to locate behavior, aggregates to identify invariants, and domain events to specify observable outcomes.

```gherkin
@AC-LEND-07
Scenario: A returned tool remains unavailable until inspection
  Given a ToolItem is OnLoan
  When the member returns it
  Then the ToolItem becomes UnderInspection
  And it cannot be reserved
  And ToolReturned is published
```

The scenario preserves the distinctions established in the requirements. Returning an item ends the loan. Whether an item is ready for another is governed by a different event.

### 7. Reconcile requirements and executable scenarios

Check traceability in both directions:

- Every testable acceptance criterion has at least one executable scenario.
- Every scenario references an existing acceptance criterion.
- References contain valid identifiers.
- Scenario steps are defined and contain no pending implementation.
- Explicit terminology rules remain consistent with the glossary.

Fail reconciliation when a required connection is missing or a scenario cannot execute.

While this can be helped with agents, it requires human judgement. Agents regularly claim work as completed when it is not and also generate unnecessary artifacts which was not requested and increase the scope of work.

Keep structural and semantic verification distinct. A valid `AC-LEND-07` tag proves that a reference exists. Passing steps establish the behavior those steps actually check. Neither proves that the scenario faithfully expresses the requirement. This has to be checked by a human.

You can and should use an independent agent review to flag possible meaning mismatches. However, retain human judgment over whether the requirement, scenario, and domain model agree.

### 8. Implement the agreed specifications

Give the implementation agent the approved requirements, glossary, context map, event contracts, and reconciled BDD scenarios. Implement the behavior within the agreed context boundaries and run checks against the implementation.

#### Partition parallel implementation by approved boundaries

Assign implementation agents work within bounded contexts where the architecture supports independent changes. Provide each agent with the relevant specification, glossary, local responsibilities, and shared integration contracts.

For example, the Lending agent implements return processing and publishes `ToolReturned`. The Maintenance agent consumes that event and implements inspection. Separate worktrees isolate their changes.

Agree the shared event schema before parallel work starts. Declare dependencies that require sequential delivery, and verify the integrated behavior afterward.

Bounded contexts provide a meaningful partition as worktree isolation alone cannot prevent agents from making incompatible assumptions about the same business process.

Run the scenarios, linters, schema validators, and architecture checks. Fix failures before independent review. If implementation exposes an ambiguity or missing requirement, return it for human clarification and update the agreed artifacts before continuing.

### 9. Review domain decisions independently

Give an agent reviewer the approved requirements, glossary, DDD context map, relevant architecture, and proposed design or code changes.

Make the review task explicit. Check for:

- Invented or inconsistent terminology.
- Incorrect ownership of behavior and events.
- Business rules placed outside the domain objects that should protect them.
- Aggregates that fail to preserve meaningful invariants.
- Direct access to another context's persistence.
- Missing anti-corruption layers.
- Event payloads that expose internal models.

In an illustrative review, an implementation agent might propose that Lending update Maintenance's condition data when a damaged item is returned. The reviewer should identify the ownership violation and require communication through the approved event contract.

This applies [Adversarial Code Review](/patterns/adversarial-code-review) to domain correctness.

[The study (§VI-B)](https://arxiv.org/html/2603.26244v1) also warns that early inaccuracies accumulate into later design errors. Check upstream artifacts before using them as implementation inputs.

Note that this is not a replacement for linters and dependency checkers mentioned above. Catch errors earlier in the chain and deterministically when possible.

## Common Mistakes

**Treating an agent's proposal as domain truth.** Agents can produce plausible terminology and tidy boundaries which are wrong for the domain and do not follow business rules or terminology.

**Equating traceability with correctness.** Requirement identifiers make relationships checkable but they do not establish if the requirement is semantically implemented correctly.

**Leaving architecture in prose.** Document ownership and relationships as a machine readable format. Then enforce the portions that tooling can check deterministically.

**Parallelizing before contracts are agreed.** Parallel agents need shared definitions of the events and APIs through which their work connects. Worktree isolation is not architecturally independent and creates merge conflicts and intergration work downstream.

## Related Patterns

This practice implements the [Spec pattern](/patterns/the-spec) by grounding its Blueprint and Contract in an explicit domain model.

[Adversarial Code Review](/patterns/adversarial-code-review) supplies independent critique. [Ralph Loop's partitioning principle](/patterns/ralph-loop#6-map-reduce-initializer--sub-agents) describes how bounded scopes support parallel execution. However, this practice does not require a Ralph Loop harness.

Agents can reduce the effort required to explore, document, implement, and review DDD artifacts. However, responsibility for deciding what the domain and it's rules mean remains with the people who understand the domain.
