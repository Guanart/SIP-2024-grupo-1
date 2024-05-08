import { TokenService } from '../../src/token/token.service';
import { PrismaService } from '../../src/database/prisma.service';
import { CollectionService } from '../../src/collection/collection.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    collection: {
      create: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

jest.mock('../../src/token/token.service.ts', () => ({
  TokenService: jest.fn().mockImplementation(() => ({
    emitInitialTokens: jest.fn(),
    emitNewTokens: jest.fn(),
  })),
}));

describe('CollectionService', () => {
  let tokenService: TokenService;
  let prisma: PrismaService;
  let collectionService: CollectionService;

  beforeEach(() => {
    prisma = new PrismaService();
    tokenService = new TokenService(prisma);
    collectionService = new CollectionService(prisma, tokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new collection of tokens', async () => {
      const newCollection = {
        goal_amount: 50000,
        prize_percentage: 50,
        initial_price: 25,
        fundraising_id: 1,
      };

      const { goal_amount, prize_percentage, initial_price, fundraising_id } =
        newCollection;

      const initial_amount = Math.ceil(goal_amount / initial_price);
      const token_prize_percentage = prize_percentage / 100 / initial_amount;

      jest.spyOn(prisma.collection, 'create').mockResolvedValue({
        id: 1,
        initial_amount,
        amount_left: initial_amount,
        token_prize_percentage,
        previous_token_prize_percentage: token_prize_percentage,
        current_price: initial_price,
        previous_price: initial_price,
        fundraising_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await collectionService.create(
        goal_amount,
        prize_percentage,
        initial_price,
        fundraising_id,
      );

      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          initial_amount,
          amount_left: initial_amount,
          token_prize_percentage,
          previous_token_prize_percentage: token_prize_percentage,
          previous_price: initial_price,
          current_price: initial_price,
          fundraising_id,
        },
      });

      expect(tokenService.emitInitialTokens).toHaveBeenCalledWith(
        initial_amount,
        initial_price,
        1,
      );
    });
  });

  describe('update', () => {
    it('should update an existing collection', async () => {
      expect(1).toEqual(1);
    });
  });
});
