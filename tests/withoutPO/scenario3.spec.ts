import { test, expect } from "@playwright/test";

test.describe("Smoke Test- User Sign Up", async () => {
  test("Scenario 3: Verify user can sign up successfully", async ({ page }) => {
    page.goto("https://freelance-learn-automation.vercel.app/login");
    const signUpLink = page.locator("a[href='/signup']");
    const isClickable = await signUpLink.isEnabled();
    expect(isClickable).toBe(true);
    await signUpLink.click();

    await page
      .locator("h2.header")
      .waitFor({ state: "visible", timeout: 5000 });
    const header = await page.locator("h2.header").textContent();
    expect(header).toContain("Sign Up");

    const signUpUrl: string = page.url();
    expect(signUpUrl).toContain("signup");

    await page.locator("#name").fill("John");
    await page.locator("#email").fill("john@example.com");
    await page.locator("#password").fill("password123");

    await page.getByLabel("Playwright").check();
    await page.getByLabel("Selenium").check();

    await page.locator("#state").selectOption("Gujarat");
    await page.locator("#hobbies").selectOption(["Reading", "Playing"]);
    await page.waitForTimeout(2000);

    await page.getByRole("button", { name: "Sign up" }).click();

    await page
      .locator('text="Signup successfully, Please login!"')
      .waitFor({ state: "visible", timeout: 5000 });
    const successMessage = page.locator("div[role='alert'] div:nth-child(2)", {
      hasText: "Signup successfully, Please login!",
    });
    expect(await successMessage.isVisible()).toBe(true);
    console.log("Successfully completed scenario 3");
  });
});
