import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class SignUpPage extends BasePage {
  private readonly signUpHeader: Locator;
  private readonly name: Locator;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly signUpButton: Locator;
  private readonly signUpSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.signUpHeader = page.locator("h2.header");
    this.name = page.locator("#name");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.signUpButton = page.getByRole("button", { name: "Sign up" });
    this.signUpSuccessMessage = page.locator(
      "div[role='alert'] div:nth-child(2)",
      { hasText: "Signup successfully, Please login!" }
    );
  }
  async signUp(
    name: string,
    email: string,
    password: string,
    interests: string[],
    state: string,
    hobbies: string[]
  ) {
    await this.name.waitFor({ state: "visible", timeout: 5000 });
    await this.name.fill(name);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.selectInterests(interests);
    await this.selectState(state);
    await this.selectHobbies(hobbies);
    await this.page.waitForTimeout(2000);
    await this.clickSignUpButton();
  }

  async getSignUpPageHeader(): Promise<string | null> {
    await this.signUpHeader.waitFor({ state: "visible", timeout: 5000 });
    return await this.getElementText(this.signUpHeader);
  }

  async selectInterest(interest: string) {
    await this.page.getByLabel(interest).check();
  }

  async selectInterests(interests: string[]) {
    for (const interest of interests) {
      await this.page.getByLabel(interest).check();
    }
  }

  async selectState(state: string) {
    await this.page.locator("#state").selectOption(state);
  }

  async selectHobbies(hobbies: string[]) {
    await this.page.locator("#hobbies").selectOption(hobbies);
  }

  async clickSignUpButton() {
    await this.signUpButton.click();
  }

  async isSignUpSuccessMessageVisible(): Promise<boolean> {
    await this.signUpSuccessMessage.waitFor({
      state: "visible",
      timeout: 5000,
    });
    return await this.signUpSuccessMessage.isVisible();
  }
}
