import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type UswdsAlertAttributes = HTMLAttributes<HTMLElement> & {
  heading?: string;
  'no-icon'?: boolean;
  slim?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
};

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'uswds-alert': DetailedHTMLProps<UswdsAlertAttributes, HTMLElement>;
      'uswds-error-message': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'uswds-required-marker': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
