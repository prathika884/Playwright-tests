import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;
  readonly productsNav: Locator;
  readonly cartNav: Locator;
  readonly cartCount: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('header');
    this.logo = page.getByTestId('logo');
    this.productsNav = page.getByTestId('nav-products');
    this.cartNav = page.getByTestId('nav-cart');
    this.cartCount = page.getByTestId('cart-count');
    this.logoutButton = page.getByTestId('btn-logout');
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async navigateToProducts(): Promise<void> {
    await this.productsNav.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cartNav.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async getCartCount(): Promise<string | null> {
    if (await this.cartCount.isVisible()) {
      return this.cartCount.textContent();
    }
    return null;
  }
}
