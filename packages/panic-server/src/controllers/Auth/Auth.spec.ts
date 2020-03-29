import * as bcrypt from 'bcryptjs';
import EmailValidator from 'email-validator';
import * as userService from '../../helpers/UserService/UserService';
import AuthController from './Auth';
describe('should test the auth controller', () => {
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

  it('should call hash password', async () => {
    const password = '';
    const saltRound = 1;
    spyOn(bcrypt, 'hash').and.returnValue(true);
    await auth.hashPassword(password, saltRound);
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should logout user', async () => {
    spyOn(ctx, 'isAuthenticated').and.returnValue(true);
    spyOn(ctx, 'logout').and.returnValue({});
    await auth.logoutUser(ctx);
    expect(ctx.logout).toHaveBeenCalled();
    expect(ctx.isAuthenticated).toHaveBeenCalled();
  });

  it('should can register the user', async () => {
    const password = '';
    const saltRound = 1;
    spyOn(EmailValidator, 'validate').and.returnValue(true);
    spyOn(userService, 'createUser').and.returnValue({});
    spyOn(auth, 'hashPassword').and.returnValue({});
    await auth.registerUser(newUser);

    expect(EmailValidator.validate).toBeTruthy();
    expect(auth.hashPassword).not.toHaveBeenCalledWith(password, saltRound);
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should fail when register user with wrong credentials', async () => {
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
    const ctx: any = {
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
    spyOn(userService, 'updateToken').and.returnValue({});
    spyOn(ctx, 'login').and.returnValue({});
    await auth.loginUser(ctx);
    expect(userService.updateToken).toHaveBeenCalled();
    expect(ctx.login).toHaveBeenCalled();
  });

  it('should login fail', async () => {
    const ctx = {
      status: 401,
      body: {
        error: 'fail fail fail',
      },
    };
    spyOn(auth, 'loginFail').and.returnValue({});
    await auth.loginFail(ctx);
    expect(auth.loginFail).toBeCalled();
    expect(ctx.status).toBe(401);
    expect(ctx.body.error).toBe('fail fail fail');
  });
});
