# Spec: Cart and Checkout

## Purpose
Verify that an authenticated user can add items to cart, manage quantities, and complete a checkout.

---

## Preconditions
User is logged in. `localStorage` cleared before each test. Cookie banner dismissed.

---

## Test: Add item to cart from product detail page

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products` and search for "Cashmere Cardigan" | Result count ≥ 1; product card visible |
| 2 | Click the product card to reach `/products/cashmere-cardigan` | URL matches |
| 3 | Verify size selector is visible with options XS, S, M, L | — |
| 4 | Click `[data-testid=qty-increment]` once (quantity becomes 2) | `[data-testid=qty-value]` shows 2 |
| 5 | Select size M | `[data-testid=size-option-M]` has `data-selected="true"` |
| 6 | Click `[data-testid=add-to-cart]` | "Added to cart" toast visible |
| 7 | Verify `[data-testid=cart-badge]` shows 2 | Cart badge reflects quantity |

---

## Test: Cart page shows items, prices, and totals

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Add Cashmere Cardigan (size M, qty 1) to cart | — |
| 2 | Navigate to `/cart` | `[data-testid=cart-line-list]` visible |
| 3 | Verify `[data-testid=cart-line-cashmere-cardigan]` is visible | — |
| 4 | Verify `[data-testid=summary-subtotal]` shows a non-zero value | — |
| 5 | Verify `[data-testid=cart-total]` is visible and non-empty | — |

---

## Test: Update line item quantity in cart

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Add Classic White Tee Men's (size M, qty 1) to cart then navigate to `/cart` | Item visible |
| 2 | Update qty field `[data-testid=cart-line-classic-white-tee-mens-qty-value]` to 3 | Cart badge updates to 3 |
| 3 | Verify `[data-testid=cart-total]` reflects updated price | — |

---

## Test: Complete checkout flow (happy path)

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Add Cashmere Cardigan (size M, qty 1) | — |
| 2 | Navigate to `/cart` | — |
| 3 | Click `[data-testid=cart-checkout]` | Navigates to `/checkout` (user already logged in) |
| 4 | Fill shipping: name "Jane Doe", address "1 Test St", city "London", zip "EC1A 1BB", country "United Kingdom" | — |
| 5 | Fill payment: name "Jane Doe", number "4242 4242 4242 4242", expiry "12/30", cvc "123" | — |
| 6 | Click `[data-testid=place-order]` | URL is `/checkout/confirmation` |
| 7 | Verify `[data-testid=confirmation-order-id]` is visible | — |
| 8 | Verify `[data-testid=confirmation-item-cashmere-cardigan]` is visible | — |
| 9 | Verify `[data-testid=confirmation-total]` is non-empty | — |

---

## Test: Unauthenticated user is redirected to login before checkout

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Ensure no user is logged in | — |
| 2 | Add any item to cart; navigate to `/cart` | — |
| 3 | Click `[data-testid=cart-checkout]` | Redirected to `/login` |
| 4 | Login with demo credentials | Redirected back to `/checkout` |

---

## Data notes
- Cashmere Cardigan slug: `cashmere-cardigan`, price: $165.00, sizes: XS/S/M/L.
- Free shipping threshold is $50; Cashmere Cardigan at $165 qualifies — verify `[data-testid=free-shipping-unlocked]` is visible in cart.
