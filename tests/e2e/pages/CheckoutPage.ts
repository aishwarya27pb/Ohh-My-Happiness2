import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly pincodeInput: Locator;
  readonly stateSelect: Locator;
  readonly continueBtn: Locator;
  readonly placeOrderBtn: Locator;

  constructor(page: any) {
    super(page);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressInput = page.locator('input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.pincodeInput = page.locator('input[name="pincode"]');
    this.stateSelect = page.locator('select[name="state"]');
    this.continueBtn = page.locator("text=Continue to Payment");
    this.placeOrderBtn = page.locator("text=Place Order");
  }

  async fillShippingDetails(details: {
    first: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  }) {
    await this.firstNameInput.fill(details.first);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.pincodeInput.fill(details.pincode);
    await this.stateSelect.selectOption(details.state);
    await this.continueBtn.click();
  }

  async completeOrder() {
    await this.page.locator("text=Review Order").click();
    await this.placeOrderBtn.click();
    await expect(this.page).toHaveURL(/\/order-confirmation/);
  }
}
