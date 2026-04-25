# 🛍️ Northwind Goods — E2E Test Suite

End-to-end test automation for the Northwind Goods storefront, built with **Playwright** and **TypeScript**. The suite covers 9 tests across 4 spec files, all running against a real React + Vite app with a live third-party cookie consent integration.

---

## 📁 Project Structure

```
playwright-demo/
├── app/                    # React + Vite storefront (auto-started by Playwright)
├── page-objects/           # Page Object Models — one class per page/feature
├── tests/
│   ├── written-spec/       # Plain-English specifications (source of truth)
│   ├── generated-spec/     # Formal spec documents derived from written specs
│   └── *.spec.ts           # Playwright test files
└── playwright.config.ts    # Browser config, webServer, env vars
```

---

## ⚙️ Setup

1. **Install root dependencies**
   ```bash
   npm install
   ```
2. **Install app dependencies**
   ```bash
   cd app && npm install && cd ..
   ```
3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium --with-deps
   ```
4. **Set up environment variables** — copy the example file and you're done:
   ```bash
   cp .env.example .env
   ```
   The credentials are pre-filled in `.env.example` — no changes needed.

---

## 🚀 Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all 9 tests headlessly |
| `npm run test:ui` | Open the Playwright interactive UI |
| `npm run test:debug` | Step through tests with the debugger |
| `npx playwright test tests/journey.spec.ts` | Run a single spec file |
| `npx playwright test -g "checkout"` | Run tests matching a name pattern |

---

## 🧪 Test Coverage

### 🔐 Authentication (`auth.spec.ts`) — 1 test

A single flow that covers the full login lifecycle in one pass — no duplicate setup overhead.

- Submits invalid credentials → asserts the inline error message appears and URL stays at `/login`
- Submits valid credentials → asserts "Welcome back" toast, redirect to `/`, and user name in header
- Logs out → asserts account menu reverts to guest state

---

### 📝 Register & Login (`register-login.spec.ts`) — 4 tests

Full account registration lifecycle plus form validation edge cases. Each test generates a unique email per run to avoid localStorage collisions across parallel workers.

- **Register, logout, log back in** — new account created, credentials written to localStorage, re-login with the same credentials succeeds
- **Invalid credentials** — error shown on login, URL stays at `/login`
- **Mismatched passwords** — field-level inline error on the confirm-password input (not the form-level banner)
- **Duplicate email** — form-level conflict error shown, URL stays at `/register`

---

### 🛒 End-to-End Shopping Journey (`journey.spec.ts`) — 1 test

A single sequential flow covering the entire purchase funnel from first load to order confirmation. Each step validates a distinct layer of the app.

1. **Homepage** — correct title, logo, free-shipping banner, category section visible
2. **Category navigation** — clicking "Men's Apparel" tile updates URL to `?category=apparel-mens` and shows the correct heading
3. **Search** — navigate to `/products`, search for "Cashmere Cardigan", assert the product card appears and result count is non-zero
4. **Sort** — sort by price ascending, assert every card's price ≤ the next (extracted via `page.evaluate()`)
5. **Product detail** — navigate directly to `/products/cashmere-cardigan`, assert name, price, description, stock badge, and all size options
6. **Add to cart** — select size M, add to cart, assert badge shows `1`
7. **Cart review** — line item visible, subtotal shown, free-shipping unlock message shown ($165 item exceeds $50 threshold)
8. **Promo code** — apply `WELCOME10`, assert 10% discount value matches `subtotal × 0.1`
9. **Auth redirect** — unauthenticated checkout redirects to `/login`; after login, auto-forwarded to `/checkout`
10. **Checkout** — fill shipping and payment, place order
11. **Confirmation** — URL matches `/checkout/confirmation`, order ID and line item visible, total non-empty

---

### 🍪 Cookie Consent (`cookie-consent.spec.ts`) — 3 tests

Dedicated suite for the live [Secure Privacy](https://secureprivacy.ai) banner integration — the most domain-relevant suite given the product is a privacy compliance platform.

- **Banner appears on first visit** — with no prior consent in localStorage, the "Accept all" button is visible inside the consent iframe
- **Accepting writes consent to localStorage** — after clicking "Accept all", `sp_consent` contains all 3 categories (Essential, Analytics, Advertising) each with `ConsentGiven: true`, and `sp_dynamic.saved` flips to `true`
- **Consent persists across reload** — a full page reload does not re-show the banner, proving the end-to-end persistence contract

> ℹ️ The SP banner renders inside `iframe[title="Cookie Banner"]`. Tests use `frameLocator()` to reach the button — the iframe element itself stays in the DOM after dismissal, so asserting on the button's visibility is the reliable approach.

---

## 🏗️ Architecture Notes

### Page Object Model
All page interactions live in `page-objects/`. `BasePage` provides shared nav, header locators, and two key helpers:
- `blockCookieBanner()` — aborts all requests to `secureprivacy.ai` via `page.route()`. Used in every suite that is not testing consent behaviour.
- `handleCookieBanner()` — accepts the banner via `frameLocator()` if it appears. Used as a safety net.

### Test Isolation
Each `beforeEach` follows this order:
1. Call `blockCookieBanner()` before the first `page.goto()` (prevents the CDN script from loading)
2. Navigate to home
3. Clear only app-specific `localStorage` keys (`ec_*`) — SP consent keys are preserved

> ⚠️ **Never clear `s_e_c_u_r_e_k_e_y`** — this is the SP client ID. Removing it prevents the SP script from writing consent to `sp_consent` after "Accept all" is clicked.

### App State
Everything is client-side — no backend. Auth, cart, users, and promo state all live in `localStorage` under `ec_*` keys. The demo user (`test@example.com` / `Password123!`) is auto-seeded by the app on first load.
