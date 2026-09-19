import { LitElement, css, html } from 'lit';
import { defineElement } from '../defineElement.js';

export type UswdsButtonVariant = 'primary' | 'outline' | 'unstyled';
export type UswdsButtonType = 'button' | 'submit' | 'reset';

const buttonVariants = new Set<UswdsButtonVariant>(['primary', 'outline', 'unstyled']);
const buttonTypes = new Set<UswdsButtonType>(['button', 'submit', 'reset']);

export class UswdsButton extends LitElement {
  static tagName = 'uswds-button' as const;

  static styles = css`
    :host {
      display: inline-block;
    }

    .usa-button {
      cursor: pointer;
      font: inherit;
    }

    .usa-button:disabled {
      cursor: not-allowed;
    }
  `;

  static properties = {
    buttonLabel: { attribute: 'button-label' },
    disabled: { type: Boolean, reflect: true },
    type: { reflect: true },
    variant: { reflect: true },
  };

  declare buttonLabel: string | null;
  declare disabled: boolean;
  declare type: UswdsButtonType;
  declare variant: UswdsButtonVariant;

  constructor() {
    super();
    this.buttonLabel = null;
    this.disabled = false;
    this.type = 'button';
    this.variant = 'primary';
  }

  protected willUpdate() {
    if (!buttonTypes.has(this.type)) {
      this.type = 'button';
    }

    if (!buttonVariants.has(this.variant)) {
      this.variant = 'primary';
    }
  }

  protected render() {
    const variant = buttonVariants.has(this.variant) ? this.variant : 'primary';
    const type = buttonTypes.has(this.type) ? this.type : 'button';
    return html`
      <button
        class=${[
          'usa-button',
          variant === 'outline' ? 'usa-button--outline' : '',
          variant === 'unstyled' ? 'usa-button--unstyled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label=${this.buttonLabel ?? ''}
        ?disabled=${this.disabled}
        part="button"
        type=${type === 'submit' ? 'button' : type}
        @click=${this.handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.type === 'submit') {
      event.preventDefault();
      this.closest('form')?.requestSubmit();
      return;
    }

    if (this.type === 'reset') {
      event.preventDefault();
      this.closest('form')?.reset();
    }
  }
}

defineElement(UswdsButton);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsButton.tagName]: UswdsButton;
  }
}
