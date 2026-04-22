import { test, expect } from '@playwright/test';

/**
 * Isolated test for the Orders Journey:
 * Header Navigation -> View Orders -> Download Receipt
 */

test('User Journey: Navigate to Orders and Download Receipt', async ({ page }) => {
    // 1. Setup: User must be logged in to see orders (per your fetchOrders logic)
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'dayani@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // Wait for the home page to load after login
    await page.waitForURL('http://localhost:5173/');

    // 2. Click "Orders" in the Header
    // Your code has a link in the header nav: <link "Orders" /url: /orders>
    const ordersLink = page.getByRole('link', { name: 'Orders', exact: true });
    await ordersLink.click();

    // 3. Verify Navigation to UserOrdersPage
    await page.waitForURL('**/orders');
    
    // 4. Verify "My Orders" heading is visible
    const heading = page.getByRole('heading', { name: 'My Orders', exact: true });
    await expect(heading).toBeVisible();

    // 5. Handle the Receipt Download
    // Start waiting for the download event before clicking
    const downloadPromise = page.waitForEvent('download');

    // Select the first "Download Receipt" button (the most recent order)
    // Your code uses: <button>Download Receipt</button>
    const downloadBtn = page.getByRole('button', { name: /Download Receipt/i }).first();
    
    // Ensure orders have loaded (wait for the button to appear)
    await downloadBtn.waitFor({ state: 'visible' });
    await downloadBtn.click();

    const download = await downloadPromise;

    // 6. Verify Download Success
    // Your code saves as: `UniServe_Receipt_${order.orderID}.pdf`
    console.log('Successfully started download:', download.suggestedFilename());
    expect(download.suggestedFilename()).toContain('UniServe_Receipt');
    expect(download.suggestedFilename()).toContain('.pdf');

    // Optional: Verify the file actually exists in the temp download folder
    const path = await download.path();
    expect(path).toBeTruthy();
});