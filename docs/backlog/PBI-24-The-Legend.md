# PBI-24: The Legend (Meta-Page)

> Status: Done


## Goal
Harden the meta-structure of the ASDLC Body of Knowledge by creating a "Legend & Taxonomy" page. This will serve as a single source of truth for what "Experimental" or "L3 Autonomy" means in the context of document headers, ensuring users trust the stability of the material they are reading.

## Context
We are moving from "Drafting" to "Refining." The core content exists, but the user experience of consuming it lacks signposting. This sprint focuses on Meta-Content—documentation about the documentation.

## Requirements
- **Target Artifact**: `content/resources/legend.md`
- **Role**: Technical Editor
- **Content**:
    - **Statuses**:
        - **Draft**: Internal only, subject to major rewrites.
        - **Proposed**: Open for community RFC, content is stable but consensus is pending.
        - **Live**: Ratified standard.
        - **Deprecated**: No longer recommended; replaced by newer patterns.
    - **Maturities**:
        - **Experimental**: Emerging pattern, high risk of change, "use at own risk."
        - **Standard**: Proven in production, stable API/Structure.
    - **Core Categories**:
        - **Concepts**: "The Why." Foundational theory and mental models.
        - **Patterns**: "The Structure." Architectural templates and relationships.
        - **Practices**: "The How." Concrete implementation guides and specs.
- **Style**: Clean, developer-facing (like MDN or Stripe docs).
- **Format**:
    - Use a table for the Status/Maturity definitions.
    - Provide a brief "How to read these docs" introduction.

## Implementation Plan
- [ ] Create `content/resources/legend.md` with the specified definitions and structure.

## Verification
- **File Existence**: Verify `content/resources/legend.md` exists.
- **Content Check**: Ensure all statuses, maturities, and categories are defined as requested.
- **Visual Check**: Verify the table renders correctly and the style is appropriate.
