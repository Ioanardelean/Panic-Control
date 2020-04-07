import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { addHistory } from '../../helpers/HistoryService/HistoryService';
import { jwtAuth } from '../../helpers/UserService/UserService';

@Controller('/history')
export default class HistoryController {
  @route('/', HttpMethod.POST, jwtAuth)
  async addHistory(ctx: any) {
    const payload = ctx.request.body;
    await addHistory(payload, payload.projectId, payload.projectUrl);
    ctx.status = 200;
    ctx.body = {
      data: payload,
    };
  }
}
