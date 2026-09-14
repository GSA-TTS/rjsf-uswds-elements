import { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import {
  getInputProps,
  type BaseInputTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { InputGroup } from '../uswds/elements.js';
import { widgetDescribedBy } from '../utilities/describedBy.js';
import {
  applyInputMask,
  maskDisplayPlaceholder,
  maskHasLetterSlots,
} from '../utilities/inputMask.js';
import {
  classNames,
  getUswdsOptions,
  inputGroupWidthClass,
  inputWidthClass,
} from '../utilities/uswdsOptions.js';

/**
 * Renders the single `<input>` control used by most text-like widgets (text,
 * email, url, number, date, ...) as a USWDS `usa-input`, including width
 * modifiers, prefix/suffix input groups, input masks, and the USWDS error
 * state.
 */
export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: BaseInputTemplateProps<T, S, F>) {
  const {
    id,
    name: _name,
    htmlName,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
    onBlur,
    onFocus,
    onChange,
    onChangeOverride,
    options,
    schema,
    rawErrors,
    hideError,
    type,
  } = props;
  const inputProps = getInputProps<T, S, F>(schema, type, options);
  const uswds = getUswdsOptions(options);
  const hasError = !hideError && Array.isArray(rawErrors) && rawErrors.length > 0;

  let inputValue: string | number;
  if (inputProps.type === 'number' || inputProps.type === 'integer') {
    inputValue = value || value === 0 ? value : '';
  } else {
    inputValue = value == null ? '' : value;
  }

  // A USWDS input mask applies only to plain text inputs — number/date/etc.
  // inputs manage their own value formats.
  const inputType = inputProps.type ?? 'text';
  const mask = inputType === 'text' || inputType === 'tel' ? uswds.mask : undefined;

  const handleChange = useCallback(
    ({ target: { value: newValue } }: ChangeEvent<HTMLInputElement>) => {
      const nextValue = mask ? applyInputMask(newValue, mask) : newValue;
      onChange(nextValue === '' ? options.emptyValue : nextValue);
    },
    [onChange, options, mask],
  );
  const handleBlur = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) => onBlur(id, target?.value),
    [onBlur, id],
  );
  const handleFocus = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) => onFocus(id, target?.value),
    [onFocus, id],
  );

  const grouped = Boolean(uswds.prefix || uswds.suffix);
  // When the input sits inside an input group, the width modifier belongs on
  // the group rather than the input itself.
  const widthClass = grouped ? undefined : inputWidthClass(uswds.width);

  let input = (
    <input
      id={id}
      name={htmlName || id}
      type={inputType}
      className={classNames(
        'usa-input',
        mask && 'usa-masked',
        hasError && 'usa-input--error',
        widthClass,
      )}
      value={inputValue}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      placeholder={placeholder}
      maxLength={mask ? mask.length : undefined}
      inputMode={mask && !maskHasLetterSlots(mask) ? 'numeric' : undefined}
      onChange={onChangeOverride || handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={widgetDescribedBy(props)}
      aria-invalid={hasError || undefined}
      step={inputProps.step}
      min={inputProps.min}
      max={inputProps.max}
      autoComplete={inputProps.autoComplete}
    />
  );

  if (mask) {
    // The USWDS input-mask shell: an aria-hidden ghost showing the typed
    // value (invisibly, for alignment) followed by the remainder of the
    // mask. Styled by the usa-input-mask rules in the USWDS CSS.
    const ghost = maskDisplayPlaceholder(mask);
    const typed = String(inputValue);
    input = (
      <span className="usa-input-mask">
        <span className="usa-input-mask--content" aria-hidden="true" id={`${id}Mask`}>
          <i>{typed}</i>
          {ghost.slice(typed.length)}
        </span>
        {input}
      </span>
    );
  }

  if (grouped) {
    return (
      <InputGroup
        error={hasError}
        className={inputGroupWidthClass(uswds.width)}
        prefix={uswds.prefix}
        suffix={uswds.suffix}
      >
        {input}
      </InputGroup>
    );
  }
  return input;
}
