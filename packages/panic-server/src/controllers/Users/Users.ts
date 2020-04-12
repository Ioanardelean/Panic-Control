import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import {
  adminMdw,
  deleteById,
  getAllUsers,
  jwtAuth,
  updateUserById,
} from '../../helpers/UserService/UserService';

@Controller('/users')
export default class UsersController {
  @route('/', HttpMethod.GET, jwtAuth, adminMdw)
  async getUsers(ctx: any) {
    ctx.status = 200;
    const users = await getAllUsers();
    ctx.body = {
      data: users,
      message: 'all users',
    };
  }
  @route('/profile', HttpMethod.GET, jwtAuth)
  async getUserProfile(ctx: any) {
    ctx.status = 200;
    ctx.body = {
      ...ctx.state.user,
      message: 'Current user',
    };
  }

  @route('/:id/update', HttpMethod.PUT)
  async update(ctx: any) {
    const id = ctx.params.id;
    const payload = ctx.request.body;
    try {
      await updateUserById(id, payload);
      ctx.status = 201;
      ctx.body = {
        message: 'User has been successfully updated',
      };
    } catch (error) {
      ctx.body = {
        error: error && error.message,
      };
    }
  }
  @route('/:id/delete', HttpMethod.DELETE)
  async delete(ctx: any) {
    const id = ctx.params.id;
    try {
      await deleteById(id);
      ctx.status = 204;
      ctx.body = {
        message: 'User hes been deleted',
      };
    } catch (error) {
      ctx.body = {
        error,
      };
    }
  }
}
