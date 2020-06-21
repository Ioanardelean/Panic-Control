import { MonitorsPage } from '../monitors/monitors.po';
import { browser } from 'protractor';
import { MonitorPage } from '../monitor/monitor.po';
import { DowntimePage } from './downtime.po';

describe('test for monitor creation', () => {
  let monitor: MonitorPage;
  let monitors: MonitorsPage;
  let downtime: DowntimePage;

  beforeEach(() => {
    monitor = new MonitorPage();
    monitors = new MonitorsPage();
    downtime = new DowntimePage();
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
    browser.sleep(1000);
  });

  it('should can stop a monitor test', () => {
    monitors.navigateTo();
    browser.sleep(1000);
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemStop();
    browser.sleep(1000);
  });

  it('should can edit a specific monitor', () => {
    monitors.navigateTo();
    browser.sleep(1000);
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemEdit();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should show stats of a specific monitor', () => {
    monitors.navigateTo();
    browser.sleep(1000);
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getDowntimeStats();
    browser.sleep(1000);
    downtime.getCSVFile();
    expect(browser.getCurrentUrl()).not.toEqual(browser.baseUrl);
  });

  it('should can delete a monitor test', () => {
    monitors.navigateTo();
    monitors.chooseAction();
    browser.sleep(1000);
    monitors.getMenuItemDelete();
    browser.sleep(1000);
  });
  it('should download  monthly stats csv', () => {
    monitors.navigateTo();
    monitors.getCSVFile();
    browser.sleep(1000);
  });
});
