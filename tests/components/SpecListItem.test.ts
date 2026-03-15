import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe } from 'vitest';
import SpecListItem from '../../src/components/SpecListItem.astro';

describe('SpecListItem Component', () => {
  test('renders as a dense row with title, status, tags, and meta', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Context Gates',
        url: '/patterns/context-gates',
        meta: 'Mar 15, 2026',
        status: 'Live',
        tags: ['Architecture', 'Governance'],
      },
    });

    // Root element is a semantic <a> tag
    expect(result).toMatch(/<a[^>]*href="\/patterns\/context-gates"[^>]*class="spec-list-item"/);

    // Title renders in an h3 by default
    expect(result).toMatch(/<h3[^>]*class="spec-list-item__title"[^>]*>Context Gates<\/h3>/);

    // Status badge is present
    expect(result).toContain('Live');

    // Tags are rendered with mono class
    expect(result).toMatch(/<span class="spec-list-item__tag mono"[^>]*>Architecture<\/span>/);
    expect(result).toMatch(/<span class="spec-list-item__tag mono"[^>]*>Governance<\/span>/);

    // Meta date is rendered
    expect(result).toMatch(/<span class="spec-list-item__meta mono"[^>]*>Mar 15, 2026<\/span>/);
  });

  test('renders gracefully with only required props (title and url)', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Minimal Item',
        url: '/concepts/minimal',
      },
    });

    // Title and link are present
    expect(result).toContain('href="/concepts/minimal"');
    expect(result).toContain('Minimal Item');

    // No status badge or tags rendered
    expect(result).not.toContain('status-badge');
    expect(result).not.toContain('spec-list-item__tag');
    // The meta-group wrapper exists but no meta span with content
    expect(result).not.toMatch(/<span[^>]*class="spec-list-item__meta mono"/);
  });

  test('root element is a semantic <a> tag, not a div', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Semantic Check',
        url: '/patterns/semantic',
      },
    });

    // The first meaningful element should be an <a> with class spec-list-item
    expect(result).toMatch(/<a[^>]*class="spec-list-item"/);
    // Should not have a wrapping div with onclick
    expect(result).not.toMatch(/<div[^>]*onclick/);
  });

  test('respects custom headingLevel prop', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Custom Heading',
        url: '/concepts/heading',
        headingLevel: 'h2',
      },
    });

    expect(result).toMatch(/<h2[^>]*class="spec-list-item__title"[^>]*>Custom Heading<\/h2>/);
  });
});
