# Context: Phase 2 - Content Implementation

**Role:** Senior Frontend Engineer (Astro Specialist) **Mission:** "Wire up" the content layer. Implement the dynamic routing and listing logic to transform the static scaffold into a functioning Knowledge Base. **Philosophy:** "Strict Typing, Raw CSS." We rely on Astro's `getCollection` for type safety and CSS Variables for the "Spec-Sheet" design.

# Constraints

1. **Stack:** Astro v4+, TypeScript, CSS Variables (No Tailwind).
    
2. **Linting:** Adhere to `biome.json` rules (no unused vars).
    
3. **Design:** Use the "Brutalist / Blueprint" aesthetic defined in `global.css`.
    
    - Use `.border-box` class for containers.
        
    - Use `var(--f-mono)` for metadata.
        
4. **Behavior:** Implement files exactly. Do not hallucinate new dependencies.
    

# Execution Steps

## Task 1: UI Components

Create a reusable "Spec Card" component to display Concepts and Patterns in a list.

**File:** `src/components/SpecCard.astro`

- **Props:** `title` (string), `url` (string), `meta` (string - e.g., "Experimental | 2025"), `tags` (string[] optional).
    
- **Style:** A simple bordered box (`border: 1px solid var(--c-border)`), monospace font for meta info. Hover state should invert colors or double the border.
    

## Task 2: Concept Directory & Routing

Implement the "Concepts" section.

**File:** `src/pages/concepts/index.astro`

- **Logic:** Fetch all concepts via `getCollection('concepts')`. Sort by `lastUpdated`.
    
- **Template:** Use `BaseLayout`. Display a grid of `SpecCard` components.
    
- **Header:** "Defined Concepts" (H1).
    

**File:** `src/pages/concepts/[...slug].astro`

- **Logic:** `getStaticPaths` fetching all concepts.
    
- **Template:** Use `BaseLayout`. Render `<Content />`.
    
- **Styling:** Wrap content in a `.prose` container (define simple typography styles for h2, p, ul in a `<style>` block locally). Display metadata (Definition, Maturity, Tags) at the top in a "Spec Sheet" header.
    

## Task 3: Pattern Directory & Routing

Implement the "Patterns" section.

**File:** `src/pages/patterns/index.astro`

- **Logic:** Fetch all patterns via `getCollection('patterns')`.
    
- **Template:** Similar to Concepts index.
    
- **Header:** "Architectural Patterns" (H1).
    

**File:** `src/pages/patterns/[...slug].astro`

- **Logic:** `getStaticPaths`.
    
- **Template:** Similar to Concept detail.
    
- **Specifics:** Display `complexity` and `status` prominently.
    

## Task 4: Global Style Update

**File:** `src/styles/global.css`

- Add a utility class `.prose` to handle Markdown content styling (max-width 65ch, standard spacing).
    
- Ensure `pre` and `code` blocks have a distinct background (`#f4f4f4`) and padding.
    

# Verification Checklist

After implementation, I expect to be able to:

1. Click "Concepts" in the nav and see a list including "Context Engineering".
    
2. Click the card and view the full rendered Markdown page.
    
3. Click "Patterns" and see "Supervisor Agent Pattern".
    
4. Run `pnpm run build` with **zero type errors**.
