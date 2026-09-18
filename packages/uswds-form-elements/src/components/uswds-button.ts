import { LitElement } from 'lit';
import { defineElement } from '../defineElement.js';

export type UswdsButtonVariant = 'primary' | 'outline' | 'unstyled';

const buttonVariants = new Set<UswdsButtonVariant>(['primary', 'outline', 'unstyled']);
const managedClasses = ['usa-button', 'usa-button--outline', 'usa-button--unstyled'];

export class UswdsButton extends LitElement {
  static tagName = 'uswds-button' as const;

  static get observedAttributes() {
    return ['variant', 'class'];
  }

  private ownedButton?: HTMLButtonElement;
  private syncingHostClasses = false;

  connectedCallback() {
    super.connectedCallback();

    this.ensureOwnedButtonForStaticContent();
    this.syncHostClasses();
  }

  attributeChangedCallback() {
    if (!this.syncingHostClasses) {
      this.syncHostClasses();
    }
  }

  createRenderRoot() {
    return this;
  }

  private ensureOwnedButtonForStaticContent() {
    if (this.querySelector(':scope > button')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.replaceChildren(...Array.from(this.childNodes));
    this.append(button);
    this.ownedButton = button;
  }

  private syncHostClasses() {
    this.syncingHostClasses = true;
    try {
      this.classList.remove(...managedClasses);
      this.classList.add('usa-button');

      const variant = this.buttonVariant();
      if (variant !== 'primary') {
        this.classList.add(`usa-button--${variant}`);
      }

      if (this.ownedButton) {
        this.ownedButton.classList.remove(...managedClasses);
        this.ownedButton.classList.add('usa-button');
        if (variant !== 'primary') {
          this.ownedButton.classList.add(`usa-button--${variant}`);
        }
      }
    } finally {
      this.syncingHostClasses = false;
    }
  }

  private buttonVariant() {
    const variant = this.getAttribute('variant');
    return buttonVariants.has(variant as UswdsButtonVariant)
      ? (variant as UswdsButtonVariant)
      : 'primary';
  }
}

defineElement(UswdsButton);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsButton.tagName]: UswdsButton;
  }
}
