# Component Contracts

This repository uses Lit-based Web Components as the reusable USWDS form layer beneath the React/RJSF adapter.

Each component should be small enough to review independently and eventually propose to USWDS Elements as its own pull request.

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

Form components render in light DOM by default. This is intentional because:

- USWDS styles are global class-based CSS;
- RJSF and consuming apps need inspectable form markup;
- browser form semantics, labels, and accessibility relationships are easier to verify;
- upstream review is easier when the emitted USWDS markup is visible.

Use shadow DOM only when encapsulation is more important than native USWDS CSS inheritance, and document the required CSS custom properties, parts, slots, and accessibility implications.

## React/RJSF Boundary

`packages/rjsf-uswds` is the React/RJSF adapter. It may import `uswds-form-elements` to define custom elements, but it should not import Lit directly.

React 19 is the baseline for direct custom-element interop. If React 18 support becomes necessary, add an explicit compatibility layer or wrapper entry point with tests rather than widening the peer range without evidence.

## Current Components

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

Upstreaming note: this is intentionally tiny and low-risk. It is useful mainly as the first proof that the RJSF theme can consume Web Components while preserving existing accessibility tests and global USWDS styling.
