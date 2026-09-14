import type { RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

/**
 * Derives a human-friendly name for the items of an array schema, used for
 * button labels such as "Add another contact" / "Remove contact".
 *
 * Falls back to "item" when the schema provides no title for its items.
 */
export function getArrayItemLabel<S extends StrictRJSFSchema = RJSFSchema>(schema: S): string {
  const items = schema.items;
  if (items && typeof items === 'object' && !Array.isArray(items)) {
    const title = (items as RJSFSchema).title;
    if (typeof title === 'string' && title.trim().length > 0) {
      return humanizeItemLabel(title.trim());
    }
  }
  return 'item';
}

/**
 * Lowercases a title for use mid-sentence in button labels ("Contact" ->
 * "contact"), while leaving acronyms ("POC") alone.
 */
export function humanizeItemLabel(title: string): string {
  if (title.length > 1 && title === title.toUpperCase()) {
    return title;
  }
  return title.charAt(0).toLowerCase() + title.slice(1);
}

/** Label for the add button of an array: "Add another contact" / "Add contact". */
export function addButtonLabel(itemLabel: string, hasItems: boolean): string {
  return hasItems ? `Add another ${itemLabel}` : `Add ${itemLabel}`;
}
