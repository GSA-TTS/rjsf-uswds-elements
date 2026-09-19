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

Attributes and properties: `type` (`button`, `submit`, or `reset`, default `button`), `variant` (`primary`, `outline`, or `unstyled`, default `primary`), `disabled`, and `button-label` for forwarding an accessible label to the internal native button without putting prohibited ARIA attributes on the custom-element host.

Slots: default slot for button label/content.

Events: native click events from the internal button are composed through the shadow boundary. `type="submit"` uses `requestSubmit()` on the closest containing form so the custom element can own the native button while still participating in RJSF form submission.

Accessibility contract: focus, keyboard activation, disabled state, and submit/non-submit behavior match native button expectations in the Playwright button form behavior spike.

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
