# Context: Phase 2 QA - Content & Routing Verification

**Role:** Lead QA Engineer / Automation Specialist **Mission:** Verify the implementation of dynamic routing, content collections, and the home page integrity for `asdlc.io`. **Philosophy:** "Broken Links are Engineering Failures." We verify that the static build successfully generates all expected routes from our seed content.

# Constraints

1. **Scope:** Verify Phase 2 deliverables (Concepts/Patterns routing, SpecCard component, CSS updates) and Phase 1 regression (Home page).
    
2. **Method:** Static Analysis (Code checks) + Build Verification (Runtime checks).
    
3. **Tolerance:** Style discrepancies are minor; Build failures or missing routes are **CRITICAL**.
    

# Execution Steps

## Step 1: Structural Audit

Verify the creation of the following files. If missing, **FAIL** immediately.

- `src/components/SpecCard.astro`
    
- `src/pages/concepts/index.astro`
    
- `src/pages/concepts/[...slug].astro`
    
- `src/pages/patterns/index.astro`
    
- `src/pages/patterns/[...slug].astro`
    

## Step 2: Code Logic Inspection (Static Analysis)

1. **Routing Logic:**
    
    - Open `src/pages/concepts/[...slug].astro`.
        
    - Verify it imports `getCollection` from `astro:content`.
        
    - Verify `getStaticPaths` returns mapped collection entries.
        
    - _Sanity Check:_ Does it use the `Content` component for rendering MDX?
        
2. **Component Implementation:**
    
    - Open `src/components/SpecCard.astro`.
        
    - Verify it accepts `title`, `url`, and `meta` props.
        
    - Check for `border-box` class usage (Design System compliance).
        
3. **Global Styles:**
    
    - Open `src/styles/global.css`.
        
    - Verify the existence of the `.prose` utility class.
        
    - Verify `max-width` constraint (approx 65ch) on `.prose`.
        

## Step 3: Landing Page "Sanity Check"

Open `src/pages/index.astro`.

1. **Content:** Ensure the "Manifesto" text ("Determinism over Vibes") is still present.
    
2. **Navigation:** Verify the `<nav>` links point to `/concepts` and `/patterns` (either in the header component or on the page).
    
3. **Regression:** Ensure no "Lorem Ipsum" or default Astro starter content has appeared.
    

## Step 4: Build Verification

Execute `pnpm run build`.

1. **Route Generation:**
    
    - Check the output logs or `dist/` folder.
        
    - **CRITICAL:** Confirm `dist/concepts/context-engineering/index.html` exists.
        
    - **CRITICAL:** Confirm `dist/patterns/supervisor-agent/index.html` exists.
        
    - **CRITICAL:** Confirm `dist/index.html` exists.
        
2. **Type Safety:**
    
    - Confirm `pnpm run check` passes with zero errors.
        

# Report Generation

Output a markdown summary:

```
## Phase 2 Acceptance Report
| Feature | Status | Notes |
| :--- | :--- | :--- |
| Dynamic Routing (Concepts) | [PASS/FAIL] | (Did context-engineering.html generate?) |
| Dynamic Routing (Patterns) | [PASS/FAIL] | (Did supervisor-agent.html generate?) |
| UI Component (SpecCard) | [PASS/FAIL] | |
| CSS Updates (.prose) | [PASS/FAIL] | |
| Home Page Sanity | [PASS/FAIL] | (Is the Manifesto intact?) |
| Build Pipeline | [PASS/FAIL] | |

### Defects Found
(List any type errors, missing files, or broken links)
```
