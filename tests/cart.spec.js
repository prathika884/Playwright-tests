import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';

test.describe('Cart Page', () => {
  /** @type {ProductsPage} */
  let productsPage;
  /** @type {CartPage} */
  let cartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  test('should show empty cart state when no items added', async ({ page }) => {
    await cartPage.goto();
    await expect(cartPage.emptyCart).toBeVisible();
    await expect(page.getByTestId('btn-shop-now')).toBeVisible();
  });

  test('should display added item in cart', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    await expect(page.getByTestId('cart-item-name-1')).toHaveText('Wireless Headphones');
  });

  test('should show correct price for cart item', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await expect(page.getByTestId('cart-item-price-1')).toHaveText('$79.99');
  });

  test('should increase item quantity via + button', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.increaseQuantity(1);
    await expect(page.getByTestId('cart-item-qty-1')).toHaveText('2');
  });

  test('should decrease item quantity via − button', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.increaseQuantity(1); // qty = 2
    await cartPage.decreaseQuantity(1); // qty = 1
    await expect(page.getByTestId('cart-item-qty-1')).toHaveText('1');
  });

  test('should remove item when quantity reaches 0', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.decreaseQuantity(1); // qty was 1, now 0 → removed
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should remove item via ✕ button', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.removeItem(1);
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should show correct total for single item', async ({ page }) => {
    await productsPage.addProductToCart(1); // $79.99
    await page.getByTestId('nav-cart').click();
    await expect(cartPage.cartTotal).toHaveText('$79.99');
  });

  test('should update total when quantity is increased', async ({ page }) => {
    await productsPage.addProductToCart(1); // $79.99
    await page.getByTestId('nav-cart').click();
    await cartPage.increaseQuantity(1); // $159.98
    await expect(cartPage.cartTotal).toHaveText('$159.98');
  });

  test('should show correct total for multiple items', async ({ page }) => {
    await productsPage.addProductToCart(1); // $79.99
    await productsPage.addProductToCart(2); // $59.99
    await page.getByTestId('nav-cart').click();
    await expect(cartPage.cartTotal).toHaveText('$139.98');
  });

  test('should show all added items in cart', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(3);
    await page.getByTestId('nav-cart').click();
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    await expect(page.getByTestId('cart-item-3')).toBeVisible();
  });

  test('should show order success screen after checkout', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.checkout();
    await expect(cartPage.orderSuccess).toBeVisible();
  });

  test('should navigate back to products after placing order', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.checkout();
    await cartPage.continueShopping.click();
    await expect(page).toHaveURL('/products');
  });

  test('should clear cart after order is placed', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await page.getByTestId('nav-cart').click();
    await cartPage.checkout();
    await cartPage.continueShopping.click();
    // Cart badge should not appear (cart is empty)
    await expect(productsPage.cartCount).not.toBeVisible();
  });

  test('should navigate from empty cart to products via Shop Now button', async ({ page }) => {
    await cartPage.goto();
    await page.getByTestId('btn-shop-now').click();
    await expect(page).toHaveURL('/products');
  });
});
