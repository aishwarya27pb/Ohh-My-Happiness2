import { test, expect } from "@playwright/test";
import { StorePage } from "../pages/StorePage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout Flow", () => {
  test("Guest can complete checkout successfully", async ({ page }) => {
    const storePage = new StorePage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // 1. Add item to cart
    await storePage.goto("/store");
    const productName = "Sunshine Delight Hamper";
    await storePage.addProductToCart(productName);
    
    // 2. Go to checkout
    await page.goto("/checkout");
    
    // 3. Fill shipping details
    await checkoutPage.fillShippingDetails({
      first: "Test",
      email: "test@example.com",
      phone: "9999999999",
      address: "123 Test Street",
      city: "Mumbai",
      pincode: "400001",
      state: "Maharashtra"
    });
    
    // 4. Complete order
    await checkoutPage.completeOrder();
    
    // 5. Verify confirmation
    await expect(page.locator("text=Thank you for your order!")).toBeVisible();
    await expect(page.locator("text=Order #OMH")).toBeVisible();
  });
});
