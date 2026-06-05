import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";
import { LoginPage } from "../pages/LoginPage";

test.describe("Full Guest to Member Journey", () => {
  const timestamp = Date.now();
  const dummyUser = {
    firstName: "Test",
    lastName: "User",
    email: `testuser_${timestamp}@example.com`,
    phone: "9876543210",
    password: "TestPassword123!",
  };

  test("New user can sign up and be redirected back to their product", async ({ page }) => {
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);
    const productSlug = "sunshine-delight-hamper";
    
    // 1. Start as a guest at a product page
    await page.goto(`/store/${productSlug}`);
    await expect(page.locator("h1")).toContainText("Sunshine Delight Hamper");
    
    // 2. Attempt to Add to Cart and be redirected
    await page.locator("text=Add to Cart").click();
    await expect(page).toHaveURL(new RegExp(`/auth/signup\\?next=%2Fstore%2F${productSlug}`));
    
    // 3. --- Test Helper: Create and Confirm user via Admin API ---
    // (Bypasses 'email rate limit exceeded' for testing)
    await page.evaluate(async (userData) => {
      const res = await fetch("/api/test/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create test user");
      }
    }, { ...dummyUser, password: dummyUser.password });
    // ------------------------------------------------------------

    // 4. Go directly to login with 'next' preserved
    await page.goto(`/auth/login?next=%2Fstore%2F${productSlug}`);
    
    // 5. Verify we are on login with 'next' preserved
    await expect(page).toHaveURL(new RegExp(`/auth/login\\?next=%2Fstore%2F${productSlug}`));
    
    // 6. Log in with the new credentials
    await loginPage.login(dummyUser.email, dummyUser.password);
    
    // 7. Verify we are redirected BACK to the product page
    await expect(page).toHaveURL(new RegExp(`/store/${productSlug}`));
    
    // 8. Verify we can now add to cart (should see 'Added!' or success)
    await page.locator("text=Add to Cart").click();
    await expect(page.locator("text=Added!")).toBeVisible();
  });
});
