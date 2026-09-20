---
title: 'Use light DOM as default for form primitives'
status: 'amended'
date: '2026-09-16'
decision_makers: ['PIC engineering stakeholders']
category: 'Input Validation and Output Handling'
nist_controls: ['SA-11', 'SI-10']
impact_level: 'moderate'
ato_relevance: 'no'
risk_treatment: 'mitigate'
---

# Use light DOM as default for form primitives

## Context and Problem Statement

USWDS form primitives need to preserve browser form semantics, USWDS styling, and accessibility relationships such as labels, required indicators, hints, errors, and `aria-describedby`. Shadow DOM with component-scoped styles is useful for self-contained components, but the completed issue #4 / PR #5 spike rejected split cross-shadow form-field semantics for RJSF-composed form fields.

## Decision Drivers

- USWDS styles are currently global, class-based CSS that naturally applies to light DOM.
- RJSF composes a field from separate templates and widgets, so labels, hints, errors, and controls may not be owned by one Web Component.
- Field accessibility relationships must remain inspectable and testable.
- The completed form accessibility spike showed that split cross-shadow field semantics are not safe for production RJSF form primitives.
- Incremental migration should preserve current behavior after each component slice.

## Considered Options

1. **Use light DOM as the default for form primitives** — Render USWDS-compatible fallback markup in light DOM and wrap it with small Web Components where useful.
2. **Use shadow DOM for all Web Components immediately** — Move component internals into shadow roots and inject/adopt the needed USWDS styles.
3. **Use no Web Components for form primitives** — Keep all form markup directly in React/RJSF templates.
4. **Use a hybrid rule** — Default to light DOM for form primitives, but allow shadow DOM for self-contained components or future components with validated styling and accessibility contracts.

## Decision Outcome

Chosen option: **Use a hybrid rule with light DOM as the default for RJSF-composed form primitives**, because it preserves known-good USWDS styling and accessibility relationships while leaving room for shadow DOM where the component owns its semantics.

### Positive Consequences

- Existing `aria-describedby`, label, error, and required-marker behavior remains transparent.
- Global USWDS CSS continues to apply without duplicating CSS into every component.
- Each migrated element can remain a small, reviewable increment.
- Shadow DOM remains available for self-contained components and for future form-control topologies that receive new browser and assistive-technology evidence.

### Negative Consequences

- Components are less encapsulated from page-level CSS than they would be in shadow DOM.
- Consumers must continue loading USWDS CSS globally for production rendering.
- Some later components may need to be revisited if the project adopts a shadow-DOM build path.

### Compliance Consequences

- Accessibility verification remains central for every migrated component.
- Future shadow-DOM conversions that affect field semantics require new browser-backed and assistive-technology review evidence that supersedes the issue #4 / PR #5 findings.
- This decision reduces near-term behavioral risk while the package build and CSS strategy are still evolving.

## Revisited by ADR-0004

USWDS maintainers have clarified that future Web Components are being added to the main `uswds/uswds` repository rather than the separate `uswds-elements` repository. The current upstream reference, `usa-banner`, uses Lit with shadow DOM and inline package/component styles.

This changes the upstream alignment pressure, but it does not make shadow DOM safe for RJSF-composed form fields. Issue #4 / PR #5 tested split cross-shadow form-field semantics and rejected that topology for production use. This ADR remains the current production rule for RJSF-composed form primitives and acts as the form-primitive exception within a broader USWDS-style shadow-DOM direction for self-contained components.

## Links

- Parent work: https://github.com/GSA-TTS/pic-blm-cxworks/issues/969
- Shadow DOM styling spike: https://github.com/GSA-TTS/pic-blm-cxworks/issues/1144
- Shadow DOM spike PR: https://github.com/GSA-TTS/rjsf-uswds-elements/pull/2
- Form accessibility spike: https://github.com/GSA-TTS/rjsf-uswds-elements/issues/4
- USWDS Web Components direction: https://github.com/uswds/uswds/discussions/6477#discussioncomment-13248225
- ADR-0004: 0004-target-uswds-web-component-conventions-after-form-accessibility-validation.md
- Component contracts: ../component-contracts.md
