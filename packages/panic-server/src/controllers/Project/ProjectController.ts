import * as HttpStatus from 'http-status-codes';
import validUrl from 'valid-url';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import {
  addItem,
  deleteProjectById,
  getProjectById,
  getProjectOnStatusActive,
  getProjectOnStatusDown,
  getProjectOnStatusStopped,
  getProjects,
  updateProjectById,
} from '../../helpers/ProjectServices/ProjectServices';
import { jwtAuth } from '../../helpers/UserService/AuthorizationMiddleware';
import CheckHealth from '../../modules/health/MainCheckHealth';
import { regex } from '../../modules/utils/email.validator';

@Controller('/projects')
export default class ProjectController {
  @route('/', HttpMethod.GET, jwtAuth)
  async getAllProjects(ctx: any) {
    const userId = ctx.state.user.id;
    const project: any[] = await getProjects(userId);
    ctx.body = {
      data: project,
    };
  }

  @route('/count', HttpMethod.GET, jwtAuth)
  async getCountProject(ctx: any) {
    const userId = ctx.state.user.id;
    const numberOfStopped = await getProjectOnStatusStopped(userId);
    const numberOfActive = await getProjectOnStatusActive(userId);
    const numberOfDown = await getProjectOnStatusDown(userId);
    ctx.body = {
      stopped: numberOfStopped,
      active: numberOfActive,
      down: numberOfDown,
    };
  }

  @route('/', HttpMethod.POST, jwtAuth)
  async create(ctx: any) {
    const { email, url, name } = ctx.request.body;
    const userId = ctx.state.user.id;

    let validEmail = true;
    if (email) {
      const emails = email.replace(/\s/g, '').split(',');
      for (const address of emails) {
        if (address === '' || !regex.test(address)) {
          validEmail = false;
        }
      }
    } else {
      ctx.body = {
        error: 'invalid email',
      };
    }
    if (validUrl.isUri(url) && validEmail) {
      const newProject = await addItem(ctx.request.body, userId);
      CheckHealth.startHealthCheck();
      ctx.body = {
        data: newProject,
        message: `${name} has been created`,
      };
    } else {
      ctx.throw(HttpStatus.BAD_REQUEST);
    }
  }
  @route('/:id/', HttpMethod.GET, jwtAuth)
  async getProject(ctx: any) {
    const userId = ctx.state.user.id;
    const project = await getProjectById(ctx.params.id, userId);
    if (userId !== project.user.id) {
      ctx.throw(HttpStatus.UNAUTHORIZED);
    }
    ctx.body = {
      data: project,
    };
  }

  @route('/:id/update', HttpMethod.PUT, jwtAuth)
  async update(ctx: any) {
    const id = ctx.params.id;
    const payload = ctx.request.body;
    const email = payload.receiver;
    const url = payload.url;

    let validEmail = true;
    const updated = await updateProjectById(id, payload);

    if (email) {
      const emails = email.replace(/\s/g, '').split(',');
      for (const address of emails) {
        if (address === '' || !regex.test(address)) {
          validEmail = false;
        }
      }
    } else {
      ctx.body = {
        error: 'invalid email',
      };
    }
    if (validEmail && validUrl.isUri(url)) {
      CheckHealth.startHealthCheck();
      ctx.status = 200;
      ctx.body = {
        data: updated,
        message: 'Monitor has been successfully updated',
      };
    } else {
      ctx.throw(HttpStatus.BAD_REQUEST);
    }
  }

  @route('/:id/delete', HttpMethod.DELETE, jwtAuth)
  async delete(ctx: any) {
    const userId = ctx.state.user.id;
    const id = ctx.params.id;
    const removed = await deleteProjectById(id, userId);

    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }

  @route('/:id/start', HttpMethod.POST, jwtAuth)
  async start(ctx: any) {
    const id = ctx.params.id;
    const started = await updateProjectById(id, { testRunning: true });
    CheckHealth.startTestByProjectId(id);

    ctx.body = {
      data: started,
      message: 'Monitor has been started',
    };
  }
  @route('/:id/stop', HttpMethod.POST, jwtAuth)
  async stop(ctx: any) {
    const id = ctx.params.id;
    const stopped = await updateProjectById(id, {
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
