# Feature: Site Footer

## Blueprint

### Context

The site footer (`src/components/Footer.astro`) appears on every page via `BaseLayout.astro`. It provides site identity (name + version), copyright, and license link. It is the only site-wide location for the version number.

### Architecture

**File:** `src/components/Footer.astro`

**Dependencies:**
| Import | Source | Role |
|--------|--------|------|
| `version` | `../../package.json` | Current release version string |

**Consumed by:** `src/layouts/BaseLayout.astro` (rendered after `<main>`)

**Content:** Single `<footer>` element containing:
```
ASDLC.io v{version} © {year} // Licensed under MIT License
```

**Styling:** `src/styles/ds/components/footer.css` — mono font, uppercase, secondary text color, border-top separator, pushed to bottom via `margin-top: auto`.

### Anti-Patterns

- **Do NOT add navigation links to the footer.** Site navigation belongs in `Header.astro`. The footer is identity/legal only.
- **Do NOT hardcode the version string.** Always import from `package.json`.
- **Do NOT hardcode the year.** Always use `new Date().getFullYear()`.

## Contract

### Definition of Done

- [x] Footer renders on every page (via BaseLayout)
- [x] Displays site name, version from `package.json`, and dynamic copyright year
- [x] Links to MIT License on GitHub
- [x] Uses design system tokens (mono font, secondary text color, border separator)
- [x] No scoped CSS — styled via global `footer.css`

### Regression Guardrails

- Footer MUST appear on every page — it is rendered by `BaseLayout`, not individual pages
- Version MUST be imported from `package.json`, not hardcoded
- License link MUST point to the GitHub repo's LICENSE file
- Footer MUST NOT contain navigation links or content beyond identity/legal

### Scenarios

**Scenario: Version is visible on any page**
- Given: A visitor is on any page of the site
- When: They scroll to the bottom
- Then: The footer displays the current version from `package.json`

**Scenario: Copyright year is current**
- Given: The site is built in any year
- When: The footer renders
- Then: The copyright year matches the current year

## Implementation Notes

Single component file. The footer CSS is loaded globally via `src/styles/ds/index.css` → `footer.css`. No props interface — the component is self-contained.

## Resources

- `src/layouts/BaseLayout.astro` — Consumer
- `src/styles/ds/components/footer.css` — Styling
