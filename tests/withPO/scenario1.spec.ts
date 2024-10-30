import { expect, test } from "@playwright/test";
import { config } from "../config/config.ts";
import { HomePage } from "../pageObjects/homePage.ts";

test.describe("Smoke Test Suite - Home Page Validation", async () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  /* Test Steps:
  1. Navigate to the application url
  2. Verify the page title
  3. Verify the page heading
  4. Verify the course cards count is greater than 0
  5. Verify the footer social media icons count is greater than 0
  */

  test("Scenario 1: Validate Home Page Elements", async ({ page }) => {
    const homePageTitle: string = "Learn Automation Courses";
    const homePageHeadingText: string = "Learn Automation Courses";

    // Navigate to the page & Wait for the page to load
    await page.goto(config.applicationUrl);
    await homePage.waitForPageLoad();

    // Assertions for Page Title
    const pageTitle: string = await homePage.getHomePageTitle();
    console.log("Page Title: " + pageTitle);
    expect(pageTitle).toBe(homePageTitle);

    // Assertions for Page Heading
    const pageHeading: string | null = await homePage.getHomePageHeadingText();
    console.log("Page Heading: " + pageHeading);
    expect(pageHeading).toBe(homePageHeadingText);

    // Verify Courses Count is Greater than 0
    const courseCount: number = await homePage.getCoursesCount();
    console.log("Courses Count: " + courseCount);
    expect(courseCount).toBeGreaterThan(0);

    // Verify Footer Social Media Icons Count is Greater than 0
    const footerSocialMediaIconsCount: number =
      await homePage.getFooterSocialMediaIconsCount();
    console.log(
      "Footer Social Media Icons Count: " + footerSocialMediaIconsCount
    );
    expect(footerSocialMediaIconsCount).toBeGreaterThan(0);
  });
});
