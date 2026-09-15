import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { afterEach, describe, expect, it } from 'vitest';
import { jsonEditorAccessibilityExtensions } from '../src/components/JsonEditor';

const views: EditorView[] = [];

afterEach(() => {
  for (const view of views) {
    view.destroy();
  }
  views.length = 0;
  document.body.replaceChildren();
});

describe('JsonEditor accessibility extensions', () => {
  it('labels the CodeMirror textbox and makes its scroll region keyboard focusable', () => {
    const label = document.createElement('span');
    label.id = 'schema-editor-label';
    label.textContent = 'JSON Schema';
    document.body.append(label);

    const host = document.createElement('div');
    document.body.append(host);

    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: '{"type":"object"}',
        extensions: jsonEditorAccessibilityExtensions(label.id),
      }),
    });
    views.push(view);

    expect(view.contentDOM).toHaveAttribute('aria-labelledby', label.id);
    expect(view.dom).toHaveAttribute('aria-labelledby', label.id);
    expect(view.contentDOM).toHaveAccessibleName('JSON Schema');
    expect(view.scrollDOM).toHaveAttribute('tabindex', '0');
  });
});
