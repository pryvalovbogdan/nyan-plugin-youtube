// Portable replacement for `rsync -av --exclude=screenshots assets/ dist/assets/`.
// Works on any platform with Node, including minimal CI images.
import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist/assets', { recursive: true });
cpSync('assets', 'dist/assets', {
  recursive: true,
  filter: src => !src.includes('screenshots'),
});

console.log('assets/ -> dist/assets/');
