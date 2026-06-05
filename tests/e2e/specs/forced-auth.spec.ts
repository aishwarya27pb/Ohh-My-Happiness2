import { test, expect } from "@playwright/test";
import { StorePage } from "../pages/StorePage";

test.describe("Forced Authentication Flow", () => {
  test("Guest user is redirected to signup when adding to cart", async ({ page }) => {
    const storePage = new StorePage(page);
    
    // 1. Navigate to a product detail page
    // Using a known product slug
    const productSlug = "sunshine-delight-hamper";
    await page.goto(`/store/${productSlug}`);
    
    // 2. Wait for the page to load
    await expect(page.locator("h1")).toContainText("Sunshine Delight Hamper");
    
    // 3. Click "Add to Cart"
    const addToCartBtn = page.locator("text=Add to Cart");
    await addToCartBtn.click();
    
    // 4. Verify redirection to signup with 'next' parameter
    await expect(page).toHaveURL(new RegExp(`/auth/signup\\?next=%2Fstore%2F${productSlug}`));
    
    // 5. Verify signup page heading
    await expect(page.locator("h2")).toContainText("Create account");
  });

  test("Guest user is redirected to signup when starting BYOB", async ({ page }) => {
    // 1. Navigate to BYOB page
    await page.goto("/byob");
    
    // 2. Complete steps 1-3
    // Step 1: Choose Box
    await page.locator("text=Luxury Wooden Box").click();
    await page.locator("text=Continue").click();
    
    // Step 2: Fill Items (select first available item)
    await page.locator(".group").first().click();
    await page.locator("text=Continue").click();
    
    // Step 3: Add Card
    await page.locator("text=Birthday").click();
    await page.locator('textarea[placeholder="Type your heartfelt message here..."]').fill("Happy Birthday!");
    await page.locator("text=Continue").click();
    
    // Step 4: Preview and Click "Add to Cart"
    await expect(page.locator("text=Hamper Ready!")).toBeVisible();
    await page.locator("text=Add to Cart").click();
    
    // 3. Verify redirection to signup with 'next' parameter
    await expect(page).toHaveURL(/\/auth\/signup\?next=%2Fbyob/);
  });
});
