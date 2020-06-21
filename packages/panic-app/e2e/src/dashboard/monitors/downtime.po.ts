import { browser, by, element } from 'protractor';

export class DowntimePage {
  navigateTo(): Promise<unknown> {
    return browser.get('/dashboard/downtime') as Promise<unknown>;
  }

  getCSVFile() {
    return element(by.css('#csv')).click();
  }
}
