import { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import {
  enumOptionSelectedValue,
  enumOptionValueDecoder,
  enumOptionValueEncoder,
  getOptionValueFormat,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { widgetDescribedBy } from '../utilities/describedBy.js';
import { classNames, getUswdsOptions, inputWidthClass } from '../utilities/uswdsOptions.js';
import CheckboxesWidget from './CheckboxesWidget.js';

function getEventValue(event: ChangeEvent<HTMLSelectElement>, multiple: boolean) {
  if (multiple) {
    return Array.from(event.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
  }
  return event.target.value;
}

function NativeSelect<T, S extends StrictRJSFSchema, F extends FormContextType>(
  props: WidgetProps<T, S, F>,
) {
  const {
    schema,
    id,
    htmlName,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple = false,
    autofocus = false,
    rawErrors,
    hideError,
    onChange,
    onBlur,
    onFocus,
    placeholder,
  } = props;
  const { enumOptions, enumDisabled, emptyValue: optEmptyValue } = options;
  const emptyValue = multiple ? [] : '';
  const optionValueFormat = getOptionValueFormat(options);
  const hasError = !hideError && Array.isArray(rawErrors) && rawErrors.length > 0;
  const uswds = getUswdsOptions(options);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newValue = getEventValue(event, multiple);
      return onChange(
        enumOptionValueDecoder(newValue, enumOptions, optionValueFormat, optEmptyValue),
      );
    },
    [onChange, multiple, enumOptions, optEmptyValue, optionValueFormat],
  );
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      const newValue = getEventValue(event as unknown as ChangeEvent<HTMLSelectElement>, multiple);
      return onBlur(
        id,
        enumOptionValueDecoder(newValue, enumOptions, optionValueFormat, optEmptyValue),
      );
    },
    [onBlur, id, multiple, enumOptions, optEmptyValue, optionValueFormat],
  );
  const handleFocus = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      const newValue = getEventValue(event as unknown as ChangeEvent<HTMLSelectElement>, multiple);
      return onFocus(
        id,
        enumOptionValueDecoder(newValue, enumOptions, optionValueFormat, optEmptyValue),
      );
    },
    [onFocus, id, multiple, enumOptions, optEmptyValue, optionValueFormat],
  );

  const selectValue = enumOptionSelectedValue(
    value,
    enumOptions,
    multiple,
    optionValueFormat,
    emptyValue,
  );
  const showPlaceholderOption = !multiple && schema.default === undefined;

  return (
    <select
      id={id}
      name={htmlName || id}
      multiple={multiple}
      value={selectValue}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      className={classNames(
        'usa-select',
        hasError && 'usa-input--error',
        inputWidthClass(uswds.width),
      )}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={widgetDescribedBy(props)}
      aria-invalid={hasError || undefined}
    >
      {showPlaceholderOption && <option value="">{placeholder || '- Select -'}</option>}
      {Array.isArray(enumOptions) &&
        enumOptions.map(({ value: enumValue, label: enumLabel }, index) => {
          const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.includes(enumValue);
          return (
            <option
              key={String(enumValue)}
              value={enumOptionValueEncoder(enumValue, index, optionValueFormat)}
              disabled={itemDisabled}
            >
              {enumLabel}
            </option>
          );
        })}
    </select>
  );
}

/**
 * Renders enum schemas as a USWDS select.
 *
 * Multi-select enums (arrays with `uniqueItems`) render as a USWDS checkbox
 * group by default, since USWDS has no styled multi-select control and
 * checkbox groups are the established federal pattern. An explicit
 * `ui:widget: select` opts back into the native multi-select.
 */
export default function SelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const explicitSelect = props.uiSchema?.['ui:widget'] === 'select';
  if (props.multiple && !explicitSelect) {
    return <CheckboxesWidget<T, S, F> {...props} />;
  }
  return <NativeSelect<T, S, F> {...props} />;
}
