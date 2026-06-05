import { test, expect } from "@playwright/test";

test.describe("Admin Operations Flow", () => {
  // We use a setup step to handle login if needed, or just visit directly if auth is mocked for local dev
  test("should manage orders and logistics in the OMS", async ({ page, context }) => {
    // 1. Setup secure test bypass
    await context.setExtraHTTPHeaders({
      'x-test-bypass': 'OMH_TEST_SECRET_2026'
    });

    // 2. Go directly to Admin Orders
    await page.goto("/admin/orders");
    await expect(page.getByText(/Order Management/i)).toBeVisible();
    
    // 3. Check Analytics Charts
    await expect(page.getByText(/Revenue Trends/i)).toBeVisible();
    await expect(page.getByText(/Order Status/i)).toBeVisible();
    await expect(page.getByText(/Total Revenue/i)).toBeVisible();

    // 4. Open an Order
    const firstOrderRow = page.locator('tr.group').first();
    await firstOrderRow.locator('a').click();

    // 5. Verify Order Details
    await expect(page.getByText(/Order #/i)).toBeVisible();
    await expect(page.getByText(/Customer Details/i)).toBeVisible();
    
    // 6. Update Status
    const processingBtn = page.getByRole('button', { name: /^processing$/i });
    if (await processingBtn.isVisible()) {
      await processingBtn.click();
      await expect(page.getByText(/Order status updated/i)).toBeVisible();
    }

    // 7. Check Logistics Tools
    await expect(page.getByRole('button', { name: /Print Shipping Label/i })).toBeVisible();
    await expect(page.getByText(/Shipping Label/i)).toBeVisible();
  });
});
