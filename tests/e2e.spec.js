import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';

test.describe('End-to-End Flows', () => {
  test('complete purchase: login → filter → add to cart → adjust qty → checkout', async ({ page }) => {
    // 1. Start at login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.loginTitle).toBeVisible();

    // 2. Login
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');

    // 3. Filter by Electronics
    const productsPage = new ProductsPage(page);
    await productsPage.filterByCategory('Electronics');
    const electronicsCount = await productsPage.getVisibleProductCount();
    expect(electronicsCount).toBe(2);

    // 4. Add Wireless Headphones (id=1) to cart
    await productsPage.addProductToCart(1);
    await expect(productsPage.cartCount).toHaveText('1');

    // 5. Show all products and add Coffee Maker (id=3)
    await productsPage.filterByCategory('All');
    await productsPage.addProductToCart(3);
    await expect(productsPage.cartCount).toHaveText('2');

    // 6. Open cart
    await productsPage.cartButton.click();
    await expect(page).toHaveURL('/cart');

    const cartPage = new CartPage(page);
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    await expect(page.getByTestId('cart-item-3')).toBeVisible();

    // 7. Increase headphones quantity
    await cartPage.increaseQuantity(1);
    const qty = await cartPage.getItemQuantity(1);
    expect(qty).toBe('2');

    // 8. Check total: (79.99 * 2) + 49.99 = 209.97
    await expect(cartPage.cartTotal).toHaveText('$209.97');

    // 9. Place order
    await cartPage.checkout();
    await expect(cartPage.orderSuccess).toBeVisible();

    // 10. Continue shopping — cart should be cleared
    await cartPage.continueShopping.click();
    await expect(page).toHaveURL('/products');
    await expect(productsPage.cartCount).not.toBeVisible();
  });

  test('failed login followed by successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 1. Wrong credentials
    await loginPage.login('hacker@evil.com', 'badpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL('/login');

    // 2. Correct credentials
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('search-to-cart flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();

    const productsPage = new ProductsPage(page);
    await productsPage.searchFor('watch');

    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(1);

    // Add Smart Watch (id=7)
    await productsPage.addProductToCart(7);
    await productsPage.cartButton.click();

    const cartPage = new CartPage(page);
    await expect(page.getByTestId('cart-item-7')).toBeVisible();
    await expect(page.getByTestId('cart-item-name-7')).toHaveText('Smart Watch');
    await expect(cartPage.cartTotal).toHaveText('$199.99');
  });

  test('unauthenticated access to protected routes redirects to /login', async ({ page }) => {
    // Try products directly without login
    await page.goto('/products');
    await expect(page).toHaveURL('/login');

    // Try cart directly without login
    await page.goto('/cart');
    await expect(page).toHaveURL('/login');
  });

  test('logout clears session and protects routes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();

    const productsPage = new ProductsPage(page);
    await expect(page).toHaveURL('/products');

    // Logout
    await productsPage.logoutButton.click();
    await expect(page).toHaveURL('/login');

    // Attempt to access protected routes after logout
    await page.goto('/products');
    await expect(page).toHaveURL('/login');

    await page.goto('/cart');
    await expect(page).toHaveURL('/login');
  });
});
