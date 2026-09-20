import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openFixtures(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Shadow DOM a11y fixtures' }).click();
  await expect(
    page.getByRole('heading', { name: 'Shadow DOM form accessibility regression fixtures' }),
  ).toBeVisible();
}

test.describe('shadow DOM form accessibility regression fixtures', () => {
  test('fixtures have no automated WCAG A/AA axe violations', async ({ page }) => {
    await openFixtures(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('light-DOM baseline exposes the expected accessible description', async ({ page }) => {
    await openFixtures(page);

    const input = page.locator('#light-dom-input');
    await expect(input).toHaveAccessibleName('Email address');
    await expect(input).toHaveAccessibleDescription(
      'Use your government email address. Enter a valid email address.',
    );
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('classic aria-describedby IDREFs do not cross into a shadow root', async ({ page }) => {
    await openFixtures(page);

    const input = page.locator('#classic-idref-shadow-input');
    await expect(input).toHaveAccessibleName('Email address');
    await expect(input).not.toHaveAccessibleDescription(/Use your government email address/);
    await expect(input).not.toHaveAccessibleDescription(/Enter a valid email address/);
  });

  test('element-reference API behavior is recorded for cross-shadow descriptions', async ({
    page,
    browserName,
  }, testInfo) => {
    await openFixtures(page);

    const result = await page.evaluate(() => {
      const input = document.querySelector<
        HTMLInputElement & { ariaDescribedByElements?: Element[] }
      >('#element-reference-shadow-input');
      const host = document.querySelector<HTMLElement>(
        '[data-spike-fixture="element-reference-shadow"] cross-shadow-described-by',
      );
      const hint = host?.shadowRoot?.querySelector<HTMLElement>('[data-spike-role="hint"]');
      const error = host?.shadowRoot?.querySelector<HTMLElement>('[data-spike-role="error"]');

      return {
        hasInput: input != null,
        hasHint: hint != null,
        hasError: error != null,
        propertySupported: input != null && 'ariaDescribedByElements' in input,
        describedByCount:
          input != null && 'ariaDescribedByElements' in input
            ? input.ariaDescribedByElements.length
            : 0,
      };
    });

    await testInfo.attach(`${browserName}-element-reference-result.json`, {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });

    testInfo.annotations.push({
      type: 'shadow-dom-a11y-spike',
      description: `${browserName}: ${JSON.stringify(result)}`,
    });

    expect(result.hasInput).toBe(true);
    expect(result.hasHint).toBe(true);
    expect(result.hasError).toBe(true);

    const input = page.locator('#element-reference-shadow-input');
    await expect(input).toHaveAccessibleName('Email address');

    if (result.propertySupported && result.describedByCount === 2) {
      await expect(input).toHaveAccessibleDescription(
        'Use your government email address. Enter a valid email address.',
      );
    } else {
      await expect(input).not.toHaveAccessibleDescription(/Use your government email address/);
    }
  });

  test('dynamic error updates are reflected in light DOM and shadow DOM fixtures', async ({
    page,
  }) => {
    await openFixtures(page);

    await page.getByRole('button', { name: 'Toggle error message' }).click();

    await expect(page.locator('#light-dom-input')).toHaveAccessibleDescription(
      'Use your government email address. Use an address ending in .gov or .mil.',
    );

    const result = await page.evaluate(() => {
      const elementReferenceHost = document.querySelector<HTMLElement>(
        '[data-spike-fixture="element-reference-shadow"] cross-shadow-described-by',
      );
      const wholeFieldHost = document.querySelector<HTMLElement>('whole-field-shadow');

      return {
        elementReferenceError:
          elementReferenceHost?.shadowRoot?.querySelector('[data-spike-role="error"]')
            ?.textContent ?? null,
        wholeFieldError:
          wholeFieldHost?.shadowRoot?.querySelector('#whole-shadow-error')?.textContent ?? null,
      };
    });

    expect(result).toEqual({
      elementReferenceError: 'Use an address ending in .gov or .mil.',
      wholeFieldError: 'Use an address ending in .gov or .mil.',
    });
  });

  test('whole-field shadow root exposes internal accessible relationships', async ({ page }) => {
    await openFixtures(page);

    const result = await page.evaluate(() => {
      const host = document.querySelector<HTMLElement>('whole-field-shadow');
      const input = host?.shadowRoot?.querySelector<HTMLInputElement>('#whole-shadow-input');

      return {
        hasHost: host != null,
        hasInput: input != null,
        describedBy: input?.getAttribute('aria-describedby') ?? null,
        invalid: input?.getAttribute('aria-invalid') ?? null,
      };
    });

    expect(result).toEqual({
      hasHost: true,
      hasInput: true,
      describedBy: 'whole-shadow-hint whole-shadow-error',
      invalid: 'true',
    });
  });
});
