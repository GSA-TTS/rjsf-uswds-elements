## Summary

-

## Component Contract

Complete this section for `uswds-form-elements` Web Component or RJSF adapter changes. If not applicable, say why.

- Component classification: self-contained display | field primitive | native form control | submit/reset control | composite/slotted interactive component | not applicable
- Contract docs updated in `docs/component-contracts.md`: yes | no | not applicable
- Component-owned USWDS markup identified: yes | no | not applicable
- RJSF adapter avoids authoring component-internal USWDS markup: yes | no | not applicable
- Supported forwarded attributes documented: yes | no | not applicable
- Unsupported native features documented: yes | no | not applicable

## Accessibility Checklist

- No empty ARIA attributes are emitted.
- Accessible role, name, description, state, and disabled behavior are documented and tested.
- Keyboard behavior is documented and tested, including Tab order and activation keys where applicable.
- Shadow DOM accessibility exposure is covered by Playwright/browser tests when shadow DOM is used.
- Slotted interactive content is covered by Playwright/browser tests when slots contain links, buttons, or controls.
- Native form-control or submit/reset parity is documented and tested, or limitations are explicitly documented.
- Axe checks are included, but explicit user-facing assertions are also present.
- Residual manual assistive-technology checks are listed for shadow DOM, live regions, alerts, or form controls.

## Verification

```text
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:a11y
npm audit --audit-level=high
```

## Security Impact

- Authentication/authorization changed: yes | no
- Data handling changed: yes | no
- Attack surface changed: yes | no
- Notes:

## Rollback

Revert this PR.
