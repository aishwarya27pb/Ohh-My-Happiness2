import { test, expect } from "@playwright/test";

test.describe("Security & Route Protection", () => {
  test.beforeEach(async ({ context }) => {
    // Ensure we start each test in a clean, unauthenticated state
    await context.clearCookies();
  });

  const protectedRoutes = [
    "/admin",
    "/admin/orders",
    "/admin/products",
    "/admin/customers"
  ];

  for (const route of protectedRoutes) {
    test(`should redirect unauthenticated user from ${route} to login`, async ({ page }) => {
      // 1. Attempt access
      await page.goto(route);
      
      // 2. Expect redirect to login (Supabase Middleware or Next.js layout guard)
      await expect(page).toHaveURL(/\/admin\/login/);
      
      // 3. Ensure no admin content is rendered
      const adminHeading = page.getByText(/Order Management/i);
      await expect(adminHeading).not.toBeVisible();
    });
  }

  test("should not allow access to admin API actions without session", async ({ request }) => {
    // Note: This is an API-level security test
    // We try to call an admin action directly
    const response = await request.post("/api/debug-products"); // Example protected endpoint
    
    // Should be unauthorized or redirected
    expect([401, 307, 303, 403]).toContain(response.status());
  });
});
