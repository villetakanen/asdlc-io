---
title: "Spec Reversing"
description: "Using frontier models to derive specifications from existing code to bootstrap the Agentic SDLC in brownfield projects."
tags: ["Brownfield", "Specification", "Bootstrapping", "Context Engineering"]
status: "Experimental"
lastUpdated: 2026-02-04
relatedIds: ["patterns/the-spec", "concepts/context-engineering", "practices/feature-assembly"]
references: []
---

## The Void: Missing Truth

The Agentic SDLC relies on the **Spec** as the source of truth. However, most real-world projects are "brownfield"—they have code but no up-to-date documentation. This creates a "Void" where agents have no context to ground their work, leading to regression loops and hallucinated requirements.

Spec Reversing bridges this gap by treating the current codebase as the *de facto* truth—but only temporarily.

## The Pattern

Spec Reversing is a bootstrapping workflow. Instead of writing a spec from scratch, we use a frontier model (like Claude 3.5 Sonnet or GPT-4o) to "read" the code and "write" the missing spec.

The workflow follows this loop:

1.  **Select Scope**: Identify the specific file or component you are about to modify.
2.  **Reverse**: Feed the code to a frontier model in `Architect` or `Planning` mode.
    *   *Prompt*: "Reverse engineer a functional specification from this code. Capture the intent, logic, and edge cases."
3.  **Review**: A human (you) reviews the generated spec.
    *   *Critique*: "Is this actually what we want? Or just what the code currently does?"
    *   *Correct*: Fix any bugs in the *logic* (in the spec) before touching the code.
4.  **Commit**: Save this as a new Spec file (e.g., `specs/feature-name.md`).
5.  **Execute**: Now create your PBI based on this new Spec.

## When to Use

*   **Before a PBI**: Never start a PBI without a Spec. If one doesn't exist, reverse it first.
*   **Legacy Refactoring**: When touching "ancient" code that no one understands.
*   **Drift Detection**: When you suspect the current documentation is lying. Reverse the code and compare it to the old docs.

## Directives

*   **Don't Trust the Code Blindly**: The code might contain bugs. The reversed spec will document those bugs as features. It is your job during the **Review** phase to decide if those are intended.
*   **Keep it High-Level**: Don't just narrate the code ("variable x is assigned 5"). Describe the *behavior* ("The retry limit is set to 5").
*   **One File at a Time**: Don't try to reverse the entire repository. Reverse only the Spec you need for the Task at hand.

## Benefits

*   **Stops Context Amnesia**: Creates a permanent memory of how the system works.
*   **Enables Agent Autonomy**: Agents can now reason about the system *before* acting.
*   **Safe Refactoring**: You have a baseline "contract" to test against.
