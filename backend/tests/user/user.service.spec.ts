import { UserService } from '../../src/user/user.service';
import { WalletService } from '../../src/wallet/wallet.service';
import { PrismaService } from '../../src/database/prisma.service';

// Mock de PrismaService para simular su comportamiento
jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('../../src/wallet/wallet.service.ts', () => ({
  WalletService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
  })),
}));

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let walletService: WalletService;

  beforeEach(() => {
    prisma = new PrismaService();
    walletService = new WalletService(prisma);
    userService = new UserService(prisma, walletService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        auth0_id: 'auth0|123456',
        username: 'username',
        email: 'email@test.com',
        avatar: 'http://your-avatar.com',
      };

      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 123,
        auth0_id: 'auth0|123456',
        username: 'username',
        email: 'email@test.com',
        avatar: 'http://your-avatar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      });

      const user = await userService.create(newUser);

      expect(walletService.create).toHaveBeenCalledWith(user.id);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
    });
  });

  describe('findOne', () => {
    it('should find a user by auth0_id', async () => {
      const auth0_id = 'auth0|123456';

      await userService.findOne(auth0_id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { auth0_id, active: true },
        include: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = {
        auth0_id: 'auth0|123456',
        username: 'username',
        avatar: 'http://your-new-avatar.com',
      };

      const { auth0_id, username, avatar } = updatedUser;

      await userService.update(updatedUser);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          auth0_id,
        },
        data: { username, avatar },
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedUser = { auth0_id: 'auth0|123456' };
      const { auth0_id } = deletedUser;

      await userService.delete(deletedUser);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { auth0_id, active: true },
        data: { active: false },
      });
    });
  });
});
