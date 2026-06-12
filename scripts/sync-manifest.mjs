import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));

manifest.version = pkg.version;

mkdirSync('dist', { recursive: true });
writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

console.log(`manifest.json -> dist/ (version ${pkg.version})`);
