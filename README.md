# rjsf-uswds-elements

A U.S. Web Design System (USWDS) theme for [React JSON Schema Form (RJSF)](https://rjsf-team.github.io/react-jsonschema-form/docs/), backed by small Lit-based Web Components.

This repository grew from the PIC `apps/uswds-rjsf` proof of concept. It preserves the playground and component gallery because they make the theme easier to understand, review, and safely change.

## Goals

- Map RJSF forms to documented USWDS markup and accessibility patterns.
- Keep runtime dependencies minimal.
- Hide Lit behind the Web Components package where practical.
- Use native web platform controls and preserve form accessibility relationships.
- Keep each Web Component small enough to review independently and shape for possible contribution to `uswds/uswds`.
- Make accessibility regressions visible in CI.

## Repository layout

```text
packages/uswds-form-elements
  Lit Web Components that emit USWDS-compatible form markup.

packages/rjsf-uswds
  React/RJSF adapter: Theme, Form, templates, widgets, and RJSF utilities.

apps/workbench
  Playground and component gallery for local development, accessibility checks,
  review, and hosted demos.
```

Target architecture:

```text
JSON Schema / uiSchema
        ↓
      RJSF
        ↓
rjsf-uswds React adapter
        ↓
Lit-based USWDS form Web Components
        ↓
USWDS classes + consumer-provided USWDS CSS
```

## Theme Sub-Part Status

This matrix tracks which parts of the RJSF theme have moved behind `uswds-form-elements` Web Components. It is intentionally compact: detailed contracts live in `docs/component-contracts.md`.

Legend:

- Status: ✅ componentized, 🟨 partially componentized, ⬜ React/RJSF-owned.
- DOM: ☀️ light DOM, 🌑 shadow DOM, 🌓 mixed light/shadow.
- A11y gate: ✅ automated browser coverage in place, 🧪 gated by spike/manual evidence, 🧐 residual manual AT checks noted.

| Theme area                                                                              | Status | Element                                                                      | DOM | A11y | Notes                                                                                     |
| --------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- | --- | ---- | ----------------------------------------------------------------------------------------- |
| [Error summary](packages/rjsf-uswds/src/templates/ErrorListTemplate.tsx)                | ✅     | [`uswds-alert`](docs/component-contracts.md#uswds-alert)                     | 🌓  | 🧐   | Shadow-owned alert shell; slotted links remain focusable; manual AT checks remain.        |
| [Field error](packages/rjsf-uswds/src/templates/FieldErrorTemplate.tsx)                 | ✅     | [`uswds-error-message`](docs/component-contracts.md#uswds-error-message)     | ☀️  | ✅   | Light-DOM shell; RJSF keeps the described-by container ID.                                |
| [Required marker](packages/rjsf-uswds/src/uswds/elements.tsx)                           | ✅     | [`uswds-required-marker`](docs/component-contracts.md#uswds-required-marker) | ☀️  | ✅   | Light-DOM field primitive; preserves required-marker semantics.                           |
| [Submit/action buttons](packages/rjsf-uswds/src/templates/ButtonTemplates.tsx)          | ✅     | [`uswds-button`](docs/component-contracts.md#uswds-button)                   | 🌑  | 🧐   | RJSF submit/reset/action use cases covered; full native submitter parity not implemented. |
| [Additional properties](packages/rjsf-uswds/src/templates/WrapIfAdditionalTemplate.tsx) | 🟨     | [`uswds-button` remove](docs/component-contracts.md#uswds-button)            | 🌓  | ✅   | Key input and layout remain React-owned; remove action uses `uswds-button`.               |
| [Array sections/items](packages/rjsf-uswds/src/templates/ArrayFieldTemplate.tsx)        | 🟨     | [`uswds-button` actions](docs/component-contracts.md#uswds-button)           | 🌓  | ✅   | Repeatable layout remains React-owned; add/remove/move/copy actions use `uswds-button`.   |
| [Object sections](packages/rjsf-uswds/src/templates/ObjectFieldTemplate.tsx)            | 🟨     | [`uswds-button` actions](docs/component-contracts.md#uswds-button)           | 🌓  | ✅   | Section layout remains React-owned; add-property action uses `uswds-button`.              |
| [Label](packages/rjsf-uswds/src/uswds/elements.tsx)                                     | ⬜     | None                                                                         | ☀️  | 🧪   | Still React-owned; likely next field primitive after form semantics are validated.        |
| [Description / hint](packages/rjsf-uswds/src/templates/DescriptionFieldTemplate.tsx)    | ⬜     | None                                                                         | ☀️  | 🧪   | Still React-owned `aria-describedby` target; keep same-tree with controls.                |
| [Field help](packages/rjsf-uswds/src/templates/FieldHelpTemplate.tsx)                   | ⬜     | None                                                                         | ☀️  | 🧪   | Still React-owned `aria-describedby` target; same constraints as hints.                   |
| [Field layout](packages/rjsf-uswds/src/templates/FieldTemplate.tsx)                     | ⬜     | None                                                                         | ☀️  | 🧪   | Still React-owned; coordinates label, hint, error, and control placement.                 |
| [Choice helper](packages/rjsf-uswds/src/uswds/elements.tsx)                             | ⬜     | None                                                                         | ☀️  | 🧪   | Still React-owned checkbox/radio helper; blocked on label/control semantics evidence.     |
| [Checkbox](packages/rjsf-uswds/src/widgets/CheckboxWidget.tsx)                          | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM control; label and description stay same-tree.                     |
| [Checkbox group](packages/rjsf-uswds/src/widgets/CheckboxesWidget.tsx)                  | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM controls; group semantics come from fieldset/legend.               |
| [Radio group](packages/rjsf-uswds/src/widgets/RadioWidget.tsx)                          | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM controls; group semantics come from fieldset/legend.               |
| [Text-like inputs](packages/rjsf-uswds/src/templates/BaseInputTemplate.tsx)             | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM controls; shadow DOM blocked pending field-semantics evidence.     |
| [Textarea](packages/rjsf-uswds/src/widgets/TextareaWidget.tsx)                          | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM control; shadow DOM blocked pending field-semantics evidence.      |
| [Select](packages/rjsf-uswds/src/widgets/SelectWidget.tsx)                              | ⬜     | None                                                                         | ☀️  | 🧪   | Still native light-DOM control; multi-select defaults to checkbox group.                  |
| [Prefix/suffix input group](packages/rjsf-uswds/src/uswds/elements.tsx)                 | ⬜     | None                                                                         | ☀️  | ✅   | Still React-owned presentational wrapper; prefix/suffix remain `aria-hidden`.             |
| [Standalone title](packages/rjsf-uswds/src/templates/TitleFieldTemplate.tsx)            | ⬜     | None                                                                         | ☀️  | ✅   | Still React-owned auxiliary `usa-legend` surface.                                         |
| [Form wrapper](packages/rjsf-uswds/src/Form.tsx)                                        | ⬜     | None                                                                         | ☀️  | ✅   | Still React-owned form class wrapper; not a Web Component target by itself.               |

## Development

```bash
npm install
npm run dev
npm run check
```

Useful scripts:

- `npm run dev` starts the workbench.
- `npm test` runs unit, integration, and axe tests in Vitest/jsdom.
- `npm run test:a11y` runs Playwright axe smoke tests and the retained shadow-DOM form accessibility regression fixtures against the workbench in Chromium.
- `npm run build` builds the Web Components package, RJSF package, and workbench.
- `npm run check` runs formatting, linting, typechecking, tests, build, and workbench accessibility checks.

## Accessibility and Regression Signals

Accessibility is a release gate for this repository. CI runs:

- formatting and linting;
- TypeScript checks for each package;
- unit and integration tests;
- existing `jest-axe` tests for rendered RJSF forms;
- Playwright + axe smoke tests for the playground, component gallery, and retained shadow-DOM accessibility regression fixtures;
- browser-backed assertions that Chromium does not accept the cross-shadow element-reference topology for form descriptions;
- package and workbench builds.

The intent is to give contributors a concrete signal when a change breaks behavior or accessibility that was already working.

## Dependency Policy

The package surface is intentionally small:

- `packages/uswds-form-elements` depends on `lit`.
- `packages/rjsf-uswds` depends on `uswds-form-elements`, but does not import Lit directly.
- `@rjsf/core`, `@rjsf/utils`, and React are peer dependencies of `rjsf-uswds`.
- USWDS CSS is supplied by the consuming application, either from `@uswds/uswds` or a compiled USWDS theme.

External package versions are pinned in this repository to keep review and CI behavior predictable.

## Web Component Conventions

USWDS now publishes Web Components from the main `uswds/uswds` repository rather than the separate `uswds-elements` repository. The current upstream reference is `usa-banner`, which uses Lit, shadow DOM, a Vite library build, `*.scss?inline` and `*.css?inline` style imports, `:host`, `part`, slots, and CSS custom properties.

`packages/uswds-form-elements` uses a Vite library build so future Lit components can follow that `usa-banner` pattern when shadow DOM styling is appropriate. The package still emits TypeScript declarations with `tsc --emitDeclarationOnly`.

Current production form primitives remain light DOM under ADR-0002 because issue #4 / PR #5 rejected split cross-shadow form-field semantics for RJSF-composed labels, descriptions, errors, controls, focus behavior, and dynamic error updates.

The Vite Sass configuration resolves USWDS package Sass from `node_modules/@uswds/uswds/packages` and the package root so imports such as `@use "usa-error-message";` match USWDS package boundaries. Inline USWDS Sass may include `@font-face` URLs; Vite leaves unresolved relative font URLs in the emitted CSS string for the consuming application to serve or rewrite.

Each Web Component should document:

- tag name;
- attributes and properties;
- slots;
- events and event `detail` shape;
- accessibility contract;
- USWDS pattern reference;
- known limitations;
- upstreaming notes for possible `uswds/uswds` contribution.

## Workbench

The workbench has two views:

- Playground: edit JSON Schema, uiSchema, and form data while previewing the rendered RJSF form.
- Component gallery: view each control in common states such as normal, hint, required, error, disabled, readonly, widths, prefix/suffix, and tiles.

The workbench intentionally consumes `rjsf-uswds` by package name, as an application would.

## Styling and USWDS Theming

Consumers must load USWDS CSS and the theme glue stylesheet:

```ts
import '@uswds/uswds/css/uswds.min.css';
import 'rjsf-uswds/styles.css';
```

The theme's custom CSS is limited to RJSF-specific glue such as repeatable-item framing and toolbar layout.

## Deployment

The existing cloud.gov-compatible deployment path is preserved:

```bash
docker buildx build --platform linux/amd64 -t <image>:<tag> --push .
cf push -f manifest.yml
```

The container serves the built static workbench and honors Cloud Foundry's `$PORT`.

## License

Apache-2.0.
