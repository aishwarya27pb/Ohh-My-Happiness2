import { test, expect } from "@playwright/test";

test.describe("Security & Access Control", () => {
  test("Guest should be redirected from /admin to /admin/login", async ({ page }) => {
    // ── RBAC Check ──────────────────────────────────────────────────────────
    await page.goto("/admin");
    console.log("Current URL after /admin:", page.url());
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });

  test("Guest should be redirected from /account to login", async ({ page }) => {
    // ── Authentication Check ────────────────────────────────────────────────
    await page.goto("/account");
    console.log("Current URL after /account:", page.url());
    // Next.js/Browser might decode %2F back to /
    await expect(page).toHaveURL(/\/auth\/login\?next=(\/|%2F)account/, { timeout: 10000 });
  });

  test("Horizontal Privilege Escalation (BOLA) Check on Order Confirmation", async ({ page }) => {
    // ── IDOR/BOLA Check ─────────────────────────────────────────────────────
    // Try to access a specific order number directly
    const targetOrder = "OMH-TEST-BOLA-123";
    await page.goto(`/order-confirmation?order=${targetOrder}`);
    
    // Check if the page displays the order number without authentication
    await expect(page.locator(`text=#${targetOrder}`)).toBeVisible();
    // [FINDING] This confirms the confirmation page is public. 
    // While it doesn't leak personal data yet, it identifies the order ID scope.
  });
});
