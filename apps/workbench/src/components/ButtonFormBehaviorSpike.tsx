import { createElement, useEffect, useState } from 'react';

class SpikeShadowButtonElement extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'type'];
  }

  private button?: HTMLButtonElement;

  connectedCallback() {
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host { display: inline-block; }
          button { font: inherit; }
        </style>
        <button class="usa-button" part="button"><slot></slot></button>
      `;
      this.button = root.querySelector('button') ?? undefined;
      this.button?.addEventListener('click', (event) => this.handleClick(event));
    } else {
      this.button = this.shadowRoot.querySelector('button') ?? undefined;
    }

    this.syncButton();
  }

  attributeChangedCallback() {
    this.syncButton();
  }

  private syncButton() {
    if (!this.button) {
      return;
    }

    this.button.type = this.buttonType() === 'submit' ? 'submit' : 'button';
    this.button.disabled = this.hasAttribute('disabled');
  }

  private buttonType() {
    return this.getAttribute('type') === 'submit' ? 'submit' : 'button';
  }

  private handleClick(event: MouseEvent) {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.buttonType() !== 'submit') {
      return;
    }

    event.preventDefault();
    this.closest('form')?.requestSubmit();
  }
}

class SpikeLightButtonElement extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'type'];
  }

  private button?: HTMLButtonElement;

  connectedCallback() {
    if (!this.button) {
      const button = document.createElement('button');
      button.className = 'usa-button';
      button.replaceChildren(...Array.from(this.childNodes));
      this.append(button);
      this.button = button;
    }

    this.syncButton();
  }

  attributeChangedCallback() {
    this.syncButton();
  }

  private syncButton() {
    if (!this.button) {
      return;
    }

    this.button.type = this.getAttribute('type') === 'submit' ? 'submit' : 'button';
    this.button.disabled = this.hasAttribute('disabled');
  }
}

function defineSpikeElements() {
  if (!customElements.get('spike-shadow-button')) {
    customElements.define('spike-shadow-button', SpikeShadowButtonElement);
  }

  if (!customElements.get('spike-light-button')) {
    customElements.define('spike-light-button', SpikeLightButtonElement);
  }
}

export default function ButtonFormBehaviorSpike() {
  const [shadowSubmits, setShadowSubmits] = useState(0);
  const [lightSubmits, setLightSubmits] = useState(0);
  const [nativeSubmits, setNativeSubmits] = useState(0);

  useEffect(() => {
    defineSpikeElements();
  }, []);

  return (
    <div className="wb-spike" data-spike-page="button-form-behavior">
      <div className="wb-spike__intro">
        <h2>Button form behavior spike</h2>
        <p>
          These fixtures compare component-owned button topologies before production
          <code> uswds-button</code> chooses a rendering model.
        </p>
      </div>

      <section className="wb-spike__fixture" data-spike-fixture="shadow-button-form">
        <h3>Fixture A: shadow DOM owned button</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setShadowSubmits((count) => count + 1);
          }}
        >
          {createElement('spike-shadow-button', { type: 'submit' }, 'Submit shadow form')}
          {createElement('spike-shadow-button', { type: 'button' }, 'Non-submit shadow button')}
          {createElement(
            'spike-shadow-button',
            { type: 'submit', disabled: true },
            'Disabled shadow submit',
          )}
        </form>
        <p aria-live="polite">Shadow submit count: {shadowSubmits}</p>
      </section>

      <section className="wb-spike__fixture" data-spike-fixture="light-button-form">
        <h3>Fixture B: light DOM owned button</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setLightSubmits((count) => count + 1);
          }}
        >
          {createElement('spike-light-button', { type: 'submit' }, 'Submit light form')}
          {createElement('spike-light-button', { type: 'button' }, 'Non-submit light button')}
          {createElement(
            'spike-light-button',
            { type: 'submit', disabled: true },
            'Disabled light submit',
          )}
        </form>
        <p aria-live="polite">Light submit count: {lightSubmits}</p>
      </section>

      <section className="wb-spike__fixture" data-spike-fixture="native-button-form">
        <h3>Fixture C: native button baseline</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setNativeSubmits((count) => count + 1);
          }}
        >
          <button className="usa-button" type="submit">
            Submit native form
          </button>
          <button className="usa-button" type="button">
            Non-submit native button
          </button>
          <button className="usa-button" type="submit" disabled>
            Disabled native submit
          </button>
        </form>
        <p aria-live="polite">Native submit count: {nativeSubmits}</p>
      </section>
    </div>
  );
}
