import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';

test.describe('Cart Checkout Flow', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  test('should display order success with celebration after checkout', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.checkout();

    await expect(cartPage.orderSuccess).toBeVisible();
    await expect(page.getByTestId('btn-continue-shopping')).toBeVisible();
  });

  test('should show correct total for multiple items with different quantities', async ({ page }) => {
    // Add Wireless Headphones ($79.99) x2
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(1);
    // Add Coffee Maker ($49.99) x1
    await productsPage.addProductToCart(3);
    await page.getByTestId('nav-cart').click();

    // Expected: (79.99 * 2) + 49.99 = 209.97
    await expect(cartPage.cartTotal).toHaveText('$209.97');
    await expect(cartPage.cartSubtotal).toHaveText('$209.97');
  });

  test('should empty cart after checkout and return to products', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await page.getByTestId('nav-cart').click();
    await cartPage.checkout();
    await cartPage.continueShopping.click();

    await expect(page).toHaveURL('/products');
    // Cart badge should be gone
    await expect(page.getByTestId('cart-count')).not.toBeVisible();
    // Add-to-cart buttons should reset
    await expect(page.getByTestId('btn-add-to-cart-1')).toHaveText('Add to Cart');
    await expect(page.getByTestId('btn-add-to-cart-2')).toHaveText('Add to Cart');
  });

  test('should navigate from empty cart to products via Shop Now', async ({ page }) => {
    await cartPage.goto();
    await expect(cartPage.emptyCart).toBeVisible();
    await page.getByTestId('btn-shop-now').click();
    await expect(page).toHaveURL('/products');
  });

  test('should handle adding all products to cart', async ({ page }) => {
    for (let id = 1; id <= 8; id++) {
      await productsPage.addProductToCart(id);
    }
    await page.getByTestId('nav-cart').click();

    // All 8 items should be visible
    for (let id = 1; id <= 8; id++) {
      await expect(page.getByTestId(`cart-item-${id}`)).toBeVisible();
    }

    // Total: 79.99+59.99+49.99+29.99+34.99+44.99+199.99+19.99 = 519.92
    await expect(cartPage.cartTotal).toHaveText('$519.92');
  });

  test('should remove all items one by one and show empty cart', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await page.getByTestId('nav-cart').click();

    await cartPage.removeItem(1);
    await expect(page.getByTestId('cart-item-1')).not.toBeVisible();

    await cartPage.removeItem(2);
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should show free shipping in order summary', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();

    const summary = page.getByTestId('cart-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('Free');
  });
});
