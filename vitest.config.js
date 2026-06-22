import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __NYAN_DEBUG__: 'false',
    __SAFARI__: 'false',
  },
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'node',
    clearMocks: true,
  },
});
