import { TokenService } from '../../src/token/token.service';
import { CollectionService } from '../../src/collection/collection.service';
import { PrismaService } from '../../src/database/prisma.service';
import { FundraisingService } from '../../src/fundraising/fundraising.service';
import { MercadoPagoService } from '../../src/mercado-pago/mercado-pago.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    fundraising: {
      create: jest.fn(),
    },
  })),
}));

jest.mock('../../src/collection/collection.service.ts', () => ({
  CollectionService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
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
});
