export class ProductsPage {
  constructor(page) {
    this.page           = page;
    this.heading        = page.getByTestId('products-heading');
    this.searchInput    = page.getByTestId('search-input');
    this.productsGrid   = page.getByTestId('products-grid');
    this.noResults      = page.getByTestId('no-results');
    this.cartButton     = page.getByTestId('nav-cart');
    this.cartCount      = page.getByTestId('cart-count');
    this.logoutButton   = page.getByTestId('btn-logout');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async searchFor(text) {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category) {
    await this.page.getByTestId(`filter-${category.toLowerCase()}`).click();
  }

  async addProductToCart(productId) {
    await this.page.getByTestId(`btn-add-to-cart-${productId}`).click();
  }

  async getProductName(productId) {
    return this.page.getByTestId(`product-name-${productId}`).textContent();
  }

  async getProductPrice(productId) {
    return this.page.getByTestId(`product-price-${productId}`).textContent();
  }

  /** Returns the count of product cards currently visible in the grid. */
  async getVisibleProductCount() {
    return this.page.locator('[data-testid^="product-card-"]').count();
  }
}
