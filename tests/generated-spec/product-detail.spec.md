# Spec: Product Detail Page

## Purpose
Verify that authenticated users can view product details, see the correct stock status, and select sizes where applicable.

---

## Preconditions
User is logged in. `localStorage` cleared before each test. Cookie banner dismissed.

---

## Product test data

| Product name | Slug | Sizes | In stock |
|---|---|---|---|
| Classic White Tee (Men's) | `classic-white-tee-mens` | XS, S, M, L, XL | Yes |
| Cashmere Cardigan | `cashmere-cardigan` | XS, S, M, L | Yes |
| Navy Oxford Shirt | `navy-oxford-shirt` | S, M, L, XL | Yes |
| Merino Wool Sweater | `merino-wool-sweater` | S, M, L, XL | Yes |

---

## Test: Product detail page shows correct information (parameterised per product)

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products/<slug>` | URL is `/products/<slug>` |
| 2 | Verify `[data-testid=product-name]` contains the product name | — |
| 3 | Verify `[data-testid=product-price]` is visible and non-empty | — |
| 4 | Verify `[data-testid=product-description]` is visible | — |
| 5 | Wait for stock check (~300 ms simulated delay) | `[data-testid=stock-badge]` is visible |
| 6 | Verify stock badge text matches expected status ("In stock") | — |

---

## Test: Size selector shows correct sizes and selection state (parameterised per product)

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products/<slug>` | — |
| 2 | Verify `[data-testid=size-selector]` is visible | — |
| 3 | For each expected size, verify `[data-testid=size-option-<size>]` is visible | All size buttons rendered |
| 4 | Click one size button (e.g. M) | `[data-testid=size-option-M]` has `data-selected="true"` |
| 5 | Click a different size | Previous size has `data-selected="false"`; new size has `data-selected="true"` |

---

## Test: Add to cart blocked until size selected (products requiring size)

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products/cashmere-cardigan` | — |
| 2 | Click `[data-testid=add-to-cart]` without selecting a size | Warning toast "Please select a size" is visible |
| 3 | Cart badge count does not change | — |

---

## Test: Quantity stepper increments before add to cart

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/products/classic-white-tee-mens` | — |
| 2 | Select size M | — |
| 3 | Click `[data-testid=qty-increment]` twice | `[data-testid=qty-value]` shows 3 |
| 4 | Click `[data-testid=add-to-cart]` | Cart badge shows 3 |
