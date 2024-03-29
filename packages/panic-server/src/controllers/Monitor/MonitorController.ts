import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { jwtAuth, userRole } from '../../middleware/authorization';
import { CreateMonitorDto } from '../../models/dtos/CreateMonitorDto';
import { UpdateMonitorDto } from '../../models/dtos/UpdateMonitorDto';
import CheckHealth from '../../modules/health/HealthCheckHandler';
import { MonitorService } from '../../services/MonitorService';

@Controller('/monitors')
export default class MonitorController {
  monitorService = new MonitorService();
  @route('/', HttpMethod.GET, jwtAuth, userRole)
  async getAllMonitors(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor: any[] = await this.monitorService.getMonitors(userId);
    ctx.body = {
      data: monitor,
    };
  }

  @route('/count-monitors', HttpMethod.GET, jwtAuth, userRole)
  async getCountMonitor(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfMonitors = await this.monitorService.countAll(userId);
    ctx.body = {
      data: numberOfMonitors,
    };
  }

  @route('/count-status', HttpMethod.GET, jwtAuth, userRole)
  async getMonitorOnStatus(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfStopped = await this.monitorService.getMonitorOnStatusStopped(userId);
    const numberOfActive = await this.monitorService.getMonitorOnStatusActive(userId);
    const numberOfDown = await this.monitorService.getMonitorOnStatusDown(userId);
    ctx.body = {
      stopped: numberOfStopped,
      active: numberOfActive,
      down: numberOfDown,
    };
  }

  @route('/', HttpMethod.POST, jwtAuth, userRole)
  async create(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor = ctx.request.body as CreateMonitorDto;

    const newMonitor = await this.monitorService.createMonitor(monitor, userId);
    CheckHealth.startHealthCheck();
    ctx.body = {
      data: newMonitor,
      message: `${monitor.name} has been created`,
    };
  }
  @route('/:id/', HttpMethod.GET, jwtAuth, userRole)
  async getMonitor(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor = await this.monitorService.getMonitorById(ctx.params.id, userId);
    ctx.body = {
      data: monitor,
    };
  }

  @route('/:id/update', HttpMethod.PUT, jwtAuth, userRole)
  async update(ctx: any) {
    const id = ctx.params.id;
    const monitor = ctx.request.body as UpdateMonitorDto;
    const updated = await this.monitorService.updateMonitorById(id, monitor);

    await CheckHealth.startHealthCheck();
    ctx.status = 200;
    ctx.body = {
      data: updated,
      message: 'Monitor has been successfully updated',
    };
  }

  @route('/:id/delete', HttpMethod.DELETE, jwtAuth, userRole)
  async delete(ctx: any) {
    const userId = ctx.state.user.id;
    const id = ctx.params.id;
    const removed = await this.monitorService.deleteMonitorById(id, userId);
    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }

  @route('/:id/start', HttpMethod.POST, jwtAuth, userRole)
  async start(ctx: any) {
    const id = ctx.params.id;
    const started = await this.monitorService.changeStatus(id, {
      testRunning: true,
    });
    CheckHealth.startTestByMonitorId(id);

    ctx.body = {
      data: started,
      message: 'Monitor has been started',
    };
  }
  @route('/:id/stop', HttpMethod.POST, jwtAuth, userRole)
  async stop(ctx: any) {
    const id = ctx.params.id;
    const stopped = await this.monitorService.changeStatus(id, {
      testRunning: false,
      status: 'stopped',
    });
    CheckHealth.stopTestByMonitorId(id);

    ctx.body = {
      data: stopped,
      message: 'Monitor has been stopped',
    };
  }
}
