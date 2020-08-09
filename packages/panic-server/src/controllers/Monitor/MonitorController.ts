import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { jwtAuth, userRole } from '../../middleware/authorization';
import { CreateMonitorDto } from '../../models/dtos/CreateMonitorDto';
import { UpdateMonitorDto } from '../../models/dtos/UpdateMonitorDto';
import CheckHealth from '../../modules/health/HealthCheckHandler';
import { MonitorService } from '../../services/MonitorService';

@Controller('/monitors', [userRole])
export default class MonitorController {
  monitorService = new MonitorService();
  @route('/', HttpMethod.GET, jwtAuth)
  async getAllMonitors(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor: any[] = await this.monitorService.getMonitors(userId);
    ctx.body = {
      data: monitor,
    };
  }

  @route('/count-monitors', HttpMethod.GET, jwtAuth)
  async getCountMonitor(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfMonitors = await this.monitorService.countAll(userId);
    ctx.body = {
      data: numberOfMonitors,
    };
  }

  @route('/count-status', HttpMethod.GET, jwtAuth)
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

  @route('/', HttpMethod.POST, jwtAuth)
  async create(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor = new CreateMonitorDto();
    monitor.name = ctx.request.body.name;
    monitor.description = ctx.request.body.description;
    monitor.url = ctx.request.body.url;
    monitor.receiver = ctx.request.body.receiver;
    monitor.ping = ctx.request.body.ping;
    monitor.monitorInterval = ctx.request.body.monitorInterval;
    monitor.emailTemplate = ctx.request.body.emailTemplate;
    monitor.testRunning = ctx.request.body.testRunning;

    const newMonitor = await this.monitorService.createMonitor(monitor, userId);
    CheckHealth.startHealthCheck();
    ctx.body = {
      data: newMonitor,
      message: `${monitor.name} has been created`,
    };
  }
  @route('/:id/', HttpMethod.GET, jwtAuth)
  async getMonitor(ctx: any) {
    const userId = ctx.state.user.id;
    const monitor = await this.monitorService.getMonitorById(ctx.params.id, userId);
    ctx.body = {
      data: monitor,
    };
  }

  @route('/:id/update', HttpMethod.PUT, jwtAuth)
  async update(ctx: any) {
    const id = ctx.params.id;
    const monitor = new UpdateMonitorDto();
    monitor.name = ctx.request.body.name;
    monitor.description = ctx.request.body.description;
    monitor.url = ctx.request.body.url;
    monitor.receiver = ctx.request.body.receiver;
    monitor.ping = ctx.request.body.ping;
    monitor.monitorInterval = ctx.request.body.monitorInterval;
    monitor.emailTemplate = ctx.request.body.emailTemplate;

    const updated = await this.monitorService.updateMonitorById(id, monitor);

    CheckHealth.startHealthCheck();
    ctx.status = 200;
    ctx.body = {
      data: updated,
      message: 'Monitor has been successfully updated',
    };
  }

  @route('/:id/delete', HttpMethod.DELETE, jwtAuth)
  async delete(ctx: any) {
    const userId = ctx.state.user.id;
    const id = ctx.params.id;
    const removed = await this.monitorService.deleteMonitorById(id, userId);

    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }

  @route('/:id/start', HttpMethod.POST, jwtAuth)
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
  @route('/:id/stop', HttpMethod.POST, jwtAuth)
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
