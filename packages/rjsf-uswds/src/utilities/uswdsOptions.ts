import type { UIOptionsType } from '@rjsf/utils';

/** USWDS input width tokens, mirroring the `usa-input--*` width modifier classes. */
export const USWDS_INPUT_WIDTHS = [
  '2xs',
  'xs',
  'sm',
  'small',
  'md',
  'medium',
  'lg',
  'xl',
  '2xl',
] as const;

export type UswdsInputWidth = (typeof USWDS_INPUT_WIDTHS)[number];

/**
 * The USWDS-specific presentation options supported under
 * `ui:options.uswds` in a uiSchema. This is deliberately a small semantic
 * API rather than a generic CSS injection mechanism.
 */
export interface UswdsOptions {
  /** Input width, using USWDS input-width conventions (`2xs` through `2xl`). */
  width?: UswdsInputWidth;
  /** Text rendered in a USWDS input prefix (e.g. `$`). */
  prefix?: string;
  /** Text rendered in a USWDS input suffix (e.g. `lbs.`). */
  suffix?: string;
  /** Render radio/checkbox options in the USWDS "tile" style. */
  tile?: boolean;
  /**
   * USWDS input mask (e.g. `___-___-____`, `___ __ ____`, `A#A #A#`):
   * `_`/`#`/`9` and friends are digit slots, `A` is a letter slot, anything
   * else is a literal inserted while typing. Applies to text-like inputs only.
   */
  mask?: string;
}

function isUswdsWidth(value: unknown): value is UswdsInputWidth {
  return typeof value === 'string' && (USWDS_INPUT_WIDTHS as readonly string[]).includes(value);
}

/**
 * Extracts the validated `uswds` options object from a field's resolved UI
 * options (the result of `getUiOptions(uiSchema)`). Unknown or invalid
 * values are dropped rather than passed through to the DOM.
 */
export function getUswdsOptions(uiOptions: UIOptionsType<any, any, any>): UswdsOptions {
  const raw = (uiOptions as { uswds?: unknown }).uswds;
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  const candidate = raw as Record<string, unknown>;
  const result: UswdsOptions = {};
  if (isUswdsWidth(candidate.width)) {
    result.width = candidate.width;
  }
  if (typeof candidate.prefix === 'string') {
    result.prefix = candidate.prefix;
  }
  if (typeof candidate.suffix === 'string') {
    result.suffix = candidate.suffix;
  }
  if (typeof candidate.tile === 'boolean') {
    result.tile = candidate.tile;
  }
  if (typeof candidate.mask === 'string' && candidate.mask.length > 0) {
    result.mask = candidate.mask;
  }
  return result;
}

/** Returns the `usa-input--*` width modifier class for a width token, if any. */
export function inputWidthClass(width: UswdsInputWidth | undefined): string | undefined {
  return width ? `usa-input--${width}` : undefined;
}

/** Returns the `usa-input-group--*` width modifier class for a width token, if any. */
export function inputGroupWidthClass(width: UswdsInputWidth | undefined): string | undefined {
  return width ? `usa-input-group--${width}` : undefined;
}

/** Composes CSS class names, dropping falsy entries. */
export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
