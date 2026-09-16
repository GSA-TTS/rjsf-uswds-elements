import { css, unsafeCSS, type CSSResultGroup } from 'lit';

const hintCss = `
.usa-hint {
  color: var(--uswds-hint-color, #565c65);
  display: block;
  font-family: var(--uswds-font-family, system-ui, sans-serif);
  font-size: var(--uswds-hint-font-size, 0.93rem);
  line-height: var(--uswds-hint-line-height, 1.5);
  margin-top: 0.5rem;
}

.usa-hint--required {
  color: var(--uswds-required-marker-color, #b50909);
  text-decoration: none;
}
`;

let sharedHintStyleSheet: CSSStyleSheet | undefined;

type ConstructableStyleSheet = CSSStyleSheet & {
  replaceSync(cssText: string): void;
};

export function supportsConstructableStyleSheets(): boolean {
  return 'adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype;
}

export function getSharedHintStyleSheet(): CSSStyleSheet | undefined {
  if (!supportsConstructableStyleSheets()) {
    return undefined;
  }

  if (!sharedHintStyleSheet) {
    sharedHintStyleSheet = new CSSStyleSheet();
    (sharedHintStyleSheet as ConstructableStyleSheet).replaceSync(hintCss);
  }

  return sharedHintStyleSheet;
}

export const hintShadowStyles: CSSResultGroup = [
  css`
    ${unsafeCSS(hintCss)}
  `,
];
