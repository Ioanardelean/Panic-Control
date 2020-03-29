import { browser, by, element } from 'protractor';

export class SignupPage {
  private credentias = {
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
    return browser.get('auth/singup') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-signup h1')).getText() as Promise<string>;
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[formControlName="username"]')).sendKeys(credentias.username);
    element(by.css('[formControlName="email"]')).sendKeys(credentias.email);
    element(by.css('[formControlName="password"]')).sendKeys(credentias.password);
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
    return element(by.css('.toast-message')).getText();
  }
}
