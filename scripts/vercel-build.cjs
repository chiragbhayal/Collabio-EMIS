const { existsSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');

const distIndex = join(__dirname, '..', 'collabio_client', 'dist', 'index.html');

if (existsSync(distIndex)) {
  console.log(`[vercel-build] Frontend already built at ${distIndex}. Skipping.`);
  process.exit(0);
}

console.log('[vercel-build] Building frontend…');
const result = spawnSync('npm', ['run', 'build:frontend'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
