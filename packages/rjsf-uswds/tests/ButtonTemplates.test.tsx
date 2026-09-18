import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const arraySchema: RJSFSchema = {
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

describe('ButtonTemplates', () => {
  it('renders submit as a native submit button inside uswds-button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm(
      {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
        },
      },
      {
        formData: { name: 'Riverside Bridge Retrofit' },
        formProps: { onSubmit },
      },
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const wrapper = submitButton.closest('uswds-button');
    expect(wrapper).not.toBeNull();
    expect(submitButton.tagName).toBe('BUTTON');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveClass('usa-button');

    await user.click(submitButton);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it('keeps array action buttons accessible and clickable', async () => {
    const user = userEvent.setup();
    renderForm(arraySchema, { formData: { contacts: [{ name: 'A' }] } });

    const addButton = screen.getByRole('button', { name: 'Add another contact' });
    const removeButton = screen.getByRole('button', { name: 'Remove contact 1' });
    expect(addButton.closest('uswds-button')).not.toBeNull();
    expect(removeButton.closest('uswds-button')).not.toBeNull();
    expect(addButton).toHaveAttribute('type', 'button');
    expect(removeButton).toHaveAttribute('type', 'button');
    expect(addButton).toHaveClass('usa-button', 'usa-button--outline');
    expect(removeButton).toHaveClass('usa-button', 'usa-button--unstyled');

    await user.click(addButton);
    expect(screen.getByRole('group', { name: 'Contact 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove contact 2' }));
    expect(screen.queryByRole('group', { name: 'Contact 2' })).toBeNull();
  });

  it('keeps disabled move controls disabled on the native button', () => {
    renderForm(arraySchema, { formData: { contacts: [{ name: 'A' }, { name: 'B' }] } });

    const moveUp = screen.getByRole('button', { name: 'Move contact 1 up' });
    const moveDown = screen.getByRole('button', { name: 'Move contact 1 down' });

    expect(moveUp).toBeDisabled();
    expect(moveUp).toHaveClass('usa-button', 'usa-button--unstyled');
    expect(moveDown).toBeEnabled();
    expect(moveDown).toHaveClass('usa-button', 'usa-button--unstyled');
  });
});
