import { describe, expect, it } from 'vitest';
import '../src/components/uswds-button.js';

function renderButton(markup: string) {
  document.body.innerHTML = markup;
  return document.body.querySelector('uswds-button')!;
}

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

describe('uswds-button', () => {
  it('creates a light-DOM native button for static body content', async () => {
    const element = renderButton('<uswds-button>Continue</uswds-button>');
    await updateComplete(element);

    const button = element.querySelector('button')!;
    expect(element.shadowRoot).toBeNull();
    expect(button).toHaveTextContent('Continue');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('usa-button');
  });

  it('applies host and owned-button variant classes for static markup', async () => {
    const element = renderButton('<uswds-button variant="outline">Back</uswds-button>');
    await updateComplete(element);

    const button = element.querySelector('button')!;
    expect(element).toHaveClass('usa-button', 'usa-button--outline');
    expect(button).toHaveClass('usa-button', 'usa-button--outline');

    element.setAttribute('variant', 'unstyled');
    await updateComplete(element);

    expect(element).toHaveClass('usa-button', 'usa-button--unstyled');
    expect(element).not.toHaveClass('usa-button--outline');
    expect(button).toHaveClass('usa-button', 'usa-button--unstyled');
    expect(button).not.toHaveClass('usa-button--outline');
  });

  it('does not mutate an existing native button owned by a framework', async () => {
    const element = renderButton(
      '<uswds-button variant="outline"><button class="app-button" type="submit">Save</button></uswds-button>',
    );
    const button = element.querySelector('button')!;
    await updateComplete(element);

    expect(element.querySelector('button')).toBe(button);
    expect(element).toHaveClass('usa-button', 'usa-button--outline');
    expect(button).toHaveClass('app-button');
    expect(button).not.toHaveClass('usa-button');
    expect(button).toHaveAttribute('type', 'submit');

    element.setAttribute('variant', 'unstyled');
    await updateComplete(element);

    expect(button).toHaveClass('app-button');
    expect(button).not.toHaveClass('usa-button--unstyled');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('preserves consumer classes on the host across variant updates', async () => {
    const element = renderButton('<uswds-button class="app-wrapper">Continue</uswds-button>');
    await updateComplete(element);

    element.className = 'updated-wrapper';
    element.setAttribute('variant', 'outline');
    await updateComplete(element);

    expect(element).toHaveClass('updated-wrapper', 'usa-button', 'usa-button--outline');
  });
});
