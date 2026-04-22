import { test, expect } from '@playwright/test';

/**
 * Admin Journey: Order Management
 * Tests: Login, Status Updates, Filtering, and Search functionality.
 */

test('Admin: Manage Orders - Status Updates, Filters and Search', async ({ page }) => {
    // 1. ADMIN LOGIN
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '123456');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // FIX: Wait for the Admin Dashboard URL instead of the root URL
    await expect(page).toHaveURL('http://localhost:5173/admin');

    // 2. NAVIGATE TO ADMIN ORDERS
    // Using the link found in the sidebar navigation
    await page.getByRole('link', { name: 'Orders', exact: true }).click();
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    // --- PART 1: UPDATE PENDING ORDER TO READY ---
    
    // Select the first order row with PENDING status
    const pendingOrderRow = page.locator('tr', { hasText: 'PENDING' }).first();
    await pendingOrderRow.click();

    // Locating the modal and updating status
    const modal = page.locator('div[role="dialog"], div.fixed.inset-0').first(); 
    await modal.getByRole('combobox').selectOption('Ready');
    await modal.getByRole('button', { name: 'Update Status' }).click();
    
    // Success check via Toast
    await expect(page.getByText('Order status updated')).toBeVisible();

    // --- PART 2: UPDATE PREPARING ORDER TO READY ---

    const preparingOrderRow = page.locator('tr', { hasText: 'PREPARING' }).first();
    await preparingOrderRow.click();

    await modal.getByRole('combobox').selectOption('Ready');
    await modal.getByRole('button', { name: 'Update Status' }).click();
    
    await expect(page.getByText('Order status updated')).toBeVisible();

    // --- PART 3: TEST STATUS FILTERS ---

    // Locating the filter dropdown (usually near the search bar)
    const statusDropdown = page.locator('select').filter({ hasText: /Status/i });

    // Filter by Pending
    await statusDropdown.selectOption('pending');
    const rowCountPending = await page.locator('tbody tr').count();
    if (rowCountPending > 0) {
        const visiblePendingBadges = page.locator('tbody tr').filter({ hasText: 'PENDING' });
        await expect(visiblePendingBadges).toHaveCount(rowCountPending);
    }

    // Filter by Ready (mapping 'completed' value as per your logic)
    await statusDropdown.selectOption('completed'); 
    const rowCountReady = await page.locator('tbody tr').count();
    if (rowCountReady > 0) {
        const visibleReadyBadges = page.locator('tbody tr').filter({ hasText: 'READY' });
        await expect(visibleReadyBadges).toHaveCount(rowCountReady);
    }

    // Reset Filter
    await statusDropdown.selectOption('all');

    // --- PART 4: TEST SEARCH BAR ---

    const searchBar = page.getByPlaceholder(/Search orders/i);
    await searchBar.fill('jayani');

    // Verify results show the searched name
    const firstResult = page.locator('tbody tr').first();
    await expect(firstResult).toContainText(/jayani/i);
});