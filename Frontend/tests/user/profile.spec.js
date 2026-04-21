import { test, expect } from '@playwright/test';

test.describe('User Profile Update Flow', () => {
  test('should login as Dayani and update profile name', async ({ page }) => {
    // 1. Go to Login page
    await page.goto('http://localhost:5173/login');

    // 2. Login as user
    await page.fill('input[type="email"]', 'dayani@gmail.com');
    await page.fill('input[type="password"]', '123456');
    
    // Using exact match for 'Sign In' to avoid conflicts with 'Google Sign In'
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // 3. Navigate to Dashboard via Header Profile Dropdown
    // Click the profile section in the header to open the dropdown
    await page.locator('header').getByText('dayani').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // 4. Go to Account Settings in the Dashboard sidebar
    // Path maps to /dashboard/settings in the UserDashboard component
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await expect(page).toHaveURL(/.*settings/);

    // 5. Update User Name (Personal Info section)
    // Target inputs by placeholder as defined in UserSettings component
    const firstNameInput = page.locator('input[placeholder="Alex"]');
    const lastNameInput = page.locator('input[placeholder="Doe"]');

    await firstNameInput.clear();
    await firstNameInput.fill('Dayani');
    
    await lastNameInput.clear();
    await lastNameInput.fill('Silva Updated');

    // 6. Save Changes
    // Triggers updateUserData() which uses axios.put to update the name
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // 7. Verify Success
    // Component navigates to home ("/") after a successful update
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});