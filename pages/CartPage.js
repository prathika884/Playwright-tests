export class CartPage {
  constructor(page) {
    this.page             = page;
    this.heading          = page.getByTestId('cart-heading');
    this.emptyCart        = page.getByTestId('empty-cart');
    this.cartItems        = page.getByTestId('cart-items');
    this.cartSubtotal     = page.getByTestId('cart-subtotal');
    this.cartTotal        = page.getByTestId('cart-total');
    this.checkoutButton   = page.getByTestId('btn-checkout');
    this.orderSuccess     = page.getByTestId('order-success');
    this.continueShopping = page.getByTestId('btn-continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async increaseQuantity(productId) {
    await this.page.getByTestId(`btn-increase-${productId}`).click();
  }

  async decreaseQuantity(productId) {
    await this.page.getByTestId(`btn-decrease-${productId}`).click();
  }

  async removeItem(productId) {
    await this.page.getByTestId(`btn-remove-${productId}`).click();
  }

  async getItemQuantity(productId) {
    return this.page.getByTestId(`cart-item-qty-${productId}`).textContent();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
