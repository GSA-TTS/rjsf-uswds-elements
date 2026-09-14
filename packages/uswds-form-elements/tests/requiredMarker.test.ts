import { describe, expect, it } from 'vitest';
import '../src/components/uswds-required-marker.js';

describe('uswds-required-marker', () => {
  it('renders the USWDS required marker in light DOM', async () => {
    document.body.innerHTML = '<uswds-required-marker></uswds-required-marker>';

    const element = document.querySelector('uswds-required-marker')!;
    await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const marker = element.querySelector('abbr.usa-hint.usa-hint--required');
    expect(marker?.getAttribute('title')).toBe('required');
    expect(marker?.textContent?.trim()).toBe('*');
    expect(element.shadowRoot).toBeNull();
  });
});
