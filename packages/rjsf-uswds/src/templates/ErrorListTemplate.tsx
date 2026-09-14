import { useCallback } from 'react';
import type {
  ErrorListProps,
  FormContextType,
  RJSFSchema,
  RJSFValidationError,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { ErrorAlert } from '../uswds/elements.js';

/**
 * Parses an RJSF error `property` path (JavaScript property accessor
 * notation such as `.contacts.0.name` or `['first-name']`) into segments.
 */
function propertyToSegments(property: string): string[] {
  const segments: string[] = [];
  const pattern = /\.([^.[\]]+)|\['([^']+)'\]|\["([^"]+)"\]|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(property)) !== null) {
    const segment = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (segment !== undefined) {
      segments.push(segment);
    }
  }
  return segments;
}

/** Derives the DOM id of the field an error refers to. */
export function errorFieldId(
  error: RJSFValidationError,
  idPrefix: string,
  idSeparator: string,
): string | undefined {
  if (!error.property) {
    return undefined;
  }
  const segments = propertyToSegments(error.property);
  // A `required` error points at the parent object; address the missing
  // property itself so the link lands on the empty control.
  if (error.name === 'required' && typeof error.params?.missingProperty === 'string') {
    segments.push(error.params.missingProperty);
  }
  return [idPrefix, ...segments].join(idSeparator);
}

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (!element) {
    return;
  }
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLButtonElement
  ) {
    element.focus();
    return;
  }
  // Group widgets and sections anchor their container; focus the first
  // control inside it instead.
  const firstControl = element.querySelector<HTMLElement>('input, select, textarea, button');
  if (firstControl) {
    firstControl.focus();
  } else {
    element.scrollIntoView({ block: 'start' });
  }
}

/**
 * Renders the form-level error summary as a USWDS error alert with links that
 * move focus to the offending fields, following the USWDS error-summary
 * pattern for failed submissions.
 */
export default function ErrorListTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ errors, registry }: ErrorListProps<T, S, F>) {
  const { idPrefix, idSeparator } = registry.globalFormOptions;
  const handleClick = useCallback((fieldId: string | undefined) => {
    if (fieldId) {
      focusField(fieldId);
    }
  }, []);

  if (errors.length === 0) {
    return null;
  }
  const heading =
    errors.length === 1 ? 'This form has 1 error' : `This form has ${errors.length} errors`;
  return (
    <ErrorAlert heading={heading} className="rjsf-uswds-error-list">
      <ul className="usa-list">
        {errors.map((error, index) => {
          const fieldId = errorFieldId(error, idPrefix, idSeparator);
          const text = error.title ? `${error.title}: ${error.message ?? ''}` : error.stack;
          return (
            <li key={index}>
              {fieldId ? (
                <a className="usa-link" href={`#${fieldId}`} onClick={() => handleClick(fieldId)}>
                  {text}
                </a>
              ) : (
                text
              )}
            </li>
          );
        })}
      </ul>
    </ErrorAlert>
  );
}
