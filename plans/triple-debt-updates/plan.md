# Plan: Triple Debt Model KB Integration

**Source:** [Content Review Report](../../docs/assessments/claude/2026-03-25-triple-debt-model.md)
**Paper:** [arXiv:2603.22106](https://arxiv.org/abs/2603.22106) — Margaret-Anne Storey
**Created:** 2026-03-25

## Sequencing Rationale

The Triple Debt Model touches 6+ existing KB nodes. To avoid breaking framework coherence, changes are sequenced so that:
1. The new concept article lands first (other articles can link to it)
2. Existing node updates are atomic — one article per change
3. Each change is independently shippable and does not create orphaned or broken cross-references
4. Further Reading entry lands last (it's the least coupled)

---

## Step 1: Create `concepts/triple-debt-model.md`

**Type:** New article (Concept, Archetype A)
**Status:** Experimental
**Scope:** Full Triple Debt Model framework — three debt types, three system layers, interaction dynamics, Cognitive Surrender, diagnostic indicators, ASDLC mapping.
**Draft stub:** See assessment report Section E.
**Dependencies:** None — this is the anchor node.
**Cross-refs to add:** vibe-coding, provenance, ai-amplification, context-engineering, spec-driven-development, the-spec, the-adr, agent-constitution, context-offloading
**Verification:** `pnpm check` + `pnpm lint`. Confirm article appears on `/concepts/` index.

- [ ] Write full article content
- [ ] Validate frontmatter against `articleSchema`
- [ ] Ship

---

## Step 2: Update `concepts/vibe-coding.md`

**Type:** Amend existing article
**Scope:**
- Add Cognitive Surrender (Shaw & Nave 2026) as the psychological mechanism behind vibe coding's failure modes. Place after "Regression to the Mean" section or integrate into "The Failure Modes" introduction.
- Add Triple Debt Model reference: frame vibe coding as the primary generator of all three debt types.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Storey paper + Shaw & Nave paper to `references`.
**Dependencies:** Step 1 (link target must exist).
**Risk:** This is a high-traffic article. Keep edits surgical — add, don't restructure.

- [ ] Add Cognitive Surrender section/paragraph
- [ ] Add relatedId + references
- [ ] Ship

---

## Step 3: Update `concepts/provenance.md`

**Type:** Amend existing article
**Scope:**
- Add a short section distinguishing Provenance (traceability/audit chain) from Intent Debt (completeness of captured rationale). Provenance is one enforcement mechanism for reducing Intent Debt, not the full picture.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Storey paper to `references`.
**Dependencies:** Step 1.
**Risk:** Low. Additive only — no existing content removed.

- [ ] Add "Provenance and Intent Debt" distinction
- [ ] Add relatedId + reference
- [ ] Ship

---

## Step 4: Update `concepts/ai-amplification.md`

**Type:** Amend existing article
**Scope:**
- Integrate Storey's precise formulation into "The Mechanism" section: AI may reduce Technical Debt while simultaneously accelerating Cognitive and Intent Debt. This is a more granular version of the existing "Bad Process + AI = Exponential Technical Debt" framing.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Storey paper to `references`.
**Dependencies:** Step 1.
**Risk:** Low. Strengthens existing thesis, doesn't change direction.

- [ ] Add Triple Debt formulation to "The Mechanism"
- [ ] Add relatedId + reference
- [ ] Ship

---

## Step 5: Update `concepts/context-engineering.md`

**Type:** Amend existing article
**Scope:**
- Add a note that "context debt" (emerging practitioner term) is a symptom of Intent Debt per Storey's taxonomy. Natural placement: near the Cold Start Problem section.
- Add "Resist the automation of understanding" caveat: generating documentation without building genuine understanding substitutes the appearance of comprehension for the real thing. Natural placement: near "The Learned Context Management Fallacy" or as a new subsection.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Storey paper to `references`.
**Dependencies:** Step 1.
**Risk:** Medium. This article is long and densely cross-referenced. Keep additions concise.

- [ ] Add "context debt" note
- [ ] Add "Resist the automation of understanding" caveat
- [ ] Add relatedId + reference
- [ ] Ship

---

## Step 6: Update `practices/context-offloading.md`

**Type:** Amend existing article
**Scope:**
- Add a note or section distinguishing healthy Cognitive Offloading (strategic tool delegation — what this practice describes) from pathological Cognitive Surrender (bypassing reasoning entirely — the anti-pattern). This gives the practice article its "anti-pattern" dimension.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Shaw & Nave 2026 to `references`.
**Dependencies:** Step 1.
**Risk:** Low. Read the article first — confirm current structure before deciding placement.

- [ ] Add Offloading vs. Surrender distinction
- [ ] Add relatedId + reference
- [ ] Ship

---

## Step 7: Update `patterns/the-spec.md`

**Type:** Amend existing article
**Scope:**
- In the "Context Amnesia" section, add a sentence positioning The Spec as the primary structural mitigation for Intent Debt (Storey 2026). Do NOT replace the existing framing — augment it.
- Add `concepts/triple-debt-model` to `relatedIds`.
- Add Storey paper to `references`.
**Dependencies:** Step 1.
**Risk:** Medium. Core pattern article — keep edits minimal and additive.

- [ ] Add Intent Debt framing to Context Amnesia section
- [ ] Add relatedId + reference
- [ ] Ship

---

## Step 8: Add Further Reading entry

**Type:** Amend `src/pages/resources/further-reading.astro`
**Scope:**
- Add a feed entry for the Storey paper noting:
  - The Triple Debt Model as a unifying diagnostic framework
  - Academic pedigree (reviewed by Kent Beck, Adam Tornhill, Mary Shaw)
  - Alignment with ASDLC's spec-driven, intent-first methodology
**Dependencies:** Steps 1-7 (all KB updates should land first so links are valid).
**Risk:** Low. Additive only.

- [ ] Add feed entry
- [ ] Ship

---

## Step 9: Bidirectional link audit

**Type:** Verification pass
**Scope:** Confirm all `relatedIds` added in Steps 2-7 are bidirectional — the new `triple-debt-model.md` article must list all touched nodes, and all touched nodes must list `concepts/triple-debt-model`.
**Dependencies:** All previous steps.

- [ ] Audit relatedIds bidirectionality
- [ ] Fix any one-way links
- [ ] Final `pnpm check` + `pnpm lint`
- [ ] Ship

---

## Out of Scope (Future Work)

- **Constitution-spec-plan-task hierarchy mapping** — The user requested considering how the Triple Debt Model maps to the ASDLC artifact hierarchy. This is covered in the concept article's ASDLC Usage section, but a deeper structural integration (e.g., updating the Agentic Double Diamond or creating a new pattern) is deferred pending review of the concept article.
- **Standalone `concepts/cognitive-surrender.md`** — If the Cognitive Surrender concept proves to have enough independent weight after integration, it may warrant its own disambiguation article. Deferred.
- **`concepts/intent-debt.md` redirect** — If "Intent Debt" becomes a high-traffic search term independently, consider a thin concept article that redirects to the Triple Debt Model. Deferred.
