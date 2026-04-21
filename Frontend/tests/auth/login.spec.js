import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {

    test('Login page loads correctly', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();

        // FIX: Use exact match to avoid "Sign in with Google" conflict
        await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    });

    test('User can login successfully and redirect to home', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[type="email"]', 'dayani@gmail.com');
        await page.fill('input[type="password"]', '123456');

        // FIX: Use exact match
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        // wait redirect
        await page.waitForURL('http://localhost:5173/');
        await expect(page).toHaveURL('http://localhost:5173/');
    });

    test('Invalid login shows error (optional)', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[type="email"]', 'wrong@gmail.com');
        await page.fill('input[type="password"]', 'wrong123');

        // Use the exact button match we fixed earlier
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        /** * FIX: react-hot-toast usually renders in a div with the role "status" 
         * or you can just search for the specific text.
         * We use a regex to be safe.
         */
        const errorMessage = page.getByText(/check your credentials/i);

        // We increase the timeout slightly because toasts have entrance animations
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

});