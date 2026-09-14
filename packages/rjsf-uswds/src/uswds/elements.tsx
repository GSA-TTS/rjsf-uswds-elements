import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import 'uswds-form-elements';
import { classNames } from '../utilities/uswdsOptions.js';

/**
 * Minimal presentational primitives emitting the documented USWDS markup
 * patterns directly (https://designsystem.digital.gov/components/).
 *
 * The theme deliberately has no React-USWDS component-library dependency:
 * these few elements are shallow, stable markup contracts, and owning them
 * keeps the theme's only runtime requirement the USWDS CSS itself.
 */

/** The USWDS required-field marker, rendered inside a label or legend. */
export function RequiredMarker() {
  return (
    <uswds-required-marker>
      <abbr title="required" className="usa-hint usa-hint--required">
        *
      </abbr>
    </uswds-required-marker>
  );
}

export interface LabelProps {
  htmlFor: string;
  error?: boolean;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** `usa-label`, with optional error state and required marker. */
export function Label({ htmlFor, error, required, className, children }: LabelProps) {
  return (
    <label
      className={classNames('usa-label', error && 'usa-label--error', className)}
      htmlFor={htmlFor}
    >
      {children}
      {required ? <RequiredMarker /> : null}
    </label>
  );
}

export interface ErrorMessageProps {
  id?: string;
  children: ReactNode;
}

/** `usa-error-message` span. */
export function ErrorMessage({ id, children }: ErrorMessageProps) {
  return (
    <span className="usa-error-message" id={id}>
      {children}
    </span>
  );
}

export interface FieldsetProps {
  legend?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** `usa-fieldset` with a `usa-legend`, used for grouped controls. */
export function Fieldset({ legend, required, className, children }: FieldsetProps) {
  return (
    <fieldset className={classNames('usa-fieldset', className)}>
      {legend != null ? (
        <legend className="usa-legend">
          {legend}
          {required ? <RequiredMarker /> : null}
        </legend>
      ) : null}
      {children}
    </fieldset>
  );
}

export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  kind: 'checkbox' | 'radio';
  id: string;
  label: ReactNode;
  /** Optional hint text rendered inside the label per the USWDS pattern. */
  labelDescription?: ReactNode;
  tile?: boolean;
}

/** A single USWDS checkbox or radio option (`usa-checkbox` / `usa-radio`). */
export function Choice({ kind, id, label, labelDescription, tile, ...inputProps }: ChoiceProps) {
  const base = kind === 'checkbox' ? 'usa-checkbox' : 'usa-radio';
  return (
    <div className={base}>
      <input
        {...inputProps}
        className={classNames(`${base}__input`, tile && `${base}__input--tile`)}
        type={kind}
        id={id}
      />
      <label className={`${base}__label`} htmlFor={id}>
        {label}
        {labelDescription != null ? (
          <span className={`${base}__label-description`}>{labelDescription}</span>
        ) : null}
      </label>
    </div>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'unstyled';
}

/** `usa-button`, defaulting to `type="button"`. */
export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={classNames(
        'usa-button',
        variant === 'outline' && 'usa-button--outline',
        variant === 'unstyled' && 'usa-button--unstyled',
        className,
      )}
    />
  );
}

export interface ErrorAlertProps {
  heading: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A USWDS error alert (`usa-alert usa-alert--error`) announced via role=alert. */
export function ErrorAlert({ heading, className, children }: ErrorAlertProps) {
  return (
    <div className={classNames('usa-alert', 'usa-alert--error', className)} role="alert">
      <div className="usa-alert__body">
        <h2 className="usa-alert__heading">{heading}</h2>
        {children}
      </div>
    </div>
  );
}

export interface InputGroupProps {
  error?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
  children: ReactNode;
}

/** `usa-input-group` wrapping an input with a text prefix and/or suffix. */
export function InputGroup({ error, className, prefix, suffix, children }: InputGroupProps) {
  return (
    <div className={classNames('usa-input-group', error && 'usa-input-group--error', className)}>
      {prefix != null ? (
        <div className="usa-input-prefix" aria-hidden="true">
          {prefix}
        </div>
      ) : null}
      {children}
      {suffix != null ? (
        <div className="usa-input-suffix" aria-hidden="true">
          {suffix}
        </div>
      ) : null}
    </div>
  );
}
