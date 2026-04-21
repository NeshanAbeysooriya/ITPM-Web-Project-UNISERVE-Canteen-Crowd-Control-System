import { test, expect } from '@playwright/test';

test('Admin user list loads', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'admin-token');
  });

  await page.goto('http://localhost:5173/admin/users');

  await expect(page.locator('text=User Management')).toBeVisible();
});

test('Admin can view users', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'admin-token');
  });

  await page.goto('http://localhost:5173/admin/users');

  await expect(page.locator('table')).toBeVisible();
});