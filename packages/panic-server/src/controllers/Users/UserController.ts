import * as HttpStatus from 'http-status-codes';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { UserService } from '../../helpers/UserService/UserService';
import { jwtAuth } from '../../middleware/authorization';
import { UpdateUserDto } from '../../models/Dtos/UpdateUserDto';
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
    if (id === ctx.state.user.id) {
      const userDto = new UpdateUserDto();
      userDto.username = ctx.request.body.username;
      userDto.email = ctx.request.body.email;
      const updated = await this.userService.updateUserById(id, userDto);
      ctx.body = {
        updated,
      };
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
      ctx.throw(HttpStatus.NO_CONTENT);
    }
  }
}
