import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Tests', () => {

  // Set token for admin access
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'admin-test-token');
    });
  });

  test('Dashboard page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.locator('text=Canteen Control Center')).toBeVisible();
  });

  test('KPI cards are visible', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Pending Orders')).toBeVisible();
    await expect(page.locator('text=In Queue')).toBeVisible();
  });

  test('Hourly chart loads', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.locator('text=Hourly Order Traffic')).toBeVisible();
  });

  test('Order status chart loads', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.locator('text=Order Fulfillment')).toBeVisible();
  });

  test('Quick links are visible', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.locator('text=Manage Menu')).toBeVisible();
    await expect(page.locator('text=Order List')).toBeVisible();
    await expect(page.locator('text=Pickup Slots')).toBeVisible();
    await expect(page.locator('text=Feedback Monitor')).toBeVisible();
  });

});