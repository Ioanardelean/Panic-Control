import { browser, element, by } from 'protractor';

export class MonitorsPage {
  navigateTo(): Promise<unknown> {
    return browser.get('/dashboard') as Promise<unknown>;
  }

  creationMonitorButton() {
    return element(by.css('app-monitors #creation-button')).click();
  }

  chooseAction() {
    return element(by.css('#action')).click();
  }

  getMenuItemStart() {
    return element(by.css('#start')).click();
  }

  getMenuItemStop() {
    return element(by.css('#stop')).click();
  }

  getMenuItemDelete() {
    return element(by.css('#delete')).click();
  }
  getMenuItemEdit() {
    return element(by.css('#edit')).click();
  }
}
