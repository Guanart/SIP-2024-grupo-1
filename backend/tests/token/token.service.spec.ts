import { TokenService } from '../../src/token/token.service';
import { PrismaService } from '../../src/database/prisma.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    token: {
      createMany: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    token_wallet: {
      findMany: jest.fn(),
      create: jest.fn(),
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
      const options = {
        price: 12.5,
        amount: 1000,
        compensation_ratio: 2,
        collection_id: 1,
      };

      const data = Array.from({ length: options.amount }, () => ({
        price: options.price,
        collection_id: options.collection_id,
      }));

      jest.spyOn(prisma.token, 'createMany').mockResolvedValue({
        count: data.length,
      });

      jest.spyOn(prisma.token_wallet, 'findMany').mockResolvedValue([
        {
          token_id: 1,
          wallet_id: 1,
        },
      ]);

      jest.spyOn(prisma.token, 'findFirst').mockResolvedValue({
        id: 3,
        price: 12.5,
        collection_id: 1,
      });

      jest.spyOn(prisma.token_wallet, 'create').mockResolvedValue({
        wallet_id: 1,
        token_id: 3,
      });

      const count = await tokenService.emitNewTokens(options);

      expect(prisma.token.createMany).toHaveBeenCalledWith({ data });
      expect(count).toEqual(options.amount);
    });
  });

  describe('getMostValuableTokens', () => {
    it('should find the 5 most valuable tokens owned by a user', async () => {
      const wallet_id = 1;

      tokenService.getMostValuableTokens(wallet_id);

      expect(prisma.token_wallet.findMany).toHaveBeenCalled();
      expect(prisma.token_wallet.findMany).toHaveBeenCalledWith({
        where: { wallet_id },
        include: {
          token: {
            include: {
              collection: {
                include: {
                  fundraising: {
                    include: {
                      event: true,
                      player: { include: { user: true, game: true } },
                    },
                  },
                },
              },
            },
          },
        },
        take: 5,
        orderBy: {
          token: {
            price: 'desc',
          },
        },
      });
    });
  });
});
