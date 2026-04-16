import { test, expect } from "@playwright/test";
import { LeadsPage } from "../pages/LeadsPage";

test.describe("Leads Flow", () => {
  test("User can submit a custom order inquiry", async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    
    // 1. Navigate to custom orders
    await leadsPage.goto("/custom-orders");
    
    // 2. Fill the form
    await leadsPage.fillLeadForm({
      name: "Test Lead User",
      email: "lead@test.com",
      phone: "9123456789",
      qty: "50",
      reqs: "Need 50 custom hampers for a conference."
    });
    
    // 3. Submit
    await leadsPage.submit();
    
    // 4. Verify success UI
    await expect(page.locator("text=Thank you, Test Lead User!")).toBeVisible();
  });
});
