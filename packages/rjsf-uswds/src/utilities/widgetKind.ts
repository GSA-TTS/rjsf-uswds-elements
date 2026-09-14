import {
  getUiOptions,
  type FormContextType,
  type Registry,
  type RJSFSchema,
  type StrictRJSFSchema,
  type UiSchema,
} from '@rjsf/utils';

/**
 * A coarse classification of how a field's effective widget presents itself,
 * used by `FieldTemplate` to choose between USWDS labeling patterns:
 *
 * - `control`: a single labeled control (`<label for>` + input/select/textarea)
 * - `group`: a group of related controls (radio group, checkbox group) that
 *   needs `<fieldset>`/`<legend>` labeling
 * - `checkbox`: a single boolean checkbox, which renders its own label
 */
export type WidgetKind = 'control' | 'group' | 'checkbox';

const GROUP_WIDGETS = new Set(['radio', 'checkboxes']);

export function getWidgetKind<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(schema: S, uiSchema: UiSchema<T, S, F> | undefined, registry: Registry<T, S, F>): WidgetKind {
  const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const widget = uiOptions.widget;
  if (typeof widget === 'string') {
    if (GROUP_WIDGETS.has(widget)) {
      return 'group';
    }
    if (widget === 'checkbox') {
      return 'checkbox';
    }
    return 'control';
  }
  if (schema.type === 'boolean') {
    return 'checkbox';
  }
  // Multi-select enum arrays render as a USWDS checkbox group by default in
  // this theme, so they need fieldset/legend labeling.
  if (schema.type === 'array' && registry.schemaUtils.isMultiSelect(schema)) {
    return 'group';
  }
  return 'control';
}
