import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";
import { generateUniqueEmail } from "../../Utils/commonUtils.ts";
import { LoginPage } from "../pageObjects/loginPage.ts";
import { SignUpPage } from "../pageObjects/signUpPage.ts";

test.describe("Smoke Test- User Sign Up", async () => {
  let loginPage: LoginPage;
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
  });

  /*
       Test Steps:
       1. Navigate to the application URL
       2. Click on sign up link
       3. Verify sign up page header
       4. Verify landing URL contains signup
       5. Fill up sign up form
       6. Verify sign up success message
    */

  test("Scenario 3: Verify user can sign up successfully", async ({ page }) => {
    const data = {
      name: "Dhrumil Soni",
      email: generateUniqueEmail(),
      password: "password123",
      interests: ["Playwright", "Selenium"],
      state: "Gujarat",
      hobbies: ["Reading", "Playing"],
    };
    await page.goto(config.applicationUrl + "/login");
    expect(await loginPage.isSignUpLinkEnabled()).toBe(true);
    await loginPage.clickSignUpLink();

    expect(await signUpPage.getSignUpPageHeader()).toContain("Sign Up");
    expect(await signUpPage.getPageUrl()).toContain("signup");
    await signUpPage.signUp(
      data.name,
      data.email,
      data.password,
      data.interests,
      data.state,
      data.hobbies
    );
    expect(await signUpPage.isSignUpSuccessMessageVisible()).toBe(true);
  });
});
