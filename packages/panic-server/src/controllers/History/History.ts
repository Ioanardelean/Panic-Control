import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { addHistory, getHistorie } from '../../helpers/HistoryService/HistoryService';
import { jwtAuth } from '../../helpers/UserService/UserService';

@Controller('/history')
export default class HistoryController {
  @route('/', HttpMethod.GET, jwtAuth)
  async getHistory(ctx: any) {
    try {
      const history: any[] = await getHistorie();

      ctx.status = 200;
      ctx.body = {
        data: history,
      };
    } catch (error) {
      ctx.body = {
        error: 'error',
      };
    }
  }

  @route('/', HttpMethod.POST, jwtAuth)
  async addHistory(ctx: any) {
    const payload = ctx.request.body;
    await addHistory(payload, payload.projectId);
    ctx.status = 200;
    ctx.body = {
      data: payload,
    };
  }
}
