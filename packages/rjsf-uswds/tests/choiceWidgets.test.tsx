import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const selectSchema: RJSFSchema = {
  type: 'object',
  properties: {
    agency: {
      type: 'string',
      title: 'Lead agency',
      enum: ['DOT', 'DOE', 'EPA'],
    },
  },
};

describe('SelectWidget', () => {
  it('renders a usa-select with a placeholder option', () => {
    renderForm(selectSchema);
    const select = screen.getByLabelText('Lead agency');
    expect(select).toHaveClass('usa-select');
    const options = Array.from((select as HTMLSelectElement).options).map((o) => o.text);
    expect(options[0]).toBe('- Select -');
    expect(options).toContain('DOT');
  });

  it('propagates selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(selectSchema, { formProps: { onChange } });
    await user.selectOptions(screen.getByLabelText('Lead agency'), 'EPA');
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({ agency: 'EPA' });
  });

  it('renders multi-select enums as a USWDS checkbox group by default', () => {
    renderForm({
      type: 'object',
      properties: {
        topics: {
          type: 'array',
          title: 'Topics',
          items: { type: 'string', enum: ['Roads', 'Rail'] },
          uniqueItems: true,
        },
      },
    });
    const group = screen.getByRole('group', { name: /Topics/ });
    expect(group.tagName).toBe('FIELDSET');
    expect(screen.getByLabelText('Roads')).toHaveAttribute('type', 'checkbox');
    expect(screen.getByLabelText('Roads')).toHaveClass('usa-checkbox__input');
  });

  it('honors an explicit ui:widget select for multi-select enums', () => {
    renderForm(
      {
        type: 'object',
        properties: {
          topics: {
            type: 'array',
            title: 'Topics',
            items: { type: 'string', enum: ['Roads', 'Rail'] },
            uniqueItems: true,
          },
        },
      },
      { uiSchema: { topics: { 'ui:widget': 'select' } } },
    );
    const select = screen.getByRole('listbox');
    expect(select).toHaveAttribute('multiple');
  });
});

describe('RadioWidget', () => {
  it('renders a fieldset with legend and USWDS radios', () => {
    renderForm(selectSchema, { uiSchema: { agency: { 'ui:widget': 'radio' } } });
    const group = screen.getByRole('group', { name: /Lead agency/ });
    expect(group.tagName).toBe('FIELDSET');
    expect(group.querySelector('legend.usa-legend')).toHaveTextContent('Lead agency');
    const radio = screen.getByLabelText('DOT');
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).toHaveClass('usa-radio__input');
    expect(radio).toHaveAttribute('name', 'root_agency');
  });

  it('checks the selected option and propagates changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(selectSchema, {
      uiSchema: { agency: { 'ui:widget': 'radio' } },
      formData: { agency: 'DOE' },
      formProps: { onChange },
    });
    expect(screen.getByLabelText('DOE')).toBeChecked();
    await user.click(screen.getByLabelText('EPA'));
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({ agency: 'EPA' });
  });
});

describe('CheckboxWidget', () => {
  const boolSchema: RJSFSchema = {
    type: 'object',
    properties: {
      subscribe: {
        type: 'boolean',
        title: 'Subscribe to updates',
        description: 'About one email per month.',
      },
    },
  };

  it('renders a USWDS checkbox that carries its own label', () => {
    renderForm(boolSchema);
    const checkbox = screen.getByLabelText(/Subscribe to updates/);
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveClass('usa-checkbox__input');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles the value through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(boolSchema, { formProps: { onChange } });
    await user.click(screen.getByLabelText(/Subscribe to updates/));
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({ subscribe: true });
  });

  it('reflects checked state from formData and disables when readonly', () => {
    renderForm(boolSchema, {
      formData: { subscribe: true },
      formProps: { readonly: true },
    });
    const checkbox = screen.getByLabelText(/Subscribe to updates/);
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });
});

describe('CheckboxesWidget', () => {
  it('selects and deselects values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(
      {
        type: 'object',
        properties: {
          topics: {
            type: 'array',
            title: 'Topics',
            items: { type: 'string', enum: ['Roads', 'Rail', 'Transit'] },
            uniqueItems: true,
          },
        },
      },
      { formData: { topics: ['Rail'] }, formProps: { onChange } },
    );
    expect(screen.getByLabelText('Rail')).toBeChecked();
    await user.click(screen.getByLabelText('Roads'));
    expect(onChange.mock.calls.at(-1)?.[0].formData.topics).toEqual(['Roads', 'Rail']);
    await user.click(screen.getByLabelText('Rail'));
    expect(onChange.mock.calls.at(-1)?.[0].formData.topics).toEqual(['Roads']);
  });
});

describe('TextareaWidget', () => {
  it('renders a usa-textarea and propagates changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(
      {
        type: 'object',
        properties: { bio: { type: 'string', title: 'Bio' } },
      },
      {
        uiSchema: { bio: { 'ui:widget': 'textarea', 'ui:options': { rows: 6 } } },
        formProps: { onChange },
      },
    );
    const textarea = screen.getByLabelText('Bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('usa-textarea');
    expect(textarea).toHaveAttribute('rows', '6');
    await user.type(textarea, 'Hi');
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({ bio: 'Hi' });
  });
});
