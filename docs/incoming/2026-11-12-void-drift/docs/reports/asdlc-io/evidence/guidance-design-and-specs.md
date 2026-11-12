# Guidance evidence — design, specifications, and context

## Capture identity and reading scope

Pages below were captured from their canonical `asdlc.io` URLs on 12 November 2026, around 06:21 UTC. The capture manifest is `evidence/guidance-capture.json` (within this report collection); it records canonical URL metadata, retrieval time, visible status, page update date where exposed, release label, and HTML/text SHA-256. The site displayed release label `v0.27.2`; this is not a verified source revision. Raw text and HTML are temporary captures under `/tmp/asdlc-assessment-corpus/`, not durable report attachments. Pages are summarized below in my own words; no page summary exceeds 120 words.

**Semantically read:** all 16 requested pattern/practice/concept pages listed as G-D01–G-D16, and all three requested-adjacent recipe pages G-D17–G-D19. **Context-only:** captured `/`, `/getting-started/`, `/patterns/`, `/practices/`, `/concepts/`, `/resources/`, and `/recipes/` indexes were used for page discovery and release identity, not as substitutes for page reading. Other captured site pages were not semantically assessed for this packet.

## Page propositions

### G-D01 — [The Spec: Living Specifications for Agentic Development](https://asdlc.io/patterns/the-spec/)

**Status:** Live; updated 2026-10-05. **Headings:** “Definition”; “State vs Delta”; “Anatomy”; “Specs as Living Hypotheses.” The spec is a durable, repo-resident account of current feature intent and quality contracts. ASDLC targets spec-anchored use: keep specifications current alongside code, distinguish feature state from a transient task delta, and retain deterministic code as runtime authority. Blueprint records context/architecture/constraints; Contract gives observable quality criteria. The page explicitly rejects spec-as-source and presents implementation as a source of learning that should refine the spec.

### G-D02 — [Living Specs: Creating and Maintaining Specifications That Evolve With Your Code](https://asdlc.io/practices/living-specs/)

**Status:** Live; updated 2026-10-05. **Headings:** “When to Create a Spec”; “Spec Anatomy”; “The Refinement Cycle”; “Maintenance Practices”; “Spec Review as Gate.” Recommends specs for durable feature constraints and workflows, but says skip tasks where a spec adds no information. It favors focused, predictable Blueprint/Contract structure, concrete paths, positive system constraints, same-commit updates when behavior changes, bidirectional provenance, and review before implementation. The template is explicitly adaptable; omit sections that add no information. The guide also advocates deprecation markers to retain history.

### G-D03 — [Spec-Driven Development](https://asdlc.io/concepts/spec-driven-development/)

**Status:** Live; updated 2026-05-26. **Headings:** “Key Characteristics”; “Levels of SDD Adoption”; “Anti-Patterns”; “ASDLC Usage.” SDD means defining specifications before implementation and evolving them with the code. Its target maturity is spec-anchored, while spec-first discards its spec and spec-as-source makes the specification the only human-edited source, with code generated from it. The page accepts implementation discovery and iterative refinement, emphasizes deterministic orchestration for mechanical rules, and warns against treating visual mockups as complete technical requirements.

### G-D04 — [Spec Reversing](https://asdlc.io/patterns/spec-reversing/)

**Status:** Experimental; updated 2026-02-04. **Headings:** “The Void: Missing Truth”; “The Pattern”; “When to Use”; “Directives.” For brownfield areas without reliable specs, derive a scoped provisional account from existing code, then have a human distinguish intended behavior from accidental behavior before committing it as a useful baseline. The page says not to trust reversed code blindly because bugs can be documented as if they were requirements; it recommends one file/feature scope at a time. This is a bootstrapping pattern, not a claim that present behavior is desired.

### G-D05 — [Experience Modeling](https://asdlc.io/patterns/experience-modeling/)

**Status:** Live; updated 2026-01-25. **Headings:** “The Problem: Design Drift”; “The Solution: The Experience Schema”; “2. The Context Gate (The Enforcer)”; “3. Read-Only Enforcement (The Governance).” It proposes treating a design system as a queryable, constrained UI vocabulary that implementation agents consume, with checks for token use, schema/document parity, and isolated build. During feature assembly the model is read-only; changing it is a separate human-governed decision. The page describes hard isolation and toolchain enforcement as different implementation options. This is a design-system integrity pattern, not evidence that every product design choice can be reduced to a component schema.

### G-D06 — [Product Vision](https://asdlc.io/patterns/product-vision/)

**Status:** Live; updated 2026-01-13. **Headings:** “Definition”; “Anatomy”; “Placement in Context Hierarchy”; “Anti-Patterns.” Vision conveys human/product context, point of view, taste references, voice, and decision heuristics to guide judgment when feature contracts leave choices open. It sits between behavioral constitution and feature specs, but need not be a separate file in a small project. The page cautions that vision must reflect the product being built and reach agents in relevant context; aesthetic preference alone is insufficient.

### G-D07 — [Agentic Double Diamond](https://asdlc.io/patterns/agentic-double-diamond/)

**Status:** Experimental; updated 2026-02-25. **Headings:** “The Solution: A Computational Pipeline”; “Anatomy”; “Anti-Patterns.” It maps Discover/Define to problem context and human strategy judgment, then Spec/Assemble to contracts, agent implementation and independent critique, followed by Run feedback. It advocates adversarial gates at problem definition and implementation convergence. Its distinctive statement that the spec becomes “primary source code” and writing a spec is coding sits in tension with Live G-D01/G-D03, which reject spec-as-source and keep executable code authoritative. The page labels the overall model experimental; its cited speed result is a reported external implementation, not evidence from this case.

### G-D08 — [Adversarial Requirement Review](https://asdlc.io/practices/adversarial-requirement-review/)

**Status:** Experimental; updated 2026-02-12. **Headings:** “When to Use”; “The Solution: Thought Partner vs. Leader”; “The Workflow”; “Integration with ASDLC.” A critic challenges framing, assumptions, and strategy before spec/code; the human remains thought leader and makes decisions while the agent sharpens the problem. The page gives three modes (problem clarification, assumption surfacing, pre-build stress test) and says skip bugs or technical tasks with an established why. Its interview-style prompts are examples for suitable new-feature uncertainty, not a universal requirement to question every task.

### G-D09 — [Using DDD to Ground BDD and Parallel Agent Work](https://asdlc.io/practices/domain-driven-specification/)

**Status:** Live; updated 2026-10-23. **Headings:** “The Process”; “Reconcile requirements and executable scenarios”; “Common Mistakes.” Connects requirements, a validated glossary, bounded-context ownership, event contracts, and BDD scenarios, then reconciles testable criteria and scenarios bidirectionally. Human domain judgment is retained; agents may propose vocabulary/boundaries but must not be treated as domain truth. The page explicitly says its workflow is practitioner-derived, not a controlled evaluation; the running library example is illustrative, and cited research supports specific cautions rather than evaluating the whole workflow.

### G-D10 — [The Learning Loop](https://asdlc.io/concepts/learning-loop/)

**Status:** Live; updated 2026-06-30. **Headings:** “The Cycle”; “Not Waterfall”; “Not Pure Vibe Coding”; “Automation: The Ralph Loop.” Discovery can arise through exploratory implementation; useful constraints should then be interpreted, crystallized into durable context, and verified later. The page distinguishes this human-judgment loop from automated Ralph-style iteration over machine-verifiable criteria. It presents exploration as legitimate where knowledge is incomplete, while warning that uncaptured discoveries are lost.

### G-D11 — [Agent Constitution](https://asdlc.io/patterns/agent-constitution/)

**Status:** Live; updated 2026-02-18. **Headings:** “Taxonomy: Steering vs. Deterministic Constraints”; “The Decision Rule”; “Constitution vs. Spec.” Persistent instructions steer judgment probabilistically; toolchain checks and runtime orchestration enforce rules deterministically. Keep global behavioral guidance distinct from task/feature contracts, and back critical prohibitions with deterministic controls where possible. The page acknowledges that negative wording is a weak steering mechanism, although its proposed constitution anatomy still includes negative boundaries; this is a stated limitation, not a guarantee of instruction enforcement.

### G-D12 — [AGENTS.md Specification: The Standard AI Context File Convention](https://asdlc.io/practices/agents-md-spec/)

**Status:** Live; updated 2026-03-16. **Headings:** “Core Philosophy”; “Standard agents.md Format & Recommended Sections”; “What to Audit Out”; “Format Philosophy.” Recommends concise, developer-authored project context that agents cannot infer, routes deterministic rules to tool config, session procedures to skills, and feature rules to specs/PBIs. Judgment boundaries, skill roster, and optional context map can be included when useful. It describes format as adaptable and says signal density matters more than exact compliance; its extensive example/template is guidance for larger or complex settings, not a universal schema.

### G-D13 — [The PBI](https://asdlc.io/patterns/the-pbi/)

**Status:** Live; updated 2026-01-13. **Headings:** “Pointer, Not Container”; “Anatomy”; “Bounded Agency”; “Atomicity & Concurrency.” A transient Product Backlog Item defines a bounded change and points to enduring spec context and verification criteria. It should state directive/scope, context pointer, verification pointer, refinement rule, and dependencies. Agents retain flexibility over implementation path within explicit outcomes/boundaries. For parallel execution, increments should be atomic, self-testable, isolated, and declare dependencies.

### G-D14 — [PBI Authoring](https://asdlc.io/practices/pbi-authoring/)

**Status:** Live; updated 2026-01-13. **Headings:** “Process”; “Step 6: Set the Refinement Rule”; “PBI Lifecycle”; “Common Mistakes.” Gives an agent-oriented lifecycle and template: imperative directive, explicit scope, spec pointer, verification, dependencies, and a rule for handling divergence. It treats tracker accessibility as a prerequisite and recommends MCP/API/repository alternatives. It says skip PBIs for exploratory work, one-off commands, and human-only execution. Unlike the spec pattern's flexible template, the PBI practice's examples include inline verification checkboxes and “what NOT to touch”; these are examples, while the positive-constraint principle applies to durable specs.

### G-D15 — [The ADR](https://asdlc.io/patterns/the-adr/)

**Status:** Live; updated 2026-01-28. **Headings:** “Definition”; “Anatomy”; “State vs The Spec”; “Adversarial Decision Review.” An ADR records one architectural choice with context, decision, consequences, and alternatives. It preserves the reasoning snapshot while the feature spec describes current behavior. The page says ADR content is immutable and later decisions supersede earlier records; status can change. It positions ADRs as high-value historical context for future agents, distinct from living feature contracts.

### G-D16 — [ADR Authoring](https://asdlc.io/practices/adr-authoring/)

**Status:** Live; updated 2026-01-28. **Headings:** “When to Use”; “Process”; “Lifecycle Management”; “Common Mistakes.” Recommends ADRs for significant architectural choices/trade-offs, not tactical or already-captured decisions. Its template requires honest positive/negative/neutral consequences and specific rejected alternatives; old decisions are retained when superseded. It also says to update an old ADR's status/link while preserving its content, clarifying that immutability applies to the decision record body rather than lifecycle metadata.

### G-D17 — [Spec Engineer](https://asdlc.io/recipes/spec-engineer/)

**Status:** Experimental. **Headings:** “Modes”; “Pipeline”; “Principles”; “Boundaries.” A reusable create/reverse/update procedure loads project context, inspects code/contracts, writes or reconciles a spec, checks cross-references, validates, then reduces redundant detail. It explicitly keeps code authoritative for execution logic and calls specs hypotheses. Some template examples include checkboxes and deprecation markers, while the instructions also say adapt depth and omit empty sections; the recipe is customizable, not a universal mandate. The recipe says it does not run build/lint/tests.

### G-D18 — [Write an AGENTS.md File for Your Agentic Project](https://asdlc.io/recipes/write-agents-md/)

**Status:** Live. **Headings:** “Step 2 — Add the Mission section”; “Step 4 — Add Judgment Boundaries”; “Step 6 — Validate.” Operationalizes the AGENTS.md practice with short mission, command registry, judgment boundaries, optional personas and optional context map. It recommends a validation run and commit as recipe steps, but its subject is setup; these are not claims that every session must do so. It advises omitting tool-enforced rules and context maps without a navigation need.

### G-D19 — [The Critic Pattern: Adversarial Code Review Agent](https://asdlc.io/recipes/critic/)

**Status:** Experimental. **Headings:** “When to Use”; “How It Works”; “Phase 3 — Review through three lenses”; “Principles.” A separate, read-only critic loads contracts before the diff, reviews spec compliance, architecture/constitution, and correctness/edge cases, then reports cited findings. It is intended for behaviorally meaningful changes and explicitly skips trivial documentation/config changes. It prescribes running the quality gate in its template; it also says a missing/ambiguous spec is a gap rather than an automatic code violation. This is a recipe instantiation, not evidence that independent-model review is always independent or effective.

## Guidance tensions and reading boundaries

- **Spec authority has two meanings.** Live specification guidance makes specs authoritative for intent, architecture and feature contracts while retaining code as runtime authority. The experimental Agentic Double Diamond's “primary source code” language is stronger and conflicts if read literally; maturity labels and the more explicit anti-spec-as-source pages matter to interpretation.
- **Fixed templates versus proportionality.** The Spec, Living Specs, and Spec Engineer pages show a stable Blueprint/Contract shape but also allow sections to be omitted when empty or unhelpful. PBI and ADR templates serve different transient-task and decision-record roles. Their checkboxes/immutable-record conventions should not be generalized into every feature spec.
- **Design exploration versus pre-spec challenge.** Agentic Double Diamond and Requirement Review describe a problem/strategy checkpoint before a spec. Learning Loop and Living Specs also treat exploration and implementation discovery as normal sources of new understanding. The guidance does not say all uncertainty must be resolved before any artifact or exploratory code; rather, it describes distinct intents and gates, although the exact boundary depends on task type.
- **Context instructions are steering, not hard enforcement.** Agent Constitution and AGENTS.md Specification explicitly separate probabilistic judgment instructions from deterministic tool/runtime controls. Recipe templates contain many NEVER/ALWAYS examples, while the constitution page notes negation is weak; their own caveats reject treating text as a guarantee.

This packet records page propositions and their visible maturity, not a compliance score or applicability judgment. Project comparison belongs in the assessment synthesis; status, release label, and cited external validation do not independently prove a proposition's effectiveness.
