import { test, expect } from "@playwright/test";
import { config } from "../config/config.ts";
import { LoginPage } from "../pageObjects/loginPage.ts";
import { HomePage } from "../pageObjects/homePage.ts";
import { CategoryPage } from "../pageObjects/categoryPage.ts";

test.describe("End to End Automation Test: Category Management", async () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  /*
  Test Steps:
  1. Navigate to the login page
  2. Login with valid credentials
  3. Navigate to the manage category page
  4. Add new category
  5. Verify Add new category modal is visible
  6. Fill category details
  7. Save category
  8. Verify category is created successfully
  9. Update category
  10. Verify category is updated successfully
  11. Delete category
  12. Verify category is deleted successfully
  */
  test("Scenario 5: Category creation, update and delete", async ({
    page,
    context,
  }) => {
    // Navigate to the page
    await page.goto(config.applicationUrl + "/login");
    await page.waitForLoadState("networkidle");
    await loginPage.signIn(config.email, config.password);

    await homePage.hoverOnManageOption();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"), // Waits for the new tab to open
      page.getByText("Manage Categories").click(), // Triggers the new tab to open
    ]);

    categoryPage = new CategoryPage(newPage);
    await categoryPage.waitForPageLoad();
    expect(await categoryPage.getPageUrl()).toContain("/category/manage");

    // Handle the dialog for adding a new category
    newPage.on("dialog", async (dialog) => {
      if (dialog.message().includes("Enter a Category Name")) {
        await dialog.accept("Test Category Sample");
      } else if (dialog.message().includes("Update the category")) {
        await dialog.accept("Test Category Sample Updated");
      }
    });

    await categoryPage.clickAddNewCategoryButton();
    const isCategoryCreated = await categoryPage.isCategoryVisible(
      newPage,
      "Test Category Sample"
    );
    expect(isCategoryCreated).toBe(true);

    await categoryPage.updateCategory(newPage, "Test Category Sample");
    const isCategoryUpdated = await categoryPage.isCategoryVisible(
      newPage,
      "Test Category Sample Updated"
    );
    expect(isCategoryUpdated).toBe(true);

    await categoryPage.deleteCategory(newPage, "Test Category Sample Updated");
    const isCategoryDeleted = await categoryPage.isCategoryVisible(
      newPage,
      "Test Category Sample Updated"
    );
    expect(isCategoryDeleted).toBe(false);
  });
});
