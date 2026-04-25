import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class CheckoutPage extends BasePage {
  readonly shipName: Locator;
  readonly shipAddress1: Locator;
  readonly shipCity: Locator;
  readonly shipZip: Locator;
  readonly shipCountry: Locator;
  
  readonly payName: Locator;
  readonly payNumber: Locator;
  readonly payExpiry: Locator;
  readonly payCvc: Locator;

  readonly placeOrderBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.shipName = page.getByTestId('ship-name');
    this.shipAddress1 = page.getByTestId('ship-address1');
    this.shipCity = page.getByTestId('ship-city');
    this.shipZip = page.getByTestId('ship-zip');
    this.shipCountry = page.getByTestId('ship-country');

    this.payName = page.getByTestId('pay-name');
    this.payNumber = page.getByTestId('pay-number');
    this.payExpiry = page.getByTestId('pay-expiry');
    this.payCvc = page.getByTestId('pay-cvc');

    this.placeOrderBtn = page.getByTestId('place-order');
  }

  async fillShipping(details: { name: string; address: string; city: string; zip: string; country: string }) {
    await this.shipName.fill(details.name);
    await this.shipAddress1.fill(details.address);
    await this.shipCity.fill(details.city);
    await this.shipZip.fill(details.zip);
    await this.shipCountry.fill(details.country);
  }

  async fillPayment(details: { name: string; number: string; expiry: string; cvc: string }) {
    await this.payName.fill(details.name);
    await this.payNumber.fill(details.number);
    await this.payExpiry.fill(details.expiry);
    await this.payCvc.fill(details.cvc);
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
  }
}
