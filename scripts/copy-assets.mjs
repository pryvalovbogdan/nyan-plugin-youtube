import { cpSync, existsSync, mkdirSync } from 'node:fs';

const isSafari = process.env.BUILD_TARGET === 'safari';
const outDir = isSafari ? 'dist-safari' : 'dist';

if (isSafari) {
  const required = ['assets-safari/icon16.png', 'assets-safari/icon48.png', 'assets-safari/icon128.png'];
  const missing = required.filter(p => !existsSync(p));

  if (missing.length) {
    console.error(`Safari build requires neutral icon art (App Store guideline 4.1(c)).`);
    console.error(`Missing: ${missing.join(', ')}`);
    process.exit(1);
  }
}

mkdirSync(`${outDir}/assets`, { recursive: true });
cpSync('assets', `${outDir}/assets`, {
  recursive: true,
  filter: src => !src.includes('screenshots'),
});

if (isSafari) {
  cpSync('assets-safari', `${outDir}/assets`, { recursive: true });
  console.log('assets-safari/ -> dist-safari/assets/ (icon overlay)');
}

console.log(`assets/ -> ${outDir}/assets/`);
