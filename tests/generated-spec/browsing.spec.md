# Spec: Browse the Application

## Purpose
Verify an authenticated user can navigate the storefront, browse categories, view featured products, and search for products.

---

## Preconditions
User is logged in (via demo credentials). `localStorage` cleared before each test. Cookie banner dismissed.

---

## Test: Homepage loads with categories and featured products after login

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Login with demo credentials | Redirected to `/` |
| 2 | Verify URL is `/` | — |
| 3 | Verify `[data-testid=free-shipping-banner]` is visible | — |
| 4 | Verify "Shop by category" heading is visible | — |
| 5 | Verify category tiles present: `category-tile-apparel-mens`, `category-tile-apparel-womens`, `category-tile-accessories`, `category-tile-home` | All four tiles visible |
| 6 | Verify "Featured products" heading is visible | — |
| 7 | Verify at least one product card is visible in the featured section | — |

---

## Test: Category tiles navigate to filtered product list

**Parameterised for each category:**

| Category tile testid | Expected URL param | Expected heading |
|---|---|---|
| `category-tile-apparel-mens` | `category=apparel-mens` | Men's Apparel |
| `category-tile-apparel-womens` | `category=apparel-womens` | Women's Apparel |
| `category-tile-accessories` | `category=accessories` | Accessories |
| `category-tile-home` | `category=home` | Home & Living |

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/` | — |
| 2 | Click the category tile | URL changes to `/products?category=<slug>` |
| 3 | Verify matching category heading is visible on `/products` | — |

---

## Test: Product search on /products page

**Test data (define as constants):**
- `SEARCH_TERMS = ['Classic White Tee', 'Cashmere Cardigan', 'Navy Oxford Shirt', 'Merino Wool Sweater']`

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products` | Product list page visible (`[data-testid=page-product-list]`) |
| 2 | Type search term into `[data-testid=search-input]` | Result count updates (debounced ~400 ms) |
| 3 | Verify `[data-testid=result-count]` shows ≥ 1 result | — |
| 4 | Verify a product card matching the search term is visible | — |

Run this test for each term in `SEARCH_TERMS` using `test.each` or a loop within a single test case.

---

## Data notes
- Cookie banner (`#sp-cookie-banner`) is dismissed via `basePage.handleCookieBanner()`.
- The seeded cookie-consent acceptance state is verified implicitly by the banner being gone.
