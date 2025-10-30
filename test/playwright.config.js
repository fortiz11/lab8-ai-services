// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    headless: true,                 // set to false to watch the browser
    viewport: { width: 1200, height: 800 },
    video: 'off',
    trace: 'on-first-retry',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
