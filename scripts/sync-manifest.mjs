import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const isSafari = process.env.BUILD_TARGET === 'safari';
const sourceManifest = isSafari ? 'manifest.safari.json' : 'manifest.json';
const outDir = isSafari ? 'dist-safari' : 'dist';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(readFileSync(sourceManifest, 'utf8'));

manifest.version = pkg.version;

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2));

console.log(`${sourceManifest} -> ${outDir}/ (version ${pkg.version})`);
