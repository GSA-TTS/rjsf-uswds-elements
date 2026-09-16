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

## Shadow DOM Styling Spike

Issue `GSA-TTS/pic-blm-cxworks#1144` tested whether future `uswds-form-elements` should target shadow DOM with shared/adopted USWDS styles instead of the current light-DOM/default-global-CSS model.

Approaches compared:

- Current baseline: light-DOM components emit USWDS class names and rely on the consuming application to load global USWDS CSS. This keeps RJSF markup inspectable and preserves straightforward `aria-describedby` relationships because the referenced hint/error nodes are normal document nodes with visible text.
- Shadow DOM prototype: `uswds-hint-shadow-spike` renders a `.usa-hint` element inside its shadow root and adopts one shared `CSSStyleSheet` instance via `shadowRoot.adoptedStyleSheets`. `src/styles/hint-shadow-spike.ts` also exports a Lit `static styles`-compatible `hintShadowStyles` value to represent the USWDS `unsafeCSS(importedCssString)` pattern used by USWDS components such as `usa-banner`.

Findings:

- Constructable stylesheets work for this isolated primitive in supporting browsers and can be reused across component instances without duplicating the stylesheet object.
- A shadow-root internal `.usa-hint` does not receive global USWDS styles, so every shadow component needs explicit styles from an imported CSS string, a constructed stylesheet, or Lit `static styles`.
- Native CSS module imports (`import sheet from './x.css' with { type: 'css' }`) are not a safe package target yet because browser and toolchain support is uneven.
- `@import` inside `CSSStyleSheet.replaceSync()` should not be the default because constructable stylesheet import handling has browser caveats; import or inline the actual CSS text at build time instead.
- jsdom exposes `CSSStyleSheet` without `replaceSync`, so tests need either a browser runner or a guarded fallback path. The spike falls back to Lit `static styles` when constructable stylesheets are unavailable.
- `aria-describedby` should continue to point at a light-DOM host element for hint/error-like custom elements. Tests can verify the id relationship, but assistive-technology support for deriving a description from text projected through a custom element's shadow tree needs browser/screen-reader validation before RJSF relies on it.

Recommendation: keep light DOM as the default for form-associated text, labels, errors, and controls. Treat shadow DOM with adopted/shared styles as a hybrid option for self-contained display primitives where encapsulation is useful and the accessibility contract does not depend on external label or description traversal.

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

### `uswds-hint-shadow-spike`

Purpose: spike-only component for evaluating shadow DOM plus shared/adopted USWDS-like styles.

Markup contract:

```html
<uswds-hint-shadow-spike id="field-hint">Helpful text.</uswds-hint-shadow-spike>
```

Rendered shadow DOM:

```html
<span class="usa-hint"><slot></slot></span>
```

Attributes: `required` toggles `usa-hint--required` on the internal span.

Properties: `required: boolean`.

Slots: default slot for hint text.

Events: none.

Accessibility contract: the host can carry the `id` used by `aria-describedby`, but RJSF should not use this component for production hints until real browser and assistive-technology testing confirms that slotted text inside a shadow-root hint is consistently exposed as the referenced description.

USWDS pattern reference: form hints.

Upstreaming note: do not upstream this component as-is. It intentionally contains a minimal CSS subset and exists to compare rendering/styling models for `GSA-TTS/pic-blm-cxworks#1144`.
