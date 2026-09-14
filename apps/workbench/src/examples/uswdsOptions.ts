import type { WorkbenchExample } from './types';

const uswdsOptions: WorkbenchExample = {
  id: 'uswds-options',
  title: 'USWDS ui:options',
  description:
    "The theme's namespaced uiSchema extensions: input widths, prefixes/suffixes, and tiled options.",
  schema: {
    title: 'USWDS presentation options',
    description:
      'These fields are identical strings/numbers in JSON Schema; presentation differences come from ui:options.uswds.',
    type: 'object',
    properties: {
      zip: { type: 'string', title: 'ZIP code (width: sm)' },
      year: { type: 'string', title: 'Year (width: 2xs)' },
      cost: { type: 'number', title: 'Cost (prefix: $)' },
      weight: { type: 'number', title: 'Weight (suffix: lbs.)' },
      preference: {
        type: 'string',
        title: 'Delivery preference (tile: true)',
        enum: ['Standard', 'Expedited', 'Overnight'],
      },
      phone: {
        type: 'string',
        title: 'Phone number (mask: ___-___-____)',
        description: 'For example, 555-123-4567',
      },
      ssn: {
        type: 'string',
        title: 'Social Security number (mask: ___ __ ____)',
        description: 'For example, 123 45 6789',
      },
      postalCode: {
        type: 'string',
        title: 'Canadian postal code (mask: A#A #A#)',
        description: 'For example, A1B 2C3',
      },
    },
  },
  uiSchema: {
    zip: { 'ui:options': { uswds: { width: 'sm' } } },
    year: { 'ui:options': { uswds: { width: '2xs' } } },
    cost: { 'ui:options': { uswds: { width: 'md', prefix: '$' } } },
    weight: { 'ui:options': { uswds: { width: 'md', suffix: 'lbs.' } } },
    preference: {
      'ui:widget': 'radio',
      'ui:options': { uswds: { tile: true } },
    },
    phone: { 'ui:options': { uswds: { mask: '___-___-____', width: 'md' } } },
    ssn: { 'ui:options': { uswds: { mask: '___ __ ____', width: 'md' } } },
    postalCode: { 'ui:options': { uswds: { mask: 'A#A #A#', width: 'sm' } } },
  },
  formData: {},
};

export default uswdsOptions;
