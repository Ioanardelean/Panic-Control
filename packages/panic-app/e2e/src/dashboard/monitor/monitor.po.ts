import { browser, element, by } from 'protractor';

export class MonitorPage {
  private fields = {
    name: 'test',
    description: 'uptime application',
    url: 'http://localhost:8965/',
    receiver: 't@t.com',
  };

  navigateTo(): Promise<unknown> {
    return browser.get('/dashboard/monitor') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-monitor mat-card-title')).getText() as Promise<string>;
  }

  cancelButton() {
    element(by.css('#cancel-button')).click();
  }

  monitorCreation(fields: any = this.fields) {
    element(by.css('[formControlName="name"]')).sendKeys(fields.name);
    element(by.css('[formControlName="description"]')).sendKeys(fields.description);
    element(by.css('[formControlName="url"]')).sendKeys(fields.url);
    element(by.css('#receiver')).sendKeys(fields.receiver);
    element(by.css('#ping')).element(by.tagName('mat-select')).click();
    element(by.tagName('mat-option')).click();
    browser.sleep(2000);
    element(by.css('#interval')).element(by.tagName('mat-select')).click();
    element(by.tagName('mat-option')).click();
    element(by.css('#submit-button')).click();
  }

  getForm() {
    return element(by.css('.example-form'));
  }
}
