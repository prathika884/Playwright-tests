import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Route Protection & Navigation', () => {
  test('should redirect root "/" to /login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should redirect root "/" to /products when authenticated', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    await page.goto('/');
    await expect(page).toHaveURL('/products');
  });

  test('should redirect /products to /login when not authenticated', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL('/login');
  });

  test('should redirect /cart to /login when not authenticated', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL('/login');
  });

  test('should allow access to /products after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');
    await expect(page.getByTestId('products-page')).toBeVisible();
  });

  test('should allow access to /cart after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
    await expect(page.getByTestId('cart-page')).toBeVisible();
  });

  test('should protect routes after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');

    // Logout
    await page.getByTestId('btn-logout').click();
    await expect(page).toHaveURL('/login');

    // Try accessing protected routes
    await page.goto('/products');
    await expect(page).toHaveURL('/login');
    await page.goto('/cart');
    await expect(page).toHaveURL('/login');
  });

  test('should redirect /login to /products when already authenticated', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    await page.goto('/login');
    await expect(page).toHaveURL('/products');
  });
});
