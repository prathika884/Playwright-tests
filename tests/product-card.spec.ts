import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Product Card Component', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidCredentials();
    productsPage = new ProductsPage(page);
    await expect(productsPage.heading).toBeVisible();
  });

  test('should display product card with name, price, category, and add-to-cart button', async ({ page }) => {
    const card = page.getByTestId('product-card-1');
    await expect(card).toBeVisible();
    await expect(page.getByTestId('product-name-1')).toHaveText('Wireless Headphones');
    await expect(page.getByTestId('product-price-1')).toHaveText('$79.99');
    await expect(page.getByTestId('product-category-1')).toHaveText('Electronics');
    await expect(page.getByTestId('btn-add-to-cart-1')).toBeVisible();
  });

  test('should show all 8 product cards with correct data', async ({ page }) => {
    const expectedProducts = [
      { id: 1, name: 'Wireless Headphones', price: '$79.99', category: 'Electronics' },
      { id: 2, name: 'Running Shoes', price: '$59.99', category: 'Sports' },
      { id: 3, name: 'Coffee Maker', price: '$49.99', category: 'Kitchen' },
      { id: 4, name: 'Yoga Mat', price: '$29.99', category: 'Sports' },
      { id: 5, name: 'Desk Lamp', price: '$34.99', category: 'Home' },
      { id: 6, name: 'Backpack', price: '$44.99', category: 'Travel' },
      { id: 7, name: 'Smart Watch', price: '$199.99', category: 'Electronics' },
      { id: 8, name: 'Water Bottle', price: '$19.99', category: 'Sports' },
    ];

    for (const product of expectedProducts) {
      await expect(page.getByTestId(`product-name-${product.id}`)).toHaveText(product.name);
      await expect(page.getByTestId(`product-price-${product.id}`)).toHaveText(product.price);
      await expect(page.getByTestId(`product-category-${product.id}`)).toHaveText(product.category);
    }
  });

  test('should change button text to "In Cart" after adding product', async ({ page }) => {
    const addBtn = page.getByTestId('btn-add-to-cart-1');
    await expect(addBtn).toHaveText('Add to Cart');
    await addBtn.click();
    await expect(addBtn).toContainText('In Cart (1)');
  });

  test('should increment in-cart count on repeated clicks', async ({ page }) => {
    const addBtn = page.getByTestId('btn-add-to-cart-1');
    await addBtn.click();
    await expect(addBtn).toContainText('In Cart (1)');
    await addBtn.click();
    await expect(addBtn).toContainText('In Cart (2)');
    await addBtn.click();
    await expect(addBtn).toContainText('In Cart (3)');
  });

  test('should independently track cart state per product', async ({ page }) => {
    await page.getByTestId('btn-add-to-cart-1').click();
    await page.getByTestId('btn-add-to-cart-3').click();
    await page.getByTestId('btn-add-to-cart-3').click();

    await expect(page.getByTestId('btn-add-to-cart-1')).toContainText('In Cart (1)');
    await expect(page.getByTestId('btn-add-to-cart-2')).toHaveText('Add to Cart');
    await expect(page.getByTestId('btn-add-to-cart-3')).toContainText('In Cart (2)');
  });
});
