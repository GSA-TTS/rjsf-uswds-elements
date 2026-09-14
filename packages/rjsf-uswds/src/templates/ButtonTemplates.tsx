import {
  getSubmitButtonOptions,
  type FormContextType,
  type IconButtonProps,
  type RJSFSchema,
  type StrictRJSFSchema,
  type SubmitButtonProps,
} from '@rjsf/utils';
import type { ReactNode } from 'react';
import { Button } from '../uswds/elements.js';
import { classNames } from '../utilities/uswdsOptions.js';

type UswdsIconButtonStyle = 'outline' | 'unstyled';

function makeIconButton(defaultLabel: ReactNode, style: UswdsIconButtonStyle) {
  return function UswdsIconButton<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any,
  >(props: IconButtonProps<T, S, F>) {
    const {
      icon: _icon,
      iconType: _iconType,
      uiSchema: _uiSchema,
      registry: _registry,
      children,
      className,
      ...buttonProps
    } = props;
    return (
      <Button
        {...buttonProps}
        type="button"
        variant={style}
        className={classNames('rjsf-uswds-icon-button', className)}
      >
        {children ?? defaultLabel}
      </Button>
    );
  };
}

/** "Add" button used for array items and expandable objects. */
export const AddButton = makeIconButton('Add', 'outline');
/** "Remove" button used for array items and additional properties. */
export const RemoveButton = makeIconButton('Remove', 'unstyled');
/** Reorder buttons for array items. */
export const MoveUpButton = makeIconButton('Move up', 'unstyled');
export const MoveDownButton = makeIconButton('Move down', 'unstyled');
/** "Copy" button for array items (only shown when copyable is enabled). */
export const CopyButton = makeIconButton('Copy', 'unstyled');
/** "Clear" button for text inputs that opt into allowClearTextInputs. */
export const ClearButton = makeIconButton('Clear', 'unstyled');

/** The form's submit button, honoring `ui:submitButtonOptions`. */
export function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps = {},
  } = getSubmitButtonOptions<T, S, F>(uiSchema);
  if (norender) {
    return null;
  }
  return (
    <Button {...submitButtonProps} type="submit" variant="primary">
      {submitText}
    </Button>
  );
}
