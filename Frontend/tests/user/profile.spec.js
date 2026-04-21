import { test, expect } from '@playwright/test';

test('Profile page loads', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'test-token');
  });

  await page.goto('http://localhost:5173/dashboard/profile');

  await expect(page.locator('text=Profile')).toBeVisible();
});

test('User can update profile', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'test-token');
  });

  await page.goto('http://localhost:5173/dashboard/profile');

  await page.fill('input[name="name"]', 'Updated Name');
  await page.click('button[type="submit"]');
});