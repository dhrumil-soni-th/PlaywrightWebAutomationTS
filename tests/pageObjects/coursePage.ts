import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class CoursePage extends BasePage {
  private readonly addNewCourseButton: Locator;
  private readonly addNewCourseModal: Locator;
  private readonly courseName: Locator;
  private readonly courseDescription: Locator;
  private readonly instructorName: Locator;
  private readonly price: Locator;
  private readonly chooseFileButton: Locator;
  private readonly permanentCheckbox: Locator;
  private readonly categoryOption: Locator;
  private readonly startDateInput: Locator;
  private readonly endDateInput: Locator;
  private readonly saveButton: Locator;
  private readonly allCourseTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewCourseButton = page.getByRole("button", {
      name: "Add New Course",
    });
    this.addNewCourseModal = page.locator("div.title.modal-title.h4");
    this.courseName = page.locator("#name");
    this.courseDescription = page.locator("#description");
    this.instructorName = page.locator("#instructorNameId");
    this.price = page.locator("#price");
    this.chooseFileButton = page.locator("input[type$='file']");
    this.permanentCheckbox = page.locator("#isPermanent");
    this.categoryOption = page.locator(".menu-btn");
    this.startDateInput = page.locator('input[name="startDate"]');
    this.endDateInput = page.locator('input[name="endDate"]');
    this.saveButton = page.getByText("Save");
    this.allCourseTitles = page.locator("tbody tr td:nth-child(2)");
  }

  async clickAddNewCourseButton(): Promise<void> {
    await this.clickElement(this.addNewCourseButton);
  }

  async isAddNewCourseModalVisible(): Promise<boolean> {
    await this.addNewCourseModal.waitFor({ state: "visible", timeout: 5000 });
    return await this.isElementVisible(this.addNewCourseModal);
  }

  async fillCourseDetails(
    courseName: string,
    courseDescription: string,
    instructorName: string,
    price: string
  ): Promise<void> {
    await this.enterValuesInElement(this.courseName, courseName);
    await this.enterValuesInElement(this.courseDescription, courseDescription);
    await this.enterValuesInElement(this.instructorName, instructorName);
    await this.enterValuesInElement(this.price, price);
  }

  async uploadCourseImage(filePath: string) {
    await this.chooseFileButton.setInputFiles(filePath);
  }

  async isPermanentCheckboxChecked(): Promise<boolean> {
    return await this.permanentCheckbox.isChecked();
  }

  async selectCategory(category: string): Promise<void> {
    await this.categoryOption.click();
    await this.page.getByRole("button", { name: category }).click();
  }

  async setStartAndEndDates() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const formattedStartDate = `${
      startDate.getMonth() + 1
    }/${startDate.getDate()}/${startDate.getFullYear()}`;
    const formattedEndDate = `${
      endDate.getMonth() + 1
    }/${endDate.getDate()}/${endDate.getFullYear()}`;

    await this.startDateInput.fill(formattedStartDate);
    await this.endDateInput.fill(formattedEndDate);
  }

  async saveCourse() {
    await this.clickElement(this.saveButton);
    await this.page.waitForLoadState("networkidle");
  }

  async isCourseCreated(courseTitle: string): Promise<boolean> {
    await this.page.waitForSelector(
      `tbody tr td:nth-child(2):text("${courseTitle}")`,
      { state: "visible", timeout: 5000 }
    );
    const allCourses: string[] = await this.allCourseTitles.allTextContents();
    if (allCourses.includes(courseTitle)) {
      return true;
    } else {
      return false;
    }
  }

  async deleteCourse(courseTitle: string) {
    const courseRow = await this.page.locator(
      `tbody tr:has(td:nth-child(2):text("${courseTitle}"))`
    );
    await courseRow.locator("button.action-btn.delete-btn").click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForSelector(
      `tbody tr:has(td:nth-child(2):text("${courseTitle}"))`,
      { state: "detached", timeout: 5000 }
    );
  }

  async isCourseDeleted(courseTitle: string): Promise<boolean> {
    const allCoursesAfterDelete: string[] =
      await this.allCourseTitles.allTextContents();
    if (allCoursesAfterDelete.includes(courseTitle)) {
      return false;
    } else {
      return true;
    }
  }
}
