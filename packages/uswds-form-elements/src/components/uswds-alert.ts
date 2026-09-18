import { LitElement } from 'lit';
import { defineElement } from '../defineElement.js';

export type UswdsAlertType = 'info' | 'warning' | 'error' | 'success';

const alertTypes = new Set<UswdsAlertType>(['info', 'warning', 'error', 'success']);
const managedClasses = [
  'usa-alert',
  'usa-alert--info',
  'usa-alert--warning',
  'usa-alert--error',
  'usa-alert--success',
  'usa-alert--slim',
  'usa-alert--no-icon',
];

export class UswdsAlert extends LitElement {
  static tagName = 'uswds-alert' as const;

  static get observedAttributes() {
    return ['type', 'slim', 'no-icon', 'class', 'role'];
  }

  private syncingHostAttributes = false;
  private syncingDefaultRole = false;

  connectedCallback() {
    super.connectedCallback();

    this.syncHostAttributes();
  }

  attributeChangedCallback(name: string) {
    if (name === 'role' && !this.syncingDefaultRole) {
      delete this.dataset.uswdsAlertDefaultRole;
    }

    if (!this.syncingHostAttributes && !this.syncingDefaultRole) {
      this.syncHostAttributes();
    }
  }

  createRenderRoot() {
    return this;
  }

  private syncHostAttributes() {
    this.syncingHostAttributes = true;
    try {
      this.classList.remove(...managedClasses);
      this.classList.add('usa-alert', `usa-alert--${this.alertType()}`);

      if (this.hasAttribute('slim')) {
        this.classList.add('usa-alert--slim');
      }

      if (this.hasAttribute('no-icon')) {
        this.classList.add('usa-alert--no-icon');
      }

      this.syncDefaultRole();
    } finally {
      this.syncingHostAttributes = false;
    }
  }

  private alertType() {
    const type = this.getAttribute('type');
    return alertTypes.has(type as UswdsAlertType) ? type : 'info';
  }

  private syncDefaultRole() {
    if (this.hasAttribute('role') && this.dataset.uswdsAlertDefaultRole !== 'true') {
      return;
    }

    this.syncingDefaultRole = true;
    try {
      if (this.alertType() === 'error') {
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
