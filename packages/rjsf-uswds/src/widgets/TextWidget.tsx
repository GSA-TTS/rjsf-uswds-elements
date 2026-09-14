import {
  getTemplate,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';

/**
 * The default widget for string and number schemas. Delegates to the theme's
 * `BaseInputTemplate`, which owns the USWDS input markup; `getInputProps`
 * inside it maps schema type/format to the right HTML input type.
 */
export default function TextWidget<
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
  return <BaseInputTemplate {...props} />;
}
