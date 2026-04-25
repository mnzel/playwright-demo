import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class ProductDetailPage extends BasePage {
  readonly addToCartBtn: Locator;
  readonly stockStatus: Locator;

  constructor(page: Page) {
    super(page);
    // Use the first stock-badge inside the product detail page, which is the main one.
    // This avoids strictly matching against the badges in related products.
    this.addToCartBtn = page.getByTestId('add-to-cart');
    this.stockStatus = page.getByTestId('page-product-detail').getByTestId('stock-badge').first();
  }

  async selectSize(size: string) {
    await this.page.getByTestId(`size-option-${size}`).click();
  }

  async setQuantity(qty: number) {
    await this.page.getByTestId('qty-value').fill(qty.toString());
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }
}
