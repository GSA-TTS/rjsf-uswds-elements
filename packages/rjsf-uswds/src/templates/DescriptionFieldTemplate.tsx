import type {
  DescriptionFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

/**
 * Renders a field description as a USWDS hint (`usa-hint`), associated with
 * its control through `aria-describedby` (composed in the widgets).
 */
export default function DescriptionFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ id, description }: DescriptionFieldProps<T, S, F>) {
  if (!description) {
    return null;
  }
  return (
    <div className="usa-hint" id={id}>
      {description}
    </div>
  );
}
