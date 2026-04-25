import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly accountMenu: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('logo');
    this.navHome = page.getByTestId('nav-home');
    this.navProducts = page.getByTestId('nav-products');
    this.accountMenu = page.getByTestId('account-menu');
    this.cartButton = page.getByTestId('cart-button');
    this.cartBadge = page.getByTestId('cart-badge');
  }

  async goToHome() {
    await this.page.goto('/');
  }

  async goToShop() {
    await this.navProducts.click();
  }

  async openAccountMenu() {
    await this.accountMenu.click();
  }

  async goToLogin() {
    await this.openAccountMenu();
    await this.page.getByTestId('account-menu-login').click();
  }

  async goToRegister() {
    await this.openAccountMenu();
    await this.page.getByTestId('account-menu-register').click();
  }

  async logout() {
    await this.openAccountMenu();
    await this.page.getByTestId('account-menu-logout').click();
  }

  async goToCart() {
    await this.page.goto('/cart');
  }

  async handleCookieBanner() {
    // The Secure Privacy banner renders inside an iframe — use frameLocator to reach it.
    // Uses a short timeout; silently skips if banner was already dismissed.
    try {
      const frame = this.page.frameLocator('iframe[title="Cookie Banner"]');
      await frame.getByRole('button', { name: 'Accept all' }).click({ timeout: 5000 });
    } catch (e) {
      // Banner not present or already accepted — safe to continue
    }
  }
}
