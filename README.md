# 🛍️ Northwind Goods — E2E Test Suite

End-to-end test automation for the Northwind Goods storefront, built with **Playwright** and **TypeScript**. The suite covers 44 tests across 8 spec files, all running against a real React + Vite app with a live third-party cookie consent integration.

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
| `npm test` | Run all 44 tests headlessly |
| `npm run test:ui` | Open the Playwright interactive UI |
| `npm run test:debug` | Step through tests with the debugger |
| `npx playwright test tests/cart.spec.ts` | Run a single spec file |
| `npx playwright test -g "promo code"` | Run tests matching a name pattern |

---

## 🧪 Test Coverage

### 💨 Smoke (`smoke.spec.ts`) — 2 tests
Quick sanity checks that the app is up and navigable.
- Homepage loads with the correct title and logo
- Shop navigation routes to `/products`

---

### 🔐 Authentication (`authentication.spec.ts`) — 3 tests
Verifies the login/logout flow for the seeded demo user.
- Successful login redirects to home and shows the user name
- Invalid credentials display an inline error
- Logout clears session state and returns to the guest view

---

### 📝 Register & Login (`register-login.spec.ts`) — 4 tests
Full account lifecycle using a unique email per run to avoid localStorage collisions.
- Register a new account, log out, then log back in
- Invalid credentials show an error without redirecting
- Mismatched passwords surface a field-level inline error (not the form banner)
- Attempting to register a duplicate email shows a conflict error

---

### 🏠 Browsing & Discovery (`browsing.spec.ts`) — 12 tests
Covers homepage content, category navigation, search, and product sorting.
- Homepage shows free-shipping banner, category tiles, and featured products
- Each of the 4 category tiles navigates to the correct filtered URL (parameterised)
- Shop link navigates to `/products`
- Search returns results for 4 different product names (parameterised)
- Sort by price ascending orders products cheapest first
- Sort by price descending orders products most expensive first

> ℹ️ Price sorting uses `page.evaluate()` to extract `$N.NN` from card `innerText` because product list cards have no `data-testid` on their price element.

---

### 🔍 Product Detail (`product-detail.spec.ts`) — 11 tests
Validates the product detail page for 4 different products (parameterised).
- Correct product name, price, description, and stock status are displayed
- All size options are visible and the selected size gets an active state
- Add to cart is blocked until a size is selected (error message shown)
- Quantity stepper increments and the cart badge reflects the total
- Searching for a product on `/products` and clicking it reaches the detail page

---

### 🛒 Cart & Checkout (`cart.spec.ts`) — 8 tests
Covers the full cart lifecycle and a complete checkout journey.
- Search, navigate to detail, increase quantity to 2, and add to cart — badge shows `2`
- Cart page displays line item, subtotal, total, and free-shipping unlock message
- Updating line item quantity updates the cart badge and total
- Full checkout: add item → cart → fill shipping & payment → confirm order
- Removing an item empties the cart and hides the badge
- Applying promo code `WELCOME10` gives exactly 10% off the subtotal
- Applying an invalid promo code shows an inline error and no discount
- Unauthenticated users are redirected to `/login` before checkout, then forwarded back

---

### 🔁 Checkout Flow (`checkout.spec.ts`) — 1 test
Standalone end-to-end journey that also validates the auth redirect contract.
- Adds a product → goes to cart → is redirected to login → logs in → lands on `/checkout` → fills shipping & payment → confirms order with visible order ID and line item

---

### 🍪 Cookie Consent (`cookie-consent.spec.ts`) — 3 tests
Tests the live [Secure Privacy](https://secureprivacy.ai) cookie banner integration — the most relevant suite given the company's core product.

- **Banner appears on first visit** — with no prior consent in localStorage, the "Accept all" button is visible inside the consent iframe
- **Accepting writes consent to localStorage** — after clicking "Accept all", `sp_consent` contains all 3 categories (Essential, Analytics, Advertising) each with `ConsentGiven: true`, and `sp_dynamic.saved` flips to `true`
- **Consent persists across reload** — after accepting, a full page reload does not re-show the banner, proving the persistence contract works end-to-end

> ℹ️ The SP banner renders inside `iframe[title="Cookie Banner"]`. Tests use `frameLocator()` to reach the button and assert on its presence/absence rather than the iframe element itself (which stays in the DOM at non-zero height even after dismissal).

---

## 🏗️ Architecture Notes

### Page Object Model
All page interactions live in `page-objects/`. `BasePage` provides shared nav, header locators, and `handleCookieBanner()`. Every other POM extends `BasePage`.

### Test Isolation
Each `beforeEach` follows this order:
1. Navigate to home
2. Clear app-specific `localStorage` keys (`ec_*`)
3. Reload so the SP script re-evaluates consent
4. Call `handleCookieBanner()` to dismiss the banner

> ⚠️ **Order matters:** clearing localStorage *after* dismissing the banner wipes `sp_consent`, causing the banner to reappear on the next `page.goto()` and block form interactions.

### App State
Everything is client-side — no backend. Auth, cart, users, and promo state all live in `localStorage` under `ec_*` keys. The demo user (`test@example.com` / `Password123!`) is auto-seeded by the app on first load.
