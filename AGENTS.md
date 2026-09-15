# AGENTS.md

## Playwright In Sandboxes

The workbench accessibility smoke tests use Playwright Chromium via `npm run test:a11y`.

In some agent sandboxes, Playwright browser downloads fail even when package installation works. Observed failures include `ECONNREFUSED` to both the default Playwright CDN and the Azure Edge mirror:

```bash
npx playwright install chromium
PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net npx playwright install chromium
```

If the default CDN is blocked, try the Azure Edge mirror first. `playwright.azureedge.net` is included in the balanced sandbox allow-list used by GSA-TTS agentic coding environments.

On Ubuntu arm64 sandboxes, `sudo apt-get install -y chromium` may install only the `chromium-browser` snap stub, not a usable browser binary. If `chromium-browser --version` says the Chromium snap must be installed and `snap install chromium` cannot reach `/run/snapd.socket`, local Playwright execution is blocked by the sandbox rather than by this repository.

When local Playwright is blocked:

- still run `npm run build` before diagnosing workbench test failures, because the Vite dev server resolves workspace package exports from built `dist` entries;
- run the rest of the verification suite: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm audit --audit-level=high`;
- use GitHub Actions as the authoritative Playwright environment, since CI installs browsers with `npx playwright install --with-deps chromium`;
- record the exact browser-install error in the verification transcript instead of claiming `npm run test:a11y` passed locally.
