# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (run both)
npm install
cd app && npm install && cd ..

# Install Playwright browsers
npx playwright install chromium --with-deps

# Run all tests (headless)
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run a single test file
npx playwright test tests/cart.spec.ts

# Run a single test by name
npx playwright test -g "should add item to cart"
```

## Architecture

### Two-package structure
- **Root** (`package.json`): Playwright test runner only. No app code here.
- **`app/`** (`app/package.json`): React + Vite storefront. Playwright's `webServer` config auto-starts it on `localhost:5173` before tests run.

### App state (all client-side, no backend)
- **Auth**: Fake JWT (base64, unsigned). Users stored in `localStorage` under `ec_users_v1`. Auth state under `ec_auth_v1`. A demo user (`test@example.com` / `Password123!`) is auto-seeded on first load — credentials live in `.env` at the repo root and are read by Playwright tests via `dotenv`.
- **Cart**: Persisted to `localStorage` under `ec_cart_v1` via `usePersistedReducer`. Promo code `WELCOME10` gives 10% off; once-per-session use is tracked under `ec_promo_used_v1`. Shipping is $5.99, free above $50.
- **Products**: Static data in `app/src/data/products.ts` — no API calls. Products have a `slug` field used as the key in `data-testid` selectors throughout (e.g. `product-card-<slug>`, `cart-line-<slug>`).
- **Checkout**: Requires authentication — unauthenticated users are redirected to `/login` with a return URL, then forwarded to `/checkout` after login.

### Page Object Model
All POMs live in `page-objects/`. `BasePage` provides shared nav/header locators and a `handleCookieBanner()` helper (Secure Privacy banner — must be dismissed before interacting with the page in most tests). Every other POM extends or composes `BasePage`.

### Test isolation
Tests clear `localStorage` in `beforeEach` and call `handleCookieBanner()`. Selectors use `data-testid` attributes; avoid CSS class or position-based selectors. Search input is debounced 400ms — `ProductListPage.search()` waits for the result-count to change rather than sleeping.

### Writing new tests
Every test file imports POMs from `page-objects/`. Instantiate POMs in `beforeEach`, not at the top of `test.describe`. Tests access `process.env.DEMO_EMAIL` / `process.env.DEMO_PASSWORD` for the seeded user; these are populated from `.env` by `playwright.config.ts`.

When registering a new user in tests, generate a unique email per run (e.g. `` `user_${Date.now()}@test.example` ``) to avoid collisions with users persisted in `localStorage` from previous test runs.

### Cookie banner
The Secure Privacy banner renders inside `iframe[title="Cookie Banner"]` (`id="ifrmCookieBanner"`). `BasePage.handleCookieBanner()` uses `frameLocator()` to reach the button inside — the old page-level selectors (`#sp-cookie-allow`) do not work for iframe-based content.

**Isolation order matters:** call `handleCookieBanner()` first, then clear `localStorage`. Doing it in reverse wipes `sp_consent` after the banner was dismissed — the SP script re-shows the banner on the next `page.goto()` call, blocking form interactions in subsequent navigations.

**Do not clear `s_e_c_u_r_e_k_e_y`** — this is the SP client ID. Removing it prevents the SP script from writing consent to `sp_consent` after "Accept all" is clicked.

**Asserting banner state:** The iframe element itself stays in the DOM with non-zero height even after dismissal, so `expect(iframe).not.toBeVisible()` is unreliable. Instead assert on the button inside the iframe: `frameLocator('iframe[title="Cookie Banner"]').getByRole('button', { name: 'Accept all' })`.

**Consent storage:** After "Accept all", the SP script writes to `localStorage`:
- `sp_consent` — JSON array of category objects (`ComplianceType`, `ConsentGiven: true`, `LastUpdated`)
- `sp_dynamic` — object with `saved: true` and `data.c: true`
- `sp_expiry` — expiry timestamp

### Known testid gaps
`data-testid="product-price"` exists **only on the product detail page** (`ProductDetailPage.tsx`). Product list cards (`ProductCard.tsx`) render the price in a CSS-module-scoped `<span>` with no testid. To read prices from the list view, use `page.evaluate()` over `[data-testid^="product-card-"]` elements and extract the `$N.NN` pattern from their `innerText`.

### Promo code behaviour
- `WELCOME10` applies a 10% discount on subtotal. It is single-use per session, tracked in `localStorage` under `ec_promo_used_v1`. Clearing `localStorage` in `beforeEach` resets this, so promo tests are fully isolated.
- `summary-discount` row `innerText` includes the label "Discount (WELCOME10)" — the string `10` in the promo code name corrupts a naive numeric parse. Read only the last `<span>` child of the row to get the amount: `page.getByTestId('summary-discount').locator('span').last()`.
- The discount applies to subtotal only. The final `cart-total` also includes shipping ($5.99 when subtotal < $50 after discount), so asserting total = subtotal × 0.9 will fail for low-value items. Assert the discount value directly instead.

### Password mismatch on registration
A mismatched confirm-password surfaces as a **field-level** inline error (`[data-testid=register-confirm-error]`), not the form-level `[data-testid=register-error]` banner. The form-level banner only appears for business-logic errors (e.g. duplicate email).

### dotenv logging
The project uses `dotenv` v17+ (dotenvx), which logs `◇ injected env (N) from .env` for every worker process. This is normal — `(2)` on the first line means both env vars loaded successfully. Suppress with `DOTENV_LOG_LEVEL=error` if needed.

