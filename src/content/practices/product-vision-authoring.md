---
title: "Product Vision Authoring"
description: "How to create and maintain a Product Vision document that transmits taste to agents—inline in AGENTS.md or as a separate file."
tags: ["Context Engineering", "Product Design", "Documentation"]
relatedIds: ["patterns/product-vision", "practices/agents-md-spec", "practices/living-specs", "practices/agent-personas"]
status: "Draft"
lastUpdated: 2025-01-05
---

## Overview

This practice guides you through creating a [Product Vision](/patterns/product-vision) that prevents vibe convergence—the tendency of agents to produce generic, forgettable outputs. The goal is a document that transmits product taste effectively, whether inline in `AGENTS.md` or as a separate `VISION.md`.

## Prerequisites

Before authoring a Product Vision, you should have:

- A functioning [AGENTS.md](/practices/agents-md-spec) file
- Clarity on your target users (not personas—actual humans)
- At least 3-5 opinionated stances on product tradeoffs
- Examples of products that "feel right" and products that don't

## Inline vs Separate File

The first decision: does your vision belong in `AGENTS.md` or a separate file?

### When to Inline in AGENTS.md

Choose inline when:

- Vision fits in ~200-300 tokens
- Vision rarely changes (quarterly or less)
- All agents need the same level of vision context
- Team is small and vision is well-understood

**Inline format:**

```markdown
# AGENTS.md

## Product Vision

We're building a fast, keyboard-first task manager for developers 
who hate project management software. Think Linear meets Raycast.

**We value:** Speed over features. Opinions over options. 
Power users over onboarding wizards.

**We sound like:** Confident, terse, technical. No "Oops!" or "We're excited..."

## Tech Stack
...
```

This approach keeps vision in the same context load as behavioral rules, ensuring agents always see it.

### When to Extract to VISION.md

Extract to a separate file when:

- **Complexity:** Vision has multiple components (voice examples, taste references, detailed heuristics)
- **Size:** Vision exceeds ~500 tokens and crowds out operational context in AGENTS.md
- **Audience:** Different agents need different vision depth (UI agents need full voice guide; infrastructure agents need minimal context)
- **Maintenance:** Vision evolves on a different cadence than technical constraints

**Reference format in AGENTS.md:**

```markdown
# AGENTS.md

## Product Vision
See [VISION.md](./VISION.md) for full product identity, voice, and taste references.

**TL;DR:** Fast, opinionated task manager for developers. Linear meets Raycast.

## Tech Stack
...
```

The TL;DR ensures agents get core identity even when VISION.md isn't in context.

## Writing Each Component

A complete Product Vision has five components. Not all are required for inline versions—scale to your needs.

### 1. The Actual Humans

Describe real people, not abstract personas.

**Bad:**
```markdown
## Target Users
- Power users
- Enterprise customers
- Developer teams
```

**Good:**
```markdown
## Who We're Building For

Overworked creative directors at 15-person agencies who juggle 
12 clients simultaneously. They've used every tool. They're 
impatient with onboarding because they're not beginners. They 
work late, prefer dark interfaces, and will mass-adopt anything 
that saves them 20 minutes a day.

They hate: Enterprise software that treats them like idiots.
They love: Tools that feel like they were built by people like them.
```

The difference: agents can use the second version to make judgment calls. "Would this person want a wizard?" has a clear answer.

### 2. Point of View

State opinions that reasonable people might disagree with.

**Bad (generic values):**
```markdown
## Values
- User-centric design
- Quality and reliability
- Innovation
```

**Good (actual opinions):**
```markdown
## Our Point of View

- Dense information over progressive disclosure (our users aren't beginners)
- Keyboard-first, mouse-optional
- Dark mode is the default, not a toggle
- We'd rather be slightly weird than completely forgettable
- Features ship incomplete but useful, not complete but late
- Settings are failure; good defaults are success
```

Each bullet represents a tradeoff. Agents can use these to resolve ambiguity.

### 3. Taste References

Name specific products and what to take from them.

```markdown
## Taste References

**Study these:**
- Linear (density, keyboard navigation, visual restraint)
- Raycast (speed as personality, power-user focus)
- Things 3 (calm, opinionated defaults)
- Stripe's API docs (clarity, developer respect)

**Avoid these patterns:**
- Salesforce (cluttered, corporate, permission-drunk)
- Jira (complexity as feature)
- Any product with a "getting started" carousel
- Dashboards with 15 metrics and no hierarchy
```

Agents can literally reference these: "Make this feel more like Linear, less like Jira."

### 4. Voice and Language

Provide actual examples, not just descriptions.

```markdown
## Voice

Confident but not arrogant. Clear but not sterile.

**We say:**
- "Nope" (not "Unfortunately, that's not possible at this time")
- "This will delete everything. Sure?" (not "Are you sure you want to proceed?")
- "Saved" (not "Your changes have been successfully saved!")

**Error messages are human:**
- "Can't reach the server. Retrying..." (not "Error code 503")
- "That file's too big. Try under 10MB." (not "Upload failed: maximum file size exceeded")

**We don't say:**
- "We're excited to..." (we're software, we don't have feelings)
- "On your journey" (this is a tool, not a spiritual experience)
- "Oops!" (we're adults)
```

### 5. Decision Heuristics

Provide tie-breakers for ambiguous situations.

```markdown
## When In Doubt

1. Fewer features, better defaults
2. If it needs explanation, redesign it
3. Respect power users; don't punish them with beginner safety rails
4. Fast and slightly wrong beats slow and perfect
5. When torn between "conventional" and "opinionated," choose opinionated
```

## Diagnosing Vision Problems

Signs your vision isn't working:

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Copy "could belong to any product" | Missing or weak Voice section | Add specific examples of tone |
| UI suggestions feel generic | Missing Taste References | Add "study these / avoid these" products |
| Agents make wrong tradeoffs | Missing Point of View | Add explicit opinion stances |
| New team members produce inconsistent work | Vision not in context | Check AGENTS.md references VISION.md |
| You keep correcting "tone" in reviews | Voice section too abstract | Replace descriptions with examples |

## Maintenance

### Update Triggers

Review and update the vision when:

- Major product pivot or repositioning
- Target audience shift
- Brand refresh
- Accumulated drift (specs consistently ignore vision guidance)
- New team members report confusion about "what kind of product this is"

### Review Cadence

- **Inline vision:** Review when updating AGENTS.md (typically quarterly)
- **Separate VISION.md:** Quarterly review, or when symptoms appear

### Ownership

Product Vision should have a single owner (product lead, founder, or design lead). Committee-authored visions lose voice consistency.

## Integration with Specs

When writing specs, reference the vision for design rationale:

```markdown
# Feature: Notification Preferences

## Blueprint

### Context
Users need control over notification frequency without 
feeling like they're configuring a mail server.

### Vision Alignment
- Per VISION.md: "Settings are failure; good defaults are success"
- Ship with smart defaults, surface preferences only when users seek them
- No notification preferences wizard on first launch
```

This creates traceability: when someone asks "why don't we have granular notification controls?" the answer is documented.

## Template

### Inline Template (for AGENTS.md)

```markdown
## Product Vision

[One paragraph: what we're building and for whom]

**We value:** [3-5 tradeoff stances]

**We sound like:** [Tone description with 2-3 examples]

**Reference products:** [2-3 products that "feel right"]
```

### Full Template (for VISION.md)

```markdown
# Product Vision: [Product Name]

## Who We're Building For
[Describe actual humans, not personas. Context, constraints, 
what they hate, what they wish existed.]

## Our Point of View
- [Opinion about tradeoff]
- [Opinion about tradeoff]
- [What we value over what]

## Taste References

**These feel right:**
- [Product] — [what specifically]

**These feel wrong:**
- [Pattern] — [why]

## Voice

**We sound like:** [Description]

**We say:** [Examples]

**We don't say:** [Anti-examples]

## When In Doubt
1. [Heuristic]
2. [Heuristic]
```

## References

- [Product Vision](/patterns/product-vision) — The pattern this practice implements
- [AGENTS.md Specification](/practices/agents-md-spec) — How to structure the constitution file
- [Agent Personas](/practices/agent-personas) — Adjusting vision context per agent type
- [Living Specs](/practices/living-specs) — Referencing vision in feature specs
