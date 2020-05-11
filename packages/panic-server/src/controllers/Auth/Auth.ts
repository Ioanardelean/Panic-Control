import * as EmailValidator from 'email-validator';
import passport from 'passport';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
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
    if (!username) ctx.throw(422, 'Username required.');

    try {
      if (EmailValidator.validate(email) && schema.validate(password)) {
        password = await hashPassword(password);
        const newUser = await createUser({ ...ctx.request.body, password });
        ctx.status = 201;
        ctx.body = {
          data: newUser,
          message: 'You have been registered!',
        };
      } else {
        ctx.body = {
          status: 400,
          error: `Email or/and password is invalid`,
        };
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        error: `Username or/and email address already exist`,
      };
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

    ctx.status = 200;
    ctx.body = {
      token: accessToken,
      message: `Welcome, ${username}!`,
    };
  }
  @route('/loginFail', HttpMethod.GET)
  async loginFail(ctx: any) {
    ctx.body = {
      status: 401,
      error: `You have entered an invalid username or password`,
    };
  }

  @route('/logout', HttpMethod.GET)
  async logoutUser(ctx: any) {
    if (ctx.isAuthenticated()) {
      ctx.status = 200;
      ctx.logout();
    } else {
      ctx.body = {
        status: 500,
        error: 'Something go wrong',
      };
    }
  }
}
