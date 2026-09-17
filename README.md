# rjsf-uswds-elements

A U.S. Web Design System (USWDS) theme for [React JSON Schema Form (RJSF)](https://rjsf-team.github.io/react-jsonschema-form/docs/), backed by small Lit-based Web Components.

This repository grew from the PIC `apps/uswds-rjsf` proof of concept. It preserves the playground and component gallery because they make the theme easier to understand, review, and safely change.

## Goals

- Map RJSF forms to documented USWDS markup and accessibility patterns.
- Keep runtime dependencies minimal.
- Hide Lit behind the Web Components package where practical.
- Use native web platform controls and light DOM so USWDS CSS applies naturally.
- Keep each Web Component small enough to propose upstream to USWDS Elements independently.
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

## Development

```bash
npm install
npm run dev
npm run check
```

Useful scripts:

- `npm run dev` starts the workbench.
- `npm test` runs unit, integration, and axe tests in Vitest/jsdom.
- `npm run test:a11y` runs Playwright axe smoke tests against the workbench.
- `npm run build` builds the Web Components package, RJSF package, and workbench.
- `npm run check` runs formatting, linting, typechecking, tests, build, and workbench accessibility checks.

## Accessibility and Regression Signals

Accessibility is a release gate for this repository. CI runs:

- formatting and linting;
- TypeScript checks for each package;
- unit and integration tests;
- existing `jest-axe` tests for rendered RJSF forms;
- Playwright + axe smoke tests for the playground and component gallery;
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

Form elements render in light DOM unless there is a specific reason not to. This matches the current need for global USWDS CSS, straightforward form semantics, and inspectable markup.

`packages/uswds-form-elements` uses a Vite library build so future Lit components can import package-scoped `*.css?inline` or `*.scss?inline` strings when shadow DOM styling is appropriate. The package still emits TypeScript declarations with `tsc --emitDeclarationOnly`, and current production form primitives remain light DOM until follow-up accessibility validation proves a shadow DOM variant preserves labels, descriptions, errors, form behavior, and keyboard behavior.

The Vite Sass configuration resolves USWDS package Sass from `node_modules/@uswds/uswds/packages` and the package root so imports such as `@use "usa-error-message";` match USWDS package boundaries. Inline USWDS Sass may include `@font-face` URLs; Vite leaves unresolved relative font URLs in the emitted CSS string for the consuming application to serve or rewrite.

Each Web Component should document:

- tag name;
- attributes and properties;
- slots;
- events and event `detail` shape;
- accessibility contract;
- USWDS pattern reference;
- known limitations;
- upstreaming notes for USWDS Elements.

The first migrated component is `uswds-required-marker`, used by the RJSF theme for required field indicators.

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
