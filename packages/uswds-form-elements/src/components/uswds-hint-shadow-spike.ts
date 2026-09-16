import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { defineElement } from '../defineElement.js';
import {
  getSharedHintStyleSheet,
  hintShadowStyles,
  supportsConstructableStyleSheets,
} from '../styles/hint-shadow-spike.js';

export class UswdsHintShadowSpike extends LitElement {
  static tagName = 'uswds-hint-shadow-spike' as const;
  static styles = hintShadowStyles;
  static sharedStyleSheet = getSharedHintStyleSheet();

  #required = false;

  @property({ type: Boolean, reflect: true })
  get required() {
    return this.#required;
  }

  set required(value: boolean) {
    const oldValue = this.#required;
    this.#required = value;
    this.requestUpdate('required', oldValue);
  }

  protected override createRenderRoot(): ShadowRoot {
    const root = super.createRenderRoot() as ShadowRoot;
    if (supportsConstructableStyleSheets() && UswdsHintShadowSpike.sharedStyleSheet) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, UswdsHintShadowSpike.sharedStyleSheet];
    }
    return root;
  }

  protected override render() {
    return html`<span class=${this.required ? 'usa-hint usa-hint--required' : 'usa-hint'}>
      <slot></slot>
    </span>`;
  }
}

defineElement(UswdsHintShadowSpike);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsHintShadowSpike.tagName]: UswdsHintShadowSpike;
  }
}
