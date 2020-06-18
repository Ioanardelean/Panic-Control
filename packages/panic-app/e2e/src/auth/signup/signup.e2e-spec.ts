import { SignupPage } from '../signup/signup.po';

import { LoginPage } from '../login/login.po';
import { browser, by, element, protractor } from 'protractor';

describe('test for sign up page', () => {
  let page: LoginPage;
  let signupPage: SignupPage;

  const wrongCredentiasR = {
    username: 'wrongname',
    email: 'wrongemailm.Com',
    password: 'wrongpasswd',
  };

  beforeEach(() => {
    page = new LoginPage();
    signupPage = new SignupPage();
  });

  it('should can click register button to signup', () => {
    page.navigateTo();
    page.clickRegisterButton();
    expect(browser.get(browser.baseUrl));
  });

  it('should can click register button to signup', () => {
    page.navigateTo();
    page.clickRegisterButton();
    expect(browser.get(browser.baseUrl));
  });

  it('should display “Sign up” title', () => {
    signupPage.navigateTo();
    expect(signupPage.getTitleText()).toEqual('S\'inscrire');
  });


  it('should display error message when username and/ or email is already used', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(signupPage.getErrorMessage()).toEqual(
      'L\'email / le nom utilisateur est déjà utilisée'
    );
  });

  it('when signup is successful — he should redirect to default login page', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(browser.get(browser.baseUrl));
  });
});
