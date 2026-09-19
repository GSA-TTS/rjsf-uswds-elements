---
title: 'Target USWDS Web Component conventions pending form accessibility validation'
status: 'proposed'
date: '2026-09-17'
decision_makers: ['PIC engineering stakeholders']
category: 'Accessibility and Architecture'
nist_controls: ['CM-2', 'CM-3', 'SA-11', 'SI-10']
impact_level: 'moderate'
ato_relevance: 'no'
risk_treatment: 'mitigate'
---

# Target USWDS Web Component conventions pending form accessibility validation

## Context and Problem Statement

The original architecture direction for this repository assumed that reusable Lit Web Components could eventually be proposed upstream to the separate `uswds-elements` repository. USWDS maintainers have since clarified that maintaining separate Core and Elements codebases is not feasible for the team, and future Web Component variants will be added to the main `uswds/uswds` repository as capacity allows.

The current upstream reference is the `usa-banner` Web Component in `uswds/uswds`. It uses Lit, shadow DOM, a Vite library build, package Sass imported as `*.scss?inline`, component CSS imported as `*.css?inline`, `:host` selectors, `part` attributes, and CSS custom properties for theming. The published `@uswds/uswds` package exposes built Web Components through `./components/*` exports.

That upstream pattern is useful for self-contained components, but RJSF form primitives have additional accessibility risk. RJSF composes labels, hints, errors, and controls from separate templates and widgets. Classic `aria-describedby`, `aria-labelledby`, and label `for` references use ID references that do not reliably cross shadow-root boundaries. Newer element-reference APIs may help, but browser and assistive-technology behavior must be validated before the project relies on them for production form semantics.

## Decision Drivers

- Align future components with the current upstream USWDS Web Component direction where doing so is safe.
- Keep components small, reviewable, and contribution-shaped for possible future proposals to `uswds/uswds`.
- Preserve accessibility for labels, hints, errors, required indicators, invalid state, focus behavior, and dynamic error updates.
- Avoid committing production form primitives to shadow DOM before browser and screen-reader behavior is proven.
- Keep ADR-0002's light-DOM safety decision in force until evidence justifies replacing it.

## Considered Options

1. **Keep targeting the abandoned `uswds-elements` repository** — Continue writing components as though `uswds-elements` were the upstream destination.
2. **Drop upstream alignment entirely** — Treat components only as a PIC-owned implementation detail and stop shaping them for possible contribution.
3. **Adopt `uswds/uswds` Web Component conventions immediately for all components** — Move form primitives to the `usa-banner` shadow-DOM style now.
4. **Target `uswds/uswds` conventions, gated by form accessibility validation** — Use the `usa-banner` pattern as the upstream reference, but require a focused spike before changing production form primitives from light DOM to shadow DOM.

## Decision Outcome

Chosen option: **Target `uswds/uswds` conventions, gated by form accessibility validation**.

The project will retarget upstream-facing language from `uswds-elements` to the main `uswds/uswds` repository. Components should remain small and contribution-shaped, but upstreaming is aspirational because USWDS maintainers have indicated that Web Component development is not currently a high-priority effort.

For self-contained components where the component owns its semantics, future work should follow the `usa-banner` house style unless a specific reason prevents it:

- Lit custom elements.
- Shadow DOM.
- Vite library build support for `*.scss?inline` and `*.css?inline`.
- Component-scoped styles applied through Lit `static styles`.
- `:host`, `part`, slots, and CSS custom properties for styling hooks.
- Small public APIs that are practical to document and review.

Web Components should own the USWDS pattern markup they represent. The React/RJSF adapter should translate RJSF state into custom-element attributes, properties, slots, and events; it should not continue to author a component's internal USWDS structure and then wrap it in a custom-element host. A wrapper-only element that leaves consumers responsible for internal classes such as `usa-alert__body`, `usa-alert__heading`, or `usa-button` is not a successful migration to this architecture.

For RJSF form primitives, ADR-0002 remains in force until spike issue #4 records browser and assistive-technology evidence. The project must not convert production label, hint, error, required-marker, or control semantics to shadow DOM until that spike demonstrates that accessible names, descriptions, invalid state, focus behavior, and dynamic error announcements remain correct.

The form accessibility spike in PR #5 specifically rejects split form-field semantics across shadow boundaries: a light-DOM control could not reliably consume shadow-root hint/error description elements through classic IDREFs or `ariaDescribedByElements` in Chromium. That result does not prohibit self-contained components, such as alerts, from using shadow DOM when their public API keeps interactive and semantic content reachable through normal slots. Components with native form participation risk, such as buttons, need targeted form-behavior validation before production use.

## Accessibility Validation Gate

Issue #4 is the gating spike for the form primitive rendering model:

- https://github.com/GSA-TTS/rjsf-uswds-elements/issues/4

If the cross-boundary shadow-DOM approach works in the must-pass assistive-technology matrix, ADR-0002 can be superseded and the project can adopt a shadow-DOM-first direction for form primitives.

If any must-pass assistive-technology combination fails, the project should keep a hybrid rule: use USWDS-style shadow DOM for self-contained components, but keep RJSF form primitives in light DOM until platform and assistive-technology support improves.

## Consequences

### Positive Consequences

- The repository aligns with the current USWDS Web Component publication model instead of a deprecated repository.
- The just-added Vite build path remains the correct prerequisite for the `usa-banner` style of component-scoped CSS.
- The project can pursue upstream-shaped components without compromising form accessibility by assumption.
- The form rendering model will be decided by browser and assistive-technology evidence rather than by preference.

### Negative Consequences

- The final form primitive rendering model remains unresolved until issue #4 is complete.
- Some existing light-DOM components may need to be revisited if the spike supports shadow DOM.
- If the spike fails, form primitives will diverge from the upstream `usa-banner` shadow-DOM pattern.
- Shadow-DOM style bundles can include font or image URLs, such as `@font-face` references, that require an explicit consumer asset policy.

### Compliance Consequences

- Accessibility-sensitive rendering decisions require browser-backed tests and manual screen-reader evidence.
- CI should continue to run automated Playwright and axe checks, matching the USWDS posture that automation supplements but does not replace human assistive-technology review.
- Architecture documentation must link upstream assumptions to current sources because the Web Component destination changed from `uswds-elements` to `uswds/uswds`.

## Links

- Parent work: https://github.com/GSA-TTS/pic-blm-cxworks/issues/969
- Form accessibility spike: https://github.com/GSA-TTS/rjsf-uswds-elements/issues/4
- USWDS Web Components discussion: https://github.com/uswds/uswds/discussions/6477#discussioncomment-13248225
- USWDS `usa-banner` source: https://github.com/uswds/uswds/blob/develop/packages/usa-banner/src/usa-banner.component.js
- ADR-0002: 0002-use-light-dom-as-default-for-form-primitives.md
- ADR-0003: 0003-add-vite-library-build-before-shadow-dom-styles.md
