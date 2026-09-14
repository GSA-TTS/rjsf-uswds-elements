import { useCallback, useState } from 'react';

export interface JsonTextState<T> {
  text: string;
  /** The last successfully parsed value; preserved while the text is invalid. */
  value: T;
  parseError?: string;
  setText: (text: string) => void;
  /** Replaces both the text and the parsed value (e.g. reset, or form edits). */
  setValue: (value: T) => void;
}

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? '';
}

/**
 * Manages a JSON editor pane: tracks raw text, the last valid parsed value,
 * and the current parse error, so malformed JSON never breaks the preview.
 */
export function useJsonText<T>(initialValue: T): JsonTextState<T> {
  const [text, setTextState] = useState(() => pretty(initialValue));
  const [value, setValueState] = useState<T>(initialValue);
  const [parseError, setParseError] = useState<string | undefined>(undefined);

  const setText = useCallback((newText: string) => {
    setTextState(newText);
    try {
      const parsed = JSON.parse(newText) as T;
      setValueState(parsed);
      setParseError(undefined);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, []);

  const setValue = useCallback((newValue: T) => {
    setValueState(newValue);
    setTextState(pretty(newValue));
    setParseError(undefined);
  }, []);

  return { text, value, parseError, setText, setValue };
}
