# PBI-25: Collection Definitions (Index headers)

## Goal
Establish standard definitions for "Concepts", "Patterns", and "Practices" to be placed at the top of each collection index. This addresses the lack of clarity on the difference between these sections.

## Context
The report notes a lack of clarity on the difference between Concepts, Patterns, and Practices. We need standard definitions to place at the top of each collection index to guide users.

## Requirements
- **Target Artifact**: `content/meta/collection-definitions.md` (to be used as snippets/includes)
- **Role**: Information Architect
- **Content**:
    - **Concepts**: Theoretical foundations. These are immutable ideas (e.g., "Levels of Autonomy"). They explain the philosophy.
    - **Patterns**: Reusable architectural designs. These are solutions to common problems (e.g., "Supervisor Agent", "Context Gates"). They explain the topology.
    - **Practices**: Execution standards. These are specifications and recipes (e.g., "AGENTS.md Spec"). They explain the workflow.
- **Format**:
    - Three distinct H2 sections (one for each definition).
    - For each section, write a 2-3 sentence definition and a bullet list of "What belongs here."
    - Use the analogy of "Physics (Concepts) -> Engineering (Patterns) -> Construction (Practices)" if helpful.

## Implementation Plan
- [ ] Create `content/meta/collection-definitions.md` with the three H2 sections and definitions.

## Verification
- **File Existence**: Verify `content/meta/collection-definitions.md` exists.
- **Content Check**: Ensure all three definitions are present and follow the requested format.
