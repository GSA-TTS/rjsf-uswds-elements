import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './helpers/accessibility';

async function openSpike(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Button form spike' }).click();
  await expect(page.getByRole('heading', { name: 'Button form behavior spike' })).toBeVisible();
}

async function buttonInShadowHost(host: Locator) {
  return host.locator('button');
}

test.describe('button form behavior spike', () => {
  test('fixtures have no automated WCAG A/AA axe violations', async ({ page }) => {
    await openSpike(page);

    await expectNoAxeViolations(page, 'button form behavior spike');
  });

  test('shadow DOM owned submit requests the containing form exactly once', async ({ page }) => {
    await openSpike(page);

    await expect(page.locator('spike-shadow-button[type="submit"] button').first()).toBeVisible();
    await expect(
      page
        .locator('spike-shadow-button[type="submit"]')
        .first()
        .evaluate((host) => host.querySelectorAll(':scope > button').length),
    ).resolves.toBe(0);
    await page.getByRole('button', { name: 'Submit shadow form' }).click();

    await expect(page.getByText('Shadow submit count: 1')).toBeVisible();
  });

  test('shadow DOM owned type=button does not submit the form', async ({ page }) => {
    await openSpike(page);

    await page.getByRole('button', { name: 'Non-submit shadow button' }).click();

    await expect(page.getByText('Shadow submit count: 0')).toBeVisible();
  });

  test('shadow DOM owned disabled submit does not submit the form', async ({ page }) => {
    await openSpike(page);

    const button = await buttonInShadowHost(page.locator('spike-shadow-button[disabled]'));
    await expect(button).toBeDisabled();
    await button.click({ force: true });

    await expect(page.getByText('Shadow submit count: 0')).toBeVisible();
  });

  test('shadow DOM owned button supports keyboard activation and focus', async ({ page }) => {
    await openSpike(page);

    const button = page.getByRole('button', { name: 'Submit shadow form' });
    await button.focus();
    await expect(button).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.getByText('Shadow submit count: 1')).toBeVisible();
  });

  test('light DOM owned button follows native submit behavior', async ({ page }) => {
    await openSpike(page);

    await page.getByRole('button', { name: 'Submit light form' }).click();
    await page.getByRole('button', { name: 'Non-submit light button' }).click();
    await page.getByRole('button', { name: 'Disabled light submit' }).click({ force: true });

    await expect(page.getByText('Light submit count: 1')).toBeVisible();
  });

  test('native button baseline submits exactly once', async ({ page }) => {
    await openSpike(page);

    await page.getByRole('button', { name: 'Submit native form' }).click();
    await page.getByRole('button', { name: 'Non-submit native button' }).click();
    await page.getByRole('button', { name: 'Disabled native submit' }).click({ force: true });

    await expect(page.getByText('Native submit count: 1')).toBeVisible();
  });
});
