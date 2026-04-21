import { test, expect } from '@playwright/test';

/**
 * Playwright test for the UniServe Canteen System.
 * This script automates the full user journey: Login -> Menu Selection -> Cart -> Checkout -> Slot Booking -> Confirmation.
 * * Based on the project requirements for IT3040 Assignment 5[cite: 5, 6, 15].
 */

test('User Journey: Full Order Process from Login to Confirmation', async ({ page }) => {
    // 1. Login Process
    // Directs to the login page to authenticate the user "dayani"
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'dayani@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // Wait for redirect to the home dashboard
    await page.waitForURL('http://localhost:5173/'); 

    // 2. Navigation to Menu
    // User navigates to the canteen menu to browse available items
    await page.getByRole('link', { name: 'Menu', exact: true }).click();
    await page.waitForURL('**/menu');

    // 3. Select item
    // Selecting the first available item (e.g., Burger or Rice and curry)
    await page.getByText('View Item').first().click(); 

    // 4. Add to Cart
    await page.getByRole('button', { name: /add to cart/i }).click();

    // 5. Shopping Cart
    // Navigating to the cart to review the selection
    await page.getByRole('link', { name: 'Shopping Cart' }).click();
    await page.waitForURL('**/cart');
    await page.getByRole('link', { name: 'Proceed to Checkout' }).click();

    // 6. Checkout Form
    // Filling user details and proceeding to the time slot selection page
    await page.waitForURL('**/checkout');
    await page.fill('input[placeholder="Enter your name"]', 'dayani');
    await page.fill('input[placeholder="0712345678"]', '0703533350');
    await page.fill('textarea[placeholder*="instructions"]', 'No');
    await page.getByRole('button', { name: /Select time slot|→/ }).click();

    // 7. Select Time Slot
    // Navigating to the time-slots page to pick a pickup window
    await page.waitForURL('**/time-slots');

    // Best Practice: Target the interactive 'Book Slot' button directly.
    // .last() is used to select the latest available slot in the DOM
    const lastBookButton = page.getByRole('button', { name: 'Book Slot' }).last();

    // Ensure the slot is enabled and not "Closed" before clicking
    await expect(lastBookButton).toBeEnabled();
    await lastBookButton.click();

    // 8. Confirm Order
    // Final review on the checkout page before placing the order
    await page.waitForURL('**/checkout');
    const placeOrderBtn = page.getByRole('button', { name: 'Confirm & Place Order' });
    
    // Ensure the button is ready to be clicked
    await expect(placeOrderBtn).toBeEnabled();
    await placeOrderBtn.click();

    // 9. Verify Success Toast/Message
    // Checks for the confirmation message 'Order placed!'
    await expect(page.getByText(/Order placed|successfully/i)).toBeVisible();

    // 10. Final View & Redirection Check
    // Navigate to the orders page to verify the order appears in the history
    await page.getByRole('button', { name: 'View My Orders' }).click();

    /** * FIX: Use a Regular Expression for URL matching to avoid glob pattern mismatches.
     * This ensures the test passes regardless of the port or full protocol prefix.
     */
    await expect(page).toHaveURL(/\/orders/);
});