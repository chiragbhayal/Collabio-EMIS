const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function hasGitDir() {
  // Render build environments typically do not include .git
  return fs.existsSync(path.resolve(__dirname, '..', '.git'));
}

if (!hasGitDir()) {
  process.exit(0);
}

const result = spawnSync('npx', ['husky', 'install'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 0);
