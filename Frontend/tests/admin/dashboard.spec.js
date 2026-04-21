import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '123456');
    // Using exact match for the Sign In button to avoid ambiguity
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    await expect(page).toHaveURL(/.*admin/);
  });

  test('should verify Dashboard and Menu page visibility', async ({ page }) => {
    // 1. Verify we are on the Dashboard
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // 2. Click the Menu Item link in the sidebar
    // We use getByRole('link') to specifically target the navigation element
    await page.getByRole('link', { name: 'Menu Item', exact: true }).click();

    // 3. Verify the URL change
    await expect(page).toHaveURL(/.*admin\/menu/);

    // 4. Verify the Menu Management page content
    // Check for the heading to confirm the page has loaded
    await expect(page.getByRole('heading', { name: 'Menu Management' })).toBeVisible();
  });

});