# Method, source register and limits

## Research contract

This is a qualitative assessment of ASDLC.io through Void Drift as a test subject. It covers the current factory and documented evolution, explaining use, differences, known reasons and implications for framework documentation. The designer confirmed this scope on 12 November and then instructed completion. It excludes project improvement needs, project change proposals and external publication. Findings and documentation proposals remain analyst work for later substantive review.

The governing [plan](../../plans/2026-11-12-asdlc-assessment.md) separates evidence, interpretation, adoption and effectiveness. Its proposed in-process designer review was not treated as a requirement to solicit speculative explanations: unknown causes stay unknown, and substantive review remains available over the finished report. No designer endorsement of individual findings or proposals is claimed.

## Baselines and cutoff

**Project baseline:** `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4`, inspected on 12 November 2026. Agents read committed sources at this revision. The working tree contained the assessment's untracked plan/report material; no tracked source changes were observed at the baseline and pre-synthesis checks. The two 12 November closure records were already committed in this baseline. Their descriptions of earlier dirty working trees remain historical evidence, not current status.

For this completed edition, the coordinator uses that fixed revision as the evidence cutoff. The final status check is recorded in [validation](evidence/validation.md). Any later reports or changes belong to a possible addendum; this edition does not silently incorporate moving sources. This is an explicit research boundary under the instruction to complete the work, not a claim that all other chats have finished.

**Guidance baseline:** direct retrieval of public ASDLC.io pages on 12 November, with per-page UTC timestamps and HTML/text SHA-256 hashes in [guidance-capture.json](evidence/guidance-capture.json). Labelled direct captures showed `v0.27.2`. Cached web output for one resources index showed an older label; direct retrieval resolved that discrepancy for the captured edition. No deployed source revision was established. The observed public GitHub `main` revision was not assumed to identify deployed content.

Raw HTML/text captures remain temporary files under `/tmp/asdlc-assessment-corpus`; they are not durable attachments. Durable extracts, headings, URLs, dates and hashes are retained. Hashes permit a future reader to compare retrieved content, but cannot reconstruct a changed page by themselves. Exact historical guidance as read by the project on 28 October was not recovered. Comparisons use current captured guidance; historical influence claims require explicit project references.

## Coverage and selection

The later [KonMari postscript](07-postscript-test-retention.md) extends the semantic sample with five already-inventoried sources: both test-pruning skills, the browser-pruning closure and review, and the earlier pruning plan's recorded outcome. Their bytes match the original baseline. Counts below describe the original assessment's selection; the supplement is separately identified as E-K01–05, PS-F01 and PS-P01.

- **86 public URLs** captured from home, patterns, practices, concepts, resources, recipes and getting-started navigation: **47 directly read**, **30 contextual**, **6 navigation**, **3 excluded**. Every URL has a classification and reason in [guidance coverage](evidence/guidance-coverage.md). Contextual pages received navigation-level screening only; no article-level finding is inferred from that. The compendium is redundant aggregation, the site's visual identity is out of scope, and the external-reading feed is not the primary comparison corpus.
- **69 committed top-level loop records** inventoried by metadata in [loop-inventory.json](evidence/loop-inventory.json): file identity, dates from names, headings and available brief status fields. This is not a semantic assessment of all 69 records and is not a denominator for a success rate.
- **18 distinct top-level loop records** cited in the three thematic extraction packets, enumerated in [episode-selection.json](evidence/episode-selection.json), plus current contracts, code and selected historical reports/lessons. Packets overlap; their counts must not be added as independent observations.
- **245 committed files** in [repository-manifest.json](evidence/repository-manifest.json) supply a wider identity register for documentation, skills, scripts, outgoing drafts and selected implementation files. Manifest inclusion does not mean every file was read semantically.
- **Three existing run reports** were independently inspected for identity and outcome fields; [run-report-observations.json](evidence/run-report-observations.json) retains hashes and selected fields. Two are ignored local full-verification reports; one tracked report explicitly records partial verification. This is historical report inspection, not new execution or full log revalidation.

The sample deliberately includes early and recent material, successful/accepted, failed/stopped, inconclusive, corrected and unvalidated outcomes, plus releases and factory amendments. Cases C-01–10 combine related evidence where needed. It is purposive and skewed toward records with explicit outcomes and lessons, not random or exhaustive. This makes it useful for distinctions and counterexamples, unsuitable for project-wide rates or quantified effects. Unselected records remain unassessed rather than silently excluded as irrelevant.

## Guidance register

| IDs      | Packet                                                            | Role                                                                             |
| -------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| G-D01–19 | [Design and specs](evidence/guidance-design-and-specs.md)         | Durable intent, inquiry, experience systems, context artifacts and three recipes |
| G-G01–15 | [Gates and factory](evidence/guidance-gates-and-factory.md)       | Gate taxonomy, review, authority, workflow, provenance and proportionality       |
| G-C01–12 | [Context and learning](evidence/guidance-context-and-learning.md) | Learning, routing, offloading, skills, persistence, commits and content maturity |

Some IDs group related pages or overlap another packet. IDs identify propositions, not independent sources. Each packet supplies page URLs, relevant headings and caveats; the capture manifest supplies identity and dates. Live, Experimental, Draft, Proposed and Deprecated status are preserved where exposed. Sources cited by ASDLC.io were not independently evaluated; this report assesses the guidance, not the validity of every research claim it references.

## Project evidence register

| IDs                | Packet                                                   | Evidence and boundary                                                                 |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| E-D01–08           | [Design and context](evidence/design-and-context.md)     | Current declared design/context contracts and selected design episodes                |
| E-G01–05; C-G01–05 | [Gates and delivery](evidence/gates-and-delivery.md)     | Code mechanisms and historical runner/release episodes; C-G IDs belong to that packet |
| E-L01–10           | [Learning and history](evidence/learning-and-history.md) | Closure/lesson distinctions, sampled history, recent endpoints and influence limits   |
| E-R01–08           | [Coordinator checks](evidence/coordinator-checks.md)     | Primary-source rechecks, including authority versus executable enforcement            |
| C-01–10            | [Case studies](04-case-studies.md)                       | Narrative synthesis of related evidence; not new observations                         |
| F-01–08            | [Findings](05-findings-for-asdlc.md)                     | Analyst interpretations with counterevidence and confidence                           |
| P-01–09            | [Documentation proposals](06-documentation-proposals.md) | Proposed changes for framework-author review                                          |

The packet source paths/line spans refer to the baseline unless explicitly identified as local run artifacts. Historical episode records may refer to older or dirty revisions. Read the source using `git show <baseline>:<path>` when the checkout has moved. A path/section reference is a locator; a historical record reporting a test is not equivalent to retaining its executable trace.

## Reasoning and challenge procedure

Luna High (`gpt-6-luna`, high reasoning) handled three bounded project packets, two additional guidance packets and three challenge passes. The coordinator handled public corpus capture, additional guidance, primary-source spot checks, cross-packet reconciliation and report synthesis. Agents had separate output paths and fresh task context. This assessment workflow is disclosed for reproducibility; it is not retrospective evidence that model routing improved Void Drift. No cost telemetry or model comparison was available.

Claims distinguish declared intent, inspected implementation, recorded execution, attributed decisions and retrospective interpretation. Rationale is labelled recorded, inferred or unknown. Repeated accounts of the same event are deduplicated. Relationships are qualitative—aligned, adapted, in tension, not evidenced, or contextual—not a compliance score. Counterexamples and missing evidence remain visible.

Challenge passes examine fidelity to sources, chronology, causality and mandate. [Validation](evidence/validation.md) records their disposition and the report checks. Critics are additional probabilistic readers, not independent ground truth; coordinator review remains necessary.

## Limits and unresolved questions

The case is not independent of the framework's authorship context. The charter documents deliberate use of four named patterns, and public pages identify the same named author. No causal direction for particular later ideas, or evidence of a one-way transfer, follows. The earlier [unsent feedback draft](../../../outgoing/asdlc-feedback-void-drift.md) also explicitly limits its findings; it is historical collateral, not evidence of externally delivered feedback.

Runtime prompt composition, some transcripts, temporary captures and older detailed logs are unavailable or not retained. A documented rule may not have been loaded or applied. Retrospectives sometimes contain corrected interpretations. No controlled comparison, study replay, model benchmark, fresh product test, release, deployment or live-service verification was performed. No quantitative productivity, cost or safety conclusion is warranted.

Open research questions concern transfer to other domains, causal effectiveness of particular method changes, reliable assessment of whether an inquiry is answerable, and the minimum useful evidence for delegated interpretation. These are framework research questions, not requests to change or test Void Drift. People's playtesting was neither requested nor evaluated as part of this assessment.
