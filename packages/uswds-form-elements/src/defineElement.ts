import type { LitElement } from 'lit';

type LitElementConstructor = typeof LitElement & {
  tagName: string;
};

export function defineElement(elementClass: LitElementConstructor) {
  if (!customElements.get(elementClass.tagName)) {
    customElements.define(elementClass.tagName, elementClass);
  }
}
