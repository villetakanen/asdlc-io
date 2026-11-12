# Independent challenge: gates, authority and factory guidance

**Checked scope:** reports 02–06, focusing gate/authority claims, spec authority, counterevidence, references and mandate fit; primary repo sources `docs/development.md`, `docs/specs/factory/spec.md`, `scripts/release.mjs`; captured ASDLC pages The Spec, Getting Started, Agentic Double Diamond, Experience Modeling, Feature Assembly, Context Gates, Workflow as Code, Provenance, Living Specs, and Theory of LLM Constraints. No tests were run. The method/source register is still in progress, so this pass did not certify every E/G/C cross-reference or final local-link resolution. Findings below are actionable report edits, not project remediation.

## Findings

### CG-01 — Make publication permission explicitly procedural

**Target:** [02-factory-and-evolution.md](../02-factory-and-evolution.md), lines 64–65; [05-findings-for-asdlc.md](../05-findings-for-asdlc.md), F-03/F-04.

The report says “its authorization requirement is procedural at that function boundary.” This is directionally right but can suggest that `publishRelease` itself checks authority. `docs/development.md:174-183` requires explicit authorization before invocation. `scripts/release.mjs:215-245` validates artifact identity and deploys; the authorization appears only in a comment at line 220, with no authorization token/argument or other check. **Tighten to:** documentation and operating procedure require authorization before invoking the command; the script enforces bundle identity, not permission. This preserves the important distinction between gate/enforcement and authority.

### CG-02 — Include Experience Modeling’s existing change route as counterevidence

**Target:** [05-findings-for-asdlc.md](../05-findings-for-asdlc.md), F-02 lines 21–27; [06-documentation-proposals.md](../06-documentation-proposals.md), P-03 lines 36–42.

The text acknowledges a “separate model-change route” but still says Experience Modeling “under-describes how a new vocabulary is investigated and promoted.” The captured Live page is more specific than a read-only consumption boundary: its Context Gate diagram routes “DEFECT/REQUIREMENT SIGNAL” back to Experience Modeling; “Read-Only Enforcement” says agents may request a model change; it describes both hard isolation and same-repo hook/CODEOWNERS override; and “Relationship to Other Patterns” distinguishes the Experience Modeling persona from the Feature Developer. This does not supply the case’s design-inquiry method, but it is meaningful counterevidence to a broad claim that creation/promotion is absent. **Narrow the finding/proposal** to a worked example of inquiry evidence and approval criteria for changing the model, while explicitly crediting the existing feedback/change route. The report already has counterevidence about tokens, but this page-level counterevidence should be direct.

### CG-03 — Correct P-01’s Getting Started target heading

**Target:** [06-documentation-proposals.md](../06-documentation-proposals.md), P-01 line 7.

The cited Getting Started phrase “Spec becomes the primary source code” is under **“The Core Idea,”** not “How It Works?” The same phrase also occurs in Agentic Double Diamond’s “Definition.” Its Phase 3 says “Spec Writing IS Coding,” while current Live **The Spec** page’s “Spec-as-Source” section explicitly rejects the spec as sole source and says deterministic code remains source of truth for runtime logic. The textual tension is real and correctly identified in 03/F-07; adjust the citation target to Getting Started “The Core Idea” and retain the Double Diamond source for the repeated stronger phrasing.

### CG-04 — Scope the Provenance alignment claim to demonstrated dimensions

**Target:** [03-guidance-assessment.md](../03-guidance-assessment.md), Provenance row line 19; possibly 02 gate table.

“Strong explicit practice” can read as broad alignment with the Live Provenance concept. The inspected sources support explicit intent/rationale records in selected episodes and strong candidate/report/artifact identity in release flows. They do not establish every provenance mechanism described on the page—especially its “Identity & Tracking”/cryptographically isolated agent identity and granular attribution across each action. The row’s archival limits help but do not name this scope boundary. **Retain the positive finding but say “strong candidate and artifact provenance in selected release records; broader agent-identity provenance not established.”** This matches report 02’s careful claim-state table and avoids inferring from hashes to full chain of custody.

### CG-05 — Preserve requiredness nuance across gate layers

**Target:** [03-guidance-assessment.md](../03-guidance-assessment.md), Context Gates/Workflow row and Feature Assembly row; [05-findings-for-asdlc.md](../05-findings-for-asdlc.md), F-04/F-07.

The reports mostly handle this well: they distinguish deterministic gates, probabilistic review, human decisions, and say universal critic gating is unestablished. Keep that wording. The captured pages themselves vary: Getting Started gives a three-tier hierarchy before merge; Context Gates is labeled Experimental; Feature Assembly is Draft and calls Review Gate “Recommended,” Human Acceptance “Required,” then says “Never Skip Gates” and supplies target metrics. Detailed Living Specs and review practices make applicability proportional/conditional. Avoid summarizing these pages as one universal pipeline. In particular, make clear that critic PASS is not a human acceptance verdict or publication authorization; Workflow as Code’s sample commits/opens a PR on PASS, while Feature Assembly separately requires human acceptance. This is a guidance seam the findings can report without asserting a project defect.

## No material scope drift found

Reports 02–06 consistently frame proposals as ASDLC documentation work, state that they are not applied/adopted, and avoid assigning project remediation. Report 03 explicitly rejects a compliance score and distinguishes correspondence from effectiveness; reports 04–05 retain counterevidence and limits. Historical CI removal, quick/full verification, prepared/deployed/live distinctions, and the 0.5.6 timeout runner failure are supported by current development/spec/script text and the retained episode records already cited by the gates packet. Revisit cross-ID/link accuracy when `01-method-and-sources.md` is finalized; this packet does not treat its present absence as a defect because it is still being prepared.
