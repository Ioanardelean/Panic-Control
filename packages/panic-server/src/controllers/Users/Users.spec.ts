import * as userService from '../../helpers/UserService/UserService';
import UsersController from './Users';
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
  };

  it('should update a user profile', async () => {
    spyOn(userService, 'updateUserById').and.returnValue({});
    await users.update(ctx);
    expect(userService.updateUserById).toHaveBeenCalled();
  });
  it('should delete a user', async () => {
    spyOn(userService, 'deleteById').and.returnValue({});
    await users.delete(ctx);
    expect(userService.deleteById).toHaveBeenCalled();
  });
});
