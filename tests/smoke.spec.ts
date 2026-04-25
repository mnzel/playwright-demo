import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage.ts';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goToHome();
    await basePage.handleCookieBanner();
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('homepage loads correctly', async ({ page }) => {
    const basePage = new BasePage(page);
    await expect(page).toHaveTitle(/Northwind Goods/);
    await expect(basePage.logo).toBeVisible();
  });

  test('navigation to shop works', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goToShop();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByTestId('page-product-list')).toBeVisible();
  });
});
