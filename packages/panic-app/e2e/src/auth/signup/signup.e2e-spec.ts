import { SignupPage } from '../signup/signup.po';
import { browser } from 'protractor';
import { LoginPage } from '../login/login.po';

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
    expect(signupPage.getTitleText()).toEqual('Sign up');
  });

  it('when user trying to signup with wrong credentials he should stay on “signup” page and see error notification', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials(wrongCredentiasR);
    expect(signupPage.getTitleText()).toEqual('Sign up');
    expect(signupPage.getErrorMessage()).toEqual('Email or password is invalid');
  });

  it('should display error message when username is already used', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(signupPage.getErrorMessage()).toEqual(
      'La clé « (username)=(test) » existe déjà.'
    );
  });
  it('should display error message when email address is already used', () => {
    signupPage.navigateTo();
    signupPage.fillCredentialsSamePassword();
    expect(signupPage.getErrorMessage()).toEqual(
      'La clé « (email)=(test@test.com) » existe déjà.'
    );
  });

  it('when signup is successful — he should redirect to default login page', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials();
    expect(browser.get(browser.baseUrl));
  });
});
