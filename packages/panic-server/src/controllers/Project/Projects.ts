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
import { jwtAuth } from '../../helpers/UserService/UserService';
import CheckHealth from '../../modules/health/MainCheckHealth';
import { regex } from '../../modules/utils/email.validator';

@Controller('/projects')
export default class ProjectsController {
  @route('/', HttpMethod.GET, jwtAuth)
  async getAllProjects(ctx: any) {
    try {
      const userId = ctx.state.user.id;
      const project: any[] = await getProjects(userId);
      ctx.status = 200;
      ctx.body = {
        data: project,
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        message: error.message,
      };
    }
  }

  @route('/count', HttpMethod.GET, jwtAuth)
  async getCountProject(ctx: any) {
    try {
      const userId = ctx.state.user.id;
      const numberOfStopped = await getProjectOnStatusStopped(userId);
      const numberOfActive = await getProjectOnStatusActive(userId);
      const numberOfDown = await getProjectOnStatusDown(userId);
      ctx.status = 200;
      ctx.body = {
        stopped: numberOfStopped,
        active: numberOfActive,
        down: numberOfDown,
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        message: error.message,
      };
    }
  }

  @route('/', HttpMethod.POST, jwtAuth)
  async create(ctx: any) {
    const payload = ctx.request.body;
    const userId = ctx.state.user.id;
    const email = payload.receiver;
    const url = payload.url;
    const name = payload.name;

    try {
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
        await addItem(payload, userId);
        CheckHealth.startHealthCheck();
        ctx.status = 201;
        ctx.body = {
          data: payload,
          message: `${name} has been created`,
        };
      } else {
        ctx.body = {
          status: 400,
          error: `Url or email is wrong`,
        };
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        error: error.detail,
      };
    }
  }
  @route('/:id/', HttpMethod.GET, jwtAuth)
  async getProject(ctx: any) {
    try {
      const userId = ctx.state.user.id;
      const project = await getProjectById(ctx.params.id, userId);
      if (userId !== project.user.id) {
        ctx.status = 403;
      }
      ctx.status = 200;
      ctx.body = {
        data: project,
      };
    } catch (error) {
      ctx.body = {
        status: 403,
        error: error.detail,
      };
    }
  }

  @route('/:id/update', HttpMethod.PUT, jwtAuth)
  async update(ctx: any) {
    const id = ctx.params.id;
    const payload = ctx.request.body;
    const email = payload.receiver;
    const url = payload.url;
    try {
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

      if (validEmail && validUrl.isUri(url)) {
        const updated = await updateProjectById(id, payload);
        ctx.status = 200;
        ctx.body = {
          data: updated,
          message: 'Monitor has been successfully updated',
        };
        CheckHealth.startHealthCheck();
      } else {
        ctx.body = {
          status: 400,
          error: `The email is wrong`,
        };
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        error: error.detail,
      };
    }
  }

  @route('/:id/delete', HttpMethod.DELETE, jwtAuth)
  async delete(ctx: any) {
    try {
      const userId = ctx.state.user.id;
      const id = ctx.params.id;
      const removed = await deleteProjectById(id, userId);
      ctx.status = 200;
      ctx.body = {
        data: removed,
        message: 'Monitor has been deleted',
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: 403,
        error,
      };
    }
  }

  @route('/:id/start', HttpMethod.POST, jwtAuth)
  async start(ctx: any) {
    try {
      const id = ctx.params.id;
      const started = await updateProjectById(id, { testRunning: true });
      CheckHealth.startTestByProjectId(id);
      ctx.status = 200;
      ctx.body = {
        data: started,
        message: 'Monitor has been started',
      };
    } catch (error) {
      ctx.body = {
        error,
      };
    }
  }
  @route('/:id/stop', HttpMethod.POST, jwtAuth)
  async stop(ctx: any) {
    try {
      const id = ctx.params.id;
      const stopped = await updateProjectById(id, {
        testRunning: false,
        status: 'stopped',
      });
      CheckHealth.stopTestByProjectId(id);
      ctx.status = 200;
      ctx.body = {
        data: stopped,
        message: 'Monitor has been stopped',
      };
    } catch (error) {
      ctx.body = {
        error,
      };
    }
  }
}
