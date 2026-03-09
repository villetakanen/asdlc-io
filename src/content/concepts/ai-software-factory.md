---
title: "AI Software Factory"
description: "An industrial-scale approach to software engineering. Explores the dichotomy between Safe ASDLC Factories (L3) and high-risk Dark Factories (L4)."
tags:
  - Architecture
  - Industrialization
  - SDLC
  - Factory
relatedIds:
  - concepts/agentic-sdlc
  - concepts/levels-of-autonomy
  - patterns/agent-optimization-loop
  - concepts/digital-twins
  - concepts/spec-driven-development
  - concepts/provenance
status: "Experimental"
lastUpdated: 2026-03-09
references:
  - type: "website"
    title: "Built by agents, tested by agents, trusted by whom?"
    url: "https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/"
    author: "Eran Kahana"
    published: 2026-02-08
    accessed: 2026-03-09
    annotation: "Legal and regulatory analysis of the governance gaps inherent in Dark Factory non-interactive development models."
  - type: "website"
    title: "How StrongDM’s AI team build serious software without even looking at the code"
    url: "https://simonwillison.net/2026/Feb/7/software-factory/"
    author: "Simon Willison"
    published: 2026-02-07
    accessed: 2026-03-09
    annotation: "Provides a practical example of a 'Dark Factory' leveraging specs, holdout scenarios, and digital twins."
  - type: "website"
    title: "Software Factories and the Agentic Moment"
    url: "https://factory.strongdm.ai/"
    author: "StrongDM"
    published: 2026-02-06
    accessed: 2026-03-09
    annotation: "Original source material detailing non-interactive development driven by scenarios and agentic loops."
---

## Definition
The **Software Factory** is a concept inherited from DevOps and manufacturing that models software development as an industrial assembly line rather than a bespoke craft. 

In the agentic era, an **AI Software Factory** uses autonomous agents to automate the "run the business" toil (technical debt, dependency updates, bug fixes, operational overhead). By industrializing these tasks, human capital is shifted toward high-level creative architecture, problem-solving, and system design.

## The Dichotomy: L3 vs L4 Factories

As organizations attempt to eliminate human bottlenecks, two distinct operational modes have emerged:

### 1. The Safe Factory (The ASDLC Model)
This model operates at [Level 3 (Conditional) Autonomy](/concepts/levels-of-autonomy). Agents act as the high-throughput generation engine on the assembly line, but humans retain the ultimate verification controls. 

Driven by rigorous [Spec-Anchored Development](/concepts/spec-driven-development), human engineers define the architecture and act as the final **Acceptance Gate**. Crucially, the human elevates from *Code Auditor* to *Change Owner*. By relying on automated Quality Gates and agentic Review Gates for line-by-line syntax and specification checks, the human focuses PR reviews on the structural footprint ("what files changed?") and strategic fitness ("does this solve the problem safely?"). They approve state transitions and maintain complete [Provenance](/concepts/provenance) over what enters production without becoming a bottleneck.

### 2. The Dark Factory (L4 Model)
In this model, "Code must not be written by humans. Code must not be reviewed by humans." The lights are out because nobody needs to see.

Because deterministic human code review is eliminated entirely, Dark Factories must substitute it with **Probabilistic Satisfaction**. Quality is measured empirically: *Of all the observed trajectories through thousands of holdout test scenarios, what fraction satisfy the user?* 

To achieve this testing scale without exhausting API rate limits or incurring massive vendor costs, Dark Factories utilize [Digital Twins](/concepts/digital-twins)—high-fidelity, in-memory clones of required third-party services (e.g., Slack, Stripe, Jira).

## ASDLC Position & Governance Risks

ASDLC standardizes heavily around the **L3 Safe Factory**. We consider the L4 Dark Factory to be an experimental, high-risk frontier that introduces unpriced regulatory exposure.

While the technical hurdles of eliminating human review are actively being solved by Digital Twins and multi-agent synthesis, taking humans out of the code review loop entirely introduces severe **Governance Risks**:

1. **Silent Drift**: Without constant file-level human intervention, the codebase functions technically against its tests but gradually deteriorates into an unmaintainable architectural state over months.
2. **The Liability Gap**: If a silently agent-deployed module fails, it is legally unclear who is liable: the architects who wrote the spec, or the AI provider who supplied the base model?
3. **The Disclosure Gap**: Currently, no industry standard exists for auditing "agent-built software tested probabilistically against replicas." Disclosing this to enterprise procurement officers is practically useless without a shared evaluation framework.
4. **The Contractual Gap**: Vendors operating Dark Factories often still use "AS IS" limitation-of-liability boilerplate. A contract designed to disclaim *human imperfection* is inappropriately absorbing the risk of the *complete absence* of a human process, destroying trust.
