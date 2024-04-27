import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { User } from '../../src/user/user.entity';
import { PrismaService } from '../../src/database/prisma.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(() => {
    userService = new UserService(prisma);
    userController = new UserController(userService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        auth0_id: 'auth0|123456',
        username: 'username',
        email: 'email@test.com',
        avatar: 'http://your-avatar.com',
      };

      jest.spyOn(userService, 'isActive').mockResolvedValueOnce(null);

      jest
        .spyOn(userService, 'create')
        .mockResolvedValueOnce({ auth0_id: 'auth0|123456' } as User);

      const result = await userController.create(newUser);

      expect(result).toEqual(
        JSON.stringify({
          message: `User ${newUser.auth0_id} created`,
          user: { auth0_id: 'auth0|123456' },
        }),
      );
    });
  });

  describe('find', () => {
    it('should find a user by auth0_id', async () => {
      const auth0_id = 'auth0|123456';

      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValueOnce({ auth0_id: 'auth0|123456' } as User);

      const result = await userController.findOne(auth0_id);

      expect(result).toEqual(
        JSON.stringify({
          message: `User ${auth0_id} found`,
          user: { auth0_id: 'auth0|123456' },
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = {
        auth0_id: 'auth0|123456',
        username: 'newusername',
        avatar: 'http://your-new-avatar.com',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce({} as User);

      jest.spyOn(userService, 'update').mockResolvedValueOnce({} as User);

      const result = await userController.update(updatedUser);

      expect(result).toEqual(
        JSON.stringify({
          message: `User ${updatedUser.auth0_id} updated`,
          user: {},
        }),
      );
    });
  });

  it('should delete a user', async () => {
    const deletedUser = {
      auth0_id: 'auth0|123456',
    };

    jest.spyOn(userService, 'findOne').mockResolvedValueOnce({} as User);

    jest.spyOn(userService, 'delete').mockResolvedValueOnce({} as User);

    const result = await userController.delete(deletedUser);

    expect(result).toEqual(
      JSON.stringify({
        message: `User ${deletedUser.auth0_id} deleted`,
        user: {},
      }),
    );
  });
});
