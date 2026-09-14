import type { WorkbenchExample } from './types';

const nestedObjects: WorkbenchExample = {
  id: 'nested-objects',
  title: 'Nested objects',
  description:
    'Titled objects render as sections with legends; untitled objects are structural and add no visual chrome.',
  schema: {
    title: 'Grant application',
    description: 'Nested objects become form sections.',
    type: 'object',
    properties: {
      applicant: {
        type: 'object',
        title: 'Applicant information',
        description: 'Tell us who is applying.',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', title: 'Name' },
          organization: { type: 'string', title: 'Organization' },
          email: { type: 'string', format: 'email', title: 'Email' },
        },
      },
      project: {
        type: 'object',
        title: 'Project information',
        properties: {
          name: { type: 'string', title: 'Project name' },
          summary: { type: 'string', title: 'Summary' },
        },
      },
      location: {
        type: 'object',
        title: 'Project location',
        description: 'Tell us where the proposed project is located.',
        properties: {
          address: { type: 'string', title: 'Street address' },
          city: { type: 'string', title: 'City' },
          state: {
            type: 'string',
            title: 'State',
            enum: ['Maryland', 'Virginia', 'West Virginia', 'District of Columbia'],
          },
          zip: { type: 'string', title: 'ZIP code', pattern: '^\\d{5}$' },
        },
      },
      metadata: {
        type: 'object',
        properties: {
          referenceNumber: {
            type: 'string',
            title: 'Reference number',
            description: 'This untitled object adds fields without a section wrapper.',
          },
        },
      },
    },
  },
  uiSchema: {
    project: {
      summary: { 'ui:widget': 'textarea' },
    },
    location: {
      zip: { 'ui:options': { uswds: { width: 'sm' } } },
    },
  },
  formData: {},
};

export default nestedObjects;
