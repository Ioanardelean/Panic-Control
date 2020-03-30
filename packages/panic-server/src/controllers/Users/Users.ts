import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import {
  deleteById,
  jwtAuth,
  updateUserById,
} from '../../helpers/UserService/UserService';

@Controller('/users')
export default class UsersController {
  @route('/profile', HttpMethod.GET, jwtAuth)
  async test(ctx: any) {
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
        message: 'user hes been deleted',
      };
    } catch (error) {
      ctx.body = {
        error,
      };
    }
  }
}
