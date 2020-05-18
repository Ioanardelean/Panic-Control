import * as userService from '../../helpers/UserService/AuthorizationMiddleware';
import UsersController from './UserController';
describe('test user api', () => {
  let users: UsersController;
  beforeAll(() => {
    users = new UsersController();
  });
  const ctx: any = {
    state: {
      user: {
        id: 23,
      },
    },
    params: {
      id: 2,
    },
    request: {
      body: {},
    },
    status: 200,
    body: {},
  };

  it('should update a user profile', async () => {
    spyOn(userService, 'updateUserById').and.returnValue({});
    await users.updateUser(ctx);
    expect(userService.updateUserById).toHaveBeenCalled();
  });
  it('should delete a user', async () => {
    spyOn(userService, 'deleteById').and.returnValue({});
    await users.deleteUser(ctx);
    expect(userService.deleteById).toHaveBeenCalled();
  });
  it('should get user profile', async () => {
    await users.getUserProfile(ctx);
    expect(ctx.status).toBe(200);
  });
});
