import * as EmailValidator from 'email-validator';
import * as HttpStatus from 'http-status-codes';
import passport from 'passport';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { UnprocessableEntity } from '../../helpers/errors';
import { hashPassword } from '../../helpers/UserService/HashPassword';
import { JwtSign } from '../../helpers/UserService/TokenGenerator';
import { createUser } from '../../helpers/UserService/UserService';
import { schema } from '../../modules/utils/password.validator';
@Controller('/auth')
export default class AuthController {
  @route('/register', HttpMethod.POST)
  async registerUser(ctx: any) {
    // tslint:disable-next-line: prefer-const
    let { email, username, password } = ctx.request.body;
    if (!username) {
      throw new UnprocessableEntity('Username is required ');
    }

    if (EmailValidator.validate(email) && schema.validate(password)) {
      password = await hashPassword(password);
      const newUser = await createUser({ ...ctx.request.body, password });
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
    const accessToken = await JwtSign(user);
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
