import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe } from 'vitest';
import SpecCard from '../../src/components/SpecCard.astro';

describe('SpecCard Component', () => {
  test('renders title, status, meta, and tags correctly', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecCard, {
      props: {
        title: 'Test Pattern',
        url: '/patterns/test-pattern',
        meta: 'Oct 12, 2026',
        status: 'Live',
        tags: ['test', 'pattern'],
      },
    });

    // Check title
    expect(result).toContain('<h3>Test Pattern</h3>');
    // Check url
    expect(result).toContain('href="/patterns/test-pattern"');
    // Check status (StatusBadge renders a span with class status-badge)
    expect(result).toContain('Live');
    // Check meta
    expect(result).toContain('<span class="spec-card__meta mono">Oct 12, 2026</span>');
    // Check tags
    expect(result).toContain('<span class="spec-card__tag mono">test</span>');
    expect(result).toContain('<span class="spec-card__tag mono">pattern</span>');
    
    // Should NOT contain a description element
    expect(result).not.toContain('spec-card__description');
  });

  test('renders description when provided (PBI-64)', async () => {
    const container = await AstroContainer.create();
    const descriptionText = 'This is a test summary for the new article card design.';
    const result = await container.renderToString(SpecCard, {
      props: {
        title: 'Descriptive Pattern',
        url: '/patterns/desc-pattern',
        meta: 'Oct 13, 2026',
        description: descriptionText,
      },
    });

    // Check description is rendered
    expect(result).toContain('<p class="spec-card__description">This is a test summary for the new article card design.</p>');
  });
});
