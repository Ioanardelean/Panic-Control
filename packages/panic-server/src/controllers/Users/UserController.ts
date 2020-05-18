import * as HttpStatus from 'http-status-codes';
import { Equal } from 'typeorm';
import { Not } from 'typeorm/find-options/operator/Not';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { UserService } from '../../helpers/UserService/UserService';
import { jwtAuth } from '../../middleware/authorization';
import { User } from '../../models/User';

@Controller('/users')
export default class UserController {
  userService = new UserService();

  @route('/profile', HttpMethod.GET, jwtAuth)
  async getUserProfile(ctx: any) {
    const currentUser = await this.userService.findUserById(ctx.state.user.id);
    ctx.body = {
      currentUser,
    };
  }

  @route('/:id', HttpMethod.PUT, jwtAuth)
  async updateUser(ctx: any) {
    const id = ctx.params.id;
    const payload = ctx.request.body;
    const user = this.userService.findUserById({
      id: Not(Equal(payload.id)),
      email: payload.email,
    });

    if (user) {
      ctx.throw(HttpStatus.BAD_REQUEST);
    } else {
      await this.userService.updateUserById(id, payload);
    }
  }
  @route('/:id', HttpMethod.DELETE, jwtAuth)
  async deleteUser(ctx: any) {
    const userToRemove: User | undefined = await this.userService.findUserById(
      +ctx.params.id || 0
    );
    if (!userToRemove) {
      ctx.throw(HttpStatus.BAD_REQUEST);
    } else if (ctx.state.user.email !== userToRemove.email) {
      ctx.throw(HttpStatus.UNAUTHORIZED);
    } else {
      await this.userService.deleteById(userToRemove);
    }
  }
}
