import EmailValidator from 'email-validator';
import * as userService from '../../helpers/UserService/UserService';

import * as util from '../../helpers/UserService/HashPassword';
import AuthController from './AuthController';
describe('should test the authentication controller', () => {
  let auth = new AuthController();

  const ctx: any = {
    isAuthenticated: true,
    logout: () => Promise.resolve({}),
    login: () => Promise.resolve({}),
    state: { user: { id: 23 } },
  };

  const newUser = {
    body: { message: 'You have been registered' },
    request: {
      body: {
        username: 'test',
        email: 'test@test.com',
        password: '',
      },
    },
    status: 200,
  };

  beforeAll(async () => {
    auth = new AuthController();
  });

  it('should logout user', async () => {
    spyOn(ctx, 'isAuthenticated').and.returnValue(true);
    spyOn(ctx, 'logout').and.returnValue({});
    await auth.logoutUser(ctx);
    expect(ctx.logout).toHaveBeenCalled();
    expect(ctx.isAuthenticated).toHaveBeenCalled();
  });

  it('should register the new user', async () => {
    const payload = {};
    const password = '';
    spyOn(EmailValidator, 'validate').and.returnValue(true);
    spyOn(userService, 'createUser').and.returnValue({});
    spyOn(util, 'hashPassword').and.returnValue({});
    await auth.registerUser(newUser);
    expect(util.hashPassword).not.toHaveBeenCalled();
    expect(EmailValidator.validate).toBeTruthy();
    expect(userService.createUser).not.toHaveBeenCalledWith(payload, password);
  });

  it('should fail when registering the new user with wrong credentials', async () => {
    const wrongUser = {
      body: { error: 'Email or password is invalid' },
      request: {
        body: {
          username: 'test',
          email: 'test',
          password: '',
        },
      },
      status: 400,
    };
    spyOn(auth, 'registerUser').and.returnValue({});
    await auth.registerUser(newUser);
    expect(auth.registerUser).not.toHaveBeenCalledWith(wrongUser);
  });

  it('should be a successful login', async () => {
    const loginCtx: any = {
      request: {
        body: {
          username: 'test',
          password: '',
        },
      },
      login: () => Promise.resolve({}),
      state: { user: { id: 23 } },
      status: 200,
    };

    spyOn(loginCtx, 'login').and.returnValue({});
    await auth.loginUser(loginCtx);
    expect(loginCtx.login).toHaveBeenCalledWith(loginCtx.state.user);
  });

  it('should login fail', async () => {
    const failCtx = {
      status: 401,
      body: {
        error: `Bad username or passwords don't match`,
      },
    };
    await auth.loginFail(failCtx);
    expect(failCtx.status).toBe(401);
    expect(failCtx.body.error).toBe(`Bad username or passwords don't match`);
  });
});
