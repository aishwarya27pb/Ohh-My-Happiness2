import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly checkoutBtn: Locator;
  readonly cartItems: Locator;

  constructor(page: any) {
    super(page);
    this.checkoutBtn = page.locator("text=Proceed to Checkout");
    this.cartItems = page.locator(".bg-white.rounded-2xl.p-4"); // Assuming this is the item container
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async removeItem(productName: string) {
    const item = this.page.locator(".flex.gap-4", { hasText: productName });
    await item.locator('button[aria-label="Remove item"]').click();
  }
}
