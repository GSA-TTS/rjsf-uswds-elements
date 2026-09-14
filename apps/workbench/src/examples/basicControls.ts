import type { WorkbenchExample } from './types';

const basicControls: WorkbenchExample = {
  id: 'basic-controls',
  title: 'Basic controls',
  description:
    'One of each core control: text, email, number, textarea, select, radio, checkbox, checkbox group, and date.',
  schema: {
    title: 'Basic controls',
    description: 'Each control type the theme supports, driven by plain JSON Schema.',
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        title: 'Full name',
        description: 'Enter your first and last name.',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'Email address',
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 0,
      },
      bio: {
        type: 'string',
        title: 'Short bio',
        description: 'A few sentences about yourself.',
      },
      state: {
        type: 'string',
        title: 'State',
        enum: ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Maryland', 'Virginia'],
      },
      contactMethod: {
        type: 'string',
        title: 'Preferred contact method',
        enum: ['Email', 'Phone', 'Mail'],
      },
      topics: {
        type: 'array',
        title: 'Topics of interest',
        description: 'Select all that apply.',
        items: {
          type: 'string',
          enum: ['Transportation', 'Energy', 'Water', 'Broadband', 'Housing'],
        },
        uniqueItems: true,
      },
      subscribe: {
        type: 'boolean',
        title: 'Subscribe to project updates',
        description: 'We send about one email per month.',
      },
      startDate: {
        type: 'string',
        format: 'date',
        title: 'Start date',
      },
    },
  },
  uiSchema: {
    bio: {
      'ui:widget': 'textarea',
      'ui:options': { rows: 4 },
    },
    contactMethod: {
      'ui:widget': 'radio',
    },
    age: {
      'ui:options': { uswds: { width: 'sm' } },
    },
  },
  formData: {},
};

export default basicControls;
