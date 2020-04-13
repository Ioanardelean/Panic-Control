import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { deleteProject, getAll } from '../../helpers/ProjectServices/ProjectServices';
import { adminMdw, jwtAuth } from '../../helpers/UserService/UserService';

@Controller('/admin')
export default class AdminDashboardController {
  @route('/projects', HttpMethod.GET, jwtAuth, adminMdw)
  async admin(ctx: any) {
    try {
      const project: any[] = await getAll();
      ctx.status = 200;
      ctx.body = {
        data: project,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: error.message,
      };
    }
  }
  @route('/projects/:id/delete', HttpMethod.DELETE, jwtAuth)
  async delete(ctx: any) {
    try {
      const id = ctx.params.id;
      const removed = await deleteProject(id);
      ctx.status = 200;
      ctx.body = {
        data: removed,
        message: 'Monitor has been deleted',
      };
    } catch (error) {
      ctx.status = 403;
      console.log(error);
      ctx.body = {
        error,
      };
    }
  }
}
