# Feature: Recipes

## Blueprint

### Context

The ASDLC knowledge base (Concepts, Patterns, Practices) documents *what things are* and *why they matter*. What it lacks is a practical layer that shows *how to do specific things* — concrete, copy-paste-ready examples and walkthroughs.

**Recipes** fill this gap. They are a collection of task-oriented guides — "how do I set up a spec-driven workflow?", "how do I configure Claude Code for agentic development?", "how do I write a good AGENTS.md?" — that reference the main KB for theory but focus on execution.

Key distinction from Practices: a Practice is a reusable operational methodology (e.g., "Living Specs"). A Recipe is a concrete, scoped walkthrough (e.g., "Create Your First Living Spec in 5 Minutes"). Practices describe *process*; recipes describe *steps for a specific task*.

**Content philosophy: agent-first, humans-second.**

Recipe prose is written for machine consumption. Imperative voice, structured steps, no narrative fluff. Humans can read it fine — clear instructions are clear instructions — but when a writing choice serves humans at the cost of machine parseability, choose the machine. The KB articles (Concepts, Patterns, Practices) remain human-first; recipes are the agent layer.

**Consumers (in priority order):**
1. **MCP clients** — LLMs retrieving actionable how-to guidance via tool calls (primary audience)
2. **Web visitors** — Developers browsing a recipe catalog on `asdlc.io/recipes`
3. **Resource listings** — Aggregators and indexes that surface the recipe catalog

### Architecture

#### Content Collection

New Astro content collection `recipes` alongside the existing three:

```
src/content/recipes/
  ├── create-living-spec.md
  ├── configure-claude-code.md
  ├── write-agents-md.md
  └── ...
```

Registered in `src/content/config.ts` with a `recipeSchema` that extends the base article fields:

```ts
export const recipeTool = z.enum([
  "Claude Code",   // Grows as recipes are added
]);

export const recipeSchema = articleSchema.extend({
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  prerequisites: z.array(z.string()).optional(),     // KB article slugs or free-text
  tools: z.array(recipeTool).min(1),                 // At least one tool required
  category: z.enum([
    "Setup",           // Environment & tooling configuration
    "Workflow",        // Dev process & automation
    "Content",         // Writing & publishing content
    "Integration",     // Connecting tools & systems
    "Governance",      // Quality, review, compliance
  ]),
  estimatedMinutes: z.number().int().positive(),     // Time to complete, not read
  agentPrompt: z.string().max(440).optional(),       // Short usage hint for agents
});
```

The `articleSchema` base provides: `title`, `longTitle`, `description`, `tags`, `publishedDate`, `lastUpdated`, `status`, `supersededBy`, `relatedIds`, `references`.

Recipe-specific fields:
- `difficulty` — Skill level required. Drives filtering and display.
- `prerequisites` — What the reader needs to know/have before starting. Can reference KB articles by slug (e.g., `concepts/context-engineering`) or free-text (e.g., "Node.js 20+").
- `tools` — Technologies/products involved. Controlled vocabulary via `recipeTool` enum. Drives category filtering.
- `category` — Top-level grouping for navigation and MCP filtering.
- `estimatedMinutes` — Author-declared completion time for a practitioner at the stated difficulty level. Not reading time.
- `agentPrompt` — Optional, max 440 characters. A short usage hint that tells the agent *when and how* to apply this recipe — not the recipe itself. The article body is the agent-consumable content. See MCP Exposure > Agent consumption mode.

#### Routing

File-based routing under `src/pages/recipes/`:

```
src/pages/recipes/
  ├── index.astro          # Recipe catalog with category nav + search
  └── [...slug].astro      # Individual recipe detail page
```

#### Sub-Site Navigation

Recipes are a **sub-site** with bespoke navigation, not just another collection tab in the main nav. The recipes index page (`/recipes`) provides:

1. **Category sidebar/tabs** — Filter by category (Setup, Workflow, Content, Integration, Governance)
2. **Difficulty filter** — Beginner / Intermediate / Advanced
3. **Tool filter** — Filter by tool (derived from `tools` frontmatter across all recipes)
4. **Search** — Client-side text search across titles and descriptions

The main site header gets a "Recipes" link added to `Header.astro` nav, but the recipes pages themselves render an additional sub-navigation component for category/filter browsing.

#### Recipe Detail Layout

Individual recipe pages use a dedicated layout that differs from KB article pages:

- **Header:** Title, description, difficulty badge, category badge, tools list, estimated completion time (from `estimatedMinutes`)
- **Prerequisites block:** Links to KB articles and external requirements
- **Body:** Step-by-step content (markdown), starting at H2 per existing convention
- **Sidebar/footer:** Related recipes, related KB articles (from `relatedIds`)

#### MCP Exposure

Recipes are exposed via the existing MCP server with two changes:

1. **Index generation** — `scripts/generate-mcp-index.mjs` adds `"recipes"` to the `COLLECTIONS` array. Recipe articles include the extra fields (`difficulty`, `category`, `tools`, `prerequisites`) in `articles.json`.

2. **Tool updates** — `src/mcp/tools.ts`:
   - `list_articles` — Returns recipes alongside existing articles. Each recipe entry includes `[recipe]` prefix or `collection: "recipes"` for client disambiguation.
   - `search_knowledge_base` — Searches across all four collections including recipes.
   - `get_article` — Returns full recipe content with metadata header (difficulty, category, tools, prerequisites).

No new MCP tools needed — recipes are articles and fit the existing tool surface.

**Agent consumption mode**

Recipes are agent-first content. The article body itself is written in imperative, structured prose optimized for LLM parsing. There is no separate "machine version" — the article IS the machine version.

The optional `agentPrompt` field (max 440 characters) serves as a **usage hint** — it tells the agent *when to use this recipe* and *how to apply it*, not the recipe steps themselves. Think of it as a routing label:

> "Use when creating a new feature spec. Run /spec with the feature domain. Requires an initialized git repo with specs/ directory."

When `get_article` returns a recipe that has an `agentPrompt`, the MCP response includes it as a top-level field before the prose content. Agents can use it to decide whether to read the full article or skip it.

**Writing rules for recipe prose (agent-first):**
- Imperative voice throughout ("Create the file", "Run the command", not "you should create")
- No narrative transitions ("Let's walk through...", "Now we'll...")
- Fenced code blocks for all file contents and commands — no inline descriptions of what to type
- One instruction per paragraph — no compound steps
- Link KB articles for context; do not re-explain concepts inline

#### Relationship to KB

Recipes reference KB articles via `relatedIds` and `prerequisites` but are **not required to maintain bidirectional links** back from KB articles to recipes. This is a deliberate asymmetry:

- A recipe about "Create Your First Living Spec" references `practices/living-specs` and `patterns/the-spec`
- Those KB articles do NOT need to list every recipe that references them
- This prevents KB article frontmatter from growing unboundedly as recipes are added

Recipes may still appear in a KB article's `relatedIds` when the relationship is architecturally significant (e.g., a Practice article linking to its companion recipe).

### Anti-Patterns

- **Recipe as Practice** — Recipes are scoped tasks, not reusable methodologies. If content describes a general process applicable across contexts, it belongs in Practices.
- **Recipe as Tutorial** — Recipes assume engineering competence. Don't explain what a terminal is. Assume the reader can run commands and edit files.
- **Unbounded Scope** — A recipe should accomplish ONE thing. "Set up an entire agentic development environment from scratch" is an Epic, not a recipe. Split into focused recipes.
- **KB Duplication** — Recipes must not re-explain concepts defined in the KB. Link to the concept instead. Exception: a one-sentence contextual summary is acceptable.
- **Missing Prerequisites** — Every recipe must declare what the reader needs. Silent assumptions about tooling or knowledge create frustrating experiences.
- **Category Sprawl** — Do not add new categories without updating this spec. Five categories is the target ceiling.
- **Tool name variants** — Use the exact `recipeTool` enum value. Check the existing enum before adding a new entry. If an existing value covers the tool (e.g., "CI/CD" covers GitHub Actions), use it. New entries are added when a recipe genuinely needs them — not pre-populated.
- **Agent prompt as mini-recipe** — The `agentPrompt` is a routing hint ("when/how to use"), not a condensed copy of the steps. If it exceeds 440 characters, you're putting recipe content in the wrong place.
- **Human-first prose** — Recipe body must not use conversational tone, narrative transitions, or explanatory padding. Write for an LLM that will execute the steps. Humans benefit from the same clarity.

## Contract

### Definition of Done

- [ ] Recipe validates against `recipeSchema` in `src/content/config.ts` (`pnpm check` passes)
- [ ] Recipe builds without errors (`pnpm build` succeeds)
- [ ] Recipe lint passes (`pnpm lint` succeeds)
- [ ] `tools` contains at least one entry from the `recipeTool` enum
- [ ] Frontmatter includes `difficulty` and `category`
- [ ] `estimatedMinutes` is declared and realistic for the stated difficulty level
- [ ] `prerequisites` lists all required KB knowledge and external tooling
- [ ] `description` is under 200 characters and describes what the reader will accomplish
- [ ] Content starts at H2 — no H1 in body
- [ ] Recipe appears on `/recipes` index page filtered under correct category
- [ ] Recipe is retrievable via MCP `get_article` (if Live/Experimental)
- [ ] Recipe is discoverable via MCP `search_knowledge_base` (if Live/Experimental)
- [ ] If `agentPrompt` is present, it describes *when/how to use* the recipe (not the steps themselves) and is under 440 characters
- [ ] Prose body uses imperative voice, no narrative transitions, one instruction per paragraph

### Regression Guardrails

- All recipes must validate against `recipeSchema` — no unschematized frontmatter fields
- The `category` enum must not grow beyond what is defined in this spec without a spec update
- Existing `articleSchema` base constraints (title length, description length, date coercion) apply unchanged
- MCP index generation must include recipes — regressions in `generate-mcp-index.mjs` filtering would silently drop the collection
- Recipe-to-KB cross-references via `relatedIds` follow the same slug format as KB articles: `collection/slug` (e.g., `concepts/context-engineering`)
- The sub-site navigation must not break or interfere with the main site header navigation
- The `recipeTool` enum grows only when a recipe requires a new tool. Each addition must use a consistent naming convention: product name as it appears in official docs (e.g., "Claude Code" not "claude-code", "Playwright" not "playwright")

### Scenarios

**Scenario: New recipe creation**
- Given: A topic that provides concrete steps for a specific task
- When: An author creates a recipe with valid frontmatter in `src/content/recipes/`
- Then: The recipe validates, builds, appears on `/recipes` under its category, and is searchable via MCP

**Scenario: Category filtering on index page**
- Given: Recipes exist across multiple categories
- When: A visitor selects the "Setup" category filter on `/recipes`
- Then: Only recipes with `category: "Setup"` are displayed

**Scenario: Difficulty filtering**
- Given: Recipes exist at Beginner, Intermediate, and Advanced levels
- When: A visitor selects "Beginner" difficulty filter
- Then: Only `difficulty: "Beginner"` recipes are displayed

**Scenario: MCP recipe discovery**
- Given: A Live recipe exists in `src/content/recipes/`
- When: An LLM calls `search_knowledge_base` with a query matching the recipe
- Then: The recipe appears in results with collection identification
- And: `get_article` returns the full content including difficulty, category, tools, and prerequisites metadata

**Scenario: Recipe references KB article**
- Given: A recipe has `relatedIds: ["concepts/context-engineering"]`
- When: The recipe is rendered
- Then: The related KB article is linked in the recipe's related content section
- And: The KB article is NOT required to link back to the recipe

**Scenario: Content boundary enforcement**
- Given: A draft recipe contains three pages of conceptual explanation about context engineering
- When: Reviewed for compliance
- Then: The conceptual content is rejected — the recipe should link to `concepts/context-engineering` instead

**Scenario: MCP returns recipe with usage hint**
- Given: A Live recipe has `agentPrompt: "Use when creating a new feature spec. Requires specs/ directory."`
- When: An LLM calls `get_article` for that recipe
- Then: The response includes the `agentPrompt` as a top-level field before the prose content
- And: The agent can use the hint to decide whether the full article is relevant

**Scenario: Recipe without usage hint**
- Given: A Live recipe does NOT have an `agentPrompt` field
- When: An LLM calls `get_article` for that recipe
- Then: The response includes the prose content only
- And: No `agentPrompt` field is present (not null, absent)

**Scenario: Agent-first prose quality**
- Given: A recipe draft uses phrases like "Let's walk through setting up..." or "You should now see..."
- When: Reviewed for compliance
- Then: The narrative language is rejected — rewrite in imperative voice ("Set up...", "Verify output...")

**Scenario: Prerequisites rendering**
- Given: A recipe has `prerequisites: ["concepts/spec-driven-development", "Node.js 20+", "Claude Code CLI"]`
- When: The recipe detail page is rendered
- Then: KB slugs render as links to the corresponding articles
- And: Free-text prerequisites render as plain text items

## Implementation Notes

### File Structure

```
src/
  content/
    recipes/              # New collection
      *.md
  pages/
    recipes/
      index.astro         # Catalog with category nav
      [...slug].astro     # Recipe detail page
  components/
    RecipeCard.astro      # Card for recipe index (extends SpecCard pattern with difficulty/category badges)
    RecipeNav.astro       # Sub-site category navigation
    RecipeHeader.astro    # Recipe detail header (difficulty, category, tools, prereqs)
  layouts/
    (uses BaseLayout.astro — no new layout needed)
specs/
  recipes/
    spec.md               # This file
```

### Schema Registration

In `src/content/config.ts`, add:

```ts
export const recipeTool = z.enum([
  "Claude Code",   // Grows as recipes are added
]);

export const recipeSchema = articleSchema.extend({
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  prerequisites: z.array(z.string()).optional(),
  tools: z.array(recipeTool).min(1),
  category: z.enum(["Setup", "Workflow", "Content", "Integration", "Governance"]),
  estimatedMinutes: z.number().int().positive(),
  agentPrompt: z.string().max(440).optional(),
});

const recipes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/recipes" }),
  schema: recipeSchema,
});

export const collections = { concepts, patterns, practices, recipes };
```

### MCP Index Update

In `scripts/generate-mcp-index.mjs`, change:

```js
const COLLECTIONS = ["concepts", "patterns", "practices", "recipes"];
```

Include recipe-specific fields in the article push:

```js
articles.push({
  slug,
  collection,
  title: data.title || slug,
  longTitle: data.longTitle || null,
  description: data.description || "",
  status: data.status,
  content: content.trim(),
  tags: data.tags || [],
  references: data.references || [],
  // Recipe-specific (undefined for non-recipe collections)
  ...(collection === "recipes" && {
    difficulty: data.difficulty,
    category: data.category,
    tools: data.tools || [],
    prerequisites: data.prerequisites || [],
    estimatedMinutes: data.estimatedMinutes,
    agentPrompt: data.agentPrompt ?? undefined,
  }),
});
```

### Estimated Time Guidelines

`estimatedMinutes` is author-declared completion time for a practitioner at the stated difficulty level. Not reading time. Guidelines:

| Estimated minutes | Typical recipe |
|---|---|
| 5 | Single-file creation or config change |
| 10-15 | Multi-step setup with verification |
| 20-30 | End-to-end workflow with testing |
| 45+ | Consider splitting into multiple recipes |

If a recipe estimates 45+ minutes, reconsider scope — it may be an Epic, not a recipe (see Anti-Patterns > Unbounded Scope).

### Navigation Update

In `src/components/Header.astro`, add "Recipes" to the nav:

```html
<a href="/recipes" class="nav-link">Recipes</a>
```

### Seed Content Candidates

Initial recipes to validate the feature architecture:

1. **"Create Your First Living Spec"** — Category: Workflow, Difficulty: Beginner, Tools: [Claude Code]
2. **"Write an AGENTS.md File"** — Category: Setup, Difficulty: Beginner, Tools: [Claude Code]
3. **"Set Up MCP for Your Knowledge Base"** — Category: Integration, Difficulty: Intermediate, Tools: [MCP, Claude Code]
4. **"Run a Spec-Driven Dev Loop"** — Category: Workflow, Difficulty: Intermediate, Tools: [Claude Code, Linear]
5. **"Add Schema Validation to Content"** — Category: Governance, Difficulty: Advanced, Tools: [Zod, Astro]

## Resources

- [Content Articles Spec](../content-articles/spec.md) — Shared article contract and collection classification
- [Living Specs Practice](/practices/living-specs) — Maintenance methodology for this spec
- [The Spec Pattern](/patterns/the-spec) — Structural definition of specs
