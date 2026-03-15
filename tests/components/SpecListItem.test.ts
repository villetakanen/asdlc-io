import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe } from 'vitest';
import SpecListItem from '../../src/components/SpecListItem.astro';

describe('SpecListItem Component', () => {
  test('renders with title and description', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Context Gates',
        url: '/patterns/context-gates',
        description: 'Input filtering and output validation',
      },
    });

    // Root element is a semantic <a> tag
    expect(result).toMatch(/<a[^>]*href="\/patterns\/context-gates"[^>]*class="spec-list-item"/);

    // Title is rendered
    expect(result).toMatch(/<span[^>]*class="spec-list-item__title"[^>]*>Context Gates<\/span>/);

    // Description is rendered
    expect(result).toMatch(/<span[^>]*class="spec-list-item__desc mono"[^>]*>Input filtering and output validation<\/span>/);
  });

  test('renders with title only when description is omitted', async () => {
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

    // No description rendered
    expect(result).not.toContain('spec-list-item__desc');
  });

  test('root element is a semantic <a> tag, not a div', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Semantic Check',
        url: '/patterns/semantic',
      },
    });

    expect(result).toMatch(/<a[^>]*class="spec-list-item"/);
    expect(result).not.toMatch(/<div[^>]*onclick/);
  });

  test('does not render status, tags, or meta fields', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SpecListItem, {
      props: {
        title: 'Clean Item',
        url: '/concepts/clean',
        description: 'A clean item',
      },
    });

    expect(result).not.toContain('status-badge');
    expect(result).not.toContain('spec-list-item__tag');
    expect(result).not.toContain('spec-list-item__meta');
  });
});
