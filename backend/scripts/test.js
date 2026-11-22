import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env, DATABASE_URL: 'file:./test.db' };
const prismaCli = resolve(
  backendRoot,
  'node_modules',
  'prisma',
  'build',
  'index.js',
);
const testDatabase = resolve(backendRoot, 'prisma', 'test.db');

function cleanTestDatabase() {
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(testDatabase + suffix, { force: true });
  }
}

const schema = spawnSync(
  process.execPath,
  [
    prismaCli,
    'db',
    'push',
    '--schema',
    'prisma/schema.prisma',
    '--force-reset',
  ],
  { cwd: backendRoot, env, stdio: 'inherit' },
);
if (schema.status !== 0) {
  cleanTestDatabase();
  process.exit(schema.status ?? 1);
}

const tests = spawnSync(process.execPath, ['--test', 'tests/api.test.js'], {
  cwd: backendRoot,
  env,
  stdio: 'inherit',
});
cleanTestDatabase();
if (tests.error) throw tests.error;
process.exit(tests.status ?? 1);
