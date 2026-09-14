import {
  getTemplate,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';

/**
 * Renders `format: date` strings as a native date input styled as a USWDS
 * text input.
 *
 * Design note: the USWDS date-picker pattern relies on USWDS's imperative
 * JavaScript enhancing the DOM outside React, which breaks RJSF's
 * controlled-form model, so this theme deliberately uses the native control.
 */
export default function DateWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const { options, registry } = props;
  const BaseInputTemplate = getTemplate<'BaseInputTemplate', T, S, F>(
    'BaseInputTemplate',
    registry,
    options,
  );
  return <BaseInputTemplate type="date" {...props} />;
}
