import {
  buttonId,
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  type FormContextType,
  type ObjectFieldTemplateProps,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { classNames } from '../utilities/uswdsOptions.js';

/**
 * Renders a JSON Schema object as a USWDS form section.
 *
 * - Titled objects become a `fieldset` with a `usa-legend` (the root object
 *   gets the large legend treatment so it reads as the form's main section).
 * - Objects that are items of an array get their position appended to the
 *   legend ("Contact 1", "Contact 2", ...) so repeated groups are
 *   distinguishable.
 * - Untitled, undescribed objects are treated as purely structural and render
 *   their properties without any section chrome.
 */
export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    className,
    description,
    disabled,
    formData,
    fieldPathId,
    onAddProperty,
    optionalDataControl,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    uiOptions,
  );
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  // "Pure union" schemas (oneOf/anyOf without properties) are rendered by the
  // MultiSchemaField; skip the empty section wrapper.
  const isPureUnionSchema =
    (schema.oneOf || schema.anyOf) && !schema.properties && properties.length === 0;
  if (isPureUnionSchema) {
    return null;
  }

  const isRoot = fieldPathId.path.length === 0;
  const lastPathEntry = fieldPathId.path[fieldPathId.path.length - 1];
  // RJSF falls back to the raw property name as an object's title. Raw
  // identifiers ("projectLocation") should not become section legends, so a
  // schema-derived title matching the property name is treated as untitled.
  // An explicit ui:title is always honored.
  const schemaTitle = title === String(lastPathEntry) ? undefined : title;
  const effectiveTitle = uiOptions.title ?? schemaTitle;
  const effectiveDescription = uiOptions.description ?? description;
  const arrayItemNumber = typeof lastPathEntry === 'number' ? lastPathEntry + 1 : undefined;
  const legendText =
    effectiveTitle && arrayItemNumber !== undefined
      ? `${effectiveTitle} ${arrayItemNumber}`
      : effectiveTitle;

  const body = (
    <>
      {effectiveDescription ? (
        <DescriptionFieldTemplate
          id={descriptionId(fieldPathId)}
          description={effectiveDescription}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      ) : null}
      {optionalDataControl}
      {properties.map((prop) => prop.content)}
      {canExpand<T, S, F>(schema, uiSchema, formData) ? (
        <AddButton
          id={buttonId(fieldPathId, 'add')}
          className="rjsf-uswds-object-property-expand"
          onClick={onAddProperty}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        />
      ) : null}
    </>
  );

  if (!legendText && !effectiveDescription) {
    // Structural object: no section chrome.
    return (
      <div className={classNames('rjsf-uswds-object', className)} id={fieldPathId.$id}>
        {body}
      </div>
    );
  }

  return (
    <fieldset
      className={classNames(
        'usa-fieldset',
        'rjsf-uswds-object',
        isRoot && 'rjsf-uswds-object--root',
        className,
      )}
      id={fieldPathId.$id}
    >
      {legendText ? (
        <legend className={classNames('usa-legend', isRoot && 'usa-legend--large')}>
          {legendText}
          {/* RJSF marks array items as required; a required marker on
              "Contact 1" is noise, so only property-level requirements show. */}
          {required && arrayItemNumber === undefined ? (
            <abbr title="required" className="usa-hint usa-hint--required">
              {' *'}
            </abbr>
          ) : null}
        </legend>
      ) : null}
      {body}
    </fieldset>
  );
}
