import { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import type { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { widgetDescribedBy } from '../utilities/describedBy.js';
import { classNames } from '../utilities/uswdsOptions.js';

/** Renders multiline strings (`ui:widget: textarea`) as a USWDS textarea. */
export default function TextareaWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    htmlName,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
    options,
    rawErrors,
    hideError,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const hasError = !hideError && Array.isArray(rawErrors) && rawErrors.length > 0;

  const handleChange = useCallback(
    ({ target: { value: newValue } }: ChangeEvent<HTMLTextAreaElement>) =>
      onChange(newValue === '' ? options.emptyValue : newValue),
    [onChange, options],
  );
  const handleBlur = useCallback(
    ({ target }: FocusEvent<HTMLTextAreaElement>) => onBlur(id, target?.value),
    [onBlur, id],
  );
  const handleFocus = useCallback(
    ({ target }: FocusEvent<HTMLTextAreaElement>) => onFocus(id, target?.value),
    [onFocus, id],
  );

  return (
    <textarea
      id={id}
      name={htmlName || id}
      className={classNames('usa-textarea', hasError && 'usa-input--error')}
      value={value == null ? '' : value}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      placeholder={placeholder}
      rows={typeof options.rows === 'number' ? options.rows : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={widgetDescribedBy(props)}
      aria-invalid={hasError || undefined}
    />
  );
}
