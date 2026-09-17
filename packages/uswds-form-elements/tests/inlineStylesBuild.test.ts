import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const packageRoot = join(process.cwd(), 'packages/uswds-form-elements');
const viteBin = join(process.cwd(), 'node_modules/vite/bin/vite.js');
const fixtureConfig = join(packageRoot, 'vite.inline-fixtures.config.ts');

describe('uswds-form-elements Vite inline style build', () => {
  it('emits inline CSS and Sass fixture strings in the package build', async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'uswds-form-elements-build-'));

    try {
      await execFileAsync(
        process.execPath,
        [viteBin, 'build', '--config', fixtureConfig, '--outDir', outputDirectory],
        {
          cwd: packageRoot,
          timeout: 30_000,
        },
      );

      const buildOutput = await readFile(
        join(outputDirectory, 'test-fixtures/inline-styles.js'),
        'utf8',
      );

      expect(buildOutput).toContain('.uswds-form-elements-inline-css-fixture');
      expect(buildOutput).toContain('.uswds-form-elements-inline-sass-fixture');
      expect(buildOutput).toContain('.usa-error-message');
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  }, 30_000);
});
