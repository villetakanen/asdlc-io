import { test, expect } from '@playwright/test';

test.describe('Design System: Overview Page', () => {
  test('displays Design Philosophy section with h1 and h2', async ({ page }) => {
    await page.goto('/resources/design-system');

    // H1 is visible (use first() since a component example may contain another h1)
    const h1 = page.locator('article.design-system > section h1');
    await expect(h1).toHaveText('Avionics Design System');

    // H2 subtitle is visible
    const h2 = page.locator('h2', { hasText: 'Design Philosophy' });
    await expect(h2).toBeVisible();

    // Intro paragraphs are present (scoped to the philosophy section)
    const introSection = page.locator('article.design-system > section.prose');
    await expect(introSection.locator('text=Timeless Industrial')).toBeVisible();
    await expect(introSection.locator('text=Airbus cockpits')).toBeVisible();
  });

  test('renders all 8 sections with separators', async ({ page }) => {
    await page.goto('/resources/design-system');

    // All section containers should be in the DOM
    const sections = page.locator('.ds-section');
    await expect(sections).toHaveCount(8);

    // Each section is followed by an <hr> when rendering all sections
    const separators = page.locator('.prose.content-prose hr');
    const count = await separators.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('navigation shows Overview as active', async ({ page }) => {
    await page.goto('/resources/design-system');

    const nav = page.locator('nav.ds-nav');
    await expect(nav).toBeVisible();

    const overviewLink = nav.locator('a', { hasText: 'Overview' });
    await expect(overviewLink).toHaveClass(/active/);
  });
});

test.describe('Design System: Isolated Section Views', () => {
  test('section route renders only the target section', async ({ page }) => {
    await page.goto('/resources/design-system/typography');

    // Only 1 section should be in the DOM
    const sections = page.locator('.ds-section');
    await expect(sections).toHaveCount(1);

    // Typography nav link should be active
    const nav = page.locator('nav.ds-nav');
    const typographyLink = nav.locator('a', { hasText: 'Typography' });
    await expect(typographyLink).toHaveClass(/active/);

    // Overview link should NOT be active
    const overviewLink = nav.locator('a', { hasText: 'Overview' });
    await expect(overviewLink).not.toHaveClass(/active/);
  });

  test('philosophy section is hidden on isolated views', async ({ page }) => {
    await page.goto('/resources/design-system/colors');

    // The DS page h1 should not be in the DOM
    const h1 = page.locator('article.design-system > section h1');
    await expect(h1).toHaveCount(0);

    // Design Philosophy h2 should not be in the DOM
    const philosophy = page.locator('h2', { hasText: 'Design Philosophy' });
    await expect(philosophy).toHaveCount(0);

    // Intro text should not be present
    await expect(page.locator('text=Timeless Industrial')).toHaveCount(0);
  });

  test('navigation bar is visible on isolated views', async ({ page }) => {
    await page.goto('/resources/design-system/layout');

    const nav = page.locator('nav.ds-nav');
    await expect(nav).toBeVisible();

    // All section links should be present
    const navLinks = nav.locator('a');
    // 9 links: Overview + 8 sections
    await expect(navLinks).toHaveCount(9);
  });
});

test.describe('Design System: Component Sub-Routes', () => {
  test('component sub-route isolates a single component doc', async ({ page }) => {
    await page.goto('/resources/design-system/components/border-box');

    // Philosophy should be hidden
    const h1 = page.locator('article.design-system > section h1');
    await expect(h1).toHaveCount(0);

    // Components nav link should be active
    const nav = page.locator('nav.ds-nav');
    const componentsLink = nav.locator('a', { hasText: 'Components' });
    await expect(componentsLink).toHaveClass(/active/);
  });
});

test.describe('Design System: Navigation Active States', () => {
  const routes = [
    { path: '/resources/design-system', active: 'Overview' },
    { path: '/resources/design-system/colors', active: 'Color Palette' },
    { path: '/resources/design-system/typography', active: 'Typography' },
    { path: '/resources/design-system/components', active: 'Components' },
    { path: '/resources/design-system/components/spec-header', active: 'Components' },
  ];

  for (const { path, active } of routes) {
    test(`"${active}" is active on ${path}`, async ({ page }) => {
      await page.goto(path);

      const nav = page.locator('nav.ds-nav');
      const activeLink = nav.locator('a.active');
      await expect(activeLink).toHaveText(active);
    });
  }
});
