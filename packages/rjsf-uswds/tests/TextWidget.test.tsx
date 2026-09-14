import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const schema: RJSFSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Project name' },
  },
};

describe('TextWidget', () => {
  it('renders a USWDS text input associated with its label', () => {
    renderForm(schema);
    const input = screen.getByLabelText('Project name');
    expect(input).toHaveClass('usa-input');
    expect(input).toHaveAttribute('id', 'root_name');
    expect(input).toHaveAttribute('name', 'root_name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('propagates typed values through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(schema, { formProps: { onChange } });
    await user.type(screen.getByLabelText('Project name'), 'Dam');
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall.formData).toEqual({ name: 'Dam' });
  });

  it('keeps the input controlled when formData changes', () => {
    const { rerender: _r } = renderForm(schema, { formData: { name: 'Initial' } });
    expect(screen.getByLabelText('Project name')).toHaveValue('Initial');
  });

  it('renders number schemas as number inputs', () => {
    renderForm({
      type: 'object',
      properties: { count: { type: 'number', title: 'Count' } },
    });
    expect(screen.getByLabelText('Count')).toHaveAttribute('type', 'number');
  });

  it('renders email format as an email input', () => {
    renderForm({
      type: 'object',
      properties: { email: { type: 'string', format: 'email', title: 'Email' } },
    });
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('renders date format as a date input with usa-input class', () => {
    renderForm({
      type: 'object',
      properties: { start: { type: 'string', format: 'date', title: 'Start date' } },
    });
    const input = screen.getByLabelText('Start date');
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveClass('usa-input');
  });

  it('honors disabled, readonly and placeholder', () => {
    renderForm(schema, {
      uiSchema: { name: { 'ui:placeholder': 'Enter a name' } },
      formProps: { disabled: true },
    });
    const input = screen.getByLabelText('Project name');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('placeholder', 'Enter a name');
  });

  it('applies USWDS width, prefix and suffix options', () => {
    renderForm(
      {
        type: 'object',
        properties: {
          zip: { type: 'string', title: 'ZIP' },
          cost: { type: 'number', title: 'Cost' },
        },
      },
      {
        uiSchema: {
          zip: { 'ui:options': { uswds: { width: 'sm' } } },
          cost: { 'ui:options': { uswds: { width: 'md', prefix: '$', suffix: 'USD' } } },
        },
      },
    );
    expect(screen.getByLabelText('ZIP')).toHaveClass('usa-input--sm');
    const costGroup = screen.getByLabelText('Cost').closest('.usa-input-group');
    expect(costGroup).not.toBeNull();
    expect(costGroup).toHaveClass('usa-input-group--md');
    expect(costGroup).toHaveTextContent('$');
    expect(costGroup).toHaveTextContent('USD');
  });
});
