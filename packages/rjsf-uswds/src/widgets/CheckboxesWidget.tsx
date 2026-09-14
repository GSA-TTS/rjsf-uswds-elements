import { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import {
  enumOptionValueDecoder,
  enumOptionValueEncoder,
  enumOptionsDeselectValue,
  enumOptionsIsSelected,
  enumOptionsSelectValue,
  getOptionValueFormat,
  optionId,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WidgetProps,
} from '@rjsf/utils';
import { Choice } from '../uswds/elements.js';
import { widgetDescribedBy } from '../utilities/describedBy.js';
import { getUswdsOptions } from '../utilities/uswdsOptions.js';

/**
 * Renders multi-select enums as a USWDS checkbox group. The surrounding
 * `fieldset`/`legend`, hint and error message are provided by the theme's
 * `FieldTemplate`.
 */
export default function CheckboxesWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    htmlName,
    options,
    value,
    disabled,
    readonly,
    autofocus = false,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const { enumOptions, enumDisabled, emptyValue } = options;
  const optionValueFormat = getOptionValueFormat(options);
  const uswds = getUswdsOptions(options);
  const describedBy = widgetDescribedBy(props);
  const checkboxesValues = Array.isArray(value) ? value : [value];

  const handleBlur = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) =>
      onBlur(id, enumOptionValueDecoder(target?.value, enumOptions, optionValueFormat, emptyValue)),
    [onBlur, id, enumOptions, emptyValue, optionValueFormat],
  );
  const handleFocus = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) =>
      onFocus(
        id,
        enumOptionValueDecoder(target?.value, enumOptions, optionValueFormat, emptyValue),
      ),
    [onFocus, id, enumOptions, emptyValue, optionValueFormat],
  );

  return (
    <div id={id}>
      {Array.isArray(enumOptions) &&
        enumOptions.map((option, index) => {
          const checked = enumOptionsIsSelected(option.value, checkboxesValues);
          const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.includes(option.value);
          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
              onChange(enumOptionsSelectValue(index, checkboxesValues, enumOptions));
            } else {
              onChange(enumOptionsDeselectValue(index, checkboxesValues, enumOptions));
            }
          };
          return (
            <Choice
              kind="checkbox"
              key={String(option.value)}
              id={optionId(id, index)}
              name={htmlName || id}
              label={option.label}
              value={enumOptionValueEncoder(option.value, index, optionValueFormat)}
              checked={checked}
              disabled={disabled || itemDisabled || readonly}
              autoFocus={autofocus && index === 0}
              tile={uswds.tile}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              aria-describedby={describedBy}
            />
          );
        })}
    </div>
  );
}
