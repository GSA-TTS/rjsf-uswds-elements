import {
  descriptionId,
  errorId,
  helpId,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';

/**
 * Composes an `aria-describedby` value that references only elements the
 * theme actually renders for the field: the hint (description), the error
 * message(s), and the help text.
 *
 * RJSF's own `ariaDescribedByIds` unconditionally references the
 * description/error/help ids whether or not those elements exist, which
 * produces dangling ARIA references. This helper inspects the widget props to
 * decide which ids are real.
 */
export function widgetDescribedBy<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: Pick<
    WidgetProps<T, S, F>,
    'id' | 'schema' | 'options' | 'rawErrors' | 'hideError' | 'uiSchema' | 'hideLabel'
  >,
  {
    extraIds = [],
    includeDescription = true,
  }: { extraIds?: Array<string | undefined>; includeDescription?: boolean } = {},
): string | undefined {
  const { id, schema, options, rawErrors, hideError, uiSchema } = props;
  const ids: Array<string | undefined> = [];
  const hasError = !hideError && Array.isArray(rawErrors) && rawErrors.length > 0;
  if (hasError) {
    ids.push(errorId(id));
  }
  const description = options.description ?? schema.description;
  if (includeDescription && description) {
    ids.push(descriptionId(id));
  }
  const help = options.help ?? uiSchema?.['ui:help'];
  if (help) {
    ids.push(helpId(id));
  }
  ids.push(...extraIds);
  const joined = ids.filter(Boolean).join(' ');
  return joined.length > 0 ? joined : undefined;
}
