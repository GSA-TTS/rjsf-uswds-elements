---
title: 'Add Vite library build before shadow DOM styles'
status: 'proposed'
date: '2026-09-16'
decision_makers: ['PIC engineering stakeholders']
category: 'Deployment and Infrastructure'
nist_controls: ['CM-2', 'CM-3', 'SA-10', 'SA-11', 'SR-3']
impact_level: 'moderate'
ato_relevance: 'no'
risk_treatment: 'mitigate'
---

# Add Vite library build before shadow DOM styles

## Context and Problem Statement

The `uswds-form-elements` package currently builds with TypeScript only. That is enough for light-DOM components, but it cannot transform inline CSS/Sass imports like `*.css?inline` or `*.scss?inline`, which USWDS uses in its Lit `usa-banner` Web Component to provide component-scoped styles inside shadow DOM.

## Decision Drivers

- Future shadow-DOM components need a build path that can bundle component-scoped styles.
- USWDS `usa-banner` demonstrates a Vite library build that imports package Sass and component CSS as inline strings.
- `@uswds/compile` compiles project Sass and copies built Web Components; it does not generate arbitrary component-scoped CSS strings for consumers.
- New build dependencies and package output changes must be explicit, pinned, and verified.
- Production form component behavior should not change as part of build-enablement work.

## Considered Options

1. **Keep `uswds-form-elements` as a `tsc`-only package** — Continue supporting light-DOM components only and defer all shadow-DOM style work.
2. **Add a Vite/Rollup library build for `uswds-form-elements`** — Preserve existing exports while enabling inline CSS/Sass transforms for future components.
3. **Use `@uswds/compile` for component CSS generation** — Attempt to rely on USWDS Compile for package-scoped component CSS artifacts.
4. **Handwrite CSS strings in TypeScript** — Avoid build changes by embedding CSS directly in component source.

## Decision Outcome

Chosen option: **Add a Vite/Rollup library build for `uswds-form-elements` before adopting shadow-DOM styles**, because it aligns with the published USWDS `usa-banner` build pattern and keeps style transformation in a standard package build step rather than in handwritten CSS strings or unsupported compile behavior.

### Positive Consequences

- The package can support future `*.css?inline` and `*.scss?inline` imports.
- Build behavior can be tested before production components depend on it.
- The package can follow the same general pattern as USWDS Web Components.
- Existing light-DOM components can remain behaviorally unchanged while build support is added.

### Negative Consequences

- The package build becomes more complex than `tsc` alone.
- A pinned Sass implementation dependency is required.
- CSS asset handling, especially font and image URLs emitted by USWDS Sass, needs explicit policy.
- Bundle size can grow unexpectedly if package Sass entries pull broad USWDS dependencies.

### Compliance Consequences

- New build dependencies require supply-chain review and exact version pinning.
- CI must verify package output and downstream consumption by the RJSF adapter and workbench.
- Generated artifacts should remain out of source control unless deliberately required.
- This decision supports change control by separating build enablement from behavior changes.

## Links

- Parent work: https://github.com/GSA-TTS/pic-blm-cxworks/issues/969
- Build implementation issue: https://github.com/GSA-TTS/pic-blm-cxworks/issues/1147
- CSS build-path spike: https://github.com/GSA-TTS/pic-blm-cxworks/issues/1146
- USWDS `usa-banner` source: https://github.com/uswds/uswds/blob/develop/packages/usa-banner/src/usa-banner.component.js
- `@uswds/compile`: https://github.com/uswds/uswds-compile
