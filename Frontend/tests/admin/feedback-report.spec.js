import { test, expect } from '@playwright/test';

test.describe('Admin Reports Navigation', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);

        // Login
        await page.goto('http://localhost:5173/login');
        await page.locator('input[type="email"]').fill('admin@gmail.com');
        await page.locator('input[type="password"]').fill('123456');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        await page.waitForURL(/.*admin/, { timeout: 15000 });

        // Wait for the UI to be ready
        const loadingSpinner = page.getByText('UNISERVE').first();
        await expect(loadingSpinner).toBeHidden({ timeout: 15000 });
    });

    test('should generate the Feedback report (2nd PDF button)', async ({ page }) => {
        // 1. Navigate to Report page
        await page.getByRole('link', { name: 'Report', exact: true }).click();
        await expect(page.getByRole('heading', { name: 'System Reports' })).toBeVisible();

        // 2. Select the "30 Days" filter
        await page.getByRole('button', { name: '30 Days', exact: true }).click();

        // 3. TARGET THE 2nd GENERATE PDF BUTTON (Feedback Management)
        // .nth(1) selects the second occurrence of the button
        const feedbackGenerateBtn = page.getByRole('button', { name: /Generate PDF/i }).nth(1);

        // 4. Scroll to put the button in the center of the screen
        await feedbackGenerateBtn.scrollIntoViewIfNeeded({ block: 'center' });

        // Optional: Small delay to ensure any chart layout shifts are finished
        await page.waitForTimeout(500);

        // 5. Click the button
        // Using { force: true } to handle any 500-error overlays or invisible chart containers
        await feedbackGenerateBtn.click({ force: true });

        // 6. Verify Navigation and Success Modal
        // Feedback reports usually navigate to /admin/reports/feedback
        await expect(page).toHaveURL(/.*admin\/reports\/feedback/);

        const successModal = page.getByText('Report Ready');
        await expect(successModal).toBeVisible({ timeout: 15000 });

        // 7. Close modal
        await page.getByRole('button', { name: 'Close' }).click();
        await expect(successModal).toBeHidden();
    });

});