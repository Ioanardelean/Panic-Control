import { MonitorsPage } from '../monitors/monitors.po';
import { browser } from 'protractor';
import { MonitorPage } from '../monitor/monitor.po';

describe('test for monitor creation', () => {
  let monitor: MonitorPage;
  let monitors: MonitorsPage;

  beforeEach(() => {
    monitor = new MonitorPage();
    monitors = new MonitorsPage();
  });
  it('should can click creation button to create a monitor', () => {
    monitors.navigateTo();
    monitors.creationMonitorButton();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
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
});
