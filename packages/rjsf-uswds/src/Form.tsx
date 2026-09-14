import { forwardRef, type ComponentType, type ReactElement, type Ref } from 'react';
import CoreForm, { withTheme, type FormProps } from '@rjsf/core';
import type { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import Theme, { generateTheme } from './Theme.js';
import { classNames } from './utilities/uswdsOptions.js';

const ThemedForm = withTheme(Theme);

/** Generates a typed USWDS `Form` component for the given generics. */
export function generateForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>(generateTheme<T, S, F>());
}

const FormWithDefaults = forwardRef<CoreForm, FormProps>(function UswdsForm(props, ref) {
  return (
    <ThemedForm
      // Let AJV drive validation so failures render in USWDS error styling
      // rather than the browser's native HTML5 popups.
      noHtml5Validate
      // On a failed submit, move focus to the first invalid field, per the
      // USWDS validation pattern.
      focusOnFirstError
      {...props}
      className={classNames('usa-form', 'usa-form--large', props.className)}
      ref={ref}
    />
  );
});

/**
 * A preconfigured RJSF `Form` wired to the USWDS theme, with USWDS-friendly
 * defaults (`noHtml5Validate`, `focusOnFirstError`, `usa-form` styling).
 *
 * The `forwardRef` wrapper collapses RJSF's generics, so the export is cast
 * back to a generic signature; this is type-shuffling only, with no runtime
 * effect.
 */
const Form = FormWithDefaults as <
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: FormProps<T, S, F> & { ref?: Ref<CoreForm<T, S, F>> },
) => ReactElement;

export default Form;
