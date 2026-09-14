import { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import {
  labelValue,
  schemaRequiresTrueValue,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { Choice } from '../uswds/elements.js';
import { widgetDescribedBy } from '../utilities/describedBy.js';
import { getUswdsOptions } from '../utilities/uswdsOptions.js';

/**
 * Renders boolean schemas as a single USWDS checkbox. The USWDS checkbox
 * pattern places the label (and an optional description) alongside the
 * control itself, so the theme's `FieldTemplate` does not add a separate
 * label for this widget.
 */
export default function CheckboxWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    htmlName,
    value,
    disabled,
    readonly,
    autofocus = false,
    label,
    hideLabel,
    options,
    schema,
    onChange,
    onBlur,
    onFocus,
  } = props;
  // Only mark the checkbox required when the schema requires the value to be
  // true (via const/enum), matching RJSF core behavior.
  const required = schemaRequiresTrueValue<S>(schema);
  const uswds = getUswdsOptions(options);
  const description = options.description ?? schema.description;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked),
    [onChange],
  );
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => onBlur(id, event.target.checked),
    [onBlur, id],
  );
  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => onFocus(id, event.target.checked),
    [onFocus, id],
  );

  return (
    <Choice
      kind="checkbox"
      id={id}
      name={htmlName || id}
      label={labelValue(label, hideLabel) ?? ''}
      labelDescription={description}
      checked={typeof value === 'undefined' ? false : Boolean(value)}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      tile={uswds.tile}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      // The description renders inside the label (labelDescription), so it is
      // excluded from aria-describedby to avoid a dangling reference.
      aria-describedby={widgetDescribedBy(props, { includeDescription: false })}
    />
  );
}
