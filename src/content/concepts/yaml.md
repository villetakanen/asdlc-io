---
title: "YAML"
description: "A human-readable data serialization language that serves as the structured specification format for configuration, schemas, and file structures in agentic workflows."
tags:
  - Data
  - Configuration
  - Specification
  - Syntax
relatedIds:
  - concepts/gherkin
  - concepts/mermaid
  - concepts/context-engineering
  - patterns/the-spec
  - practices/agents-md-spec
lastUpdated: 2026-01-13
status: "Live"
references:
  - type: "website"
    title: "YAML Specification"
    url: "https://yaml.org/spec/1.2.2/"
    author: "YAML Language Development Team"
    accessed: 2026-01-12
    annotation: "Official YAML 1.2.2 specification defining syntax and semantics."
---

## Definition

YAML (YAML Ain't Markup Language) is a human-readable data serialization language designed for configuration files, data exchange, and structured documentation. In agentic development, YAML serves as the specification language for data structures, schemas, and file organization.

Where [Gherkin](/concepts/gherkin) specifies *behavior* (Given-When-Then), YAML specifies *structure* (keys, values, hierarchies). Both are human-readable formats that bridge the gap between human intent and machine execution.

## Key Characteristics

### Human-Readable Structure

YAML's indentation-based syntax mirrors how humans naturally organize hierarchical information:

```yaml
notification:
  channels:
    - websocket
    - email
    - sms
  constraints:
    latency_ms: 100
    retry_count: 3
  fallback:
    enabled: true
    order: [websocket, email, sms]
```

### Schema-First Design

YAML enables schema-first development where data structures are defined before implementation:

```yaml
# Schema definition in spec
user:
  id: string (UUID)
  email: string (email format)
  roles: array of enum [admin, user, guest]
  created_at: datetime (ISO 8601)
```

Agents can validate implementations against these schemas, catching type mismatches and missing fields before runtime.

### Configuration as Code

YAML configurations live in version control alongside code, enabling:
- **Diff visibility** — Configuration changes appear in PRs
- **Review process** — Same rigor as code changes
- **History tracking** — Git blame shows who changed what and when

## ASDLC Usage

YAML serves as the **data structure specification language** in ASDLC, completing the specification triad:

- **[Gherkin](/concepts/gherkin)** — Specifies behavior (what happens)
- **YAML** — Specifies structure (what exists)
- **[Mermaid](/concepts/mermaid)** — Specifies process (how it flows)

**In Specs:** All ASDLC articles use YAML frontmatter for structured metadata. The [Spec](/patterns/the-spec) pattern leverages YAML for schema definitions that agents validate against.

**In AGENTS.md:** The [AGENTS.md Specification](/practices/agents-md-spec) uses YAML for structured directives—project context, constraints, and preferred patterns.

**Applied in:**
- [The Spec](/patterns/the-spec) — Frontmatter and schema definitions
- [AGENTS.md Specification](/practices/agents-md-spec) — Agent configuration
- [Context Engineering](/concepts/context-engineering) — Structured context formats

