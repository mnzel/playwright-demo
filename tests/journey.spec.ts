import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage.ts';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { ProductListPage } from '../page-objects/ProductListPage.ts';
import { ProductDetailPage } from '../page-objects/ProductDetailPage.ts';
import { CartPage } from '../page-objects/CartPage.ts';
import { CheckoutPage } from '../page-objects/CheckoutPage.ts';
import { ConfirmationPage } from '../page-objects/ConfirmationPage.ts';

const PRODUCT = { slug: 'cashmere-cardigan', name: 'Cashmere Cardigan', size: 'M' };

const SHIPPING = {
  name: 'Jane Doe',
  address: '1 Test Street',
  city: 'London',
  zip: 'EC1A 1BB',
  country: 'United Kingdom',
};

const PAYMENT = {
  name: 'Jane Doe',
  number: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123',
};

test.describe('End-to-End Shopping Journey', () => {
  let basePage: BasePage;
  let loginPage: LoginPage;
  let productList: ProductListPage;
  let productDetail: ProductDetailPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    productList = new ProductListPage(page);
    productDetail = new ProductDetailPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    confirmationPage = new ConfirmationPage(page);

    await basePage.blockCookieBanner();
    await basePage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await basePage.handleCookieBanner();
  });

  test('homepage → browse categories → search → sort → product detail → cart → promo → checkout → confirm', async ({ page }) => {

    // ── 1. Homepage ──────────────────────────────────────────────────────────
    await expect(page).toHaveTitle(/Northwind Goods/);
    await expect(basePage.logo).toBeVisible();
    await expect(page.getByTestId('free-shipping-banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Shop by category' })).toBeVisible();

    // ── 2. Category navigation ───────────────────────────────────────────────
    await page.getByTestId('category-tile-apparel-mens').click();
    await expect(page).toHaveURL(/category=apparel-mens/);
    await expect(page.getByRole('heading', { name: "Men's Apparel" })).toBeVisible();

    // ── 3. Search ────────────────────────────────────────────────────────────
    // Navigate directly — avoids inheriting any category filter from the previous step
    await page.goto('/products');
    await expect(page).toHaveURL('/products');

    await productList.search('Cashmere Cardigan');
    // Wait for a matching product card to appear — more reliable than parsing count text
    await expect(page.getByTestId('product-card-cashmere-cardigan')).toBeVisible({ timeout: 5000 });
    const countText = await productList.resultCount.innerText();
    expect(parseInt(countText.split(' ')[0]!)).toBeGreaterThan(0);

    // ── 4. Sort by price ascending ───────────────────────────────────────────
    // Clear search first so we have enough products to validate ordering
    await productList.searchInput.clear();
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="result-count"]');
      return el && parseInt(el.textContent ?? '0') > 4;
    }, { timeout: 3000 }).catch(() => {});

    await productList.sortBy('price-asc');
    await expect(page.locator('[data-testid^="product-card-"]').first()).toBeVisible();

    const prices: number[] = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-testid^="product-card-"]')).map(card => {
        const match = (card as HTMLElement).innerText.match(/\$(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]!) : 0;
      })
    );
    expect(prices.length).toBeGreaterThan(1);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]!);
    }

    // ── 5. Product detail ────────────────────────────────────────────────────
    // Navigate directly by URL — more reliable than clicking through a sorted list
    await page.goto(`/products/${PRODUCT.slug}`);
    await expect(page).toHaveURL(`/products/${PRODUCT.slug}`);
    await expect(page.getByTestId('product-name')).toContainText(PRODUCT.name);
    await expect(page.getByTestId('product-price').first()).toBeVisible();
    await expect(page.getByTestId('product-description')).toBeVisible();

    // Stock badge has an async check — wait for it to resolve
    await expect(productDetail.stockStatus).toBeVisible({ timeout: 3000 });
    await expect(productDetail.stockStatus).toContainText('In stock');

    // Size selector
    for (const size of ['XS', 'S', 'M', 'L']) {
      await expect(page.getByTestId(`size-option-${size}`)).toBeVisible();
    }

    // ── 6. Add to cart ───────────────────────────────────────────────────────
    await productDetail.selectSize(PRODUCT.size);
    await productDetail.addToCart();
    await expect(basePage.cartBadge).toHaveText('1');

    // ── 7. Cart review ───────────────────────────────────────────────────────
    await basePage.goToCart();
    await expect(page).toHaveURL('/cart');

    const lineItem = await cartPage.getLineItem(PRODUCT.slug);
    await expect(lineItem).toBeVisible();
    await expect(page.getByTestId('summary-subtotal')).toBeVisible();
    // Cashmere Cardigan is $165 — above the $50 free-shipping threshold
    await expect(page.getByTestId('free-shipping-unlocked')).toBeVisible();

    // ── 8. Promo code ────────────────────────────────────────────────────────
    const subtotalText = await page.getByTestId('summary-subtotal').innerText();
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));

    await page.getByTestId('promo-input').fill('WELCOME10');
    await page.getByTestId('promo-apply').click();
    await expect(page.getByTestId('promo-applied')).toBeVisible();
    await expect(page.getByTestId('promo-applied')).toContainText('WELCOME10');

    // Read only the last span to avoid "10" in the code name corrupting the parse
    const discountText = await page.getByTestId('summary-discount').locator('span').last().innerText();
    const discount = parseFloat(discountText.replace(/[^0-9.]/g, ''));
    expect(discount).toBeCloseTo(subtotal * 0.1, 1);

    // ── 9. Checkout requires auth — log in first ─────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/login/);

    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page).toHaveURL('/checkout');

    // ── 10. Fill shipping + payment, place order ──────────────────────────────
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.fillPayment(PAYMENT);
    await checkoutPage.placeOrder();

    // ── 11. Order confirmation ────────────────────────────────────────────────
    await expect(page).toHaveURL(/\/checkout\/confirmation/);
    await expect(confirmationPage.orderId).toBeVisible();
    await expect(await confirmationPage.getOrderItem(PRODUCT.slug)).toBeVisible();
    await expect(confirmationPage.total).not.toBeEmpty();
  });
});
