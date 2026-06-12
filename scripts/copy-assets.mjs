import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist/assets', { recursive: true });
cpSync('assets', 'dist/assets', {
  recursive: true,
  filter: src => !src.includes('screenshots'),
});

console.log('assets/ -> dist/assets/');
