import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { adminRole, jwtAuth } from '../../middleware/authorization';
import { MonitorService } from '../../services/MonitorService';
import { UserService } from '../../services/UserService';

@Controller('/admin')
export default class AdminDashboardController {
  userService = new UserService();
  monitorService = new MonitorService();

  @route('/monitors', HttpMethod.GET, jwtAuth, adminRole)
  async admin(ctx: any) {
    const project: any[] = await this.monitorService.getAll();
    ctx.body = {
      data: project,
    };
  }
  @route('/monitors/:id/delete', HttpMethod.DELETE, jwtAuth, adminRole)
  async delete(ctx: any) {
    const id = ctx.params.id;
    const removed = await this.monitorService.deleteMonitor(id);
    ctx.body = {
      data: removed,
      message: 'Monitor has been deleted',
    };
  }
  @route('/users', HttpMethod.GET, jwtAuth, adminRole)
  async getUsers(ctx: any) {
    const users = await this.userService.getAllUsers();

    ctx.body = {
      data: users,
    };
  }
  @route('/users/:id/delete', HttpMethod.DELETE, jwtAuth, adminRole)
  async deleteUser(ctx: any) {
    const id = ctx.params.id;
    await this.userService.deleteById(id || 0);
    ctx.body = {
      message: 'User has been deleted',
    };
  }
}
