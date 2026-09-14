import { render } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import type { FormProps } from '@rjsf/core';
import { Form } from '../src/index.js';

export interface RenderFormOptions {
  uiSchema?: UiSchema;
  formData?: unknown;
  formProps?: Partial<FormProps>;
}

/** Renders a schema through the USWDS theme with the AJV8 validator. */
export function renderForm(schema: RJSFSchema, options: RenderFormOptions = {}) {
  const { uiSchema, formData, formProps } = options;
  return render(
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      {...formProps}
    />,
  );
}
