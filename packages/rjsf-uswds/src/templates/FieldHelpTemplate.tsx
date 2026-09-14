import {
  helpId,
  type FieldHelpProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';

/**
 * Renders `ui:help` content as a USWDS hint below the control, with the id
 * the widgets reference from `aria-describedby`.
 */
export default function FieldHelpTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ help, fieldPathId }: FieldHelpProps<T, S, F>) {
  if (!help) {
    return null;
  }
  return (
    <div className="usa-hint rjsf-uswds-help" id={helpId(fieldPathId)}>
      {help}
    </div>
  );
}
