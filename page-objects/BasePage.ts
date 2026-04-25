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
    // The Secure Privacy banner often takes a moment to inject into the DOM
    const banner = this.page.locator('#sp-cookie-banner, .sp-cookie-banner');
    const acceptBtn = this.page.locator('#sp-cookie-allow, .sp-cookie-allow, button:has-text("Accept All")');
    
    try {
      // We use a short timeout as it might not appear if already accepted
      await acceptBtn.waitFor({ state: 'visible', timeout: 5000 });
      await acceptBtn.click();
      await banner.waitFor({ state: 'hidden' });
    } catch (e) {
      // Banner might not have appeared, which is fine
    }
  }
}
