import { test, expect } from '@playwright/test';
import { ProductListPage } from '../page-objects/ProductListPage.ts';
import { CartPage } from '../page-objects/CartPage.ts';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { CheckoutPage } from '../page-objects/CheckoutPage.ts';
import { ConfirmationPage } from '../page-objects/ConfirmationPage.ts';
import { ProductDetailPage } from '../page-objects/ProductDetailPage.ts';

test.describe('Checkout Flow', () => {
  let productList: ProductListPage;
  let productDetail: ProductDetailPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    productList = new ProductListPage(page);
    productDetail = new ProductDetailPage(page);
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    confirmationPage = new ConfirmationPage(page);

    await productList.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await productList.handleCookieBanner();
  });

  test('should complete a full checkout journey', async () => {
    const page = productList.page;

    // 1. Browsing & adding item — navigate directly to avoid any banner overlap on /products
    const slug = 'classic-white-tee-mens';
    await page.goto(`/products/${slug}`);
    await productDetail.selectSize('M');
    await productDetail.addToCart();

    // 2. Cart review
    await productList.goToCart();
    await cartPage.proceedToCheckout();

    // 3. Authentication (must be logged in to checkout)
    await expect(page).toHaveURL(/\/login/);
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);

    // After login, it should redirect to checkout
    await expect(page).toHaveURL(/\/checkout/);

    // 4. Fill shipping
    await checkoutPage.fillShipping({
      name: 'John Doe',
      address: '123 Test Lane',
      city: 'Testville',
      zip: '12345',
      country: 'United Kingdom'
    });

    // 5. Fill payment
    await checkoutPage.fillPayment({
      name: 'John Doe',
      number: '4242 4242 4242 4242',
      expiry: '12/30',
      cvc: '123'
    });

    // 6. Place order
    await checkoutPage.placeOrder();

    // 7. Confirmation
    await expect(page).toHaveURL(/\/checkout\/confirmation/);
    await expect(confirmationPage.orderId).toBeVisible();
    await expect(await confirmationPage.getOrderItem(slug)).toBeVisible();
    await expect(confirmationPage.total).not.toBeEmpty();
  });
});
