import { test, expect } from '@playwright/test';

test('Full Forgot Password and Update Flow', async ({ page }) => {
    // 1. Navigate to the page
    await page.goto('http://localhost:5173/forget-password');

    // 2. Step 1: Send OTP
    // Use the specific email you requested
    await page.fill('input[placeholder="Enter your Email"]', 'mkdkdesilva@gmail.com');
    await page.getByRole('button', { name: 'Send OTP Code' }).click();

    // 3. Wait for the success toast and the UI transition
    // Increased timeout to 10s to ensure the API responds and toast animates
    await expect(page.getByText(/OTP sent to your email/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Reset Security/i)).toBeVisible();

    // 4. Step 2: Enter OTP and New Passwords
    // Your component uses '0 0 0 0 0 0' as the OTP placeholder
    await page.fill('input[placeholder="0 0 0 0 0 0"]', '123456'); 
    
    // Fill the new password fields
    await page.fill('input[placeholder="New Secret Password"]', 'NewSecurePass123!');
    await page.fill('input[placeholder="Confirm Secret Password"]', 'NewSecurePass123!');

    // 5. Click Verify & Update
    await page.getByRole('button', { name: 'Verify & Update' }).click();

    // 6. Final verification: Successful redirect to login
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/.*login/);
    
    // Verify the final success toast message from your code
    await expect(page.getByText(/Password changed successfully/i)).toBeVisible();
});