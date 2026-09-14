import {
  buttonId,
  type ArrayFieldItemButtonsTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import { humanizeItemLabel } from '../utilities/itemLabel.js';

/**
 * Renders the action buttons for one array item with human-friendly visible
 * labels and position-aware accessible names ("Remove contact 2").
 */
export default function ArrayFieldItemButtonsTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldItemButtonsTemplateProps<T, S, F>) {
  const {
    disabled,
    hasMoveDown,
    hasMoveUp,
    hasCopy,
    hasRemove,
    fieldPathId,
    index,
    onCopyItem,
    onRemoveItem,
    onMoveDownItem,
    onMoveUpItem,
    readonly,
    registry,
    schema,
    uiSchema,
  } = props;
  const { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } =
    registry.templates.ButtonTemplates;

  const itemLabel =
    typeof schema.title === 'string' && schema.title.trim().length > 0
      ? humanizeItemLabel(schema.title.trim())
      : 'item';
  const itemName = `${itemLabel} ${index + 1}`;

  return (
    <>
      {(hasMoveUp || hasMoveDown) && (
        <MoveUpButton
          id={buttonId(fieldPathId, 'moveUp')}
          disabled={disabled || readonly || !hasMoveUp}
          onClick={onMoveUpItem}
          aria-label={`Move ${itemName} up`}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {(hasMoveUp || hasMoveDown) && (
        <MoveDownButton
          id={buttonId(fieldPathId, 'moveDown')}
          disabled={disabled || readonly || !hasMoveDown}
          onClick={onMoveDownItem}
          aria-label={`Move ${itemName} down`}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {hasCopy && (
        <CopyButton
          id={buttonId(fieldPathId, 'copy')}
          disabled={disabled || readonly}
          onClick={onCopyItem}
          aria-label={`Copy ${itemName}`}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {hasRemove && (
        <RemoveButton
          id={buttonId(fieldPathId, 'remove')}
          disabled={disabled || readonly}
          onClick={onRemoveItem}
          aria-label={`Remove ${itemName}`}
          uiSchema={uiSchema}
          registry={registry}
        >
          {itemLabel === 'item' ? 'Remove' : `Remove ${itemLabel}`}
        </RemoveButton>
      )}
    </>
  );
}
