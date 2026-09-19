import { describe, expect, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderForm } from './helpers';

const updateComplete = (element: Element) =>
  (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

describe('ButtonTemplates', () => {
  it('renders submit through the uswds-button custom element', async () => {
    renderForm(
      {
        type: 'object',
        properties: { name: { type: 'string', title: 'Name' } },
      },
      {
        uiSchema: {
          'ui:submitButtonOptions': {
            submitText: 'Send application',
          },
        },
      },
    );

    const button = document.querySelector('uswds-button')!;
    await updateComplete(button);

    expect(button).toHaveTextContent('Send application');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('variant', 'primary');
    expect(button.querySelector('button')).toBeNull();
    expect(button.shadowRoot!.querySelector('button')).toHaveClass('usa-button');
  });

  it('forwards submit button props through the custom-element adapter', async () => {
    renderForm(
      {
        type: 'object',
        properties: { name: { type: 'string', title: 'Name' } },
      },
      {
        uiSchema: {
          'ui:submitButtonOptions': {
            submitText: 'Save',
            props: {
              'aria-label': 'Save application',
              className: 'app-submit',
              disabled: true,
              id: 'custom-submit',
            },
          },
        },
      },
    );

    const button = document.querySelector('#custom-submit')!;
    await updateComplete(button);

    expect(button).toHaveClass('app-submit');
    expect(button).toHaveAttribute('button-label', 'Save application');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button.shadowRoot!.querySelector('button')).toBeDisabled();
    expect(button.shadowRoot!.querySelector('button')).toHaveAccessibleName('Save application');
  });

  it('submits the RJSF form exactly once through the custom element bridge', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm(
      {
        type: 'object',
        properties: { name: { type: 'string', title: 'Name' } },
      },
      {
        formData: { name: 'Riverside Bridge' },
        formProps: { onSubmit },
      },
    );

    const button = document.querySelector('uswds-button')!;
    await updateComplete(button);
    await user.click(button.shadowRoot!.querySelector('button')!);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it('renders array action buttons through uswds-button variants', async () => {
    renderForm(
      {
        type: 'object',
        properties: {
          contacts: {
            type: 'array',
            title: 'Contacts',
            items: { type: 'string', title: 'Contact' },
          },
        },
      },
      {
        formData: { contacts: ['Ada'] },
        uiSchema: { 'ui:submitButtonOptions': { norender: true } },
      },
    );

    const add = document.querySelector('#root_contacts__add')!;
    const remove = document.querySelector('#root_contacts_0__remove')!;
    await updateComplete(add);
    await updateComplete(remove);

    expect(add).toHaveTextContent('Add another contact');
    expect(add).toHaveAttribute('type', 'button');
    expect(add).toHaveAttribute('variant', 'outline');
    expect(remove).toHaveTextContent('Remove contact');
    expect(remove).not.toHaveAttribute('aria-label');
    expect(remove.shadowRoot!.querySelector('button')).toHaveAccessibleName('Remove contact 1');
    expect(remove).toHaveAttribute('type', 'button');
    expect(remove).toHaveAttribute('variant', 'unstyled');
  });
});
