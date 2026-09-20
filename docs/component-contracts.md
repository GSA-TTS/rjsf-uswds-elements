# Component Contracts

This repository uses Lit-based Web Components as the reusable USWDS form layer beneath the React/RJSF adapter.

Each component should be small enough to review independently and shape for possible contribution to the main `uswds/uswds` repository.

## Shared Expectations

Every component must document and test:

- tag name;
- attributes and properties;
- slots;
- custom events and event `detail` payloads;
- USWDS classes or pattern references it emits;
- accessible name, description, error, required, disabled, readonly, and keyboard behavior as applicable;
- known limitations and non-goals.

Components should prefer native HTML controls and platform behavior. Custom keyboard behavior should only be added when a native control cannot satisfy the USWDS pattern.

## New Component Gate

Before implementation, classify the component:

- **Self-contained display**: owns its content semantics and does not participate in form submission, label, hint, or error relationships.
- **Field primitive**: label, hint, error, required marker, or any component that participates in `for`, `aria-labelledby`, `aria-describedby`, invalid state, or dynamic field errors.
- **Native form control**: replaces or wraps an input, select, textarea, checkbox, radio, or other value-owning control.
- **Submit/reset control**: triggers form submission or reset behavior.
- **Composite/slotted interactive component**: contains or slots links, buttons, controls, menu items, or other focusable children.

Answer this before code review: what is the accessible, user-facing element, and where do its role, name, description, state, keyboard behavior, and form behavior actually live?

## Contract Template

Use this template when adding or materially changing a component:

````md
### `uswds-example`

Purpose: what USWDS pattern this component represents and what consumers should use it for.

Classification: self-contained display | field primitive | native form control | submit/reset control | composite/slotted interactive component.

Rendering model: shadow DOM | light DOM | hybrid, with rationale.

Markup contract:

\```html
<uswds-example attribute="value">Visible content</uswds-example>
\```

Component-owned USWDS markup: list the USWDS classes/elements the component emits itself.

Shadow/light DOM contract: show the internal rendered structure or the light-DOM ownership model.

Attributes and properties: list supported public API values, defaults, reflection behavior, and invalid-value fallback.

Slots: list every slot, expected content, and whether slotted interactive content is supported.

Events: list emitted events, `detail` payloads, bubbling/composed behavior, and cancelability.

Forwarded attributes: list supported accessibility, global, and form attributes that are forwarded to an internal accessible control. List unsupported native attributes explicitly.

Accessibility contract: role, accessible name source, accessible description source, state attributes, disabled/readonly behavior, focus behavior, and live-region behavior when applicable.

Keyboard contract: Tab order, activation keys, arrow-key behavior if applicable, Escape behavior if applicable, and disabled-control behavior.

Native semantic parity target: native element or USWDS pattern being matched. If parity is partial, list the missing native features.

Known limitations and non-goals: include any behavior consumers might reasonably expect but should not rely on.

Required tests: unit/jsdom tests, Playwright/browser tests, axe checks, and any required regression cases.

Residual manual AT checks: screen reader/browser combinations and user flows that automation cannot prove.
\```

## Testing Requirements

Use unit/jsdom tests for reflection, DOM shape, class generation, attribute forwarding, invalid-value fallback, and small behavior contracts.

Use Playwright/browser tests for user-facing accessibility and platform behavior:

- accessible role/name/description queries;
- sequential focus order and focus visibility;
- keyboard activation, including `Enter` and `Space` where native controls support both;
- disabled controls being skipped or blocked as native semantics require;
- shadow-DOM accessibility exposure;
- form submission, reset, validation, and submitted data behavior;
- slotted interactive content discoverability and keyboard operation;
- error-summary links moving focus to invalid fields.

Axe checks are required but not sufficient. A passing axe result does not prove keyboard behavior, focus movement, accessible names, live-region announcements, submitted data, or screen-reader announcement quality.

Spikes may justify an implementation direction, but every production component still needs direct production tests for the behavior it relies on.

## ARIA And Attribute Forwarding

Never emit empty ARIA attributes. Only render `aria-*` when the value is meaningful.

Do not spread native control props blindly onto a custom-element host. If the accessible control is inside shadow DOM, explicitly forward supported accessibility, global, and form attributes to that internal control, and document unsupported attributes.

## Rendering Model

USWDS now publishes Web Components from the main `uswds/uswds` repository rather than the separate `uswds-elements` repository. The current upstream reference is `usa-banner`, which uses Lit, shadow DOM, a Vite library build, `*.scss?inline` and `*.css?inline` style imports, `:host`, `part`, slots, and CSS custom properties.

For self-contained components where the component owns its semantics, prefer the `usa-banner` shadow-DOM house style unless a specific accessibility, styling, or consumer-integration constraint prevents it.

Current production form primitives remain light DOM under ADR-0002 because:

- RJSF composes labels, hints, errors, and controls from separate templates and widgets;
- classic `aria-describedby`, `aria-labelledby`, and label `for` references do not reliably cross shadow-root boundaries;
- browser form semantics, labels, and accessibility relationships are easier to verify in the same DOM tree;
- issue #4 must validate browser and assistive-technology behavior before production form primitives move to shadow DOM.

The package build supports `*.css?inline` and `*.scss?inline` imports for future shadow-DOM work. The package Vite config resolves USWDS Sass through `node_modules/@uswds/uswds/packages` and the USWDS package root. Inline USWDS Sass can emit `@font-face` rules with relative font URLs; consumers are responsible for serving or rewriting those assets if a future component inlines styles that reference them.

## React/RJSF Boundary

`packages/rjsf-uswds` is the React/RJSF adapter. It may import `uswds-form-elements` to define custom elements, but it should not import Lit directly.

The adapter should translate RJSF state into custom-element attributes, properties, slots, and events. It should not continue to author a component's internal USWDS pattern markup and then wrap that markup in a custom-element host. A wrapper-only element that leaves consumers responsible for internal classes such as `usa-alert__body`, `usa-alert__heading`, or `usa-button` is not a successful migration.

React 19 is the baseline for direct custom-element interop. If React 18 support becomes necessary, add an explicit compatibility layer or wrapper entry point with tests rather than widening the peer range without evidence.

## Current Components

### `uswds-alert`

Purpose: render the USWDS alert pattern behind a custom-element API.

Markup contract:

```html
<uswds-alert type="error" heading="This form has 2 errors">
  <ul>
    <li><a href="#field-id">Field: Enter a value.</a></li>
  </ul>
</uswds-alert>
```
````

Shadow DOM contract:

```html
<div class="usa-alert usa-alert--error" part="alert">
  <div class="usa-alert__body" part="body">
    <h2 class="usa-alert__heading" part="heading">This form has 2 errors</h2>
    <slot></slot>
  </div>
</div>
```

Attributes and properties: `type` (`info`, `warning`, `error`, or `success`, default `info`), `heading`, `slim`, and `no-icon`.

Slots: default slot for alert body content.

Events: none.

Accessibility contract: `type="error"` applies `role="alert"` to the host by default. Non-error alerts do not apply an implicit role. Any explicit consumer-provided `role` is preserved. Interactive slotted content, such as error-summary links, remains in light DOM and remains focusable.

USWDS pattern reference: alert.

Implementation note: this component uses shadow DOM because the alert shell is self-contained. The RJSF adapter owns error data, link targets, and click/focus behavior; the Web Component owns the USWDS alert body and heading structure.

### `uswds-button`

Purpose: render the USWDS button pattern behind a custom-element API while preserving form behavior.

Markup contract:

```html
<uswds-button type="submit" variant="primary">Submit</uswds-button>
<uswds-button type="button" variant="outline">Add item</uswds-button>
```

Shadow DOM contract:

```html
<button class="usa-button" part="button" type="button">
  <slot></slot>
</button>
```

Attributes and properties: `type` (`button`, `submit`, or `reset`, default `button`), `variant` (`primary`, `outline`, or `unstyled`, default `primary`), `disabled`, `button-label`, `aria-controls`, `aria-describedby`, `aria-expanded`, `aria-haspopup`, `aria-pressed`, `name`, `title`, and `value`. `button-label` forwards an accessible label to the internal native button without putting prohibited ARIA attributes on the custom-element host.

Slots: default slot for button label/content.

Events: native click events from the internal button are composed through the shadow boundary. `type="submit"` uses `requestSubmit()` on the closest containing form so the custom element can own the native button while still participating in RJSF form submission.

Accessibility contract: focus, keyboard activation, disabled state, and submit/non-submit/reset behavior match native button expectations covered by Playwright tests for the RJSF use case.

Known limitation: this is not a full native submit-button replacement. Because the internal native button lives in shadow DOM and the host is not a form-associated custom element, bridged submissions do not expose a native submitter through `SubmitEvent.submitter`, do not include host `name`/`value` in `FormData`, do not support out-of-tree `form="id"` association, and do not implement alternate submit attributes such as `formaction` or `formmethod`. Those capabilities require a separate design decision before this element is used outside the current RJSF submit/control use cases.

USWDS pattern reference: button.

### `uswds-required-marker`

Purpose: render the USWDS required field marker.

Markup contract:

```html
<abbr title="required" class="usa-hint usa-hint--required">*</abbr>
```

Attributes: none.

Properties: none.

Slots: none.

Events: none.

Accessibility contract: the marker uses `abbr[title="required"]`, matching the USWDS required-field pattern already used by the RJSF theme.

USWDS pattern reference: form labels and required field indicators.

Upstreaming note: this is intentionally tiny and low-risk. It is useful mainly as the first proof that the RJSF theme can consume Web Components while preserving existing accessibility tests and global USWDS styling. Any future shadow-DOM version should wait for issue #4.

### `uswds-error-message`

Purpose: render a field-level USWDS error message.

Markup contract:

```html
<span id="field-id__error" class="usa-error-message">Enter a value.</span>
```

Attributes: none on the Web Component. Consumers may put field association attributes, such as `id`, on an ancestor or on the inner `.usa-error-message` fallback element. The RJSF adapter keeps `aria-describedby` pointed at RJSF's existing field-error container and renders this component inside it.

Properties: none.

Slots: none. If plain text children are provided, the component wraps them in a `span.usa-error-message` in light DOM. If a `.usa-error-message` child already exists, the component preserves it.

Events: none.

Accessibility contract: field controls continue to reference the field-error container via `aria-describedby`, and invalid controls continue to set `aria-invalid="true"` through the RJSF adapter.

USWDS pattern reference: form error messages.

Upstreaming note: this remains a narrow presentational wrapper so the RJSF adapter can adopt Web Components incrementally without changing validation behavior or field-error associations. Any future shadow-DOM version should wait for issue #4 because error descriptions are central to the cross-boundary accessibility question.
