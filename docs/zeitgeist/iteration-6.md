# Iteration 6: QoL, Design System & State Review

**Status**: Planning
**Start Date**: 2025-11-28
**End Date**: TBD
**Theme**: Polish, Documentation & Reflection

## The Assessment
Iteration 5 successfully transitioned from Manifesto to Field Manual by establishing the "Practices" topic and creating concrete implementation guides. The site now has a solid foundation with the Avionics design system, mobile navigation, and structured content.

However, there are opportunities to improve the developer and user experience through quality-of-life enhancements, document the design system for future maintainability, and reflect on the current state of the project in the zeitgeist documentation.

## The Strategy: "Polish & Reflect"
Iteration 6 focuses on three key areas:
1. **Quality of Life (QoL)**: Small but impactful improvements to the developer experience and user experience.
2. **Design System Documentation**: Create comprehensive documentation of the Avionics design system in the Resources section.
3. **State Review**: Update the zeitgeist documentation to reflect the current state of the project, including what's been accomplished and what's next.

## Goals
- [ ] Identify and implement QoL improvements for developers and users.
- [ ] Document the Avionics design system with examples and usage guidelines.
- [ ] Review and update zeitgeist documentation to reflect current project state.
- [ ] Ensure all documentation is accurate and up-to-date.

## Planned PBIs

### PBI-0017: Quality of Life Improvements
*Three critical areas for improving maintainability and user experience.*

#### 1. CSS Architecture Refactoring
- [ ] Extract scoped `<style>` tags from Astro components to modular CSS files
- [ ] Create `/src/styles/components/`, `/src/styles/layouts/`, `/src/styles/pages/` directories
- [ ] Refactor `global.css` from ~200 lines to ~100 lines of core global styles
- [ ] Follow Astro best practices for CSS organization

#### 2. SEO & Social Metadata Audit
- [ ] Create `/docs/audits/seo-audit.md` documenting current state
- [ ] Create `SEOMetadata.astro` component for centralized metadata management
- [ ] Enhance Open Graph and Twitter Card metadata
- [ ] Add JSON-LD structured data for better search engine understanding
- [ ] Verify social share previews on all platforms

#### 3. Accessibility Audit & Fixes
- [ ] Create `/docs/audits/accessibility-audit.md`
- [ ] Fix heading structure in all content files (one H1 per page)
  - Convert multiple H1s in `agentic-sdlc.md`, `context-gates.md`, etc. to H2s
- [ ] Run automated accessibility tests (Lighthouse, axe)
- [ ] Verify WCAG AA color contrast compliance
- [ ] Add skip-to-content links for keyboard navigation
- [ ] Document accessibility testing workflow in `AGENTS.md`

### PBI-0018: Design System Documentation
*Comprehensive documentation of the Avionics design system.*
- [ ] Create `/src/content/resources/design-system.md`
- [ ] Document color palette with visual swatches and usage guidelines
- [ ] Document typography (font families, sizes, weights, line heights)
- [ ] Document layout system (grid, breakpoints, spacing tokens)
- [ ] Document reusable components with code examples
- [ ] Add inline comments to CSS files for maintainability
- [ ] Create live examples using actual design tokens

### PBI-0019: Zeitgeist State Review
*Review and update project documentation to reflect current state.*
- [ ] Create `/docs/zeitgeist/project-overview.md`
- [ ] Create `/docs/zeitgeist/roadmap.md`
- [ ] Review and ensure consistency across all iteration documents (1-6)
- [ ] Add cross-references between related PBIs
- [ ] Document key design decisions and rationale

## Success Criteria
- CSS is organized in modular files following Astro best practices
- All page types have consistent, complete SEO metadata
- Site passes WCAG AA automated accessibility tests
- All content files have proper heading hierarchy
- Design system documentation is comprehensive and accessible
- Zeitgeist documentation accurately reflects current project state
