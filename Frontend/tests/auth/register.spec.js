import { test, expect } from '@playwright/test';

test.describe('Registration Tests', () => {

    test('Register page loads correctly', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        // Check for all input fields based on your React state
        await expect(page.locator('input[placeholder="Kasun"]')).toBeVisible(); // First Name
        await expect(page.locator('input[placeholder="Perera"]')).toBeVisible(); // Last Name
        await expect(page.locator('input[placeholder="student@campus.lk"]')).toBeVisible(); // Email

        // Check for button
        await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    });

    test('User can register successfully', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        // Fill in the details
        await page.fill('input[placeholder="Kasun"]', 'John');
        await page.fill('input[placeholder="Perera"]', 'Doe');
        await page.fill('input[placeholder="student@campus.lk"]', 'johndoe@gmail.com');

        // Locating by placeholder for passwords as they are identical types
        const passwordInputs = page.locator('input[type="password"]');
        await passwordInputs.nth(0).fill('password123'); // Password
        await passwordInputs.nth(1).fill('password123'); // Confirm Password

        // Click the Create Account button
        await page.getByRole('button', { name: 'Create Account' }).click();

        // Wait for redirect to login page
        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/.*login/);

        // Optional: Check if success toast appears
        await expect(page.getByText(/Registration successful/i)).toBeVisible();
    });

    test('Should show error if passwords do not match', async ({ page }) => {
        await page.goto('http://localhost:5173/register');

        await page.fill('input[placeholder="Kasun"]', 'John');
        await page.fill('input[placeholder="Perera"]', 'Doe');
        await page.fill('input[placeholder="student@campus.lk"]', 'johndoe@gmail.com');

        const passwordInputs = page.locator('input[type="password"]');
        await passwordInputs.nth(0).fill('password123');
        await passwordInputs.nth(1).fill('different123');

        await page.getByRole('button', { name: 'Create Account' }).click();

        // Check for your validation toast message
        await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
    });
});