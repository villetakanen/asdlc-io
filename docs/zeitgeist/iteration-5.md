# Iteration 5: Implementation First

**Status**: Planning
**Start Date**: 2025-11-27
**End Date**: TBD
**Theme**: From Manifesto to Field Manual

## The Assessment
Our current Alpha 4 draft is a strong **Manifesto**. It successfully establishes the philosophy of our methodology (L3 Autonomy, the "Fighter Jet" model, Regression to the Mean).

However, it is not yet a **Field Manual**. It tells the reader what to think, but it does not tell them what to type. To bridge the gap to adoption, we must move from abstract concepts to concrete engineering artifacts.

## The Strategy: "Implementation First"
While the long-term goal is to transform the Manifesto into a Field Manual, Iteration 5 is a **focused increment** to demonstrate this shift. We will not rewrite the entire book; instead, we will introduce the *concept* of Implementation Patterns through a specific, verifiable example.

Our goal is to prove that we can bridge the gap from abstract theory to concrete code, without overcommitting to a massive scope expansion. We are demonstrating the strategic pivot, not completing it.

## Goals
- [ ] Establish "Practices" topic for how-to and implementation guides.
- [ ] Create concrete engineering artifacts (templates, patterns, configs).
- [ ] Ensure every guide in "Practices" leads to a committable change in a reader's repository.
- [ ] **Terminology Cleanup**: Formally deprecate "Guardrails" in favor of "Context Gates" to align with "Cognitive Throttle".

## Planned PBIs

### PBI-0014: Core Implementation Patterns
*Carryover from PBI-0004, reimagined as implementation guides.*
- [ ] **Repository Mapping**: A guide on how to map a repository to the ASDLC, resulting in a `repository-map.yaml` or similar artifact.
- [ ] **AGENTS.md Specification**: The definitive guide to the `AGENTS.md` file, including a strict schema/template.

### PBI-0015: Design & UX Enhancements
- [ ] **Mobile Navigation**: Implement a hamburger menu for mobile devices to fix top navigation issues.
- [ ] **H2 Styling**: Update `.prose` H2 headers to include a `[chapter number]. //` prefix, where the chapter number is in brand colors, and the `//` is in a muted color.
- [ ] **Field Manual Rebranding**: Rename `/manuscript` route to `/fieldmanual` and update all UI references to "Field Manual".

### PBI-0016: Resources Section
- [ ] **Resources Topic**: Create a dedicated section for meta-resources (Design System, Printable Field Manual, etc.).
