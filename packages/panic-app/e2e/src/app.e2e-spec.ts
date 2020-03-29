import { browser, logging, element } from 'protractor';
import { LoginPage } from './auth/login/login.po';
import { SignupPage } from './auth/signup/signup.po';
import { MonitorsPage } from './dashboard/monitors/monitors.po';
import { MonitorPage } from './dashboard/monitors/monitor.po';

describe('workspace simulation user experience', () => {
  let page: LoginPage;
  let signupPage: SignupPage;
  let monitors: MonitorsPage;
  let monitor: MonitorPage;

  beforeEach(() => {
    page = new LoginPage();
    signupPage = new SignupPage();
    monitors = new MonitorsPage();
    monitor = new MonitorPage();
  });

  const wrongCredentias = {
    username: 'wrongname',
    password: 'wrongpasswd',
  };
  const wrongCredentiasR = {
    username: 'wrongname',
    email: 'wrongemailm.Com',
    password: 'wrongpasswd',
  };

  const wrongFields = {
    name: 'test',
    description: 'test application',
    url: 'test/url',
    receiver: 'test.com',
    ping: 20,
    monitorInterval: 10,
  };

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Welcome');
  });

  it('should can click register button to signup', () => {
    page.navigateTo();
    page.clickRegisterButton();
    expect(browser.get(browser.baseUrl));
  });

  it('should display “join us” message', () => {
    signupPage.navigateTo();
    expect(signupPage.getTitleText()).toEqual('Join us');
  });

  it('when user trying to singup with wrong credentials he should stay on “signup” page and see error notification', () => {
    signupPage.navigateTo();
    signupPage.fillCredentials(wrongCredentiasR);
    expect(signupPage.getTitleText()).toEqual('Join us');
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

  it('when user trying to login with wrong credentials he should stay on “login” page and see error notification', () => {
    page.navigateTo();
    page.fillCredentials(wrongCredentias);
    expect(page.getTitleText()).toEqual('Welcome');
    expect(page.getErrorMessage()).toEqual('fail fail fail');
  });

  it('when login is successful — he should redirect to default monitors page', () => {
    page.navigateTo();
    page.fillCredentials();
    browser.sleep(5000);
    // tslint:disable-next-line: deprecation
    browser.ignoreSynchronization = true;
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should can click creation button to create a monitor', () => {
    monitors.navigateTo();
    monitors.creationMonitorButton();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should display form card title', () => {
    monitor.navigateTo();
    expect(monitor.getTitleText()).toEqual('Create monitor');
  });

  it('should cancel form creation', () => {
    monitor.navigateTo();
    monitor.cancelButton();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should create basic monitor successful', () => {
    monitor.navigateTo();
    monitor.monitorCreation();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should display error notification when got wrong url or email address', () => {
    monitor.navigateTo();
    monitor.monitorCreation(wrongFields);
    expect(monitor.getErrorMessage()).toEqual('Url or email is wrong');
  });

  it('should can choose action for a specific monitor', () => {
    monitors.navigateTo();
    browser.sleep(1000);
    monitors.chooseAction();
    browser.sleep(1000);
  });

  it('should can start a monitor test', () => {
    monitors.navigateTo();
    browser.sleep(1000);
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemStart();
    browser.sleep(10000);
  });

  it('should can stop a monitor test', () => {
    monitors.navigateTo();
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemStop();
    browser.sleep(1000);
  });

  it('should can delete a monitor test', () => {
    monitors.navigateTo();
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemDelete();
    browser.sleep(1000);
  });

  it('should can edit a specific monitor', () => {
    monitors.navigateTo();
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemEdit();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  afterEach(async () => {
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
