import { LitElement } from 'lit';
import { defineElement } from '../defineElement.js';

export class UswdsRequiredMarker extends LitElement {
  static tagName = 'uswds-required-marker' as const;

  connectedCallback() {
    super.connectedCallback();

    if (!this.querySelector('abbr')) {
      const marker = document.createElement('abbr');
      marker.title = 'required';
      marker.className = 'usa-hint usa-hint--required';
      marker.textContent = '*';
      this.append(marker);
    }
  }

  createRenderRoot() {
    return this;
  }
}

defineElement(UswdsRequiredMarker);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsRequiredMarker.tagName]: UswdsRequiredMarker;
  }
}
