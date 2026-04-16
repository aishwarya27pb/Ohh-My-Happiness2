import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly storeLink: Locator;
  readonly cartBtn: Locator;
  readonly signInLink: Locator;
  readonly userMenuBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a[href="/"]').first();
    this.storeLink = page.locator('nav a[href="/store"]');
    this.cartBtn = page.locator('button[aria-label="Cart"]');
    this.signInLink = page.locator('a[aria-label="Sign in"]');
    this.userMenuBtn = page.locator('button[aria-label="Account"]');
  }

  async goto(path: string = "/") {
    await this.page.goto(path);
  }

  async navigateToStore() {
    await this.storeLink.click();
    await expect(this.page).toHaveURL(/\/store/);
  }

  async openCart() {
    await this.cartBtn.click();
    await expect(this.page.locator("text=Your Shopping Cart")).toBeVisible();
  }
}
