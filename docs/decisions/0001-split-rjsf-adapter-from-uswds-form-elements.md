---
title: 'Split RJSF adapter from USWDS form elements'
status: 'proposed'
date: '2026-09-16'
decision_makers: ['PIC engineering stakeholders']
category: 'Dependency and Supply Chain'
nist_controls: ['CM-2', 'CM-3', 'SA-11', 'SR-3']
impact_level: 'moderate'
ato_relevance: 'no'
risk_treatment: 'mitigate'
---

# Split RJSF adapter from USWDS form elements

## Context and Problem Statement

The theme needs to adapt React JSON Schema Form (RJSF) concepts to USWDS markup while also exploring reusable Lit-based Web Components. If those concerns are mixed in one package, consumers inherit unnecessary implementation details and future component extraction becomes harder.

## Decision Drivers

- Keep the RJSF theme's runtime surface small and understandable.
- Treat Lit as an implementation detail of the Web Components package rather than as a direct concern for the React adapter.
- Allow general-purpose USWDS form elements to evolve independently from RJSF-specific templates, widgets, and utilities.
- Preserve an audit trail for architectural boundaries and package dependencies.

## Considered Options

1. **Single package for React adapter and Web Components** — Put RJSF templates, widgets, Lit components, and supporting utilities in one package.
2. **Split adapter and form elements packages** — Keep `packages/rjsf-uswds` as the React/RJSF adapter and `packages/uswds-form-elements` as the Lit Web Component layer.
3. **Only publish React/RJSF components** — Avoid Web Components and keep all USWDS markup directly inside React templates.

## Decision Outcome

Chosen option: **Split adapter and form elements packages**, because it keeps framework-specific RJSF code separate from reusable USWDS element contracts while still allowing the adapter to consume the elements incrementally.

### Positive Consequences

- Consumers of the RJSF adapter do not need to import Lit directly.
- Web Components can be documented, tested, and reviewed one component at a time.
- Components that prove generally useful can be proposed upstream or reused outside RJSF.
- PIC-specific custom components can remain in application code rather than being forced into the base theme package.

### Negative Consequences

- The monorepo has multiple package build outputs to coordinate.
- Shared behavior must be wired through exports and package dependencies, not just local imports.
- Tests must cover both the Web Component package and the React adapter boundary.

### Compliance Consequences

- Dependency and supply-chain review should consider the two package boundaries separately.
- Build and test verification must demonstrate that package exports and downstream consumers stay wired after changes.
- This decision supports configuration management by making the intended module boundary explicit.

## Links

- Parent work: https://github.com/GSA-TTS/pic-blm-cxworks/issues/969
- Initial implementation PR: https://github.com/GSA-TTS/rjsf-uswds-elements/pull/1
- Component contracts: ../component-contracts.md
