import { UserService } from '../../src/user/user.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('CatsController', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(() => {
    userService = new UserService(prisma);
  });

  describe('create', () => {});
  describe('update', () => {});
  describe('find', () => {});
  describe('delete', () => {});

  it('It should pass', () => {
    expect(1).toBe(1);
  });
});
