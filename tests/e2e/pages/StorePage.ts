import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class StorePage extends BasePage {
  readonly searchInput: Locator;
  readonly productCards: Locator;
  readonly addToCartBtn: (productName: string) => Locator;

  constructor(page: any) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search gifts..."]');
    this.productCards = page.locator(".group");
    this.addToCartBtn = (productName: string) =>
      this.page.locator(".group", { hasText: productName }).locator("text=Add to Cart");
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.page.waitForTimeout(500); // Wait for filter
  }

  async addProductToCart(productName: string) {
    const card = this.page.locator(".group", { hasText: productName });
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    const btn = this.addToCartBtn(productName);
    await btn.waitFor({ state: "visible" });
    await btn.click({ force: true });
  }
}
