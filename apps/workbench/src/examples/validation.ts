import type { WorkbenchExample } from './types';

const validation: WorkbenchExample = {
  id: 'validation',
  title: 'Validation states',
  description:
    'Required fields, format validation, min/max, and string-length rules. Submit (or turn on "Show validation errors") to see USWDS error styling; the prefilled data violates several rules at once.',
  schema: {
    title: 'Validation demonstration',
    description: 'Submit the form to see how errors are presented.',
    type: 'object',
    required: ['projectName', 'contactEmail', 'projectCost'],
    properties: {
      projectName: {
        type: 'string',
        title: 'Project name',
        description: 'Required, and must be at least 5 characters.',
        minLength: 5,
        maxLength: 80,
      },
      contactEmail: {
        type: 'string',
        format: 'email',
        title: 'Contact email',
        description: 'Required, and must be a valid email address.',
      },
      projectCost: {
        type: 'number',
        title: 'Estimated cost',
        description: 'Between $10,000 and $10,000,000.',
        minimum: 10000,
        maximum: 10000000,
      },
      zipCode: {
        type: 'string',
        title: 'ZIP code',
        description: 'Five digits.',
        pattern: '^\\d{5}$',
      },
      summary: {
        type: 'string',
        title: 'Project summary',
        description: 'No more than 200 characters.',
        maxLength: 200,
      },
    },
  },
  uiSchema: {
    projectCost: {
      'ui:options': { uswds: { width: 'md', prefix: '$' } },
    },
    zipCode: {
      'ui:options': { uswds: { width: 'sm' } },
    },
    summary: {
      'ui:widget': 'textarea',
    },
  },
  formData: {
    projectName: 'Dam',
    contactEmail: 'not-an-email',
    projectCost: 500,
    zipCode: '123',
  },
};

export default validation;
