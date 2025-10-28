#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const fsExtra = require('fs-extra');

function run(cmd, args, opts = {}) {
    const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    if (res.status !== 0) process.exit(res.status);
}

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const parcelCache = path.join(projectRoot, '.parcel-cache');
const snipsSrc = path.join(projectRoot, 'src', 'snips');
const snipsDest = path.join(distDir, 'snips');
const assetsSrc = path.join(projectRoot, 'src', 'assets');
const assetsDest = path.join(distDir, 'assets');

console.log('Cleaning dist and .parcel-cache...');
rimraf.sync(distDir);
rimraf.sync(parcelCache);

console.log('Running Parcel build...');
run('npx', ['parcel', 'build', 'src/index.html', '--dist-dir', 'dist', '--public-url', './']);

console.log('Copying static files to dist...');
try {
    fsExtra.copySync(snipsSrc, snipsDest, { overwrite: true, recursive: true });
    console.log('Snips copied successfully.');
    fsExtra.copySync(assetsSrc, assetsDest, { overwrite: true, recursive: true });
    console.log('Assets copied successfully.');
} catch (err) {
    console.error('Failed to copy snips and/or assets:', err);
    process.exit(1);
}

console.log('Starting dev script (npm run dev)...');
//run('npm', ['run', 'dev']);