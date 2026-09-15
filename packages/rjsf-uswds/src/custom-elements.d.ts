import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'uswds-error-message': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'uswds-required-marker': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
