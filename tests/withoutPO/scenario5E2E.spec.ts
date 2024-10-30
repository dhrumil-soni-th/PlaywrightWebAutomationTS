import { test, expect, BrowserContext } from "@playwright/test";
import { config } from "../config/config.ts";
import path from "path";

test.describe("End to End Automation Test: Category Management", async () => {
  test("Scenario 5: Category creation, update and delete", async ({
    page,
    context,
  }) => {
    // Navigate to the page
    await page.goto(config.applicationUrl + "/login");
    await page.waitForLoadState("networkidle");

    const email = page.locator("#email1");
    const password = page.locator("#password1");
    await email.fill(config.email);
    await password.fill(config.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.locator(".nav-menu-item-manage").hover();

    const [categoryPage] = await Promise.all([
      context.waitForEvent("page"), // Waits for the new tab to open
      page.getByText("Manage Categories").click(), // Triggers the new tab to open
    ]);

    await categoryPage.waitForURL("**/category/manage");
    expect(await categoryPage.url()).toContain("/category/manage");

    categoryPage.on("dialog", async (dialog) => {
      if (dialog.message().includes("Enter a Category Name")) {
        await dialog.accept("Test Category Sample");
      } else if (dialog.message().includes("Update the category")) {
        await dialog.accept("Test Category Sample Updated");
      }
    });

    await categoryPage
      .getByRole("button", { name: "Add New Category" })
      .click();

    // Wait and verify if the new category appears in the list
    let categoryAppeared = false;
    for (let i = 0; i < 10; i++) {
      const allCategories = await categoryPage
        .locator("tbody tr td:nth-child(1)")
        .allTextContents();
      if (allCategories.includes("Test Category Sample")) {
        categoryAppeared = true;
        break;
      }
      await categoryPage.waitForTimeout(500); // Wait before the next check
    }
    expect(categoryAppeared).toBe(true);
    // On clicking, it will open JS alert and type category name and click OK
    // await categoryPage.waitForSelector("tbody tr td:nth-child(1)");  // Wait for table to populate
    // await categoryPage.waitForLoadState("domcontentloaded");
    // const allCategories = await categoryPage
    //   .locator("tbody tr td:nth-child(1)")
    //   .allTextContents();
    // expect(allCategories).toContain("Test Category Sample");
    //expect(allCategories.includes("Test Category Sample")).toBe(true);

    const categoryRow = await categoryPage.locator("tbody tr").filter({
      has: categoryPage.locator("td:nth-child(1)", {
        hasText: "Test Category Sample",
      }),
    });

    // Ensure the first row containing 'Test Category Sample' is targeted
    await categoryRow.first().waitFor({ state: "visible", timeout: 5000 });
    const updateButton = categoryRow
      .first()
      .locator("button.action-btn:has-text('Update')");
    // Scroll and ensure visibility
    await updateButton.scrollIntoViewIfNeeded();
    await updateButton.click();

    let categoryUpdated = false;
    for (let i = 0; i < 10; i++) {
      const allCategoriesPostUpdate = await categoryPage
        .locator("tbody tr td:nth-child(1)")
        .allTextContents();
      if (allCategoriesPostUpdate.includes("Test Category Sample Updated")) {
        categoryUpdated = true;
        break;
      }
      await categoryPage.waitForTimeout(500); // Wait before the next check
    }
    expect(categoryUpdated).toBe(true);

    // // On clicking, it will open JS alert and type category name and click OK
    // await categoryPage.waitForSelector("tbody tr td:nth-child(1)");
    // await categoryPage.waitForLoadState("domcontentloaded");
    // const allCategoriesPostUpdate = await categoryPage
    //   .locator("tbody tr td:nth-child(1)")
    //   .allTextContents();
    // expect(allCategoriesPostUpdate).toContain("Test Category Sample Updated");
    // // expect(
    // //   allCategoriesPostUpdate.includes("Test Category Sample Updated")
    // // ).toBe(true);

    const categoryRowUpdated = await categoryPage.locator("tbody tr").filter({
      has: categoryPage.locator("td:nth-child(1)", {
        hasText: "Test Category Sample Updated",
      }),
    });
    await categoryRowUpdated
      .first()
      .waitFor({ state: "visible", timeout: 5000 });

    const deleteButton = categoryRowUpdated
      .first()
      .locator("button.action-btn:has-text('Delete')");
    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();

    const deleteConfirmationMessage = categoryPage.locator("div.modal-body");
    await expect(deleteConfirmationMessage).toContainText(
      "Are you sure that you want to delete this category?"
    );
    await categoryPage.locator("div.modal-footer button:nth-child(2)").click();

    await categoryPage.waitForTimeout(2000);
    const allCategoriesAfterDelete = await categoryPage
      .locator("tbody tr td:nth-child(1)")
      .allTextContents();
    expect(
      allCategoriesAfterDelete.includes("Test Category Sample Updated")
    ).toBe(false);

    console.log("Successfully completed scenario 5");
  });
});
