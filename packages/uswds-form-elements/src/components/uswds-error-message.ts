import { LitElement } from 'lit';
import { defineElement } from '../defineElement.js';

export class UswdsErrorMessage extends LitElement {
  static tagName = 'uswds-error-message' as const;

  connectedCallback() {
    super.connectedCallback();

    if (!this.querySelector('.usa-error-message')) {
      const message = document.createElement('span');
      message.className = 'usa-error-message';
      message.replaceChildren(...Array.from(this.childNodes));
      this.append(message);
    }
  }

  createRenderRoot() {
    return this;
  }
}

defineElement(UswdsErrorMessage);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsErrorMessage.tagName]: UswdsErrorMessage;
  }
}
