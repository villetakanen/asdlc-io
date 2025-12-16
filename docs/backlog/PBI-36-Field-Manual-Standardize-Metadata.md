# PBI-36: Field Manual Standardize Chapter Metadata

> Status: Open

## Goal
Standardize the chapter metadata display across all three Field Manual collections (Patterns, Practices, Concepts), ensuring consistent information presentation and removing the redundant ID field.

## Context
The current Field Manual implementation shows inconsistent metadata across collections:
- **Concepts**: Display only `ID: {entry.id}`
- **Patterns**: Display `ID: {entry.id} // Status: {entry.data.status}`
- **Practices**: (Not yet implemented, but will need consistent format)

The `ID` field (e.g., "the-spec" or "context-engineering") is already visible in the URL anchor and provides minimal value to readers. Instead, we should display actionable metadata: **Status** and **Last Updated**.

## Spec Reference
`/docs/specs/field-manual.md` - Section: "What Needs to Change" → "Display Description and Enhanced Metadata"

## Requirements

### Metadata to Display
- **Status**: The article's lifecycle state (Live, Draft, Experimental, Proposed, Deprecated)
- **Last Updated**: Date in ISO format (YYYY-MM-DD)

### Format
```
Status: Live | Last Updated: 2025-01-23
```

### Apply To
- All Patterns chapters
- All Practices chapters  
- All Concepts chapters

### Remove
- `ID: {entry.id}` field (no longer displayed)

## Acceptance Criteria
- [ ] Remove `ID` field from all chapter metadata displays
- [ ] Add `Status` field to all chapter metadata (currently missing from Concepts)
- [ ] Add `Last Updated` field to all chapter metadata (currently missing from all collections)
- [ ] Use consistent format: `Status: {status} | Last Updated: {date}` across all collections
- [ ] Date formatting: `entry.data.lastUpdated.toISOString().split('T')[0]`
- [ ] Maintain `.chapter-meta` CSS class for styling
- [ ] Page builds successfully: `pnpm check` passes
- [ ] Linting passes: `pnpm lint` passes

## Implementation Guidance

### Before (Inconsistent)

**Concepts:**
```astro
<span class="chapter-meta">ID: {entry.id}</span>
```

**Patterns:**
```astro
<span class="chapter-meta">ID: {entry.id} // Status: {entry.data.status}</span>
```

### After (Standardized)

**All Collections:**
```astro
<span class="chapter-meta">
    Status: {entry.data.status} | 
    Last Updated: {entry.data.lastUpdated.toISOString().split('T')[0]}
</span>
```

### Complete Chapter Template
```astro
<article class="chapter" id={entry.id}>
    <h2 class="chapter-title">{entry.data.title}</h2>
    {entry.data.description && (
        <p class="chapter-description">{entry.data.description}</p>
    )}
    <span class="chapter-meta">
        Status: {entry.data.status} | 
        Last Updated: {entry.data.lastUpdated.toISOString().split('T')[0]}
    </span>
    <div class="prose">
        <Content />
    </div>
</article>
```

### Locations to Update
1. Patterns section rendering
2. Practices section rendering (when added in PBI-34)
3. Concepts section rendering

## Testing

**Manual Verification:**
1. Build: `pnpm build`
2. Preview: `pnpm preview`
3. Navigate to `/fieldmanual`
4. For each section (Patterns, Practices, Concepts):
   - Verify `ID` field is no longer displayed
   - Verify `Status: {status}` is displayed
   - Verify `Last Updated: YYYY-MM-DD` is displayed
   - Verify separator `|` is present and properly spaced
   - Verify metadata uses monospace font (existing `.chapter-meta` styling)

**Sample Articles to Check:**
- Pattern: "The Spec" - Should show `Status: Draft | Last Updated: 2025-12-15`
- Practice: "Agent Personas" - Should show `Status: Live | Last Updated: 2025-12-11`
- Concept: "Context Engineering" - Should show `Status: {status} | Last Updated: 2025-01-23`

**Consistency Check:**
1. Visually scan all three sections
2. Confirm metadata format is identical across all articles
3. Confirm no `ID:` labels remain anywhere in the output

## Notes
- The `lastUpdated` field is required in the schema and uses `z.coerce.date()`, so all articles should have valid dates
- The `toISOString().split('T')[0]` pattern extracts just the date portion (YYYY-MM-DD) without time
- The existing `.chapter-meta` CSS class already handles font family (monospace) and color (secondary text)
- No new CSS is required—only HTML template changes
- The `entry.id` is still used for the anchor (`id={entry.id}`), just not displayed to users

## Related
- Spec: `/docs/specs/field-manual.md`
- File: `src/pages/fieldmanual.astro`
- Schema: `src/content/config.ts` (defines status and lastUpdated fields)
- Related to: PBI-35 (description display)
- Dependency: None (can be implemented independently)