import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export interface WorkbenchExample {
  id: string;
  title: string;
  description: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: unknown;
}
