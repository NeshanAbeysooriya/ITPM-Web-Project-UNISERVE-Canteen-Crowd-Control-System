import { test, expect } from '@playwright/test';

test.describe('Admin Reports Navigation', () => {

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:5173/login');
    await page.locator('input[type="email"]').fill('admin@gmail.com');
    await page.locator('input[type="password"]').fill('123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForURL(/.*admin/, { timeout: 15000 });

    // Wait for any spinner to clear
    const loadingSpinner = page.getByText('UNISERVE').first();
    await expect(loadingSpinner).toBeHidden({ timeout: 15000 });
  });

  test('should navigate to Reports and generate the first available report', async ({ page }) => {
    // 1. Navigate to Report page
    await page.getByRole('link', { name: 'Report', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'System Reports' })).toBeVisible();

    // 2. Select the "30 Days" filter
    await page.getByRole('button', { name: '30 Days', exact: true }).click();

    // 3. TARGET THE FIRST GENERATE PDF BUTTON
    // Instead of looking for "User Management", we grab the first PDF button on the page
    const firstGenerateBtn = page.getByRole('button', { name: /Generate PDF/i }).first();

    // 4. Scroll the button into the center of the screen
    await firstGenerateBtn.scrollIntoViewIfNeeded({ block: 'center' });

    // 5. Click the button (using force: true to bypass potential layout shift issues)
    await firstGenerateBtn.click({ force: true });

    // 6. Verify the Success Modal appears
    const successModal = page.getByText('Report Generated');
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // 7. Close the modal
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(successModal).toBeHidden();
  });
});