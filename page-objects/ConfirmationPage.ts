import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class ConfirmationPage extends BasePage {
  readonly orderId: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.orderId = page.getByTestId('confirmation-order-id');
    this.total = page.getByTestId('confirmation-total');
  }

  async getOrderItem(slug: string) {
    return this.page.getByTestId(`confirmation-item-${slug}`);
  }
}
