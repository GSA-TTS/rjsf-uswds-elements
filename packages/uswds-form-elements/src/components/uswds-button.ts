import { LitElement, css, html, nothing } from 'lit';
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
    ariaControls: { attribute: 'aria-controls' },
    ariaDescribedby: { attribute: 'aria-describedby' },
    ariaExpanded: { attribute: 'aria-expanded' },
    ariaHaspopup: { attribute: 'aria-haspopup' },
    ariaPressed: { attribute: 'aria-pressed' },
    buttonLabel: { attribute: 'button-label' },
    disabled: { type: Boolean, reflect: true },
    name: { reflect: true },
    title: { reflect: true },
    type: { reflect: true },
    value: { reflect: true },
    variant: { reflect: true },
  };

  declare ariaControls: string | null;
  declare ariaDescribedby: string | null;
  declare ariaExpanded: string | null;
  declare ariaHaspopup: string | null;
  declare ariaPressed: string | null;
  declare buttonLabel: string | null;
  declare disabled: boolean;
  declare name: string | null;
  declare title: string;
  declare type: UswdsButtonType;
  declare value: string | null;
  declare variant: UswdsButtonVariant;

  constructor() {
    super();
    this.ariaControls = null;
    this.ariaDescribedby = null;
    this.ariaExpanded = null;
    this.ariaHaspopup = null;
    this.ariaPressed = null;
    this.buttonLabel = null;
    this.disabled = false;
    this.name = null;
    this.title = '';
    this.type = 'button';
    this.value = null;
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
        aria-controls=${this.ariaControls ?? nothing}
        aria-describedby=${this.ariaDescribedby ?? nothing}
        aria-expanded=${this.ariaExpanded ?? nothing}
        aria-haspopup=${this.ariaHaspopup ?? nothing}
        aria-label=${this.buttonLabel?.trim() ? this.buttonLabel : nothing}
        aria-pressed=${this.ariaPressed ?? nothing}
        ?disabled=${this.disabled}
        name=${this.name ?? nothing}
        part="button"
        title=${this.title || nothing}
        type=${type === 'submit' ? 'button' : type}
        value=${this.value ?? nothing}
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
