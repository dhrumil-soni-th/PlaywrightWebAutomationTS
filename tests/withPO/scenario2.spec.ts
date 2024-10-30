import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";
import { HomePage } from "../pageObjects/homePage";
import { LoginPage } from "../pageObjects/loginPage";

test.describe("Smoke Test - Login and Logout Workflow", async () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  /* Test Steps:
  1. Navigate to the application URL
  2. Verify navigation menu is visible
  3. Click on navigation menu
  4. Click on Log in option
  5. Verify landing URL contains login
  6. Enter email and password
  7. Click on sign in button
  8. Verify welcome message is visible
  9. Click on navigation menu
  10. Click on sign out option
  11. Verify sign in button is visible
  */

  test("Scenario 2: Verify Login and Logout Workflow", async ({ page }) => {
    // Navigate to the application URL
    console.log("Navigating to the application URL: " + config.applicationUrl);
    await page.goto(config.applicationUrl);
    await homePage.waitForPageLoad();

    // Verify navigation menu is visible
    expect(await homePage.isNavigationMenuVisible()).toBe(true);

    await homePage.clickNavigationMenu();
    await homePage.clickLogInOption();

    // Verify landing URL contains login
    const landingUrl: string = await homePage.getPageUrl();
    expect(landingUrl).toContain("login");

    await loginPage.signIn(config.email, config.password);
    console.log("Welcome Message: " + (await homePage.getWelcomeMessage()));

    // Verify welcome message is visible
    expect(await homePage.getWelcomeMessage()).toContain("Welcome");

    await homePage.postLoginNavigationMenuClick();
    await homePage.clickSignOutOption();

    // Verify sign in button is visible
    expect(await loginPage.isSignInButtonVisible()).toBe(true);
  });
});
