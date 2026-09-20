import { createElement, useEffect, useState } from 'react';

type ElementReferenceInput = HTMLInputElement & {
  ariaDescribedByElements?: Element[];
};

class CrossShadowDescribedByElement extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <span id="cross-shadow-hint" data-spike-role="hint">Use your government email address.</span>
      <span id="cross-shadow-error" class="usa-error-message" data-spike-role="error">Enter a valid email address.</span>
    `;
  }
}

class WholeFieldShadowElement extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <label class="usa-label" for="whole-shadow-input">Email address</label>
      <div id="whole-shadow-hint" class="usa-hint">Use your government email address.</div>
      <span id="whole-shadow-error" class="usa-error-message">Enter a valid email address.</span>
      <input
        id="whole-shadow-input"
        class="usa-input usa-input--error"
        aria-invalid="true"
        aria-describedby="whole-shadow-hint whole-shadow-error"
        value="not-an-email"
      />
    `;
  }
}

function defineSpikeElements() {
  if (!customElements.get('cross-shadow-described-by')) {
    customElements.define('cross-shadow-described-by', CrossShadowDescribedByElement);
  }

  if (!customElements.get('whole-field-shadow')) {
    customElements.define('whole-field-shadow', WholeFieldShadowElement);
  }
}

export default function ShadowDomA11ySpike() {
  const [elementReferenceSupported, setElementReferenceSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Enter a valid email address.');

  useEffect(() => {
    defineSpikeElements();
  }, []);

  useEffect(() => {
    document.querySelectorAll('cross-shadow-described-by').forEach((host) => {
      const error = host.shadowRoot?.querySelector<HTMLElement>('[data-spike-role="error"]');
      if (error) {
        error.textContent = errorMessage;
      }
    });

    const wholeFieldError = document
      .querySelector('whole-field-shadow')
      ?.shadowRoot?.querySelector<HTMLElement>('#whole-shadow-error');
    if (wholeFieldError) {
      wholeFieldError.textContent = errorMessage;
    }

    const host = document.querySelector<CrossShadowDescribedByElement>(
      '[data-spike-fixture="element-reference-shadow"] cross-shadow-described-by',
    );
    const input = document.querySelector<ElementReferenceInput>('#element-reference-shadow-input');
    const hint = host?.shadowRoot?.querySelector<HTMLElement>('[data-spike-role="hint"]');
    const error = host?.shadowRoot?.querySelector<HTMLElement>('[data-spike-role="error"]');

    const canSetElementReferences =
      input != null &&
      hint != null &&
      error != null &&
      'ariaDescribedByElements' in input &&
      (() => {
        try {
          input.ariaDescribedByElements = [hint, error];
          return input.ariaDescribedByElements?.length === 2;
        } catch {
          return false;
        }
      })();

    setElementReferenceSupported(canSetElementReferences);
  }, [errorMessage]);

  return (
    <div className="wb-spike" data-spike-page="shadow-dom-a11y">
      <div className="wb-spike__intro">
        <h2>Shadow DOM form accessibility regression fixtures</h2>
        <p>
          These retained fixtures document that split shadow-DOM labels, hints, and errors are not
          safe for RJSF-composed form fields under the tested browser topology.
        </p>
        <p>
          Browser support detected for <code>HTMLInputElement.ariaDescribedByElements</code>:{' '}
          <strong data-spike-result="ariaDescribedByElements-supported">
            {elementReferenceSupported ? 'supported' : 'not supported'}
          </strong>
        </p>
        <button
          type="button"
          className="usa-button"
          data-spike-action="toggle-error"
          onClick={() =>
            setErrorMessage((current) =>
              current === 'Enter a valid email address.'
                ? 'Use an address ending in .gov or .mil.'
                : 'Enter a valid email address.',
            )
          }
        >
          Toggle error message
        </button>
      </div>

      <section className="wb-spike__fixture" data-spike-fixture="light-dom-baseline">
        <h3>Fixture A: light DOM baseline</h3>
        <label className="usa-label" htmlFor="light-dom-input">
          Email address
        </label>
        <div id="light-dom-hint" className="usa-hint">
          Use your government email address.
        </div>
        <span id="light-dom-error" className="usa-error-message">
          {errorMessage}
        </span>
        <input
          id="light-dom-input"
          className="usa-input usa-input--error"
          aria-invalid="true"
          aria-describedby="light-dom-hint light-dom-error"
          defaultValue="not-an-email"
        />
      </section>

      <section className="wb-spike__fixture" data-spike-fixture="classic-idref-shadow">
        <h3>Fixture B: classic IDREF across shadow boundary</h3>
        <label className="usa-label" htmlFor="classic-idref-shadow-input">
          Email address
        </label>
        {createElement('cross-shadow-described-by')}
        <input
          id="classic-idref-shadow-input"
          className="usa-input usa-input--error"
          aria-invalid="true"
          aria-describedby="cross-shadow-hint cross-shadow-error"
          defaultValue="not-an-email"
        />
      </section>

      <section className="wb-spike__fixture" data-spike-fixture="element-reference-shadow">
        <h3>Fixture C: element-reference API across shadow boundary</h3>
        <label className="usa-label" htmlFor="element-reference-shadow-input">
          Email address
        </label>
        {createElement('cross-shadow-described-by')}
        <input
          id="element-reference-shadow-input"
          className="usa-input usa-input--error"
          aria-invalid="true"
          defaultValue="not-an-email"
        />
      </section>

      <section className="wb-spike__fixture" data-spike-fixture="whole-field-shadow">
        <h3>Fixture D: whole field inside one shadow root</h3>
        {createElement('whole-field-shadow')}
      </section>
    </div>
  );
}
