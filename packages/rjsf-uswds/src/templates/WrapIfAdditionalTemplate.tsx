import {
  ADDITIONAL_PROPERTY_FLAG,
  buttonId,
  TranslatableString,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { Label } from '../uswds/elements.js';

/**
 * For fields created through `additionalProperties`, renders the editable
 * property-name input alongside the field's own control, plus a remove
 * button. All other fields pass through untouched.
 */
export default function WrapIfAdditionalTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
  const {
    id,
    label,
    onKeyRenameBlur,
    onRemoveProperty,
    disabled,
    readonly,
    schema,
    uiSchema,
    registry,
    children,
  } = props;
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;
  if (!additional) {
    return <>{children}</>;
  }
  const { translateString } = registry;
  const {
    ButtonTemplates: { RemoveButton },
  } = registry.templates;
  const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
  const keyId = `${id}-key`;
  return (
    <div className="rjsf-uswds-additional-property">
      <div className="usa-form-group rjsf-uswds-additional-property__key">
        <Label htmlFor={keyId}>{keyLabel}</Label>
        <input
          className="usa-input"
          type="text"
          id={keyId}
          name={keyId}
          defaultValue={label}
          disabled={disabled || readonly}
          onBlur={!readonly ? onKeyRenameBlur : undefined}
        />
      </div>
      <div className="rjsf-uswds-additional-property__value">{children}</div>
      <RemoveButton
        id={buttonId(id, 'remove')}
        disabled={disabled || readonly}
        onClick={onRemoveProperty}
        aria-label={`Remove ${label}`}
        uiSchema={uiSchema}
        registry={registry}
      />
    </div>
  );
}
