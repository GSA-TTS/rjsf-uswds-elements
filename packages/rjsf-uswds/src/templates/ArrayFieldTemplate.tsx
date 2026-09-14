import {
  buttonId,
  descriptionId,
  getUiOptions,
  type ArrayFieldTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { addButtonLabel, getArrayItemLabel } from '../utilities/itemLabel.js';
import { classNames } from '../utilities/uswdsOptions.js';

/**
 * Renders an array field as a USWDS repeatable group: a `fieldset` with a
 * legend, the repeated items, and a human-friendly add button ("Add another
 * contact" rather than "Add item" when the schema names its items).
 */
export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    className,
    disabled,
    fieldPathId,
    uiSchema,
    items,
    optionalDataControl,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const effectiveTitle = uiOptions.title ?? title;
  const description = uiOptions.description ?? schema.description;
  const itemLabel = getArrayItemLabel<S>(schema);

  return (
    <fieldset
      className={classNames('usa-fieldset', 'rjsf-uswds-array', className)}
      id={fieldPathId.$id}
    >
      {effectiveTitle ? (
        <legend className="usa-legend">
          {effectiveTitle}
          {required ? (
            <abbr title="required" className="usa-hint usa-hint--required">
              {' *'}
            </abbr>
          ) : null}
        </legend>
      ) : null}
      {description ? (
        <div className="usa-hint" id={descriptionId(fieldPathId)}>
          {description}
        </div>
      ) : null}
      {optionalDataControl}
      <div className="rjsf-uswds-array-items">{items}</div>
      {canAdd ? (
        <AddButton
          id={buttonId(fieldPathId, 'add')}
          className="rjsf-uswds-array-add"
          onClick={onAddClick}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        >
          {addButtonLabel(itemLabel, items.length > 0)}
        </AddButton>
      ) : null}
    </fieldset>
  );
}
