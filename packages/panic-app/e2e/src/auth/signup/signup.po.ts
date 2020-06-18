import { browser, by, element } from 'protractor';

export class SignupPage {
  private credentials = {
    username: 'test',
    email: 'test@test.com',
    password: 'Atest123',
  };

  private credentialsSamePassword = {
    username: 'anothertest',
    email: 'test@test.com',
    password: 'Atest123',
  };
  navigateTo(): Promise<unknown> {
    return browser.get('auth/signup') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-signup h1')).getText() as Promise<string>;
  }

  fillCredentials(credentials: any = this.credentials) {
    element(by.css('[formControlName="username"]')).sendKeys(credentials.username);
    element(by.css('[formControlName="email"]')).sendKeys(credentials.email);
    element(by.css('[formControlName="password"]')).sendKeys(credentials.password);
    element(by.css('#signup')).click();
  }

  fillCredentialsSamePassword(
    credentialsSamePassword: any = this.credentialsSamePassword
  ) {
    element(by.css('[formControlName="username"]')).sendKeys(
      credentialsSamePassword.username
    );
    element(by.css('[formControlName="email"]')).sendKeys(credentialsSamePassword.email);
    element(by.css('[formControlName="password"]')).sendKeys(
      credentialsSamePassword.password
    );
    element(by.css('#signup')).click();
  }
  getErrorMessage() {
    return element(by.css('.toast-message')).getText();
  }
  getSuccessMessage() {
    return element(by.css('#toast-container .toast-message')).getText();
  }

}
