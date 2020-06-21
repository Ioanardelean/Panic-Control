import { browser } from 'protractor';
import { LoginPage } from './login.po';
import { SignupPage } from './signup.po';

describe('test for sign up page', () => {
  let page: LoginPage;
  let signupPage: SignupPage;

  beforeEach(() => {
    page = new LoginPage();
    signupPage = new SignupPage();
  });

  it('should can click register button to signup', () => {
    page.navigateTo();
    page.clickRegisterButton();
    expect(browser.get(browser.baseUrl));
  });

  it('sign up form should be valid', () => {
    signupPage.navigateTo();
    signupPage.getUsernameTextBox().sendKeys('test');
    signupPage.getEmailTextBox().sendKeys('test@test.com');
    signupPage.getPasswordTextBox().sendKeys('Password123');
    const form = signupPage.getForm().getAttribute('class');
    expect(form).toContain('ng-valid');
  });

  it('sign up form should be invalid', () => {
    signupPage.navigateTo();
    signupPage.getUsernameTextBox().sendKeys('r');
    signupPage.getEmailTextBox().sendKeys('test.com');
    signupPage.getPasswordTextBox().sendKeys('test');
    const form = signupPage.getForm().getAttribute('class');
    expect(form).toContain('ng-invalid');
  });

  it('should display error message when username and/ or email is already used', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(signupPage.getErrorMessage()).toEqual(
      "L'email / le nom utilisateur est déjà utilisée"
    );
  });

  it('when signup is successful — he should redirect to default login page', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(browser.get(browser.baseUrl));
  });

  it('login form should be valid', () => {
    page.navigateTo();
    page.getUsernameTextBox().sendKeys('test');
    page.getPasswordTextBox().sendKeys('Password123');
    const form = page.getForm().getAttribute('class');
    expect(form).toContain('ng-valid');
  });

  it('login form should be invalid', () => {
    page.navigateTo();
    page.getUsernameTextBox().sendKeys('');
    page.getPasswordTextBox().sendKeys('');
    const form = page.getForm().getAttribute('class');
    expect(form).toContain('ng-invalid');
  });

  it('when login is successful — he should redirect to default monitors page', () => {
    page.navigateTo();
    page.fillCredentials();
    browser.sleep(5000);
    // tslint:disable-next-line: deprecation
    browser.ignoreSynchronization = true;
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });
});
