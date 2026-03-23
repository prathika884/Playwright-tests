import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Products Page', () => {
  /** @type {ProductsPage} */
  let productsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    productsPage = new ProductsPage(page);
    await expect(productsPage.heading).toBeVisible();
  });

  test('should display all 8 products by default', async () => {
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(8);
  });

  test('should display correct product details for first product', async ({ page }) => {
    await expect(page.getByTestId('product-name-1')).toHaveText('Wireless Headphones');
    await expect(page.getByTestId('product-price-1')).toHaveText('$79.99');
    await expect(page.getByTestId('product-category-1')).toHaveText('Electronics');
  });

  test('should filter products by Sports category', async () => {
    await productsPage.filterByCategory('Sports');
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(3); // Running Shoes, Yoga Mat, Water Bottle
  });

  test('should filter products by Electronics category', async () => {
    await productsPage.filterByCategory('Electronics');
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(2); // Wireless Headphones, Smart Watch
  });

  test('should restore all products when All filter is selected', async () => {
    await productsPage.filterByCategory('Sports');
    await productsPage.filterByCategory('All');
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(8);
  });

  test('should search products by partial name (case-insensitive)', async () => {
    await productsPage.searchFor('headphones');
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(1);
  });

  test('should show no-results message for unmatched search term', async () => {
    await productsPage.searchFor('xyznotfound999');
    await expect(productsPage.noResults).toBeVisible();
    await expect(productsPage.noResults).toContainText('No products found');
  });

  test('should combine search and category filter', async ({ page }) => {
    await productsPage.filterByCategory('Sports');
    await productsPage.searchFor('yoga');
    const count = await productsPage.getVisibleProductCount();
    expect(count).toBe(1);
    await expect(page.getByTestId('product-name-4')).toHaveText('Yoga Mat');
  });

  test('should add a product to cart and show badge count', async () => {
    await productsPage.addProductToCart(1);
    await expect(productsPage.cartCount).toBeVisible();
    await expect(productsPage.cartCount).toHaveText('1');
  });

  test('should increment cart count when multiple distinct products are added', async () => {
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(2);
    await expect(productsPage.cartCount).toHaveText('2');
  });

  test('should increment cart count on repeated add of the same product', async () => {
    await productsPage.addProductToCart(1);
    await productsPage.addProductToCart(1);
    await expect(productsPage.cartCount).toHaveText('2');
  });

  test('should update Add to Cart button label after product is added', async ({ page }) => {
    await productsPage.addProductToCart(1);
    await expect(page.getByTestId('btn-add-to-cart-1')).toContainText('In Cart');
  });

  test('should navigate to cart page via header cart button', async ({ page }) => {
    await productsPage.cartButton.click();
    await expect(page).toHaveURL('/cart');
  });

  test('should logout and redirect to login page', async ({ page }) => {
    await productsPage.logoutButton.click();
    await expect(page).toHaveURL('/login');
  });
});
