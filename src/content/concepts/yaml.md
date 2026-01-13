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
lastUpdated: 2026-01-12
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

## YAML in ASDLC

### Spec Frontmatter

All ASDLC articles use YAML frontmatter for structured metadata:

```yaml
---
title: "Feature Name"
status: "Live"
lastUpdated: 2026-01-12
relatedIds:
  - patterns/the-spec
  - concepts/context-engineering
---
```

### AGENTS.md Configuration

The [AGENTS.md Specification](/practices/agents-md-spec) uses YAML for structured directives:

```yaml
# Project context
project:
  name: "asdlc-io"
  type: "astro-site"
  
# Agent constraints
constraints:
  - Never delete files without explicit instruction
  - Prefer composition over inheritance
```

### File Structure Specifications

YAML defines expected directory layouts and file patterns:

```yaml
src/
  content/
    concepts/: "*.md"
    patterns/: "*.md"
    practices/: "*.md"
  components/: "*.astro"
  styles/ds/: "*.css"
```

## ASDLC Usage

YAML serves as the **data structure specification language** in ASDLC, complementing:

- **[Gherkin](/concepts/gherkin)** — Specifies behavior (what happens)
- **YAML** — Specifies structure (what exists)
- **Mermaid** — Specifies process (how it flows)

Applied in:
- [The Spec](/patterns/the-spec) — Frontmatter and schema definitions
- [AGENTS.md Specification](/practices/agents-md-spec) — Agent configuration
- [Context Engineering](/concepts/context-engineering) — Structured context formats

## Anti-Patterns

| Anti-Pattern | Description | Failure Mode |
|--------------|-------------|--------------|
| **Indentation Errors** | Mixing tabs and spaces | Parse failures; silent data corruption |
| **Stringly Typed** | Using strings where structured types exist | No validation; runtime errors |
| **Implicit Types** | Relying on YAML's type inference | "no" becomes boolean false; unexpected behavior |
| **Deep Nesting** | Excessive hierarchy depth | Unreadable; difficult to navigate |
| **No Schema** | YAML without validation schema | Agents hallucinate invalid structures |

## Best Practices

1. **Explicit Types** — Use quotes for strings that look like other types: `version: "1.0"`
2. **Flat When Possible** — Prefer flat structures over deep nesting
3. **Comments** — Document non-obvious fields inline
4. **Schema Validation** — Pair YAML with JSON Schema or Zod for type safety
5. **Consistent Formatting** — Use tools like Prettier for consistent style
