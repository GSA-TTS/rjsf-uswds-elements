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
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).toHaveAccessibleName('Continue');
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

  it('forwards supported accessible attributes to the internal native button', async () => {
    document.body.innerHTML = `
      <p id="details">Deletes contact 1.</p>
      <uswds-button
        aria-controls="contact-menu"
        aria-describedby="details"
        aria-expanded="true"
        aria-haspopup="menu"
        aria-pressed="false"
        button-label="Remove contact 1"
        name="action"
        title="Remove this contact"
        value="remove"
      >Remove</uswds-button>
    `;

    const element = document.querySelector('uswds-button')!;
    await updateComplete(element);

    const button = element.shadowRoot!.querySelector('button')!;
    expect(element).not.toHaveAttribute('aria-label');
    expect(button).toHaveAccessibleName('Remove contact 1');
    expect(button).toHaveAttribute('aria-controls', 'contact-menu');
    expect(button).toHaveAttribute('aria-describedby', 'details');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('title', 'Remove this contact');
    expect(button).toHaveAttribute('value', 'remove');
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

  it('documents that bridged submit does not expose a native submitter', async () => {
    let submitter: SubmitEvent['submitter'] | undefined = undefined;
    document.body.innerHTML = `
      <form>
        <uswds-button type="submit" name="intent" value="save">Submit</uswds-button>
      </form>
    `;

    const form = document.querySelector('form')!;
    const element = document.querySelector('uswds-button')!;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitter = event.submitter;
    });
    await updateComplete(element);

    element.shadowRoot!.querySelector('button')!.click();

    expect(submitter).toBeNull();
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

  it('resets the containing form without submitting', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    document.body.innerHTML = `
      <form>
        <input name="project" value="Default project" />
        <uswds-button type="reset">Reset</uswds-button>
      </form>
    `;

    const form = document.querySelector('form')!;
    const input = document.querySelector('input')!;
    const element = document.querySelector('uswds-button')!;
    form.addEventListener('submit', onSubmit);
    await updateComplete(element);

    input.value = 'Changed project';
    element.shadowRoot!.querySelector('button')!.click();

    expect(input.value).toBe('Default project');
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
