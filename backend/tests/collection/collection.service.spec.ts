import { TokenService } from '../../src/token/token.service';
import { PrismaService } from '../../src/database/prisma.service';
import { CollectionService } from '../../src/collection/collection.service';
import { RiskLevel } from '@prisma/client';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    collection: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    token: {
      updateMany: jest.fn(),
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
      const new_goal_amount = 25000;
      const new_initial_price = 12.5;

      const fundraising = {
        id: 1,
        goal_amount: 25000,
        current_amount: 0,
        prize_percentage: 40,
        risk_level: RiskLevel.LOW,
        active: true,
        player_id: 1,
        event_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.collection, 'findUnique').mockResolvedValue({
        id: 1,
        token_prize_percentage: 0.004,
        previous_token_prize_percentage: 0.004,
        amount_left: 1000,
        initial_amount: 1000,
        current_price: 25.0,
        previous_price: 25.0,
        fundraising_id: fundraising.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const collection = await prisma.collection.findUnique({
        where: { fundraising_id: fundraising.id },
      });

      const compensationRatio = collection.current_price / new_initial_price; // la proporción en este caso es (25 / 12.5) = 2

      const ownedTokens = collection.initial_amount - collection.amount_left;
      const recalculatedOwnedTokens = ownedTokens * compensationRatio;

      const recalculatedAmount = Math.ceil(new_goal_amount / new_initial_price);

      const recalculatedAmountLeft =
        recalculatedAmount - recalculatedOwnedTokens;

      const amountOfTokensToBeEmited =
        recalculatedAmount - collection.initial_amount;

      const recalculated_token_prize_percentage =
        fundraising.prize_percentage / 100 / recalculatedAmount;

      jest.spyOn(prisma.collection, 'update').mockResolvedValue({
        id: 1,
        token_prize_percentage: recalculated_token_prize_percentage,
        previous_token_prize_percentage: collection.token_prize_percentage,
        amount_left: recalculatedAmountLeft,
        initial_amount: recalculatedAmount,
        current_price: new_initial_price,
        previous_price: collection.current_price,
        fundraising_id: fundraising.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updatedCollection = await prisma.collection.update({
        where: {
          id: collection.id,
        },
        data: {
          initial_amount: recalculatedAmount,
          amount_left: recalculatedAmountLeft,
          previous_token_prize_percentage: collection.token_prize_percentage,
          token_prize_percentage: recalculated_token_prize_percentage,
          current_price: new_initial_price,
          previous_price: collection.current_price,
        },
      });

      await collectionService.update(
        new_goal_amount,
        new_initial_price,
        fundraising,
      );

      expect(prisma.token.updateMany).toHaveBeenCalledWith({
        where: { collection_id: collection.id },
        data: { price: new_initial_price },
      });

      expect(tokenService.emitNewTokens).toHaveBeenCalledWith({
        price: new_initial_price,
        amount: amountOfTokensToBeEmited,
        compensation_ratio: compensationRatio,
        collection_id: collection.id,
      });

      expect(updatedCollection.amount_left).toBe(recalculatedAmountLeft);
      expect(updatedCollection.initial_amount).toBe(recalculatedAmount);
      expect(updatedCollection.token_prize_percentage).toBe(
        recalculated_token_prize_percentage,
      );
      expect(updatedCollection.previous_token_prize_percentage).toBe(
        collection.token_prize_percentage,
      );
      expect(updatedCollection.previous_price).toBe(collection.current_price);
    });
  });
});
