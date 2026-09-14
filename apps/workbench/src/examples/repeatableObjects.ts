import type { WorkbenchExample } from './types';

const repeatableObjects: WorkbenchExample = {
  id: 'repeatable-objects',
  title: 'Repeatable groups',
  description:
    'Arrays of objects become repeatable groups with numbered entries, human-friendly add/remove labels, and reordering. Also shows an array of strings.',
  schema: {
    title: 'Project contacts',
    description: 'Add everyone who should receive project correspondence.',
    type: 'object',
    properties: {
      contacts: {
        type: 'array',
        title: 'Contacts',
        minItems: 1,
        items: {
          type: 'object',
          title: 'Contact',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', title: 'Name' },
            email: { type: 'string', format: 'email', title: 'Email' },
            role: {
              type: 'string',
              title: 'Role',
              enum: ['Primary contact', 'Technical lead', 'Billing', 'Other'],
            },
          },
        },
      },
      keywords: {
        type: 'array',
        title: 'Keywords',
        description: 'Optional keywords describing the project.',
        items: {
          type: 'string',
          title: 'Keyword',
        },
      },
    },
  },
  uiSchema: {
    contacts: {
      items: {
        role: { 'ui:widget': 'radio' },
      },
    },
  },
  formData: {
    contacts: [
      { name: 'Alex Rivera', email: 'alex.rivera@example.gov', role: 'Primary contact' },
      { name: 'Sam Chen', email: 'sam.chen@example.gov', role: 'Technical lead' },
    ],
    keywords: ['bridge', 'retrofit'],
  },
};

export default repeatableObjects;
