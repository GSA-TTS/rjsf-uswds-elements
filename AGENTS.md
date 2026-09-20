# AGENTS.md

## Web Component Implementation Gate

Before implementing or modifying a `uswds-form-elements` Web Component or its RJSF adapter, do this gate first and reflect the result in the PR description:

- Classify the component as one of: self-contained display, field primitive, native form control, submit/reset control, or composite/slotted interactive component.
- Update `docs/component-contracts.md` before or with the implementation. The contract must define public API, rendering model, component-owned USWDS markup, slots, events, forwarded attributes, accessibility contract, keyboard contract, native semantic parity target, known limitations, required tests, and residual manual assistive-technology checks.
- The Web Component must own the USWDS pattern markup it represents. The React/RJSF adapter should pass state through attributes, properties, slots, and events; it must not keep authoring internal USWDS classes and wrap them in a custom-element host.
- Do not spread native control props blindly onto a custom-element host. If the accessible control is inside shadow DOM, explicitly forward the supported accessibility, global, and form attributes to that internal control, and document unsupported attributes.
- Never emit empty ARIA attributes. Only render ARIA when it has a meaningful value.
- If replacing or wrapping a native control, document and test semantic parity: role, accessible name, description, state, disabled behavior, focus order, keyboard activation, form behavior, submitted data, and unsupported native features.
- Spikes may justify an implementation direction, but production components still need direct production tests.

Required test split for accessibility-sensitive component work:

- Use unit/jsdom tests for reflection, DOM shape, class generation, attribute forwarding, and small behavior contracts.
- Use Playwright/browser tests for accessible role/name queries, keyboard behavior, focus behavior, shadow-DOM accessibility exposure, form submission/reset behavior, and slotted interactive content.
- Axe checks are required but not sufficient; add explicit user-facing assertions and list residual manual AT testing where shadow DOM, live regions, alerts, or form controls are involved.

## Playwright In Sandboxes

The workbench accessibility smoke tests and shadow-DOM form accessibility spike use Playwright Chromium via `npm run test:a11y`. Run this check locally by default before declaring accessibility-sensitive work complete.

If Playwright browsers are missing, install Chromium with:

```bash
npx playwright install chromium
```

If Chromium downloads but cannot launch because Linux shared libraries are missing, install the Playwright system dependencies. Agent sandboxes have passwordless sudo for this purpose:

```bash
sudo npx playwright install-deps chromium
```

A verified sandbox setup path is:

```bash
npx playwright install chromium
sudo npx playwright install-deps chromium
npm run test:a11y
```

In some agent sandboxes, browser downloads can still fail even when package installation works. Previously observed failures included `ECONNREFUSED` to both the default Playwright CDN and the Azure Edge mirror:

```bash
PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net npx playwright install chromium
```

If the default CDN is blocked, try the Azure Edge mirror first. `playwright.azureedge.net` is included in the balanced sandbox allow-list used by GSA-TTS agentic coding environments.

When local Playwright remains blocked after installing browser and system dependencies:

- still run `npm run build` before diagnosing workbench test failures, because the Vite dev server resolves workspace package exports from built `dist` entries;
- run the rest of the verification suite: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm audit --audit-level=high`;
- use GitHub Actions as the authoritative Playwright environment, since CI installs browsers with `npx playwright install --with-deps chromium`;
- record the exact browser-install, dependency-install, or browser-launch error in the verification transcript instead of claiming `npm run test:a11y` passed locally.
