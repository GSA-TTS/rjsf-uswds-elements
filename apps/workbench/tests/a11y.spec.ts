import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './helpers/accessibility';

test('playground has no WCAG A/AA axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'RJSF + USWDS Theme Workbench' })).toBeVisible();
  await expectNoAxeViolations(page, 'playground');
});

test('component gallery has no WCAG A/AA axe violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Text input' })).toBeVisible();
  await expectNoAxeViolations(page, 'component gallery');
});
