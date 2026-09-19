import { expect, test, type Page } from '@playwright/test';

async function openGallery(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Component gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Alert' })).toBeVisible();
}

async function addErrorSummaryFixture(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    const fixture = document.createElement('section');
    fixture.innerHTML = `
      <form>
        <uswds-alert type="error" heading="This form has 2 errors">
          <ul>
            <li><a href="#project-name">Project name: Enter a project name.</a></li>
            <li><a href="#project-type">Project type: Select a project type.</a></li>
          </ul>
        </uswds-alert>
        <label for="project-name">Project name</label>
        <input id="project-name" />
        <fieldset id="project-type">
          <legend>Project type</legend>
          <label><input id="project-type-highway" type="radio" name="project-type" />Highway</label>
          <label><input type="radio" name="project-type" />Energy</label>
        </fieldset>
      </form>
    `;
    fixture.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const id = link.getAttribute('href')!.slice(1);
        const target = document.getElementById(id);
        const focusTarget =
          target instanceof HTMLInputElement
            ? target
            : target?.querySelector<HTMLElement>('input, select, textarea, button');
        focusTarget?.focus();
      });
    });
    document.body.append(fixture);
  });
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

  test('error-summary links support keyboard activation to invalid controls', async ({ page }) => {
    await addErrorSummaryFixture(page);

    await expect(page.getByRole('alert')).toBeVisible();

    const projectNameLink = page.getByRole('link', { name: /Project name:/ });
    await projectNameLink.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#project-name')).toBeFocused();

    const projectTypeLink = page.getByRole('link', { name: /Project type:/ });
    await projectTypeLink.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#project-type-highway')).toBeFocused();
  });
});
