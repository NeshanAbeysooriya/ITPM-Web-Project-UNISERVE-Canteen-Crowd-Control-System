import { test, expect } from '@playwright/test';

test('Admin feedback page loads', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'admin-token');
  });

  await page.goto('http://localhost:5173/admin/feedback');

  await expect(page.locator('text=Feedback Management')).toBeVisible();
});

test('Admin can search feedback', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/feedback');

  await page.fill('input', 'rice');
});

test('Admin can delete feedback', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/feedback');

  await page.click('button[title="Delete Feedback"]');
  await page.click('text=Confirm Delete');
});