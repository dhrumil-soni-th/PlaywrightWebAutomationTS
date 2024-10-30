import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";

test.describe("Smoke Test - Login and Logout Workflow", async () => {
  test("Scenario 2: Verify Login and Logout Workflow", async ({ page }) => {
    await page.goto(config.applicationUrl);
    await page.waitForLoadState("networkidle");

    const navigationMenu = page.locator(".navbar-menu-links");
    expect(await navigationMenu.first().isVisible()).toBe(true);
    await navigationMenu.first().click();

    await page.getByRole("button", { name: "Log in" }).click();

    const landingUrl: string = page.url();
    console.log("Landing URL: " + landingUrl);
    expect(landingUrl).toContain("login");

    const email = page.locator("#email1");
    const password = page.locator("#password1");

    await email.fill(config.email);
    await password.fill(config.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page
      .locator("h4.welcomeMessage")
      .waitFor({ state: "visible", timeout: 5000 });
    const welcomeMessage = await page
      .locator("h4.welcomeMessage")
      .textContent();
    console.log("Welcome Message: " + welcomeMessage);
    expect(welcomeMessage).toContain("Welcome");

    const postLoginNavigationMenu = page.locator("img[alt='menu']");
    await postLoginNavigationMenu.click();
    await page.getByRole("button", { name: "Sign out" }).click();

    // Verify sign in button is visible
    await page
      .getByRole("button", { name: "Sign in" })
      .waitFor({ state: "visible", timeout: 5000 });
    expect(
      await page.getByRole("button", { name: "Sign in" }).isVisible()
    ).toBe(true);
  });
});
