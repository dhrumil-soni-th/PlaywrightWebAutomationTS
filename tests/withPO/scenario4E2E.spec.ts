import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";
import { LoginPage } from "../pageObjects/loginPage.ts";
import { HomePage } from "../pageObjects/homePage.ts";
import { CoursePage } from "../pageObjects/coursePage.ts";
import path from "path";

test.describe("End to End Automation Test: Course Management", async () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let coursePage: CoursePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    coursePage = new CoursePage(page);
  });

  /* Test Steps:
  1. Navigate to the login page
  2. Login with valid credentials
  3. Navigate to the manage course page
  4. Add new course
  5. Verify Add new course modal is visible
  6. Fill course details
  7. Upload invalid image
  8. Upload valid image
  9. Verify permanent checkbox is unchecked
  10. Select category Playwright
  11. Set start and end dates
  12. Save course
  13. Verify course is created successfully
  14. Delete course
  15. Verify course is deleted successfully 
  16. Sign out
  17. Verify sign in button is visible
  */

  test("Scenario 4: New course creation/deletion", async ({ page }) => {
    const courseTitle: string = "PW API Automation";
    const invalidImagePath: string = path.join(
      __dirname,
      "../data/ImageGreaterThanAllowedSize.jpg"
    );
    const validImagePath: string = path.join(
      __dirname,
      "../data/courseSampleImage.png"
    );
    const courseDescription: string = "PW API Automation Description";
    const instructorName: string = "Dhrumil Soni";
    const price: string = "10000";

    // Navigate to the page
    await page.goto(config.applicationUrl + "/login");

    await loginPage.waitForPageLoad();
    await loginPage.signIn(config.email, config.password);

    await homePage.waitForPageLoad();
    await homePage.hoverOnManageOption();
    await homePage.clickOnManageCourseOption();
    await page.waitForURL("**/course/manage");

    // Verify landing URL contains /course/manage
    expect(await homePage.getPageUrl()).toContain("/course/manage");

    await coursePage.clickAddNewCourseButton();
    expect(await coursePage.isAddNewCourseModalVisible()).toBe(true);
    await coursePage.fillCourseDetails(
      courseTitle,
      courseDescription,
      instructorName,
      price
    );

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe("File size should be less than 1MB");
      await dialog.accept();
    });
    await coursePage.uploadCourseImage(invalidImagePath);
    await coursePage.uploadCourseImage(validImagePath);

    // Verify permanent checkbox is unchecked
    expect(await coursePage.isPermanentCheckboxChecked()).toBe(false);
    await coursePage.selectCategory("Playwright");

    await coursePage.setStartAndEndDates();
    await coursePage.saveCourse();
    const isCourseAdded: boolean = await coursePage.isCourseCreated(
      courseTitle
    );

    // Verify course is created successfully
    expect(isCourseAdded).toBe(true);

    await coursePage.deleteCourse(courseTitle);
    const isCourseDeleted: boolean = await coursePage.isCourseDeleted(
      courseTitle
    );

    // Verify course is deleted successfully
    expect(isCourseDeleted).toBe(true);

    await homePage.postLoginNavigationMenuClick();
    await homePage.clickSignOutOption();

    // Verify sign in button is visible
    expect(await loginPage.isSignInButtonVisible()).toBe(true);
  });
});
