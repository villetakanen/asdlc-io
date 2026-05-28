---
title: "Artifact Import"
longTitle: "Artifact Import: Crossing the Enterprise Perimeter"
description: "A pattern for crossing the enterprise perimeter with LLM-generated artifacts. Decouples the session (risk) from the artifact (value). Gives compliance teams something they already know how to review."
tags:
  - Enterprise Adoption
  - Compliance
  - Governance
  - Perimeter
status: "Experimental"
relatedIds:
  - patterns/context-gates
  - concepts/provenance
  - patterns/the-spec
  - patterns/adversarial-code-review
  - patterns/spec-reversing
  - patterns/model-routing
lastUpdated: 2026-05-27
references:
  - type: standard
    title: "EU AI Act — Regulation (EU) 2024/1689"
    author: "European Parliament"
    published: 2024-08-01
    annotation: "Risk-based compliance requirements for AI systems in regulated sectors. Legislative basis for the Approval Deadlock failure mode."
  - type: standard
    title: "Digital Operational Resilience Act (DORA) — Regulation (EU) 2022/2554"
    author: "European Parliament"
    published: 2022-12-01
    annotation: "ICT risk management requirements in financial services. Source of third-party access restrictions that produce Session Coupling."
  - type: website
    title: "AI Risk Management Framework (AI RMF 1.0)"
    author: "NIST"
    url: "https://airc.nist.gov/RMF"
    published: 2023-01-26
    accessed: 2026-05-27
    annotation: "Organizational trust boundary concepts that Artifact Import addresses at the architectural level."
---

## Definition

Enterprise AI governance is blocking the wrong thing. The debate is which models to approve. The right question is which artifacts to trust.

**An LLM session and the artifact it produces are separable.** The session carries risk: unapproved model, uncontrolled context, no internal audit trail. The artifact carries value: a spec, a schema, a design, a configuration. Most organizations treat them as the same thing. That is why the compliance conversation always collapses into blocking the API.

Artifact Import operationalizes the separation. Build externally using the best available model. Submit the artifact to the organization's existing audit process. Carry the certified artifact inside. The frontier session never touches internal data. The frontier capability does.

## The Problem: Three Failure Modes

Regulated enterprises operate under data sovereignty constraints — GDPR, HIPAA, DORA, sector-specific regulation — that prohibit external LLM APIs from accessing internal systems. This produces three distinct failure modes.

**Session Coupling.** The LLM session and its artifact are treated as a single untrusted unit. Because the session cannot be approved, the artifact is rejected by association. Frontier model capability is blocked even where no data exposure exists.

**The Approval Deadlock.** Compliance processes are built to approve static, inspectable assets: documents, configurations, packages. A live API connection to an external LLM has no equivalent review path. Approval timelines stretch to quarters. Work stops while the process tries to evaluate something it was never designed to evaluate.

**Capability Sacrifice.** To sidestep compliance, teams constrain all work to internally approved models. These models handle execution adequately. They handle complex architectural design poorly. The organization accepts inferior outcomes across all work to solve a perimeter problem that only affects a subset of it.

## The Solution

Decouple the capability used to generate an artifact from the perimeter that artifact must cross.

Build using frontier models against synthetic or non-sensitive inputs. Submit the artifact to the organization's existing review process. Carry the certified artifact inside. All subsequent work against internal data uses the internally approved model, executing within the spec the imported artifact defines.

The artifact is the unit of transfer. A spec, a schema, a prompt template, a pipeline configuration: these are inspectable, diffable, and auditable in isolation from the data they will later process. The frontier model contributes the design. The internal model executes it.

This is airport security. Two zones exist: the terminal, where anyone operates freely, and the secured side, where everything that enters has been screened. The checkpoint is not an obstacle. It is the architecture. Regulated enterprises already know how to run checkpoints. Artifact Import gives them something they already know how to inspect.

## Anatomy: Two Zones

**The Terminal (External Build Environment)**

The frontier model operates here. Inputs are synthetic or non-sensitive. Outputs are artifacts: structured, inspectable, portable. No internal data enters this zone. Model selection is unconstrained by compliance. Use the best available model. Optimize for design quality.

**The Checkpoint (Audit Process)**

The artifact crosses here. The organization's existing review processes apply. Compliance teams know how to review a document or a configuration file. They do not know how to review a live API session. Artifact Import makes the problem tractable by giving reviewers something they recognize.

**The Secured Side (Internal Execution Environment)**

The certified artifact lives here. Internal models iterate against it using internal data. Frontier capability is now inside the perimeter without the frontier session ever having had perimeter access.

## What Crosses the Perimeter

| Crosses freely | Never crosses |
|---|---|
| Specs and schemas | Customer or patient data |
| Prompt templates | Internal financial records |
| Pipeline configurations | PII |
| Synthetic fixtures | Production logs |
| Architectural decisions | Internal credentials |

The right column is the same for every regulated enterprise. The left column is where frontier capability lives.

## ASDLC Usage

Artifact Import extends [Context Gates](/patterns/context-gates) to the organizational trust boundary. The perimeter crossing is a hard Denial Gate. Artifacts that fail audit do not enter. This is the strictest gate in the taxonomy: binary, external, and irreversible until re-submitted.

The artifact most commonly imported is a [Spec](/patterns/the-spec). A well-authored spec carries the full reasoning of a frontier session in an inspectable, static form. Internal models execute against it without ever touching the external session that produced it.

The audit step at the checkpoint is structurally equivalent to an [Adversarial Code Review](/patterns/adversarial-code-review): a reviewer evaluates the artifact against behavioral and security contracts before it is certified for import.

[Spec Reversing](/patterns/spec-reversing) composes with Artifact Import: use a frontier model to reverse a spec from existing brownfield code, import the reversed spec, execute remediation internally. This makes Spec Reversing available to organizations that cannot use frontier models against internal systems directly.

[Model Routing](/patterns/model-routing) governs model assignment within a single trust boundary. Artifact Import addresses the case where no single trust boundary exists. The two patterns compose: once the artifact is inside, Model Routing governs which internal model handles which execution task.

Every import has [Provenance](/concepts/provenance). An artifact that crossed a review checkpoint has a traceable chain of custody. A session that ran against internal data without a checkpoint does not.

Related:
- [Context Gates](/patterns/context-gates) — Artifact Import extends gates to the organizational boundary
- [The Spec](/patterns/the-spec) — The artifact most commonly imported
- [Provenance](/concepts/provenance) — Chain of custody the import checkpoint establishes
- [Adversarial Code Review](/patterns/adversarial-code-review) — Structural equivalent of the audit step
- [Spec Reversing](/patterns/spec-reversing) — Composes with Artifact Import in brownfield contexts
- [Model Routing](/patterns/model-routing) — Governs execution once the artifact is inside
