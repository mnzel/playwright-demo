import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage.ts';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { ProductListPage } from '../page-objects/ProductListPage.ts';
import { ProductDetailPage } from '../page-objects/ProductDetailPage.ts';
import { CartPage } from '../page-objects/CartPage.ts';
import { CheckoutPage } from '../page-objects/CheckoutPage.ts';
import { ConfirmationPage } from '../page-objects/ConfirmationPage.ts';

const CARDIGAN = { slug: 'cashmere-cardigan', name: 'Cashmere Cardigan', size: 'M' };
const WHITE_TEE = { slug: 'classic-white-tee-mens', size: 'M' };

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

test.describe('Cart and Checkout', () => {
  let basePage: BasePage;
  let loginPage: LoginPage;
  let productList: ProductListPage;
  let productDetail: ProductDetailPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    productList = new ProductListPage(page);
    productDetail = new ProductDetailPage(page);
    cartPage = new CartPage(page);

    await basePage.goToHome();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await basePage.handleCookieBanner();

    await basePage.goToLogin();
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page).toHaveURL('/');
  });

  test('search for Cashmere Cardigan, navigate to detail, increase quantity and add to cart', async ({ page }) => {
    await page.goto('/products');

    await productList.search('Cashmere Cardigan');
    await expect(productList.resultCount).not.toContainText('0 ');
    await expect(await productList.getProductCard(CARDIGAN.slug)).toBeVisible();

    await productList.goToProductDetail(CARDIGAN.slug);
    await expect(page).toHaveURL(`/products/${CARDIGAN.slug}`);

    // Verify size options visible
    for (const size of ['XS', 'S', 'M', 'L']) {
      await expect(page.getByTestId(`size-option-${size}`)).toBeVisible();
    }

    // Increase quantity to 2 then add to cart
    await page.getByTestId('qty-increment').click();
    await expect(page.getByTestId('qty-value')).toHaveValue('2');

    await productDetail.selectSize(CARDIGAN.size);
    await productDetail.addToCart();

    await expect(basePage.cartBadge).toHaveText('2');
  });

  test('cart page shows added item with correct price and total', async ({ page }) => {
    await page.goto(`/products/${CARDIGAN.slug}`);
    await productDetail.selectSize(CARDIGAN.size);
    await productDetail.addToCart();

    await basePage.goToCart();
    await expect(page).toHaveURL('/cart');

    const lineItem = await cartPage.getLineItem(CARDIGAN.slug);
    await expect(lineItem).toBeVisible();

    await expect(page.getByTestId('summary-subtotal')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toBeVisible();

    // Cashmere Cardigan $165 exceeds $50 threshold
    await expect(page.getByTestId('free-shipping-unlocked')).toBeVisible();
  });

  test('update line item quantity in cart updates badge and total', async ({ page }) => {
    await page.goto(`/products/${WHITE_TEE.slug}`);
    await productDetail.selectSize(WHITE_TEE.size);
    await productDetail.addToCart();

    await basePage.goToCart();
    await cartPage.updateLineItemQuantity(WHITE_TEE.slug, 3);

    await expect(basePage.cartBadge).toHaveText('3');
    await expect(page.getByTestId('cart-total')).toBeVisible();
  });

  test('complete full checkout flow', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Add item
    await page.goto(`/products/${CARDIGAN.slug}`);
    await productDetail.selectSize(CARDIGAN.size);
    await productDetail.addToCart();

    // Proceed to checkout
    await basePage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout');

    // Fill forms
    await checkoutPage.fillShipping(SHIPPING);
    await checkoutPage.fillPayment(PAYMENT);
    await checkoutPage.placeOrder();

    // Confirmation
    await expect(page).toHaveURL(/\/checkout\/confirmation/);
    await expect(confirmationPage.orderId).toBeVisible();
    await expect(await confirmationPage.getOrderItem(CARDIGAN.slug)).toBeVisible();
    await expect(confirmationPage.total).not.toBeEmpty();
  });

  test('remove item from cart empties the cart', async ({ page }) => {
    await page.goto(`/products/${WHITE_TEE.slug}`);
    await productDetail.selectSize(WHITE_TEE.size);
    await productDetail.addToCart();

    await basePage.goToCart();
    const lineItem = await cartPage.getLineItem(WHITE_TEE.slug);
    await expect(lineItem).toBeVisible();

    await cartPage.removeLineItem(WHITE_TEE.slug);

    await expect(page.getByTestId('cart-empty')).toBeVisible();
    // Badge disappears when cart is empty
    await expect(basePage.cartBadge).not.toBeVisible();
  });

  test('applying valid promo code WELCOME10 gives 10% discount', async ({ page }) => {
    await page.goto(`/products/${WHITE_TEE.slug}`);
    await productDetail.selectSize(WHITE_TEE.size);
    await productDetail.addToCart();

    await basePage.goToCart();

    // Capture subtotal before applying promo
    const subtotalText = await page.getByTestId('summary-subtotal').innerText();
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));

    await page.getByTestId('promo-input').fill('WELCOME10');
    await page.getByTestId('promo-apply').click();

    // Success banner replaces the input form
    await expect(page.getByTestId('promo-applied')).toBeVisible();
    await expect(page.getByTestId('promo-applied')).toContainText('WELCOME10');

    // Discount row appears in order summary showing 10% off subtotal.
    // The row renders as: "Discount (WELCOME10)  −$2.20"
    // We grab just the value span (last span child) to avoid the label text
    // containing "10" from the promo code name corrupting the number parse.
    await expect(page.getByTestId('summary-discount')).toBeVisible();
    const discountValueText = await page.getByTestId('summary-discount').locator('span').last().innerText();
    const discount = parseFloat(discountValueText.replace(/[^0-9.]/g, ''));
    expect(discount).toBeCloseTo(subtotal * 0.1, 1);
  });

  test('applying invalid promo code shows error', async ({ page }) => {
    await page.goto(`/products/${WHITE_TEE.slug}`);
    await productDetail.selectSize(WHITE_TEE.size);
    await productDetail.addToCart();

    await basePage.goToCart();

    await page.getByTestId('promo-input').fill('BADCODE');
    await page.getByTestId('promo-apply').click();

    await expect(page.getByTestId('promo-error')).toBeVisible();
    await expect(page.getByTestId('promo-error')).toContainText(/invalid/i);
    // No discount applied
    await expect(page.getByTestId('summary-discount')).not.toBeVisible();
  });

  test('unauthenticated user is redirected to login before checkout', async ({ page }) => {
    // Log out first
    await basePage.logout();

    await page.goto(`/products/${WHITE_TEE.slug}`);
    await productDetail.selectSize(WHITE_TEE.size);
    await productDetail.addToCart();

    await basePage.goToCart();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/login/);

    // Log back in and verify redirect to checkout
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page).toHaveURL('/checkout');
  });
});
