import type { ThemeProps } from '@rjsf/core';
import type { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

import ArrayFieldItemButtonsTemplate from './templates/ArrayFieldItemButtonsTemplate.js';
import ArrayFieldItemTemplate from './templates/ArrayFieldItemTemplate.js';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate.js';
import BaseInputTemplate from './templates/BaseInputTemplate.js';
import DescriptionFieldTemplate from './templates/DescriptionFieldTemplate.js';
import ErrorListTemplate from './templates/ErrorListTemplate.js';
import FieldErrorTemplate from './templates/FieldErrorTemplate.js';
import FieldHelpTemplate from './templates/FieldHelpTemplate.js';
import FieldTemplate from './templates/FieldTemplate.js';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate.js';
import TitleFieldTemplate from './templates/TitleFieldTemplate.js';
import WrapIfAdditionalTemplate from './templates/WrapIfAdditionalTemplate.js';
import {
  AddButton,
  ClearButton,
  CopyButton,
  MoveDownButton,
  MoveUpButton,
  RemoveButton,
  SubmitButton,
} from './templates/ButtonTemplates.js';

import CheckboxWidget from './widgets/CheckboxWidget.js';
import CheckboxesWidget from './widgets/CheckboxesWidget.js';
import DateWidget from './widgets/DateWidget.js';
import EmailWidget from './widgets/EmailWidget.js';
import RadioWidget from './widgets/RadioWidget.js';
import SelectWidget from './widgets/SelectWidget.js';
import TextWidget from './widgets/TextWidget.js';
import TextareaWidget from './widgets/TextareaWidget.js';
import URLWidget from './widgets/URLWidget.js';

/** Generates the USWDS theme for the given generics. */
export function generateTheme<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ThemeProps<T, S, F> {
  return {
    templates: {
      ArrayFieldItemButtonsTemplate,
      ArrayFieldItemTemplate,
      ArrayFieldTemplate,
      BaseInputTemplate,
      DescriptionFieldTemplate,
      ErrorListTemplate,
      FieldErrorTemplate,
      FieldHelpTemplate,
      FieldTemplate,
      ObjectFieldTemplate,
      TitleFieldTemplate,
      WrapIfAdditionalTemplate,
      ButtonTemplates: {
        AddButton,
        ClearButton,
        CopyButton,
        MoveDownButton,
        MoveUpButton,
        RemoveButton,
        SubmitButton,
      },
    },
    widgets: {
      CheckboxWidget,
      CheckboxesWidget,
      DateWidget,
      EmailWidget,
      RadioWidget,
      SelectWidget,
      TextWidget,
      TextareaWidget,
      URLWidget,
    },
  };
}

/** The RJSF theme adapting RJSF rendering to USWDS markup and styling. */
const Theme: ThemeProps = generateTheme();

export default Theme;
