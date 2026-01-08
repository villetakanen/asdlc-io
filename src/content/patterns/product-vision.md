---
title: "Product Vision"
description: "A structured vision document that transmits product taste and point-of-view to agents, preventing convergence toward generic outputs."
tags: ["Context Engineering", "Product Design", "Agent Alignment"]
relatedIds: ["patterns/agent-constitution", "patterns/the-spec", "concepts/context-engineering", "practices/product-vision-authoring", "practices/agents-md-spec", "practices/living-specs", "practices/agent-personas", "concepts/vibe-coding"]
status: "Draft"
lastUpdated: 2025-01-05
---

## Definition

A **Product Vision** is a structured artifact that captures the taste, personality, and point-of-view that makes a product *this product* rather than generic software. It transmits product intuition to agents who otherwise default to bland, safe, interchangeable outputs.

Traditional vision documents are written for humans—investors, executives, new hires. In ASDLC, the Product Vision is structured for agent consumption, providing the context needed to make opinionated decisions aligned with product identity.

## The Problem: Vibe Convergence

Agents trained on the entire internet converge toward the mean. Ask for a landing page, you get the same hero section everyone else gets. Ask for onboarding, you get the same three-step wizard. Ask for error copy, you get "Oops! Something went wrong."

This isn't a bug in the model. It's the model doing exactly what it's trained to do: produce the statistically average response. The average is safe. The average is forgettable.

**The symptoms:**

- Every feature spec reads like it was written for a different product
- UI suggestions feel "correct" but lifeless
- Copy has no voice—it could belong to any company
- Agents optimize for conventional patterns over product-appropriate patterns
- Design decisions lack opinion

The [Agent Constitution](/patterns/agent-constitution) tells agents *how to behave*. The [Spec](/patterns/the-spec) tells agents *what to build*. Neither tells agents *who we are*.

## The Solution: Structured Taste Transmission

The Product Vision bridges this gap by making product identity explicit and agent-consumable. Rather than hoping agents infer taste from scattered references, the vision provides a structured context packet that shapes output quality.

The key insight: **agents don't need complete documentation—they need curated opinions**. A Product Vision isn't comprehensive; it's opinionated. It tells agents which tradeoffs to make when specs are ambiguous.

## Anatomy

A Product Vision consists of five components, each serving a distinct purpose in shaping agent output.

### 1. The Actual Humans

Not "users" or "customers"—real people with context, constraints, and taste of their own. This gives agents a *person* to design for, not an abstraction.

When choosing between "simple onboarding wizard" and "power-user defaults with optional setup," agents need basis for judgment. Abstract personas don't provide this; descriptions of actual humans do.

### 2. Point of View

Opinions. Actual stances on tradeoffs that reasonable people might disagree with.

These aren't requirements—they're *taste*. They tell agents which direction to lean when specs are ambiguous:

- Dense information vs progressive disclosure
- Keyboard-first vs mouse-first
- Weird but memorable vs safe but forgettable
- Ship incomplete but useful vs complete but late

### 3. Taste References

Concrete examples of products that feel right, and products that don't. Agents can reference these patterns directly: "Make this feel more like Linear's approach to lists, less like Jira's."

References provide calibration. Instead of describing "clean" in abstract terms, point to products that embody it—and products that don't.

### 4. Voice and Language

How the product speaks. Not brand guidelines—actual examples of tone.

This includes:
- What we say vs what we don't say
- Error message patterns
- Formality level
- Personality markers (or deliberate lack thereof)

### 5. Decision Heuristics

When agents face ambiguous choices, what should they optimize for? These are tie-breakers—the rules that resolve conflicts between equally valid approaches.

## Placement in Context Hierarchy

Product Vision sits between the Constitution and the Specs:

| Tier | Artifact | Purpose |
|------|----------|---------|
| Constitution | `AGENTS.md` | How agents behave (rules, constraints) |
| **Vision** | `VISION.md` or inline | Who the product is (taste, voice, POV) |
| Specs | `/plans/*.md` | What to build (contracts, criteria) |
| Reference | `/docs/` | Full documentation, API specs, guides |

The Constitution shapes *behavior*. The Vision shapes *judgment*. The Specs shape *output*.

Not every project needs a separate `VISION.md`. For smaller products or early-stage teams, the vision can live as a preamble in `AGENTS.md`. For complex products with detailed voice guidelines and taste references, a separate file prevents crowding out operational context.

See [Product Vision Authoring](/practices/product-vision-authoring) for guidance on the inline vs. separate decision, templates, and maintenance practices.

## Anti-Patterns

### The Generic Vision

"User-centric design. Quality and reliability. Innovation and creativity."

This says nothing. Every company claims these values. A Product Vision without opinions is just corporate filler that agents will (correctly) ignore.

### The Aspirational Vision

Describing the product you wish you had, not the product you're building. If your vision says "minimal and focused" but your product has 47 settings screens, agents will be confused by the contradiction.

### The Ignored Vision

Creating the document once and never referencing it in specs or prompts. The artifact exists but agents never see it in context.

### The Aesthetic-Only Vision

All visual preferences, no product opinion. "We like blue and sans-serif fonts" isn't vision—it's a style guide. Vision captures *judgment*, not just *appearance*.

## Relationship to Other Patterns

**[Agent Constitution](/patterns/agent-constitution)** — The Constitution defines behavioral rules (what agents must/must not do). The Vision defines taste (what agents should prefer when rules don't dictate). Constitution is constraints; Vision is guidance.

**[The Spec](/patterns/the-spec)** — Specs define feature contracts. The Vision influences *how* those contracts are fulfilled. Specs reference Vision for design rationale: "Per VISION.md: 'Settings are failure; good defaults are success.'"

**[Context Engineering](/concepts/context-engineering)** — The Vision is a structured context asset. It follows Context Engineering principles: curated, opinionated, agent-optimized.

## Related Practices

**[Product Vision Authoring](/practices/product-vision-authoring)** — Step-by-step guide for creating and maintaining a Product Vision, including templates, inline vs. separate file decisions, and diagnostic guidance.

**[AGENTS.md Specification](/practices/agents-md-spec)** — Defines the file format for agent constitutions, including how to incorporate vision as a preamble or reference.

**[Living Specs](/practices/living-specs)** — Specs can reference vision for design rationale. The "same-commit rule" applies: if vision changes, affected specs should acknowledge the shift.

**[Agent Personas](/practices/agent-personas)** — Different personas may need different vision depth. A copywriting agent needs full voice guidance; a database migration agent needs minimal product context.

See also:
- [Agent Constitution](/patterns/agent-constitution) — Behavioral alignment pattern
- [The Spec](/patterns/the-spec) — Feature contract pattern
- [AGENTS.md Specification](/practices/agents-md-spec) — Constitution implementation practice
- [Vibe Coding](/concepts/vibe-coding) — The failure mode when neither vision nor specs constrain agent output
