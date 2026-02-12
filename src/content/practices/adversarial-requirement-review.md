---
title: Adversarial Requirement Review
description: A verification practice where a Critic Agent challenges the problem statement and assumptions before any specification or code is written.
status: Experimental
tags: ["practice", "verification", "product-thinking", "requirements"]
lastUpdated: 2026-02-12
---

# Adversarial Requirement Review

## Definition

**Adversarial Requirement Review** is a verification practice where a **Thought Partner** agent (acting as an adversarial critic) challenges the problem statement, underlying assumptions, and strategy *before* any specification is written or implementation begins.

This shifts the "adversarial" concept left—from reviewing code ([Adversarial Code Review](/practices/adversarial-code-review)) to reviewing the *intent* itself.

## When to Use

**Use this practice when:**
- Validating a new feature idea before writing a Spec.
- You have a PBI but suspect the "Why" is weak.
- Stakeholders ask for a specific solution ("We need a dashboard") without explaining the problem.

**Skip this practice when:**
- Fixing bugs (unless the bug reveals a flawed requirement).
- Implementing purely technical tasks where the "Why" is established (e.g., library upgrades).

## The Problem: The Backwards Approach

In traditional development, and accelerated by AI, we often start with "How do we build X?" rather than "Is X the right problem to solve?".

**The Backwards Problem:**
1. Stakeholder has an idea ("We need a weekly email report").
2. Engineer/AI jumps to implementation ("I'll set up a cron job...").
3. Feature ships quickly.
4. Feature fails because the underlying problem was misunderstood (e.g., users needed real-time data, not weekly snapshots).

AI exacerbates this by making implementation so cheap that we skip validation. We build the wrong thing faster than ever.

## The Solution: Thought Partner vs. Leader

To break this cycle, we separate the roles:

- **Human (Thought Leader):** Provides context, judgment, and final decisions.
- **AI (Thought Partner/Critic):** Provides challenges, alternative angles, and stress-testing questioning.

The goal is not for the AI to *solve* the problem, but to *sharpen* the problem definition.

## The Workflow

This pattern consists of three distinct phases of challenge.

### 1. The Problem Sharpener
**Goal:** Clarify the problem statement and remove implied solutions.

**Prompt Pattern:**
> "I'm going to describe a problem I'm trying to solve. I want you to act as a **Thought Partner** - not to solve it, but to help me understand it better.
> 
> After I describe the problem, **interview me one question at a time** to:
> - Clarify who exactly is affected and when
> - Surface barriers I might be glossing over
> - Identify assumptions I'm making without realizing it
> - Challenge whether I've framed the problem correctly
> 
> Don't suggest solutions. Help me see the problem more clearly.
> 
> Here's the problem: [describe your problem]"

### 2. The Assumption Surfacer
**Goal:** Identify risky beliefs that must be true for the strategy to succeed.

**Prompt Pattern:**
> "I'm considering this product strategy: [describe what you're building and why].
> 
> What assumptions am I making that **must be true** for this to work?
> 
> Focus on:
> - **Behavior:** Will people actually change their behavior to use it? (Desire != Action)
> - **Value:** Is it worth building? Does the value justify the cost?
> - **Alternatives:** What am I deprioritizing, and what is the cost of leaving that unsolved?
> 
> List 5-7 assumptions, starting with the ones most likely to be wrong."

### 3. The Pre-Build Stress Test
**Goal:** Final pressure test before committing to a Spec or PBI.

**Prompt Pattern:**
> "Before I commit to building this, I want to pressure-test the idea.
> 
> Context: [describe what you're planning to build and the problem it solves]
> 
> Act as a **skeptical but constructive advisor**. Interview me one question at a time to find weaknesses in my thinking. Push back where my reasoning seems thin. Help me discover what I don't know before I invest in building."

## Integration with ASDLC

This practice operates at the **beginning of the second diamond** (The Solution Space), acting as the bridge between "Insight" and "Specification".

- **Diamond 1 (Discover/Define):** Ends with a Problem Graph or validated Insight.
- **Diamond 2 (Develop/Deliver):** Starts with this practice to validate the strategy *before* writing the Spec.

It ensures that we don't proceed to **[Spec-Driven Development](/concepts/spec-driven-development)** with a flawed premise.

**Output:**
The output of this review is a validated **Problem Statement** and **Strategy**, which then becomes the "Context" section of your **[Spec](/patterns/the-spec)**.

## Related Practices

- **[Adversarial Code Review](/practices/adversarial-code-review)**: The downstream equivalent. While Requirement Review verifies the *Why*, Code Review verifies the *How*.
- **[Spec-Driven Development](/concepts/spec-driven-development)**: This practice ensures the Spec is worth writing.

## Related Patterns

- **[Agentic Double Diamond](/patterns/agentic-double-diamond)** — The broader design framework where this practice serves as the gate to the second diamond.
- **[Product Thinking](/concepts/product-thinking)**: The mindset that this practice operationalizes.

## References

1. **Before I Ask AI to Build, I Ask It to Challenge**
   Author: Daniel Donbavand
   Published: 2026-02-12
   URL: https://danieldonbavand.com/2026/02/12/before-i-ask-ai-to-build-i-ask-it-to-challenge/
   *Source of the "Problem Sharpener," "Assumption Surfacer," and "Pre-Build Stress Test" prompts.*
