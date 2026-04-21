import { test, expect } from '@playwright/test';

test.describe('Admin Feedback Management', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Admin Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // 2. Navigate to Feedback Page
    await page.click('text=Feedback');
    await expect(page).toHaveURL(/.*feedback/);
  });

  test('Admin can delete an existing feedback entry', async ({ page }) => {
    // Ensure the page title is visible
    await expect(page.getByText('Feedback Management')).toBeVisible();

    // TARGET THE DELETE BUTTON (since data already exists)
    // We use the title attribute you defined in your React code
    const firstDeleteButton = page.locator('button[title="Delete Feedback"]').first();
    
    // Wait for the data to load and click delete
    await expect(firstDeleteButton).toBeVisible();
    await firstDeleteButton.click();

    // 3. Confirm Deletion in the Modal
    // Your React component renders "Confirm Delete" inside the modal
    await page.getByRole('button', { name: 'Confirm Delete' }).click();

    // 4. Verify Success Toast
    await expect(page.getByText('Feedback deleted successfully')).toBeVisible();
  });
});