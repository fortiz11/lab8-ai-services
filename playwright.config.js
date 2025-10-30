// playwright.config.js (root copy)
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  use: {
    headless: true,
    viewport: { width: 1200, height: 800 },
    baseURL: 'http://127.0.0.1:5173',
    video: 'off',
    trace: 'on-first-retry',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  // Start an HTTP server that serves your repo root
  webServer: {
    command: 'npx http-server . -p 5173 -c-1', // no caching
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
