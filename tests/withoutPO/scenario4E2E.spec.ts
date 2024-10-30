import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";
import path from "path";

test.describe("End to End Automation Test: Course Management", async () => {
  test("Scenario 4: New course creation/deletion", async ({ page }) => {
    // Navigate to the page
    await page.goto(config.applicationUrl + "/login");
    await page.waitForLoadState("networkidle");
    const email = page.locator("#email1");
    const password = page.locator("#password1");

    await email.fill(config.email);
    await password.fill(config.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.locator(".nav-menu-item-manage").hover();
    await page.getByText("Manage Courses").click();

    await page.waitForURL("**/course/manage");
    const currentUrl = await page.url();
    expect(currentUrl).toContain("/course/manage");

    await page.getByRole("button", { name: "Add New Course" }).click();
    await page
      .locator("div.title.modal-title.h4")
      .waitFor({ state: "visible", timeout: 5000 });

    const courseTitle: string = "PW API Automation";
    await page.locator("#name").fill(courseTitle);
    await page.locator("#description").fill("PW API Automation Description");
    await page.locator("#instructorNameId").fill("Dhrumil Soni");
    await page.locator("#price").fill("10000");

    // Set up a listener to handle the alert dialog
    page.on("dialog", async (dialog) => {
      // Validate the alert text
      expect(dialog.message()).toBe("File size should be less than 1MB");
      // Accept the alert by clicking "OK"
      await dialog.accept();
    });
    await page
      .locator("input[type$='file']")
      .setInputFiles([
        path.join(__dirname, "../data/ImageGreaterThanAllowedSize.jpg"),
      ]);
    await page
      .locator("input[type$='file']")
      .setInputFiles([path.join(__dirname, "../data/courseSampleImage.png")]);

    expect(await page.locator("#isPermanent").isChecked()).toBe(false);

    await page.locator(".menu-btn").click();
    await page.getByRole("button", { name: "Playwright" }).click();

    // Get today’s date and calculate the start and end dates
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start date as tomorrow (October 30 if today is October 29)
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Format dates in MM/DD/YYYY format (adjust format if needed)
    const formattedStartDate = `${
      startDate.getMonth() + 1
    }/${startDate.getDate()}/${startDate.getFullYear()}`;
    const formattedEndDate = `${
      endDate.getMonth() + 1
    }/${endDate.getDate()}/${endDate.getFullYear()}`;

    console.log(formattedStartDate, formattedEndDate);

    // Set the start date
    await page.locator('input[name="startDate"]').fill(formattedStartDate);

    // Set the end date
    await page.locator('input[name="endDate"]').fill(formattedEndDate);

    await page.getByText("Save").click();
    await page.waitForLoadState("domcontentloaded");

    await page.waitForSelector(
      `tbody tr td:nth-child(2):text("${courseTitle}")`,
      { state: "visible", timeout: 5000 }
    );
    const allCourses = await page
      .locator("tbody tr td:nth-child(2)")
      .allTextContents();
    expect(allCourses.includes(courseTitle)).toBe(true);
    if (allCourses.includes(courseTitle)) {
      console.log("Course created successfully and present in the table");
    } else {
      console.log(
        "Course not created successfully and not present in the table"
      );
    }

    const courseRow = await page.locator(
      `tbody tr:has(td:nth-child(2):text("${courseTitle}"))`
    );
    await courseRow.locator("button.action-btn.delete-btn").click();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(
      `tbody tr:has(td:nth-child(2):text("${courseTitle}"))`,
      { state: "detached", timeout: 5000 }
    );

    const allCoursesAfterDelete = await page
      .locator("tbody tr td:nth-child(2)")
      .allTextContents();
    expect(allCoursesAfterDelete.includes(courseTitle)).toBe(false);

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
    console.log("Scenario 4 E2E implementation completed successfully");
  });
});
