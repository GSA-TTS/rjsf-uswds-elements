import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type UswdsAlertAttributes = HTMLAttributes<HTMLElement> & {
  heading?: string;
  'no-icon'?: boolean;
  slim?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
};

type UswdsButtonAttributes = HTMLAttributes<HTMLElement> & {
  'button-label'?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'unstyled';
};

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'uswds-alert': DetailedHTMLProps<UswdsAlertAttributes, HTMLElement>;
      'uswds-button': DetailedHTMLProps<UswdsButtonAttributes, HTMLElement>;
      'uswds-error-message': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'uswds-required-marker': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
