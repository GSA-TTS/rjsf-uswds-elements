# Handoff

This document captures the current state of the local `rjsf-uswds-elements` repository so another agent can continue the work in a later session.

## Repository State

Local path:

```text
/Users/bretamogilefsky/Documents/Code/gsa/pic/rjsf-uswds-elements
```

Paseo project:

```text
prj_7a5d34563295d458  rjsf-uswds-elements
```

Current branch and bootstrap commit:

```text
main
fba3081 feat: bootstrap rjsf uswds elements repo
```

This handoff document is expected to be committed after the bootstrap commit.

There is no GitHub remote yet. The user will create the GitHub repository later; after that, set the remote and push.

## Origin and Scope

The repository was bootstrapped from the `apps/uswds-rjsf` proof of concept in `pic-demo-monorepo`.

Preserved from the proof of concept:

- `packages/rjsf-uswds`
- `apps/workbench`
- playground functionality
- component gallery functionality
- local development workflow
- `Dockerfile`
- `manifest.yml`
- cloud.gov-compatible static hosting path
- existing Vitest, Testing Library, and `jest-axe` coverage

Removed:

- generated snapshot provenance file `.source.json`

## Architecture Direction

The intended architecture is:

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

Package split:

```text
packages/uswds-form-elements
  Lit Web Components that emit USWDS-compatible form markup.

packages/rjsf-uswds
  React/RJSF adapter: Theme, Form, templates, widgets, and RJSF utilities.

apps/workbench
  Playground and component gallery for local development, review, accessibility checks, and hosted demos.
```

Important decisions already made:

- Lit is a dependency of `uswds-form-elements`, not a direct dependency of `rjsf-uswds`.
- React 19 is the baseline for direct custom-element interop.
- Web Components should render in light DOM by default so USWDS global CSS applies naturally and the emitted USWDS markup remains inspectable.
- USWDS CSS stays external; consuming apps load `@uswds/uswds` or their compiled USWDS theme.
- Keep each Web Component small enough to upstream to USWDS Elements independently.
- Preserve the workbench and cloud.gov deploy path because hosting and visible review affordances are part of the product.

## Implemented So Far

Added `packages/uswds-form-elements` with:

- `src/defineElement.ts`: idempotent custom-element registration helper, modeled after nearby CX Works patterns.
- `src/components/uswds-required-marker.ts`: first Lit-based Web Component.
- `src/define.ts` and `src/index.ts`: package entry points.
- `tests/requiredMarker.test.ts`: light-DOM markup contract test.

Integrated into `packages/rjsf-uswds`:

- `src/uswds/elements.tsx` imports `uswds-form-elements` and renders `<uswds-required-marker>` from the existing `RequiredMarker` helper.
- The React helper includes fallback `<abbr title="required" className="usa-hint usa-hint--required">*</abbr>` content inside the custom element. This preserves the existing immediate DOM contract for RJSF tests and global USWDS CSS.
- `src/custom-elements.d.ts` declares the custom element for React JSX typing.

Added CI and verification:

- `.github/workflows/ci.yml`
- `playwright.config.ts`
- `apps/workbench/tests/a11y.spec.ts`
- root `npm run check`
- root `npm audit --audit-level=high` gate

Added docs:

- `README.md`: rewritten for standalone repo purpose, architecture, dependency policy, workbench, accessibility, and deployment.
- `docs/component-contracts.md`: component contract and upstreaming expectations.

## Verification Transcript

The following checks passed locally after the bootstrap commit work:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

Observed results:

- `npm run format:check`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 8 test files and 53 tests.
- `npm run build`: passed.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.

`npm run build` emitted a large chunk warning for the workbench JavaScript bundle. This is expected for now because the workbench intentionally preserves CodeMirror and the full playground/gallery functionality.

## Blocked Local Check

`npm run test:a11y` is wired but did not complete locally because the Playwright browser binary was missing and the Chromium install was blocked by network failures to the Playwright CDN.

Commands and observed failures:

```bash
npm run test:a11y
```

Failed because Chromium was not installed.

```bash
npx playwright install chromium
```

Failed with repeated `ECONNREFUSED` errors to Playwright CDN addresses such as `150.171.109.154:443` and `150.171.109.148:443`.

CI should be able to run this check because `.github/workflows/ci.yml` includes:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
```

If CI cannot download browsers either, the next agent should decide whether to use a preinstalled browser image, cache Playwright browsers, or document an approved mirror.

## Dependency Notes

External package versions were pinned for repeatable review and CI behavior.

Audit findings encountered during setup:

- Vite, Vitest, Playwright, `fast-uri`, and `js-yaml` advisories appeared after the initial install.
- They were resolved by upgrading/pinning direct dev tooling and adding targeted `overrides` for patched transitive versions.
- `npm dedupe` was needed to collapse a stale vulnerable `fast-uri` copy from the AJV/RJSF dependency tree.

Current audit state:

```text
found 0 vulnerabilities
```

## Important False Start

An initial `uswds-label` component was created during exploration but intentionally removed before commit.

Reason: light DOM plus slotted label text is not a safe fit because slots project through shadow DOM. For label-like components, the next agent should choose one of these approaches deliberately:

- keep the native `<label>` in React/RJSF and migrate only nested reusable pieces first;
- create a light-DOM custom element that accepts label text via property/attribute and owns its internal DOM;
- use shadow DOM and document styling/accessibility consequences;
- use a React wrapper for specific components where direct custom-element ergonomics are insufficient.

Do not reintroduce `uswds-label` without testing label association, USWDS CSS application, React 19 rendering behavior, SSR/hydration caveats if relevant, and axe results.

## Recommended Next Steps

1. Push this repo after the user creates the GitHub repository.
2. Open a PR that references `GSA-TTS/pic-blm-cxworks#969`.
3. Let GitHub Actions run the Playwright a11y smoke in CI.
4. If CI Playwright passes, decide whether to make a second commit for the next component.
5. If CI Playwright fails because of browser install/networking, fix CI browser provisioning before adding more features.
6. Add `custom-elements.json` generation before serious upstreaming to USWDS Elements.
7. Add component examples/docs for each Web Component as it is introduced.
8. Continue migration in low-risk order:
   - required marker: done
   - error message
   - alert
   - button
   - fieldset
   - input group
   - checkbox/radio choice
   - label only after resolving the design issue above

## Review Focus For Next Agent

Before adding another component, review:

- `docs/component-contracts.md`
- `packages/uswds-form-elements/src/components/uswds-required-marker.ts`
- `packages/rjsf-uswds/src/uswds/elements.tsx`
- `apps/workbench/tests/a11y.spec.ts`
- `.github/workflows/ci.yml`

Keep future commits small and coherent. Prefer one Web Component plus its adapter changes, tests, and docs per commit.
