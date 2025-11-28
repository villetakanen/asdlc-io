# PBI-0017: Quality of Life Improvements

**ID:** PBI-0017
**Priority:** High
**Effort:** Medium
**Phase:** Iteration 6
**Context:** Polish, Documentation & Reflection

## 1. Overview
This PBI addresses three critical quality-of-life improvements identified during iteration 5 retrospective: CSS architecture refactoring, SEO/social metadata consistency, and accessibility compliance.

## 2. User Story
As a **Developer and Content Creator**, I want **well-organized code, consistent SEO metadata, and accessible content**, so that **the site is maintainable, discoverable, and usable by everyone.**

## 3. Implementation Tasks

### 3.1. CSS Architecture Refactoring
*   [ ] Audit all Astro components for scoped `<style>` tags
*   [ ] Create modular CSS structure (`/src/styles/components/`, `/src/styles/layouts/`, `/src/styles/pages/`)
*   [ ] Extract component-specific styles from `global.css`
*   [ ] Refactor `global.css` to contain only true global styles (~100 lines)
*   [ ] Update component imports to use new CSS modules
*   [ ] Verify no visual regressions after refactoring

### 3.2. SEO & Social Metadata Audit
*   [ ] Create `/docs/audits/seo-audit.md` documenting current state
*   [ ] Audit all page types for metadata consistency
*   [ ] Create `SEOMetadata.astro` component
*   [ ] Enhance `BaseLayout.astro` with missing Open Graph fields
*   [ ] Add JSON-LD structured data for better search engine understanding
*   [ ] Update all page templates to pass consistent metadata
*   [ ] Verify social share previews on Twitter, LinkedIn, Facebook

### 3.3. Accessibility Audit & Fixes
*   [ ] Create `/docs/audits/accessibility-audit.md`
*   [ ] Run automated accessibility tests (Lighthouse, axe)
*   [ ] Fix heading structure in all content files (one H1 per page)
*   [ ] Verify color contrast meets WCAG AA standards
*   [ ] Add skip-to-content links for keyboard navigation
*   [ ] Test with screen readers
*   [ ] Document accessibility testing workflow in `AGENTS.md`

## 4. Acceptance Criteria
*   [ ] CSS is organized in modular files following Astro best practices
*   [ ] `global.css` contains only global styles (~100 lines)
*   [ ] All page types have consistent, complete SEO metadata
*   [ ] Social share previews display correctly
*   [ ] All content files have proper heading hierarchy (one H1, logical H2/H3 structure)
*   [ ] Site passes WCAG AA automated tests
*   [ ] Accessibility testing workflow is documented
