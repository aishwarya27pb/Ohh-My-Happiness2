import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignupPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitBtn: Locator;
  readonly successMsg: Locator;

  constructor(page: any) {
    super(page);
    this.firstNameInput = page.locator('input[placeholder="Priya"]');
    this.lastNameInput = page.locator('input[placeholder="Sharma"]');
    this.emailInput = page.locator('input[type="email"]');
    this.phoneInput = page.locator('input[type="tel"]');
    this.passwordInput = page.locator('input[placeholder="Min. 6 characters"]');
    this.confirmPasswordInput = page.locator('input[placeholder="Same as above"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.successMsg = page.locator("text=You're in!");
  }

  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
    await this.submitBtn.click();
  }
}
