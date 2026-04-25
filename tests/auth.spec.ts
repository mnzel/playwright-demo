import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { BasePage } from '../page-objects/BasePage.ts';

test.describe('Authentication', () => {
  let basePage: BasePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);

    await basePage.blockCookieBanner();
    await basePage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await basePage.handleCookieBanner();
  });

  test('rejects invalid credentials then accepts valid login and logout', async ({ page }) => {
    await basePage.goToLogin();

    // --- Negative: wrong credentials ---
    await loginPage.login('nobody@nowhere.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid/i);
    await expect(page).toHaveURL('/login');

    // --- Positive: correct credentials ---
    // Fill over the existing values in the same form
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page).toHaveURL('/');
    await expect(basePage.accountMenu).toContainText(/test/i);

    // --- Logout ---
    await basePage.logout();
    await expect(basePage.accountMenu).toContainText('Account');
    await expect(page).toHaveURL('/');
  });
});
