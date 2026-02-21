import { test, expect } from '@playwright/test';

test.describe('Article Cards Verification', () => {
  test('Patterns index renders article cards with summaries and correct metadata', async ({ page }) => {
    // Navigate to the patterns index
    await page.goto('/patterns');

    // Wait for the spec grid to be visible
    await page.waitForSelector('.spec-grid');

    // Locate the first article card
    const firstCard = page.locator('.spec-card').first();
    await expect(firstCard).toBeVisible();

    // Verify title is present
    const title = firstCard.locator('h3');
    await expect(title).toBeVisible();

    // Verify status badge is present (most patterns have one)
    const statusBadge = firstCard.locator('.status-badge');
    if (await statusBadge.count() > 0) {
      await expect(statusBadge).toBeVisible();
    }

    // Verify the description/summary paragraph is rendered
    const description = firstCard.locator('.spec-card__description');
    await expect(description).toBeVisible();
    
    // Verify the description contains actual text content
    const descText = await description.textContent();
    expect(descText?.length).toBeGreaterThan(5);

    // Verify metadata (date) is present
    const metaDate = firstCard.locator('.spec-card__meta');
    await expect(metaDate).toBeVisible();
    
    // Check typography styling properties computed by the browser
    // The meta date should use font-family var(--f-mono) and color var(--c-dim)
    const metaColor = await metaDate.evaluate((el) => window.getComputedStyle(el).color);
    // --c-dim is #585855 which is rgb(88, 88, 85)
    expect(metaColor).toBe('rgb(88, 88, 85)');
  });
});
