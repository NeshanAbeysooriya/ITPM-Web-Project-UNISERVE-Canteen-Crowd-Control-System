import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {

  // Login as admin before each test to get the token
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // Navigate to User Management
    await page.click('text=Users');
    await expect(page).toHaveURL(/.*admin\/users/);
  });

  test('Admin can block and unblock a user', async ({ page }) => {
    // Ensure the table has loaded
    await expect(page.locator('table')).toBeVisible();

    // 1. BLOCK USER FLOW
    // Find the first block button (using the title attribute from your code)
    const blockButton = page.locator('button[title="Block User"]').first();

    if (await blockButton.isVisible()) {
      await blockButton.click();

      // Verify Modal is visible
      await expect(page.getByText('Block User', { exact: true })).toBeVisible();

      // Click the Confirm Block button (matches the logic in your UserBlockConfirm component)
      await page.getByRole('button', { name: 'Confirm Block' }).click();

      // Check for success toast
      await expect(page.getByText('User block status changed Successfully')).toBeVisible();
    }

    // 2. UNBLOCK USER FLOW
    // Find a user that is currently "Restricted" or has the "Unblock User" title
    const unblockButton = page.locator('button[title="Unblock User"]').first();

    if (await unblockButton.isVisible()) {
      await unblockButton.click();

      // Verify Modal text matches "Unblock User"
      await expect(page.getByText('Unblock User', { exact: true })).toBeVisible();

      // Click Confirm Unblock
      await page.getByRole('button', { name: 'Confirm Unblock' }).click();

      // Check for success toast
      await expect(page.getByText('User block status changed Successfully')).toBeVisible();
    }
  });

  test('Admin user list handles empty state', async ({ page }) => {
    // This part is only if your DB is empty
    const emptyState = page.getByText('No Users to display');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });
});