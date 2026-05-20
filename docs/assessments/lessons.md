# Assessor Long-Term Memory (Lessons Learned)

This document records crystallized heuristics and lessons learned from past content assessments, human-in-the-loop (HITL) pivots, and integration retrospectives. The assessor loads this file at the start of every assessment to avoid repeating past mistakes and ensure alignment with the latest scientific writing standards.

## Heuristics & Lessons

### 1. Proportional Gates & Scaffolding
- **Lesson:** Avoid pre-building comprehensive canonical scaffolding/validation rules ahead of concrete demand. Gates must earn their place by protecting against specific, named risks. Linters and type-checkers are low-cost baseline defaults; other checks (visual regression, security policies) should be added only when a concrete failure mode is identified.
- **Reference:** [Theory of LLM Constraints](/concepts/theory-of-llm-constraints) (2026-05-18)

### 2. Scientific Writing Parity
- **Lesson:** Every new concept article must be written in an objective, factual, academic tone. Avoid marketing hype, buzzwords, or anthropomorphic descriptions of agents. Clearly demarcate evidence levels (empirical vs. dialectical/conceptual) and state boundary conditions/limitations.
- **Reference:** Content Articles Spec (2026-05-20)
