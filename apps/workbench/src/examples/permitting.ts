import type { WorkbenchExample } from './types';

const permitting: WorkbenchExample = {
  id: 'permitting',
  title: 'Permitting-style form',
  description:
    'A realistic, moderately complex permitting/environmental-review style application, to judge whether a schema-generated government form feels coherent.',
  schema: {
    title: 'Infrastructure project review application',
    description:
      'Use this form to request environmental review of a proposed infrastructure project. Fields marked with an asterisk are required.',
    type: 'object',
    required: ['projectName', 'projectType', 'leadAgency', 'projectDescription'],
    properties: {
      projectName: {
        type: 'string',
        title: 'Project name',
        description: 'Enter the official project name.',
        minLength: 3,
      },
      projectType: {
        type: 'string',
        title: 'Project type',
        enum: [
          'Highway or bridge',
          'Energy generation or transmission',
          'Water infrastructure',
          'Broadband',
          'Other',
        ],
      },
      leadAgency: {
        type: 'string',
        title: 'Lead agency',
        description: 'The federal agency responsible for the review.',
        enum: [
          'Department of Transportation',
          'Department of Energy',
          'Environmental Protection Agency',
          'Army Corps of Engineers',
          'Department of Agriculture',
        ],
      },
      projectDescription: {
        type: 'string',
        title: 'Project description',
        description:
          'Describe the purpose and scope of the project, including major construction activities.',
        minLength: 50,
      },
      applicant: {
        type: 'object',
        title: 'Applicant',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', title: 'Name' },
          organization: { type: 'string', title: 'Organization' },
          email: { type: 'string', format: 'email', title: 'Email address' },
          phone: { type: 'string', title: 'Phone number' },
        },
      },
      location: {
        type: 'object',
        title: 'Project location',
        description: 'Tell us where the proposed project is located.',
        required: ['state'],
        properties: {
          address: { type: 'string', title: 'Street address' },
          city: { type: 'string', title: 'City' },
          state: {
            type: 'string',
            title: 'State or territory',
            enum: [
              'Alabama',
              'Alaska',
              'Arizona',
              'Arkansas',
              'California',
              'Colorado',
              'Connecticut',
              'Delaware',
              'District of Columbia',
              'Florida',
              'Georgia',
              'Hawaii',
              'Idaho',
              'Illinois',
              'Indiana',
              'Iowa',
              'Kansas',
              'Kentucky',
              'Louisiana',
              'Maine',
              'Maryland',
              'Massachusetts',
              'Michigan',
              'Minnesota',
              'Mississippi',
              'Missouri',
              'Montana',
              'Nebraska',
              'Nevada',
              'New Hampshire',
              'New Jersey',
              'New Mexico',
              'New York',
              'North Carolina',
              'North Dakota',
              'Ohio',
              'Oklahoma',
              'Oregon',
              'Pennsylvania',
              'Rhode Island',
              'South Carolina',
              'South Dakota',
              'Tennessee',
              'Texas',
              'Utah',
              'Vermont',
              'Virginia',
              'Washington',
              'West Virginia',
              'Wisconsin',
              'Wyoming',
            ],
          },
          zip: { type: 'string', title: 'ZIP code', pattern: '^\\d{5}$' },
          onFederalLand: {
            type: 'boolean',
            title: 'The project is located on federal land',
          },
        },
      },
      estimatedCost: {
        type: 'number',
        title: 'Estimated project cost',
        description: 'Total estimated cost in U.S. dollars.',
        minimum: 0,
      },
      constructionStart: {
        type: 'string',
        format: 'date',
        title: 'Expected construction start date',
      },
      contacts: {
        type: 'array',
        title: 'Project contacts',
        description: 'People we can reach with questions about this application.',
        minItems: 1,
        items: {
          type: 'object',
          title: 'Contact',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', title: 'Name' },
            email: { type: 'string', format: 'email', title: 'Email address' },
            role: {
              type: 'string',
              title: 'Role',
              enum: ['Primary contact', 'Environmental consultant', 'Engineer', 'Other'],
            },
          },
        },
      },
    },
  },
  uiSchema: {
    'ui:submitButtonOptions': {
      submitText: 'Submit application',
    },
    projectType: {
      'ui:widget': 'radio',
    },
    projectDescription: {
      'ui:widget': 'textarea',
      'ui:options': { rows: 6 },
    },
    location: {
      zip: { 'ui:options': { uswds: { width: 'sm' } } },
    },
    estimatedCost: {
      'ui:options': { uswds: { width: 'lg', prefix: '$' } },
    },
    contacts: {
      items: {
        role: { 'ui:widget': 'radio' },
      },
    },
  },
  formData: {
    contacts: [{}],
  },
};

export default permitting;
