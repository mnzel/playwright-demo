import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage.ts';

test.describe('Smoke Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await basePage.handleCookieBanner();
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Northwind Goods/);
    await expect(basePage.logo).toBeVisible();
  });

  test('navigation to shop works', async () => {
    await basePage.goToShop();
    await expect(basePage.page).toHaveURL(/\/products/);
    await expect(basePage.page.getByTestId('page-product-list')).toBeVisible();
  });
});
