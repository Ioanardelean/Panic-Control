import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { ProjectService } from '../../helpers/ProjectServices/ProjectService';
import { jwtAuth } from '../../middleware/authorization';
import { CreateProjectDto } from '../../models/dtos/CreateProjectDto';
import { UpdateProjectDto } from '../../models/dtos/UpdateProjectDto';
import CheckHealth from '../../modules/health/MainCheckHealth';

@Controller('/projects')
export default class ProjectController {
  projectService = new ProjectService();
  @route('/', HttpMethod.GET, jwtAuth)
  async getAllProjects(ctx: any) {
    const userId = ctx.state.user.id;
    const project: any[] = await this.projectService.getProjects(userId);
    ctx.body = {
      data: project,
    };
  }

  @route('/count-monitors', HttpMethod.GET, jwtAuth)
  async getCountProject(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfMonitors = await this.projectService.countAll(userId);
    ctx.body = {
      data: numberOfMonitors,
    };
  }

  @route('/count-status', HttpMethod.GET, jwtAuth)
  async getProjectOnStatus(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfStopped = await this.projectService.getProjectOnStatusStopped(userId);
    const numberOfActive = await this.projectService.getProjectOnStatusActive(userId);
    const numberOfDown = await this.projectService.getProjectOnStatusDown(userId);
    ctx.body = {
      stopped: numberOfStopped,
      active: numberOfActive,
      down: numberOfDown,
    };
  }

  @route('/', HttpMethod.POST, jwtAuth)
  async create(ctx: any) {
    const userId = ctx.state.user.id;
    const project = new CreateProjectDto();
    project.name = ctx.request.body.name;
    project.description = ctx.request.body.description;
    project.url = ctx.request.body.url;
    project.receiver = ctx.request.body.receiver;
    project.ping = ctx.request.body.ping;
    project.monitorInterval = ctx.request.body.monitorInterval;
    project.emailTemplate = ctx.request.body.emailTemplate;

    const newProject = await this.projectService.createProject(project, userId);
    CheckHealth.startHealthCheck();
    ctx.body = {
      data: newProject,
      message: `${project.name} has been created`,
    };
  }
  @route('/:id/', HttpMethod.GET, jwtAuth)
  async getProject(ctx: any) {
    const userId = ctx.state.user.id;
    const project = await this.projectService.getProjectById(ctx.params.id, userId);
    ctx.body = {
      data: project,
    };
  }

  @route('/:id/update', HttpMethod.PUT, jwtAuth)
  async update(ctx: any) {
    const id = ctx.params.id;
    const project = new UpdateProjectDto();
    project.name = ctx.request.body.name;
    project.description = ctx.request.body.description;
    project.url = ctx.request.body.url;
    project.receiver = ctx.request.body.receiver;
    project.ping = ctx.request.body.ping;
    project.monitorInterval = ctx.request.body.monitorInterval;
    project.emailTemplate = ctx.request.body.emailTemplate;

    const updated = await this.projectService.updateProjectById(id, project);

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
    const removed = await this.projectService.deleteProjectById(id, userId);

    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }

  @route('/:id/start', HttpMethod.POST, jwtAuth)
  async start(ctx: any) {
    const id = ctx.params.id;
    const started = await this.projectService.changeStatus(id, {
      testRunning: true,
    });
    CheckHealth.startTestByProjectId(id);

    ctx.body = {
      data: started,
      message: 'Monitor has been started',
    };
  }
  @route('/:id/stop', HttpMethod.POST, jwtAuth)
  async stop(ctx: any) {
    const id = ctx.params.id;
    const stopped = await this.projectService.changeStatus(id, {
      testRunning: false,
      status: 'stopped',
    });
    CheckHealth.stopTestByProjectId(id);

    ctx.body = {
      data: stopped,
      message: 'Monitor has been stopped',
    };
  }
}
