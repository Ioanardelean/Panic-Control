import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { jwtAuth } from '../../middleware/authorization';
import { HistoryService } from '../../services/HistoryService';

@Controller('/history')
export default class HistoryController {
  historyService = new HistoryService();
  @route('/', HttpMethod.POST, jwtAuth)
  async addHistory(ctx: any) {
    const payload = ctx.request.body;
    await this.historyService.addHistory(payload, payload.monitorId, payload.monitorUrl);
    ctx.body = {
      data: payload,
    };
  }

  @route('/last', HttpMethod.GET, jwtAuth)
  async getLastEvents(ctx: any) {
    const lastDown = await this.historyService.getLastEvent(ctx.state.user.id);

    ctx.body = {
      data: lastDown,
    };
  }
  @route('/:id/downtime-year', HttpMethod.GET, jwtAuth)
  async getEventOnYear(ctx: any) {
    const monitorId = ctx.params.id;
    const yearStats = await this.historyService.getDowntimeOnYear(monitorId);

    ctx.body = {
      data: yearStats,
    };
  }
  @route('/downtime-month', HttpMethod.GET, jwtAuth)
  async getEventOnMonth(ctx: any) {
    const currentUser = ctx.state.user.id;
    const monthStats = await this.historyService.getDowntimeOnMonth(currentUser);

    ctx.body = {
      data: monthStats,
    };
  }
  @route('/:id/downtime', HttpMethod.GET, jwtAuth)
  async getEventsOnMonitor(ctx: any) {
    const monitorId = ctx.params.id;
    const allDowntime = await this.historyService.getDowntimeSinceCreation(monitorId);
    ctx.body = {
      data: allDowntime,
    };
  }
}
