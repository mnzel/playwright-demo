import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage.ts';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { ProductListPage } from '../page-objects/ProductListPage.ts';

const SEARCH_TERMS = [
  'Classic White Tee',
  'Cashmere Cardigan',
  'Navy Oxford Shirt',
  'Merino Wool Sweater',
] as const;

const CATEGORIES = [
  { testid: 'category-tile-apparel-mens', param: 'apparel-mens', heading: "Men's Apparel" },
  { testid: 'category-tile-apparel-womens', param: 'apparel-womens', heading: "Women's Apparel" },
  { testid: 'category-tile-accessories', param: 'accessories', heading: 'Accessories' },
  { testid: 'category-tile-home', param: 'home', heading: 'Home & Living' },
] as const;

test.describe('Browsing & Discovery', () => {
  let basePage: BasePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);

    await basePage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await basePage.handleCookieBanner();

    // Log in before each test as required by spec
    await basePage.goToLogin();
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page).toHaveURL('/');
  });

  test('homepage shows free-shipping banner, categories and featured products', async ({ page }) => {
    await expect(page.getByTestId('free-shipping-banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Shop by category' })).toBeVisible();

    for (const cat of CATEGORIES) {
      await expect(page.getByTestId(cat.testid)).toBeVisible();
    }

    await expect(page.getByRole('heading', { name: 'Featured products' })).toBeVisible();
    await expect(page.getByTestId('page-home').getByRole('article').first()).toBeVisible();
  });

  for (const cat of CATEGORIES) {
    test(`category tile navigates to /products?category=${cat.param}`, async ({ page }) => {
      await page.getByTestId(cat.testid).click();
      await expect(page).toHaveURL(new RegExp(`category=${cat.param}`));
      await expect(page.getByRole('heading', { name: cat.heading })).toBeVisible();
    });
  }

  test('can navigate to /products page from shop link', async ({ page }) => {
    await basePage.goToShop();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByTestId('page-product-list')).toBeVisible();
  });

  for (const term of SEARCH_TERMS) {
    test(`search returns results for "${term}"`, async ({ page }) => {
      const productList = new ProductListPage(page);
      await basePage.goToShop();

      await productList.search(term);

      const countText = await productList.resultCount.innerText();
      const count = parseInt(countText.split(' ')[0]!);
      expect(count).toBeGreaterThan(0);

      await expect(page.getByText(term, { exact: false }).first()).toBeVisible();
    });
  }

  // Helper: reads prices from product cards in current DOM order.
  // ProductCard renders prices in a <span> inside [data-testid^="product-card-"].
  // There is no dedicated price testid on list cards, so we read the first
  // text node that looks like a currency amount within each card.
  async function getPricesInOrder(page: Parameters<Parameters<typeof test>[1]>[0]): Promise<number[]> {
    return page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-testid^="product-card-"]')).map((card) => {
        const text = (card as HTMLElement).innerText;
        const match = text.match(/\$(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]!) : 0;
      })
    );
  }

  test('sort by price ascending orders products cheapest first', async ({ page }) => {
    const productList = new ProductListPage(page);
    await basePage.goToShop();

    await expect(page.getByTestId('product-grid')).toBeVisible();
    await productList.sortBy('price-asc');

    // Wait for at least one card to be in DOM
    await expect(page.locator('[data-testid^="product-card-"]').first()).toBeVisible();

    const prices = await getPricesInOrder(page);
    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]!);
    }
  });

  test('sort by price descending orders products most expensive first', async ({ page }) => {
    const productList = new ProductListPage(page);
    await basePage.goToShop();

    await expect(page.getByTestId('product-grid')).toBeVisible();
    await productList.sortBy('price-desc');

    await expect(page.locator('[data-testid^="product-card-"]').first()).toBeVisible();

    const prices = await getPricesInOrder(page);
    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]!);
    }
  });
});
