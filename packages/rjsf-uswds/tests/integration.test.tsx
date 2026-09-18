import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { renderForm } from './helpers';

const permittingSchema: RJSFSchema = {
  title: 'Infrastructure project review application',
  type: 'object',
  required: ['projectName', 'projectType'],
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
      enum: ['Highway', 'Energy', 'Water'],
    },
    applicant: {
      type: 'object',
      title: 'Applicant',
      required: ['email'],
      properties: {
        name: { type: 'string', title: 'Name' },
        email: { type: 'string', format: 'email', title: 'Email address' },
      },
    },
    estimatedCost: { type: 'number', title: 'Estimated project cost', minimum: 0 },
    constructionStart: { type: 'string', format: 'date', title: 'Construction start date' },
    contacts: {
      type: 'array',
      title: 'Project contacts',
      items: {
        type: 'object',
        title: 'Contact',
        properties: {
          name: { type: 'string', title: 'Name' },
          email: { type: 'string', format: 'email', title: 'Email address' },
        },
      },
    },
  },
};

const permittingUiSchema: UiSchema = {
  projectType: { 'ui:widget': 'radio' },
  estimatedCost: { 'ui:options': { uswds: { width: 'lg', prefix: '$' } } },
};

describe('permitting-style form integration', () => {
  it('renders the full form coherently through the theme', () => {
    renderForm(permittingSchema, {
      uiSchema: permittingUiSchema,
      formData: { contacts: [{}] },
    });
    // Root section with large legend.
    expect(document.querySelector('#root > legend.usa-legend--large')).toHaveTextContent(
      'Infrastructure project review application',
    );
    // Nested object section.
    expect(screen.getByRole('group', { name: 'Applicant' })).toBeInTheDocument();
    // Radio group from uiSchema.
    expect(screen.getByLabelText('Highway')).toHaveAttribute('type', 'radio');
    // Prefixed currency input.
    expect(
      screen.getByLabelText(/Estimated project cost/).closest('.usa-input-group'),
    ).not.toBeNull();
    // Array item with numbered legend.
    expect(screen.getByRole('group', { name: 'Contact 1' })).toBeInTheDocument();
    // Date input.
    expect(screen.getByLabelText('Construction start date')).toHaveAttribute('type', 'date');
  });

  it('shows a linked USWDS error summary on failed submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm(permittingSchema, {
      uiSchema: permittingUiSchema,
      formData: { applicant: { email: 'not-an-email' } },
      formProps: { onSubmit },
    });
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(document.querySelector('.rjsf-uswds-error-list')).not.toBeNull();
    });
    expect(onSubmit).not.toHaveBeenCalled();

    const alert = document.querySelector<HTMLElement>('uswds-alert.rjsf-uswds-error-list')!;
    await (alert as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(screen.getByRole('alert')).toBe(alert);
    expect(alert).toHaveAttribute('type', 'error');
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert.shadowRoot).toBeNull();
    expect(alert).toHaveClass('usa-alert', 'usa-alert--error');
    expect(alert.querySelector('.usa-alert__heading')).toHaveTextContent('This form has 3 errors');

    const links = Array.from(alert.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('#root_projectName');
    expect(links).toContain('#root_projectType');
    expect(links).toContain('#root_applicant_email');

    // Field-level error is rendered and associated.
    const emailInput = screen.getByLabelText(/Email address/);
    expect(emailInput.getAttribute('aria-describedby')).toContain('root_applicant_email__error');
    expect(
      document.querySelector('#root_applicant_email__error .usa-error-message'),
    ).not.toBeNull();
  });

  it('submits successfully when the data is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm(permittingSchema, {
      uiSchema: permittingUiSchema,
      formData: {
        projectName: 'Riverside Bridge Retrofit',
        projectType: 'Highway',
        applicant: { name: 'A. Person', email: 'a@example.gov' },
      },
      formProps: { onSubmit },
    });
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].formData.projectName).toBe('Riverside Bridge Retrofit');
  });
});
