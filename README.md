# Northwind Goods E2E Test Suite

This repository contains a robust end-to-end (E2E) test automation suite for the Northwind Goods storefront, built using Playwright and TypeScript.

## Project Structure

- `app/`: The storefront application (React + Vite).
- `page-objects/`: Page Object Models (POM) for better maintainability and readability.
- `tests/`: E2E test specifications covering core user journeys.
- `playwright.config.ts`: Configuration for Playwright, including cross-browser setup (Chromium only by default) and local dev server management.

## Requirements

- Node.js (v18 or higher recommended)
- npm (or pnpm/yarn)

## Setup Instructions

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies** in the root directory:
    ```bash
    npm install
    ```
3.  **Install app dependencies**:
    ```bash
    cd app && npm install && cd ..
    ```
4.  **Install Playwright browsers**:
    ```bash
    npx playwright install chromium --with-deps
    ```
5.  **Environment Variables**:
    Create a `.env` file in the root directory with the following (already provided for this demo):
    ```env
    DEMO_EMAIL=test@example.com
    DEMO_PASSWORD=Password123!
    ```

## Running Tests

To run all tests in headless mode:
```bash
npm test
```

To run tests with the Playwright UI:
```bash
npm run test:ui
```

To run tests in debug mode:
```bash
npm run test:debug
```

## Coverage

The suite covers the following core areas as per the tech test requirements:
1.  **Browsing**: Homepage loads, product listing, filtering by category, sorting by price, and search functionality.
2.  **Product Detail**: Viewing product info, checking stock status, and selecting options (sizes).
3.  **Cart**: Adding items to cart, updating quantities, removing items, and applying promo codes (`WELCOME10`).
4.  **Authentication**: Login with valid/invalid credentials and logout.
5.  **Checkout**: Full end-to-end journey from product discovery to order confirmation.
6.  **Cookie Consent**: Handling the Secure Privacy cookie banner globally.

## Reliability & Best Practices

- **Page Object Model (POM)**: Decouples test logic from UI selectors.
- **Robust Selectors**: Prioritizes `data-testid` and user-facing roles over brittle CSS/XPath.
- **Clean State**: Each test clears `localStorage` and handles the cookie banner to ensure isolation.
- **Automatic Server Management**: Playwright's `webServer` automatically starts and stops the Vite dev server.
