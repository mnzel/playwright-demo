import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage.ts';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.blockCookieBanner();
    await loginPage.goToHome();
    await page.evaluate(() => {
      ['ec_auth_v1', 'ec_cart_v1', 'ec_promo_used_v1', 'ec_users_v1'].forEach(k => localStorage.removeItem(k));
    });
    await loginPage.handleCookieBanner();
    await loginPage.goToLogin();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    
    // Welcome toast or redirection to account
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page).toHaveURL(/\/$/); // Redirects to home
    
    // Check if account name is shown in header
    await expect(page.getByTestId('account-menu')).toContainText(/test/i);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid/i);
  });

  test('should logout successfully', async ({ page }) => {
    await loginPage.login(process.env.DEMO_EMAIL!, process.env.DEMO_PASSWORD!);
    await expect(page.getByTestId('account-menu')).toContainText(/test/i);
    
    await loginPage.logout();
    await expect(page.getByTestId('account-menu')).toContainText('Account');
    await expect(page).toHaveURL(/\/$/);
  });
});
