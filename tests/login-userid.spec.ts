import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Login with Email or User ID (commit 1e6bd52)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with email (admin@example.com)', async ({ page }) => {
    await loginPage.login('admin@example.com', 'password123');
    await expect(page).toHaveURL('/products');
    const productsPage = new ProductsPage(page);
    await expect(productsPage.heading).toBeVisible();
  });

  test('should login successfully with user ID (admin716)', async ({ page }) => {
    await loginPage.login('admin716', 'password123');
    await expect(page).toHaveURL('/products');
    const productsPage = new ProductsPage(page);
    await expect(productsPage.heading).toBeVisible();
  });

  test('should show error for invalid user ID', async () => {
    await loginPage.login('unknownuser', 'password123');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email/user ID or password');
  });

  test('should show error for valid user ID with wrong password', async () => {
    await loginPage.login('admin716', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email/user ID or password');
  });

  test('should show error for valid email with wrong password', async () => {
    await loginPage.login('admin@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email/user ID or password');
  });

  test('should show updated label "Email / User ID"', async ({ page }) => {
    const label = page.locator('label[for="identifier"]');
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Email / User ID');
  });

  test('should show updated placeholder text', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'admin@example.com or admin716');
  });

  test('should accept text input type (not email-only)', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('type', 'text');
  });

  test('should switch between email and user ID login after error', async ({ page }) => {
    // Try with wrong email
    await loginPage.login('wrong@email.com', 'password123');
    await expect(loginPage.errorMessage).toBeVisible();

    // Clear and login with user ID instead
    await loginPage.login('admin716', 'password123');
    await expect(page).toHaveURL('/products');
  });

  test('should clear error when switching from failed email to successful user ID', async ({ page }) => {
    await loginPage.login('wrong@email.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.login('admin716', 'password123');
    await expect(page).toHaveURL('/products');
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('should show updated demo hint with both credentials', async ({ page }) => {
    const hint = page.locator('[data-testid="login-page"] p').last();
    await expect(hint).toContainText('admin@example.com');
    await expect(hint).toContainText('admin716');
  });
});
