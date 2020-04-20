import { LoginPage } from './login.po';
import { SignupPage } from '../signup/signup.po';
import { browser } from 'protractor';

describe('test for login page', () => {
  let page: LoginPage;
  let signupPage: SignupPage;

  const wrongCredentias = {
    username: 'wrongname',
    password: 'wrongpasswd',
  };

  beforeEach(() => {
    page = new LoginPage();
    signupPage = new SignupPage();
  });
  it('should display “Login” title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Login');
  });

  it('when user trying to login with wrong credentials he should stay on “login” page and see error notification', () => {
    page.navigateTo();
    page.fillCredentials(wrongCredentias);
    expect(page.getTitleText()).toEqual('Login');
    expect(page.getErrorMessage()).toEqual(`Bad username or passwords don't match`);
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
