import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LeadsPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly quantityInput: Locator;
  readonly requirementsInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: any) {
    super(page);
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.quantityInput = page.locator('input[name="quantity"]');
    this.requirementsInput = page.locator('textarea[name="requirements"]');
    this.submitBtn = page.locator('button[type="submit"]');
  }

  async fillLeadForm(details: {
    name: string;
    email: string;
    phone: string;
    qty: string;
    reqs: string;
  }) {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.quantityInput.fill(details.qty);
    await this.requirementsInput.fill(details.reqs);
  }

  async submit() {
    await this.submitBtn.click();
    await expect(this.page.locator("text=Request Submitted!")).toBeVisible();
  }
}
