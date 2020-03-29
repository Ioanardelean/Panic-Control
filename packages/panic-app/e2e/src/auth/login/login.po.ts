import { browser, by, element } from 'protractor';

export class LoginPage {
  private credentias = {
    username: 'test',
    password: 'Atest123',
  };
  navigateTo(): Promise<unknown> {
    return browser.get('/auth/login') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-login h1')).getText() as Promise<string>;
  }
  clickRegisterButton() {
    return element(by.css('#signup')).click();
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[formControlName="username"]')).sendKeys(credentias.username);
    element(by.css('[formControlName="password"]')).sendKeys(credentias.password);
    element(by.css('#login')).click();
  }

  getErrorMessage() {
    return element(by.css('.toast-message')).getText();
  }
  getSuccessMessage() {
    return element(by.css('.toast-message')).getText();
  }
}
