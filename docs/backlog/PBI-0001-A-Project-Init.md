# Context: Project Initialization

**Role:** Senior Systems Architect **Mission:** Initialize the repository for `asdlc.io`, a static knowledge base for Agentic SDLC. **Philosophy:** "Determinism over Vibes." We enforce strict linting, commit conventions, and type safety from minute zero.

# Constraints

1. **Stack:** Astro (Zero-JS default), Biome (Linting/Formatting), Lefthook (Git Hooks), Conventional Commits.
    
2. **Package Manager:** **Strictly `pnpm`**.
    
3. **Design:** No Tailwind. Use raw CSS variables for a "Spec-Sheet" technical aesthetic.
    
4. **Behavior:** Do not ask for clarification. Implement exactly as specified.
    

# Execution Steps

## Step 1: Scaffold

Initialize a minimal Astro project.

- Clean up any default starter templates.
    
- Ensure project type is `module`.
    

## Step 2: Dependencies

Run immediately using **pnpm**: `pnpm add -D @biomejs/biome @commitlint/cli @commitlint/config-conventional lefthook @astrojs/check typescript`

## Step 3: Configuration Implementation

Create or Overwrite the following files with the EXACT content provided below.

**1. package.json** (Enforces pnpm)

```
{
  "name": "asdlc-io",
  "type": "module",
  "version": "0.0.1",
  "packageManager": "pnpm@9.1.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "lint": "biome check --write .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "astro": "^4.15.0",
    "typescript": "^5.5.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@biomejs/biome": "1.8.3",
    "@commitlint/cli": "^19.4.0",
    "@commitlint/config-conventional": "^19.4.1",
    "lefthook": "^1.7.14"
  }
}
```

**2. AGENTS.md** (The Constitution for AI Agents)

```
# AGENTS.md: Directives for Autonomous Contributors

**Status:** Active
**Enforcement:** Strict

This file defines the operating protocols for any Large Language Model (LLM), Agent, or Copilot interacting with this repository.

## 1. Core Directives (Global)
* **No "Vibe Coding":** Do not guess types. Do not use `any`. Do not hallucinate imports.
* **Schema First:** Before generating any `.md` or `.mdx` content, you MUST read `src/content/config.ts`. All frontmatter must validate against the Zod schemas defined there.
* **Style:** Adhere to the "Spec-Sheet" aesthetic defined in `src/styles/global.css`. Do not add inline styles or Tailwind classes.

## 2. GitHub Copilot / Cursor Rules
* **Context Awareness:** Always check `.vscode/settings.json` to understand the Biome formatter settings.
* **Commit Protocol:** When generating commit messages, strictly follow Conventional Commits (e.g., `feat:`, `fix:`, `arch:`).
* **Reference:** [GitHub Copilot Best Practices](https://docs.github.com/en/copilot)

## 3. Gemini / Vertex Agent Rules
* **Reasoning Traces:** When proposing architectural changes, you must provide a `<thinking>` block explaining *why* a pattern was chosen before outputting code.
* **Context Window:** Prioritize `src/content/config.ts` and `AGENTS.md` in your context window. Drop `node_modules` or build artifacts.
* **Reference:** [Google Cloud Vertex AI Agent Design](https://cloud.google.com/vertex-ai/docs/generative-ai/agent-design)
```

**3. biome.json** (Strict Astro overrides)

```
{
  "$schema": "[https://biomejs.dev/schemas/1.8.3/schema.json](https://biomejs.dev/schemas/1.8.3/schema.json)",
  "vcs": { "enabled": true, "client": "git", "useIgnoreFile": true },
  "files": {
    "ignore": ["dist", "node_modules", ".astro", "public", "pnpm-lock.yaml"],
    "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.json", "src/**/*.astro"]
  },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedImports": "error", "noUnusedVariables": "error" },
      "style": { "useConst": "error", "useTemplate": "error" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": { "globals": ["Astro", "Fragment"] },
  "overrides": [
    {
      "include": ["*.astro"],
      "linter": {
        "rules": {
          "style": { "useConst": "off", "useImportType": "off" },
          "correctness": { "noUnusedVariables": "off" }
        }
      },
      "formatter": { "attributePosition": "auto" }
    }
  ]
}
```

**4. lefthook.yml**

```
pre-commit:
  parallel: true
  commands:
    biome-check:
      glob: "*.{js,ts,astro,json,css}"
      run: npx @biomejs/biome check --write {staged_files} && git add {staged_files}

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

**5. .commitlintrc.json**

```
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "arch"]
    ]
  }
}
```

**6. .vscode/settings.json**

```
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.organizeImports.biome": "explicit" },
  "[astro]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

**7. src/content/config.ts** (The Data Schema)

```
import { defineCollection, z } from 'astro:content';

const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    definition: z.string().max(200, "Definition must be < 200 chars for quick scanning."),
    tags: z.array(z.string()),
    related_concepts: z.array(z.string()).optional(),
    maturity: z.enum(['Theoretical', 'Experimental', 'Standard', 'Deprecated']),
    lastUpdated: z.date(),
  }),
});

const patterns = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    complexity: z.enum(['Low', 'Medium', 'High']),
    status: z.enum(['Draft', 'Review', 'Approved']),
    diagram_source: z.string().optional(),
    publishDate: z.date(),
  }),
});

export const collections = { concepts, patterns };
```

**8. src/styles/global.css** (The Blueprint Design System)

```
:root {
  --c-bg: #ffffff;
  --c-fg: #050505;
  --c-dim: #666666;
  --c-border: #000000;
  --c-accent: #0000ff;
  --f-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --f-mono: 'JetBrains Mono', 'SF Mono', monospace;
  --s-grid: 24px;
  --s-gap: 1.5rem;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--f-sans); background-color: var(--c-bg); color: var(--c-fg); line-height: 1.5; -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
h1 { font-size: 2.5rem; }
h2 { font-size: 1.75rem; margin-bottom: 1rem; }
h3 { font-size: 1.25rem; font-family: var(--f-mono); }
a { color: var(--c-fg); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
a:hover { color: var(--c-accent); text-decoration-style: double; }
code { font-family: var(--f-mono); font-size: 0.9em; background: #f4f4f4; padding: 0.2em 0.4em; }
.mono { font-family: var(--f-mono); }
.border-box { border: 1px solid var(--c-border); padding: var(--s-gap); }
.grid-layout { display: grid; grid-template-columns: 1fr; gap: var(--s-gap); max-width: 900px; margin: 0 auto; padding: var(--s-gap); }
```

## Step 4: Verification

After creating the files:

1. Run `pnpm install` (This creates the strict lockfile).
    
2. Run `pnpm run lint` to verify Biome.
    
3. Confirm the server starts with `pnpm run dev`.
