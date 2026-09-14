import { useCallback, type FocusEvent } from 'react';
import {
  enumOptionValueDecoder,
  enumOptionValueEncoder,
  enumOptionsIsSelected,
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
 * Renders small enums (`ui:widget: radio`) as a USWDS radio group. The
 * surrounding `fieldset`/`legend`, hint and error message are provided by the
 * theme's `FieldTemplate`.
 */
export default function RadioWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    htmlName,
    options,
    value,
    required,
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
          const checked = enumOptionsIsSelected(option.value, value);
          const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.includes(option.value);
          return (
            <Choice
              kind="radio"
              key={String(option.value)}
              id={optionId(id, index)}
              name={htmlName || id}
              label={option.label}
              value={enumOptionValueEncoder(option.value, index, optionValueFormat)}
              checked={checked}
              required={required}
              disabled={disabled || itemDisabled || readonly}
              autoFocus={autofocus && index === 0}
              tile={uswds.tile}
              onChange={() => onChange(option.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              aria-describedby={describedBy}
            />
          );
        })}
    </div>
  );
}
