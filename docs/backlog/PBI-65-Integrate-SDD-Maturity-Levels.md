# PBI-65: Integrate SDD Maturity Levels and Validation

## 1. Directive
Synthesize the recent practitioner insights on Spec-Driven Development (SDD) into the core ASDLC Knowledge Base. Specifically, integrate the "Levels of SDD" maturity model (spec-first, spec-anchored, spec-as-source) and reinforce the ASDLC stance that `spec-anchored` is the ideal state, while `spec-as-source` risks a regression into the inflexibility and non-determinism of failed Model-Driven Development (MDD) paradigms. Additionally, create a new concept article outlining the history and failures of MDD to serve as a foundational warning.

## 2. Scope
- Update `src/content/concepts/spec-driven-development.md` to introduce the 3 maturity levels and warn against the `spec-as-source` anti-pattern.
- Update `src/content/patterns/the-spec.md` to clarify its alignment with `spec-anchored` methodology.
- Update `src/content/practices/living-specs.md` to adopt the new terminology.
- Create `src/content/concepts/model-driven-development.md` to document the history and failure modes of MDD.

## 3. Dependencies
None.

## 4. Changes Required

### A. Apply to `src/content/concepts/spec-driven-development.md`
- Add references in the frontmatter for:
  - Heeki Park: "Using spec-driven development with Claude Code" (Medium, Mar 2026)
  - Birgitta Böckeler: "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl" (Martin Fowler, Dec 2024/Jan 2025 depending on exact publication Date, will use current year for reference if exact is unknown)
- Add a section under "Key Characteristics" to define the **Levels of SDD Adoption**:
  1. `spec-first`: Written upfront, used for initial code generation, then abandoned.
  2. `spec-anchored`: The spec remains the source of truth for the lifecycle of the feature (*ASDLC Target*).
  3. `spec-as-source`: The spec is the only artifact edited, and code is 100% generated (*Anti-Pattern*).
- Under "Anti-Patterns", add a warning regarding the `spec-as-source` paradigm. Contrast it with the failed "Model-Driven Development" (MDD) of the past, highlighting that LLMs introduce non-determinism into code generation, making human oversight of the deterministic code necessary. Link to the new `model-driven-development.md` concept.

### B. Apply to `src/content/patterns/the-spec.md`
- Add references for Heeki Park and Birgitta Böckeler.
- In the definition or rationale, explicitly state that The Spec adheres to a `spec-anchored` philosophy rather than a pure `spec-as-source` generator, preserving the agent control loop.

### C. Apply to `src/content/practices/living-specs.md`
- In the "Overview" or "Definition" section, clarify that the `Living Specs` practice is the active implementation of the `spec-anchored` level of maturity.
- Reinforce the vocabulary distinguishing the global constitutional context (`ARCHITECTURE.md`) from the feature-level functional specification (`/plans/*/spec.md`), as validated by broader industry models.

### D. Create `src/content/concepts/model-driven-development.md`
- **Definition:** Define MDD (and related terms like MDA - Model-Driven Architecture) as an early 2000s software engineering approach that attempted to make high-level visual or textual models the primary artifacts of development, with code generation tools attempting to handle 100% of the implementation.
- **Why it failed:** 
  - **Tooling inadequacy:** Expensive, proprietary, and poorly integrated tools that lacked debugging capabilities at the model level.
  - **Big Upfront Design (BUFD):** It entrenched rigid waterfall methodologies that clashed with the rise of Agile.
  - **The Abstraction Trap:** The models often had to become as complex as the code itself to handle edge cases ("shifting complexity rather than reducing it").
- **The LLM Renaissance (and Risk):** Explain how GenAI has removed the need for rigid parsers, sparking hope for "natural language MDD" (i.e., `spec-as-source`). However, this trades the inflexibility of MDD for the non-determinism of LLMs. 
- **ASDLC Stance:** We learn from MDD's failure by keeping specs as architectural intent (`spec-anchored`) but retaining **code as the deterministic source of truth for logic**.
- **References to include:** 
  - Mention the general consensus on MDD's failure to penetrate main-stream enterprise environments outside of very specific niches.
  - Reference Birgitta Böckeler’s article comparing SDD tracking toward MDD pitfalls.

## 5. Verification
- Verify all modified content files (`pnpm check` and `pnpm lint`).
- Ensure no broken links or schema validation failures occur.
- Verify the distinction between `spec-anchored` and `spec-as-source` is clear and unambiguous.
- Ensure the new MDD file renders correctly in the Docs UI.

## 6. Notes
- Reference reports: `docs/reports/content_review_report.md` and `docs/reports/content_review_report_sdd_3_tools.md`. 
- ASDLC holds a strong line on determinism. The `spec-as-source` warning is critical to preventing users from treating LLMs as magical compilers.

## 7. Blockers
None.
