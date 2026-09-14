import {
  getTemplate,
  getUiOptions,
  type FieldTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { Fieldset, Label } from '../uswds/elements.js';
import { getWidgetKind } from '../utilities/widgetKind.js';
import { classNames } from '../utilities/uswdsOptions.js';

/**
 * The core field renderer, responsible for mapping RJSF's field concepts
 * (label, description, control, errors, help) onto USWDS form-group markup:
 *
 * - single controls get `usa-form-group` > `usa-label` + `usa-hint` +
 *   `usa-error-message` + control
 * - grouped controls (radio groups, checkbox groups) get a `fieldset` with a
 *   `legend` instead of a `label`
 * - boolean checkboxes label themselves, so the template only provides the
 *   group wrapper and error/help placement
 * - objects and arrays provide their own section presentation via their
 *   templates, so no form-group chrome is added here
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    rawErrors,
    hideError,
    classNames: uiClassNames,
    style,
    schema,
    uiSchema,
    registry,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>(
    'WrapIfAdditionalTemplate',
    registry,
    uiOptions,
  );

  if (hidden) {
    return <div style={{ display: 'none' }}>{children}</div>;
  }

  const kind = getWidgetKind<T, S, F>(schema, uiSchema, registry);
  const hasError = !hideError && Array.isArray(rawErrors) && rawErrors.length > 0;
  const groupClassName = classNames(
    'usa-form-group',
    hasError && 'usa-form-group--error',
    uiClassNames,
  );

  let content;
  if (kind === 'group') {
    // Radio groups and checkbox groups: fieldset/legend labeling, with the
    // hint and error message inside the fieldset so they precede the options.
    content = (
      <div className={groupClassName} style={style}>
        <Fieldset legend={label} required={required}>
          {description}
          {errors}
          {children}
          {help}
        </Fieldset>
      </div>
    );
  } else if (kind === 'checkbox') {
    // A single boolean checkbox renders its own label (and description) as
    // part of the USWDS checkbox pattern.
    content = (
      <div className={groupClassName} style={style}>
        {errors}
        {children}
        {help}
      </div>
    );
  } else if (displayLabel) {
    content = (
      <div className={groupClassName} style={style}>
        {label ? (
          <Label htmlFor={id} error={hasError} required={required}>
            {label}
          </Label>
        ) : null}
        {description}
        {errors}
        {children}
        {help}
      </div>
    );
  } else {
    // Objects, arrays and custom fields handle their own presentation.
    content = (
      <div className={classNames(uiClassNames) || undefined} style={style}>
        {children}
        {errors}
        {help}
      </div>
    );
  }

  return <WrapIfAdditionalTemplate {...props}>{content}</WrapIfAdditionalTemplate>;
}
