import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { deleteProject, getAll } from '../../helpers/ProjectServices/ProjectServices';
import {
  deleteById,
  findUserById,
  getAllUsers,
} from '../../helpers/UserService/UserService';
import { adminMdw, jwtAuth } from '../../middleware/authorization';

@Controller('/admin')
export default class AdminDashboardController {
  @route('/projects', HttpMethod.GET, jwtAuth, adminMdw)
  async admin(ctx: any) {
    const project: any[] = await getAll();
    ctx.body = {
      data: project,
    };
  }
  @route('/projects/:id/delete', HttpMethod.DELETE, jwtAuth)
  async delete(ctx: any) {
    const id = ctx.params.id;
    const removed = await deleteProject(id);
    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }
  @route('/users', HttpMethod.GET, jwtAuth, adminMdw)
  async getUsers(ctx: any) {
    const users = await getAllUsers();

    ctx.body = {
      data: users,
    };
  }
  @route('/users/:id/delete', HttpMethod.DELETE, jwtAuth, adminMdw)
  async deleteUser(ctx: any) {
    const id = ctx.params.id;
    const userToRemove = await findUserById(+id || 0);
    await deleteById(userToRemove);
  }
}
