import { useCallback, useEffect, useRef, useState } from 'react';
import type CoreForm from '@rjsf/core';
import type { IChangeEvent } from '@rjsf/core';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { Form } from 'rjsf-uswds';
import { examples, getExample } from '../examples';
import { useJsonText } from '../hooks/useJsonText';
import { MAX_CONFIG_WIDTH, MIN_CONFIG_WIDTH, usePanelResize } from '../hooks/usePanelResize';
import ErrorBoundary from './ErrorBoundary';
import JsonEditor from './JsonEditor';

type PreviewState = 'normal' | 'errors' | 'disabled' | 'readonly';

const PREVIEW_STATES: Array<{ id: PreviewState; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'errors', label: 'Show validation errors' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'readonly', label: 'Read only' },
];

/**
 * The main playground: editable schema/uiSchema/formData panes on the left,
 * a live preview rendered through the actual `rjsf-uswds` package on the
 * right.
 */
export default function PlaygroundView() {
  const [exampleId, setExampleId] = useState(examples[0].id);
  const example = getExample(exampleId);

  const schema = useJsonText<RJSFSchema>(example.schema);
  const uiSchema = useJsonText<UiSchema>(example.uiSchema);
  const formData = useJsonText<unknown>(example.formData);
  const [previewState, setPreviewState] = useState<PreviewState>('normal');
  const [submitted, setSubmitted] = useState<unknown>(undefined);
  const formRef = useRef<CoreForm>(null);
  const { width: configWidth, dragging, dividerProps } = usePanelResize();

  const { setValue: setSchemaValue } = schema;
  const { setValue: setUiSchemaValue } = uiSchema;
  const { setValue: setFormDataValue } = formData;

  const loadExample = useCallback(
    (id: string) => {
      const next = getExample(id);
      setExampleId(next.id);
      setSchemaValue(next.schema);
      setUiSchemaValue(next.uiSchema);
      setFormDataValue(next.formData);
      setSubmitted(undefined);
      setPreviewState('normal');
    },
    [setSchemaValue, setUiSchemaValue, setFormDataValue],
  );

  // When "Show validation errors" is selected, run validation immediately so
  // the designer sees the error presentation without having to submit.
  useEffect(() => {
    if (previewState === 'errors') {
      formRef.current?.validateForm();
    }
  }, [previewState, schema.value, uiSchema.value, formData.value]);

  const handleFormChange = useCallback(
    (event: IChangeEvent) => {
      setFormDataValue(event.formData);
    },
    [setFormDataValue],
  );

  const handleSubmit = useCallback((event: IChangeEvent) => {
    setSubmitted(event.formData);
  }, []);

  return (
    <div
      className={dragging ? 'wb-playground wb-playground--dragging' : 'wb-playground'}
      style={{ ['--wb-config-width' as string]: `${configWidth}px` }}
    >
      <section className="wb-config" aria-label="Configuration">
        <div className="wb-config__row">
          <label className="usa-label wb-config__label" htmlFor="example-select">
            Example
          </label>
          <select
            className="usa-select"
            id="example-select"
            value={exampleId}
            onChange={(event) => loadExample(event.target.value)}
          >
            {examples.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <p className="wb-config__description">{example.description}</p>
          <button
            type="button"
            className="usa-button usa-button--outline wb-config__reset"
            onClick={() => loadExample(exampleId)}
          >
            Reset example
          </button>
        </div>

        <JsonEditor
          label="JSON Schema"
          editorId="schema-editor"
          value={schema.text}
          onChange={schema.setText}
          parseError={schema.parseError}
        />
        <JsonEditor
          label="uiSchema"
          editorId="uischema-editor"
          value={uiSchema.text}
          onChange={uiSchema.setText}
          parseError={uiSchema.parseError}
        />
        <JsonEditor
          label="Form data"
          editorId="formdata-editor"
          value={formData.text}
          onChange={formData.setText}
          parseError={formData.parseError}
        />
      </section>

      <div
        className="wb-divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        aria-valuemin={MIN_CONFIG_WIDTH}
        aria-valuemax={MAX_CONFIG_WIDTH}
        aria-valuenow={configWidth}
        aria-valuetext={`Configuration column ${configWidth} pixels wide`}
        tabIndex={0}
        title="Drag to resize; double-click or press Enter to reset"
        {...dividerProps}
      />

      <section className="wb-preview" aria-label="Form preview">
        <fieldset className="usa-fieldset wb-preview__states">
          <legend className="usa-legend">Preview state</legend>
          <div className="wb-preview__state-buttons">
            {PREVIEW_STATES.map((state) => (
              <label key={state.id} className="usa-radio wb-preview__state">
                <input
                  className="usa-radio__input"
                  type="radio"
                  name="preview-state"
                  value={state.id}
                  checked={previewState === state.id}
                  onChange={() => setPreviewState(state.id)}
                />
                <span className="usa-radio__label">{state.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="wb-preview__form">
          <ErrorBoundary resetKey={`${exampleId}:${schema.text}:${uiSchema.text}`}>
            <Form
              key={exampleId}
              ref={formRef}
              schema={schema.value}
              uiSchema={uiSchema.value}
              formData={formData.value}
              validator={validator}
              disabled={previewState === 'disabled'}
              readonly={previewState === 'readonly'}
              liveValidate={previewState === 'errors'}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
            />
          </ErrorBoundary>
        </div>

        <div className="wb-preview__data">
          <h2 className="wb-preview__data-heading">Form data</h2>
          <pre className="wb-preview__data-block" data-testid="live-form-data">
            {JSON.stringify(formData.value, null, 2)}
          </pre>
          {submitted !== undefined ? (
            <>
              <h2 className="wb-preview__data-heading">Last submitted</h2>
              <pre className="wb-preview__data-block">{JSON.stringify(submitted, null, 2)}</pre>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
