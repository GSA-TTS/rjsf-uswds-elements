import { describe, expect, it } from 'vitest';
import '../src/components/uswds-alert.js';

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

describe('uswds-alert', () => {
  it('renders the USWDS alert shell in shadow DOM', async () => {
    document.body.innerHTML = `
      <uswds-alert type="success" heading="Application submitted" slim no-icon>
        <p>Your application was received.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element.shadowRoot).not.toBeNull();
    expect(element.querySelector('.usa-alert__body')).toBeNull();

    const alert = element.shadowRoot!.querySelector('[part="alert"]');
    expect(alert).toHaveClass('usa-alert', 'usa-alert--success', 'usa-alert--slim');
    expect(alert).toHaveClass('usa-alert--no-icon');
    expect(element.shadowRoot!.querySelector('[part="body"]')).toHaveClass('usa-alert__body');
    expect(element.shadowRoot!.querySelector('[part="heading"]')).toHaveClass('usa-alert__heading');
    expect(element.shadowRoot!.querySelector('[part="heading"]')).toHaveTextContent(
      'Application submitted',
    );
    expect(element.querySelector('p')).toHaveTextContent('Your application was received.');
  });

  it('defaults to info without an implicit role', async () => {
    document.body.innerHTML = `
      <uswds-alert heading="Updates available">
        <p>Review the latest status.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element.shadowRoot!.querySelector('[part="alert"]')).toHaveClass('usa-alert--info');
    expect(element).not.toHaveAttribute('role');
  });

  it('sets role=alert for error alerts', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error" heading="Fix these errors">
        <p>Review the messages below.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'alert');
    expect(element.shadowRoot!.querySelector('[part="alert"]')).toHaveClass('usa-alert--error');
  });

  it('preserves explicit consumer roles', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error" role="status" heading="Saved">
        <p>Your changes were saved.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'status');
  });

  it('preserves explicit consumer role changes after upgrade', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error" heading="Saved">
        <p>Your changes were saved.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    element.setAttribute('role', 'status');
    element.setAttribute('slim', '');
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'status');
    expect(element.shadowRoot!.querySelector('[part="alert"]')).toHaveClass('usa-alert--slim');
  });

  it('falls back to info for unsupported alert types', async () => {
    document.body.innerHTML = `
      <uswds-alert type="urgent" heading="Review this">
        <p>Review this.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element.shadowRoot!.querySelector('[part="alert"]')).toHaveClass('usa-alert--info');
  });

  it('updates managed classes without moving slotted children', async () => {
    document.body.innerHTML = `
      <uswds-alert class="app-alert" type="error" heading="Review this">
        <p>Review this.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    const paragraph = element.querySelector('p');
    await updateComplete(element);

    element.setAttribute('type', 'warning');
    element.setAttribute('slim', '');
    await updateComplete(element);

    const alert = element.shadowRoot!.querySelector('[part="alert"]');
    expect(element).toHaveClass('app-alert');
    expect(alert).toHaveClass('usa-alert--warning', 'usa-alert--slim');
    expect(alert).not.toHaveClass('usa-alert--error');
    expect(element.querySelector('p')).toBe(paragraph);
    expect(element.querySelector('p')).toHaveTextContent('Review this.');
    expect(element).not.toHaveAttribute('role');
  });

  it('updates the component-owned heading when the heading attribute changes', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error" heading="Fix 1 error">
        <p>Review this.</p>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    element.setAttribute('heading', 'Fix 2 errors');
    await updateComplete(element);

    expect(element.shadowRoot!.querySelector('[part="heading"]')).toHaveTextContent('Fix 2 errors');
    expect(element.querySelector('.usa-alert__heading')).toBeNull();
  });
});
