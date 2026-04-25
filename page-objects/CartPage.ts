import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class CartPage extends BasePage {
  readonly checkoutBtn: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutBtn = page.getByTestId('cart-checkout');
    this.emptyCartMessage = page.getByTestId('cart-empty');
  }

  async getLineItem(slug: string) {
    return this.page.getByTestId('cart-line-list').getByTestId(`cart-line-${slug}`);
  }

  async updateLineItemQuantity(slug: string, qty: number) {
    const item = await this.getLineItem(slug);
    await item.getByTestId(`cart-line-${slug}-qty-value`).fill(qty.toString());
  }

  async removeLineItem(slug: string) {
    const item = await this.getLineItem(slug);
    await item.getByTestId(`cart-line-remove-${slug}`).click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}
