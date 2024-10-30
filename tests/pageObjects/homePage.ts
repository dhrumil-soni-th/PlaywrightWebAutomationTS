import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export class HomePage extends BasePage {
  private readonly homePageHeading: Locator;
  private readonly courseCards: Locator;
  private readonly footerSocialMediaIcons: Locator;
  private readonly navigationMenu: Locator;
  private readonly logInOption: Locator;
  private readonly welcomeMessage: Locator;
  private readonly signOutOption: Locator;
  private readonly postLoginNavigationMenu: Locator;
  private readonly manageOption: Locator;
  private readonly manageCoursesOption: Locator;

  constructor(page: Page) {
    super(page);
    this.homePageHeading = page.locator("h1");
    this.courseCards = page.locator("div.course-card.row");
    this.footerSocialMediaIcons = page.locator("div.social-btns a");
    this.navigationMenu = page.locator(".navbar-menu-links");
    this.logInOption = page.getByRole("button", { name: "Log in" });
    this.welcomeMessage = page.locator("h4.welcomeMessage");
    this.signOutOption = page.getByRole("button", { name: "Sign out" });
    this.postLoginNavigationMenu = page.locator("img[alt='menu']");
    this.manageOption = page.locator(".nav-menu-item-manage");
    this.manageCoursesOption = page.getByText("Manage Courses");
  }

  async getHomePageTitle(): Promise<string> {
    return await this.getPageTitle();
  }

  async getHomePageHeadingText(): Promise<string | null> {
    return await this.getElementText(this.homePageHeading);
  }

  async getCoursesCount(): Promise<number> {
    const coursesCount = await this.getElementCount(this.courseCards);
    return coursesCount;
  }

  async getFooterSocialMediaIconsCount(): Promise<number> {
    const footerSocialMediaIconsCount = await this.getElementCount(
      this.footerSocialMediaIcons
    );
    return footerSocialMediaIconsCount;
  }

  async isNavigationMenuVisible(): Promise<boolean> {
    return await this.navigationMenu.first().isVisible();
  }

  async clickNavigationMenu(): Promise<void> {
    await this.navigationMenu.first().click();
  }

  async clickLogInOption(): Promise<void> {
    await this.logInOption.click();
  }

  async getWelcomeMessage(): Promise<string | null> {
    await this.welcomeMessage.waitFor({ state: "visible", timeout: 5000 });
    const welcomeMessage = await this.getElementText(this.welcomeMessage);
    return welcomeMessage;
  }

  async postLoginNavigationMenuClick(): Promise<void> {
    await this.postLoginNavigationMenu.click();
  }

  async clickSignOutOption(): Promise<void> {
    await this.signOutOption.click();
  }

  async hoverOnManageOption(): Promise<void> {
    await this.manageOption.hover();
  }

  async clickOnManageCourseOption(): Promise<void> {
    await this.manageCoursesOption.click();
  }
}
