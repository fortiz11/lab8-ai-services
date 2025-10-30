// tests/mock.spec.js
import { test, expect } from '@playwright/test';
import { fileUrl } from './helpers.js';

test('Mock provider returns deterministic reply and correct label', async ({ page }) => {
  // Force provider to mock BEFORE scripts run
  await page.addInitScript(() => {
    localStorage.setItem('provider', 'mock');
  
  });

  await page.goto(fileUrl('index.html'));

  // Send a prompt
  await page.getByPlaceholder(/type your message/i).fill('hello mock');
  await page.getByRole('button', { name: /send/i }).click();

  // Assistant bubble label should reflect your mapping: "Mock AI"
  await expect(page.locator('.sender').last()).toHaveText(/Mock AI/i);

  // Content should be the deterministic mock reply (default "Mock_Reply")
  await expect(page.locator('.text').last()).toContainText('Mock_Reply');
});
