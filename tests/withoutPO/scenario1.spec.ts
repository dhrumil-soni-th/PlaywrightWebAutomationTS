import { expect, test } from "@playwright/test";
import { config } from "../config/config.ts";

test.describe("Smoke Test Suite - Home Page Validation", async () => {
  test("Scenario 1: Validate Home Page Elements", async ({ page }) => {
    // Navigate to the page
    await page.goto(config.applicationUrl);

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Verify the page title
    const pageTitle: string = await page.title();
    console.log("Page Title: " + pageTitle);
    expect(pageTitle).toBe("Learn Automation Courses");

    // Verify the page heading
    await page.locator("h1").waitFor({ state: "visible", timeout: 3000 });
    const pageHeading: string | null = await page.locator("h1").textContent();
    console.log("Page Heading: " + pageHeading);
    expect(await page.locator("h1").textContent()).toBe(
      "Learn Automation Courses"
    );

    // Verify course cards count is greater than 0
    const courses = await page.locator("div.course-card.row");
    console.log("Courses Count: " + (await courses.count()));
    expect(await courses.count()).toBeGreaterThan(0);

    // Verify the footer social media icons count is greater than 0
    const footerSocialMediaIcons = await page.locator("div.social-btns a");
    console.log(
      "Footer Social Media Icons Count: " +
        (await footerSocialMediaIcons.count())
    );
    expect(await footerSocialMediaIcons.count()).toBeGreaterThan(0);
  });
});
