import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

interface JsonEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  parseError?: string;
  editorId: string;
}

/** A labeled CodeMirror JSON editor with inline parse-error reporting. */
export default function JsonEditor({
  label,
  value,
  onChange,
  parseError,
  editorId,
}: JsonEditorProps) {
  return (
    <div className="wb-editor">
      <div className="wb-editor__header">
        <span className="wb-editor__label" id={`${editorId}-label`}>
          {label}
        </span>
        {parseError ? <span className="wb-editor__status">Invalid JSON</span> : null}
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[json()]}
        basicSetup={{ foldGutter: true, lineNumbers: true, highlightActiveLine: false }}
        aria-labelledby={`${editorId}-label`}
        className="wb-editor__codemirror"
      />
      {parseError ? (
        <p className="wb-editor__error" role="status">
          {parseError} — the preview still shows the last valid value.
        </p>
      ) : null}
    </div>
  );
}
