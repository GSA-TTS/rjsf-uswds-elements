import { expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function expectNoAxeViolations(page: Page, pageName: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations, `${pageName} should have no WCAG A/AA axe violations`).toEqual([]);
}

export async function expectTabOrder(page: Page, expectedFocusOrder: Locator[]) {
  for (const target of expectedFocusOrder) {
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
  }
}
