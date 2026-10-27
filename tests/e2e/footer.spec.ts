import { expect, test } from '@playwright/test';

// Contract: specs/site-footer/spec.md
const badgeName = 'Privacy-friendly analytics by Simple Analytics';
const badgeUrl = 'https://simpleanalyticsbadges.com/asdlc.io?mode=light&counter=false';

test.use({ javaScriptEnabled: false, colorScheme: 'dark' });

for (const width of [320, 1280]) {
  for (const path of ['/', '/concepts/agentic-sdlc/', '/recipes/spec-engineer/']) {
    test(`badge works without JavaScript at ${width}px on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      // Keep layout/privacy checks deterministic and independent of the provider.
      await page.route('https://simpleanalyticsbadges.com/**', (route) =>
        route.fulfill({
          contentType: 'image/svg+xml',
          headers: { 'access-control-allow-origin': '*' },
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="210" height="50"><text x="4" y="25">Simple Analytics</text></svg>',
        }),
      );
      await page.goto(path);
      const badge = page.getByRole('img', { name: badgeName });
      const link = page.getByRole('link', { name: badgeName });
      await expect(badge).toHaveCount(1);
      await badge.scrollIntoViewIfNeeded();
      await expect(badge).toBeVisible();
      await expect(badge).toHaveAttribute('src', badgeUrl);
      await expect(badge).toHaveAttribute('width', '210');
      await expect(badge).toHaveAttribute('height', '50');
      await expect(badge).toHaveAttribute('loading', 'lazy');
      await expect(badge).toHaveAttribute('referrerpolicy', 'no-referrer');
      await expect(badge).toHaveAttribute('crossorigin', 'anonymous');
      await expect(link).toHaveAttribute('href', 'https://www.simpleanalytics.com?utm_source=asdlc.io&utm_content=badge');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener');
      await expect(link).toHaveAttribute('referrerpolicy', 'origin');
      // OS dark mode must not change the light badge or crowd its surroundings.
      await expect(link).toHaveCSS('color-scheme', 'light only');
      await expect(link).toHaveCSS('padding-top', '6px');
      await expect(link).toHaveCSS('padding-bottom', '6px');
      await expect(page.locator('script[src="https://scripts.simpleanalyticscdn.com/latest.js"]')).toHaveCount(1);
      await expect(page.locator('footer')).toContainText('Release v');
      await expect(page.locator('footer').getByRole('link', { name: 'GitHub' })).toBeVisible();
      const bounds = await badge.boundingBox();
      expect(bounds).not.toBeNull();
      if (bounds) {
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
      // Shift-tab from the following link reaches the badge via keyboard.
      await page.locator('footer').getByRole('link', { name: 'GitHub' }).focus();
      await page.keyboard.press('Shift+Tab');
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link).toHaveCSS('outline-width', '2px');
    });
  }
}

test('failed badge image leaves accessible attribution and footer navigation', async ({ page }) => {
  await page.route('https://simpleanalyticsbadges.com/**', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('img', { name: badgeName }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: badgeName })).toBeVisible();
  await expect(page.locator('footer').getByRole('link', { name: 'GitHub' })).toBeVisible();
  await expect(page.locator('footer')).toContainText('Release v');
});
