import * as historyService from '../../helpers/HistoryService/HistoryService';
import HistoryController from './HistoryController';

describe('should get a CRUD project ', () => {
  let history: HistoryController;

  beforeAll(() => {
    history = new HistoryController();
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
