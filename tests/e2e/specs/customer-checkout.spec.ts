import { test, expect } from "@playwright/test";

test.describe("Customer Checkout Flow", () => {
  test("should complete a purchase using Cash on Delivery (COD)", async ({ page }) => {
    // 1. Visit Store
    await page.goto("/store");
    
    // 2. Select a product
    const firstProduct = page.locator('a[href^="/store/"]').first();
    await firstProduct.click();
    
    // 3. Add to Cart (using first available product)
    const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addToCartBtn.click();
    
    // 4. Go to Cart
    await page.goto("/cart");
    
    // 5. Proceed to Checkout
    const checkoutBtn = page.getByRole('link', { name: /Checkout/i });
    await checkoutBtn.click();
    
    // 6. Step 0: Fill Shipping Details
    await page.fill('input[name="firstName"]', "Automation");
    await page.fill('input[name="lastName"]', "Tester");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="phone"]', "9876543210");
    await page.fill('input[name="address"]', "123 Test Street");
    await page.fill('input[name="city"]', "Mumbai");
    await page.selectOption('select[name="state"]', "Maharashtra");
    await page.fill('input[name="pincode"]', "400001");

    // Click "Continue to Payment"
    await page.getByRole('button', { name: /Continue to Payment/i }).click();

    // 7. Step 1: Select COD Payment
    const codOption = page.getByText(/Cash on Delivery/i);
    await codOption.click();
    
    // Click "Review Order"
    await page.getByRole('button', { name: /Review Order/i }).click();

    // 8. Step 2: Place Order
    const placeOrderBtn = page.getByRole('button', { name: /Place Order/i });
    await placeOrderBtn.click();

    // 9. Verify Success
    await expect(page).toHaveURL(/order-confirmation/);
    await expect(page.getByText(/Order Successful/i)).toBeVisible();
  });
});
