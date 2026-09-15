import { describe, expect, it } from 'vitest';
import '../src/components/uswds-error-message.js';

describe('uswds-error-message', () => {
  it('wraps slotted text in the USWDS error message class in light DOM', async () => {
    document.body.innerHTML = '<uswds-error-message>Enter a project name.</uswds-error-message>';

    const element = document.querySelector('uswds-error-message')!;
    await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const message = element.querySelector('span.usa-error-message');
    expect(message).not.toBeNull();
    expect(message).toHaveTextContent('Enter a project name.');
    expect(element.shadowRoot).toBeNull();
  });

  it('preserves an existing USWDS error message fallback', async () => {
    document.body.innerHTML = `
      <uswds-error-message>
        <span id="field-error" class="usa-error-message">Select an agency.</span>
      </uswds-error-message>
    `;

    const element = document.querySelector('uswds-error-message')!;
    await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const messages = element.querySelectorAll('span.usa-error-message');
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveAttribute('id', 'field-error');
    expect(messages[0]).toHaveTextContent('Select an agency.');
  });
});
