import { describe, expect, it } from 'vitest';
import { axe } from 'jest-axe';
import type { ErrorSchema, RJSFSchema, UiSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const representativeSchema: RJSFSchema = {
  title: 'Representative form',
  description: 'Covers each control type the theme provides.',
  type: 'object',
  required: ['name', 'agency'],
  properties: {
    name: { type: 'string', title: 'Name', description: 'Your full name.' },
    email: { type: 'string', format: 'email', title: 'Email' },
    age: { type: 'integer', title: 'Age' },
    bio: { type: 'string', title: 'Bio' },
    agency: { type: 'string', title: 'Agency', enum: ['DOT', 'DOE', 'EPA'] },
    contactMethod: {
      type: 'string',
      title: 'Contact method',
      description: 'How should we reach you?',
      enum: ['Email', 'Phone'],
    },
    topics: {
      type: 'array',
      title: 'Topics',
      items: { type: 'string', enum: ['Roads', 'Rail'] },
      uniqueItems: true,
    },
    subscribe: { type: 'boolean', title: 'Subscribe', description: 'Monthly notes.' },
    start: { type: 'string', format: 'date', title: 'Start date' },
    contacts: {
      type: 'array',
      title: 'Contacts',
      items: {
        type: 'object',
        title: 'Contact',
        properties: { name: { type: 'string', title: 'Contact name' } },
      },
    },
  },
};

const representativeUiSchema: UiSchema = {
  bio: { 'ui:widget': 'textarea' },
  contactMethod: { 'ui:widget': 'radio' },
  age: { 'ui:options': { uswds: { width: 'sm' } } },
};

describe('accessibility', () => {
  it('renders the representative form with no axe violations', async () => {
    const { container } = renderForm(representativeSchema, {
      uiSchema: representativeUiSchema,
      formData: { contacts: [{ name: 'A' }, { name: 'B' }] },
    });
    expect((await axe(container)).violations).toEqual([]);
  }, 30000);

  it('renders the error state with no axe violations', async () => {
    const { container } = renderForm(representativeSchema, {
      uiSchema: representativeUiSchema,
      formProps: {
        extraErrors: {
          name: { __errors: ['Enter your name.'] },
          agency: { __errors: ['Select an agency.'] },
          contactMethod: { __errors: ['Select a contact method.'] },
        } as unknown as ErrorSchema,
      },
    });
    expect((await axe(container)).violations).toEqual([]);
  }, 30000);

  it('renders disabled and readonly states with no axe violations', async () => {
    const { container } = renderForm(representativeSchema, {
      uiSchema: representativeUiSchema,
      formData: { name: 'A. Person', subscribe: true },
      formProps: { disabled: true },
    });
    expect((await axe(container)).violations).toEqual([]);
  }, 30000);
});
