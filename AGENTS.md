# AGENTS.md

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
