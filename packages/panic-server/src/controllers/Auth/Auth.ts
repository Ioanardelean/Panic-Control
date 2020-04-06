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
    const payload = ctx.request.body;
    const email = payload.email;
    let password = payload.password;

    try {
      if (EmailValidator.validate(email) && schema.validate(password)) {
        password = await hashPassword(password);
        const newUser = await createUser({ ...payload, password });
        ctx.status = 201;
        ctx.body = {
          data: newUser,
          message: 'You have been registered',
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: `Email or password is invalid`,
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: error.detail,
      };
    }
  }

  @route(
    '/login',
    HttpMethod.POST,
    passport.authenticate('local', { failureRedirect: '/auth/loginFail' })
  )
  async loginUser(ctx: any) {
    const payload = ctx.request.body;
    const username = payload.username;
    const user = ctx.state.user;
    ctx.login(user);
    const accessToken = await JwtSign(user);

    ctx.status = 200;
    ctx.body = {
      token: accessToken,
      message: `Welcome, ${username}`,
    };
  }
  @route('/loginFail', HttpMethod.GET)
  async loginFail(ctx: any) {
    ctx.status = 401;
    ctx.body = {
      error: `Bad username or passwords don't match`,
    };
  }

  @route('/logout', HttpMethod.GET)
  async logoutUser(ctx: any) {
    if (ctx.isAuthenticated()) {
      ctx.status = 200;
      ctx.logout();
    } else {
      ctx.status = 500;
      ctx.body = {
        message: 'Something go wrong',
      };
    }
  }
}
