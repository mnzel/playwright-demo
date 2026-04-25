import { test, expect } from '@playwright/test';

// Helper: resolves to the "Accept all" button inside the SP cookie banner iframe.
// Presence + visibility of this button is the reliable indicator that the banner is shown.
const acceptAllBtn = (page: Parameters<typeof test>[1] extends (args: infer A) => unknown ? A extends { page: infer P } ? P : never : never) =>
  page.frameLocator('iframe[title="Cookie Banner"]').getByRole('button', { name: 'Accept all' });

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate once to establish the origin, wipe SP consent keys (but keep the
    // client-ID key so the SP script can write consent after accepting), then reload
    // so the Secure Privacy script re-evaluates consent and renders the banner.
    await page.goto('/');
    await page.evaluate(() => {
      ['sp_consent', 'sp_dynamic', 'sp_expiry'].forEach(k => localStorage.removeItem(k));
    });
    // waitForLoadState('networkidle') ensures the external Secure Privacy script has
    // fully loaded and had time to inject the banner into the iframe before tests run.
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('banner appears on first visit when no consent has been given', async ({ page }) => {
    // sp_consent must be absent or empty before any interaction
    const rawConsent = await page.evaluate(() => localStorage.getItem('sp_consent'));
    expect(JSON.parse(rawConsent ?? '[]')).toHaveLength(0);

    // The Secure Privacy banner renders inside its own iframe — its "Accept all"
    // button must be visible to confirm the banner is presented to the user.
    await expect(acceptAllBtn(page)).toBeVisible({ timeout: 10000 });
  });

  test('accepting all cookies writes per-category consent to localStorage and dismisses banner', async ({ page }) => {
    const acceptBtn = acceptAllBtn(page);
    await expect(acceptBtn).toBeVisible({ timeout: 10000 });

    // Confirm empty consent before accepting
    const consentBefore = JSON.parse(
      (await page.evaluate(() => localStorage.getItem('sp_consent'))) ?? '[]'
    );
    expect(consentBefore).toHaveLength(0);

    await acceptBtn.click();

    // Banner must disappear — the "Accept all" button is no longer visible
    await expect(acceptBtn).not.toBeVisible({ timeout: 5000 });

    // sp_consent should now contain per-category consent objects
    const consentAfter = JSON.parse(
      (await page.evaluate(() => localStorage.getItem('sp_consent'))) ?? '[]'
    );
    expect(consentAfter.length).toBeGreaterThan(0);

    // Every category recorded as explicitly accepted
    for (const category of consentAfter) {
      expect(category).toMatchObject({ ConsentGiven: true });
    }

    // Expected categories written by Secure Privacy on "Accept all"
    const types = consentAfter.map((c: { ComplianceType: string }) => c.ComplianceType);
    expect(types).toEqual(expect.arrayContaining(['Essential', 'Analytics', 'Advertising']));

    // sp_dynamic must be flushed to storage (saved: true) and consent flag set (c: true)
    const dynamic = JSON.parse(
      (await page.evaluate(() => localStorage.getItem('sp_dynamic'))) ?? '{}'
    );
    expect(dynamic.saved).toBe(true);
    expect(dynamic.data.c).toBe(true);
  });

  test('banner does not reappear on reload once consent is saved', async ({ page }) => {
    const acceptBtn = acceptAllBtn(page);
    await expect(acceptBtn).toBeVisible({ timeout: 10000 });

    await acceptBtn.click();
    await expect(acceptBtn).not.toBeVisible({ timeout: 5000 });

    // Verify consent is persisted in localStorage before reload
    const savedConsent = JSON.parse(
      (await page.evaluate(() => localStorage.getItem('sp_consent'))) ?? '[]'
    );
    expect(savedConsent.length).toBeGreaterThan(0);

    // Reload simulates a return visit in the same browser session
    await page.reload();
    await page.waitForLoadState('networkidle');

    // SP script reads consent from localStorage — banner must stay hidden
    await expect(acceptBtn).not.toBeVisible({ timeout: 8000 });
  });
});
