import { test, expect } from '@playwright/test';

test('Navigate from Login to Forgot Password and Send OTP', async ({ page }) => {
    // 1. Start at the Login Page
    await page.goto('http://localhost:5173/login');

    // 2. Click "Froget Password ?" link
    // This matches the <Link to="/forget-password"> in your LoginPage component
    await page.getByRole('link', { name: 'Froget Password ?' }).click();

    // 3. Verify navigation to the Forget Password page
    await expect(page).toHaveURL(/.*forget-password/);

    // 4. Enter the email
    // Matches the placeholder "Enter your Email" in ForgetPassword component
    const emailInput = page.getByPlaceholder('Enter your Email');
    await emailInput.fill('mkdkdesilva@gmail.com');

    // 5. Click "Send OTP Code" button
    // This triggers the sendOTP() function in your code
    await page.getByRole('button', { name: 'Send OTP Code' }).click();

    // 6. Verify the Success Toast message
    // Your code uses: toast.success("OTP sent to your email " + email);
    await expect(page.getByText(/OTP sent to your email mkdkdesilva@gmail.com/i)).toBeVisible();

    // 7. Verify UI transition to the "Reset Security" step
    // Your code sets setStep("otp") which renders the <h1>Reset Security</h1>
    await expect(page.getByRole('heading', { name: /Reset Security/i })).toBeVisible();
    
    // Additional check: verify the OTP input field is now visible
    await expect(page.getByPlaceholder('0 0 0 0 0 0')).toBeVisible();
});