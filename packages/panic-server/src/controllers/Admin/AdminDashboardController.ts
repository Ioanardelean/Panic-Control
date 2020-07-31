import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { adminMdw, jwtAuth } from '../../middleware/authorization';
import { MonitorService } from '../../services/MonitorService';
import { UserService } from '../../Services/UserService';

@Controller('/admin')
export default class AdminDashboardController {
  userService = new UserService();
  monitorService = new MonitorService();

  @route('/monitors', HttpMethod.GET, jwtAuth, adminMdw)
  async admin(ctx: any) {
    const project: any[] = await this.monitorService.getAll();
    ctx.body = {
      data: project,
    };
  }
  @route('/monitors/:id/delete', HttpMethod.DELETE, jwtAuth, adminMdw)
  async delete(ctx: any) {
    const id = ctx.params.id;
    const removed = await this.monitorService.deleteMonitor(id);
    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }
  @route('/users', HttpMethod.GET, jwtAuth, adminMdw)
  async getUsers(ctx: any) {
    const users = await this.userService.getAllUsers();

    ctx.body = {
      data: users,
    };
  }
  @route('/users/:id/delete', HttpMethod.DELETE, jwtAuth, adminMdw)
  async deleteUser(ctx: any) {
    const id = ctx.params.id;
    const userToRemove = await this.userService.findUserById(+id || 0);
    await this.userService.deleteById(userToRemove);
  }
}
