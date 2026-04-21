import { test, expect } from '@playwright/test';

test('Login and submit feedback', async ({ page }) => {
    // 1. Go to Login Page
    await page.goto('http://localhost:5173/login');

    // 2. Perform Login
    // Using the selectors identified in your previous login tests
    await page.fill('input[type="email"]', 'dayani@gmail.com');
    await page.fill('input[type="password"]', '123456'); // Use actual password
    
    // Use exact match for the Sign In button as seen in your screenshot fixes
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // 3. Navigate to Feedback
    // After login, navigate to the feedback URL shown in your browser tab
    await page.goto('http://localhost:5173/feedback');

    // 4. Fill Feedback Form
    // Using placeholders from your provided image of the Feedback & Contact page
    await page.fill('input[placeholder="Full Name"]', 'Dayani De Silva');
    await page.fill('input[placeholder="Enter Email"]', 'dayani@gmail.com');
    await page.fill('input[placeholder="Menu Item Name (e.g. Spicy Ramen)"]', 'Spicy Ramen');
    await page.fill('input[placeholder="Phone Number (Optional)"]', '0771234567');

    // 5. Select Rating
    // Since these are star icons, we click the 5th star in the container
    const stars = page.locator('.flex.justify-center.gap-2 svg');
    await stars.nth(4).click(); 

    // 6. Enter Comment
    await page.fill('textarea[placeholder="Your thoughts on the food..."]', 'The food is good and very tasty!');

    // 7. Submit
    await page.getByRole('button', { name: 'Send My Feedback' }).click();

    // 8. Verify Success
    // Expect the "Feedback Received!" success state to appear
    await expect(page.getByText(/Feedback Received!/i)).toBeVisible();
    await expect(page.getByText(/Thanks Dayani De Silva/i)).toBeVisible();
});