import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Login Page', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form elements', async () => {
    await expect(loginPage.loginTitle).toBeVisible();
    await expect(loginPage.loginTitle).toHaveText('🛍️ ShopEasy');
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toHaveText('Sign In');
  });

  test('should show error message on invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email/user ID or password');
  });

  test('should show error when only password is wrong', async () => {
    await loginPage.login('admin@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email/user ID or password');
  });

  test('should login with valid credentials and redirect to /products', async ({ page }) => {
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');
    const productsPage = new ProductsPage(page);
    await expect(productsPage.heading).toBeVisible();
  });

  test('input fields should have required attribute', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('required');
    await expect(loginPage.passwordInput).toHaveAttribute('required');
  });

  test('should clear error and redirect after correcting credentials', async ({ page }) => {
    await loginPage.login('wrong@email.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
    // Now submit correct credentials
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL('/products');
  });

  test('should redirect to /products when already logged in and visiting /login', async ({ page }) => {
    await loginPage.loginWithValidCredentials();
    await page.goto('/login');
    await expect(page).toHaveURL('/products');
  });
});
