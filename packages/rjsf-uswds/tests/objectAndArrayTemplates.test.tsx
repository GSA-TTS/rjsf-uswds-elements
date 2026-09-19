import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

async function shadowButton(selector: string) {
  const host = document.querySelector(selector)!;
  await updateComplete(host);
  return host.shadowRoot!.querySelector('button')!;
}

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
    expect(await shadowButton('#root_contacts__add')).toHaveAccessibleName('Add contact');
  });

  it('numbers repeated object entries and supports add/remove', async () => {
    const user = userEvent.setup();
    renderForm(contactsSchema, { formData: { contacts: [{ name: 'A' }] } });
    expect(screen.getByRole('group', { name: 'Contact 1' })).toBeInTheDocument();
    expect(await shadowButton('#root_contacts__add')).toHaveAccessibleName('Add another contact');

    await user.click(await shadowButton('#root_contacts__add'));
    expect(screen.getByRole('group', { name: 'Contact 2' })).toBeInTheDocument();

    await user.click(await shadowButton('#root_contacts_1__remove'));
    expect(screen.queryByRole('group', { name: 'Contact 2' })).toBeNull();
  });

  it('supports reordering with position-aware accessible names', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(contactsSchema, {
      formData: { contacts: [{ name: 'First' }, { name: 'Second' }] },
      formProps: { onChange },
    });
    const moveUpFirst = await shadowButton('#root_contacts_0__moveUp');
    expect(moveUpFirst).toHaveAccessibleName('Move contact 1 up');
    expect(moveUpFirst).toBeDisabled();
    await user.click(await shadowButton('#root_contacts_0__moveDown'));
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
    await user.click(await shadowButton('#root_keywords__add'));
    expect(await shadowButton('#root_keywords_0__remove')).toHaveAccessibleName('Remove keyword 1');
    await user.click(await shadowButton('#root_keywords_0__remove'));
    expect(document.querySelector('#root_keywords_0__remove')).toBeNull();
  });
});
