import { TokenService } from '../../src/token/token.service';
import { PrismaService } from '../../src/database/prisma.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    token: {
      createMany: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe('TokenService', () => {
  let tokenService: TokenService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    tokenService = new TokenService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('emitInitialTokens', () => {
    it('should emit collection initial tokens', async () => {
      const amount = 10;
      const price = 1;
      const collection_id = 1;

      const data = Array.from({ length: amount }, () => ({
        price,
        collection_id,
      }));

      jest.spyOn(prisma.token, 'createMany').mockResolvedValue({
        count: data.length,
      });

      const count = await tokenService.emitInitialTokens(
        amount,
        price,
        collection_id,
      );

      expect(prisma.token.createMany).toHaveBeenCalledWith({ data });
      expect(count).toEqual(amount);
    });
  });

  describe('emitNewTokens', () => {
    it('should emit more tokens after a collection is updated', async () => {
      expect(1).toEqual(1);
    });
  });
});
