import { describe, expect, it, vi } from 'vitest';
import '../src/components/uswds-button.js';

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

describe('uswds-button', () => {
  it('renders a component-owned native button in shadow DOM', async () => {
    document.body.innerHTML = `<uswds-button variant="outline">Continue</uswds-button>`;

    const element = document.querySelector('uswds-button')!;
    await updateComplete(element);

    expect(element.shadowRoot).not.toBeNull();
    expect(element.querySelector('button')).toBeNull();

    const button = element.shadowRoot!.querySelector('button')!;
    expect(button).toHaveClass('usa-button', 'usa-button--outline');
    expect(button).toHaveAttribute('type', 'button');
    expect(element).toHaveTextContent('Continue');
    expect(button.querySelector('slot')).not.toBeNull();
  });

  it('falls back to primary button type and variant for unsupported values', async () => {
    document.body.innerHTML = `<uswds-button type="menu" variant="ghost">Continue</uswds-button>`;

    const element = document.querySelector('uswds-button')!;
    await updateComplete(element);

    const button = element.shadowRoot!.querySelector('button')!;
    expect(element).toHaveAttribute('type', 'button');
    expect(element).toHaveAttribute('variant', 'primary');
    expect(button).toHaveClass('usa-button');
    expect(button).not.toHaveClass('usa-button--outline', 'usa-button--unstyled');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('forwards button-label to the internal native button', async () => {
    document.body.innerHTML = `
      <uswds-button button-label="Remove contact 1">Remove</uswds-button>
    `;

    const element = document.querySelector('uswds-button')!;
    await updateComplete(element);

    expect(element).not.toHaveAttribute('aria-label');
    expect(element.shadowRoot!.querySelector('button')).toHaveAccessibleName('Remove contact 1');
  });

  it('bridges type=submit to the containing form exactly once', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    document.body.innerHTML = `
      <form>
        <uswds-button type="submit">Submit</uswds-button>
      </form>
    `;

    const form = document.querySelector('form')!;
    const element = document.querySelector('uswds-button')!;
    form.addEventListener('submit', onSubmit);
    await updateComplete(element);

    element.shadowRoot!.querySelector('button')!.click();

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not submit the form for type=button', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    document.body.innerHTML = `
      <form>
        <uswds-button type="button">Do not submit</uswds-button>
      </form>
    `;

    const form = document.querySelector('form')!;
    const element = document.querySelector('uswds-button')!;
    form.addEventListener('submit', onSubmit);
    await updateComplete(element);

    element.shadowRoot!.querySelector('button')!.click();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit when disabled', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    document.body.innerHTML = `
      <form>
        <uswds-button type="submit" disabled>Submit</uswds-button>
      </form>
    `;

    const form = document.querySelector('form')!;
    const element = document.querySelector('uswds-button')!;
    form.addEventListener('submit', onSubmit);
    await updateComplete(element);

    const button = element.shadowRoot!.querySelector('button')!;
    expect(button).toBeDisabled();
    button.click();

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
