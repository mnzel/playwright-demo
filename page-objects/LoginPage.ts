import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitBtn = page.getByTestId('login-submit');
    this.errorMessage = page.getByTestId('login-error');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitBtn.click();
  }
}
