import { browser, logging, element } from 'protractor';

describe('workspace simulation user experience', () => {
  beforeEach(() => {});

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
