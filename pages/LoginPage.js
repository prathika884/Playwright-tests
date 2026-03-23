export class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginTitle    = page.getByTestId('login-title');
    this.loginForm     = page.getByTestId('login-form');
    this.emailInput    = page.getByTestId('input-email');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton   = page.getByTestId('btn-login');
    this.errorMessage  = page.getByTestId('login-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithValidCredentials() {
    await this.login('admin@example.com', 'password123');
  }
}
