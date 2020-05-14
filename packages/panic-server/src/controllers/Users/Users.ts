import * as HttpStatus from 'http-status-codes';
import { Equal } from 'typeorm';
import { Not } from 'typeorm/find-options/operator/Not';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import {
  deleteById,
  findUserById,
  jwtAuth,
  updateUserById,
} from '../../helpers/UserService/UserService';
import { User } from '../../models/UserModel';

@Controller('/users')
export default class UsersController {
  @route('/profile', HttpMethod.GET, jwtAuth)
  async getUserProfile(ctx: any) {
    const currentUser = await findUserById(ctx.state.user.id);
    ctx.body = {
      currentUser,
    };
  }

  @route('/:id', HttpMethod.PUT, jwtAuth)
  async updateUser(ctx: any) {
    const id = ctx.params.id;
    const payload = ctx.request.body;
    const user = findUserById({ id: Not(Equal(payload.id)), email: payload.email });

    if (user) {
      ctx.throw(HttpStatus.BAD_REQUEST);
    } else {
      await updateUserById(id, payload);
    }
  }
  @route('/:id', HttpMethod.DELETE, jwtAuth)
  async deleteUser(ctx: any) {
    const userToRemove: User | undefined = await findUserById(+ctx.params.id || 0);
    if (!userToRemove) {
      ctx.throw(HttpStatus.BAD_REQUEST);
    } else if (ctx.state.user.email !== userToRemove.email) {
      ctx.throw(HttpStatus.UNAUTHORIZED);
    } else {
      await deleteById(userToRemove);
    }
  }
}
