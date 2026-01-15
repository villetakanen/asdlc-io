---
title: "Gherkin"
description: "A structured, domain-specific language using Given-When-Then syntax to define behavioral specifications that are both human-readable and machine-actionable."
tags:
  - Testing
  - Specification
  - BDD
  - Syntax
relatedIds:
  - concepts/behavior-driven-development
  - concepts/context-engineering
  - concepts/ooda-loop
  - concepts/mermaid
  - patterns/the-spec
  - patterns/context-gates
  - practices/living-specs
lastUpdated: 2026-01-13
status: "Live"
references:
  - type: "website"
    title: "Gherkin Reference"
    url: "https://cucumber.io/docs/gherkin/reference/"
    author: "Cucumber"
    accessed: 2026-01-12
    annotation: "Canonical documentation for Gherkin syntax and semantics."
  - type: "website"
    title: "Behavior Driven Development"
    url: "https://www.agilealliance.org/glossary/bdd/"
    author: "Agile Alliance"
    accessed: 2026-01-12
    annotation: "Industry-standard glossary covering BDD and Gherkin terminology."
---

## Definition

Gherkin is a structured, domain-specific language using Given-When-Then syntax to define behavioral specifications in plain text. While [Behavior-Driven Development](/concepts/behavior-driven-development) provides the methodology, Gherkin provides the concrete syntax.

Gherkin's effectiveness for LLM agents stems from its properties: human-readable without technical jargon, machine-parseable with predictable structure, and aligned between technical and non-technical stakeholders. Each keyword defines a phase of reasoning that prevents agents from conflating setup, action, and verification into an undifferentiated blob.

## The Given-When-Then Structure

Gherkin scenarios follow a consistent three-part structure:

```gherkin
Feature: User Authentication
  As a registered user
  I want to log into the system
  So that I can access my personalized dashboard

  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com"
    And the user has password "SecurePass123"
    When the user submits login credentials
    Then the user should be redirected to the dashboard
    And a session token should be created
```

## Keyword Semantics

| Keyword | Traditional BDD | Agentic Translation |
|---------|-----------------|---------------------|
| **Given** | Preconditions or initial state | Context setting, memory retrieval, environment setup |
| **When** | The trigger event or user action | Task execution, tool invocation, decision step |
| **Then** | The observable outcome | Verification criteria, alignment check, evidence-of-done |
| **And/But** | Additional conditions within a step | Logical constraints, secondary validation parameters |
| **Feature** | High-level description of functionality | Functional blueprint, overall agentic goal |
| **Background** | Steps common to all scenarios | Pre-test fixtures, global environment variables |

## ASDLC Usage

Gherkin isn't just a testing syntax—it's a **semantic constraint language** for agent behavior.

When an agent reads a Gherkin scenario:
- **Given** tells it what to assume (context setup)
- **When** tells it what action to take (execution scope)
- **Then** tells it what success looks like (verification criteria)

This partitioning prevents "context bleed" where agents conflate setup, action, and verification.

**In Specs:** The [Spec](/patterns/the-spec) Contract section uses Gherkin scenarios:

```markdown
## Contract

### Scenarios

#### Happy Path
Given a valid API key
When the user requests /api/notifications
Then the response returns within 100ms
And the payload contains the user's notifications
```

**Applied in:**
- [The Spec](/patterns/the-spec) — Contract section uses Gherkin scenarios
- [Context Gates](/patterns/context-gates) — Gherkin scenarios define gate verification criteria
- [Living Specs](/practices/living-specs) — Gherkin scenarios evolve with the feature

