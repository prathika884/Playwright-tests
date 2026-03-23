# playwright-tests

Playwright end-to-end test suite for the **ShopEasy** React application.  
The UI source code lives in the companion repo: **`../testproject`**

## Structure

```
playwright-tests/
├── playwright.config.js        # Playwright configuration
├── pages/                      # Page Object Model classes
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   └── CartPage.js
└── tests/                      # Test specifications
    ├── login.spec.js            # Login page tests
    ├── products.spec.js         # Products page tests
    ├── cart.spec.js             # Cart page tests
    └── e2e.spec.js              # Full end-to-end flows
```

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |

## Setup

### 1. Install dependencies

```bash
npm install
npx playwright install
```

### 2. Ensure the UI app is available

The `playwright.config.js` is configured to auto-start the dev server from `../testproject`.  
Make sure the testproject dependencies are installed:

```bash
cd ../testproject
npm install
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless, all browsers) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Step-through debugging |
| `npm run report` | View HTML test report |

### Run a specific test file

```bash
npx playwright test tests/login.spec.js
```

### Run a specific browser

```bash
npx playwright test --project=chromium
```

## Test Coverage

| Spec | What is tested |
|------|---------------|
| `login.spec.js` | Valid login, invalid credentials, field validation, error clearing |
| `products.spec.js` | Product listing, category filter, search, add to cart, navigation, logout |
| `cart.spec.js` | Empty cart, add items, quantity controls, remove, total price, checkout |
| `e2e.spec.js` | Full shopping flow, failed-then-successful login, search-to-cart, route protection |

## Page Object Model

Each page has a corresponding class in `pages/` that encapsulates:
- Locators (via `data-testid` attributes)
- Reusable actions (`goto()`, `login()`, `addProductToCart()`, etc.)

This keeps test specs clean and makes locator changes a one-place fix.

## credentials

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `password123` |
