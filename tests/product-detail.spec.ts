import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { BasePage } from '../page-objects/BasePage.ts';
import { ProductListPage } from '../page-objects/ProductListPage.ts';
import { ProductDetailPage } from '../page-objects/ProductDetailPage.ts';

interface ProductFixture {
  name: string;
  slug: string;
  sizes: string[];
  inStock: boolean;
}

const PRODUCTS: ProductFixture[] = [
  { name: 'Cashmere Cardigan', slug: 'cashmere-cardigan', sizes: ['XS', 'S', 'M', 'L'], inStock: true },
];

test.describe('Product Detail', () => {
  let basePage: BasePage;
  let productDetail: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    productDetail = new ProductDetailPage(page);
    const loginPage = new LoginPage(page);

    await basePage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await basePage.handleCookieBanner();

    await basePage.goToLogin();
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page).toHaveURL('/');
  });

  for (const product of PRODUCTS) {
    test(`${product.name}: shows correct details and stock status`, async ({ page }) => {
      await page.goto(`/products/${product.slug}`);
      await expect(page).toHaveURL(`/products/${product.slug}`);

      const detail = page.getByTestId('page-product-detail');
      await expect(detail.getByTestId('product-name')).toContainText(product.name);
      await expect(detail.getByTestId('product-price')).toBeVisible();
      await expect(detail.getByTestId('product-description')).toBeVisible();

      // Stock badge appears after a ~300 ms async check
      const stockBadge = page.getByTestId('page-product-detail').getByTestId('stock-badge').first();
      await expect(stockBadge).toBeVisible({ timeout: 2000 });
      await expect(stockBadge).toContainText(product.inStock ? 'In stock' : 'Out of stock');
    });

    test(`${product.name}: size selector shows all sizes and tracks selection`, async ({ page }) => {
      await page.goto(`/products/${product.slug}`);

      await expect(page.getByTestId('size-selector')).toBeVisible();

      for (const size of product.sizes) {
        await expect(page.getByTestId(`size-option-${size}`)).toBeVisible();
      }

      // Select first size and verify selection state
      const firstSize = product.sizes[0]!;
      const secondSize = product.sizes[1]!;

      await productDetail.selectSize(firstSize);
      await expect(page.getByTestId(`size-option-${firstSize}`)).toHaveAttribute('data-selected', 'true');

      // Switch to second size
      await productDetail.selectSize(secondSize);
      await expect(page.getByTestId(`size-option-${secondSize}`)).toHaveAttribute('data-selected', 'true');
      await expect(page.getByTestId(`size-option-${firstSize}`)).toHaveAttribute('data-selected', 'false');
    });
  }

  test('add to cart blocked when no size selected', async ({ page }) => {
    await page.goto('/products/cashmere-cardigan');

    // Attempt to add without selecting a size
    await productDetail.addToCart();

    await expect(page.getByText('Please select a size', { exact: false })).toBeVisible();
    await expect(basePage.cartBadge).not.toBeVisible();
  });

  test('quantity stepper increments and cart badge reflects total', async ({ page }) => {
    await page.goto('/products/classic-white-tee-mens');
    await productDetail.selectSize('M');

    // Increment quantity twice (1 → 3)
    await page.getByTestId('qty-increment').click();
    await page.getByTestId('qty-increment').click();
    await expect(page.getByTestId('qty-value')).toHaveValue('3');

    await productDetail.addToCart();
    await expect(basePage.cartBadge).toHaveText('3');
  });

  test('can reach product detail via search on /products', async ({ page }) => {
    const productList = new ProductListPage(page);
    await page.goto('/products');

    await productList.search('Cashmere Cardigan');
    await productList.goToProductDetail('cashmere-cardigan');

    await expect(page).toHaveURL('/products/cashmere-cardigan');
    await expect(page.getByTestId('product-name')).toContainText('Cashmere Cardigan');
  });
});
