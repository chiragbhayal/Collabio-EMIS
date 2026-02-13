const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const srcPackageJson = path.resolve(__dirname, '..', 'package.json');
const destPackageJson = path.join(distDir, 'package.json');

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(srcPackageJson, destPackageJson);
