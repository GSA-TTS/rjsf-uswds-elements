import { describe, expect, it } from 'vitest';
import '../src/components/uswds-alert.js';

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

describe('uswds-alert', () => {
  it('applies USWDS alert classes to the host in light DOM', async () => {
    document.body.innerHTML = `
      <uswds-alert type="success" slim no-icon>
        <div class="usa-alert__body">
          <h2 class="usa-alert__heading">Application submitted</h2>
          <p class="usa-alert__text">Your application was received.</p>
        </div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element.shadowRoot).toBeNull();
    expect(element).toHaveClass('usa-alert', 'usa-alert--success', 'usa-alert--slim');
    expect(element).toHaveClass('usa-alert--no-icon');
    expect(element.querySelector('.usa-alert__body')).not.toBeNull();
    expect(element.querySelector('.usa-alert__heading')).toHaveTextContent('Application submitted');
    expect(element.querySelector('.usa-alert__text')).toHaveTextContent(
      'Your application was received.',
    );
  });

  it('defaults to info without an implicit role', async () => {
    document.body.innerHTML = `
      <uswds-alert>
        <div class="usa-alert__body">Updates available.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveClass('usa-alert--info');
    expect(element).not.toHaveAttribute('role');
  });

  it('sets role=alert for error alerts', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error">
        <div class="usa-alert__body">Fix these errors.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'alert');
    expect(element).toHaveClass('usa-alert--error');
  });

  it('preserves explicit consumer roles', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error" role="status">
        <div class="usa-alert__body">Saved.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'status');
  });

  it('preserves explicit consumer role changes after upgrade', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error">
        <div class="usa-alert__body">Saved.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    element.setAttribute('role', 'status');
    element.setAttribute('slim', '');
    await updateComplete(element);

    expect(element).toHaveAttribute('role', 'status');
    expect(element).toHaveClass('usa-alert--slim');
  });

  it('falls back to info for unsupported alert types', async () => {
    document.body.innerHTML = `
      <uswds-alert type="urgent">
        <div class="usa-alert__body">Review this.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    expect(element).toHaveClass('usa-alert--info');
  });

  it('updates managed classes without moving children', async () => {
    document.body.innerHTML = `
      <uswds-alert class="app-alert" type="error">
        <div class="usa-alert__body">
          <p class="usa-alert__text">Review this.</p>
        </div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    const body = element.querySelector('.usa-alert__body');
    await updateComplete(element);

    element.setAttribute('type', 'warning');
    element.setAttribute('slim', '');
    await updateComplete(element);

    expect(element).toHaveClass('app-alert', 'usa-alert--warning', 'usa-alert--slim');
    expect(element).not.toHaveClass('usa-alert--error');
    expect(element.querySelectorAll('.usa-alert__body')).toHaveLength(1);
    expect(element.querySelector('.usa-alert__body')).toBe(body);
    expect(element.querySelector('.usa-alert__text')).toHaveTextContent('Review this.');
    expect(element).not.toHaveAttribute('role');
  });

  it('restores managed classes after a consumer class update', async () => {
    document.body.innerHTML = `
      <uswds-alert type="error">
        <div class="usa-alert__body">Fix these errors.</div>
      </uswds-alert>
    `;

    const element = document.querySelector('uswds-alert')!;
    await updateComplete(element);

    element.className = 'updated-consumer-class';
    await updateComplete(element);

    expect(element).toHaveClass('updated-consumer-class', 'usa-alert', 'usa-alert--error');
    expect(element.querySelectorAll('.usa-alert__body')).toHaveLength(1);
  });
});
