// import { browser, element, by } from 'protractor';

// export class MonitorPage {
//   private fields = {
//     name: 'panic',
//     description: 'uptime application',
//     url: 'http://localhost:8080/',
//     receiver: 'ioana.ardelean6@gmail.com',
//     ping: 20,
//     monitorInterval: 10,
//   };

//   navigateTo(): Promise<unknown> {
//     return browser.get('/dashboard/monitor') as Promise<unknown>;
//   }

//   getTitleText(): Promise<string> {
//     return element(by.css('app-monitor mat-card-title')).getText() as Promise<string>;
//   }

//   cancelButton() {
//     element(by.css('#cancel-button')).click();
//   }

//   monitorCreation(fields: any = this.fields) {
//     element(by.css('[formControlName="name"]')).sendKeys(fields.name);
//     element(by.css('[formControlName="description"]')).sendKeys(fields.description);
//     element(by.css('[formControlName="url"]')).sendKeys(fields.url);
//     element(by.css('[formControlName="receiver"]')).sendKeys(fields.receiver);
//     element(by.css('[formControlName="ping"]')).sendKeys(fields.ping);
//     element(by.css('[formControlName="monitorInterval"]')).sendKeys(
//       fields.monitorInterval
//     );
//     element(by.css('#submit-button')).click();
//   }

//   getErrorMessage() {
//     return element(by.css('.toast-message')).getText();
//   }
// }
