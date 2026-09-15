import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import type { ErrorSchema, RJSFSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const schema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Project name',
      description: 'Enter the official project name.',
    },
    optionalField: { type: 'string', title: 'Optional field' },
  },
};

describe('FieldTemplate', () => {
  it('wraps fields in usa-form-group with label, hint and control', () => {
    renderForm(schema);
    const input = screen.getByLabelText(/Project name/);
    const group = input.closest('.usa-form-group');
    expect(group).not.toBeNull();
    const label = group!.querySelector('label.usa-label');
    expect(label).toHaveAttribute('for', 'root_name');
    const hint = group!.querySelector('#root_name__description');
    expect(hint).toHaveClass('usa-hint');
    expect(hint).toHaveTextContent('Enter the official project name.');
  });

  it('associates the hint with the control via aria-describedby', () => {
    renderForm(schema);
    const input = screen.getByLabelText(/Project name/);
    expect(input).toHaveAttribute('aria-describedby', 'root_name__description');
  });

  it('does not reference non-existent description elements', () => {
    renderForm(schema);
    const input = screen.getByLabelText('Optional field');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('marks required fields with the USWDS required marker', () => {
    renderForm(schema);
    const label = document.querySelector('label[for="root_name"]');
    expect(label!.querySelector('abbr[title="required"]')).not.toBeNull();
    const optionalLabel = document.querySelector('label[for="root_optionalField"]');
    expect(optionalLabel!.querySelector('abbr[title="required"]')).toBeNull();
  });

  it('renders error state with usa-form-group--error and associated message', () => {
    renderForm(schema, {
      formProps: {
        extraErrors: { name: { __errors: ['Enter a project name.'] } } as unknown as ErrorSchema,
        showErrorList: false,
      },
    });
    const input = screen.getByLabelText(/Project name/);
    expect(input.closest('.usa-form-group')).toHaveClass('usa-form-group--error');
    const error = document.getElementById('root_name__error');
    expect(error).not.toBeNull();
    const errorMessage = error!.querySelector('uswds-error-message .usa-error-message');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage).toHaveTextContent('Enter a project name.');
    expect(input.getAttribute('aria-describedby')).toContain('root_name__error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders ui:help as a hint associated with the control', () => {
    renderForm(schema, {
      uiSchema: { optionalField: { 'ui:help': 'Extra guidance.' } },
    });
    const input = screen.getByLabelText('Optional field');
    expect(input.getAttribute('aria-describedby')).toContain('root_optionalField__help');
    expect(document.getElementById('root_optionalField__help')).toHaveTextContent(
      'Extra guidance.',
    );
  });

  it('renders hidden widgets without visible form-group chrome', () => {
    renderForm(schema, {
      uiSchema: { optionalField: { 'ui:widget': 'hidden' } },
    });
    expect(screen.queryByLabelText('Optional field')).toBeNull();
    expect(document.querySelectorAll('.usa-form-group')).toHaveLength(1);
  });
});
