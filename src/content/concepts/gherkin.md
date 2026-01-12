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
  - patterns/the-spec
  - patterns/context-gates
  - practices/living-specs
lastUpdated: 2026-01-12
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

## Why Gherkin Works for Agents

### Reasoning Space Partitioning

Each keyword defines a phase of reasoning:
- **Given** constrains what the agent should assume
- **When** defines the specific action to take
- **Then** defines what success looks like

This maps directly to the [OODA Loop](/concepts/ooda-loop): Given=Observe context, When=Act, Then=Observe outcome.

### What vs How Separation

Gherkin specifies *what* behavior is expected without dictating *how* to implement it. This allows agents to interpret intent dynamically, select appropriate tools, and adapt implementation to context.

### The Right Level of Abstraction

Gherkin steps should be specific enough to verify but abstract enough to allow agent interpretation:

| Too Specific (Brittle) | Too Vague (Unverifiable) | Right Level |
|------------------------|--------------------------|-------------|
| "Click the blue Submit button at coordinates (450, 320)" | "Do the thing" | "Submit the registration form" |
| "POST to /api/v2/users with JSON body {...}" | "Create user somehow" | "Create a new user account" |
| "Wait 3000ms then check element #success" | "Verify it worked" | "The operation should complete successfully" |

## Gherkin in ASDLC Specs

The [Spec](/patterns/the-spec) pattern uses Gherkin in the Contract section:

```markdown
## Contract

### Scenarios

#### Happy Path
Given a valid API key
When the user requests /api/notifications
Then the response returns within 100ms
And the payload contains the user's notifications

#### Rate Limiting
Given a user who has exceeded rate limits
When the user requests /api/notifications
Then the response returns 429 Too Many Requests
And the Retry-After header indicates wait time
```

This structure enables:
- **Agents** to understand acceptance criteria before implementation
- **Context Gates** to verify scenarios pass before promotion
- **Adversarial Review** to validate against documented behavior

## Best Practices for Agentic Gherkin

### Declarative Over Imperative

```gherkin
# Bad (imperative)
When I click the Login button
And I wait for the page to load
And I check the URL contains "/dashboard"

# Good (declarative)
When the user logs in
Then the user should see the dashboard
```

### Business Language Over Technical Language

```gherkin
# Bad (technical)
Given a user record exists in the PostgreSQL users table

# Good (business)
Given a registered user
```

### Scenario Outlines for Data Variations

```gherkin
Scenario Outline: Rate limiting by tier
  Given a user on the <tier> plan
  When the user makes <requests> requests per minute
  Then the response should be <status>

  Examples:
    | tier       | requests | status |
    | free       | 10       | 200    |
    | free       | 11       | 429    |
    | premium    | 100      | 200    |
    | premium    | 101      | 429    |
```

## ASDLC Usage

Gherkin isn't just a testing syntax—it's a **semantic constraint language** for agent behavior.

When an agent reads a Gherkin scenario:
- **Given** tells it what to assume (context setup)
- **When** tells it what action to take (execution scope)
- **Then** tells it what success looks like (verification criteria)

This partitioning prevents "context bleed" where agents conflate setup, action, and verification.

Applied in:
- [The Spec](/patterns/the-spec) — Contract section uses Gherkin scenarios
- [Context Gates](/patterns/context-gates) — Gherkin scenarios define gate verification criteria
- [Living Specs](/practices/living-specs) — Gherkin scenarios evolve with the feature

## Anti-Patterns

| Anti-Pattern | Description | Failure Mode |
|--------------|-------------|--------------|
| **Imperative Steps** | "Click X, type Y, wait Z" instead of declarative behavior | Brittle; breaks on UI changes; not agent-friendly |
| **Implementation Details** | "Call the createUser() method with params" | Couples scenarios to implementation |
| **Scenario Novels** | 50-step scenarios covering everything | Unreadable; unclear what's being verified |
| **Copy-Paste Scenarios** | Duplicating steps instead of using Background | Maintenance nightmare |
| **Testing the UI** | Scenarios that verify UI state, not business outcomes | Miss the point; break frequently |
