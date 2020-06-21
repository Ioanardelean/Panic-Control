import { browser, by, element } from 'protractor';

export class LoginPage {
  private credentials = {
    username: 'test',
    password: 'Atest123',
  };
  navigateTo(): Promise<unknown> {
    return browser.get('/auth/login') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-login h1')).getText() as Promise<string>;
  }

  getUsernameTextBox() {
    return element(by.css('#username'));
  }

  getPasswordTextBox() {
    return element(by.css('#password'));
  }

  getForm() {
    return element(by.css('#form'));
  }
  clickRegisterButton() {
    return element(by.css('#signup')).click();
  }

  fillCredentials(credentials: any = this.credentials) {
    element(by.css('[formControlName="username"]')).sendKeys(credentials.username);
    element(by.css('[formControlName="password"]')).sendKeys(credentials.password);
    element(by.css('#login')).click();
  }

  getErrorMessage() {
    return element(by.css('.toast-message')).getText();
  }
  getSuccessMessage() {
    return element(by.css('.toast-message')).getText();
  }
}
