import { TokenService } from '../../src/token/token.service';
import { CollectionService } from '../../src/collection/collection.service';
import { PrismaService } from '../../src/database/prisma.service';
import { FundraisingService } from '../../src/fundraising/fundraising.service';
import { MercadoPagoService } from '../../src/mercado-pago/mercado-pago.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    fundraising: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));

jest.mock('../../src/collection/collection.service.ts', () => ({
  CollectionService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    update: jest.fn(),
  })),
}));

describe('FundraisingService', () => {
  let fundraisingService: FundraisingService;
  let collectionService: CollectionService;
  let mercadoPagoService: MercadoPagoService;
  let tokenService: TokenService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    mercadoPagoService = new MercadoPagoService();
    tokenService = new TokenService(prisma);
    collectionService = new CollectionService(prisma, tokenService);
    fundraisingService = new FundraisingService(
      prisma,
      mercadoPagoService,
      collectionService,
    );
    fundraisingService = new FundraisingService(
      prisma,
      mercadoPagoService,
      collectionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new fundraising', async () => {
      const newFundraising = {
        goal_amount: 50000,
        prize_percentage: 50,
        player_id: 1,
        event_id: 1,
        initial_price: 25,
      };

      const {
        goal_amount,
        prize_percentage,
        initial_price,
        event_id,
        player_id,
      } = newFundraising;

      jest.spyOn(prisma.fundraising, 'findMany').mockResolvedValue([]);

      jest.spyOn(prisma.fundraising, 'create').mockResolvedValue({
        id: 123,
        goal_amount: goal_amount,
        current_amount: 0,
        prize_percentage: prize_percentage,
        risk_level: 'LOW',
        active: true,
        player_id: player_id,
        event_id: event_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await fundraisingService.createFundraising(newFundraising);

      expect(collectionService.create).toHaveBeenCalledWith(
        goal_amount,
        prize_percentage,
        initial_price,
        123,
      );

      expect(prisma.fundraising.create).toHaveBeenCalledWith({
        data: {
          goal_amount: 50000,
          prize_percentage: 50,
          player_id: 1,
          event_id: 1,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing fundraising', async () => {
      const updatedFundraising = {
        initial_price: 12.5,
        goal_amount: 25000,
      };

      const currentFundraising = {
        id: 123,
        goal_amount: 25000,
        current_amount: 0,
        prize_percentage: 40,
        risk_level: 'LOW',
      };

      const { goal_amount } = updatedFundraising;

      jest.spyOn(prisma.fundraising, 'update').mockResolvedValue({
        id: 123,
        goal_amount: 25000,
        current_amount: 0,
        prize_percentage: 40,
        risk_level: 'LOW',
        active: true,
        player_id: 1,
        event_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await fundraisingService.updateFundraising(
        updatedFundraising,
        currentFundraising,
      );

      expect(prisma.fundraising.update).toHaveBeenCalledWith({
        where: { id: 123 },
        data: { goal_amount },
      });

      expect(collectionService.update).toHaveBeenCalledWith(25000, 12.5, {
        active: true,
        createdAt: expect.any(Date),
        current_amount: 0,
        event_id: 1,
        goal_amount: 25000,
        id: 123,
        player_id: 1,
        prize_percentage: 40,
        risk_level: 'LOW',
        updatedAt: expect.any(Date),
      });
    });
  });
});
