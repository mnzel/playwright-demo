import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByTestId('register-name');
    this.emailInput = page.getByTestId('register-email');
    this.passwordInput = page.getByTestId('register-password');
    this.confirmInput = page.getByTestId('register-confirm');
    this.submitBtn = page.getByTestId('register-submit');
    this.errorMessage = page.getByTestId('register-error');
  }

  async goToRegisterPage() {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string, confirmPassword?: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmInput.fill(confirmPassword ?? password);
    await this.submitBtn.click();
  }
}
