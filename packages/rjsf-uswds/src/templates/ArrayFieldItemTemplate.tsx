import {
  getTemplate,
  getUiOptions,
  type ArrayFieldItemTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { classNames } from '../utilities/uswdsOptions.js';

const SCALAR_TYPES = new Set(['string', 'number', 'integer', 'boolean']);

/**
 * Renders one entry of a repeatable array.
 *
 * Object entries stack their content above a toolbar of item actions and are
 * visually distinguished with a light left border rather than heavy card UI.
 * Scalar entries (arrays of strings, etc.) render as a compact row with the
 * control and its actions side by side.
 */
export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldItemTemplateProps<T, S, F>) {
  const { children, className, buttonsProps, hasToolbar, registry, schema, uiSchema } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
  const ArrayFieldItemButtonsTemplate = getTemplate<'ArrayFieldItemButtonsTemplate', T, S, F>(
    'ArrayFieldItemButtonsTemplate',
    registry,
    uiOptions,
  );
  const isScalarItem = typeof schema.type === 'string' && SCALAR_TYPES.has(schema.type);

  return (
    <div
      className={classNames(
        'rjsf-uswds-array-item',
        isScalarItem && 'rjsf-uswds-array-item--inline',
        className,
      )}
    >
      <div className="rjsf-uswds-array-item__content">{children}</div>
      {hasToolbar ? (
        <div className="rjsf-uswds-array-item__toolbar" role="group">
          <ArrayFieldItemButtonsTemplate {...buttonsProps} />
        </div>
      ) : null}
    </div>
  );
}
