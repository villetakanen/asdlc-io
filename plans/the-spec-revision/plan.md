# Revision Plan: `patterns/the-spec.md`

> Review date: 2026-04-10
> Source: `src/content/patterns/the-spec.md`

## 1. Reference Audit

### 1.1 BROKEN: Martin Fowler "Living Documentation" (lines 10-14)

- **URL:** `https://martinfowler.com/bliki/LivingDocumentation.html`
- **Status:** 404 — page does not exist
- **Action:** Remove or replace. The concept of "Living Documentation" originates from Cyrille Martraire's book (*Living Documentation: Continuous Knowledge Sharing by Design*, 2019), not a Fowler bliki entry. Either cite Martraire or remove this reference entirely and rely on the Böckeler article which covers the same ground with more SDD-specific framing.

### 1.2 WRONG DATE: Martin Fowler Fragment (lines 22-28)

- **Frontmatter says:** `published: 2022-12-22`
- **Actual date:** 2026-01-08 (it's a January 2026 fragment)
- **Action:** Fix `published` field to `2026-01-08`.

### 1.3 WRONG DATE: Böckeler SDD-3-Tools article (lines 58-62)

- **Frontmatter says:** `published: 2025-01-21`
- **Actual date:** 15 October 2025
- **Action:** Fix `published` field to `2025-10-15`.

### 1.4 OK: Anthropic research (lines 36-41)

- Published 2025-12-02 ✓, authors match ✓

### 1.5 OK: Calm Coding (lines 43-48)

- Published ~2026-02-01 ✓ (actual: Feb 3, close enough for a blog post)

### 1.6 OK: Heeki Park (lines 50-55)

- Published 2026-03-01 ✓, author ✓

### 1.7 OK: Kent Beck LinkedIn (lines 29-34)

- Content matches characterization ✓

### 1.8 OK: Rasmus Widing PRP repo (lines 17-20)

- Not re-verified (GitHub repo), but reference structure is fine

---

## 2. Conceptual Issues

### 2.1 "spec-anchored" definition is conflated

**Current text (line 70-71):**
> "The Spec pattern adheres to a spec-anchored philosophy. The spec defines the architectural intent and boundaries, but deterministic code remains the ultimate source of truth for runtime logic."

**Problem:** This mixes two distinct ideas from Böckeler:
- **spec-anchored** = the spec is *kept alive* after the task is complete, used for ongoing evolution and maintenance
- **not spec-as-source** = code remains the runtime source of truth, not the spec

The current text uses "spec-anchored" to mean "not spec-as-source." These are related but not synonymous. Böckeler's maturity ladder is:

1. **spec-first** — write a spec, use it for one task, discard
2. **spec-anchored** — keep the spec as a living artifact across the feature's lifespan
3. **spec-as-source** — spec *is* the code; human never touches generated code

**Action:** Rewrite the Definition section to:
1. Clearly state the article advocates **spec-anchored** development (specs persist and evolve)
2. Separately state the anti-pattern concern about spec-as-source (MDD regression)
3. Use Böckeler's exact definitions with proper attribution

### 2.2 Living Specs / Double Diamond framing is missing

**Problem:** The article discusses "Iterative Spec Refinement" (section starting line 213) but frames it defensively — as a *response to Kent Beck's critique*. This undersells the core value proposition.

The Böckeler article frames living specs positively: "living, executable artifacts that evolve with the project. Specs become the shared source of truth." This is the **key differentiator** from traditional waterfall specs.

The double diamond model (Discover → Define → Develop → Deliver) has a natural inflection point: the second diamond (Develop/Deliver) is where implementation reveals unknowns. A spec-anchored approach *expects* this: the spec is a hypothesis that gets refined as the team learns.

**Action:**
1. Rename "Iterative Spec Refinement" section to something like **"Specs as Living Hypotheses"** or **"The Learning Loop"**
2. Lead with the *positive* framing: specs are designed to evolve. They capture what we learn.
3. Integrate Kent Beck's insight as *supporting evidence* rather than a critique to defend against. Beck's actual position is nuanced: "a specification should function as a hypothesis, not a verdict" and "Implementation doesn't invalidate a spec. Implementation completes it." This *aligns* with the ASDLC position.
4. Add a brief mention of the double diamond second phase: implementation is where learning happens, and the spec-anchored approach is built for this.

### 2.3 Kent Beck's position is mischaracterized

**Current text (line 213-214):**
> "Kent Beck critiques spec-driven approaches that assume 'you aren't going to learn anything during implementation.'"

**Problem:** This frames Beck as *opposing* spec-driven development. The fetched LinkedIn post shows a more nuanced position:
- A spec should be "a hypothesis, not a verdict"
- "Implementation doesn't invalidate a spec. Implementation completes it."
- The failure is in "spec maintenance or feedback discipline," not in having specs

Beck is actually arguing *for* living specs, not against specs. He's critiquing rigid/waterfall-style specs.

**Action:** Rewrite to use Beck as an *ally*, not a critic. His "hypothesis not verdict" framing perfectly supports the living spec concept.

### 2.4 The Unmesh Joshi quote attribution is vague (line 229)

> "Unmesh Joshi, via Martin Fowler"

**Action:** Either find the exact source (likely from the Fowler fragment or a Thoughtworks article) and cite it properly, or remove. "Via Martin Fowler" is not a proper citation.

---

## 3. Proposed Revision Outline

### Section-by-section changes:

1. **Definition** (lines 65-71)
   - Keep first paragraph (living documents)
   - Rewrite spec-anchored paragraph: clearly define the three SDD levels from Böckeler, state we advocate spec-anchored, and separately flag spec-as-source as anti-pattern
   - Add explicit connection to "living specs" terminology

2. **The Economy of Code** (lines 73-79)
   - No changes needed — this section is strong

3. **The Problem: Context Amnesia** (lines 81-97)
   - No changes needed

4. **State vs Delta** (lines 99-135)
   - No changes needed

5. **The Assembly Model** (lines 137-178)
   - No changes needed

6. **Anatomy** (lines 180-200)
   - No changes needed

7. **Relationship to Other Patterns** (lines 202-210)
   - No changes needed

8. **Iterative Spec Refinement** → rename to **"Specs as Living Hypotheses"** (lines 213-230)
   - Reframe from defensive to positive
   - Reposition Kent Beck as ally, not critic
   - Add double diamond second-phase framing
   - Fix or remove Unmesh Joshi quote attribution
   - Strengthen connection to Böckeler's "living, executable artifacts" framing

9. **Industry Validation** (lines 233-243)
   - No changes needed

10. **References frontmatter**
    - Remove broken Fowler LivingDocumentation reference (or replace with Martraire)
    - Fix Fowler Fragment published date: `2022-12-22` → `2026-01-08`
    - Fix Böckeler published date: `2025-01-21` → `2025-10-15`
    - Update Böckeler annotation to mention "living specs" framing

---

## 4. Priority Order

1. **Fix broken/wrong references** (mechanical, quick) — items 1.1, 1.2, 1.3
2. **Rewrite spec-anchored definition** (item 2.1) — conceptual clarity
3. **Reframe "Iterative Spec Refinement" section** (items 2.2, 2.3, 2.4) — biggest content improvement
4. **Run `pnpm check`** to verify no breakage
