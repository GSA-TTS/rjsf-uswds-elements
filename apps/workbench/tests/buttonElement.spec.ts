import { expect, test, type Page } from '@playwright/test';

async function openGallery(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Button' })).toBeVisible();
}

test.describe('uswds-button', () => {
  test('gallery examples expose accessible shadow-owned buttons', async ({ page }) => {
    await openGallery(page);

    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('RJSF submit button submits from the custom element', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('heading', { name: 'Last submitted' })).toBeVisible();
  });
});
