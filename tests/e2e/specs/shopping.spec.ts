import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { StorePage } from "../pages/StorePage";
import { CartPage } from "../pages/CartPage";

test.describe("Shopping Flow", () => {
  test("Guest can browse and add items to cart", async ({ page }) => {
    const storePage = new StorePage(page);
    
    // 1. Navigate to store
    await storePage.goto("/store");
    
    // 2. Search for a product
    const productName = "Sunshine Delight Hamper";
    await storePage.searchProduct(productName);
    
    // 3. Add to cart
    await storePage.addProductToCart(productName);
    
    // 4. Verify mini-cart update
    await expect(page.locator("text=1 item")).toBeVisible();
    await expect(page.locator(`text=${productName}`)).toBeVisible();
  });
});
