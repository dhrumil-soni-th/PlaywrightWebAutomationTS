import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator("#email1");
    this.passwordInput = page.locator("#password1");
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.signUpLink = page.locator("a[href='/signup']");
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async isSignInButtonVisible(): Promise<boolean> {
    await this.signInButton.waitFor({ state: "visible", timeout: 5000 });
    return await this.isElementVisible(this.signInButton);
  }

  async isSignUpLinkEnabled(): Promise<boolean> {
    return await this.signUpLink.isEnabled();
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }
}
