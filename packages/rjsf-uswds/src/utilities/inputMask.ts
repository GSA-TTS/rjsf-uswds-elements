/**
 * A controlled-input port of the USWDS input mask component
 * (https://designsystem.digital.gov/components/input-mask/).
 *
 * USWDS's own implementation is imperative JavaScript that rewrites the
 * input's value on keyup, which conflicts with RJSF's controlled-form model,
 * so the theme reproduces the same formatting algorithm and markup shell in
 * React. Mask strings follow the USWDS conventions used by its
 * `data-placeholder`/`data-charset` attributes:
 *
 * - `_` `#` `d` `D` `m` `M` `y` `Y` `9` — a digit slot
 * - `A` — a letter slot
 * - any other character — a literal, inserted automatically while typing
 *
 * Examples: `___ __ ____` (SSN), `___-___-____` (phone), `A#A #A#`
 * (alphanumeric, e.g. Canadian postal code).
 */

const DIGIT_SLOTS = '_#dDmMyY9';
const LETTER_SLOT = 'A';

/** True when the mask contains letter slots (USWDS "charset" masks). */
export function maskHasLetterSlots(mask: string): boolean {
  return mask.includes(LETTER_SLOT);
}

/**
 * The ghost placeholder USWDS displays for a mask: slot characters render as
 * underscores, literals as themselves (matching the USWDS fixtures, where
 * charset `A#A #A#` displays as `___ ___`).
 */
export function maskDisplayPlaceholder(mask: string): string {
  return Array.from(mask)
    .map((char) => (DIGIT_SLOTS.includes(char) || char === LETTER_SLOT ? '_' : char))
    .join('');
}

/**
 * Formats a raw input value against a mask, mirroring USWDS's
 * `handleCurrentValue`: characters of the wrong class stop formatting (they
 * are dropped), literals are inserted eagerly while more characters remain,
 * and output never exceeds the mask length.
 */
export function applyInputMask(value: string, mask: string): string {
  const hasLetters = maskHasLetterSlots(mask);
  // USWDS strips non-word chars for charset masks and non-digits otherwise.
  const stripped = hasLetters ? value.replace(/\W/g, '') : value.replace(/\D/g, '');
  if (stripped.length === 0) {
    // Unlike USWDS (which can leave a literal prefix behind), an empty input
    // clears completely so the field can be emptied.
    return '';
  }
  let out = '';
  let charIndex = 0;
  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i];
    const digitSlot = DIGIT_SLOTS.includes(maskChar);
    const letterSlot = hasLetters && maskChar === LETTER_SLOT;
    if (digitSlot || letterSlot) {
      const char = stripped[charIndex];
      if (char === undefined) {
        break;
      }
      const accepted = digitSlot ? /\d/.test(char) : /[a-zA-Z]/.test(char);
      if (!accepted) {
        // Wrong character class for this slot: drop it and stop, as USWDS does.
        break;
      }
      out += char;
      charIndex += 1;
    } else {
      out += maskChar;
      if (stripped[charIndex] === undefined) {
        break;
      }
    }
  }
  return out;
}
