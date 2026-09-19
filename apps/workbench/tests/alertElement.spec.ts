import { expect, test, type Page } from '@playwright/test';

async function openGallery(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Alert' })).toBeVisible();
}

test.describe('uswds-alert', () => {
  test('gallery alert exposes alert semantics and slotted links', async ({ page }) => {
    await openGallery(page);

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('This form has 2 errors')).toBeVisible();

    const link = page.getByRole('link', { name: 'Project name: Enter a project name.' });
    await expect(link).toBeVisible();
    await link.focus();
    await expect(link).toBeFocused();
  });
});
