# Northwind Goods

A small example e-commerce storefront built with **React 19**, **TypeScript**, **Vite 8**, and **React Router 7**.

Browse products, build a cart, sign in, and check out — all in the browser. There's no backend: products are hardcoded, and cart, auth, and orders persist in `localStorage`.

## Running locally

This project uses [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev         # http://localhost:5173
pnpm build       # typecheck + production build to /dist
pnpm preview     # serve the production build at http://localhost:4173
pnpm typecheck   # tsc --noEmit
```

## Demo credentials

A demo user is auto-seeded on first load:

```
Email:    test@example.com
Password: Password123!
```

You can also create a new account from the register page.

## Tech stack

- React 19.2.4
- TypeScript 6.0.2 (strict mode)
- Vite 8.0.7
- React Router DOM 7.14.0
- CSS Modules + plain CSS
- pnpm 10

No UI library, no Redux, no backend.

## Project structure

```
src/
├── App.tsx                  # Routes + provider composition
├── main.tsx
├── types.ts                 # Shared domain types
├── data/products.ts         # Product catalog
├── context/                 # Cart, Auth, Toast
├── hooks/                   # usePersistedReducer, useDebounce, useLocalStorage
├── utils/                   # format, fakeJwt, validators, ids
├── components/
│   ├── layout/              # Layout, Header, Footer
│   ├── ui/                  # Button, Modal, Toast, Toaster, Spinner, FormField
│   ├── product/             # ProductCard, ProductGrid, filters, search, etc.
│   ├── cart/                # CartDrawer, CartLineItem, PromoCodeInput, OrderSummary
│   ├── checkout/            # ShippingForm, PaymentForm
│   └── auth/                # LoginForm, RegisterForm, ProtectedRoute
├── pages/                   # One file per route
└── styles/global.css        # Reset + tokens
```
