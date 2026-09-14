import type { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps } from '@rjsf/utils';

/**
 * Renders a standalone field title. Object and array sections build their own
 * `fieldset`/`legend` structure, so this template is mainly used by RJSF for
 * anyOf/oneOf selectors and other auxiliary titles.
 */
export default function TitleFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ id, title, required, optionalDataControl }: TitleFieldProps<T, S, F>) {
  if (!title) {
    return null;
  }
  return (
    <div className="usa-legend rjsf-uswds-title" id={id}>
      {title}
      {required ? (
        <abbr title="required" className="usa-hint usa-hint--required">
          {' *'}
        </abbr>
      ) : null}
      {optionalDataControl}
    </div>
  );
}
