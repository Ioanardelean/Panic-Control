import * as HttpStatus from 'http-status-codes';
import passport from 'passport';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { AuthService } from '../../helpers/UserService/AuthService';
import { UserService } from '../../helpers/UserService/UserService';
import { CreateUserDto } from '../../models/dtos/CreateUserDto';

@Controller('/auth')
export default class AuthController {
  authService = new AuthService();
  userService = new UserService();

  @route('/register', HttpMethod.POST)
  async registerUser(ctx: any) {
    const userDto = new CreateUserDto();
    userDto.username = ctx.request.body.username;
    userDto.email = ctx.request.body.email;
    userDto.password = ctx.request.body.password;
    const userToBeSaved = await this.userService.createUser(userDto);
    ctx.body = {
      data: userToBeSaved,
      message: 'You have been registered!',
    };
  }

  @route(
    '/login',
    HttpMethod.POST,
    passport.authenticate('local', { failureRedirect: '/auth/loginFail' })
  )
  async loginUser(ctx: any) {
    const user = ctx.state.user;
    await ctx.login(user);
    const accessToken = this.authService.generateToken(user);
    ctx.body = {
      token: accessToken,
    };
  }
  @route('/loginFail', HttpMethod.GET)
  async loginFail(ctx: any) {
    await ctx.throw(HttpStatus.UNAUTHORIZED);
  }

  @route('/logout', HttpMethod.GET)
  async logoutUser(ctx: any) {
    if (ctx.isAuthenticated()) {
      await ctx.logout();
    } else {
      ctx.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
