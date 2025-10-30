import { test, expect } from '@playwright/test';

test('Eliza responds and label shows "Eliza"', async ({ page }) => {
  // Ensure a clean localStorage state for tests: set provider and clear saved messages
  await page.addInitScript(() => {
    localStorage.setItem('provider', 'eliza');
    // Clear the app's storage key so tests start with an empty chat
    localStorage.removeItem('Lab7-chat');
  });

  // Serve from HTTP now
  await page.goto('/src/index.html');

  await page.getByPlaceholder(/type your message/i).fill('hello');
  await page.getByRole('button', { name: /send/i }).click();

  // Wait for user bubble then assistant bubble
  await expect(page.locator('#messageList .message')).toHaveCount(1, { timeout: 15000 });
  await expect(page.locator('#messageList .message')).toHaveCount(2, { timeout: 15000 });

  // Check sender name inside the last li
  const lastLi = page.locator('#messageList li').last();
  await expect(lastLi).toContainText(/Eliza/i, { timeout: 10000 });
  // And make sure some text is present
  await expect(lastLi.locator('.text')).toBeVisible();
});
