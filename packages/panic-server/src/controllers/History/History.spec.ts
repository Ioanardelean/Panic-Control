import * as historyService from '../../helpers/HistoryService/HistoryService';
import HistoryController from './History';

describe('should get a CRUD project ', () => {
  let history: HistoryController;

  beforeAll(() => {
    history = new HistoryController();
  });

  it('should show all stats', async () => {
    const ctx = {
      status: 200,
      body: {},
    };
    spyOn(historyService, 'getHistorie').and.returnValue({});
    await history.getHistory(ctx);
    expect(historyService.getHistorie).toHaveBeenCalled();
  });
  it('should insert history', async () => {
    const ctx = {
      request: {
        body: {},
      },
      status: 200,
    };
    spyOn(historyService, 'addHistory').and.returnValue({});
    await history.addHistory(ctx);
    expect(historyService.addHistory).toHaveBeenCalled();
  });
});
