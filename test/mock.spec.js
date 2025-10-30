import { test, expect } from '@playwright/test';

test('Mock provider returns deterministic reply and correct label', async ({ page }) => {
  // Ensure a clean localStorage state for tests: set provider and clear saved messages
  await page.addInitScript(() => {
    localStorage.setItem('provider', 'mock');
    // Clear the app's storage key so tests start with an empty chat
    localStorage.removeItem('Lab7-chat');
  });

  await page.goto('/src/index.html');

  await page.getByPlaceholder(/type your message/i).fill('hello mock');
  await page.getByRole('button', { name: /send/i }).click();

  await expect(page.locator('#messageList .message')).toHaveCount(1, { timeout: 15000 });
  await expect(page.locator('#messageList .message')).toHaveCount(2, { timeout: 15000 });

  const lastLi = page.locator('#messageList li').last();
  await expect(lastLi).toContainText(/Mock/i, { timeout: 10000 });
  await expect(lastLi.locator('.text')).toContainText(/Mock_Reply/i, { timeout: 10000 });
});
