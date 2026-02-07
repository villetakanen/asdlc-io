# Source Analysis: Calm Coding — The Workflow That Makes Vibecoding Survivable

**Source URL:** https://oc2sf.com/blog/calm-coding-vibecoding-survivable.html  
**Author:** Jan (OC2SF)  
**Published:** February 2026  
**Accessed:** 2026-02-04  
**Type:** Industry Article

---

## Executive Summary

This article introduces **Calm Coding** as a governance framework for AI-assisted development, positioning it as the disciplined counterpart to "Vibecoding." The author treats AI agents as a specialized team requiring rigorous structural bounds.

**Key thesis:** *"Velocity without direction isn't speed. It's drift."*

---

## Industry Validation for ASDLC

This article provides strong external validation for several ASDLC patterns and concepts:

### 1. Adversarial Review Pattern ✓

The article explicitly advocates for "adversarial thinking" in research:

> **"Where am I wrong? What are the common gotchas? What's the latest research I should know?"**

This validates our [Adversarial Code Review](/patterns/adversarial-code-review) pattern and suggests extending it into the **research and planning phases**, not just code review.

### 2. Spec-Driven Development ✓

**"Step 1: Specs (The Written Contract)"** — The article mandates written specs before any code:

1. **Why** are we building this?
2. **What** is this, actually? (Demo vs. MVP vs. Production targets)
3. **Target scale** and hardware
4. **Previous iterations** (what failed?)
5. **Regulatory reality** (HIPAA, GDPR, SOC 2, etc.)

This directly validates [The Spec](/patterns/the-spec) pattern and provides a useful checklist structure.

### 3. Multi-Agent Coding Pattern ✓

> **Structure:** Don't use a monolithic prompt. Treat the AI as a team: **Architect, Reviewer, and Tester.**

This validates our multi-agent approach and provides explicit role separation:
- **Architect** — System design
- **Lead Coder** — Implementation
- **Reviewer** — Verification
- **Tester** — Validation

**Key insight:** *"The agent that wrote the code is compromised. It knows what it built. It'll rationalize."*

This perfectly articulates why [Adversarial Code Review](/patterns/adversarial-code-review) requires session separation.

### 4. The Hype-Man Problem

A new term worth considering:

> **The Hype-Man Problem:** The tendency of LLMs to validate even bad ideas. "LLMs enable people to make dumb decisions with high conviction."

This is the failure mode that adversarial review addresses.

---

## Compelling Language & Quotes

These phrases are quotable and could be incorporated into ASDLC content:

| Quote | Potential Use |
|-------|---------------|
| *"Velocity without direction isn't speed. It's drift."* | Vibe Coding article intro |
| *"The agent that wrote the code is compromised. It knows what it built. It'll rationalize."* | Adversarial Code Review rationale |
| *"Infrastructure without reproducible state isn't infrastructure. It's archaeology."* | DevOps/IaC content |
| *"You can't debug what was never designed."* | Spec-Driven Development rationale |
| *"The Hype-Man Problem"* | New concept for LLM validation bias |

---

## Workflow Stages (Calm Coding Framework)

| Step | Name | ASDLC Equivalent |
|------|------|------------------|
| 0 | Discovery | [Product Vision](/patterns/product-vision), [4D Framework](/concepts/4d-framework) |
| 1 | Specs | [The Spec](/patterns/the-spec), [Spec-Driven Development](/concepts/spec-driven-development) |
| 2 | Research (Adversarial) | [Adversarial Code Review](/patterns/adversarial-code-review) (extended to research) |
| 3 | Architecture | [Architecture Decision Records](/concepts/architecture-decision-record) |
| 4 | Multi-Agent Coding | [Model Routing](/patterns/model-routing), Multi-Agent patterns |
| 5 | Testing | [Context Gates](/patterns/context-gates), TDD |
| 6 | Deployment | Infrastructure governance (not yet covered) |

---

## Pattern Seeds: Missing Content

The article suggests patterns we don't yet have:

### 1. Feature Assembly Pattern (Step 4 expansion)

The article describes a specific **implementation sequence** that could become a pattern:

1. **API Contract** — Define interfaces first
2. **Test Data** — Generate fixtures
3. **Test Cases** — Write tests that must fail initially (TDD)
4. **Parallel FE/BE logic** — Implement against contracts
5. **Real Data** — Integrate last

This is a **Feature Assembly** or **Contract-First Implementation** pattern.

### 2. Infrastructure Governance Pattern (Step 6)

> **The Risk:** AI generates "reasonable-looking" Terraform that is insecure (e.g., public S3 buckets).

The article calls out specific review requirements:
- Manual review of every IAM policy
- Review all security group rules
- Audit environment variables

This could become an **Infrastructure Review** pattern or extension to Adversarial Code Review.

### 3. Discovery Gate Pattern (Step 0)

> **Indicator of Health:** Presence of `.md` files (Spec, Architecture, Decision log).

This suggests a **Discovery Gate** — a checkpoint before coding begins that verifies documentation exists.

---

## Tool Recommendations

| Tool | Use Case | Notes |
|------|----------|-------|
| **Perplexity** | Research & adversarial review | Recommended for finding gotchas |
| **Grok** | Architecture planning | Author claims it outperforms others for architecture |
| **Lean Canvas** | Discovery/problem definition | Business validation before coding |
| **Terraform** | Infrastructure as code | Requires careful review |

---

## References to Add

This source should be added to:

1. **[Vibe Coding](/concepts/vibe-coding)** — As industry validation of failure modes
2. **[Adversarial Code Review](/patterns/adversarial-code-review)** — As validation of the pattern
3. **[The Spec](/patterns/the-spec)** — As external validation of the "written contract" concept

**Proposed reference entry:**
```yaml
- type: "website"
  title: "Calm Coding: The Workflow That Makes Vibecoding Survivable"
  url: "https://oc2sf.com/blog/calm-coding-vibecoding-survivable.html"
  author: "Jan (OC2SF)"
  published: 2026-02-01
  accessed: 2026-02-04
  annotation: "Governance framework for AI-assisted development. Validates spec-first, adversarial review, and multi-agent patterns. Introduces 'The Hype-Man Problem' as a failure mode."
```

---

## Action Items

- [ ] Add reference to `vibe-coding.md`
- [ ] Add reference to `adversarial-code-review.md`
- [ ] Add reference to `the-spec.md`
- [ ] Consider new concept: "The Hype-Man Problem" (LLM validation bias)
- [ ] Consider new pattern: "Feature Assembly" (contract-first implementation sequence)
- [ ] Consider new pattern: "Infrastructure Review" (IaC governance extension)
- [ ] Consider new pattern: "Discovery Gate" (documentation checkpoint before coding)

---

## Raw Article Summary

### Complete Workflow

**Step 0: Discovery (The Load-Bearing Wall)**
- Test hypotheses before code using Lean Canvas
- Health indicator: presence of `.md` files
- AI's role: rapid feedback loops on user mockups

**Step 1: Specs (The Written Contract)**
- Five questions that must be answered in writing before code
- Why, What (scope), Scale, History, Regulatory requirements

**Step 2: Research (Adversarial Thinking)**
- Use research tools with adversarial prompts
- Find stale training data, scaling problems, common gotchas

**Step 3: Architecture (Before Code, Period)**
- Instruct AI to ask clarifying questions before drafting
- Critical: "Query me on anything that conflicts or needs a decision"

**Step 4: Multi-Agent Coding (The Junior Specialist Team)**
- Structure: Architect, Reviewer, Tester (not monolithic)
- Each agent owns specific scope but has full project context
- Sequence: API Contract → Test Data → Test Cases → FE/BE logic → Real Data

**Step 5: Testing (Avoiding Conflict of Interest)**
- Golden Rule: The agent that wrote the code does NOT run the tests
- TDD is almost free if the spec is locked

**Step 6: Deployment (Safeguarding Infrastructure)**
- AI generates "reasonable-looking" but insecure infrastructure
- Manual review of IAM policies, security groups, environment variables
- Infrastructure without reproducible state is "archaeology"
