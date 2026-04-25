import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-objects/RegisterPage.ts';
import { LoginPage } from '../page-objects/LoginPage.ts';
import { BasePage } from '../page-objects/BasePage.ts';

// Unique email per test run to avoid collisions with persisted localStorage users
const uniqueEmail = () => `user_${Date.now()}@test.example`;
const TEST_NAME = 'Jane Tester';
const TEST_PASSWORD = 'SecurePass99!';

test.describe('Register and Login', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goToHome();
    // Dismiss the banner first so SP consent is written to localStorage,
    // then selectively clear app state while preserving SP consent keys.
    await basePage.handleCookieBanner();
    await page.evaluate(() => {
      // Reset auth, cart and promo state. Reset users to just the seeded demo account
      // so: (a) the duplicate-email test can detect a conflict, and
      //     (b) the register test starts with no stale entries that could block submission.
      // SP keys (sp_consent, sp_dynamic, sp_expiry, s_e_c_u_r_e_k_e_y) are preserved
      // so the banner does not re-appear on subsequent page.goto() calls.
      localStorage.removeItem('ec_auth_v1');
      localStorage.removeItem('ec_cart_v1');
      localStorage.removeItem('ec_promo_used_v1');
      localStorage.setItem(
        'ec_users_v1',
        JSON.stringify([{ email: 'test@example.com', password: 'Password123!', name: 'Test Customer' }])
      );
    });
  });

  test('should register a new account, logout, and log back in', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const email = uniqueEmail();

    // Register
    await registerPage.goToRegisterPage();
    await registerPage.register(TEST_NAME, email, TEST_PASSWORD);

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Account created!', { exact: false })).toBeVisible();
    await expect(basePage.accountMenu).toContainText(/Jane/i);

    // Credentials written to localStorage
    const storedUsers = await page.evaluate(() => {
      const raw = localStorage.getItem('ec_users_v1');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedUsers.some((u: { email: string }) => u.email === email)).toBe(true);

    // Logout
    await basePage.logout();
    await expect(basePage.accountMenu).toContainText('Account');
    await expect(page).toHaveURL('/');

    // Log back in with the registered credentials
    await basePage.goToLogin();
    await loginPage.login(email, TEST_PASSWORD);

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome back!', { exact: false })).toBeVisible();
    await expect(basePage.accountMenu).toContainText(/Jane/i);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await basePage.goToLogin();
    await loginPage.login('nobody@nowhere.com', 'wrongpassword');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid/i);
    await expect(page).toHaveURL('/login');
  });

  test('should show error when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goToRegisterPage();
    await registerPage.register(TEST_NAME, uniqueEmail(), TEST_PASSWORD, 'DifferentPass99!');

    // Mismatched passwords surface as a field-level error on the confirm input
    await expect(page.getByTestId('register-confirm-error')).toBeVisible();
    await expect(page.getByTestId('register-confirm-error')).toContainText(/passwords do not match/i);
    await expect(page).toHaveURL('/register');
  });

  test('should reject registration for an already-registered email', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goToRegisterPage();
    // Use the seeded demo user email
    await registerPage.register('Demo User', process.env.DEMO_EMAIL!, TEST_PASSWORD);

    await expect(registerPage.errorMessage).toBeVisible();
    await expect(registerPage.errorMessage).toContainText(/already exists/i);
    await expect(page).toHaveURL('/register');
  });
});
