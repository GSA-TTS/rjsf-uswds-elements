# Handoff

This document captures the current state of the local `rjsf-uswds-elements` repository so another agent can continue the work in a later session.

## Repository State

Current repository:

```text
https://github.com/GSA-TTS/rjsf-uswds-elements
```

Current branch for this assessment:

```text
assess-issue-969-uswds-webcomponents
```

Recent merged increments:

- PR #1: initial USWDS form element increments.
- PR #3: Vite library build for `uswds-form-elements`, including inline CSS/Sass build support.

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
- USWDS now publishes Web Components from the main `uswds/uswds` repository rather than the abandoned `uswds-elements` repository.
- The current upstream Web Component reference is `usa-banner`: Lit, shadow DOM, Vite library build, inline package/component CSS, `:host`, `part`, slots, and CSS custom properties.
- Current production form primitives remain light DOM under ADR-0002 until issue #4 validates cross-boundary form accessibility with browser-backed and manual assistive-technology evidence.
- USWDS CSS stays external for current light-DOM form primitives; future shadow-DOM components may bundle scoped USWDS Sass/CSS strings.
- Keep each Web Component small enough to review independently and shape for possible contribution to `uswds/uswds`.
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

## Playwright Accessibility Checks

`npm run test:a11y` is wired for the workbench and should be run locally by default before accessibility-sensitive work is declared complete.

If the local sandbox is missing Chromium, run:

```bash
npx playwright install chromium
```

If browser installation or launch is still blocked by the sandbox, record the exact error and use GitHub Actions as the authoritative Playwright environment. `.github/workflows/ci.yml` installs browsers with:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
```

Do not claim `npm run test:a11y` passed locally unless the command actually ran.

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

Reason: light DOM plus slotted label text is not a safe fit because slots project through shadow DOM. For label-like components, issue #4 should first validate whether shadow-DOM form semantics can preserve label, description, error, focus, and dynamic announcement behavior across browser accessibility trees and real assistive technology.

Do not reintroduce `uswds-label` or convert existing form primitives to shadow DOM until issue #4 records the required evidence.

## Recommended Next Steps

1. Run issue #4 before committing the production form primitives to shadow DOM.
2. Use ADR-0004 to retarget upstream-facing work from `uswds-elements` to the main `uswds/uswds` repository.
3. Let GitHub Actions run the Playwright a11y smoke in CI and run `npm run test:a11y` locally when the sandbox supports Playwright Chromium.
4. If CI Playwright fails because of browser install/networking, fix CI browser provisioning before adding more accessibility-sensitive features.
5. Add `custom-elements.json` generation before serious upstream contribution work for `uswds/uswds`.
6. Add component examples/docs for each Web Component as it is introduced.
7. Continue migration in low-risk order after the rendering-model gate is resolved:
   - required marker: done
   - error message: done
   - alert
   - button
   - fieldset
   - input group
   - checkbox/radio choice
   - label only after issue #4 resolves the shadow-DOM form semantics question

## Review Focus For Next Agent

Before adding another component, review:

- `docs/component-contracts.md`
- `packages/uswds-form-elements/src/components/uswds-required-marker.ts`
- `packages/rjsf-uswds/src/uswds/elements.tsx`
- `apps/workbench/tests/a11y.spec.ts`
- `.github/workflows/ci.yml`

Keep future commits small and coherent. Prefer one Web Component plus its adapter changes, tests, and docs per commit.
