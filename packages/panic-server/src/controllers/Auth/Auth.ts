import bcrypt from 'bcryptjs';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Controller, HttpMethod, route } from '../../core/DecoratorKoa';
import { createUser, updateToken } from '../../helpers/UserService/UserService';
import { schema } from '../../modules/utils/password.validator';
require('dotenv').config();
@Controller('/auth')
export default class AuthController {
  @route('/register', HttpMethod.POST)
  async registerUser(ctx: any) {
    const payload = ctx.request.body;
    const email = payload.email;
    let password = payload.password;

    try {
      if (EmailValidator.validate(email) && schema.validate(password)) {
        password = await this.hashPassword(password);
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

  async hashPassword(password: string, saltRound = 10) {
    return bcrypt.hash(password, saltRound);
  }

  @route(
    '/login',
    HttpMethod.POST,
    passport.authenticate('local', { failureRedirect: '/auth/loginFail' })
  )
  async loginUser(ctx: any) {
    ctx.login(ctx.state.user);
    const payload = ctx.request.body;
    const username = payload.username;
    const accessToken = jwt.sign({ ...ctx.state.user }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    await updateToken(ctx.state.user.id, accessToken);
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
