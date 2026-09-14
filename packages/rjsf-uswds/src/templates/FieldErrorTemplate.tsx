import {
  errorId,
  type FieldErrorProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { ErrorMessage } from '../uswds/elements.js';

/**
 * Renders the validation errors for a single field as USWDS error messages,
 * with the id the widgets reference from `aria-describedby`.
 */
export default function FieldErrorTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ errors = [], fieldPathId }: FieldErrorProps<T, S, F>) {
  if (errors.length === 0) {
    return null;
  }
  return (
    <div id={errorId(fieldPathId)}>
      {errors.map((error, index) => (
        <ErrorMessage key={index}>{error}</ErrorMessage>
      ))}
    </div>
  );
}
