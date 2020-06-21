import { MonitorPage } from './monitor.po';
import { MonitorsPage } from '../monitors/monitors.po';
import { browser } from 'protractor';

describe('test for monitor creation', () => {
  let monitor: MonitorPage;
  let monitors: MonitorsPage;
  const wrongFields = {
    name: 'test',
    description: 'test application',
    url: 'test/url',
    receiver: 'test.com',
  };
  beforeEach(() => {
    monitor = new MonitorPage();
    monitors = new MonitorsPage();
  });
  it('should can click creation button to create a monitor', () => {
    monitors.navigateTo();
    monitors.creationMonitorButton();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should cancel form creation', () => {
    monitor.navigateTo();
    monitor.cancelButton();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should display error notification when got wrong url or email address', () => {
    monitor.navigateTo();
    monitor.monitorCreation(wrongFields);
    browser.sleep(5000);
    const form = monitor.getForm().getAttribute('class');
    expect(form).toContain('ng-invalid');
  });

  it('should create basic monitor successful', () => {
    monitor.navigateTo();
    monitor.monitorCreation();
    browser.sleep(5000);
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });
});
