import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class CategoryPage extends BasePage {
  private readonly addNewCategoryButton: Locator;
  private readonly allCategories: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewCategoryButton = page.getByRole("button", {
      name: "Add New Category",
    });
    this.allCategories = page.locator("tbody tr td:nth-child(1)");
    this.confirmDeleteButton = page.locator(
      "div.modal-footer button:nth-child(2)"
    );
  }

  async waitForCategoryPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL("**/category/manage");
  }

  async clickAddNewCategoryButton(): Promise<void> {
    await this.clickElement(this.addNewCategoryButton);
    this.page.once("dialog", async (dialog) => {
      if (dialog.message().includes("Enter a Category Name")) {
        await dialog.accept("Test Category Sample");
      }
    });
  }

  async getAllCategoriesText(): Promise<string[]> {
    return await this.allCategories.allTextContents();
  }

  async isCategoryVisible(page: Page, categoryName: string): Promise<boolean> {
    let categoryAppeared = false;
    for (let i = 0; i < 10; i++) {
      const allCategories = await this.getAllCategoriesText();
      if (allCategories.includes(categoryName)) {
        categoryAppeared = true;
        break;
      }
      await this.page.waitForTimeout(500); // Wait before the next check
    }
    return categoryAppeared;
  }

  async updateCategory(page: Page, categoryName: string): Promise<void> {
    const categoryRow = page.locator("tbody tr").filter({
      has: page.locator("td:nth-child(1)", {
        hasText: categoryName,
      }),
    });
    await categoryRow.first().waitFor({ state: "visible", timeout: 5000 });
    const updateButton = categoryRow
      .first()
      .locator("button.action-btn:has-text('Update')");
    await updateButton.scrollIntoViewIfNeeded();
    await updateButton.click();
  }

  async deleteCategory(page: Page, categoryName: string): Promise<void> {
    const categoryRow = page.locator("tbody tr").filter({
      has: page.locator("td:nth-child(1)", {
        hasText: categoryName,
      }),
    });
    await categoryRow.first().waitFor({ state: "visible", timeout: 5000 });
    const deleteButton = categoryRow
      .first()
      .locator("button.action-btn:has-text('Delete')");
    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();
    await this.confirmDeleteButton.click();
    await page.waitForTimeout(1000);
  }
}
