import * as EmailValidator from 'email-validator';
import * as HttpStatus from 'http-status-codes';
import passport from 'passport';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { UnprocessableEntity } from '../../helpers/errors';
import { AuthService } from '../../helpers/UserService/AuthService';
import { UserService } from '../../helpers/UserService/UserService';
import { schema } from '../../modules/utils/password.validator';
@Controller('/auth')
export default class AuthController {
  authService = new AuthService();
  userService = new UserService();

  @route('/register', HttpMethod.POST)
  async registerUser(ctx: any) {
    // tslint:disable-next-line: prefer-const
    let { email, username, password } = ctx.request.body;
    if (!username) {
      throw new UnprocessableEntity('Username is required ');
    }

    if (EmailValidator.validate(email) && schema.validate(password)) {
      password = await this.authService.hashPassword(password);
      const newUser = await this.userService.createUser({
        ...ctx.request.body,
        password,
      });
      ctx.status = 201;
      ctx.body = {
        data: newUser,
        message: 'You have been registered!',
      };
    } else {
      ctx.throw(HttpStatus.BAD_REQUEST);
    }
  }

  @route(
    '/login',
    HttpMethod.POST,
    passport.authenticate('local', { failureRedirect: '/auth/loginFail' })
  )
  async loginUser(ctx: any) {
    const { username } = ctx.request.body;
    const user = ctx.state.user;
    ctx.login(user);
    const accessToken = this.authService.generateToken(user);
    ctx.body = {
      token: accessToken,
      message: `Welcome, ${username}!`,
    };
  }
  @route('/loginFail', HttpMethod.GET)
  async loginFail(ctx: any) {
    ctx.throw(HttpStatus.UNAUTHORIZED);
  }

  @route('/logout', HttpMethod.GET)
  async logoutUser(ctx: any) {
    if (ctx.isAuthenticated()) {
      ctx.logout();
    } else {
      ctx.throw(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
