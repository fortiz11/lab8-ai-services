
import { test, expect } from '@playwright/test';
import { fileUrl } from './helpers.js';

test('Eliza responds and label shows "Eliza"', async ({ page }) => {
  // Set provider to eliza BEFORE the app runs
  await page.addInitScript(() => {
    localStorage.setItem('provider', 'eliza');
  });

  await page.goto(fileUrl('index.html'));

  // Type and send
  await page.getByPlaceholder(/type your message/i).fill('hello');
  await page.getByRole('button', { name: /send/i }).click();

  // Last assistant bubble should say "Eliza" as the sender
  await expect(page.locator('.sender').last()).toHaveText(/Eliza/i);

  // And we should have at least two messages (user + assistant)
  await expect(page.locator('li')).toHaveCountGreaterThan(1);
});
