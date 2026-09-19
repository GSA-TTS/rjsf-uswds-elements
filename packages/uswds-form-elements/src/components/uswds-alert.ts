import { LitElement, css, html } from 'lit';
import { defineElement } from '../defineElement.js';

export type UswdsAlertType = 'info' | 'warning' | 'error' | 'success';

const alertTypes = new Set<UswdsAlertType>(['info', 'warning', 'error', 'success']);

export class UswdsAlert extends LitElement {
  static tagName = 'uswds-alert' as const;

  static styles = css`
    :host {
      display: block;
    }

    .usa-alert {
      background-color: var(--uswds-alert-background-color, #f0f0f0);
      border-left: var(--uswds-alert-border-width, 0.5rem) solid
        var(--uswds-alert-border-color, #005ea8);
      padding: var(--uswds-alert-padding, 1rem);
    }

    .usa-alert--success {
      --uswds-alert-background-color: #ecf3ec;
      --uswds-alert-border-color: #00a91c;
    }

    .usa-alert--warning {
      --uswds-alert-background-color: #faf3d1;
      --uswds-alert-border-color: #ffbe2e;
    }

    .usa-alert--error {
      --uswds-alert-background-color: #f8dfe2;
      --uswds-alert-border-color: #d54309;
    }

    .usa-alert--info {
      --uswds-alert-background-color: #e7f6f8;
      --uswds-alert-border-color: #00bde3;
    }

    .usa-alert--slim {
      padding-block: var(--uswds-alert-slim-padding-block, 0.5rem);
    }

    .usa-alert__heading {
      margin-block: 0 0.5rem;
    }

    .usa-alert__body > :last-child,
    ::slotted(:last-child) {
      margin-bottom: 0;
    }
  `;

  static properties = {
    type: { reflect: true },
    heading: { reflect: true },
    slim: { type: Boolean, reflect: true },
    noIcon: { type: Boolean, attribute: 'no-icon', reflect: true },
  };

  declare type: UswdsAlertType;
  declare heading: string;
  declare slim: boolean;
  declare noIcon: boolean;

  private syncingDefaultRole = false;

  constructor() {
    super();
    this.type = 'info';
    this.heading = '';
    this.slim = false;
    this.noIcon = false;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'role' && !this.syncingDefaultRole) {
      delete this.dataset.uswdsAlertDefaultRole;
      return;
    }

    if (name === 'type') {
      this.syncDefaultRole();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.syncDefaultRole();
  }

  protected willUpdate() {
    if (!alertTypes.has(this.type)) {
      this.type = 'info';
    }
  }

  protected render() {
    const variant = alertTypes.has(this.type) ? this.type : 'info';
    return html`
      <div
        class=${[
          'usa-alert',
          `usa-alert--${variant}`,
          this.slim ? 'usa-alert--slim' : '',
          this.noIcon ? 'usa-alert--no-icon' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        part="alert"
      >
        <div class="usa-alert__body" part="body">
          ${this.heading
            ? html`<h2 class="usa-alert__heading" part="heading">${this.heading}</h2>`
            : null}
          <slot></slot>
        </div>
      </div>
    `;
  }

  private syncDefaultRole() {
    if (this.hasAttribute('role') && this.dataset.uswdsAlertDefaultRole !== 'true') {
      return;
    }

    this.syncingDefaultRole = true;
    try {
      const variant = alertTypes.has(this.type) ? this.type : 'info';
      if (variant === 'error') {
        this.dataset.uswdsAlertDefaultRole = 'true';
        this.setAttribute('role', 'alert');
        return;
      }

      if (this.dataset.uswdsAlertDefaultRole === 'true') {
        delete this.dataset.uswdsAlertDefaultRole;
        if (this.getAttribute('role') === 'alert') {
          this.removeAttribute('role');
        }
      }
    } finally {
      this.syncingDefaultRole = false;
    }
  }
}

defineElement(UswdsAlert);

declare global {
  interface HTMLElementTagNameMap {
    [UswdsAlert.tagName]: UswdsAlert;
  }
}
