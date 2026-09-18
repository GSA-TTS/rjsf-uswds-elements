import type { ErrorSchema, RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { Form } from 'rjsf-uswds';

interface GalleryVariant {
  title: string;
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: unknown;
  extraErrors?: ErrorSchema;
  disabled?: boolean;
  readonly?: boolean;
}

interface GallerySection {
  title: string;
  variants: GalleryVariant[];
}

const field = (schema: RJSFSchema, required = false): RJSFSchema => ({
  type: 'object',
  required: required ? ['field'] : undefined,
  properties: { field: schema },
});

const fieldError = (message: string): ErrorSchema =>
  ({ field: { __errors: [message] } }) as unknown as ErrorSchema;

const SECTIONS: GallerySection[] = [
  {
    title: 'Text input',
    variants: [
      { title: 'Normal', schema: field({ type: 'string', title: 'Project name' }) },
      {
        title: 'With hint',
        schema: field({
          type: 'string',
          title: 'Project name',
          description: 'Enter the official project name.',
        }),
      },
      {
        title: 'Required',
        schema: field({ type: 'string', title: 'Project name' }, true),
      },
      {
        title: 'Error',
        schema: field({ type: 'string', title: 'Project name' }),
        extraErrors: fieldError('Enter a project name.'),
      },
      {
        title: 'Disabled',
        schema: field({ type: 'string', title: 'Project name' }),
        formData: { field: 'Riverside Bridge Retrofit' },
        disabled: true,
      },
      {
        title: 'Read only',
        schema: field({ type: 'string', title: 'Project name' }),
        formData: { field: 'Riverside Bridge Retrofit' },
        readonly: true,
      },
      {
        title: 'Width: sm',
        schema: field({ type: 'string', title: 'ZIP code' }),
        uiSchema: { field: { 'ui:options': { uswds: { width: 'sm' } } } },
      },
      {
        title: 'Prefix',
        schema: field({ type: 'number', title: 'Estimated cost' }),
        uiSchema: { field: { 'ui:options': { uswds: { width: 'md', prefix: '$' } } } },
      },
    ],
  },
  {
    title: 'Select',
    variants: [
      {
        title: 'Normal',
        schema: field({
          type: 'string',
          title: 'Lead agency',
          enum: ['Department of Transportation', 'Department of Energy', 'EPA'],
        }),
      },
      {
        title: 'Error',
        schema: field({
          type: 'string',
          title: 'Lead agency',
          enum: ['Department of Transportation', 'Department of Energy', 'EPA'],
        }),
        extraErrors: fieldError('Select a lead agency.'),
      },
      {
        title: 'Disabled',
        schema: field({
          type: 'string',
          title: 'Lead agency',
          enum: ['Department of Transportation', 'Department of Energy', 'EPA'],
        }),
        disabled: true,
      },
    ],
  },
  {
    title: 'Radio group',
    variants: [
      {
        title: 'Normal',
        schema: field({
          type: 'string',
          title: 'Project type',
          enum: ['Highway', 'Energy', 'Water'],
        }),
        uiSchema: { field: { 'ui:widget': 'radio' } },
      },
      {
        title: 'With hint',
        schema: field({
          type: 'string',
          title: 'Project type',
          description: 'Choose the closest match.',
          enum: ['Highway', 'Energy', 'Water'],
        }),
        uiSchema: { field: { 'ui:widget': 'radio' } },
      },
      {
        title: 'Error',
        schema: field({
          type: 'string',
          title: 'Project type',
          enum: ['Highway', 'Energy', 'Water'],
        }),
        uiSchema: { field: { 'ui:widget': 'radio' } },
        extraErrors: fieldError('Select a project type.'),
      },
      {
        title: 'Tiles',
        schema: field({
          type: 'string',
          title: 'Project type',
          enum: ['Highway', 'Energy', 'Water'],
        }),
        uiSchema: { field: { 'ui:widget': 'radio', 'ui:options': { uswds: { tile: true } } } },
      },
    ],
  },
  {
    title: 'Checkbox',
    variants: [
      {
        title: 'Single checkbox',
        schema: field({ type: 'boolean', title: 'Subscribe to updates' }),
      },
      {
        title: 'With description',
        schema: field({
          type: 'boolean',
          title: 'Subscribe to updates',
          description: 'About one email per month.',
        }),
      },
      {
        title: 'Disabled',
        schema: field({ type: 'boolean', title: 'Subscribe to updates' }),
        disabled: true,
      },
    ],
  },
  {
    title: 'Checkbox group',
    variants: [
      {
        title: 'Normal',
        schema: field({
          type: 'array',
          title: 'Topics',
          items: { type: 'string', enum: ['Transportation', 'Energy', 'Water'] },
          uniqueItems: true,
        }),
      },
      {
        title: 'Error',
        schema: field({
          type: 'array',
          title: 'Topics',
          items: { type: 'string', enum: ['Transportation', 'Energy', 'Water'] },
          uniqueItems: true,
        }),
        extraErrors: fieldError('Select at least one topic.'),
      },
    ],
  },
  {
    title: 'Textarea',
    variants: [
      {
        title: 'Normal',
        schema: field({ type: 'string', title: 'Project description' }),
        uiSchema: { field: { 'ui:widget': 'textarea' } },
      },
      {
        title: 'Error',
        schema: field({ type: 'string', title: 'Project description' }),
        uiSchema: { field: { 'ui:widget': 'textarea' } },
        extraErrors: fieldError('Enter a project description.'),
      },
    ],
  },
  {
    title: 'Date',
    variants: [
      {
        title: 'Normal',
        schema: field({ type: 'string', format: 'date', title: 'Construction start date' }),
      },
      {
        title: 'Error',
        schema: field({ type: 'string', format: 'date', title: 'Construction start date' }),
        extraErrors: fieldError('Enter a valid date.'),
      },
    ],
  },
  {
    title: 'Input mask',
    variants: [
      {
        title: 'Phone number',
        schema: field({
          type: 'string',
          title: 'Phone number',
          description: 'For example, 555-123-4567',
        }),
        uiSchema: { field: { 'ui:options': { uswds: { mask: '___-___-____' } } } },
      },
      {
        title: 'Social Security number',
        schema: field({
          type: 'string',
          title: 'Social Security number',
          description: 'For example, 123 45 6789',
        }),
        uiSchema: { field: { 'ui:options': { uswds: { mask: '___ __ ____' } } } },
      },
      {
        title: 'Alphanumeric',
        schema: field({
          type: 'string',
          title: 'Canadian postal code',
          description: 'For example, A1B 2C3',
        }),
        uiSchema: { field: { 'ui:options': { uswds: { mask: 'A#A #A#' } } } },
      },
    ],
  },
  {
    title: 'Email and number',
    variants: [
      {
        title: 'Email',
        schema: field({ type: 'string', format: 'email', title: 'Email address' }),
      },
      {
        title: 'Number with suffix',
        schema: field({ type: 'number', title: 'Weight' }),
        uiSchema: { field: { 'ui:options': { uswds: { width: 'md', suffix: 'lbs.' } } } },
      },
    ],
  },
];

const HIDE_SUBMIT: UiSchema = { 'ui:submitButtonOptions': { norender: true } };

/**
 * Renders each control in isolation, in its important states, through the
 * actual RJSF theme (not as static USWDS markup samples) — the point is to test
 * how RJSF renders USWDS.
 */
export default function ComponentGallery() {
  return (
    <div className="wb-gallery">
      <section className="wb-gallery__section">
        <h2 className="wb-gallery__section-title">Alert</h2>
        <div className="wb-gallery__grid">
          <div className="wb-gallery__item">
            <h3 className="wb-gallery__item-title">Error summary</h3>
            <uswds-alert type="error">
              <div className="usa-alert__body">
                <h2 className="usa-alert__heading">This form has 2 errors</h2>
                <ul className="usa-list">
                  <li>
                    <a className="usa-link" href="#component-gallery-alert-example">
                      Project name: Enter a project name.
                    </a>
                  </li>
                  <li>Lead agency: Select a lead agency.</li>
                </ul>
              </div>
            </uswds-alert>
          </div>
        </div>
      </section>
      {SECTIONS.map((section) => (
        <section key={section.title} className="wb-gallery__section">
          <h2 className="wb-gallery__section-title">{section.title}</h2>
          <div className="wb-gallery__grid">
            {section.variants.map((variant) => (
              <div key={variant.title} className="wb-gallery__item">
                <h3 className="wb-gallery__item-title">{variant.title}</h3>
                <Form
                  schema={variant.schema}
                  uiSchema={{ ...variant.uiSchema, ...HIDE_SUBMIT }}
                  formData={variant.formData}
                  validator={validator}
                  extraErrors={variant.extraErrors}
                  disabled={variant.disabled}
                  readonly={variant.readonly}
                  showErrorList={false}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
