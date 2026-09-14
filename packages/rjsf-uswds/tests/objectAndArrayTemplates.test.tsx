import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

describe('ObjectFieldTemplate', () => {
  it('renders titled objects as fieldsets with legends and descriptions', () => {
    renderForm({
      type: 'object',
      properties: {
        location: {
          type: 'object',
          title: 'Project location',
          description: 'Tell us where the proposed project is located.',
          properties: {
            city: { type: 'string', title: 'City' },
          },
        },
      },
    });
    const section = screen.getByRole('group', { name: 'Project location' });
    expect(section.tagName).toBe('FIELDSET');
    expect(section.querySelector('legend.usa-legend')).toHaveTextContent('Project location');
    expect(section.querySelector('.usa-hint')).toHaveTextContent(
      'Tell us where the proposed project is located.',
    );
    expect(within(section).getByLabelText('City')).toBeInTheDocument();
  });

  it('gives the root object the large legend treatment', () => {
    renderForm({
      type: 'object',
      title: 'Application',
      properties: { name: { type: 'string', title: 'Name' } },
    });
    const legend = document.querySelector('#root > legend');
    expect(legend).toHaveClass('usa-legend--large');
  });

  it('renders untitled objects without section chrome', () => {
    renderForm({
      type: 'object',
      properties: {
        wrapper: {
          type: 'object',
          properties: { inner: { type: 'string', title: 'Inner field' } },
        },
      },
    });
    expect(screen.getByLabelText('Inner field')).toBeInTheDocument();
    // Only implicit root exists; the structural object adds no fieldset.
    expect(document.querySelectorAll('fieldset').length).toBe(0);
  });
});

describe('ArrayFieldTemplate', () => {
  const contactsSchema: RJSFSchema = {
    type: 'object',
    properties: {
      contacts: {
        type: 'array',
        title: 'Project contacts',
        items: {
          type: 'object',
          title: 'Contact',
          properties: {
            name: { type: 'string', title: 'Name' },
          },
        },
      },
    },
  };

  it('derives human-friendly add button labels from the item title', async () => {
    renderForm(contactsSchema);
    expect(screen.getByRole('button', { name: 'Add contact' })).toBeInTheDocument();
  });

  it('numbers repeated object entries and supports add/remove', async () => {
    const user = userEvent.setup();
    renderForm(contactsSchema, { formData: { contacts: [{ name: 'A' }] } });
    expect(screen.getByRole('group', { name: 'Contact 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add another contact' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add another contact' }));
    expect(screen.getByRole('group', { name: 'Contact 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove contact 2' }));
    expect(screen.queryByRole('group', { name: 'Contact 2' })).toBeNull();
  });

  it('supports reordering with position-aware accessible names', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(contactsSchema, {
      formData: { contacts: [{ name: 'First' }, { name: 'Second' }] },
      formProps: { onChange },
    });
    const moveUpFirst = screen.getByRole('button', { name: 'Move contact 1 up' });
    expect(moveUpFirst).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Move contact 1 down' }));
    expect(onChange.mock.calls.at(-1)?.[0].formData.contacts).toEqual([
      { name: 'Second' },
      { name: 'First' },
    ]);
  });

  it('renders scalar arrays with add and remove controls', async () => {
    const user = userEvent.setup();
    renderForm({
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          title: 'Keywords',
          items: { type: 'string', title: 'Keyword' },
        },
      },
    });
    await user.click(screen.getByRole('button', { name: 'Add keyword' }));
    expect(screen.getByRole('button', { name: 'Remove keyword 1' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove keyword 1' }));
    expect(screen.queryByRole('button', { name: 'Remove keyword 1' })).toBeNull();
  });
});
