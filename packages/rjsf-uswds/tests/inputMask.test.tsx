import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RJSFSchema } from '@rjsf/utils';
import { applyInputMask, maskDisplayPlaceholder } from '../src/index.js';
import { renderForm } from './helpers';

describe('applyInputMask', () => {
  it('formats a Social Security number', () => {
    expect(applyInputMask('123456789', '___ __ ____')).toBe('123 45 6789');
  });

  it('formats a phone number, inserting literals eagerly', () => {
    expect(applyInputMask('5551234567', '___-___-____')).toBe('555-123-4567');
    expect(applyInputMask('555', '___-___-____')).toBe('555-');
    expect(applyInputMask('5551', '___-___-____')).toBe('555-1');
  });

  it('ignores non-digit characters in digit-only masks', () => {
    expect(applyInputMask('12a34', '_____-____')).toBe('1234');
    expect(applyInputMask('(555) 123-4567', '___-___-____')).toBe('555-123-4567');
  });

  it('handles alphanumeric charset masks', () => {
    expect(applyInputMask('a1b2c3', 'A#A #A#')).toBe('a1b 2c3');
  });

  it('stops at a character of the wrong class in charset masks', () => {
    expect(applyInputMask('11', 'A#A #A#')).toBe('');
    // 'x' cannot fill the digit slot after the literal space, so it is dropped.
    expect(applyInputMask('a1bx', 'A#A #A#')).toBe('a1b ');
  });

  it('truncates input beyond the mask length', () => {
    expect(applyInputMask('123456789000000', '___ __ ____')).toBe('123 45 6789');
  });

  it('returns empty for empty or all-invalid input', () => {
    expect(applyInputMask('', '(___) ___')).toBe('');
    expect(applyInputMask('abc', '___-___')).toBe('');
  });
});

describe('maskDisplayPlaceholder', () => {
  it('renders slots as underscores and keeps literals', () => {
    expect(maskDisplayPlaceholder('___ __ ____')).toBe('___ __ ____');
    expect(maskDisplayPlaceholder('A#A #A#')).toBe('___ ___');
    expect(maskDisplayPlaceholder('(___) ___')).toBe('(___) ___');
  });
});

describe('masked BaseInputTemplate', () => {
  const schema: RJSFSchema = {
    type: 'object',
    properties: {
      phone: { type: 'string', title: 'Phone number' },
    },
  };
  const uiSchema = {
    phone: { 'ui:options': { uswds: { mask: '___-___-____' } } },
  };

  it('renders the USWDS masked-input markup', () => {
    renderForm(schema, { uiSchema, formData: { phone: '555-12' } });
    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveClass('usa-input', 'usa-masked');
    expect(input).toHaveAttribute('maxlength', '12');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    const shell = input.closest('.usa-input-mask');
    expect(shell).not.toBeNull();
    const ghost = shell!.querySelector('.usa-input-mask--content');
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
    // Ghost shows the typed value (hidden) plus the remaining mask.
    expect(ghost).toHaveTextContent('555-12_-____');
  });

  it('formats while typing and stores the formatted value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(schema, { uiSchema, formProps: { onChange } });
    const input = screen.getByLabelText('Phone number');
    await user.type(input, '5551234567');
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({ phone: '555-123-4567' });
    expect(input).toHaveValue('555-123-4567');
  });

  it('drops characters that do not fit the mask', async () => {
    const user = userEvent.setup();
    renderForm(schema, { uiSchema });
    const input = screen.getByLabelText('Phone number');
    await user.type(input, '55x5');
    // 'x' is dropped; the trailing literal appears once the third digit lands.
    expect(input).toHaveValue('555-');
  });

  it('clears completely when emptied', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderForm(schema, { uiSchema, formData: { phone: '555-' }, formProps: { onChange } });
    const input = screen.getByLabelText('Phone number');
    await user.clear(input);
    expect(onChange.mock.calls.at(-1)?.[0].formData).toEqual({});
  });

  it('ignores masks on non-text inputs', () => {
    renderForm(
      {
        type: 'object',
        properties: { count: { type: 'number', title: 'Count' } },
      },
      { uiSchema: { count: { 'ui:options': { uswds: { mask: '___' } } } } },
    );
    const input = screen.getByLabelText('Count');
    expect(input).not.toHaveClass('usa-masked');
    expect(input).toHaveAttribute('type', 'number');
  });
});
