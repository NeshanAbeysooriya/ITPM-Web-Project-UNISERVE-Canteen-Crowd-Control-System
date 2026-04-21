import { test, expect } from '@playwright/test';

/**
 * Admin Journey: Report Generation and Analytics
 * Covers: Time range selection, PDF generation, Modal interaction, and Data filtering.
 */

test('Admin: Generate Order Report and Test Analytics Filters', async ({ page }) => {
    // 1. ADMIN LOGIN
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // Ensure redirect to Admin Dashboard
    await expect(page).toHaveURL(/.*\/admin/);

    // 2. NAVIGATE TO SYSTEM REPORTS
    // Success: Link text is "Report" and URL is singular /admin/report
    await page.getByRole('link', { name: 'Report', exact: true }).click();
    await expect(page).toHaveURL(/.*\/admin\/report$/);

    // 3. SELECT 30 DAYS TIME RANGE
    const thirtyDaysBtn = page.getByRole('button', { name: '30 Days', exact: true });
    await thirtyDaysBtn.click();
    // Verify button state (active state check)
    await expect(thirtyDaysBtn).toHaveClass(/bg-accent/);

    // 4. GENERATE PDF FOR ORDER MANAGEMENT
    // FIXED: Using .last() or a more specific class to avoid strict mode violation (matching parent divs)
    const orderCard = page.locator('div').filter({ 
        has: page.getByRole('heading', { name: 'Order Management', level: 3 }) 
    }).last();
    
    await orderCard.getByRole('button', { name: /Generate PDF/i }).click();

    // 5. VERIFY ANALYTICS PAGE REDIRECT & AUTO-GENERATION
    await expect(page).toHaveURL(/.*\/admin\/reports\/orders\?range=30/);

    // 6. HANDLE SUCCESS MODAL
    const successModal = page.locator('div.fixed.inset-0').filter({ hasText: 'Report Generated' });
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    await successModal.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(successModal).not.toBeVisible();

    // 7. TEST STATUS FILTERS (Analytics Page)
    // Testing the "COMPLETED" status filter
    await page.getByRole('button', { name: 'completed', exact: true }).click();
    const completedBadge = page.locator('tbody tr span').first();
    if (await completedBadge.isVisible()) {
        await expect(completedBadge).toContainText(/COMPLETED/i);
    }

    // Testing the "PENDING" status filter
    await page.getByRole('button', { name: 'pending', exact: true }).click();
    const pendingBadge = page.locator('tbody tr span').first();
    if (await pendingBadge.isVisible()) {
        await expect(pendingBadge).toContainText(/PENDING/i);
    }

    // 8. TEST SEARCH BAR
    const searchBar = page.getByPlaceholder(/Search by Order ID or Customer/i);
    await searchBar.fill('jayani');

    // Verify search results (Ensuring name is found in the table)
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toContainText(/JAYANI/i);
});