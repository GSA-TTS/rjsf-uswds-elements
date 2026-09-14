import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function expectNoAxeViolations(pageName: string, page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations, `${pageName} should have no WCAG A/AA axe violations`).toEqual([]);
}

test('playground has no WCAG A/AA axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'RJSF + USWDS Theme Workbench' })).toBeVisible();
  await expectNoAxeViolations('playground', page);
});

test('component gallery has no WCAG A/AA axe violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Text input' })).toBeVisible();
  await expectNoAxeViolations('component gallery', page);
});
