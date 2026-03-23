import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { HeaderComponent } from '../pages/HeaderComponent.js';

test.describe('Header Component', () => {
  let header: HeaderComponent;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    header = new HeaderComponent(page);
    await expect(header.header).toBeVisible();
  });

  test('should display header with logo, nav buttons, and logout', async () => {
    await expect(header.logo).toBeVisible();
    await expect(header.productsNav).toBeVisible();
    await expect(header.cartNav).toBeVisible();
    await expect(header.logoutButton).toBeVisible();
  });

  test('should navigate to products page when logo is clicked', async ({ page }) => {
    await page.goto('/cart');
    await header.clickLogo();
    await expect(page).toHaveURL('/products');
  });

  test('should navigate to products page via Products nav button', async ({ page }) => {
    await page.goto('/cart');
    await header.navigateToProducts();
    await expect(page).toHaveURL('/products');
  });

  test('should navigate to cart page via Cart nav button', async ({ page }) => {
    await header.navigateToCart();
    await expect(page).toHaveURL('/cart');
  });

  test('should not show cart count badge when cart is empty', async () => {
    await expect(header.cartCount).not.toBeVisible();
  });

  test('should show cart count badge after adding item', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(1);
    await expect(header.cartCount).toBeVisible();
    await expect(header.cartCount).toHaveText('1');
  });

  test('should update cart count when multiple items are added', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await productsPage.addProductToCart(3);
    await expect(header.cartCount).toHaveText('3');
  });

  test('should logout and redirect to login', async ({ page }) => {
    await header.logout();
    await expect(page).toHaveURL('/login');
  });

  test('should persist header across page navigations', async ({ page }) => {
    await expect(header.header).toBeVisible();
    await header.navigateToCart();
    await expect(header.header).toBeVisible();
    await header.navigateToProducts();
    await expect(header.header).toBeVisible();
  });
});
