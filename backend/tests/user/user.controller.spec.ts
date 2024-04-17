import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('CatsController', () => {
  let userController: UserController;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(() => {
    userService = new UserService(prisma);
    userController = new UserController(userService);
  });

  describe('create', () => {});
  describe('update', () => {});
  describe('find', () => {});
  describe('delete', () => {});

  it('It should pass', () => {
    expect(1).toBe(1);
  });
});
