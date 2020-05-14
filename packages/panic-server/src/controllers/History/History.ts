import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { addHistory, getLastEvent } from '../../helpers/HistoryService/HistoryService';
import {
  getDowntimeOnMonth,
  getDowntimeOnYear,
  getDowntimeSinceCreation,
} from '../../helpers/ProjectServices/ProjectServices';
import { jwtAuth } from '../../helpers/UserService/UserService';

@Controller('/history')
export default class HistoryController {
  @route('/', HttpMethod.POST, jwtAuth)
  async addHistory(ctx: any) {
    const payload = ctx.request.body;
    await addHistory(payload, payload.projectId, payload.projectUrl);
    ctx.body = {
      data: payload,
    };
  }

  @route('/last', HttpMethod.GET, jwtAuth)
  async getLastEvents(ctx: any) {
    const lastDown = await getLastEvent();
    ctx.body = {
      data: lastDown,
    };
  }
  @route('/:id/downtime-year', HttpMethod.GET, jwtAuth)
  async getEventOnYear(ctx: any) {
    const currentUser = ctx.state.user.id;
    const projectId = ctx.params.id;
    const yearStats = await getDowntimeOnYear(currentUser, projectId);
    ctx.body = {
      data: yearStats,
    };
  }
  @route('/downtime-month', HttpMethod.GET, jwtAuth)
  async getEventOnMonth(ctx: any) {
    const currentUser = ctx.state.user.id;
    const monthStats = await getDowntimeOnMonth(currentUser);
    ctx.body = {
      data: monthStats,
    };
  }
  @route('/:id/downtime', HttpMethod.GET, jwtAuth)
  async getEventsOnProject(ctx: any) {
    const currentUser = ctx.state.user.id;
    const projectId = ctx.params.id;
    const allDowntime = await getDowntimeSinceCreation(currentUser, projectId);
    ctx.body = {
      data: allDowntime,
    };
  }
}
