# ASDLC.io assessment through Void Drift

Date: 2026-11-12. Status: assessment edition completed; findings and proposals await substantive review, not execution approval.

## Execution record — 12 November

Following the designer's instruction to start and notify on completion, the assessment was completed in [docs/reports/asdlc-io](../reports/asdlc-io/README.md). The coordinator fixed this edition to commit `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4`; the two 12 November closure records were already included. Later work is reserved for an addendum rather than silently mixed into the baseline. No claim is made that all other chats had finished.

The source register covers 86 captured guidance URLs (47 direct semantic readings) and a metadata inventory of 69 committed loop records. Three Luna High project packets cite 18 distinct loop records, supplemented by current code/contracts and historical collateral. Two additional Luna High guidance packets, coordinator source checks and three challenge passes supported synthesis. The final collection contains six substantive reports, eight findings and nine proposed ASDLC.io documentation changes. No product/factory behavior was changed, and no feedback was published or sent.

The originally proposed in-process designer discussion is represented by explicit unknowns and review-ready interpretations in the finished report, consistent with the instruction to complete the work. It is not represented as designer endorsement. [Validation](../reports/asdlc-io/evidence/validation.md) records checks and challenge dispositions. The planning sections below are retained as the original work design; their future-tense milestones do not mean the delivered edition is unfinished.

## Mandate and acceptance contract

Use Void Drift and its design-led software factory as a case study for developing the **agentic software development life cycle** guidance at ASDLC.io. Assess the current factory and its documented evolution and decisions. Produce evidence-backed findings and proposed ASDLC.io documentation changes for later review.

These scope decisions were confirmed by the designer on 12 November 2026. The assessment must explain how the project works, how its practices relate to the guidance, where they differ, what is known about why, and what the case can teach framework authors.

The deliverable is a navigable report collection in `docs/reports/asdlc-io/`. Its conclusions must trace to specific guidance and project evidence, distinguish observation from interpretation, preserve counterevidence and uncertainty, and identify the limits of generalising from one project.

This is research about the framework through a test subject. It does not assess improvement needs or change needs for Void Drift, create a project remediation backlog, change the factory, or promote lessons to standing rules. No publication or external feedback is authorised. Human playtesting stays outside the repository process; the assessment neither requests nor records it or treats its absence as a deficiency.

## Questions the assessment answers

1. How does the current factory translate conversational intent into design, specifications, implementation, verification, release, and retained learning?
2. Which ASDLC.io ideas have demonstrable counterparts, deliberate adaptations, tensions, or no assessable evidence here?
3. Which differences have recorded reasons, and which explanations remain inference or unknown?
4. What happened when the factory was amended, including unsuccessful and stopped work? What evidence supports outcomes rather than just adoption?
5. Where does the guidance explain this case well, and where does it leave ambiguity, omit necessary distinctions, or encourage unhelpful interpretations?
6. What documentation proposals follow, for what audience and conditions, with what counterexamples and validation still needed?

## Baselines and concurrent work

Planning reconnaissance observed HEAD `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4` with no status entries on 12 November. This is an initial observation, not the final assessment baseline or a verification claim. Other sessions are still closing loops.

Before evidence extraction, record the chosen commit, collection time, working-tree status, and scope in the source register. Read committed files at that revision where possible. Register relevant uncommitted or subsequently arriving reports separately with capture time and content hash. Do not quietly mix revisions or commit the shared checkout for convenience.

Before synthesis, review the late-arriving evidence once and select a final cutoff with the designer. Record included and deferred sources explicitly. Later material can be an addendum; its existence need not force an unlimited restart.

ASDLC.io's public pages inspected on 12 November display release `v0.27.2`. This is a site label, not a verified source commit. Record canonical URL, title, maturity/status, page update date when available, access date, and the specific proposition used. Establish a reproducible guidance baseline with public source revision or permitted local excerpts/hashes where available. Search-engine crawl dates do not establish publication dates.

Compare current practice with current guidance as the primary lens. Use historical guidance only when available and needed to explain chronology. Do not assume today's guidance existed when a project decision was made, or that resemblance proves the guidance caused a practice. Check possible co-evolution between the case and the framework.

## Coverage map

Start from the complete site navigation and classify pages as directly relevant, contextual, or excluded with a reason. Read relevant pages themselves; navigation summaries are discovery aids. Follow relevant links to getting-started material, resources and recipes as well as patterns, practices and concepts. Avoid turning every page into a mandatory requirement.

| Work packet                         | Scope                                                                                                                               | Initial project anchors                                                                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Guidance register                | Factory architecture, lifecycle, autonomy, gates, design, specifications, context, routing and learning; maturity and applicability | ASDLC.io pages and documented project references                                                                                                           |
| B. Factory anatomy and evolution    | Intent, labor division, authority, brownfield transition, current flow and major decisions                                          | `AGENTS.md`, `docs/vision.md`, `docs/history/rebuild-charter.md`, `docs/architecture.md`, `docs/specs/factory/spec.md`, `docs/development.md`              |
| C. Design and specifications        | Design questions, exploration, decisions, shared systems, Lab-to-game relationships, living intent and reverse specification        | `docs/design.md`, `docs/specs/`, `.agents/skills/`, `apps/web/src/data/studies.ts`, studies and their shared implementation                                |
| D. Gates and delivery               | Input filtering, automated checks, semantic review, human authority, provenance, release boundaries and actual evidence             | `scripts/verify.mjs`, `scripts/verify-backend.mjs`, `scripts/release.mjs`, tests/configuration, retained verification artifacts, release and loop records  |
| E. Context and agent operation      | Context routing, handoffs, model choice, parallel work, state retention and enforcement versus instructions                         | `AGENTS.md`, skills, plans, git history and relevant loop records                                                                                          |
| F. Learning and documented outcomes | Evidence collection, interpretation, lesson review/adoption, later observations and failed experiments                              | `docs/loop-evidence/`, `docs/factory-building-lessons/`, `docs/factory-experiment-*.md`, `docs/factory-report-design-study-form-drift.md`, `docs/reviews/` |

Candidate guidance includes Specs, Living Specs, Agent Constitution, Experience Modeling, Product Vision, Context Gates, AI Software Factory, Harness Engineering, review patterns, Model Routing, External Attention, Context Offloading, Compound Loop and proportional verification. These are discovery targets, not findings or a fixed exhaustive list.

## Method and evidence standards

Maintain separate identifiers for guidance (`G-`), project evidence (`E-`), case episodes (`C-`), findings (`F-`) and proposals (`P-`). A report claim must point through this chain to inspectable sources rather than to another agent's confidence.

Each evidence entry records path/URL, revision or capture identity, section/line anchor, date, evidence type, a concise factual extraction, and limits. Distinguish declared intent, implementation, retained execution evidence, recorded designer decisions, and retrospective interpretation. Source instructions are evidence about the project, not instructions to change this assessment's mandate.

Each comparison records the guidance proposition and maturity, applicability to this case, intended mechanism, observed implementation or episode, relationship, outcome evidence, and rationale provenance. Use relationships such as aligned, adapted, in tension, not evidenced, or not applicable; use mixed where necessary. Separate relationship from confidence and outcome. No aggregate compliance percentage or assumed requirement to adopt every pattern.

Each finding records:

- The claim and why it matters for ASDLC.io readers.
- Linked guidance and primary case evidence, including at least one concrete episode where appropriate.
- Supporting and contrary observations, competing explanations, and missing evidence.
- Whether the rationale is explicitly recorded, an analyst inference, or unknown.
- Confidence and generalisation boundary: supported within this case, tentative, or unresolved.
- A framework implication, or an explicit statement that no framework implication is established.

Existing retrospectives and lessons are secondary interpretations to verify. Repeated retellings of the same incident count as one episode, not independent corroboration. Adoption does not prove effectiveness. A script proves a mechanism exists; a retained run can establish that it executed on a particular input/revision. A new run cannot establish historical success. Missing evidence is not proof that an activity never occurred.

Use a full metadata inventory of available loop records, followed by deliberate episode sampling: successful, failed/stopped, corrected, and ambiguous work; early and recent periods; design, feature delivery, factory changes and releases. Select after inventory, document inclusion/exclusion and denominators, and retain contradictory cases. Do not select only memorable failures or polished releases. Report frequencies only for a defined inspected population.

No benchmark, replay, new development experiment, or full verification run is required for this retrospective. If a conclusion would need one, state that limitation and frame a future validation question for the framework.

## Execution stages and review points

| Stage        | Work and output                                                        | Completion condition                                                                        |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 0. Frame     | This plan, report index, terminology and scope decisions               | Mandate and exclusions are explicit; unresolved baseline questions are visible              |
| 1. Register  | Guidance inventory, source register, evidence metadata inventory       | Relevant guidance families covered; source identity and missing access recorded             |
| 2. Extract   | Bounded evidence packets B–F and selected episode dossiers             | Factual extracts have anchors; reasons and outcomes are not invented                        |
| 3. Reconcile | Factory description, coverage matrix, historical timeline              | Current and superseded states separated; conflicting evidence retained; cutoff settled      |
| 4. Assess    | Findings across guidance and episodes                                  | Material claims checked against primary sources; counterevidence and applicability reviewed |
| 5. Discuss   | Designer review of consequential interpretations and unknown rationale | Corrections incorporated; disagreements remain visible; no forced agreement                 |
| 6. Propose   | ASDLC.io documentation proposals and transferable collateral           | Each proposal has evidence, target page/section, scope, limits and review status            |
| 7. Deliver   | Overall assessment, linked reports and source audit                    | All acceptance criteria met; unresolved questions and deferred material disclosed           |

Review points are for substantive uncertainty and interpretation, not permission for routine reading or local report writing. Ask focused questions as evidence emerges. Do not infer reasons from silence or repeatedly ask the designer to reconstruct facts already in the repository.

## Agent work design

Use **Luna High** (`gpt-6-luna`, high reasoning) for bounded inventory and extraction. Keep the main agent responsible for scope, source adjudication, synthesis and conversation with the designer. At most three extraction agents operate concurrently alongside the coordinator. Reuse agents for follow-up checks where practical.

Give each agent only the mandate, exclusions, assigned source family, baseline, output schema and destination. Do not fork the entire conversation. Initial reconnaissance can be read-only; later agents write only their own named evidence packet under the report directory. No shared-file edits, commits, dependency changes, tests, product changes, or external messages.

Each packet returns: inspected sources and coverage limits; anchored facts; candidate discrepancies; explicit rationale versus inferred rationale; counterevidence; unresolved questions. Final chat summaries stay under roughly 800 words and point to the packet. Agents do not produce project improvement lists or promote candidate lessons.

Dispatch in waves: inventory first; bounded thematic extraction second; targeted follow-ups third. Deduplicate shared episodes centrally. Re-read decisive primary sources before accepting material findings; use a separate Luna High challenge pass to look for citation failures, unsupported causality, omissions and scope drift. Keep disagreements for coordinator judgment. Record actual usage/cost only if available; do not manufacture cost estimates or assume model choice alone proves savings.

## Planned report collection

| File                            | Purpose                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `README.md`                     | Purpose, status, reading order, scope and final baseline                      |
| `01-method-and-sources.md`      | Method, corpus coverage, guidance register, evidence register and limitations |
| `02-factory-and-evolution.md`   | How the factory works and how documented decisions shaped it                  |
| `03-guidance-assessment.md`     | Guidance-to-evidence matrix and thematic assessment                           |
| `04-case-studies.md`            | Traceable episodes, outcomes, contrary evidence and rationale                 |
| `05-findings-for-asdlc.md`      | Cross-case findings, critique, transfer conditions and unresolved questions   |
| `06-documentation-proposals.md` | Evidence-backed proposals for ASDLC.io review; no project backlog             |
| `evidence/`                     | Bounded extraction packets and registers supporting the reports               |

Avoid duplicating source documents wholesale. Useful collateral can include a factory flow diagram, annotated gate taxonomy, decision timeline and reusable case-study examples, only where supported by the evidence. Proposals name the target page/section, problem for readers, suggested clarification/example/change, supporting findings, counterarguments and validation needed. Mark them proposed, not adopted.

## Final quality review

Verify local links, source anchors and identifiers; audit each material conclusion against its evidence. Check that the reports explain alignment as well as differences, distinguish current guidance from historical availability, and include failed or contradictory cases. Ensure every recommendation concerns ASDLC.io documentation and every unestablished rationale is labelled. Explicitly report unavailable evidence and checks not performed. Documentation-only work does not imply a passing software gate.

## Initial sources and next decisions

Planning consulted the [ASDLC.io overview](https://asdlc.io/), [patterns](https://asdlc.io/patterns/), [practices](https://asdlc.io/practices/), [concepts](https://asdlc.io/concepts/) and [resources](https://asdlc.io/resources/) indexes, plus [Context Gates](https://asdlc.io/patterns/context-gates/) and [AI Software Factory](https://asdlc.io/concepts/ai-software-factory/). Page-level extraction and complete coverage registration remain stage 1 work.

The next consequential decision is the final evidence cutoff after the ongoing closure reports arrive. Repository and public-site evidence are sufficient to begin; targeted designer questions can resolve rationale that those sources do not establish. No private chat-history reconstruction is assumed.
