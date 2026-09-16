import { describe, expect, it } from 'vitest';
import '../src/components/uswds-hint-shadow-spike.js';
import { UswdsHintShadowSpike } from '../src/components/uswds-hint-shadow-spike.js';
import { supportsConstructableStyleSheets } from '../src/styles/hint-shadow-spike.js';

async function renderHint(markup: string) {
  document.body.innerHTML = markup;
  const element = document.querySelector('uswds-hint-shadow-spike')!;
  await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  return element as UswdsHintShadowSpike;
}

describe('uswds-hint-shadow-spike', () => {
  it('renders USWDS hint markup inside shadow DOM', async () => {
    const element = await renderHint(
      '<uswds-hint-shadow-spike>Helpful text.</uswds-hint-shadow-spike>',
    );

    const hint = element.shadowRoot!.querySelector('.usa-hint');
    const slot = element.shadowRoot!.querySelector('slot')!;
    expect(hint).not.toBeNull();
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).toContain('Helpful text.');
    expect(element.querySelector('.usa-hint')).toBeNull();
  });

  it('can reuse the same stylesheet instance across shadow roots when the browser supports it', async () => {
    if (!supportsConstructableStyleSheets()) {
      expect(UswdsHintShadowSpike.sharedStyleSheet).toBeUndefined();
      return;
    }

    document.body.innerHTML = `
      <uswds-hint-shadow-spike>First hint.</uswds-hint-shadow-spike>
      <uswds-hint-shadow-spike>Second hint.</uswds-hint-shadow-spike>
    `;

    const elements = Array.from(document.querySelectorAll('uswds-hint-shadow-spike'));
    await Promise.all(
      elements.map(
        (element) => (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete,
      ),
    );

    expect(elements[0].shadowRoot!.adoptedStyleSheets[0]).toBe(
      elements[1].shadowRoot!.adoptedStyleSheets[0],
    );
    expect(elements[0].shadowRoot!.adoptedStyleSheets[0]).toBe(
      UswdsHintShadowSpike.sharedStyleSheet,
    );
  });

  it('keeps the host id in light DOM for aria-describedby but hides hint text inside shadow DOM', async () => {
    document.body.innerHTML = `
      <label for="field">Project name</label>
      <input id="field" aria-describedby="field-hint">
      <uswds-hint-shadow-spike id="field-hint">Enter the official project name.</uswds-hint-shadow-spike>
    `;

    const element = document.getElementById('field-hint') as UswdsHintShadowSpike;
    await element.updateComplete;

    const input = document.getElementById('field')!;
    expect(input).toHaveAttribute('aria-describedby', 'field-hint');
    expect(document.getElementById('field-hint')).toBe(element);
    expect(element.textContent).toContain('Enter the official project name.');
    expect(element.querySelector('.usa-hint')).toBeNull();
    const slot = element.shadowRoot!.querySelector('slot')!;
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).toContain('Enter the official project name.');
  });
});
