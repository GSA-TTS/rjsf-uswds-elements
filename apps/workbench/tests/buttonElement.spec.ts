import { expect, test, type Page } from '@playwright/test';

async function openGallery(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Button' })).toBeVisible();
}

async function addProductionButtonFixture(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    const fixture = document.createElement('section');
    fixture.setAttribute('data-testid', 'production-button-fixture');
    fixture.innerHTML = `
      <form>
        <label>
          Project name
          <input name="project" value="Default project" />
        </label>
        <uswds-button type="submit">Submit production form</uswds-button>
        <uswds-button type="button">Non-submit production button</uswds-button>
        <uswds-button type="submit" disabled>Disabled production submit</uswds-button>
        <uswds-button type="reset">Reset production form</uswds-button>
      </form>
      <p aria-live="polite">Production submit count: <span>0</span></p>
    `;
    document.body.append(fixture);

    const form = fixture.querySelector('form')!;
    const count = fixture.querySelector('span')!;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      count.textContent = String(Number(count.textContent) + 1);
    });
  });
}

test.describe('uswds-button', () => {
  test('gallery examples expose accessible shadow-owned buttons', async ({ page }) => {
    await openGallery(page);

    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('production element preserves form submit, non-submit, disabled, keyboard, and reset behavior', async ({
    page,
  }) => {
    await addProductionButtonFixture(page);

    await page.getByRole('button', { name: 'Submit production form' }).click();
    await expect(page.getByText('Production submit count: 1')).toBeVisible();

    await page.getByRole('button', { name: 'Non-submit production button' }).click();
    await expect(page.getByText('Production submit count: 1')).toBeVisible();

    await page.getByRole('button', { name: 'Disabled production submit' }).click({ force: true });
    await expect(page.getByText('Production submit count: 1')).toBeVisible();

    const submit = page.getByRole('button', { name: 'Submit production form' });
    await submit.focus();
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Production submit count: 2')).toBeVisible();

    const input = page.getByLabel('Project name');
    await input.fill('Changed project');
    await page.getByRole('button', { name: 'Reset production form' }).click();
    await expect(input).toHaveValue('Default project');
    await expect(page.getByText('Production submit count: 2')).toBeVisible();
  });

  test('RJSF submit button submits from the custom element', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('heading', { name: 'Last submitted' })).toBeVisible();
  });
});
